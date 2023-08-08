import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ScMain, ScContent as ScContentSrc } from '../components/Stack';
import { Button, Input } from '@mantine/core';
import { IconAt } from '@tabler/icons-react';
import { useWalletClient } from 'wagmi';
import { contractConfig } from '../contracts';
import { Contract, ethers } from 'ethers';
import { LfxToken } from '../apis/lfx-token';
import { wait } from '../utils/time';
import { DezMM, DezMmInformation } from '../apis/dez-mm';

const ScContent = styled(ScContentSrc)`
  background: #141e30;
  border-radius: 4px;
  margin-left: -16px;
  margin-right: -16px;

  @media screen and (min-width: 960px) {
    background: linear-gradient(to left, #243b55, #141e30);
    border-radius: 16px;
    margin-left: 0;
    margin-right: 0;
  }
`;

const ScImg = styled.img`
  max-width: 100%;
`;

const ScForm = styled.div`
  max-width: 480px;
  margin-top: 2rem;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`;
const ScFormRow = styled.div`
  display: flex;
  margin-bottom: 1rem;
  margin-left: -8px;
  margin-right: -8px;
`;
const ScFormItem = styled.div`
  flex: 1;
  margin-left: 8px;
  margin-right: 8px;
`;

export const BetMuskMark = () => {
  const { data: walletClient } = useWalletClient();
  const [betAmount, setBetAmount] = useState<string>('');

  const [dezMm, setDezMm] = useState<Contract>();
  const [lfxToken, setLfxToken] = useState<Contract>();
  const [userInfo, setUserInfo] = useState<DezMmInformation>();

  const [loadingMusk, setLoadingMusk] = useState<boolean>(false);
  const [loadingMark, setLoadingMark] = useState<boolean>(false);

  const updateUserInfo = useCallback(async () => {
    if (!walletClient) return;
    const info = await DezMM.getInformation(walletClient.account.address);
    setUserInfo(info);
  }, [walletClient]);

  const betOnMusk = async () => {
    if (!walletClient || !dezMm || !lfxToken) return;

    try {
      setLoadingMusk(true);
      const spender = walletClient.account.address;
      const amount = ethers.parseEther(betAmount);

      const allowance = await LfxToken.allowance(
        spender,
        contractConfig.DezMM.Token
      );

      if (allowance < amount) {
        await lfxToken.approve(contractConfig.DezMM.Token, amount);
        await wait(10000);
      }

      await dezMm.betOnMusk(amount, ethers.ZeroAddress);
    } catch (err) {
      console.log('ERR', err);
    } finally {
      setLoadingMusk(false);
      setBetAmount('');
    }
  };
  const betOnMark = async () => {
    if (!walletClient || !dezMm || !lfxToken) return;

    try {
      setLoadingMark(true);
      const spender = walletClient.account.address;
      const amount = ethers.parseEther(betAmount);

      const allowance = await LfxToken.allowance(
        spender,
        contractConfig.DezMM.Token
      );

      if (allowance < amount) {
        await lfxToken.approve(contractConfig.DezMM.Token, amount);
        await wait(10000);
      }

      await dezMm.betOnMark(amount, ethers.ZeroAddress);
    } catch (err) {
      console.log('ERR', err);
    } finally {
      setLoadingMark(false);
      setBetAmount('');
    }
  };

  useEffect(() => {
    if (!walletClient) return;

    const lfx = new Contract(
      contractConfig.Lfx.Token,
      contractConfig.ArtifactLfx.abi,
      walletClient as any
    );

    const mm = new Contract(
      contractConfig.DezMM.Token,
      contractConfig.ArtifactDezMM.abi,
      walletClient as any
    );

    setLfxToken(lfx);
    setDezMm(mm);
  }, [walletClient]);

  useEffect(() => {
    updateUserInfo();

    DezMM.contract.on('Bet', () => {
      updateUserInfo();
    });
  }, [updateUserInfo]);

  return (
    <ScMain>
      <ScContent>
        <h3>Musk vs. Mark</h3>
        <ScImg src="images/mm/mm04.jpg" />

        <ScForm>
          <ScFormRow>
            <ScFormItem>
              <div>{userInfo?.totalMusk ?? 0}</div>
              <div>{userInfo?.betMusk ?? 0}</div>
            </ScFormItem>
            <ScFormItem>
              <div>{userInfo?.totalMark || 0}</div>
              <div>{userInfo?.betMark ?? 0}</div>
            </ScFormItem>
          </ScFormRow>

          <ScFormRow>
            <ScFormItem>
              <Input
                icon={<IconAt />}
                placeholder="DEZ amount..."
                style={{ width: '100%' }}
                size="lg"
                value={betAmount}
                onChange={(e) => {
                  setBetAmount(e.target.value);
                }}
              />
            </ScFormItem>
          </ScFormRow>
          <ScFormRow>
            <ScFormItem>
              <Button
                color="red"
                size="lg"
                style={{ width: '100%' }}
                onClick={betOnMusk}
                loading={loadingMusk}
              >
                Musk
              </Button>
            </ScFormItem>
            <ScFormItem>
              <Button
                color="indigo"
                size="lg"
                style={{ width: '100%' }}
                onClick={betOnMark}
                loading={loadingMark}
              >
                Mark
              </Button>
            </ScFormItem>
          </ScFormRow>
        </ScForm>
      </ScContent>
    </ScMain>
  );
};
