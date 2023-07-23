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

  // Lotte App
  const ticketPrice = BigInt(10000) * BigInt(1e18);
  const oneHoursInSeconds = 60 * 60;
  const Lotte = await ethers.getContractFactory('Lotte');
  const lotte = await Lotte.deploy(
    contractConfig.Lfx.Token,
    contractConfig.LfxVault.Token,
    ticketPrice,
    oneHoursInSeconds
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
