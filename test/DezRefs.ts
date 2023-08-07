import {
  time,
  loadFixture,
} from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

const deployContract = async () => {
  // Contracts are deployed using the first signer/account by default
  const [owner, wallet0, wallet1, wallet2, wallet3, wallet4] =
    await ethers.getSigners();

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

  return {
    refs,
    refsAddress,
    refRateLayer1,
    refRateLayer2,
    refRateLayer3,
    owner,
    wallet0,
    wallet1,
    wallet2,
    wallet3,
    wallet4,
  };
};

describe('DezRefs', () => {
  it('owner functions only', async () => {
    const {
      refs,
      refRateLayer1,
      refRateLayer2,
      refRateLayer3,
      owner,
      wallet0,
    } = await loadFixture(deployContract);

    const fees = await refs.getRefFees();
    expect(fees[0]).to.equal(refRateLayer1);
    expect(fees[1]).to.equal(refRateLayer2);
    expect(fees[2]).to.equal(refRateLayer3);

    await expect(
      refs.connect(wallet0).setRefRateLayer1(100)
    ).to.be.revertedWith('not owner');
    await expect(
      refs.connect(wallet0).setRefRateLayer2(100)
    ).to.be.revertedWith('not owner');
    await expect(
      refs.connect(wallet0).setRefRateLayer3(100)
    ).to.be.revertedWith('not owner');

    expect(await refs.connect(owner).setRefRateLayer1(300)).to.be.ok;
    expect(await refs.connect(owner).setRefRateLayer2(200)).to.be.ok;
    expect(await refs.connect(owner).setRefRateLayer3(100)).to.be.ok;
    expect(await refs.refRateLayer1()).to.equal(300);
    expect(await refs.refRateLayer2()).to.equal(200);
    expect(await refs.refRateLayer3()).to.equal(100);
  });

  it('setRef', async () => {
    const { refs, owner, wallet0, wallet1, wallet2, wallet3 } =
      await loadFixture(deployContract);

    expect(await refs.connect(wallet0).setRef(wallet0.address, owner.address))
      .to.be.ok;
    expect(await refs.connect(wallet1).setRef(wallet1.address, wallet0.address))
      .to.be.ok;
    expect(await refs.connect(wallet2).setRef(wallet2.address, wallet1.address))
      .to.be.ok;
    await expect(
      refs.connect(owner).setRef(owner.address, wallet3.address)
    ).to.be.rejectedWith('root ref already set');
  });

  it('getRefLayers', async () => {
    const { refs, owner, wallet0, wallet1, wallet2, wallet3, wallet4 } =
      await loadFixture(deployContract);

    expect(await refs.connect(wallet0).setRef(wallet0.address, owner.address))
      .to.be.ok;
    expect(await refs.connect(wallet1).setRef(wallet1.address, wallet0.address))
      .to.be.ok;
    expect(await refs.connect(wallet2).setRef(wallet2.address, wallet1.address))
      .to.be.ok;
    expect(await refs.connect(wallet3).setRef(wallet3.address, wallet2.address))
      .to.be.ok;
    expect(await refs.connect(wallet4).setRef(wallet4.address, wallet3.address))
      .to.be.ok;
    await expect(
      refs.connect(owner).setRef(owner.address, wallet4.address)
    ).to.be.revertedWith('root ref already set');
    await expect(
      refs.connect(wallet1).setRef(wallet1.address, wallet4.address)
    ).to.be.revertedWith('root ref already set');

    let refLayers = await refs.getRefLayers(wallet2.address);
    expect(refLayers[0]).to.equal(wallet1.address);
    expect(refLayers[1]).to.equal(wallet0.address);
    expect(refLayers[2]).to.equal(owner.address);

    refLayers = await refs.getRefLayers(wallet4.address);
    expect(refLayers[0]).to.equal(wallet3.address);
    expect(refLayers[1]).to.equal(wallet2.address);
    expect(refLayers[2]).to.equal(wallet1.address);
  });
});
