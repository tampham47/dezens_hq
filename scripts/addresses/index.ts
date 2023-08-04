import PolygonTestLfx from './polygon-test/LFX.json';
import PolygonTestLfxAirdrop from './polygon-test/LfxAirdrop.json';
import PolygonTestLfxVault from './polygon-test/LfxVault.json';
import PolygonTestLotte from './polygon-test/Lotte.json';

import PolygonLfx from './polygon/LFX.json';
import PolygonLfxAirdrop from './polygon/LfxAirdrop.json';
import PolygonLfxVault from './polygon/LfxVault.json';
import PolygonLotte from './polygon/Lotte.json';

import BscTestnetLfx from './bsc-testnet/LFX.json';
import BscTestnetLfxAirdrop from './bsc-testnet/LfxAirdrop.json';
import BscTestnetLfxVault from './bsc-testnet/LfxVault.json';
import BscTestnetLotte from './bsc-testnet/Lotte.json';

export const getContractConfig = () => {
  if (process.env.NODE_ENV === 'polygon-test') {
    return {
      Lfx: PolygonTestLfx,
      LfxAirdrop: PolygonTestLfxAirdrop,
      LfxVault: PolygonTestLfxVault,
      Lotte: PolygonTestLotte,
    };
  }

  if (process.env.NODE_ENV === 'polygon') {
    return {
      Lfx: PolygonLfx,
      LfxAirdrop: PolygonLfxAirdrop,
      LfxVault: PolygonLfxVault,
      Lotte: PolygonLotte,
    };
  }

  if (process.env.NODE_ENV === 'bsc-testnet') {
    return {
      Lfx: BscTestnetLfx,
      LfxAirdrop: BscTestnetLfxAirdrop,
      LfxVault: BscTestnetLfxVault,
      Lotte: BscTestnetLotte,
    };
  }

  throw new Error('Invalid NODE_ENV');
};

export const contractConfig = getContractConfig();
