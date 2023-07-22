import { ethers } from 'ethers';
import { contractConfig } from '../contracts';

class LfxVault {
  provider: ethers.Provider;
  contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.GATSBY_FANTOM_RPC_URL
    );

    this.contract = new ethers.Contract(
      contractConfig.LfxVault.Token,
      contractConfig.ArtifactLfxVault.abi,
      this.provider
    );
  }
  
  getInformation = async () => {
    return await this.contract.getInformation();
  };
}

export default new LfxVault();
