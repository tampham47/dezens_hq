import { ethers } from 'ethers';
import { contractConfig } from '../contracts';
import { getNumber } from './utils';
import { socketProvider } from './provider';

export type LotteInfo = {
  round: number;
  totalTicket: number;
  totalSupply: number;
  totalPot: number;
  systemFees: number;
  drawFees: number;
  burnAmount: number;
  lastDrawTimestamp: number;
  isDrawable: boolean;
};

export type LotteConfig = {
  minDrawDuration: number;
  ticketPrice: number;
  systemFeeRate: number;
  drawFeeRate: number;
  burnRate: number;
  refRateLayer1: number;
  refRateLayer2: number;
  refRateLayer3: number;
};

export type DrawInformation = {
  timestamp: number;
  winningNumber: number;
  winningAmount: number;
  winnerCount: number;
  winnerList: string[];
  actor: string;
};

class LfxLotteClass {
  provider: ethers.Provider;
  contract: ethers.Contract;

  constructor() {
    this.provider = socketProvider;

    this.contract = new ethers.Contract(
      contractConfig.Lotte.Token,
      contractConfig.ArtifactLotte.abi,
      this.provider
    );
  }

  getInformation = async (): Promise<LotteInfo> => {
    const [
      lastDrawTimestamp,
      round,
      isDrawable,
      totalTicket,
      totalSupply,
      totalPot,
      systemFees,
      drawFees,
      burnAmount,
    ] = await this.contract.getInformation();

    return {
      isDrawable,
      lastDrawTimestamp: getNumber(lastDrawTimestamp, 0),
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
    const minDrawDuration = await this.contract.minDrawDuration();

    return {
      ticketPrice: getNumber(ticketPrice, 18),
      systemFeeRate: getNumber(systemFeeRate, 0),
      drawFeeRate: getNumber(drawFeeRate, 0),
      burnRate: getNumber(burnRate, 0),
      refRateLayer1: getNumber(refRateLayer1, 0),
      refRateLayer2: getNumber(refRateLayer2, 0),
      refRateLayer3: getNumber(refRateLayer3, 0),
      minDrawDuration: getNumber(minDrawDuration, 0),
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

  getDrawByIndex = async (index: number): Promise<DrawInformation> => {
    const [
      timestamp,
      actor,
      winningNumber,
      winningAmount,
      winnerCount,
      winnerList,
    ] = await this.contract.drawData(index);
    console.log(
      'a',
      timestamp,
      actor,
      winningNumber,
      winningAmount,
      winnerCount,
      winnerList
    );

    return {
      actor,
      timestamp: getNumber(timestamp, 0),
      winningNumber: getNumber(winningNumber, 0),
      winningAmount: getNumber(winningAmount, 18),
      winnerCount: getNumber(winnerCount, 0),
      winnerList: winnerList ? Object.values(winnerList) : [],
    };
  };

  getLastDraw = async (): Promise<DrawInformation> => {
    const [
      timestamp,
      actor,
      winningNumber,
      winningAmount,
      winnerCount,
      winnerList,
    ] = await this.contract.getLastDraw();

    return {
      actor,
      timestamp: getNumber(timestamp, 0),
      winningNumber: getNumber(winningNumber, 0),
      winningAmount: getNumber(winningAmount, 18),
      winnerCount: getNumber(winnerCount, 0),
      winnerList: Object.values(winnerList),
    };
  };
}

export const LfxLotte = new LfxLotteClass();
