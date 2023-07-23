import LocalLfx from './local/LFX.json';
import LocalLfxAirdrop from './local/LfxAirdrop.json';
import LocalLfxVault from './local/LfxVault.json';
import LocalLotte from './local/Lotte.json';

import TestLfx from './test/LFX.json';
import TestLfxAirdrop from './test/LfxAirdrop.json';
import TestLfxVault from './test/LfxVault.json';
import TestLotte from './test/Lotte.json';

export const getContractConfig = () => {
  if (process.env.NODE_ENV === 'local') {
    return {
      Lfx: LocalLfx,
      LfxAirdrop: LocalLfxAirdrop,
      LfxVault: LocalLfxVault,
      Lotte: LocalLotte,
    };
  }

  if (process.env.NODE_ENV === 'test') {
    return {
      Lfx: TestLfx,
      LfxAirdrop: TestLfxAirdrop,
      LfxVault: TestLfxVault,
      Lotte: TestLotte,
    };
  }

  // TODO: will replace by production env
  return {
    Lfx: LocalLfx,
    LfxAirdrop: LocalLfxAirdrop,
    LfxVault: LocalLfxVault,
    Lotte: LocalLotte,
  };
};

export const contractConfig = getContractConfig();
