import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

// address = 0x2747CD936FA13b293d3b6C98Eb3C5576Fb0EF5c5
const { PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: '0.8.18',
  networks: {
    // mainnet: {
    //   url: `https://rpcapi.fantom.network`,
    //   chainId: 250,
    //   accounts: [`0x${PRIVATE_KEY}`],
    // },
    // testnet: {
    //   url: `https://rpc.testnet.fantom.network`,
    //   chainId: 4002,
    //   accounts: [`0x${PRIVATE_KEY}`],
    // },
    localhost: {
      url: `http://127.0.0.1:8545`,
    },
    hardhat: {},
    coverage: {
      url: 'http://localhost:8555',
    },
  },
};

export default config;
