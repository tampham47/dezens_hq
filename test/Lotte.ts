import {
  time,
  loadFixture,
} from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { constants } from '@openzeppelin/test-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

const provider = ethers.provider;

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
  const Lotte = await ethers.getContractFactory('Lotte', owner);
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

describe('Lotte: Purchase', function () {
  it('Should set the right owner', async () => {
    const {
      lotte,
      owner,
      lfxTokenAddress,
      lfxVaultAddress,
      lfx,
      wallet1,
      wallet2,
      wallet3,
    } = await loadFixture(deployContract);

    expect(await lotte.owner()).to.equal(owner.address);
    expect(await lotte.token()).to.equal(lfxTokenAddress);
    expect(await lotte.vaultAddress()).to.equal(lfxVaultAddress);

    expect(await lotte.ticketPrice()).to.equal(100);
    expect(await lotte.totalTicket()).to.equal(0);
    expect(await lotte.totalSupply()).to.equal(0);
    expect(await lotte.getTotalPot()).to.equal(0);

    expect(await lotte.systemFeeRate()).to.equal(280);
    expect(await lotte.refRateLayer1()).to.equal(70);
    expect(await lotte.refRateLayer2()).to.equal(30);
    expect(await lotte.refRateLayer3()).to.equal(20);

    expect(
      (await provider.getBalance(wallet3.address)) / BigInt(1e18)
    ).to.greaterThanOrEqual(9999);
    expect(await lfx.balanceOf(wallet1.address)).to.equal(50000);
    expect(await lfx.balanceOf(wallet2.address)).to.equal(50000);
  });

  it('Should be able to buy ticket', async () => {
    const { lotte, owner, wallet0, wallet1, lfx, lfxVaultAddress } =
      await loadFixture(deployContract);
    const lotteContractAddress = await lotte.getAddress();

    // wallet1 approve Lotte contract to spend 100 LFX
    await lfx.connect(wallet1).approve(lotteContractAddress, 10000);

    // set price to 100000, for easier testing
    expect(await lotte.connect(owner).setTicketPrice(10000)).to.ok;
    expect(await lotte.ticketPrice()).to.equal(10000);

    expect(await lfx.balanceOf(wallet1.address)).to.equal(50000);
    expect(await lotte.connect(wallet1).purchase([0], wallet0.address)).to.ok;
    expect(await lfx.balanceOf(wallet1.address)).to.equal(40000);

    expect(await lotte.totalTicket()).to.equal(1);
    expect(await lotte.totalSupply()).to.equal(10000);
    expect(await lotte.getTotalPot()).to.equal(9650);
    expect(await lotte.balanceOf(lfxVaultAddress)).to.equal(280);
    expect(await lotte.balanceOf(wallet0.address)).to.equal(70);
    expect(await lotte.ref(wallet1.address)).to.equal(wallet0.address);
    expect(9650 + 280 + 70).to.equal(10000);
  });

  it('Should be able to buy multiple times, ref fees should be credited for the referrer', async () => {
    const {
      lotte,
      lfx,
      lfxVaultAddress,
      owner,
      wallet0,
      wallet1,
      wallet2,
      wallet3,
      wallet4,
    } = await loadFixture(deployContract);
    const lotteContractAddress = await lotte.getAddress();

    await lfx.connect(wallet1).transfer(wallet3.address, 20000);
    await lfx.connect(wallet2).transfer(wallet4.address, 20000);

    // set price to 100000, for easier testing
    expect(await lotte.connect(owner).setTicketPrice(10000)).to.ok;
    expect(await lotte.ticketPrice()).to.equal(10000);

    expect(await lfx.balanceOf(wallet1.address)).to.equal(30000);
    expect(await lfx.balanceOf(wallet2.address)).to.equal(30000);
    expect(await lfx.balanceOf(wallet3.address)).to.equal(20000);
    expect(await lfx.balanceOf(wallet4.address)).to.equal(20000);

    // wallet1 approve Lotte contract to spend 100 LFX
    await lfx.connect(wallet1).approve(lotteContractAddress, 10000);
    await lfx.connect(wallet2).approve(lotteContractAddress, 10000);
    await lfx.connect(wallet3).approve(lotteContractAddress, 10000);
    await lfx.connect(wallet4).approve(lotteContractAddress, 10000);

    // buy ticket 1
    expect(await lotte.connect(wallet1).purchase([0], wallet0.address)).to.ok;
    expect(await lotte.totalTicket()).to.equal(1);
    expect(await lotte.totalSupply()).to.equal(10000);
    expect(await lotte.getTotalPot()).to.equal(9650);
    expect(await lotte.balanceOf(lfxVaultAddress)).to.equal(280);
    expect(await lotte.ref(wallet1.address)).to.equal(wallet0.address);

    expect(await lotte.balanceOf(wallet0.address)).to.equal(70);
    expect(await lotte.balanceOf(wallet1.address)).to.equal(0);
    expect(await lotte.balanceOf(wallet2.address)).to.equal(0);
    expect(await lotte.balanceOf(wallet3.address)).to.equal(0);
    expect(await lotte.balanceOf(wallet4.address)).to.equal(0);
    expect(9650 + 280 + 70).to.equal(10000);

    // buy ticket 2
    expect(await lotte.connect(wallet2).purchase([0], wallet1.address)).to.ok;
    expect(await lotte.totalTicket()).to.equal(2);
    expect(await lotte.totalSupply()).to.equal(20000);
    expect(await lotte.getTotalPot()).to.equal(19270);
    expect(await lotte.balanceOf(lfxVaultAddress)).to.equal(560);
    expect(await lotte.ref(wallet1.address)).to.equal(wallet0.address);
    expect(await lotte.ref(wallet2.address)).to.equal(wallet1.address);
    expect(await lotte.balanceOf(wallet0.address)).to.equal(100);
    expect(await lotte.balanceOf(wallet1.address)).to.equal(70);
    expect(await lotte.balanceOf(wallet2.address)).to.equal(0);
    expect(await lotte.balanceOf(wallet3.address)).to.equal(0);
    expect(await lotte.balanceOf(wallet4.address)).to.equal(0);
    expect(19270 + 560 + 100 + 70).to.equal(20000);

    // buy ticket 3
    expect(await lotte.connect(wallet3).purchase([0], wallet2.address)).to.ok;
    expect(await lotte.totalTicket()).to.equal(3);
    expect(await lotte.totalSupply()).to.equal(30000);
    expect(await lotte.getTotalPot()).to.equal(28870);
    expect(await lotte.balanceOf(lfxVaultAddress)).to.equal(840);
    expect(await lotte.ref(wallet1.address)).to.equal(wallet0.address);
    expect(await lotte.ref(wallet2.address)).to.equal(wallet1.address);
    expect(await lotte.ref(wallet3.address)).to.equal(wallet2.address);
    expect(await lotte.balanceOf(wallet0.address)).to.equal(120);
    expect(await lotte.balanceOf(wallet1.address)).to.equal(100);
    expect(await lotte.balanceOf(wallet2.address)).to.equal(70);
    expect(await lotte.balanceOf(wallet3.address)).to.equal(0);
    expect(await lotte.balanceOf(wallet4.address)).to.equal(0);
    expect(28870 + 840 + 120 + 100 + 70).to.equal(30000);

    // buy ticket 4
    expect(await lotte.connect(wallet4).purchase([0], wallet3.address)).to.ok;
    expect(await lotte.totalTicket()).to.equal(4);
    expect(await lotte.totalSupply()).to.equal(40000);
    expect(await lotte.getTotalPot()).to.equal(38470);
    expect(await lotte.balanceOf(lfxVaultAddress)).to.equal(1120);
    expect(await lotte.ref(wallet1.address)).to.equal(wallet0.address);
    expect(await lotte.ref(wallet2.address)).to.equal(wallet1.address);
    expect(await lotte.ref(wallet3.address)).to.equal(wallet2.address);
    expect(await lotte.ref(wallet4.address)).to.equal(wallet3.address);
    expect(await lotte.balanceOf(wallet0.address)).to.equal(120);
    expect(await lotte.balanceOf(wallet1.address)).to.equal(120);
    expect(await lotte.balanceOf(wallet2.address)).to.equal(100);
    expect(await lotte.balanceOf(wallet3.address)).to.equal(70);
    expect(await lotte.balanceOf(wallet4.address)).to.equal(0);
    expect(38470 + 1120 + 120 + 120 + 100 + 70).to.equal(40000);
  });

  it('Should be able to purchase 2 tickets', async () => {
    const { lotte, lfx, owner, wallet0, wallet1 } = await loadFixture(
      deployContract
    );
    const lotteContractAddress = await lotte.getAddress();

    // set price to 100, for easier testing
    expect(await lotte.connect(owner).setTicketPrice(100)).to.ok;
    expect(await lotte.ticketPrice()).to.equal(100);

    expect(await lfx.balanceOf(wallet1.address)).to.equal(50000);

    // wallet1 approve Lotte contract to spend 100 LFX
    await lfx.connect(wallet1).approve(lotteContractAddress, 200);

    // buy ticket 1
    expect(await lotte.connect(wallet1).purchase([0, 1], wallet0.address)).to
      .ok;
    expect(await lotte.totalTicket()).to.equal(2);
    expect(await lotte.totalSupply()).to.equal(200);
    expect(await lfx.balanceOf(wallet1.address)).to.equal(49800);
  });

  it('Should revert when tickets is empty', async () => {
    const { lotte, lfx, owner, wallet0, wallet1 } = await loadFixture(
      deployContract
    );
    const lotteContractAddress = await lotte.getAddress();

    // set price to 100, for easier testing
    expect(await lotte.connect(owner).setTicketPrice(100)).to.ok;
    expect(await lotte.ticketPrice()).to.equal(100);

    expect(await lfx.balanceOf(wallet1.address)).to.equal(50000);

    // wallet1 approve Lotte contract to spend 100 LFX
    await lfx.connect(wallet1).approve(lotteContractAddress, 100);

    // buy ticket 1
    await expect(
      lotte.connect(wallet1).purchase([], wallet0.address)
    ).to.be.revertedWith('Lotte: ticket cannot be empty');
  });

  it('Should revert when tickets length > 7', async () => {
    const { lotte, lfx, owner, wallet0, wallet1 } = await loadFixture(
      deployContract
    );
    const lotteContractAddress = await lotte.getAddress();

    // set price to 100, for easier testing
    expect(await lotte.connect(owner).setTicketPrice(100)).to.ok;
    expect(await lotte.ticketPrice()).to.equal(100);

    expect(await lfx.balanceOf(wallet1.address)).to.equal(50000);

    // wallet1 approve Lotte contract to spend 100 LFX
    await lfx.connect(wallet1).approve(lotteContractAddress, 100);

    // buy ticket 1
    await expect(
      lotte
        .connect(wallet1)
        .purchase([0, 1, 2, 3, 4, 5, 6, 7, 8], wallet0.address)
    ).to.be.revertedWith('Lotte: ticket cannot be more than 7');
  });

  it('Should revert when ref address == signer', async () => {
    const { lotte, lfx, owner, wallet1 } = await loadFixture(deployContract);
    const lotteContractAddress = await lotte.getAddress();

    // set price to 100, for easier testing
    expect(await lotte.connect(owner).setTicketPrice(100)).to.ok;
    expect(await lotte.ticketPrice()).to.equal(100);

    expect(await lfx.balanceOf(wallet1.address)).to.equal(50000);

    // wallet1 approve Lotte contract to spend 100 LFX
    await lfx.connect(wallet1).approve(lotteContractAddress, 100);

    // buy ticket 1
    await expect(
      lotte.connect(wallet1).purchase([0], wallet1.address)
    ).to.be.revertedWith('Lotte: referrer cannot be yourself');
  });

  it('Should throw errors incase of insufficient balance', async () => {
    const { lotte, lfx, owner, wallet0, wallet1 } = await loadFixture(
      deployContract
    );
    const lotteContractAddress = await lotte.getAddress();

    // set price to 100, for easier testing
    expect(await lotte.connect(owner).setTicketPrice(100)).to.ok;
    expect(await lotte.ticketPrice()).to.equal(100);

    expect(await lfx.balanceOf(wallet1.address)).to.equal(50000);

    // wallet1 approve Lotte contract to spend 100 LFX
    await lfx.connect(wallet1).approve(lotteContractAddress, 100);

    // buy ticket 1
    await expect(
      lotte.connect(wallet1).purchase([1, 2], wallet0.address)
    ).to.be.revertedWith('ERC20: insufficient allowance');
  });

  it('Should not store Zero Address as ref', async () => {
    const { lotte, lfx, owner, wallet0, wallet1 } = await loadFixture(
      deployContract
    );
    const lotteContractAddress = await lotte.getAddress();

    // set price to 100, for easier testing
    expect(await lotte.connect(owner).setTicketPrice(100)).to.ok;
    expect(await lotte.ticketPrice()).to.equal(100);
    expect(await lfx.balanceOf(wallet1.address)).to.equal(50000);

    // wallet1 approve Lotte contract to spend 100 LFX
    await lfx.connect(wallet1).approve(lotteContractAddress, 1000);

    // buy ticket 1
    expect(await lotte.connect(wallet1).purchase([0], constants.ZERO_ADDRESS))
      .to.ok;
    expect(await lotte.ref(wallet1.address)).to.equal(constants.ZERO_ADDRESS);

    // buy ticket 2
    expect(await lotte.connect(wallet1).purchase([1], wallet0.address)).to.ok;
    expect(await lotte.ref(wallet1.address)).to.equal(wallet0.address);
  });

  it('Should not override the first ref', async () => {
    const { lotte, lfx, owner, wallet0, wallet1, wallet2, wallet3 } =
      await loadFixture(deployContract);
    const lotteContractAddress = await lotte.getAddress();

    // set price to 100, for easier testing
    expect(await lotte.connect(owner).setTicketPrice(100)).to.ok;
    expect(await lotte.ticketPrice()).to.equal(100);
    expect(await lfx.balanceOf(wallet1.address)).to.equal(50000);

    // wallet1 approve Lotte contract to spend 100 LFX
    await lfx.connect(wallet1).approve(lotteContractAddress, 1000);

    // buy ticket 1
    expect(await lotte.connect(wallet1).purchase([0], constants.ZERO_ADDRESS))
      .to.ok;
    expect(await lotte.ref(wallet1.address)).to.equal(constants.ZERO_ADDRESS);

    // buy ticket 2
    expect(await lotte.connect(wallet1).purchase([1], wallet0.address)).to.ok;
    expect(await lotte.ref(wallet1.address)).to.equal(wallet0.address);

    // buy ticket 3, doesn't override the first ref
    expect(await lotte.connect(wallet1).purchase([2], wallet2.address)).to.ok;
    expect(await lotte.ref(wallet1.address)).to.equal(wallet0.address);

    // buy ticket 3, doesn't override the first ref
    expect(await lotte.connect(wallet1).purchase([3], wallet3.address)).to.ok;
    expect(await lotte.ref(wallet1.address)).to.equal(wallet0.address);

    expect(await lotte.totalTicket()).to.equal(4);
    expect(await lfx.balanceOf(wallet1.address)).to.equal(49600);
  });
});

