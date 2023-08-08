import { ethers } from 'hardhat';
import { saveContractAddress } from './utils/saveContractAddress';
import { contractConfig } from './addresses';

async function main() {
  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    'Deploying the contracts with the account:',
    await deployer.getAddress()
  );

  // LFX Vault
  const LfxVault = await ethers.getContractFactory('LfxVault');
  const lfxVault = await LfxVault.deploy(contractConfig.Lfx.Token);
  const lfxVaultAddress = await lfxVault.getAddress();
  await lfxVault.waitForDeployment();

  console.log('LFX Vault Address   :', lfxVaultAddress);

  saveContractAddress('LfxVault', lfxVaultAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
