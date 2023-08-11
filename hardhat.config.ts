import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const { PRIVATE_KEY_01 } = process.env;

const config: HardhatUserConfig = {
  solidity: '0.8.18',
  etherscan: {
    apiKey: 'PVCGQQ6DWRWCX5YJ6KH5XK79HXIIGBBGAE',
  },
  networks: {
    'bsc-testnet': {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
      chainId: 97,
      accounts: [`0x${PRIVATE_KEY_01}`],
    },
    'ftm-testnet': {
      url: `https://rpc.testnet.fantom.network`,
      chainId: 4002,
      accounts: [`0x${PRIVATE_KEY_01}`],
    },
    'polygon-test': {
      url: `https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78`,
      chainId: 80001,
      accounts: [`0x${PRIVATE_KEY_01}`],
    },
    polygon: {
      url: `https://polygon-rpc.com`,
      chainId: 137,
      accounts: [`0x${PRIVATE_KEY_01}`],
    },
    bsc: {
      url: `https://bsc-dataseed.binance.org`,
      chainId: 56,
      accounts: [`0x${PRIVATE_KEY_01}`],
    },
    ftm: {
      url: `https://rpcapi.fantom.network`,
      chainId: 250,
      accounts: [`0x${PRIVATE_KEY_01}`],
    },
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
