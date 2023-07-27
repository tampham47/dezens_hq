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

import MainnetArtifactLfx from './mainnet/ArtifactLFX.json';
import MainnetArtifactLfxAirdrop from './mainnet/ArtifactLfxAirdrop.json';
import MainnetArtifactLfxVault from './mainnet/ArtifactLfxVault.json';
import MainnetArtifactLotte from './mainnet/ArtifactLotte.json';
import MainnetLfx from './mainnet/LFX.json';
import MainnetLfxAirdrop from './mainnet/LfxAirdrop.json';
import MainnetLfxVault from './mainnet/LfxVault.json';
import MainnetLotte from './mainnet/Lotte.json';

export const getContractConfig = () => {
  if (process.env.GATSBY_NETWORK === 'local') {
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

  if ((process.env.GATSBY_NETWORK === 'test')) {
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

  // return mainnet config by default
  return {
    ArtifactLfx: MainnetArtifactLfx,
    ArtifactLfxAirdrop: MainnetArtifactLfxAirdrop,
    ArtifactLfxVault: MainnetArtifactLfxVault,
    ArtifactLotte: MainnetArtifactLotte,
    Lfx: MainnetLfx,
    LfxAirdrop: MainnetLfxAirdrop,
    LfxVault: MainnetLfxVault,
    Lotte: MainnetLotte,
  };
};

export const contractConfig = getContractConfig();
