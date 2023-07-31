import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const { PRIVATE_KEY_01 } = process.env;

const config: HardhatUserConfig = {
  solidity: '0.8.18',
  networks: {
    mainnet: {
      url: `https://rpcapi.fantom.network`,
      chainId: 250,
      accounts: [`0x${PRIVATE_KEY_01}`],
    },
    testnet: {
      url: `https://rpc.testnet.fantom.network`,
      chainId: 4002,
      accounts: [`0x${PRIVATE_KEY_01}`],
    },
    arbgoerli: {
      url: `https://goerli-rollup.arbitrum.io/rpc`,
      chainId: 421613,
      accounts: [`0x${PRIVATE_KEY_01}`],
    },
    opgoerli: {
      url: `https://goerli.optimism.io`,
      chainId: 420,
      accounts: [`0x${PRIVATE_KEY_01}`],
    },
    'polygon-test': {
      url: `https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78`,
      chainId: 80001,
      accounts: [`0x${PRIVATE_KEY_01}`],
    },
    'mantle-test': {
      url: `https://rpc.testnet.mantle.xyz`,
      chainId: 5001,
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
