import { ethers } from 'ethers';
import { contractConfig } from '../contracts';
import { getNumber } from './utils';

export type DezMmInformation = {
  finalizeTs: number;
  poolBalance: number;
  totalMusk: number;
  totalMark: number;
  betMusk: number;
  betMark: number;
  winner: number;
  prizes: number;
};

class DezMmClass {
  provider: ethers.Provider;
  contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.WebSocketProvider(
      process.env.GATSBY_ETHER_WSS_URL
    );
    
    this.contract = new ethers.Contract(
      contractConfig.DezMM.Token,
      contractConfig.ArtifactDezMM.abi,
      this.provider
    );
  }

  getInformation = async (address: string): Promise<DezMmInformation> => {
    const [
      finalizeTs,
      poolBalance,
      totalMusk,
      totalMark,
      betMusk,
      betMark,
      winner,
      prizes,
    ] = await this.contract.getInformation(address);

    return {
      finalizeTs: getNumber(finalizeTs, 0),
      poolBalance: getNumber(poolBalance, 18),
      totalMusk: getNumber(totalMusk, 18),
      totalMark: getNumber(totalMark, 18),
      betMusk: getNumber(betMusk, 18),
      betMark: getNumber(betMark, 18),
      winner: getNumber(winner, 0),
      prizes: getNumber(prizes, 18),
    };
  };
}

export const DezMM = new DezMmClass();
