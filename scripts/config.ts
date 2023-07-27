const CONFIG = {
  test: {
    lfxToken: {
      lfxTotalSupply: BigInt(21_000_000_000) * BigInt(1e18),
    },
    // maxTotalSupply = maxParticipant * maxDepositAmount / 2;
    lfxAirdrop: {
      maxParticipant: 10,
      maxTotalSupply: 250,
      minDepositAmount: 5,
      maxDepositAmount: 50,
    },
    lfxLotte: {
      ticketPrice: BigInt(10000) * BigInt(1e18),
      minDrawDuration: 60 * 60 * 24, // 1 day
      systemFeeRate: 500, // 5% of ticket price
      drawFeeRate: 500, // 5% of system fees
      burnRate: 2000, // 20% system fees
      refRateLayer1: 120, // 1.2% of ticket price
      refRateLayer2: 55, // 0.55% of ticket price
      refRateLayer3: 25, // 0.25% of ticket price
    },
  },
  mainnet: {
    lfxToken: {
      lfxTotalSupply: BigInt(21_000_000_000) * BigInt(1e18),
    },
    // maxTotalSupply = maxParticipant * maxDepositAmount / 2;
    lfxAirdrop: {
      maxParticipant: 10,
      maxTotalSupply: 250,
      minDepositAmount: 5,
      maxDepositAmount: 50,
    },
    lfxLotte: {
      ticketPrice: BigInt(10000) * BigInt(1e18),
      minDrawDuration: 60 * 60 * 24, // 1 day
      systemFeeRate: 500, // 5% of ticket price
      drawFeeRate: 500, // 5% of system fees
      burnRate: 2000, // 20% system fees
      refRateLayer1: 120, // 1.2% of ticket price
      refRateLayer2: 55, // 0.55% of ticket price
      refRateLayer3: 25, // 0.25% of ticket price
    },
  },
};

const getConfig = () => {
  if (process.env.NODE_ENV === 'mainnet') {
    return CONFIG.mainnet;
  }

  return CONFIG.test;
};

export const config = getConfig();