describe('Lotte: Withdraw', () => {
  it('Should revert if the account doesnot have enough money', async () => {
    const { lotte, lfx, owner, wallet0, wallet1 } = await loadFixture(
      deployContract
    );
    const lotteContractAddress = await lotte.getAddress();

    // set price to 100, for easier testing
    expect(await lotte.connect(owner).setTicketPrice(10000)).to.ok;
    expect(await lotte.ticketPrice()).to.equal(10000);
    expect(await lfx.balanceOf(wallet1.address)).to.equal(50000);

    // wallet1 approve Lotte contract to spend 100 LFX
    await lfx.connect(wallet1).approve(lotteContractAddress, 10000);

    await expect(lotte.connect(wallet0).withdraw(70)).to.be.revertedWith(
      'Lotte: not enough balance'
    );

    // buy ticket 1
    expect(await lotte.connect(wallet1).purchase([1], wallet0.address)).to.ok;
    expect(await lotte.ref(wallet1.address)).to.equal(wallet0.address);

    expect(await lfx.balanceOf(wallet0.address)).to.equal(0);
    expect(await lotte.balanceOf(wallet0.address)).to.equal(70);

    // try to withdraw 100 LFX, should fail
    await expect(lotte.connect(wallet0).withdraw(100)).to.be.revertedWith(
      'Lotte: not enough balance'
    );
    // the money are still there, since previous tx is reverted
    expect(await lotte.balanceOf(wallet0.address)).to.equal(70);

    expect(await lotte.connect(wallet0).withdraw(50)).to.ok;
    expect(await lotte.balanceOf(wallet0.address)).to.equal(20);
    expect(await lfx.balanceOf(wallet0.address)).to.equal(50);

    // try to withdraw 100 LFX, should fail
    await expect(lotte.connect(wallet0).withdraw(70)).to.be.revertedWith(
      'Lotte: not enough balance'
    );
    expect(await lotte.connect(wallet0).withdraw(20)).to.ok;
    expect(await lotte.balanceOf(wallet0.address)).to.equal(0);
    expect(await lfx.balanceOf(wallet0.address)).to.equal(70);
  });

  it('Should be able to withdraw if user has available money on the contract', async () => {
    const { lotte, lfx, owner, wallet0, wallet1 } = await loadFixture(
      deployContract
    );
    const lotteContractAddress = await lotte.getAddress();

    // set price to 100, for easier testing
    expect(await lotte.connect(owner).setTicketPrice(10000)).to.ok;
    expect(await lotte.ticketPrice()).to.equal(10000);
    expect(await lfx.balanceOf(wallet1.address)).to.equal(50000);

    // wallet1 approve Lotte contract to spend 100 LFX
    await lfx.connect(wallet1).approve(lotteContractAddress, 10000);

    // buy ticket 1
    expect(await lotte.connect(wallet1).purchase([1], wallet0.address)).to.ok;
    expect(await lotte.ref(wallet1.address)).to.equal(wallet0.address);

    expect(await lfx.balanceOf(wallet0.address)).to.equal(0);
    expect(await lotte.balanceOf(wallet0.address)).to.equal(70);
    expect(await lotte.connect(wallet0).withdraw(70)).to.ok;
    expect(await lfx.balanceOf(wallet0.address)).to.equal(70);
  });
});

