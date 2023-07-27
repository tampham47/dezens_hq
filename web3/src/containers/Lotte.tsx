import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Input } from '@mantine/core';
import { useWalletClient } from 'wagmi';
import { Contract, ethers } from 'ethers';

import {
  DrawInformation,
  LfxLotte,
  LotteConfig,
  LotteInfo,
} from '../apis/lfx-lotte';
import { contractConfig } from '../contracts';
import { LfxToken } from '../apis/lfx-token';
import { getShortAddress } from '../utils/address';
import { getDisplayedNumber } from '../utils/number';
import { CountDown } from '../components/CountDown';

const ScMain = styled.div`
  p {
    line-height: 1.6;
  }

  h4 {
    margin-top: 2.5em;
    margin-bottom: 0.5em;
  }
`;

const ScStack = styled.div`
  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
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

const ScBody = styled.div`
  flex: 5;
  border-radius: 16px;
  background-color: #000957;
  color: black;
  color: #f1c93b;
  padding: 24px;
  margin-bottom: 1rem;
`;

const ScContent = styled(ScBody)`
  @media screen and (min-width: 1260px) {
    margin-right: 1rem;
  }
`;

const ScBlock = styled.div`
  margin-bottom: 3rem;
`;

const ScTicketList = styled.div``;

const ScTicket = styled.span`
  display: inline-block;
  padding: 6px 12px;
  margin-right: 12px;
  background-color: #ef6262;
  border-radius: 4px;
  font-weight: bold;
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

const ScRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
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
  background-color: #d61c4e;
  margin-top: 2rem;
  margin-bottom: 2rem;

  @media screen and (min-width: 960px) {
    font-size: 32px;
  }
`;

const ScInfoList = styled.div`
  @media screen and (min-width: 960px) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const ScInfoBlock = styled.div`
  padding: 24px;

  @media screen and (min-width: 960px) {
    width: 25%;
  }
`;
const ScInfoValue = styled.div`
  font-size: 24px;
  margin-bottom: 4px;
`;
const ScInfoLabel = styled.div`
  font-size: 14px;
  font-weight: bold;
  opacity: 0.75;
`;

