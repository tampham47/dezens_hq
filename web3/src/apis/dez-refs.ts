import { ethers } from 'ethers';
import { contractConfig } from '../contracts';

class DezRefsClass {
  provider: ethers.Provider;
  contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.WebSocketProvider(
      process.env.GATSBY_ETHER_WSS_URL
    );

    this.contract = new ethers.Contract(
      contractConfig.DezRefs.Token,
      contractConfig.ArtifactDezRefs.abi,
      this.provider
    );
  }

  getRef = async (address: string) => {
    const ref = await this.contract.ref(address);
    if (ref !== ethers.ZeroAddress) {
      return ref;
    }
    return undefined;
  };
}

export const DezRefs = new DezRefsClass();
