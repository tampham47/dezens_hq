import { ethers } from 'ethers';
import LfxVaultContract from '../../../artifacts/contracts/LfxVault.sol/LfxVault.json';

class LfxVault {
  provider: ethers.Provider;
  contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      'https://rpc.testnet.fantom.network'
    );

    this.contract = new ethers.Contract(
      '0xe7a0de033faccd82d2efa969b3007d1fde35bc14',
      LfxVaultContract.abi,
      this.provider
    );
  }

  deposit = async (amount: BigInt) => {
    return await this.contract.deposit(amount);
  };

  withdraw = async (amount: BigInt) => {
    return await this.contract.withdraw(amount);
  };
}

export default new LfxVault();
