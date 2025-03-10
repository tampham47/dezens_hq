import { ethers } from 'ethers';
import { contractConfig } from '../contracts';
import { provider } from './provider';

class DezRefsClass {
  provider: ethers.Provider;
  contract: ethers.Contract;

  constructor() {
    this.provider = provider;

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
