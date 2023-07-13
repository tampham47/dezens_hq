// @ts-nocheck

import { ethers } from 'hardhat';

async function main() {
  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    'Deploying the contracts with the account:',
    await deployer.getAddress()
  );

  const lfxTokenContract = await ethers.getContractFactory('LFX');
  const lfxToken = await lfxTokenContract.deploy(1);
  const lfxTokenAddress = await lfxToken.getAddress();
  await lfxToken.waitForDeployment();

  console.log('LFX Token deployed to:', lfxTokenAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
