import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

const provider = ethers.provider;

const deployContract = async () => {
  // Contracts are deployed using the first signer/account by default
  const [owner, wallet0, wallet1, wallet2, wallet3, wallet4] =
    await ethers.getSigners();

  const LfxContract = await ethers.getContractFactory('LFX', owner);
  const lfx = await LfxContract.deploy(100000);

  // owner inits with 5000 LFX
  // owner transfers 4000 LFX to wallet1
  // owner transfers 1000 LFX to wallet2
  await lfx.connect(owner).transfer(wallet1.address, 50000);
  await lfx.connect(owner).transfer(wallet2.address, 50000);

  return {
    lfx,
    owner,
    wallet0,
    wallet1,
    wallet2,
    wallet3,
    wallet4,
  };
};

describe('LfxToken', () => {
  it('Should be able to burn token', async () => {
    const { lfx, wallet0, wallet1, wallet2 } = await loadFixture(
      deployContract
    );

    expect(await lfx.balanceOf(wallet1.address)).to.equal(50000);
    expect(await lfx.balanceOf(wallet2.address)).to.equal(50000);

    await lfx.connect(wallet1).transfer(wallet0.address, 100);
    expect(await lfx.balanceOf(wallet0.address)).to.equal(100);
    expect(await lfx.balanceOf(wallet1.address)).to.equal(49900);
    expect(await lfx.balanceOf(wallet2.address)).to.equal(50000);

    await lfx.connect(wallet0).burn(100);
    expect(await lfx.balanceOf(wallet0.address)).to.equal(0);
    expect(await lfx.balanceOf(wallet1.address)).to.equal(49900);
    expect(await lfx.balanceOf(wallet2.address)).to.equal(50000);
  });

  it('Should be unable to burn token that you don have', async () => {
    const { lfx, wallet0, wallet1, wallet2 } = await loadFixture(
      deployContract
    );

    expect(await lfx.balanceOf(wallet1.address)).to.equal(50000);
    expect(await lfx.balanceOf(wallet2.address)).to.equal(50000);
    await expect(lfx.connect(wallet0).burn(100)).to.be.revertedWith(
      'ERC20: burn amount exceeds balance'
    );

    await lfx.connect(wallet1).transfer(wallet0.address, 100);
    expect(await lfx.connect(wallet0).burn(100)).to.ok;
  });
});
