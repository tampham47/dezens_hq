import {
  time,
  loadFixture,
} from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

const provider = ethers.provider;
const lamports = BigInt(1e18);

const deployContract = async () => {
  // Contracts are deployed using the first signer/account by default
  const [owner, wallet0, wallet1, wallet2, wallet3, wallet4] =
    await ethers.getSigners();

  const lfxTotalSupply = 100000;
  const LfxContract = await ethers.getContractFactory('LFX', owner);
  const lfx = await LfxContract.deploy(lfxTotalSupply);
  const lfxTokenAddress = await lfx.getAddress();

  const LfxAirdropContract = await ethers.getContractFactory(
    'LfxAirdrop',
    owner
  );
  const lfxAirdrop = await LfxAirdropContract.deploy(
    lfxTokenAddress,
    2,
    100,
    1,
    100
  );
  const lfxAirdropAddress = await lfxAirdrop.getAddress();

  // owner inits with 5000 LFX
  // owner transfers 4000 LFX to wallet1
  // owner transfers 1000 LFX to wallet2
  await lfx.connect(owner).transfer(wallet1.address, 25000);
  await lfx.connect(owner).transfer(wallet2.address, 25000);

  return {
    lfx, // lfxToken
    lfxTokenAddress,
    lfxTotalSupply,
    lfxAirdrop,
    lfxAirdropAddress,
    owner,
    wallet0,
    wallet1,
    wallet2,
    wallet3,
    wallet4,
  };
};

