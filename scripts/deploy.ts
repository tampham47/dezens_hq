import { ethers } from 'hardhat';
import { saveContractAddress } from './utils/saveContractAddress';

async function main() {
  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    'Deploying the contracts with the account:',
    await deployer.getAddress()
  );

  const lfxTotalSupply = BigInt(21_000_000_000) * BigInt(1e18);
  const lfxTokenContract = await ethers.getContractFactory('LFX');
  const lfxToken = await lfxTokenContract.deploy(lfxTotalSupply);
  const lfxTokenAddress = await lfxToken.getAddress();
  await lfxToken.waitForDeployment();

  // LFX Airdrop
  const LfxAirdropContract = await ethers.getContractFactory('LfxAirdrop');
  const lfxAirdrop = await LfxAirdropContract.deploy(
    lfxTokenAddress,
    5,
    100,
    5,
    50
  );
  const lfxAirdropAddress = await lfxAirdrop.getAddress();

  // LFX Vault
  const LfxVault = await ethers.getContractFactory('LfxVault');
  const lfxVault = await LfxVault.deploy(lfxTokenAddress);
  const lfxVaultAddress = await lfxVault.getAddress();
  await lfxVault.waitForDeployment();

  // Lotte App
  const ticketPrice = BigInt(10000) * BigInt(1e18);
  const oneHoursInSeconds = 60 * 60;
  const Lotte = await ethers.getContractFactory('Lotte');
  const lotte = await Lotte.deploy(
    lfxTokenAddress,
    lfxVaultAddress,
    ticketPrice,
    oneHoursInSeconds,
    280,
    500,
    50,
    70,
    30,
    20
  );
  const lotteAddress = await lotte.getAddress();
  await lotte.waitForDeployment();

  console.log('LFX Token Address   :', lfxTokenAddress);
  console.log('LFX Airdrop Address :', lfxAirdropAddress);
  console.log('LFX Vault Address   :', lfxVaultAddress);
  console.log('Lotte App Address   :', lotteAddress);

  saveContractAddress('LFX', lfxTokenAddress);
  saveContractAddress('LfxAirdrop', lfxAirdropAddress);
  saveContractAddress('LfxVault', lfxVaultAddress);
  saveContractAddress('Lotte', lotteAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
