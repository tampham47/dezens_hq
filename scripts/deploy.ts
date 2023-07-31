import { ethers } from 'hardhat';
import { saveContractAddress } from './utils/saveContractAddress';
import { config } from './config';

async function main() {
  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    'Deploying the contracts with the account:',
    await deployer.getAddress()
  );
  console.log('Config', config);

  const lfxTotalSupply = config.lfxToken.lfxTotalSupply;
  const lfxTokenContract = await ethers.getContractFactory('LFX');
  const lfxToken = await lfxTokenContract.deploy(lfxTotalSupply);
  const lfxTokenAddress = await lfxToken.getAddress();
  await lfxToken.waitForDeployment();

  // LFX Airdrop
  const LfxAirdropContract = await ethers.getContractFactory('LfxAirdrop');
  const lfxAirdrop = await LfxAirdropContract.deploy(
    lfxTokenAddress,
    config.lfxAirdrop.maxParticipant,
    config.lfxAirdrop.maxTotalSupply,
    config.lfxAirdrop.minDepositAmount,
    config.lfxAirdrop.maxDepositAmount
  );
  const lfxAirdropAddress = await lfxAirdrop.getAddress();

  // LFX Vault
  const LfxVault = await ethers.getContractFactory('LfxVault');
  const lfxVault = await LfxVault.deploy(lfxTokenAddress);
  const lfxVaultAddress = await lfxVault.getAddress();
  await lfxVault.waitForDeployment();

  // Lotte App
  const ticketPrice = config.lfxLotte.ticketPrice;
  const minDrawDuration = config.lfxLotte.minDrawDuration;
  const Lotte = await ethers.getContractFactory('Lotte');
  const lotte = await Lotte.deploy(
    lfxTokenAddress,
    lfxVaultAddress,
    ticketPrice,
    minDrawDuration,
    config.lfxLotte.systemFeeRate,
    config.lfxLotte.drawFeeRate,
    config.lfxLotte.burnRate,
    config.lfxLotte.refRateLayer1,
    config.lfxLotte.refRateLayer2,
    config.lfxLotte.refRateLayer3
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