describe('LfxAirdrop', () => {
  it('Should be able to deploy the contract', async () => {
    const blockTime = await time.latest();

    const { lfx, lfxTokenAddress, lfxAirdrop, wallet1, wallet2 } =
      await loadFixture(deployContract);

    expect(await lfx.balanceOf(wallet1.address)).to.equal(25000);
    expect(await lfx.balanceOf(wallet2.address)).to.equal(25000);

    expect(await lfxAirdrop.token()).to.equal(lfxTokenAddress);
    expect(await lfxAirdrop.totalSupply()).to.equal(0);
    expect(await lfxAirdrop.initTimestamp()).to.greaterThanOrEqual(blockTime);
    expect(await lfxAirdrop.maxParticipant()).to.equal(2);
    expect(await lfxAirdrop.isWithdrawable()).to.equal(false);
    expect((await lfxAirdrop.maxTotalSupply()) / lamports).to.equal(100);
    expect((await lfxAirdrop.minDepositAmount()) / lamports).to.equal(1);
    expect((await lfxAirdrop.maxDepositAmount()) / lamports).to.equal(100);
  });

  it('Should be able to join the airdrop', async () => {
    const { lfx, lfxAirdrop, lfxAirdropAddress, wallet1, wallet2, wallet3 } =
      await loadFixture(deployContract);

    expect(await provider.getBalance(wallet1)).to.equal(
      ethers.parseEther('10000.0')
    );

    expect(await lfxAirdrop.maxParticipant()).to.equal(2);
    expect((await lfxAirdrop.maxTotalSupply()) / lamports).to.equal(100);

    // send
    await expect(
      wallet1.sendTransaction({
        to: lfxAirdropAddress,
        value: ethers.parseEther('101'),
      })
    ).to.be.revertedWith('LfxAirdrop: Value must be in range');
    await wallet1.sendTransaction({
      to: lfxAirdropAddress,
      value: ethers.parseEther('50'),
    });
    expect(await lfxAirdrop.participantCount()).to.equal(1);
    expect((await provider.getBalance(lfxAirdropAddress)) / lamports).to.equal(
      50
    );
    expect((await lfxAirdrop.balanceOf(wallet1.address)) / lamports).to.equal(
      50
    );
    expect((await lfxAirdrop.totalSupply()) / lamports).to.equal(50);
    expect(await lfxAirdrop.isWithdrawable()).to.equal(false);

    // send
    await expect(
      wallet1.sendTransaction({
        to: lfxAirdropAddress,
        value: ethers.parseEther('50'),
      })
    ).to.be.revertedWith('LfxAirdrop: You have already deposited');
    expect((await provider.getBalance(lfxAirdropAddress)) / lamports).to.equal(
      50
    );
    expect((await lfxAirdrop.balanceOf(wallet1.address)) / lamports).to.equal(
      50
    );
    expect((await lfxAirdrop.totalSupply()) / lamports).to.equal(50);
    expect(await lfxAirdrop.participantCount()).to.equal(1);
    expect(await lfxAirdrop.isWithdrawable()).to.equal(false);

    // send
    await wallet2.sendTransaction({
      to: lfxAirdropAddress,
      value: ethers.parseEther('50'),
    });
    await lfx.connect(wallet1).transfer(lfxAirdropAddress, 10000);

    expect(await lfx.balanceOf(wallet1.address)).to.equals(15000);
    expect(await lfx.balanceOf(lfxAirdropAddress)).to.equals(10000);
    expect((await provider.getBalance(lfxAirdropAddress)) / lamports).to.equal(
      100
    );
    expect((await lfxAirdrop.balanceOf(wallet2.address)) / lamports).to.equal(
      50
    );
    expect((await lfxAirdrop.totalSupply()) / lamports).to.equal(100);
    expect(await lfxAirdrop.participantCount()).to.equal(2);
    expect(await lfxAirdrop.isWithdrawable()).to.equal(true);

    // send
    await expect(
      wallet3.sendTransaction({
        to: lfxAirdropAddress,
        value: ethers.parseEther('50'),
      })
    ).to.be.revertedWith('LfxAirdrop: The airdrop is already finished');

    // witdraw
    await lfxAirdrop.connect(wallet1).withdraw();
    await lfxAirdrop.connect(wallet2).withdraw();
    expect(await lfx.balanceOf(wallet1.address)).to.equals(20000);
    expect(await lfx.balanceOf(wallet2.address)).to.equals(30000);
    expect(await provider.getBalance(lfxAirdropAddress)).to.equal(0);
  });

  it('should be able to call getInformation', async () => {
    const { lfx, lfxAirdrop, lfxAirdropAddress, wallet1, wallet2, wallet3 } =
      await loadFixture(deployContract);

    expect(await provider.getBalance(wallet1)).to.equal(
      ethers.parseEther('10000.0')
    );

    expect(await lfxAirdrop.maxParticipant()).to.equal(2);
    expect((await lfxAirdrop.maxTotalSupply()) / lamports).to.equal(100);

    // send
    await wallet1.sendTransaction({
      to: lfxAirdropAddress,
      value: ethers.parseEther('50'),
    });
    let [
      isWithdrawable,
      participantCount,
      totalSupply,
      totalLfxToken,
      maxParticipant,
      maxTotalSupply,
      minDepositAmount,
      maxDepositAmount
    ] = await lfxAirdrop.getInformation();
    expect(isWithdrawable).to.equal(false);
    expect(maxParticipant).to.equal(2);
    expect(participantCount).to.equal(1);
    expect(maxTotalSupply / lamports).to.equal(100);
    expect(totalSupply / lamports).to.equal(50);
    expect(minDepositAmount / lamports).to.equal(1);
    expect(maxDepositAmount / lamports).to.equal(100);
    expect(totalLfxToken / lamports).to.equal(0);

    // send
    await wallet2.sendTransaction({
      to: lfxAirdropAddress,
      value: ethers.parseEther('50'),
    });
    await lfx.connect(wallet1).transfer(lfxAirdropAddress, 10000);

    expect(await lfx.balanceOf(wallet1.address)).to.equals(15000);
    expect(await lfx.balanceOf(lfxAirdropAddress)).to.equals(10000);
    expect((await provider.getBalance(lfxAirdropAddress)) / lamports).to.equal(
      100
    );
    expect((await lfxAirdrop.balanceOf(wallet2.address)) / lamports).to.equal(
      50
    );
    [
      isWithdrawable,
      participantCount,
      totalSupply,
      totalLfxToken,
      maxParticipant,
      maxTotalSupply,
      minDepositAmount,
      maxDepositAmount
    ] = await lfxAirdrop.getInformation();
    expect(isWithdrawable).to.equal(true);
    expect(participantCount).to.equal(2);
    expect(totalSupply / lamports).to.equal(100);
    expect(totalLfxToken).to.equal(10000);

    // send
    await expect(
      wallet3.sendTransaction({
        to: lfxAirdropAddress,
        value: ethers.parseEther('50'),
      })
    ).to.be.revertedWith('LfxAirdrop: The airdrop is already finished');

    // withdraw

    await expect(lfxAirdrop.connect(wallet1).withdraw())
      .to.emit(lfxAirdrop, 'Airdrop')
      .withArgs(wallet1.address, 5000);
    await expect(lfxAirdrop.connect(wallet2).withdraw())
      .to.emit(lfxAirdrop, 'Airdrop')
      .withArgs(wallet2.address, 5000);
    expect(await lfx.balanceOf(wallet1.address)).to.equals(20000);
    expect(await lfx.balanceOf(wallet2.address)).to.equals(30000);
    expect(await provider.getBalance(lfxAirdropAddress)).to.equal(0);
  });
});
