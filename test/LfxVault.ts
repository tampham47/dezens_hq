import {
  time,
  loadFixture,
} from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

const aDayInSeconds = 86400;

const deployContract = async () => {
  // Contracts are deployed using the first signer/account by default
  const [owner, wallet0, wallet1, wallet2, wallet3, wallet4] =
    await ethers.getSigners();

  const lfxTotalSupply = 100000;
  const LfxContract = await ethers.getContractFactory('LFX', owner);
  const lfx = await LfxContract.deploy(lfxTotalSupply);
  const lfxTokenAddress = await lfx.getAddress();

  const LfxVaultContract = await ethers.getContractFactory('LfxVault', owner);
  const lfxVault = await LfxVaultContract.deploy(lfxTokenAddress);
  const lfxVaultAddress = await lfxVault.getAddress();

  // owner inits with 5000 LFX
  // owner transfers 4000 LFX to wallet1
  // owner transfers 1000 LFX to wallet2
  await lfx.connect(owner).transfer(wallet1.address, 25000);
  await lfx.connect(owner).transfer(wallet2.address, 25000);

  return {
    lfx, // lfxToken
    lfxTokenAddress,
    lfxTotalSupply,
    lfxVault,
    lfxVaultAddress,
    owner,
    wallet0,
    wallet1,
    wallet2,
    wallet3,
    wallet4,
  };
};

