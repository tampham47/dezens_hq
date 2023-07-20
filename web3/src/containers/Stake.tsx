import { Contract } from 'ethers';
import React, { useEffect } from 'react';
import { useWalletClient } from 'wagmi';

import LfxVaultContract from '../../../artifacts/contracts/LfxVault.sol/LfxVault.json';
import LfxTokenContract from '../../../artifacts/contracts/LfxToken.sol/LFX.json';

export const Stake = () => {
  const { data: walletClient } = useWalletClient();
  console.log('config', walletClient);

  useEffect(() => {
    if (!walletClient) return;

    (window as any).token = new Contract(
      // '0xe7a0de033faccd82d2efa969b3007d1fde35bc14',
      '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      LfxTokenContract.abi,
      walletClient as any
    );

    (window as any).contract = new Contract(
      // '0xe7a0de033faccd82d2efa969b3007d1fde35bc14',
      '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      LfxVaultContract.abi,
      walletClient as any
    );
  }, [walletClient]);

  return <div>Stake</div>;
};
