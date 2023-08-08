import { ethers } from 'ethers';
import { contractConfig } from '../contracts';
import { getNumber } from './utils';

export type AirdropInfo = {
  isWithdrawable: number;
  participantCount: number;
  totalSupply: number;
  balanceLfxToken: number;
  maxParticipant: number;
  maxTotalSupply: number;
  minDepositAmount: number;
  maxDepositAmount: number;
  initTimestamp: number;
  estLfxReceivePerFtm: number;
};

class LfxAirdropClass {
  provider: ethers.Provider;
  contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.WebSocketProvider(
      process.env.GATSBY_ETHER_WSS_URL
    );

    this.contract = new ethers.Contract(
      contractConfig.LfxAirdrop.Token,
      contractConfig.ArtifactLfxAirdrop.abi,
      this.provider
    );
  }

  getInformation = async (): Promise<AirdropInfo> => {
    const [
      isWithdrawable,
      participantCount,
      totalSupply,
      balanceLfxToken,
      maxParticipant,
      maxTotalSupply,
      minDepositAmount,
      maxDepositAmount,
      initTimestamp,
    ] = await this.contract.getInformation();
    const totalSupplyNumber = getNumber(totalSupply, 15) / 1000;
    const balanceLfxTokenNumber = getNumber(balanceLfxToken, 15) / 1000;

    return {
      isWithdrawable,
      participantCount: getNumber(participantCount, 0),
      maxParticipant: getNumber(maxParticipant, 0),
      totalSupply: totalSupplyNumber,
      balanceLfxToken: balanceLfxTokenNumber,
      estLfxReceivePerFtm:
        !balanceLfxTokenNumber || !totalSupplyNumber
          ? 0
          : balanceLfxTokenNumber / totalSupplyNumber,
      maxTotalSupply: getNumber(maxTotalSupply, 15) / 1000,
      minDepositAmount: getNumber(minDepositAmount, 15) / 1000,
      maxDepositAmount: getNumber(maxDepositAmount, 15) / 1000,
      initTimestamp: getNumber(initTimestamp, 0),
    };
  };

  balanceOf = async (address: string) => {
    const balance = await this.contract.balanceOf(address);
    return getNumber(balance, 15) / 1000;
  };
}

export const LfxAirdrop = new LfxAirdropClass();