describe('LfxVault', () => {
  it('Should be able to deploy the contract', async () => {
    const blockTime = await time.latest();

    const { lfx, lfxVault, wallet1, wallet2 } = await loadFixture(
      deployContract
    );

    expect(await lfx.balanceOf(wallet1.address)).to.equal(25000);
    expect(await lfx.balanceOf(wallet2.address)).to.equal(25000);

    expect(await lfxVault.totalSupply()).to.equal(0);
    expect(await lfxVault.initTimestamp()).to.greaterThanOrEqual(blockTime);
  });

  it('Should be able to deposit LFX', async () => {
    const blockTime = await time.latest();
    const { lfx, lfxVault, lfxVaultAddress, wallet1, wallet2 } =
      await loadFixture(deployContract);

    // deposit 5000 LFX
    time.increaseTo(blockTime + 1000);
    await lfx.connect(wallet1).approve(lfxVaultAddress, 5000);
    await lfxVault.connect(wallet1).deposit(5000);

    expect(await lfx.balanceOf(wallet1.address)).to.equal(20000);
    expect(await lfx.balanceOf(lfxVaultAddress)).to.equal(5000);
    expect(await lfxVault.totalSupply()).to.equal(5000);

    expect(await lfxVault.balanceOf(wallet1.address)).to.equal(5000);
    expect(await lfxVault.avgDepositTs(wallet1.address)).to.greaterThanOrEqual(
      1000
    );

    // deposit 10000 LFX
    time.increaseTo(blockTime + 2000);
    await lfx.connect(wallet1).approve(lfxVaultAddress, 10000);
    await lfxVault.connect(wallet1).deposit(10000);

    expect(await lfx.balanceOf(wallet1.address)).to.equal(10000);
    expect(await lfx.balanceOf(lfxVaultAddress)).to.equal(15000);

    expect(await lfxVault.totalSupply()).to.equal(15000);
    expect(await lfxVault.balanceOf(wallet1.address)).to.equal(15000);
    expect(await lfxVault.avgDepositTs(wallet1.address))
      .to.greaterThan(1600)
      .lessThanOrEqual(1700);

    // transfer 2000 LFX to the vault
    time.increaseTo(blockTime + aDayInSeconds + 2500);
    await lfx.connect(wallet2).transfer(lfxVaultAddress, 2000);
    await lfxVault.connect(wallet1).withdraw(15000);

    const wallet1Balance = await lfx.balanceOf(wallet1.address);
    const vaultBalance = await lfx.balanceOf(lfxVaultAddress);
    const totalBalance = wallet1Balance + vaultBalance;

    expect(await lfxVault.balanceOf(wallet1.address)).to.equal(0);
    // there will be some leftover due to calculating timestamp
    // it's dynamic, hence it's hard to get the exact value
    expect(await lfx.balanceOf(wallet1.address)).to.greaterThan(1500);
    // 25000 from its wallet + 2000 from wallet2
    expect(totalBalance).to.equal(27000);
  });

  it('Should be able to perform well with multiple users', async () => {
    const {
      lfx,
      lfxVault,
      lfxVaultAddress,
      wallet0,
      wallet1,
      wallet2,
      wallet3,
      wallet4,
    } = await loadFixture(deployContract);

    const blockTime = await time.latest();

    await lfx.connect(wallet1).transfer(wallet0.address, 5000);
    await lfx.connect(wallet1).transfer(wallet3.address, 5000);
    await lfx.connect(wallet2).transfer(wallet0.address, 5000);
    await lfx.connect(wallet2).transfer(wallet4.address, 5000);

    expect(await lfx.balanceOf(wallet0.address)).to.equal(10000);
    expect(await lfx.balanceOf(wallet1.address)).to.equal(15000);
    expect(await lfx.balanceOf(wallet2.address)).to.equal(15000);
    expect(await lfx.balanceOf(wallet3.address)).to.equal(5000);
    expect(await lfx.balanceOf(wallet4.address)).to.equal(5000);

    await lfx.connect(wallet0).approve(lfxVaultAddress, 10000);
    await lfx.connect(wallet1).approve(lfxVaultAddress, 15000);
    await lfx.connect(wallet2).approve(lfxVaultAddress, 15000);
    await lfx.connect(wallet3).approve(lfxVaultAddress, 5000);
    await lfx.connect(wallet4).approve(lfxVaultAddress, 5000);

    // deposit
    time.increaseTo(blockTime + aDayInSeconds);
    await lfxVault.connect(wallet1).deposit(10000);
    await lfxVault.connect(wallet3).deposit(5000);
    // transfer yield
    await lfx.connect(wallet0).transfer(lfxVaultAddress, 2000);

    // deposit, after 7 days later
    time.increaseTo(blockTime + aDayInSeconds * 8); // 7+ 1
    await lfxVault.connect(wallet1).deposit(5000);
    await lfxVault.connect(wallet2).deposit(15000);
    await lfxVault.connect(wallet4).deposit(5000);
    // transfer yield
    await lfx.connect(wallet0).transfer(lfxVaultAddress, 8000);

    // deposit, after 15 days later
    time.increaseTo(blockTime + aDayInSeconds * 15); // 7 + 7 + 1
    expect(await lfxVault.totalSupply()).to.equal(40000);
    expect(await lfx.balanceOf(lfxVaultAddress)).to.equal(50000);
    expect(await lfxVault.balanceOf(wallet1.address)).to.equal(15000);
    expect(await lfxVault.balanceOf(wallet2.address)).to.equal(15000);
    expect(await lfxVault.balanceOf(wallet3.address)).to.equal(5000);
    expect(await lfxVault.balanceOf(wallet4.address)).to.equal(5000);

    // withdraw
    await lfxVault.connect(wallet1).withdraw(15000);
    await lfxVault.connect(wallet2).withdraw(15000);
    await lfxVault.connect(wallet3).withdraw(5000);
    await lfxVault.connect(wallet4).withdraw(5000);

    // wallet 1 should receive bigger share than wallet 2
    // wallet 3 should receive bigger share than wallet 4
    const wallet1Balance = await lfx.balanceOf(wallet1.address);
    const wallet2Balance = await lfx.balanceOf(wallet2.address);
    const wallet3Balance = await lfx.balanceOf(wallet3.address);
    const wallet4Balance = await lfx.balanceOf(wallet4.address);
    const walletVaultBalance = await lfx.balanceOf(lfxVaultAddress);

    expect(wallet1Balance).to.greaterThan(wallet2Balance);
    expect(wallet3Balance).to.greaterThan(wallet4Balance);
    expect(
      wallet1Balance +
        wallet2Balance +
        wallet3Balance +
        wallet4Balance +
        walletVaultBalance
    ).to.equal(50000);
  });

  it('Shouldnt able to withdraw if 24 hours does not pass', async () => {
    const blockTime = await time.latest();
    const { lfx, lfxVault, lfxVaultAddress, wallet1 } = await loadFixture(
      deployContract
    );

    expect(await lfx.balanceOf(wallet1.address)).to.equal(25000);

    // deposit 5000 LFX
    await lfx.connect(wallet1).approve(lfxVaultAddress, 5000);
    await lfxVault.connect(wallet1).deposit(5000);

    expect(await lfx.balanceOf(wallet1.address)).to.equal(20000);
    expect(await lfx.balanceOf(lfxVaultAddress)).to.equal(5000);
    expect(await lfxVault.totalSupply()).to.equal(5000);

    await expect(lfxVault.connect(wallet1).withdraw(5000)).to.be.revertedWith(
      'LfxVault: withdrawal is not allowed before 24 hours'
    );

    time.increaseTo(blockTime + aDayInSeconds + 1);
    expect(await lfxVault.connect(wallet1).withdraw(5000)).to.ok;
    expect(await lfxVault.balanceOf(wallet1.address)).to.equal(0);
    expect(await lfx.balanceOf(wallet1.address)).to.equal(25000);
  });
});
