// @ts-nocheck

import path from 'path';
import { artifacts } from 'hardhat';

export function saveContractAddress(
  contractName: string,
  contractAddress: string
) {
  const fs = require('fs');
  const web3Dir = path.join(
    __dirname,
    '..',
    '..',
    'web3',
    'src',
    'contracts',
    process.env.NODE_ENV
  );
  const scriptsDir = path.join(
    __dirname,
    '..',
    'addresses',
    process.env.NODE_ENV
  );

  if (!fs.existsSync(web3Dir)) {
    fs.mkdirSync(web3Dir);
  }
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir);
  }

  fs.writeFileSync(
    path.join(web3Dir, `${contractName}.json`),
    JSON.stringify({ Token: contractAddress }, undefined, 2)
  );
  fs.writeFileSync(
    path.join(scriptsDir, `${contractName}.json`),
    JSON.stringify({ Token: contractAddress }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync(contractName);
  fs.writeFileSync(
    path.join(web3Dir, `Artifact${contractName}.json`),
    JSON.stringify(TokenArtifact, null, 2)
  );
}
