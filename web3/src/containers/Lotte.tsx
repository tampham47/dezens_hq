import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Input } from '@mantine/core';
import { useWalletClient } from 'wagmi';
import { Contract, ethers } from 'ethers';

import { LfxLotte, LotteConfig, LotteInfo } from '../apis/lfx-lotte';
import { contractConfig } from '../contracts';
import { LfxToken } from '../apis/lfx-token';
import { getShortAddress } from '../utils/address';
import { getDisplayedNumber } from '../utils/number';
import { CountDown } from '../components/CountDown';
import {
  ScInfoList,
  ScInfoBlock,
  ScInfoValue,
  ScInfoLabel,
  ScMessage,
  ScRow,
} from '../components/Common';
import {
  ScStack,
  ScStackMain as ScStackMainSrc,
  ScStackAside as ScStackAsideSrc,
  ScList,
} from '../components/Stack';
import { DrawHistory } from './DrawHistory';
import { useWeb3Modal } from '@web3modal/react';

const ScMain = styled.div`
  p {
    line-height: 1.6;
  }
`;

const ScStackMain = styled(ScStackMainSrc)`
  background: #141e30;

  @media screen and (min-width: 960px) {
    background: linear-gradient(to left, #243b55, #141e30 50%);
  }
`;
const ScStackAside = styled(ScStackAsideSrc)`
  background: #141e30;

  @media screen and (min-width: 960px) {
    background: linear-gradient(to right, #243b55, #141e30 50%);
  }
`;

const ScBlock = styled.div`
  margin-bottom: 3rem;
`;

const ScTicketList = styled.div``;

const ScTicket = styled.span`
  display: inline-block;
  padding: 6px 16px;
  margin-right: 12px;
  border: 1px solid #ff731d;
  color: #ff731d;
  font-weight: bold;
  border-radius: 6px;
  min-width: 80px;
  text-align: center;
  margin-bottom: 6px;
`;

const ScRef = styled.div`
  margin-bottom: 12px;
`;

const ScDrawWrapper = styled.div`
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const ScHelper = styled.p`
  opacity: 0.6;
`;

const ScPotWrapper = styled.div`
  text-align: center;
`;

const ScPot = styled.span`
  display: inline-block;
  font-size: 24px;
  font-weight: bold;
  padding: 16px 30px;
  border-radius: 8px;
  letter-spacing: 1px;
  background-color: #ff731d;
  margin-top: 2rem;
  margin-bottom: 2rem;

  @media screen and (min-width: 960px) {
    font-size: 32px;
  }
