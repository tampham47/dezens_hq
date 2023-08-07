import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

const provider = ethers.provider;

const deployContract = async () => {
  // Contracts are deployed using the first signer/account by default
  const [owner, wallet0, wallet1, wallet2, wallet3, wallet4, wallet5, wallet6] =
    await ethers.getSigners();

  const dezTotalSupply = 150000;
  const DezContract = await ethers.getContractFactory('LFX', owner);
  const dez = await DezContract.deploy(dezTotalSupply);
  const dezTokenAddress = await dez.getAddress();

  const refRateLayer1 = 120;
  const refRateLayer2 = 55;
  const refRateLayer3 = 25;
  const DezRefsContract = await ethers.getContractFactory('DezRefs', owner);
  const refs = await DezRefsContract.deploy(
    refRateLayer1,
    refRateLayer2,
    refRateLayer3
  );
  const refsAddress = await refs.getAddress();

  const DezVaultContract = await ethers.getContractFactory('LfxVault', owner);
  const dezVault = await DezVaultContract.deploy(dezTokenAddress);
  const dezVaultAddress = await dezVault.getAddress();

  const DezMmContract = await ethers.getContractFactory('DezMM', owner);
  const dezMm = await DezMmContract.deploy(
    dezTokenAddress,
    refsAddress,
    dezVaultAddress
  );
  const dezMmAddress = await dezMm.getAddress();

  // owner inits with 5000 dez
  // owner transfers 4000 dez to wallet1
  // owner transfers 1000 dez to wallet2
  await dez.connect(owner).transfer(wallet1.address, 25000);
  await dez.connect(owner).transfer(wallet2.address, 25000);
  await dez.connect(owner).transfer(wallet3.address, 25000);
  await dez.connect(owner).transfer(wallet4.address, 25000);
  await dez.connect(owner).transfer(wallet5.address, 25000);
  await dez.connect(owner).transfer(wallet6.address, 25000);

  return {
    dez, // dezToken
    refs,
    dezTokenAddress,
    dezTotalSupply,
    dezVaultAddress,
    dezMm,
    dezMmAddress,
    owner,
    wallet0,
    wallet1,
    wallet2,
    wallet3,
    wallet4,
    wallet5,
    wallet6,
  };
};

