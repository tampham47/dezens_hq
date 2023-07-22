import { Contract } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useWalletClient } from 'wagmi';
import styled from 'styled-components';
import { Button } from '@mantine/core';
import { QRCodeCanvas } from 'qrcode.react';
import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

import { contractConfig } from '../contracts';
import { LfxAirdrop, AirdropInfo } from '../apis/lfx-airdrop';

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

const ScQrCodeWrapper = styled.div`
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;
const ScQrCode = styled.div`
  display: inline-block;
  padding: 12px;
  border-radius: 8px;
  background: white;
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
      <ScStack>
        <ScPersonal>
          <ScSection>
            <h3>Your LFX Airdrop</h3>
            <ScBlock>
              <p>FTM deposited: {userDeposit} FTM</p>
              <p>
                Est LFX received:{' '}
                {userDeposit * (airdropInfo?.estLfxReceivePerFtm || 0)} LFX
              </p>
            </ScBlock>
            <ScBlock>
              <Button
                variant="light"
                color="orange"
                radius="xl"
                size="lg"
                disabled={!airdropInfo?.isWithdrawable}
                onClick={withdraw}
                style={{ minWidth: 240 }}
              >
                Withdraw
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
                title="Warning!"
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
                🍍 LFX Token Address: <code>{contractConfig.Lfx.Token}</code> (
                <a
                  href={`https://testnet.ftmscan.com/token/${contractConfig.Lfx.Token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Scan
                </a>
                )
              </p>
              <p>
                🍍 Airdrop Contract Address:{' '}
                <code>{contractConfig.LfxAirdrop.Token}</code> (
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

      <ScInfo>
        <ScBlock>
          <h4>LFX Airdrop Overview</h4>

          <p>
            Total LFX tokens to be airdropped: {airdropInfo?.balanceLfxToken}{' '}
            LFX
          </p>
          <p>
            Total FTM deposited into smart contract: {airdropInfo?.totalSupply}{' '}
            FTM
          </p>
          <p>
            Amount of LFX received per FTM:{' '}
            {airdropInfo?.estLfxReceivePerFtm || 0} LFX
          </p>
          <p>Number of participants: {airdropInfo?.participantCount}</p>
          <p>Status: {airdropInfo?.isWithdrawable ? 'Completed' : 'Ongoing'}</p>
          <p>
            Smart contract information, test cases for auditing the smart
            contract.
          </p>
        </ScBlock>
      </ScInfo>
    </ScMain>
  );
};
