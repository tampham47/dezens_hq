// @ts-nocheck

import path from 'path';
import { ethers } from 'hardhat';

function saveContractAddress(contractName: string, contractAddress: string) {
  const fs = require('fs');
  const contractsDir = path.join(
    __dirname,
    '..',
    'web3',
    'src',
    'contracts',
    process.env.NODE_ENV
  );

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, `${contractName}.json`),
    JSON.stringify({ Token: contractAddress }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync(contractName);

  fs.writeFileSync(
    path.join(contractsDir, `Artifact${contractName}.json`),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

async function main() {
  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    'Deploying the contracts with the account:',
    await deployer.getAddress()
  );

  const lfxTotalSupply = BigInt(21_000_000_000) * BigInt(1e18);
  const lfxTokenContract = await ethers.getContractFactory('LFX');
  const lfxToken = await lfxTokenContract.deploy(lfxTotalSupply);
  const lfxTokenAddress = await lfxToken.getAddress();
  await lfxToken.waitForDeployment();

  // LFX Vault
  const LfxVault = await ethers.getContractFactory('LfxVault');
  const lfxVault = await LfxVault.deploy(lfxTokenAddress);
  const lfxVaultAddress = await lfxVault.getAddress();
  await lfxVault.waitForDeployment();

  const LfxAirdropContract = await ethers.getContractFactory('LfxAirdrop');
  const lfxAirdrop = await LfxAirdropContract.deploy(
    lfxTokenAddress,
    2,
    100,
    1,
    100
  );
  const lfxAirdropAddress = await lfxAirdrop.getAddress();

  // Lotte App
  const Lotte = await ethers.getContractFactory('Lotte');
  const lotte = await Lotte.deploy(lfxTokenAddress, lfxVaultAddress);
  const lotteAddress = await lotte.getAddress();
  await lotte.waitForDeployment();

  console.log('LFX Token Address   :', lfxTokenAddress);
  console.log('LFX Airdrop Address :', lfxAirdropAddress);
  console.log('LFX Vault Address   :', lfxVaultAddress);
  console.log('Lotte App Address   :', lotteAddress);

  saveContractAddress('LFX', lfxTokenAddress);
  saveContractAddress('LfxVault', lfxVaultAddress);
  saveContractAddress('LfxAirdrop', lfxAirdropAddress);
  saveContractAddress('Lotte', lotteAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
