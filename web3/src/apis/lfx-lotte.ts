import { ethers } from 'ethers';
import { contractConfig } from '../contracts';
import { getNumber } from './utils';

export type LotteInfo = {
  round: number;
  totalTicket: number;
  totalSupply: number;
  totalPot: number;
  systemFees: number;
  drawFees: number;
  burnAmount: number;
};

export type LotteConfig = {
  ticketPrice: number;
  systemFeeRate: number;
  drawFeeRate: number;
  burnRate: number;
  refRateLayer1: number;
  refRateLayer2: number;
  refRateLayer3: number;
};

class LfxLotteClass {
  provider: ethers.Provider;
  contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.GATSBY_FANTOM_RPC_URL
    );

    this.contract = new ethers.Contract(
      contractConfig.Lotte.Token,
      contractConfig.ArtifactLotte.abi,
      this.provider
    );
  }

  getInformation = async (): Promise<LotteInfo> => {
    const [
      round,
      totalTicket,
      totalSupply,
      totalPot,
      systemFees,
      drawFees,
      burnAmount,
    ] = await this.contract.getInformation();

    return {
      round: getNumber(round, 0),
      totalTicket: getNumber(totalTicket, 0),
      totalSupply: getNumber(totalSupply, 18),
      totalPot: getNumber(totalPot, 18),
      systemFees: getNumber(systemFees, 18),
      drawFees: getNumber(drawFees, 18),
      burnAmount: getNumber(burnAmount, 18),
    };
  };

  getConfig = async (): Promise<LotteConfig> => {
    const [
      ticketPrice,
      systemFeeRate,
      drawFeeRate,
      burnRate,
      refRateLayer1,
      refRateLayer2,
      refRateLayer3,
    ] = await this.contract.getConfig();

    return {
      ticketPrice: getNumber(ticketPrice, 18),
      systemFeeRate: getNumber(systemFeeRate, 0),
      drawFeeRate: getNumber(drawFeeRate, 0),
      burnRate: getNumber(burnRate, 0),
      refRateLayer1: getNumber(refRateLayer1, 0),
      refRateLayer2: getNumber(refRateLayer2, 0),
      refRateLayer3: getNumber(refRateLayer3, 0),
    };
  };

  getTicketByAddress = async (address: string) => {
    const tickets = await this.contract.getTicketListByAddress(address);
    return Object.values(tickets).map((i: any) => getNumber(i, 0));
  };

  getRef = async (address: string) => {
    return await this.contract.ref(address);
  };

  balanceOf = async (address: string) => {
    const balance = await this.contract.balanceOf(address);
    return getNumber(balance, 18);
  };
}

export const LfxLotte = new LfxLotteClass();
