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

  // DezRefs
  const DezRefsContract = await ethers.getContractFactory('DezRefs');
  const dezRefs = await DezRefsContract.deploy(
    config.dezRefs.refRateLayer1,
    config.dezRefs.refRateLayer2,
    config.dezRefs.refRateLayer3
  );
  const dezRefsAddress = await dezRefs.getAddress();
  await dezRefs.waitForDeployment();

  console.log('DezRefs Address   :', dezRefsAddress);

  saveContractAddress('DezRefs', dezRefsAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
