import PolygonTestArtifactLfx from './polygon-test/ArtifactLFX.json';
import PolygonTestArtifactLfxAirdrop from './polygon-test/ArtifactLfxAirdrop.json';
import PolygonTestArtifactLfxVault from './polygon-test/ArtifactLfxVault.json';
import PolygonTestArtifactLotte from './polygon-test/ArtifactLotte.json';
import PolygonTestLfx from './polygon-test/LFX.json';
import PolygonTestLfxAirdrop from './polygon-test/LfxAirdrop.json';
import PolygonTestLfxVault from './polygon-test/LfxVault.json';
import PolygonTestLotte from './polygon-test/Lotte.json';

import BscTestnetArtifactLfx from './bsc-testnet/ArtifactLFX.json';
import BscTestnetArtifactLfxAirdrop from './bsc-testnet/ArtifactLfxAirdrop.json';
import BscTestnetArtifactLfxVault from './bsc-testnet/ArtifactLfxVault.json';
import BscTestnetArtifactLotte from './bsc-testnet/ArtifactLotte.json';
import BscTestnetLfx from './bsc-testnet/LFX.json';
import BscTestnetLfxAirdrop from './bsc-testnet/LfxAirdrop.json';
import BscTestnetLfxVault from './bsc-testnet/LfxVault.json';
import BscTestnetLotte from './bsc-testnet/Lotte.json';

import PolygonArtifactLfx from './polygon/ArtifactLFX.json';
import PolygonArtifactLfxAirdrop from './polygon/ArtifactLfxAirdrop.json';
import PolygonArtifactLfxVault from './polygon/ArtifactLfxVault.json';
import PolygonArtifactLotte from './polygon/ArtifactLotte.json';
import PolygonLfx from './polygon/LFX.json';
import PolygonLfxAirdrop from './polygon/LfxAirdrop.json';
import PolygonLfxVault from './polygon/LfxVault.json';
import PolygonLotte from './polygon/Lotte.json';

import BscArtifactLfx from './bsc/ArtifactLFX.json';
import BscArtifactLfxAirdrop from './bsc/ArtifactLfxAirdrop.json';
import BscArtifactLfxVault from './bsc/ArtifactLfxVault.json';
import BscArtifactLotte from './bsc/ArtifactLotte.json';
import BscLfx from './bsc/LFX.json';
import BscLfxAirdrop from './bsc/LfxAirdrop.json';
import BscLfxVault from './bsc/LfxVault.json';
import BscLotte from './bsc/Lotte.json';

export const getContractConfig = () => {
  if (process.env.GATSBY_NETWORK === 'polygon-test') {
    return {
      ArtifactLfx: PolygonTestArtifactLfx,
      ArtifactLfxAirdrop: PolygonTestArtifactLfxAirdrop,
      ArtifactLfxVault: PolygonTestArtifactLfxVault,
      ArtifactLotte: PolygonTestArtifactLotte,
      Lfx: PolygonTestLfx,
      LfxAirdrop: PolygonTestLfxAirdrop,
      LfxVault: PolygonTestLfxVault,
      Lotte: PolygonTestLotte,
    };
  }

  if (process.env.GATSBY_NETWORK === 'bsc-testnet') {
    return {
      ArtifactLfx: BscTestnetArtifactLfx,
      ArtifactLfxAirdrop: BscTestnetArtifactLfxAirdrop,
      ArtifactLfxVault: BscTestnetArtifactLfxVault,
      ArtifactLotte: BscTestnetArtifactLotte,
      Lfx: BscTestnetLfx,
      LfxAirdrop: BscTestnetLfxAirdrop,
      LfxVault: BscTestnetLfxVault,
      Lotte: BscTestnetLotte,
    };
  }

  if (process.env.GATSBY_NETWORK === 'polygon') {
    return {
      ArtifactLfx: PolygonArtifactLfx,
      ArtifactLfxAirdrop: PolygonArtifactLfxAirdrop,
      ArtifactLfxVault: PolygonArtifactLfxVault,
      ArtifactLotte: PolygonArtifactLotte,
      Lfx: PolygonLfx,
      LfxAirdrop: PolygonLfxAirdrop,
      LfxVault: PolygonLfxVault,
      Lotte: PolygonLotte,
    };
  }

  if (process.env.GATSBY_NETWORK === 'bsc') {
    return {
      ArtifactLfx: BscArtifactLfx,
      ArtifactLfxAirdrop: BscArtifactLfxAirdrop,
      ArtifactLfxVault: BscArtifactLfxVault,
      ArtifactLotte: BscArtifactLotte,
      Lfx: BscLfx,
      LfxAirdrop: BscLfxAirdrop,
      LfxVault: BscLfxVault,
      Lotte: BscLotte,
    };
  }

  throw Error('Unable to find envs');
};

export const contractConfig = getContractConfig();