`;

const wait = async (ts: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, ts);
  });
};

const getTicketByNumber = (ticketNumber: number) => {
  const aa = Math.floor(ticketNumber / 60);
  const bb = ticketNumber % 60;
  return `${aa.toString().padStart(2, '0')}:${bb.toString().padStart(2, '0')}`;
};

const getNumberByTicket = (ticket: string) => {
  const [aa, bb] = ticket.split(':');
  return Number(aa) * 60 + Number(bb);
};

const validateNumber = (ticket: string) => {
  if (ticket.length !== 5) {
    return false;
  }

  const n = getNumberByTicket(ticket);
  const [aa, bb] = ticket.split(':');
  const numberAa = Number(aa);
  const numberBb = Number(bb);

  return (
    numberAa >= 0 &&
    numberAa < 24 &&
    numberBb >= 0 &&
    numberBb < 60 &&
    n >= 0 &&
    n < 1440
  );
};

export const Lotte = () => {
  const { data: walletClient } = useWalletClient();
  const web3Modal = useWeb3Modal();

  const [lotteInfo, setLotteInfo] = useState<LotteInfo>();
  const [lotteConfig, setLotteConfig] = useState<LotteConfig>();
  const [ticketList, setTicketList] = useState<number[]>([]);
  const [ref, setRef] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);

  const [lfxToken, setLfxToken] = useState<Contract>();
  const [lfxLotte, setLfxLotte] = useState<Contract>();

  const [inputRef, setInputRef] = useState<string>('');
  const [ticketNumber, setTicketNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [withdrawing, setWithdrawing] = useState<boolean>(false);

  const currentRound = lotteInfo?.round || 0;
  const nextDraw =
    (lotteInfo?.lastDrawTimestamp || 0) + (lotteConfig?.minDrawDuration || 0);

  const draw = async () => {
    if (!lfxToken || !lfxLotte || !walletClient || !lotteConfig) {
      return;
    }

    try {
      setDrawing(true);
      await lfxLotte.draw();
    } catch (err) {
      console.log('ERR', err);
    } finally {
      setDrawing(false);
    }
  };

  const withdraw = async () => {
    if (!lfxToken || !lfxLotte || !walletClient || !lotteConfig) {
      return;
    }

    try {
      setWithdrawing(true);
      await lfxLotte.withdraw(ethers.parseEther(balance.toString()));
    } catch (err) {
      console.log('ERR', err);
    } finally {
      setWithdrawing(false);
    }
  };

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

    const number = getNumberByTicket(ticketNumber);

    if (!validateNumber(ticketNumber)) {
      return;
    }

    try {
      setLoading(true);
      const spender = walletClient.account.address;
      const amount = ethers.parseEther(lotteConfig.ticketPrice.toString());
      const tickets = [number];

      const allowance = await LfxToken.allowance(
        spender,
        contractConfig.Lotte.Token
      );

      if (allowance < amount) {
        const lfxBalance = await LfxToken.contract.balanceOf(spender);
        await lfxToken.approve(contractConfig.Lotte.Token, lfxBalance);
        await wait(10000);
      }

      await lfxLotte.purchase(tickets, inputRef || ethers.ZeroAddress);
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

  const loadUserData = useCallback(async () => {
    if (!walletClient) return;

    const spender = walletClient.account.address;
    const tickets = await LfxLotte.getTicketByAddress(spender);
    const ref = await LfxLotte.getRef(spender);
    const balance = await LfxLotte.balanceOf(spender);

    setRef(ref);
    setTicketList(tickets);
    setBalance(balance);
  }, [walletClient]);

  const loadConfig = async () => {
    const info = await LfxLotte.getInformation();
    const config = await LfxLotte.getConfig();
    const draw = await LfxLotte.getLastDraw();

    setLotteInfo(info);
    setLotteConfig(config);
  };

  useEffect(() => {
    loadUserData();
  }, [walletClient]);

  useEffect(() => {
    loadConfig();

    LfxLotte.contract.on('EvtPurchase', () => {
      loadUserData();
      loadConfig();
    });

    LfxLotte.contract.on('EvtDraw', () => {
      loadUserData();
      loadConfig();
    });
  }, [loadUserData]);

  return (
    <ScMain>
      <ScStack>
        <ScStackMain>
          <ScBlock>
            <h3>Buy Tickets</h3>
            {ref === ethers.ZeroAddress ? (
              <Input
                placeholder="Your Ref"
                size="lg"
                style={{ marginBottom: 12 }}
                value={inputRef}
                onChange={(e) => {
                  setInputRef(e.target.value);
                }}
              />
            ) : (
              <ScRef>
                Your Ref:{' '}
                <a
                  href={`${process.env.GATSBY_ETHER_SCAN}/address/${ref}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getShortAddress(ref)}
                </a>
              </ScRef>
            )}
            <Input
              placeholder="Ticket Number [00-23]:[00-59]"
              size="lg"
              type="text"
              inputMode="numeric"
              style={{ marginBottom: 12, textAlign: 'center' }}
              value={ticketNumber}
              onKeyDown={(e) => {
                if (ticketNumber.length !== 3) {
                  return;
                }

                if (e.key === 'Backspace' || e.key === 'Delete') {
                  setTicketNumber(ticketNumber.slice(0, -1));
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              onChange={(e) => {
                let value = e.target.value;

                if (value.length > 5) {
                  return;
                }

                if (value.length == 2) {
                  value += ':';
                }

                setTicketNumber(value);
              }}
            />
            {walletClient ? (
              <Button
                size="lg"
                variant="light"
                style={{ width: '100%' }}
                onClick={purchase}
                loading={loading}
              >
                Purchase
              </Button>
            ) : (
              <Button
                size="lg"
                variant="light"
                style={{ width: '100%' }}
                onClick={async () => {
                  try {
                    await web3Modal.open();
                  } catch (err) {}
                }}
                loading={loading}
              >
                Connect Wallet
              </Button>
            )}
          </ScBlock>

          <ScBlock>
            <h4>Your Tickets</h4>
            {!ticketList.length ? <ScHelper>No ticket found</ScHelper> : null}
            <ScTicketList>
              {ticketList.map((i, index) => (
                <ScTicket key={index}>{getTicketByNumber(i)}</ScTicket>
              ))}
            </ScTicketList>
          </ScBlock>

          <ScBlock>
            <h4>Your Balance</h4>
            <ScRow>
              <p>{balance} DEZ</p>
              <Button variant="subtle" onClick={withdraw} loading={withdrawing}>
                Withdraw
              </Button>
            </ScRow>
          </ScBlock>
        </ScStackMain>
        <ScStackAside>
          <h3>DezLottery R#{lotteInfo?.round}</h3>

          <ScPotWrapper>
            <ScPot>POT: {getDisplayedNumber(lotteInfo?.totalPot)} DEZ</ScPot>
          </ScPotWrapper>

          <ScInfoList>
            <ScInfoBlock>
              <ScInfoValue>
                {getDisplayedNumber(lotteConfig?.ticketPrice)} DEZ
              </ScInfoValue>
              <ScInfoLabel>Ticket Price</ScInfoLabel>
            </ScInfoBlock>

            <ScInfoBlock>
              <ScInfoValue>
                {getDisplayedNumber(lotteInfo?.totalSupply)} DEZ
              </ScInfoValue>
              <ScInfoLabel>DEZ Balance</ScInfoLabel>
            </ScInfoBlock>

            <ScInfoBlock>
              <ScInfoValue>
                {getDisplayedNumber(lotteInfo?.totalTicket)}
              </ScInfoValue>
              <ScInfoLabel>Total Ticket</ScInfoLabel>
            </ScInfoBlock>

            <ScInfoBlock>
              <ScInfoValue>
                {getDisplayedNumber(lotteInfo?.systemFees)} DEZ
              </ScInfoValue>
              <ScInfoLabel>System Fees</ScInfoLabel>
            </ScInfoBlock>

            <ScInfoBlock>
              <ScInfoValue>
                {getDisplayedNumber(lotteInfo?.drawFees)} DEZ
              </ScInfoValue>
              <ScInfoLabel>Draw Rewards</ScInfoLabel>
            </ScInfoBlock>

            <ScInfoBlock>
              <ScInfoValue>
                {getDisplayedNumber(lotteInfo?.burnAmount)} DEZ
              </ScInfoValue>
              <ScInfoLabel>Burn Amount</ScInfoLabel>
            </ScInfoBlock>
          </ScInfoList>

          <ScMessage>
            DezLottery Contract Address:{' '}
            <code>{getShortAddress(contractConfig.Lotte.Token)}</code>&nbsp;(
            <a
              href={`${process.env.GATSBY_ETHER_SCAN}/address/${contractConfig.Lotte.Token}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Scan
            </a>
            )
          </ScMessage>
          <ScMessage>
            Next draw available in{' '}
            <CountDown targetTime={nextDraw} key={nextDraw} />
          </ScMessage>

          <ScDrawWrapper>
            <Button
              size="xl"
              color="cyan"
              style={{ minWidth: 220 }}
              onClick={draw}
              loading={drawing}
              disabled={!lotteInfo?.isDrawable}
            >
              Draw
            </Button>
          </ScDrawWrapper>
        </ScStackAside>
      </ScStack>

      {currentRound > 0 ? (
        <>
          <h4>Draw history</h4>
          <ScList>
            <DrawHistory index={currentRound - 1} key={currentRound - 1} />
            <DrawHistory index={currentRound - 2} key={currentRound - 2} />
            <DrawHistory index={currentRound - 3} key={currentRound - 3} />
          </ScList>
        </>
      ) : null}
    </ScMain>
  );
};
