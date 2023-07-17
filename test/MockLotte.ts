import {
  time,
  loadFixture,
} from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { constants } from '@openzeppelin/test-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

const deployContract = async () => {
  const NEXT_24_HOURS_IN_SECS = 24 * 60 * 60;
  const validWithdrawTime = (await time.latest()) + NEXT_24_HOURS_IN_SECS;

  // Contracts are deployed using the first signer/account by default
  const [owner, wallet0, wallet1, wallet2, wallet3, wallet4] =
    await ethers.getSigners();

  // LFX Token
  const lfxTotalSupply = 100000;
  const LfxContract = await ethers.getContractFactory('LFX', owner);
  const lfx = await LfxContract.deploy(lfxTotalSupply);
  const lfxTokenAddress = await lfx.getAddress();

  // LFX Vault
  const LfxVault = await ethers.getContractFactory('LfxVault', owner);
  const lfxVault = await LfxVault.deploy(lfxTokenAddress);
  const lfxVaultAddress = await lfxVault.getAddress();

  // Lotte App
  const Lotte = await ethers.getContractFactory('MockLotte', owner);
  const lotte = await Lotte.deploy(lfxTokenAddress, lfxVaultAddress);

  // owner inits with 5000 LFX
  // owner transfers 4000 LFX to wallet1
  // owner transfers 1000 LFX to wallet2
  await lfx.connect(owner).transfer(wallet1.address, 50000);
  await lfx.connect(owner).transfer(wallet2.address, 50000);

  return {
    lotte,
    validWithdrawTime,
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

describe('MockLotte: Draw Winner', () => {
  it('Should return random number in range [0, 1440]', async () => {
    const { lotte } = await loadFixture(deployContract);
    expect(await lotte.getRandom()).to.equals(11);
  });

  it('Should be able to return correct value', async () => {
    const {
      lotte,
      lfx,
      lfxTotalSupply,
      lfxVaultAddress,
      validWithdrawTime,
      owner,
      wallet1,
      wallet2,
    } = await loadFixture(deployContract);
    const lotteContractAddress = await lotte.getAddress();

    // set price to 100, for easier testing
    expect(await lotte.connect(owner).setTicketPrice(10000)).to.ok;
    expect(await lotte.ticketPrice()).to.equal(10000);
    expect(await lfx.balanceOf(wallet1.address)).to.equal(50000);

    // wallet1 approve Lotte contract to spend 100 LFX
    await lfx.connect(wallet1).approve(lotteContractAddress, 50000);
    await lfx.connect(wallet2).approve(lotteContractAddress, 50000);

    expect(
      await lotte
        .connect(wallet1)
        .purchase([0, 1, 2, 3, 4], constants.ZERO_ADDRESS)
    ).to.ok;
    expect(
      await lotte
        .connect(wallet2)
        .purchase([0, 5, 6, 7, 11], constants.ZERO_ADDRESS)
    ).to.ok;

    // before drawing
    expect(await lotte.totalTicket()).to.equal(10);
    expect(await lotte.totalSupply()).to.equal(100000);
    expect(await lotte.balanceOf(lfxVaultAddress)).to.equal(2800);
    expect(await lfx.balanceOf(lfxVaultAddress)).to.equal(0);

    // after drawing
    const blockTime = validWithdrawTime + 7;
    expect(await lotte.lastDrawTimestamp()).to.lessThanOrEqual(blockTime);

    await time.increaseTo(blockTime);
    expect(await lotte.connect(wallet1).draw()).to.be;
    expect(await lotte.lastDrawTimestamp()).to.greaterThanOrEqual(blockTime);

    const lastDraw = await lotte.getLastDraw();
    expect(lastDraw.winningNumber).to.equals(11);
    expect(lastDraw.winnerCount).to.equals(1);
    expect(lastDraw.winnerAmount).to.equals(97200);
    expect(lastDraw.winnerList[0]).to.equals(wallet2.address);

    expect(await lotte.totalTicket()).to.equal(0);
    expect(await lotte.balanceOf(lfxVaultAddress)).to.equal(0);
    // vault should be receive 2800 LFX - 0.5% after burn
    expect(await lfx.balanceOf(lfxVaultAddress)).to.equal(2786);
    expect(await lfx.totalSupply()).to.equal(lfxTotalSupply - 14);
    expect((2800 * 0.5) / 100).to.equal(14);
    expect(2786 + 14).to.equal(2800);
    expect(97200 + 2800).to.equals(100000);
  });

  it('Should be able to handle more than 1 winners', async () => {
    const {
      lotte,
      lfx,
      lfxTotalSupply,
      lfxVaultAddress,
      validWithdrawTime,
      owner,
      wallet1,
      wallet2,
    } = await loadFixture(deployContract);
    const lotteContractAddress = await lotte.getAddress();

    // set price to 100, for easier testing
    expect(await lotte.connect(owner).setTicketPrice(10000)).to.ok;
    expect(await lotte.ticketPrice()).to.equal(10000);
    expect(await lfx.balanceOf(wallet1.address)).to.equal(50000);

    // wallet1 approve Lotte contract to spend 100 LFX
    await lfx.connect(wallet1).approve(lotteContractAddress, 50000);
    await lfx.connect(wallet2).approve(lotteContractAddress, 50000);

    expect(
      await lotte
        .connect(wallet1)
        .purchase([0, 1, 2, 3, 11], constants.ZERO_ADDRESS)
    ).to.ok;
    expect(
      await lotte
        .connect(wallet2)
        .purchase([0, 5, 6, 7, 11], constants.ZERO_ADDRESS)
    ).to.ok;

    // before drawing
    expect(await lotte.totalTicket()).to.equal(10);
    expect(await lotte.totalSupply()).to.equal(100000);
    expect(await lotte.balanceOf(lfxVaultAddress)).to.equal(2800);
    expect(await lfx.balanceOf(lfxVaultAddress)).to.equal(0);

    // after drawing
    const blockTime = validWithdrawTime + 7;
    expect(await lotte.lastDrawTimestamp()).to.lessThanOrEqual(blockTime);

    await time.increaseTo(blockTime);
    expect(await lotte.connect(wallet1).draw()).to.be;
    expect(await lotte.lastDrawTimestamp()).to.greaterThanOrEqual(blockTime);

    const lastDraw = await lotte.getLastDraw();
    expect(lastDraw.winningNumber).to.equals(11);
    expect(lastDraw.winnerCount).to.equals(2);
    expect(lastDraw.winnerAmount).to.equals(48600);
    expect(lastDraw.winnerList[0]).to.equals(wallet1.address);
    expect(lastDraw.winnerList[1]).to.equals(wallet2.address);

    expect(await lotte.balanceOf(wallet1.address)).to.equals(48600);
    expect(await lotte.balanceOf(wallet2.address)).to.equals(48600);

    expect(await lotte.totalTicket()).to.equal(0);
    expect(await lotte.balanceOf(lfxVaultAddress)).to.equal(0);
    // vault should be receive 2800 LFX - 0.5% after burn
    expect(await lfx.balanceOf(lfxVaultAddress)).to.equal(2786);
    expect(await lfx.totalSupply()).to.equal(lfxTotalSupply - 14);
    expect((2800 * 0.5) / 100).to.equal(14);
    expect(2786 + 14).to.equal(2800);
    expect(97200 + 2800).to.equals(100000);

    // withdraw rewards to wallets
    expect(await lotte.connect(wallet1).withdraw(48600)).to.be.ok;
    expect(await lfx.balanceOf(wallet1.address)).to.equal(48600);
    expect(await lotte.connect(wallet2).withdraw(48600)).to.be.ok;
    expect(await lfx.balanceOf(wallet2.address)).to.equal(48600);
  });
});
