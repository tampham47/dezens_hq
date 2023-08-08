import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ScMain, ScContent as ScContentSrc } from '../components/Stack';
import { Button, Input } from '@mantine/core';
import { useWalletClient } from 'wagmi';
import { contractConfig } from '../contracts';
import { Contract, ethers } from 'ethers';
import { LfxToken } from '../apis/lfx-token';
import { wait } from '../utils/time';
import { DezMM, DezMmInformation } from '../apis/dez-mm';
import { CountDownWithDay } from '../components/CountDownWithDay';
import { getAutoRoundNumber } from '../utils/number';

const ScContent = styled(ScContentSrc)`
  background: #141e30;
  padding: 12px;
  border-radius: 4px;
  margin-left: -16px;
  margin-right: -16px;

  background: #3c486b; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #f27121,
    #e94057,
    #8a2387
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #f27121,
    #e94057,
    #8a2387
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  @media screen and (min-width: 960px) {
    border-radius: 16px;
    margin-left: 0;
    margin-right: 0;
  }
`;

const ScFrame = styled.div`
  position: relative;
`;
const ScFloatHeader = styled.h3`
  position: absolute;
  top: 12px;
  left: 0;
  right: 0;
  text-align: center;
  color: #f79327;
  font-size: 28px;
  line-height: 1.2;
  letter-spacing: 1.2;
`;
const ScFloatBody = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
`;

const ScImg = styled.img`
  width: 100%;
`;

const ScForm = styled.div`
  max-width: 480px;
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  text-align: center;

  input {
    text-align: center;
  }
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

const ScCombatBarWrapper = styled.div`
  padding-left: 24px;
  padding-right: 24px;
`;
const ScCombatBar = styled.div`
  position: relative;
  height: 42px;
  width: 100%;
  border-radius: 8px;
`;
const ScCombatBarContent = styled.div`
  padding-left: 16px;
  padding-right: 16px;

  b, span {
    white-space: nowrap;
  }

  b {
    font-size: 18px;
    line-height: 42px;
  }
  span {
    font-size: 14px;
  }
`;
const ScCombatBarLeft = styled(ScCombatBarContent)<{ width: number }>`
  position: absolute;
  background-color: black;
  left: 0;
  top: 0;
  bottom: 0;
  transition: all 0.3s;
  width: ${({ width }) => width || 50}%;
  text-align: left;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
`;
const ScCombatBarRight = styled(ScCombatBarContent)<{ width: number }>`
  position: absolute;
  background-color: #fa5252;
  right: 0;
  top: 0;
  bottom: 0;
  transition: all 0.3s;
  width: ${({ width }) => width || 50}%;
  text-align: right;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`;

export const BetMuskMark = () => {
  const { data: walletClient } = useWalletClient();
  const [refAddress, setRefAddress] = useState<string>('');
  const [betAmount, setBetAmount] = useState<string>('');

  const [dezMm, setDezMm] = useState<Contract>();
  const [lfxToken, setLfxToken] = useState<Contract>();
  const [userInfo, setUserInfo] = useState<DezMmInformation>();

  const [loadingMusk, setLoadingMusk] = useState<boolean>(false);
  const [loadingMark, setLoadingMark] = useState<boolean>(false);

  const totalMusk = userInfo?.totalMusk ?? 0;
  const totalMark = userInfo?.totalMark ?? 0;
  const total = totalMusk + totalMark;
  const p = total > 0 ? Math.round((totalMusk * 100) / total) : 0;
  const muskPercentage = Math.max(10, p);
  const markPercentage = 100 - muskPercentage;

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

      await dezMm.betOnMusk(amount, refAddress || ethers.ZeroAddress);
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

      await dezMm.betOnMark(amount, refAddress || ethers.ZeroAddress);
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
        <ScFrame>
          <ScFloatHeader>
            Musk vs. Mark
            <br />
            Bet BIG - Win BIG
          </ScFloatHeader>

          <ScImg src="images/mm/mm04.jpg" />

          <ScFloatBody>
            <div style={{ marginBottom: 24 }}>
              <CountDownWithDay
                targetTime={userInfo?.finalizeTs ?? 0}
                key={userInfo?.finalizeTs}
              />
            </div>

            <ScCombatBarWrapper>
              <ScCombatBar>
                <ScCombatBarLeft width={muskPercentage}>
                  <b>{getAutoRoundNumber(userInfo?.totalMusk ?? 0)} DEZ</b>
                  <br />
                  <span>
                    {getAutoRoundNumber(userInfo?.betMusk ?? 0)} DEZ (your bet)
                  </span>
                </ScCombatBarLeft>
                <ScCombatBarRight width={markPercentage}>
                  <b>{getAutoRoundNumber(userInfo?.totalMark || 0)} DEZ</b>
                  <br />
                  <span>
                    (your bet) {getAutoRoundNumber(userInfo?.betMark ?? 0)} DEZ
                  </span>
                </ScCombatBarRight>
              </ScCombatBar>
            </ScCombatBarWrapper>

            <ScForm>
              <ScFormRow>
                <ScFormItem>
                  <Input
                    placeholder="Input your referral address"
                    style={{ width: '100%', color: 'white' }}
                    size="sm"
                    value={refAddress}
                    onChange={(e) => {
                      setRefAddress(e.target.value);
                    }}
                  />
                </ScFormItem>
              </ScFormRow>
              <ScFormRow>
                <ScFormItem>
                  <Input
                    placeholder="DEZ Amount"
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
                    color="dark"
                    size="xl"
                    style={{ width: '100%' }}
                    onClick={betOnMusk}
                    loading={loadingMusk}
                  >
                    Musk
                  </Button>
                </ScFormItem>
                <ScFormItem>
                  <Button
                    color="red"
                    size="xl"
                    style={{ width: '100%' }}
                    onClick={betOnMark}
                    loading={loadingMark}
                  >
                    Mark
                  </Button>
                </ScFormItem>
              </ScFormRow>
            </ScForm>
          </ScFloatBody>
        </ScFrame>
      </ScContent>
    </ScMain>
  );
};
