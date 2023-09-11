import LocalLfx from './local/LFX.json';
import LocalLfxAirdrop from './local/LfxAirdrop.json';
import LocalLfxVault from './local/LfxVault.json';
import LocalLotte from './local/Lotte.json';
import LocalDezRefs from './local/DezRefs.json';
import LocalDezMM from './local/DezMM.json';

import FtmTestnetLfx from './ftm-testnet/LFX.json';
import FtmTestnetLfxAirdrop from './ftm-testnet/LfxAirdrop.json';
import FtmTestnetLfxVault from './ftm-testnet/LfxVault.json';
import FtmTestnetLotte from './ftm-testnet/Lotte.json';
import FtmTestnetDezRefs from './ftm-testnet/DezRefs.json';
import FtmTestnetDezMM from './ftm-testnet/DezMM.json';

import FtmLfx from './ftm/LFX.json';
import FtmLfxAirdrop from './ftm/LfxAirdrop.json';
import FtmLfxVault from './ftm/LfxVault.json';
import FtmLotte from './ftm/Lotte.json';
import FtmDezRefs from './ftm/DezRefs.json';
import FtmDezMM from './ftm/DezMM.json';

export const getContractConfig = () => {
  if (process.env.NODE_ENV === 'local') {
    return {
      Lfx: LocalLfx,
      LfxAirdrop: LocalLfxAirdrop,
      LfxVault: LocalLfxVault,
      Lotte: LocalLotte,
      DezMM: LocalDezMM,
      DezRefs: LocalDezRefs,
    };
  }

  if (process.env.NODE_ENV === 'ftm-testnet') {
    return {
      Lfx: FtmTestnetLfx,
      LfxAirdrop: FtmTestnetLfxAirdrop,
      LfxVault: FtmTestnetLfxVault,
      Lotte: FtmTestnetLotte,
      DezRefs: FtmTestnetDezRefs,
      DezMM: FtmTestnetDezMM,
    };
  }

  if (process.env.NODE_ENV === 'ftm') {
    return {
      Lfx: FtmLfx,
      LfxAirdrop: FtmLfxAirdrop,
      LfxVault: FtmLfxVault,
      Lotte: FtmLotte,
      DezRefs: FtmDezRefs,
      DezMM: FtmDezMM,
    };
  }

  throw new Error('Invalid NODE_ENV');
};

export const contractConfig = getContractConfig();
