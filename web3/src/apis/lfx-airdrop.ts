import { ethers } from 'ethers';
import LfxAirdropContract from '../../../artifacts/contracts/LfxAirdrop.sol/LfxAirdrop.json';

class LfxAirdrop {
  provider: ethers.Provider;
  contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      'https://rpc.testnet.fantom.network'
    );

    this.contract = new ethers.Contract(
      '0x06fa88c6ea0cfdac66c1a9fbe8e918d306798d6b',
      LfxAirdropContract.abi,
      this.provider
    );
  }

  getParticipantsCount = async () => {
    return await this.contract.participantsCount();
  };

  getIsWithdrawable = async () => {
    return await this.contract.isWithdrawable();
  };

  getTotalSupply = async () => {
    return await this.contract.totalSupply();
  };

  getDepositAmount = async () => {
    return await this.contract.depositAmount();
  };
}

export default new LfxAirdrop();
