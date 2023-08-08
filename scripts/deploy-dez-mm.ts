import { ethers } from 'hardhat';
import { saveContractAddress } from './utils/saveContractAddress';
import { config } from './config';
import { contractConfig } from './addresses';

async function main() {
  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    'Deploying the contracts with the account:',
    await deployer.getAddress()
  );

  // DezRefs
  const DezMmContract = await ethers.getContractFactory('DezMM');
  const dezRefs = await DezMmContract.deploy(
    contractConfig.Lfx.Token,
    contractConfig.DezRefs?.Token || ethers.ZeroAddress,
    contractConfig.LfxVault.Token,
    config.dezMm.finalizeTs
  );
  const dezMmAddress = await dezRefs.getAddress();
  await dezRefs.waitForDeployment();

  console.log('DezMm Address   :', dezMmAddress);

  saveContractAddress('dezMM', dezMmAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
