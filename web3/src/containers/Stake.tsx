import { Contract } from 'ethers';
import React, { useEffect } from 'react';
import { useWalletClient } from 'wagmi';

import { contractConfig } from '../contracts';

export const Stake = () => {
  const { data: walletClient } = useWalletClient();
  console.log('Stake walletClient', walletClient);

  useEffect(() => {
    if (!walletClient) return;

    (window as any).lfx = new Contract(
      contractConfig.Lfx.Token,
      contractConfig.ArtifactLfx.abi,
      walletClient as any
    );

    (window as any).vault = new Contract(
      contractConfig.LfxVault.Token,
      contractConfig.ArtifactLfxVault.abi,
      walletClient as any
    );
  }, [walletClient]);

  return <div>Stake</div>;
};
