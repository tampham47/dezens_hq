import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { LfxLotte, LotteConfig, LotteInfo } from '../apis/lfx-lotte';
import { useWalletClient } from 'wagmi';
import { contractConfig } from '../contracts';
import { Contract, ethers } from 'ethers';
import { Button, Input } from '@mantine/core';
import { LfxToken } from '../apis/lfx-token';

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

const ScTicket = styled.span`
  display: inline-block;
  padding: 6px 12px;
  margin-right: 12px;
  background-color: #ef6262;
  border-radius: 4px;
  font-weight: bold;
  min-width: 80px;
  text-align: center;
`;

const getTicketByNumber = (ticketNumber: number) => {
  const aa = Math.floor(ticketNumber / 59);
  const bb = ticketNumber % 59;
  return `${aa.toString().padStart(2, '0')}:${bb.toString().padStart(2, '0')}`;
};

export const Lotte = () => {
  const { data: walletClient } = useWalletClient();

  const [lotteInfo, setLotteInfo] = useState<LotteInfo>();
  const [lotteConfig, setLotteConfig] = useState<LotteConfig>();
  const [ticketsBought, setTicketsBought] = useState<number[]>([]);

  const [lfxToken, setLfxToken] = useState<Contract>();
  const [lfxLotte, setLfxLotte] = useState<Contract>();

  const [ticketNumber, setTicketNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const purchase = async () => {
    if (
      !lfxToken ||
      !lfxLotte ||
      !walletClient ||
      !ticketNumber ||
      !lotteConfig
    ) {
      return;
    }

    try {
      setLoading(true);
      const spender = walletClient.account.address;
      const amount = ethers.parseEther(lotteConfig.ticketPrice.toString());

      const allowance = await LfxToken.allowance(
        spender,
        contractConfig.Lotte.Token
      );

      if (allowance < amount) {
        await lfxToken.approve(contractConfig.Lotte.Token, amount);
      }

      await lfxLotte.purchase([Number(ticketNumber)], ethers.ZeroAddress);
    } catch (err) {
      console.log('ERR', err);
    } finally {
      setTicketNumber('');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!walletClient) return;

    const lfx = new Contract(
      contractConfig.Lfx.Token,
      contractConfig.ArtifactLfx.abi,
      walletClient as any
    );

    const lotte = new Contract(
      contractConfig.Lotte.Token,
      contractConfig.ArtifactLotte.abi,
      walletClient as any
    );

    (window as any).lfx = lfx;
    (window as any).lfxLotte = lotte;

    setLfxToken(lfx);
    setLfxLotte(lotte);
  }, [walletClient]);

  useEffect(() => {
    if (!walletClient) return;

    (async () => {
      const spender = walletClient.account.address;
      const tickets = await LfxLotte.getTicketByAddress(spender);
      setTicketsBought(tickets);
    })();
  }, [walletClient]);

  useEffect(() => {
    (async () => {
      const info = await LfxLotte.getInformation();
      const config = await LfxLotte.getConfig();

      setLotteInfo(info);
      setLotteConfig(config);
    })();
  }, []);

  return (
    <ScMain>
      <ScStack>
        <ScPersonal>
          <ScBlock>
            <h3>Your Tickets</h3>
            {!ticketsBought.length ? <p>No ticket found</p> : null}
            {ticketsBought.map((i) => (
              <ScTicket>{getTicketByNumber(i)}</ScTicket>
            ))}
          </ScBlock>

          <ScBlock>
            <h3>Buy Tickets</h3>
            <Input
              placeholder="Ticket Number [0000 - 1439]"
              size="lg"
              style={{ marginBottom: 12 }}
              value={ticketNumber}
              onChange={(e) => {
                setTicketNumber(e.target.value);
              }}
            />
            <Button
              size="lg"
              variant="light"
              style={{ width: '100%' }}
              onClick={purchase}
              loading={loading}
            >
              Purchase
            </Button>
          </ScBlock>
        </ScPersonal>
        <ScContent>
          <h3>Lotte Fan Overview</h3>
          <p>Round: {lotteInfo?.round}</p>
          <p>Total Ticket: {lotteInfo?.totalTicket}</p>
          <p>Ticket Price: {lotteConfig?.ticketPrice} LFX</p>
          <p>Pot: {lotteInfo?.totalPot} LFX</p>
          <p>LFX Balance: {lotteInfo?.totalSupply} LFX</p>
          <p>System Fees: {lotteInfo?.systemFees} LFX</p>
          <p>Draw Rewards: {lotteInfo?.drawFees} LFX</p>
          <p>Burn Amount: {lotteInfo?.burnAmount} LFX</p>
        </ScContent>
      </ScStack>
    </ScMain>
  );
};
