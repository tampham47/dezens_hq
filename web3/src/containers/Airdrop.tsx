import React, { useEffect, useState } from 'react';
import { Contract } from 'ethers';
import { useWalletClient } from 'wagmi';
import styled from 'styled-components';
import { Button } from '@mantine/core';
import { QRCodeCanvas } from 'qrcode.react';
import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

import { contractConfig } from '../contracts';
import { LfxAirdrop, AirdropInfo } from '../apis/lfx-airdrop';
import { getShortAddress } from '../utils/address';
import {
  ScInfoList,
  ScInfoBlock,
  ScInfoValue,
  ScInfoLabel,
  ScMessage,
  ScRow,
  ScBlock,
} from '../components/Common';
import { getDisplayedNumber } from '../utils/number';

const ScMain = styled.div`
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
  background-color: #000957;
  color: #f1c93b;
  padding: 24px;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const ScContent = styled.div`
  flex: 5;
  border-radius: 16px;
  background-color: #000957;
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

const ScQrCodeWrapper = styled.div`
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 3rem;
`;
const ScQrCode = styled.div`
  display: inline-block;
  padding: 12px;
  border-radius: 8px;
  background: white;
`;

const ScHelperBox = styled.div`
  margin-top: 2rem;
`;

const ScImgWrapper = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;
const ScImg = styled.img`
  width: 240px;
`;

