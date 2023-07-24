import { ethers } from 'hardhat';
import { saveContractAddress } from './utils/saveContractAddress';
import { contractConfig } from './addresses';
import { config } from './config';

async function main() {
  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    'Deploying the contracts with the account:',
    await deployer.getAddress()
  );

  // Lotte App
  const ticketPrice = config.lfxLotte.ticketPrice;
  const minDrawDuration = config.lfxLotte.minDrawDuration;
  const Lotte = await ethers.getContractFactory('Lotte');
  const lotte = await Lotte.deploy(
    contractConfig.Lfx.Token,
    contractConfig.LfxVault.Token,
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

  console.log('Lotte App Address   :', lotteAddress);

  saveContractAddress('Lotte', lotteAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
