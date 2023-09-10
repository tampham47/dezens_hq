import type { HeadFC, PageProps } from 'gatsby';
import React, { useCallback, useState } from 'react';
import {
  Charts,
  History,
  Invest,
  Layout,
  PoolTreasury,
  SEO,
  Statistics,
  Timer,
} from '../components';
import { EnumPoolType, EnumTradeType, InvestProps, TimePhase } from '../types';
import {
  BET_PRICE,
  HISTORY_GRAPH,
  InitialBet,
  STATUS_POOL,
  generateTotalPrice,
  poolsDown,
  poolsUp,
  sleep,
  wait,
} from '../utils';
import {
  ScChart,
  ScContainer,
  ScContent,
  ScContentPool,
  ScMain,
} from './styled';

const GamePage: React.FC<PageProps> = () => {
  const [poolUp, setPoolUp] = useState<any[]>(poolsUp);
  const [poolDown, setPoolDown] = useState<any[]>(poolsDown);
  const [bet, setBet] = useState<InvestProps>(InitialBet);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [timePhase, setTimePhase] = useState<TimePhase>({
    timer: 27,
    tradephase: EnumTradeType.open,
  });
  const [percent, setPercent] = useState<any>({
    up: 200,
    down: 200,
  });
  const [status, setStatus] = useState<string>('');

  const onJoinPool = useCallback(
    (pol: string) => {
      setDisabled(true);
      setBet((prev) => ({
        ...prev,
        status: false,
      }));

      if (pol === EnumPoolType.up) {
        setPoolUp((prevState) => [
          ...prevState,
          {
            betUpPrice: bet.betPrice,
            id: ++poolUp.length,
          },
        ]);
      } else {
        setPoolDown((prev) => [
          ...prev,
          {
            betDownPrice: bet.betPrice,
            id: ++poolDown.length,
          },
        ]);
      }
    },
    [bet, poolUp, poolDown, disabled]
  );

  const phaseTimeZero = ({ timer, tradephase }: TimePhase) =>
    setTimePhase({ timer, tradephase });

  const phaseDecrease = () =>
    setTimePhase((prv) => ({
      ...prv,
      timer: prv.timer - 1,
    }));

  const _setTimePhase = useCallback(() => {
    if (timePhase?.tradephase === EnumTradeType.open) {
      if (timePhase.timer > 0) {
        phaseDecrease();
      } else {
        setStatus(STATUS_POOL.WAIT);
        sleep(4000).then(() => {
          phaseTimeZero({
            timer: 8,
            tradephase: EnumTradeType.digging,
          });
          setStatus('');
        });
      }
    } else if (timePhase?.tradephase === EnumTradeType.digging) {
      setDisabled(true);
      if (timePhase.timer > 0) {
        phaseDecrease();
      } else {
        setStatus(STATUS_POOL.PAID);
        sleep(7000).then(() => {
          phaseTimeZero({
            timer: 10,
            tradephase: EnumTradeType.result,
          });
          setStatus('');
        });
      }
    } else {
      setDisabled(true);
      if (timePhase.timer > 0) {
        phaseDecrease();
      } else {
        phaseTimeZero({
          timer: 27,
          tradephase: EnumTradeType.open,
        });
        setDisabled(false);
        setBet(InitialBet);
        setPoolDown(poolsDown);
        setPoolUp(poolsUp);
      }
    }
  }, [timePhase, wait, status, disabled]);

  const calculatePotential = useCallback(
    (type: string) => {
      if (type === EnumPoolType.up) {
        const upPrice =
          generateTotalPrice(poolDown) / generateTotalPrice(poolUp);
        setPercent((prev) => ({
          ...prev,
          up: Math.round(upPrice + 1) * 0.9 * 100,
        }));
      } else {
        const downPrice =
          generateTotalPrice(poolUp) / generateTotalPrice(poolDown);
        setPercent((prev) => ({
          ...prev,
          down: Math.round(downPrice + 1) * 0.9 * 100,
        }));
      }
    },
    [generateTotalPrice, poolDown, poolUp]
  );

  return (
    <Layout>
      <ScMain>
        <ScContainer>
          <ScContent>
            <ScContentPool>
              <PoolTreasury
                type={EnumPoolType.up}
                data={poolUp}
                onJoinPool={onJoinPool}
                disabled={disabled}
              />
            </ScContentPool>
            <ScChart>
              <div className="stats">
                <Statistics
                  type={EnumPoolType.up}
                  betPrice={bet.betPrice}
                  percent={percent.up}
                  callback={calculatePotential}
                />
                <div className="blank" />
                <Statistics
                  type={EnumPoolType.down}
                  betPrice={bet.betPrice}
                  percent={percent.down}
                  callback={calculatePotential}
                />
              </div>
              <Timer
                phase={timePhase}
                callback={_setTimePhase}
                status={status}
              />
              <div className="graph_area">
                <Charts />
                <div className="last_result">
                  {HISTORY_GRAPH.map((item) => (
                    <History key={item?.id} type={item.type} />
                  ))}
                </div>
              </div>
              <div className="invest_select">
                {BET_PRICE.map((item, index) => (
                  <Invest
                    status={bet.status}
                    key={index}
                    betPrice={item}
                    active={item === bet?.betPrice}
                    callback={(price) => {
                      if (bet.status) {
                        setBet((prev) => ({
                          ...prev,
                          betPrice: price,
                        }));
                      }
                    }}
                  />
                ))}
              </div>
            </ScChart>
            <ScContentPool>
              <PoolTreasury
                type={EnumPoolType.down}
                data={poolDown}
                disabled={disabled}
                onJoinPool={onJoinPool}
              />
            </ScContentPool>
            <div className="pool_mobile">
              <PoolTreasury
                type={EnumPoolType.up}
                data={poolUp}
                onJoinPool={onJoinPool}
                disabled={disabled}
              />
              <PoolTreasury
                type={EnumPoolType.down}
                data={poolDown}
                disabled={disabled}
                onJoinPool={onJoinPool}
              />
            </div>
          </ScContent>
        </ScContainer>
      </ScMain>
    </Layout>
  );
};

export const Head: HeadFC = () => <SEO title="Game | Dezens" />;

export default GamePage;
