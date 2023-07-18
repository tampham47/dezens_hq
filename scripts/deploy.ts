// @ts-nocheck

import { ethers } from 'hardhat';

async function main() {
  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    'Deploying the contracts with the account:',
    await deployer.getAddress()
  );

  const lfxTotalSupply = 21_000_000_000 * 1e18;
  const lfxTokenContract = await ethers.getContractFactory('LFX');
  const lfxToken = await lfxTokenContract.deploy(lfxTotalSupply);
  const lfxTokenAddress = await lfxToken.getAddress();
  await lfxToken.waitForDeployment();

  // LFX Vault
  const LfxVault = await ethers.getContractFactory('LfxVault');
  const lfxVault = await LfxVault.deploy(lfxTokenAddress);
  const lfxVaultAddress = await lfxVault.getAddress();
  await lfxVault.waitForDeployment();

  const LfxAirdropContract = await ethers.getContractFactory('LfxAirdrop');
  const lfxAirdrop = await LfxAirdropContract.deploy(
    lfxTokenAddress,
    2,
    100,
    1,
    100
  );
  const lfxAirdropAddress = await lfxAirdrop.getAddress();

  // Lotte App
  const Lotte = await ethers.getContractFactory('Lotte');
  const lotte = await Lotte.deploy(lfxTokenAddress, lfxVaultAddress);
  const lotteAddress = await lotte.getAddress();
  await lotte.waitForDeployment();

  console.log('LFX Token deployed to:', lfxTokenAddress);
  console.log('LFX Airdrop deployed to:', lfxAirdropAddress);
  console.log('LFX Vault deployed to:', lfxVaultAddress);
  console.log('Lotte App deployed to:', lotteAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