describe('Lotte: Draw', () => {
  it('Should revert if it is not more than 24 hours from the last draw', async () => {
    const { lotte, validWithdrawTime, lfx, owner, wallet1 } = await loadFixture(
      deployContract
    );
    const lotteContractAddress = await lotte.getAddress();

    await expect(lotte.draw()).to.be.revertedWith(
      'Lotte: not enough time to draw'
    );

    // add 7s just for sure
    await time.increaseTo(validWithdrawTime + 7);
    await expect(lotte.draw()).to.be.revertedWith(
      'Lotte: total ticket should be more than 7'
    );

    // set price to 100, for easier testing
    expect(await lotte.connect(owner).setTicketPrice(100)).to.ok;
    expect(await lotte.ticketPrice()).to.equal(100);
    expect(await lfx.balanceOf(wallet1.address)).to.equal(50000);

    // wallet1 approve Lotte contract to spend 100 LFX
    await lfx.connect(wallet1).approve(lotteContractAddress, 1000);

    expect(
      await lotte
        .connect(wallet1)
        .purchase([0, 1, 2, 3, 4], constants.ZERO_ADDRESS)
    ).to.ok;
    expect(
      await lotte
        .connect(wallet1)
        .purchase([5, 6, 7, 8, 9], constants.ZERO_ADDRESS)
    ).to.ok;
    expect(await lotte.draw()).to.be;
  });

  it('Should return random number in range [0, 1440]', async () => {
    const { lotte } = await loadFixture(deployContract);
    expect(await lotte.getRandom())
      .to.greaterThanOrEqual(0)
      .lessThanOrEqual(1440);
    expect(await lotte.getRandom())
      .to.greaterThanOrEqual(0)
      .lessThanOrEqual(1440);
    expect(await lotte.getRandom())
      .to.greaterThanOrEqual(0)
      .lessThanOrEqual(1440);
    expect(await lotte.getRandom())
      .to.greaterThanOrEqual(0)
      .lessThanOrEqual(1440);
    expect(await lotte.getRandom())
      .to.greaterThanOrEqual(0)
      .lessThanOrEqual(1440);
    expect(await lotte.getRandom())
      .to.greaterThanOrEqual(0)
      .lessThanOrEqual(1440);
    expect(await lotte.getRandom())
      .to.greaterThanOrEqual(0)
      .lessThanOrEqual(1440);
    expect(await lotte.getRandom())
      .to.greaterThanOrEqual(0)
      .lessThanOrEqual(1440);
  });

  it('Should able to find winners', async () => {
    const { lotte, lfx, owner, wallet1, wallet2 } = await loadFixture(
      deployContract
    );
    const lotteContractAddress = await lotte.getAddress();

    // set price to 100, for easier testing
    expect(await lotte.connect(owner).setTicketPrice(100)).to.ok;
    expect(await lotte.ticketPrice()).to.equal(100);
    expect(await lfx.balanceOf(wallet1.address)).to.equal(50000);

    // wallet1 approve Lotte contract to spend 100 LFX
    await lfx.connect(wallet1).approve(lotteContractAddress, 1000);
    await lfx.connect(wallet2).approve(lotteContractAddress, 1000);

    expect(
      await lotte
        .connect(wallet1)
        .purchase([0, 1, 2, 3, 4], constants.ZERO_ADDRESS)
    ).to.ok;
    expect(
      await lotte.connect(wallet2).purchase([0, 5], constants.ZERO_ADDRESS)
    ).to.ok;

    // check address list
    const addressList = await lotte.getAddressListByTicketNumber(0);
    expect(addressList.length).to.equal(2);
    expect(addressList[0]).to.equal(wallet1.address);
    expect(addressList[1]).to.equal(wallet2.address);

    // check ticket number
    expect(await lotte.getAmountOfTicketByTicketNumber(0)).to.equal(2);
    expect(await lotte.getAmountOfTicketByTicketNumber(1)).to.equal(1);
    expect(await lotte.getAmountOfTicketByTicketNumber(5)).to.equal(1);
    expect((await lotte.getTicketListByAddress(owner.address)).length).to.equal(
      0
    );
    expect(
      (await lotte.getTicketListByAddress(wallet1.address)).length
    ).to.equal(5);
    expect(
      (await lotte.getTicketListByAddress(wallet2.address)).length
    ).to.equal(2);
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
        .purchase([0, 5, 6, 7, 8], constants.ZERO_ADDRESS)
    ).to.ok;

    // before drawing
    expect(await lotte.totalTicket()).to.equal(10);
    expect(await lotte.totalSupply()).to.equal(100000);
    expect(await lotte.balanceOf(lfxVaultAddress)).to.equal(2800);
    expect(await lfx.balanceOf(lfxVaultAddress)).to.equal(0);

    // after drawing
    const blockTime = validWithdrawTime + 7;
    expect(await lotte.lastDrawTime()).to.lessThanOrEqual(blockTime);

    await time.increaseTo(blockTime);
    expect(await lotte.connect(wallet1).draw()).to.be;
    expect(await lotte.lastDrawAddress()).to.equal(wallet1.address);
    expect(await lotte.lastDrawTime()).to.greaterThanOrEqual(blockTime);

    expect(await lotte.totalTicket()).to.equal(0);
    expect(await lotte.balanceOf(lfxVaultAddress)).to.equal(0);
    // vault should be receive 2800 LFX - 0.5% after burn
    expect(await lfx.balanceOf(lfxVaultAddress)).to.equal(2786);
    expect(await lfx.totalSupply()).to.equal(lfxTotalSupply - 14);
    expect((2800 * 0.5) / 100).to.equal(14);
    expect(2786 + 14).to.equal(2800);
  });
});