export const Airdrop = () => {
  const { data: walletClient } = useWalletClient();
  const [userDeposit, setUserDeposit] = useState<number>(0);
  const [airdropInfo, setAirdropInfo] = useState<AirdropInfo>();
  const [lfxToken, setLfxToken] = useState<Contract>();
  const [lfxAirdrop, setLfxAirdrop] = useState<Contract>();

  const withdraw = async () => {
    if (!lfxAirdrop || !lfxToken) return;

    try {
      await lfxAirdrop.withdraw();
    } catch (err) {
      console.log('ERR', err);
    }
  };

  useEffect(() => {
    if (!walletClient) return;

    const lfx = new Contract(
      contractConfig.Lfx.Token,
      contractConfig.ArtifactLfx.abi,
      walletClient as any
    );

    const airdrop = new Contract(
      contractConfig.LfxAirdrop.Token,
      contractConfig.ArtifactLfxAirdrop.abi,
      walletClient as any
    );

    (window as any).lfx = lfx;
    (window as any).lfxAirdrop = airdrop;

    setLfxToken(lfx);
    setLfxAirdrop(airdrop);
  }, [walletClient]);

  useEffect(() => {
    if (!walletClient) return;

    (async () => {
      const balance = await LfxAirdrop.balanceOf(walletClient?.account.address);
      setUserDeposit(balance);
    })();
  }, [walletClient]);

  useEffect(() => {
    (async () => {
      const info = await LfxAirdrop.getInformation();
      setAirdropInfo(info);
    })();
  }, []);

  return (
    <ScMain>
      <ScInfo>
        <ScBlock>
          <h3>LFX Airdrop Round #01</h3>

          <ScImgWrapper>
            <ScImg src="/images/heart.png" alt="Heart LFX" />
          </ScImgWrapper>

          <ScInfoList>
            <ScInfoBlock>
              <ScInfoValue>
                {airdropInfo?.isWithdrawable ? 'Completed' : 'Ongoing'}
              </ScInfoValue>
              <ScInfoLabel>Status</ScInfoLabel>
            </ScInfoBlock>
            <ScInfoBlock>
              <ScInfoValue>
                {getDisplayedNumber(airdropInfo?.participantCount)}
              </ScInfoValue>
              <ScInfoLabel>Number of participants</ScInfoLabel>
            </ScInfoBlock>
            <ScInfoBlock>
              <ScInfoValue>
                {getDisplayedNumber(airdropInfo?.totalSupply)} FTM
              </ScInfoValue>
              <ScInfoLabel>Total FTM deposited</ScInfoLabel>
            </ScInfoBlock>
          </ScInfoList>

          <ScInfoList>
            <ScInfoBlock>
              <ScInfoValue>
                {getDisplayedNumber(airdropInfo?.balanceLfxToken)} LFX
              </ScInfoValue>
              <ScInfoLabel>Total LFX to distribute</ScInfoLabel>
            </ScInfoBlock>
            <ScInfoBlock>
              <ScInfoValue>
                {getDisplayedNumber(airdropInfo?.estLfxReceivePerFtm || 0)} LFX
              </ScInfoValue>
              <ScInfoLabel>Amount of LFX received / FTM</ScInfoLabel>
            </ScInfoBlock>
            <ScInfoBlock></ScInfoBlock>
          </ScInfoList>

          <ScHelperBox>
            <ScMessage>
              Deposit FTM to participate LFX Airdrop. FTM will be returned to
              you when the airdrop ends
            </ScMessage>
            <ScMessage>
              LFX Token Address:{' '}
              <code>{getShortAddress(contractConfig.Lfx.Token)}</code> (
              <a
                href={`https://testnet.ftmscan.com/token/${contractConfig.Lfx.Token}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Scan
              </a>
              )
            </ScMessage>
          </ScHelperBox>
        </ScBlock>
      </ScInfo>

      <ScStack>
        <ScPersonal>
          <ScSection>
            <h3>Your LFX Airdrop</h3>
            <ScBlock>
              <ScRow>
                <p>FTM deposited: </p>
                <p>{getDisplayedNumber(userDeposit)} FTM</p>
              </ScRow>
              <ScRow>
                <p>Est LFX received: </p>
                <p>
                  {getDisplayedNumber(
                    userDeposit * (airdropInfo?.estLfxReceivePerFtm || 0)
                  )}{' '}
                  LFX
                </p>
              </ScRow>
            </ScBlock>
            <ScBlock>
              <Button
                variant="light"
                color="yellow"
                size="lg"
                disabled={!airdropInfo?.isWithdrawable}
                onClick={withdraw}
                style={{ width: '100%' }}
              >
                Claim
              </Button>
            </ScBlock>
          </ScSection>
        </ScPersonal>
        <ScContent>
          <ScSection>
            <h3>LFX Airdrop</h3>

            {airdropInfo?.isWithdrawable ? (
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                color="orange"
                variant="filled"
              >
                The Airdrop is finished, new transfers will be rejected. It's
                time to withdraw.
              </Alert>
            ) : null}
            <ScBlock>
              <ScQrCodeWrapper>
                <ScQrCode>
                  <QRCodeCanvas
                    value={contractConfig.LfxAirdrop.Token}
                    size={240}
                  />
                </ScQrCode>
              </ScQrCodeWrapper>
              <p>
                🍍 Airdrop Contract Address:{' '}
                <code>{getShortAddress(contractConfig.LfxAirdrop.Token)}</code>{' '}
                (
                <a
                  href={`https://testnet.ftmscan.com/address/${contractConfig.LfxAirdrop.Token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Scan
                </a>
                )
              </p>
              <p>
                🍍 Only deposit FTM - Fantom, transferring any other token will
                not be recognized.
              </p>
              <p>
                🍍 To receive the LFX Airdrop, you need to transfer FTM - Fantom
                to the smart contract wallet address. The amount of FTM will be
                refunded to you after the airdrop ends. Depositing FTM helps
                minimize fraud in the airdrop process.
              </p>
              <p>
                🍍 Each wallet can only deposit FTM once, with the amount of FTM
                within [{airdropInfo?.minDepositAmount},{' '}
                {airdropInfo?.maxDepositAmount}
                ]. The system will not accept deposits exceeding this limit.
              </p>
              <p>
                🍍 The airdrop will be completed when there are{' '}
                {airdropInfo?.maxParticipant} participants or{' '}
                {airdropInfo?.maxTotalSupply} FTM is deposited. After that,
                users will be allowed to withdraw LFX as well as FTM to their
                wallet.
              </p>
            </ScBlock>
          </ScSection>
        </ScContent>
      </ScStack>
    </ScMain>
  );
};
