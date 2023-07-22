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
      console.log('err', err);
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
              <p>Số FTM của bạn: {userDeposit}FTM</p>
              <p>
                Số LFX ước tính nhận được:{' '}
                {userDeposit * (airdropInfo?.estLfxReceivePerFtm || 0)}LFX
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
            <h3>Tham gia Airdrop</h3>

            {airdropInfo?.isWithdrawable ? (
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                title="Warning!"
                color="orange" variant="filled"
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
                🍍 Contract Address:{' '}
                <code>{contractConfig.LfxAirdrop.Token}</code>
              </p>
              <p>
                🍍 Chỉ deposit FTM - Fantom, việc chuyển bất kỳ token khác sẽ
                không được ghi nhận.
              </p>
              <p>
                🍍 Để nhận LFX Airdrop bạn cần chuyển FTM - Fantom vào địa chỉ
                ví của smartcontact. Số lượng FTM sẽ được hoàn trả cho bạn sau
                khi quá trình airdrop kết thúc. Việc deposit FTM để giảm thiểu
                việc gian lận trong quá trình nhận Airdrop.
              </p>
              <p>
                🍍 Mỗi ví chỉ được deposit FTM một lần, số lượng FTM nằm trong [
                {airdropInfo?.minDepositAmount}, {airdropInfo?.maxDepositAmount}
                ]. Hệ thống sẽ không chấp nhận việc deposit vượt quá giới hạn
                này.
              </p>
              <p>
                🍍 Airdrop sẽ hoàn thành khi có {airdropInfo?.maxParticipant}{' '}
                người tham gia, hoặc có {airdropInfo?.maxTotalSupply}FTM được
                deposit. Sau đó người dùng sẽ được phép rút LFX cũng như FTM về
                ví của mình.
              </p>
            </ScBlock>
          </ScSection>
        </ScContent>
      </ScStack>

      <ScInfo>
        <ScBlock>
          <h4>Tổng quan LFX Airdrop</h4>

          <p>Tổng LFX token được airdrop: {airdropInfo?.balanceLfxToken}LFX</p>
          <p>
            Tổng FTM đã được deposit vào smartcontract:{' '}
            {airdropInfo?.totalSupply}FTM
          </p>
          <p>
            Số lượng FLX nhận được cho mỗi FTM:{' '}
            {airdropInfo?.estLfxReceivePerFtm || 0}LFX
          </p>
          <p>Số lượng người tham gia: {airdropInfo?.participantCount}</p>
          <p>
            Trạng thái:{' '}
            {airdropInfo?.isWithdrawable ? 'Bắt đầu rút LFX' : 'Đang tiếp tục'}
          </p>
          <p>Thông tin smartcontract, test cases để audit smartcontract</p>
        </ScBlock>
      </ScInfo>
    </ScMain>
  );
};