const ScMessage = styled.p`
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  text-align: center;
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

  const [lotteInfo, setLotteInfo] = useState<LotteInfo>();
  const [lotteConfig, setLotteConfig] = useState<LotteConfig>();
  const [ticketList, setTicketList] = useState<number[]>([]);
  const [ref, setRef] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);
  const [lastDraw, setLastDraw] = useState<DrawInformation>();

  const [lfxToken, setLfxToken] = useState<Contract>();
  const [lfxLotte, setLfxLotte] = useState<Contract>();

  const [inputRef, setInputRef] = useState<string>('');
  const [ticketNumber, setTicketNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [withdrawing, setWithdrawing] = useState<boolean>(false);

  const nextDraw = (lotteInfo?.lastDrawTimestamp || 0) + (lotteConfig?.minDrawDuration || 0);

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
        await lfxToken.approve(
          contractConfig.Lotte.Token,
          amount * BigInt(tickets.length)
        );
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
    setLastDraw(draw);
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
        <ScPersonal>
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
                  href={`https://testnet.ftmscan.com/address/${ref}`}
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
            <Button
              size="lg"
              color="yellow"
              variant="light"
              style={{ width: '100%' }}
              onClick={purchase}
              loading={loading}
            >
              Purchase
            </Button>
          </ScBlock>

          <ScBlock>
            <h3>Your Tickets</h3>
            {!ticketList.length ? <ScHelper>No ticket found</ScHelper> : null}
            <ScTicketList>
              {ticketList.map((i, index) => (
                <ScTicket key={index}>{getTicketByNumber(i)}</ScTicket>
              ))}
            </ScTicketList>
          </ScBlock>

          <ScBlock>
            <h3>Your Balance</h3>
            <ScRow>
              <p>{balance} LFX</p>
              <Button
                variant="outline"
                color="green"
                onClick={withdraw}
                loading={withdrawing}
              >
                Withdraw
              </Button>
            </ScRow>
          </ScBlock>
        </ScPersonal>
        <ScContent>
          <h3>Round #{lotteInfo?.round}</h3>

          <ScPotWrapper>
            <ScPot>POT: {getDisplayedNumber(lotteInfo?.totalPot)} LFX</ScPot>
          </ScPotWrapper>

          <ScInfoList>
            <ScInfoBlock>
              <ScInfoValue>
                {getDisplayedNumber(lotteConfig?.ticketPrice)} LFX
              </ScInfoValue>
              <ScInfoLabel>Ticket Price</ScInfoLabel>
            </ScInfoBlock>

            <ScInfoBlock>
              <ScInfoValue>
                {getDisplayedNumber(lotteInfo?.totalSupply)} LFX
              </ScInfoValue>
              <ScInfoLabel>LFX Balance</ScInfoLabel>
            </ScInfoBlock>

            <ScInfoBlock>
              <ScInfoValue>
                {getDisplayedNumber(lotteInfo?.totalTicket)}
              </ScInfoValue>
              <ScInfoLabel>Total Ticket</ScInfoLabel>
            </ScInfoBlock>
          </ScInfoList>

          <ScInfoList>
            <ScInfoBlock>
              <ScInfoValue>
                {getDisplayedNumber(lotteInfo?.systemFees)} LFX
              </ScInfoValue>
              <ScInfoLabel>System Fees</ScInfoLabel>
            </ScInfoBlock>

            <ScInfoBlock>
              <ScInfoValue>
                {getDisplayedNumber(lotteInfo?.drawFees)} LFX
              </ScInfoValue>
              <ScInfoLabel>Draw Rewards</ScInfoLabel>
            </ScInfoBlock>

            <ScInfoBlock>
              <ScInfoValue>
                {getDisplayedNumber(lotteInfo?.burnAmount)} LFX
              </ScInfoValue>
              <ScInfoLabel>Burn Amount</ScInfoLabel>
            </ScInfoBlock>
          </ScInfoList>

          <ScMessage>
            Lotte Contract Address:{' '}
            <code>{getShortAddress(contractConfig.Lotte.Token)}</code>&nbsp;(
            <a
              href={`https://testnet.ftmscan.com/address/${contractConfig.Lotte.Token}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Scan
            </a>
            )
          </ScMessage>
          <ScMessage>
            Next draw available in{' '}
            <CountDown
              targetTime={nextDraw}
              key={nextDraw}
            />
          </ScMessage>

          <ScDrawWrapper>
            <Button
              size="xl"
              color="yellow"
              style={{ minWidth: 220 }}
              onClick={draw}
              loading={drawing}
              disabled={!lotteInfo?.isDrawable}
            >
              Draw
            </Button>
          </ScDrawWrapper>
        </ScContent>
      </ScStack>

      <ScStack>
        <ScPersonal>
          <h3>
            Last Draw: Round #{lotteInfo?.round ? lotteInfo.round - 1 : '-'}
          </h3>
          <ScRow>
            <p>Conducted by:</p>
            <a
              href={`https://testnet.ftmscan.com/address/${lastDraw?.actor}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {getShortAddress(lastDraw?.actor || '')}
            </a>
          </ScRow>
          <ScRow>
            <p>Winning Ticket:</p>
            <ScTicket style={{ marginRight: 0, marginBottom: 0 }}>
              {getTicketByNumber(lastDraw?.winningNumber || 0)}
            </ScTicket>
          </ScRow>
          <ScRow>
            <p>Time: </p>
            <p>{lastDraw?.timestamp}</p>
          </ScRow>
          <ScRow>
            <p>Winner Count:</p>
            <p>
              {lastDraw?.winnerCount === 0
                ? 'No Winner'
                : lastDraw?.winnerCount}
            </p>
          </ScRow>

          {lastDraw?.winnerCount ? (
            <>
              <ScRow>
                <p>Winning Amount: </p>
                <p>{lastDraw?.winningAmount}</p>
              </ScRow>
              <ScRow>
                <p>Winner Address:</p>
                <p>
                  {lastDraw?.winnerList.map((i) => (
                    <span>{i}</span>
                  ))}
                </p>
              </ScRow>
            </>
          ) : null}
        </ScPersonal>

        <ScContent>
          <h3>How to play</h3>
          <p>
            Lotte Fan is working automatically itself. The power is all on you.
          </p>

          <div>
            <h4>Step: 1. Choose tickets with your favorite number.</h4>
            <p>
              A ticket contains two numbers and divided by `:`, the first number
              is in this range [00, 23], the second number should be in this
              range [00, 59]
            </p>
          </div>
          <div>
            <h4>Step 2. Purchase and Payment</h4>
            <p>
              To purchase tickets, you need to approve the contract to use LFX
              in your wallet first. The ticket is about 10.000 LFX. However, you
              can approve more than that to save the gas fee for the next
              purchase.
            </p>

            <p>
              If your allowance of LFX in the contract is enough to pay for the
              tickets. You will be led directly to the confirmation screen.
            </p>
          </div>
          <div>
            <h4>Step 3. Wait for the Draw</h4>
            <p>
              Every 24 hours, everybody can perform the Draw action. This action
              generates a winning number, then distributes rewards to winners if
              any.
            </p>
            <p>
              If there is no winner. All the rewards in the POT will be
              accumulated for the next round.
            </p>
            <p>
              Those who perform the Draw action will receive rewards from the
              system right after the draw is complete. Then they can withdraw
              LFX to their wallet.
            </p>
          </div>
        </ScContent>
      </ScStack>
    </ScMain>
  );
};
