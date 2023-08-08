import { ethers } from 'ethers';
import { contractConfig } from '../contracts';
import { getNumber } from './utils';

export type VaultInfo = {
  totalSupply: number;
  vaultBalance: number;
  yieldPerTokenPerDay: number;
};

class LfxVaultClass {
  provider: ethers.Provider;
  contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.GATSBY_ETHER_RPC_URL
    );

    this.contract = new ethers.Contract(
      contractConfig.LfxVault.Token,
      contractConfig.ArtifactLfxVault.abi,
      this.provider
    );
  }

  getInformation = async () => {
    const [totalSupply, vaultBalance, yieldPerTokenPerDay] =
      await this.contract.getInformation();

    return {
      totalSupply: getNumber(totalSupply, 18),
      vaultBalance: getNumber(vaultBalance, 18),
      yieldPerTokenPerDay: getNumber(yieldPerTokenPerDay, 3) / 1000,
    };
  };

  balanceOf = async (address: string) => {
    const balance = await this.contract.balanceOf(address);
    return getNumber(balance, 18);
  };

  getTotalInterest = async (address: string) => {
    const interest = await this.contract.getTotalInterest(address);
    return getNumber(interest, 18);
  };
}

export const LfxVault = new LfxVaultClass();
