import { ethers } from 'ethers';

export const rpcProvider = new ethers.JsonRpcProvider(
  process.env.GATSBY_ETHER_RPC_URL
);

export const socketProvider = new ethers.WebSocketProvider(
  process.env.GATSBY_ETHER_WSS_URL
);
