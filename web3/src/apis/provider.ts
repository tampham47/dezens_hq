import { ethers } from 'ethers';

export const provider = process.env.GATSBY_ETHER_WSS_URL
  ? new ethers.WebSocketProvider(process.env.GATSBY_ETHER_WSS_URL ?? '')
  : new ethers.JsonRpcProvider(process.env.GATSBY_ETHER_RPC_URL);
