import { ethers } from 'ethers';
import { contractConfig } from '../contracts';
import { getNumber } from './utils';

class LfxTokenClass {
  provider: ethers.Provider;
  contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.GATSBY_ETHER_RPC_URL
    );

    this.contract = new ethers.Contract(
      contractConfig.Lfx.Token,
      contractConfig.ArtifactLfx.abi,
      this.provider
    );
  }

  allowance = async (tokenOwner: string, spender: string) => {
    const interest = await this.contract.allowance(tokenOwner, spender);
    return getNumber(interest, 0);
  };
}

export const LfxToken = new LfxTokenClass();
