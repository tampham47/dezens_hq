import { ethers } from 'hardhat';
import { config } from './config';
import { contractConfig } from './addresses';

async function main() {
  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    'Deploying the contracts with the account:',
    await deployer.getAddress()
  );
  console.log('Config', config);

  // LFX Airdrop
  const LfxLotteContract = await ethers.getContractFactory('Lotte');
  const lotte = await LfxLotteContract.attach(contractConfig.Lotte.Token);
  const tx = await lotte.setTicketPrice(BigInt(5000) * BigInt(1e18));
  await tx.wait(1);

  console.log('New Price', await lotte.ticketPrice());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
