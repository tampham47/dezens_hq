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

  // Lotte App
  const ticketPrice = BigInt(10000) * BigInt(1e18);
  const Lotte = await ethers.getContractFactory('Lotte');
  const lotte = await Lotte.deploy(
    contractConfig.Lfx.Token,
    lfxVaultAddress,
    ticketPrice
  );
  const lotteAddress = await lotte.getAddress();
  await lotte.waitForDeployment();

  console.log('LFX Vault Address   :', lfxVaultAddress);
  console.log('Lotte App Address   :', lotteAddress);

  saveContractAddress('LfxVault', lfxVaultAddress);
  saveContractAddress('Lotte', lotteAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
