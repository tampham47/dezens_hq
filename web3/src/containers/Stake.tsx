import { Contract, ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useWalletClient } from 'wagmi';
import styled from 'styled-components';
import { Input, Button } from '@mantine/core';

import { contractConfig } from '../contracts';
import { VaultInfo } from '../apis/lfx-vault';
import { LfxVault } from '../apis/lfx-vault';
import { LfxToken } from '../apis/lfx-token';

const ScMain = styled.div`
  margin-bottom: 6rem;

  p {
    line-height: 1.6;
  }
`;

const ScStack = styled.div`
  h3 {
    margin-top: 0;
  }

  @media screen and (min-width: 1260px) {
    display: flex;
    flex-direction: row-reverse;
  }
`;

const ScPersonal = styled.div`
  flex: 2;
  border-radius: 16px;
  background-color: #3f2e3e;
  color: #f1c93b;
  padding: 24px;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const ScContent = styled.div`
  flex: 5;
  border-radius: 16px;
  background-color: #4e4feb;
  color: black;
  color: #f1c93b;
  padding: 24px;
  margin-bottom: 1rem;

  @media screen and (min-width: 1260px) {
    margin-right: 1rem;
  }
`;

const ScInfo = styled(ScContent)`
  flex: none;
  margin-right: 0;
`;

const ScSection = styled.div`
  margin-bottom: 4rem;
`;

const ScBlock = styled.div`
  margin-bottom: 2rem;
`;

export const Stake = () => {
  const { data: walletClient } = useWalletClient();
  const [userDeposit, setUserDeposit] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);

  const [depositAmount, setDepositAmount] = useState<string>('');
  const [depositing, setDepositing] = useState<boolean>(false);

  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawing, setWithdrawing] = useState<boolean>(false);

  const [vaultInfo, setVaultInfo] = useState<VaultInfo>();
  const [lfxToken, setLfxToken] = useState<Contract>();
  const [lfxVault, setLfxVault] = useState<Contract>();

  const deposit = async () => {
    if (!lfxVault || !lfxToken || !walletClient || !depositAmount) return;

    try {
      setDepositing(true);
      const spender = walletClient.account.address;
      const amount = ethers.parseEther(depositAmount);

      const allowance = await LfxToken.allowance(
        spender,
        contractConfig.LfxVault.Token
      );

      if (allowance < amount) {
        await lfxToken.approve(contractConfig.LfxVault.Token, amount);
      }

      await lfxVault.deposit(amount);
    } catch (err) {
      console.log('ERR', err);
    } finally {
      setDepositAmount('');
      setDepositing(false);
    }
  };

  const withdraw = async () => {
    if (!lfxVault || !lfxToken || !walletClient || !withdrawAmount) return;

    try {
      setWithdrawing(true);
      const amount = ethers.parseEther(withdrawAmount);
      await lfxVault.withdraw(amount);
    } catch (err) {
      console.log('ERR', err);
    } finally {
      setWithdrawAmount('');
      setWithdrawing(false);
    }
  };

  useEffect(() => {
    if (!walletClient) return;

    const lfx = new Contract(
      contractConfig.Lfx.Token,
      contractConfig.ArtifactLfx.abi,
      walletClient as any
    );

    const vault = new Contract(
      contractConfig.LfxVault.Token,
      contractConfig.ArtifactLfxVault.abi,
      walletClient as any
    );

    (window as any).lfx = lfx;
    (window as any).lfxVault = vault;

    setLfxToken(lfx);
    setLfxVault(vault);
  }, [walletClient]);

  useEffect(() => {
    if (!walletClient) return;

    (async () => {
      const address = walletClient?.account.address;
      const balance = await LfxVault.balanceOf(address);
      const interest = await LfxVault.getTotalInterest(address);

      setUserDeposit(balance);
      setTotalInterest(interest);
    })();
  }, [walletClient]);

  useEffect(() => {
    if (!lfxVault) return;

    (async () => {})();
  }, [lfxVault]);

  useEffect(() => {
    (async () => {
      const info = await LfxVault.getInformation();
      setVaultInfo(info);
    })();
  }, []);

  return (
    <ScMain>
      <ScStack>
        <ScPersonal>
          <ScBlock>
            <h3>Your Stake</h3>
            <p>Total Deposit: {userDeposit} LFX</p>
            <p>Total Interest: {totalInterest} LFX</p>

            <Input
              placeholder="LFX amount"
              size="lg"
              style={{ marginBottom: 12 }}
              value={withdrawAmount}
              onChange={(e) => {
                setWithdrawAmount(e.target.value);
              }}
            />
            <Button
              size="lg"
              variant="light"
              style={{ width: '100%' }}
              onClick={withdraw}
              loading={withdrawing}
            >
              Withdraw
            </Button>
          </ScBlock>

          <ScBlock>
            <h3>Deposit</h3>
            <Input
              placeholder="LFX amount"
              size="lg"
              style={{ marginBottom: 12 }}
              value={depositAmount}
              onChange={(e) => {
                setDepositAmount(e.target.value);
              }}
            />
            <Button
              size="lg"
              variant="light"
              style={{ width: '100%' }}
              onClick={deposit}
              loading={depositing}
            >
              Deposit
            </Button>
          </ScBlock>
        </ScPersonal>
        <ScContent>
          <h3>Vault Information</h3>

          <p>
            Airdrop Contract Address:{' '}
            <code>{contractConfig.LfxVault.Token}</code> (
            <a
              href={`https://testnet.ftmscan.com/address/${contractConfig.LfxVault.Token}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Scan
            </a>
            )
          </p>
          <p>Total Deposit: {vaultInfo?.totalSupply} LFX</p>
          <p>Vault Balance: {vaultInfo?.vaultBalance} LFX</p>
          <p>Yield Per Token Per Day: {vaultInfo?.yieldPerTokenPerDay} LFX</p>
        </ScContent>
      </ScStack>
    </ScMain>
  );
};
