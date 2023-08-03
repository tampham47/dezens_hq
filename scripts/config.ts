const e18 = BigInt(1e18);
const e15 = BigInt(1e15);

const CONFIG = {
  test: {
    name: 'test',
    lfxToken: {
      lfxTotalSupply: BigInt(21_000_000_000) * e18,
    },
    // maxTotalSupply = maxParticipant * maxDepositAmount / 2;
    // amount in ROOT token: ETH, MNT, BNB, etc.
    lfxAirdrop: {
      maxParticipant: 2,
      maxTotalSupply: BigInt(625000) * e15,
      minDepositAmount: BigInt(2500) * e15,
      maxDepositAmount: BigInt(25000) * e15,
    },
    lfxLotte: {
      ticketPrice: BigInt(10000) * e18,
      minDrawDuration: 60 * 60 * 1, // 1 hours
      systemFeeRate: 500, // 5% of ticket price
      drawFeeRate: 500, // 5% of system fees
      burnRate: 2000, // 20% system fees
      refRateLayer1: 120, // 1.2% of ticket price
      refRateLayer2: 55, // 0.55% of ticket price
      refRateLayer3: 25, // 0.25% of ticket price
    },
  },
  'polygon-test': {
    name: 'polygon-test',
    lfxToken: {
      lfxTotalSupply: BigInt(21_000_000_000) * e18,
    },
    // maxTotalSupply = maxParticipant * maxDepositAmount / 2;
    // amount in ROOT token: ETH, MNT, BNB, etc.
    lfxAirdrop: {
      maxParticipant: 2,
      maxTotalSupply: BigInt(25000) * e15,
      minDepositAmount: BigInt(1000) * e15,
      maxDepositAmount: BigInt(10000) * e15,
    },
    lfxLotte: {
      ticketPrice: BigInt(10000) * e18,
      minDrawDuration: 60 * 60 * 1, // 1 hours
      systemFeeRate: 500, // 5% of ticket price
      drawFeeRate: 500, // 5% of system fees
      burnRate: 2000, // 20% system fees
      refRateLayer1: 120, // 1.2% of ticket price
      refRateLayer2: 55, // 0.55% of ticket price
      refRateLayer3: 25, // 0.25% of ticket price
    },
  },
  polygon: {
    name: 'polygon',
    lfxToken: {
      lfxTotalSupply: BigInt(21_000_000_000) * e18,
    },
    // maxTotalSupply = maxParticipant * maxDepositAmount / 2;
    // amount in ROOT token: ETH, MNT, BNB, etc.
    lfxAirdrop: {
      maxParticipant: 2,
      maxTotalSupply: BigInt(250000) * e15,
      minDepositAmount: BigInt(1000) * e15,
      maxDepositAmount: BigInt(10000) * e15,
    },
    lfxLotte: {
      ticketPrice: BigInt(10000) * e18,
      minDrawDuration: 60 * 60 * 6, // 6 hours
      systemFeeRate: 500, // 5% of ticket price
      drawFeeRate: 500, // 5% of system fees
      burnRate: 2000, // 20% system fees
      refRateLayer1: 120, // 1.2% of ticket price
      refRateLayer2: 55, // 0.55% of ticket price
      refRateLayer3: 25, // 0.25% of ticket price
    },
  },
  mainnet: {
    name: 'mainnet',
    lfxToken: {
      lfxTotalSupply: BigInt(21_000_000_000) * e18,
    },
    // maxTotalSupply = maxParticipant * maxDepositAmount / 2;
    // amount in ROOT token: ETH, MNT, BNB, etc.
    lfxAirdrop: {
      maxParticipant: 2,
      maxTotalSupply: BigInt(625000) * e15,
      minDepositAmount: BigInt(2500) * e15,
      maxDepositAmount: BigInt(25000) * e15,
    },
    lfxLotte: {
      ticketPrice: BigInt(10000) * e18,
      minDrawDuration: 60 * 60 * 6, // 6 hours
      systemFeeRate: 500, // 5% of ticket price
      drawFeeRate: 500, // 5% of system fees
      burnRate: 2000, // 20% system fees
      refRateLayer1: 120, // 1.2% of ticket price
      refRateLayer2: 55, // 0.55% of ticket price
      refRateLayer3: 25, // 0.25% of ticket price
    },
  },
};

type ConfigNetwork = 'test' | 'polygon-test' | 'mainnet' | 'polygon';

const getConfig = () => {
  const env = (process.env.NODE_ENV as ConfigNetwork) || 'test';
  const config = CONFIG[env];
  return config || CONFIG.test;
};

export const config = getConfig();
