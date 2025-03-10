import { Contract, ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useWalletClient } from 'wagmi';
import styled from 'styled-components';
import { Input, Button } from '@mantine/core';

import { contractConfig } from '../contracts';
import { VaultInfo } from '../apis/lfx-vault';
import { LfxVault } from '../apis/lfx-vault';
import { LfxToken } from '../apis/lfx-token';
import { getShortAddress } from '../utils/address';
import { wait } from '../utils/time';
import {
  ScInfoList,
  ScInfoBlock,
  ScInfoValue,
  ScInfoLabel,
  ScMessage,
  ScRow,
  ScBlock,
} from '../components/Common';
import { getAutoRoundNumber, getDisplayedNumber } from '../utils/number';
import {
  ScStack,
  ScStackMain as ScStackMainSrc,
  ScStackAside as ScStackAsideSrc,
} from '../components/Stack';
import { BuyLfx } from '../components/BuyLfx';

const ScMain = styled.div`
  margin-bottom: 6rem;

  p {
    line-height: 1.6;
  }
`;

const ScStackMain = styled(ScStackMainSrc)`
  background: #141e30;
`;
const ScStackAside = styled(ScStackAsideSrc)`
  background: #141e30;

  @media screen and (min-width: 960px) {
    background: linear-gradient(to right, #243b55, #141e30 50%);
  }
`;

const ScImgWrapper = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;
const ScImg = styled.img`
  width: 240px;
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
        await wait(10000);
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
        <ScStackMain>
          <ScBlock>
            <h3>Your Stake</h3>
            <ScRow>
              <p>Total Deposit</p>
              <p>{getDisplayedNumber(userDeposit)} DEZ</p>
            </ScRow>
            <ScRow>
              <p>Total Interest</p>
              <p>{getDisplayedNumber(totalInterest)} DEZ</p>
            </ScRow>
          </ScBlock>
          <ScBlock>
            <Input
              placeholder="DEZ amount"
              size="lg"
              type="number"
              inputMode="numeric"
              style={{ marginBottom: 12 }}
              value={withdrawAmount}
              onChange={(e) => {
                setWithdrawAmount(e.target.value);
              }}
            />
            <Button
              size="lg"
              variant="light"
              color="orange"
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
              placeholder="DEZ amount"
              size="lg"
              type="number"
              inputMode="numeric"
              style={{ marginBottom: 12 }}
              value={depositAmount}
              onChange={(e) => {
                setDepositAmount(e.target.value);
              }}
            />
            <Button
              size="lg"
              variant="light"
              color="orange"
              style={{ width: '100%' }}
              onClick={deposit}
              loading={depositing}
            >
              Deposit
            </Button>
          </ScBlock>
        </ScStackMain>
        <ScStackAside>
          <h3>Vault Information</h3>

          <ScImgWrapper>
            <ScImg src="/images/diamond.png" alt="Diamond DEZ" />
          </ScImgWrapper>

          <ScInfoList>
            <ScInfoBlock>
              <ScInfoValue>
                {getDisplayedNumber(vaultInfo?.totalSupply)} DEZ
              </ScInfoValue>
              <ScInfoLabel>Total Deposit</ScInfoLabel>
            </ScInfoBlock>
            <ScInfoBlock>
              <ScInfoValue>
                {getDisplayedNumber(vaultInfo?.vaultBalance)} DEZ
              </ScInfoValue>
              <ScInfoLabel>Vault Balance</ScInfoLabel>
            </ScInfoBlock>
            <ScInfoBlock>
              <ScInfoValue>
                {getAutoRoundNumber(vaultInfo?.yieldPerTokenPerDay ?? 0)} DEZ
              </ScInfoValue>
              <ScInfoLabel>Yield / Token / Day</ScInfoLabel>
            </ScInfoBlock>
          </ScInfoList>

          <ScMessage>
            Stake your DEZ to share profit from DezApps with us!
          </ScMessage>
          <ScMessage>
            Vault Contract Address:{' '}
            <code>{getShortAddress(contractConfig.LfxVault.Token)}</code>&nbsp;(
            <a
              href={`${process.env.GATSBY_ETHER_SCAN}/address/${contractConfig.LfxVault.Token}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Scan
            </a>
            )
          </ScMessage>

          <BuyLfx />
        </ScStackAside>
      </ScStack>
    </ScMain>
  );
};
