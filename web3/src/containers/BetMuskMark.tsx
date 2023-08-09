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
import { DezRefs } from '../apis/dez-refs';
import { BuyLfx } from '../components/BuyLfx';

const ScContent = styled(ScContentSrc)`
  background: #141e30;
  padding: 12px;
  border-radius: 4px;
  margin-left: -16px;
  margin-right: -16px;
  margin-bottom: 1rem;

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

const ScInfoSection = styled(ScContent)`
  background: #0f0c29; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #24243e,
    #302b63,
    #0f0c29
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #24243e,
    #302b63,
    #0f0c29
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  p {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
`;

const ScFrame = styled.div`
  position: relative;
  min-height: 600px;
`;
const ScFloatHeader = styled.div`
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
  color: #f79327;
  font-size: 18px;
  line-height: 1.2;
  letter-spacing: 1.2;
  margin: 0;

  @media screen and (min-width: 960px) {
    position: absolute;
    top: 12px;
    font-size: 28px;
    line-height: 1.2;
    letter-spacing: 1.2;
  }
`;
const ScFloatBody = styled.div`
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;

  @media screen and (min-width: 960px) {
    position: absolute;
  }
`;

const ScImg = styled.img`
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;

  @media screen and (min-width: 960px) {
    margin-top: 0;
    margin-bottom: 0;
  }
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
  padding-left: 8px;
  padding-right: 8px;
  margin-bottom: 2rem;

  @media screen and (min-width: 960px) {
    padding-left: 24px;
    padding-right: 24px;
    margin-bottom: 0;
  }
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
  position: relative;

  b,
  span {
    white-space: nowrap;
  }

  b {
    font-size: 16px;
    line-height: 42px;
  }
  span {
    font-size: 12px;
  }

  @media screen and (min-width: 960px) {
    b {
      font-size: 18px;
      line-height: 42px;
    }
    span {
      font-size: 14px;
    }
  }
`;
const ScCombatBarText = styled.div`
  position: absolute;
  top: 0;
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

  ${ScCombatBarText} {
    left: 12px;
  }
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

  ${ScCombatBarText} {
    right: 12px;
  }
`;

const ScMessage = styled.div`
  font-size: 18px;
  padding: 24px;
  max-width: 940px;
  margin-left: auto;
  margin-right: auto;
`;

export const BetMuskMark = () => {
  const { data: walletClient } = useWalletClient();
  const [refAddress, setRefAddress] = useState<string>('');
  const [betAmount, setBetAmount] = useState<string>('');
  const [ref, setRef] = useState<string>('');

  const [dezMm, setDezMm] = useState<Contract>();
  const [lfxToken, setLfxToken] = useState<Contract>();
  const [userInfo, setUserInfo] = useState<DezMmInformation>();

  const [loadingMusk, setLoadingMusk] = useState<boolean>(false);
  const [loadingMark, setLoadingMark] = useState<boolean>(false);

  const totalMusk = userInfo?.totalMusk ?? 0;
  const totalMark = userInfo?.totalMark ?? 0;
  const total = totalMusk + totalMark;
  const p = total > 0 ? Math.floor((totalMusk * 100) / total) : 50;
  const muskPercentage = Math.min(90, p);
  const markPercentage = 100 - muskPercentage;

  const updateUserInfo = useCallback(async () => {
    if (!walletClient) return;

    const address = walletClient.account.address;
    const _ref = await DezRefs.getRef(address);
    const info = await DezMM.getInformation(walletClient.account.address);

    setUserInfo(info);
    if (_ref) {
      setRef(_ref);
      setRefAddress(_ref);
    }
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
    if (!walletClient) {
      return;
    }

    const address = walletClient.account.address;

    updateUserInfo();

    DezMM.contract.on('Bet', () => {
      updateUserInfo();
    });

    DezRefs.contract.on('RefSet', (user: string, ref: string) => {
      if (user === address) {
        setRef(ref);
        setRefAddress(ref);
      }
    });
  }, [walletClient]);

  return (
    <ScMain>
      <ScContent>
        <ScFrame>
          <ScFloatHeader>
            <h3>
              Musk vs. Mark
              <br />
              Bet BIG - Win BIG
            </h3>
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
                  <ScCombatBarText>
                    <b>{getAutoRoundNumber(userInfo?.totalMusk ?? 0)} DEZ</b>
                    <br />
                    <span>
                      {getAutoRoundNumber(userInfo?.betMusk ?? 0)} DEZ (yours)
                    </span>
                  </ScCombatBarText>
                </ScCombatBarLeft>
                <ScCombatBarRight width={markPercentage}>
                  <ScCombatBarText>
                    <b>{getAutoRoundNumber(userInfo?.totalMark || 0)} DEZ</b>
                    <br />
                    <span>
                      (yours) {getAutoRoundNumber(userInfo?.betMark ?? 0)} DEZ
                    </span>
                  </ScCombatBarText>
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
                    disabled={!!ref}
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
      <ScInfoSection>
        <ScMessage>
          <p>
            Get ready for the ultimate showdown! Watch as Elon Musk and Mark
            Zuckerberg throw down in the ring! Who will emerge victorious? Place
            your bets now for a chance to win in this electrifying clash of
            giants!
          </p>
          <BuyLfx />
        </ScMessage>
      </ScInfoSection>
    </ScMain>
  );
};
