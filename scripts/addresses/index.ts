import TestLfx from './test/LFX.json';
import TestLfxAirdrop from './test/LfxAirdrop.json';
import TestLfxVault from './test/LfxVault.json';
import TestLotte from './test/Lotte.json';

import PolygonTestLfx from './polygon-test/LFX.json';
import PolygonTestLfxAirdrop from './polygon-test/LfxAirdrop.json';
import PolygonTestLfxVault from './polygon-test/LfxVault.json';
import PolygonTestLotte from './polygon-test/Lotte.json';

import MainnetLfx from './mainnet/LFX.json';
import MainnetLfxAirdrop from './mainnet/LfxAirdrop.json';
import MainnetLfxVault from './mainnet/LfxVault.json';
import MainnetLotte from './mainnet/Lotte.json';

export const getContractConfig = () => {
  if (process.env.NODE_ENV === 'mainnet') {
    return {
      Lfx: MainnetLfx,
      LfxAirdrop: MainnetLfxAirdrop,
      LfxVault: MainnetLfxVault,
      Lotte: MainnetLotte,
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

  if (process.env.NODE_ENV === 'polygon-test') {
    return {
      Lfx: PolygonTestLfx,
      LfxAirdrop: PolygonTestLfxAirdrop,
      LfxVault: PolygonTestLfxVault,
      Lotte: PolygonTestLotte,
    };
  }

  throw new Error('Invalid NODE_ENV');
};

export const contractConfig = getContractConfig();
