import React, { useEffect, useState } from 'react';
import { Contract } from 'ethers';
import { useWalletClient } from 'wagmi';
import styled from 'styled-components';
import { QRCodeCanvas } from 'qrcode.react';
import { Alert, CopyButton, Button } from '@mantine/core';
import {
  IconAlertCircle,
  IconClipboard,
  IconClipboardCheck,
} from '@tabler/icons-react';

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
import { getAutoRoundNumber, getDisplayedNumber } from '../utils/number';
import { ScStack, ScStackMain, ScStackAside } from '../components/Stack';
import { BuyLfx } from '../components/BuyLfx';

const ScMain = styled.div`
  p {
    line-height: 1.6;
  }
`;

const ScInfo = styled(ScStackAside)`
  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #fd8d14;
  }

  @media screen and (min-width: 960px) {
    margin-right: 0;
  }
`;

const ScSection = styled.div`
  margin-bottom: 4rem;
`;

const ScQrCodeWrapper = styled.div`
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 1rem;
`;
const ScQrCode = styled.div`
  display: inline-block;
  padding: 12px;
  border-radius: 8px;
  background: white;
`;

const ScHelperBox = styled.div`
  margin-bottom: 2rem;
  text-align: center;

  ${ScMessage} {
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const ScAddress = styled.span`
  padding: 2px 2px 2px 16px;
  border-radius: 4px;
  border: 1px solid #6527be;
  display: inline-block;
`;
const ScAddressValue = styled.code`
  margin-right: 8px;
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
  const rootTokenName = process.env.GATSBY_ROOT_TOKEN_NAME;
  let network = 'Polygon';

  if (rootTokenName === 'FTM') {
    network = 'Fantom';
  }

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
                {getDisplayedNumber(airdropInfo?.maxParticipant)}
              </ScInfoValue>
              <ScInfoLabel>Expected participants</ScInfoLabel>
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
              <ScInfoLabel>
                Amount of LFX received / {rootTokenName}
              </ScInfoLabel>
            </ScInfoBlock>
            <ScInfoBlock>
              <ScInfoValue>
                {getAutoRoundNumber(airdropInfo?.totalSupply)} {rootTokenName}
              </ScInfoValue>
              <ScInfoLabel>Total {rootTokenName} deposited</ScInfoLabel>
            </ScInfoBlock>
          </ScInfoList>
        </ScBlock>
      </ScInfo>

      <ScStack>
        <ScStackMain>
          <ScSection>
            <h3>Your LFX Airdrop</h3>
            <ScBlock>
              <ScRow>
                <p>{rootTokenName} deposited: </p>
                <p>
                  {getAutoRoundNumber(userDeposit)} {rootTokenName}
                </p>
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
                color="orange"
                size="lg"
                disabled={!airdropInfo?.isWithdrawable}
                onClick={withdraw}
                style={{ width: '100%' }}
              >
                Claim
              </Button>
            </ScBlock>
          </ScSection>
        </ScStackMain>

        <ScStackAside>
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

              <ScHelperBox>
                <ScAddress>
                  <ScAddressValue>
                    {getShortAddress(contractConfig.LfxAirdrop.Token)}
                  </ScAddressValue>
                  <CopyButton value={contractConfig.LfxAirdrop.Token}>
                    {({ copied, copy }) => (
                      <Button
                        color={copied ? 'teal' : 'violet'}
                        variant="subtle"
                        onClick={copy}
                        leftIcon={
                          copied ? (
                            <IconClipboardCheck size={16} />
                          ) : (
                            <IconClipboard size={16} />
                          )
                        }
                      >
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                    )}
                  </CopyButton>
                </ScAddress>
                <ScMessage>
                  Deposit [{airdropInfo?.minDepositAmount},{' '}
                  {airdropInfo?.maxDepositAmount}] {rootTokenName} to
                  participate LFX Airdrop. {rootTokenName} will be returned to
                  you when the airdrop ends
                </ScMessage>
              </ScHelperBox>

              <p>
                🍍 Airdrop Contract Address:{' '}
                <code>{getShortAddress(contractConfig.LfxAirdrop.Token)}</code>
                &nbsp;(
                <a
                  href={`${process.env.GATSBY_FANTOM_SCAN}/address/${contractConfig.LfxAirdrop.Token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Scan
                </a>
                ).
              </p>
              <p>
                🍍 LFX Token Address:{' '}
                <code>{getShortAddress(contractConfig.Lfx.Token)}</code>&nbsp;(
                <a
                  href={`${process.env.GATSBY_FANTOM_SCAN}/token/${contractConfig.Lfx.Token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Scan
                </a>
                ), do NOT deposit {rootTokenName} into this contract.
              </p>
              <p>
                🍍 Only deposit {rootTokenName} - {network}, transferring any
                other token will not be recognized.
              </p>
              <p>
                🍍 To receive the LFX Airdrop, you need to transfer{' '}
                {rootTokenName} - {network} to the smart contract wallet
                address. The amount of {rootTokenName} will be refunded to you
                after the airdrop ends. Depositing {rootTokenName} helps
                minimize fraud in the airdrop process.
              </p>
              <p>
                🍍 Each wallet can only deposit {rootTokenName} once, with the
                amount of {rootTokenName} within [
                {airdropInfo?.minDepositAmount}, {airdropInfo?.maxDepositAmount}
                ]. The system will not accept deposits exceeding this limit.
              </p>
              <p>
                🍍 The airdrop will be completed when there are{' '}
                {airdropInfo?.maxParticipant} participants or{' '}
                {airdropInfo?.maxTotalSupply} {rootTokenName} is deposited.
                After that, users will be allowed to withdraw LFX as well as{' '}
                {rootTokenName} to their wallet.
              </p>
            </ScBlock>
          </ScSection>

          <BuyLfx />
        </ScStackAside>
      </ScStack>
    </ScMain>
  );
};
