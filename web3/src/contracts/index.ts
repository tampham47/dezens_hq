import LocalArtifactLfx from './local/ArtifactLFX.json';
import LocalArtifactLfxAirdrop from './local/ArtifactLfxAirdrop.json';
import LocalArtifactLfxVault from './local/ArtifactLfxVault.json';
import LocalArtifactLotte from './local/ArtifactLotte.json';
import LocalLfx from './local/LFX.json';
import LocalLfxAirdrop from './local/LfxAirdrop.json';
import LocalLfxVault from './local/LfxVault.json';
import LocalLotte from './local/Lotte.json';

import TestArtifactLfx from './test/ArtifactLFX.json';
import TestArtifactLfxAirdrop from './test/ArtifactLfxAirdrop.json';
import TestArtifactLfxVault from './test/ArtifactLfxVault.json';
import TestArtifactLotte from './test/ArtifactLotte.json';
import TestLfx from './test/LFX.json';
import TestLfxAirdrop from './test/LfxAirdrop.json';
import TestLfxVault from './test/LfxVault.json';
import TestLotte from './test/Lotte.json';

export const getContractConfig = () => {
  if (process.env.NETWORK === 'local') {
    return {
      ArtifactLfx: LocalArtifactLfx,
      ArtifactLfxAirdrop: LocalArtifactLfxAirdrop,
      ArtifactLfxVault: LocalArtifactLfxVault,
      ArtifactLotte: LocalArtifactLotte,
      Lfx: LocalLfx,
      LfxAirdrop: LocalLfxAirdrop,
      LfxVault: LocalLfxVault,
      Lotte: LocalLotte,
    };
  }

  if ((process.env.NETWORK = 'test')) {
    return {
      ArtifactLfx: TestArtifactLfx,
      ArtifactLfxAirdrop: TestArtifactLfxAirdrop,
      ArtifactLfxVault: TestArtifactLfxVault,
      ArtifactLotte: TestArtifactLotte,
      Lfx: TestLfx,
      LfxAirdrop: TestLfxAirdrop,
      LfxVault: TestLfxVault,
      Lotte: TestLotte,
    };
  }

  // TODO: will replace by production env
  return {
    ArtifactLfx: LocalArtifactLfx,
    ArtifactLfxAirdrop: LocalArtifactLfxAirdrop,
    ArtifactLfxVault: LocalArtifactLfxVault,
    ArtifactLotte: LocalArtifactLotte,
    Lfx: LocalLfx,
    LfxAirdrop: LocalLfxAirdrop,
    LfxVault: LocalLfxVault,
    Lotte: LocalLotte,
  };
};
