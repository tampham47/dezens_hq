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
  const LfxLotteContract = await ethers.getContractFactory('DezMM');
  const lotte = await LfxLotteContract.attach(contractConfig.DezMM.Token);
  const tx = await lotte.setWinner(3);
  await tx.wait(1);

  console.log('Winner', await lotte.winner());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
