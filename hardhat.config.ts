import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const {
  PRIVATE_KEY_01,
  PRIVATE_KEY_02,
  PRIVATE_KEY_03,
  PRIVATE_KEY_04,
  PRIVATE_KEY_05,
} = process.env;

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
      accounts: [
        `0x${PRIVATE_KEY_01}`,
        `0x${PRIVATE_KEY_02}`,
        `0x${PRIVATE_KEY_03}`,
        `0x${PRIVATE_KEY_04}`,
        `0x${PRIVATE_KEY_05}`,
      ],
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