describe('DezMM', () => {
  it('owner functions only', async () => {
    const { dezMm, dezMmAddress, owner, wallet0 } = await loadFixture(
      deployContract
    );

    expect(await provider.getBalance(dezMmAddress)).to.equal(0);

    await expect(dezMm.connect(wallet0).setWinner(1)).to.be.rejectedWith(
      'caller is not the owner'
    );
    await expect(dezMm.connect(wallet0).setSystemFeeRate(1)).to.be.rejectedWith(
      'caller is not the owner'
    );
    await expect(
      dezMm.connect(wallet0).setSystemBurnRate(1)
    ).to.be.rejectedWith('caller is not the owner');

    expect(await dezMm.systemFeeRate()).to.equal(200);
    expect(await dezMm.systemBurnRate()).to.equal(200);

    await expect(dezMm.connect(owner).setWinner(0));
    await expect(dezMm.connect(owner).setWinner(3)).to.be.revertedWith(
      'invalid winner'
    );

    expect(await dezMm.connect(owner).setWinner(1)).to.be.ok;
    expect(await dezMm.connect(owner).setSystemFeeRate(250)).to.be.ok;
    expect(await dezMm.connect(owner).setSystemBurnRate(250)).to.be.ok;
    expect(await dezMm.systemFeeRate()).to.equal(250);
    expect(await dezMm.systemBurnRate()).to.equal(250);
    expect(await dezMm.winner()).to.equal(1);
    await expect(dezMm.connect(owner).setWinner(2)).to.be.revertedWith(
      'winner already decided'
    );
  });

  it('bet', async () => {
    const {
      dez,
      dezMm,
      dezMmAddress,
      dezVaultAddress,
      owner,
      wallet0,
      wallet1,
      wallet2,
      wallet3,
      wallet4,
    } = await loadFixture(deployContract);

    await dez.connect(wallet1).approve(dezMmAddress, 25000);
    await dez.connect(wallet2).approve(dezMmAddress, 25000);
    await dez.connect(wallet3).approve(dezMmAddress, 25000);
    await dez.connect(wallet4).approve(dezMmAddress, 25000);

    expect(await dez.balanceOf(wallet0.address)).to.equal(0);

    // bet 1
    expect(await dezMm.connect(wallet1).betOnMark(10000, wallet0.address)).to.be
      .ok;
    expect(await dez.balanceOf(wallet0.address)).to.equal(120);
    expect(await dez.balanceOf(wallet1.address)).to.equal(15000);

    // bet 2
    expect(await dezMm.connect(wallet2).betOnMark(10000, wallet1.address)).to.be
      .ok;
    expect(await dez.balanceOf(wallet0.address)).to.equal(175);
    expect(await dez.balanceOf(wallet1.address)).to.equal(15120);
    expect(await dez.balanceOf(wallet2.address)).to.equal(15000);

    // bet 3
    expect(await dezMm.connect(wallet3).betOnMark(10000, wallet2.address)).to.be
      .ok;
    expect(await dez.balanceOf(wallet0.address)).to.equal(200);
    expect(await dez.balanceOf(wallet1.address)).to.equal(15175);
    expect(await dez.balanceOf(wallet2.address)).to.equal(15120);
    expect(await dez.balanceOf(wallet3.address)).to.equal(15000);

    // bet 4
    expect(await dezMm.connect(wallet4).betOnMusk(10000, wallet0.address)).to.be
      .ok;
    expect(await dez.balanceOf(wallet0.address)).to.equal(320);
    expect(await dez.balanceOf(wallet4.address)).to.equal(15000);

    await expect(dezMm.connect(wallet4).withdraw()).to.be.revertedWith(
      'winner not decided'
    );

    // set winner
    expect(await dez.balanceOf(dezMmAddress)).to.equal(39385);
    expect(await dez.balanceOf(dezVaultAddress)).to.equal(0);
    expect(await dezMm.connect(owner).setWinner(1)).to.be.ok;

    const systemBurnRate = Number(await dezMm.systemBurnRate());
    const burnAmount = Math.floor((39385 * systemBurnRate) / 10000);
    expect(burnAmount).to.equal(787);
    expect(await dez.balanceOf(dezMmAddress)).to.equal(37811);
    expect(await dez.balanceOf(dezVaultAddress)).to.equal(787);
    expect(37811 + 787 + burnAmount).to.equal(39385);

    expect(await dezMm.getPrize(wallet1.address)).to.equal(0);
    expect(await dezMm.getPrize(wallet2.address)).to.equal(0);
    expect(await dezMm.getPrize(wallet3.address)).to.equal(0);
    expect(await dezMm.getPrize(wallet4.address)).to.equal(37811);

    await expect(dezMm.connect(wallet1).withdraw()).to.be.revertedWith(
      'not a winner'
    );
    expect(await dezMm.connect(wallet4).withdraw()).to.be.ok;
    expect(await dez.balanceOf(wallet4.address)).to.equal(52811);
    expect(37811 + 15000).to.equal(52811);
  });

  it('multiple winners', async () => {
    const {
      dez,
      dezMm,
      dezMmAddress,
      dezVaultAddress,
      owner,
      wallet0,
      wallet1,
      wallet2,
      wallet3,
      wallet4,
      wallet5,
    } = await loadFixture(deployContract);

    await dez.connect(wallet1).approve(dezMmAddress, 25000);
    await dez.connect(wallet2).approve(dezMmAddress, 25000);
    await dez.connect(wallet3).approve(dezMmAddress, 25000);
    await dez.connect(wallet4).approve(dezMmAddress, 25000);
    await dez.connect(wallet5).approve(dezMmAddress, 25000);

    expect(await dez.balanceOf(wallet0.address)).to.equal(0);

    // bet 1
    expect(await dezMm.connect(wallet1).betOnMark(10000, wallet0.address)).to.be
      .ok;
    expect(await dez.balanceOf(wallet0.address)).to.equal(120);
    expect(await dez.balanceOf(wallet1.address)).to.equal(15000);

    // bet 2
    expect(await dezMm.connect(wallet2).betOnMark(10000, wallet1.address)).to.be
      .ok;
    expect(await dez.balanceOf(wallet0.address)).to.equal(175);
    expect(await dez.balanceOf(wallet1.address)).to.equal(15120);
    expect(await dez.balanceOf(wallet2.address)).to.equal(15000);

    // bet 3
    expect(await dezMm.connect(wallet3).betOnMark(10000, wallet2.address)).to.be
      .ok;
    expect(await dez.balanceOf(wallet0.address)).to.equal(200);
    expect(await dez.balanceOf(wallet1.address)).to.equal(15175);
    expect(await dez.balanceOf(wallet2.address)).to.equal(15120);
    expect(await dez.balanceOf(wallet3.address)).to.equal(15000);

    // bet 4
    expect(await dezMm.connect(wallet4).betOnMusk(10000, wallet0.address)).to.be
      .ok;
    expect(await dez.balanceOf(wallet0.address)).to.equal(320);
    expect(await dez.balanceOf(wallet4.address)).to.equal(15000);

    // bet 5
    expect(await dezMm.connect(wallet5).betOnMusk(5000, wallet0.address)).to.be
      .ok;
    expect(await dez.balanceOf(wallet0.address)).to.equal(380);
    expect(await dez.balanceOf(wallet5.address)).to.equal(20000);

    await expect(dezMm.connect(wallet4).withdraw()).to.be.revertedWith(
      'winner not decided'
    );

    // set winner
    expect(await dez.balanceOf(dezMmAddress)).to.equal(44325);
    expect(await dez.balanceOf(dezVaultAddress)).to.equal(0);
    expect(await dezMm.connect(owner).setWinner(1)).to.be.ok;

    const systemBurnRate = Number(await dezMm.systemBurnRate());
    const burnAmount = Math.floor((44325 * systemBurnRate) / 10000);
    expect(burnAmount).to.equal(886);
    expect(await dez.balanceOf(dezMmAddress)).to.equal(42553);
    expect(await dez.balanceOf(dezVaultAddress)).to.equal(886);
    expect(42553 + 886 + burnAmount).to.equal(44325);

    expect(await dezMm.getPrize(wallet1.address)).to.equal(0);
    expect(await dezMm.getPrize(wallet2.address)).to.equal(0);
    expect(await dezMm.getPrize(wallet3.address)).to.equal(0);
    expect(await dezMm.getPrize(wallet4.address)).to.equal(28368);
    expect(await dezMm.getPrize(wallet5.address)).to.equal(14184);

    await expect(dezMm.connect(wallet1).withdraw()).to.be.revertedWith(
      'not a winner'
    );

    expect(await dezMm.connect(wallet4).withdraw()).to.be.ok;
    expect(await dez.balanceOf(wallet4.address)).to.equal(43368);
    expect(28368 + 15000).to.equal(43368);

    expect(await dezMm.connect(wallet5).withdraw()).to.be.ok;
    expect(await dez.balanceOf(wallet5.address)).to.equal(34185);
    expect(14184 + 20000).to.equal(34184);
  });
});
