import { Contract } from 'ethers';
import React, { useEffect } from 'react';
import { useWalletClient } from 'wagmi';

import { getContractConfig } from '../contracts';

export const Stake = () => {
  const { data: walletClient } = useWalletClient();
  const contractConfig = getContractConfig();

  useEffect(() => {
    if (!walletClient) return;

    (window as any).token = new Contract(
      contractConfig.Lfx.Token,
      contractConfig.ArtifactLfx.abi,
      walletClient as any
    );

    (window as any).contract = new Contract(
      contractConfig.LfxVault.Token,
      contractConfig.ArtifactLfxVault.abi,
      walletClient as any
    );
  }, [walletClient]);

  return <div>Stake</div>;
};
