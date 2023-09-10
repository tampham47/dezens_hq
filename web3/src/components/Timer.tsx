import React, { useEffect } from 'react';
import styled from 'styled-components';
import { EnumTradeType, TimerProps } from '../types';

const TimerStyled = styled.div<{ tradephase: string }>`
  font-family: 'Barlow Semi Condensed', sans-serif;
  position: absolute;
  left: calc(50% - 5.25em);
  top: -0.8em;
  width: 10.5em;
  height: 10.5em;
  border-radius: 50%;
  background-color: rgba(24, 25, 31, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  color: #f4d56f;
  transition: all 0.2s;
  cursor: pointer;
  text-align: center;

  animation: ${({ tradephase }) =>
    tradephase === EnumTradeType.open
      ? '#0.4s ease-out 0s 1 #92e204'
      : tradephase === EnumTradeType.digging
      ? ' 0.4s ease-out 0s 1 #f4d56f '
      : '0.4s ease-out 0s 1 #e02e2b'};

  @media screen and (max-width: 992px) {
    left: calc(50% - 2.5em);
    width: 5em;
    height: 5em;
    top: 1em;
  }
`;

const Timer: React.FC<TimerProps> = ({
  status = '',
  phase = {
    timer: 27,
    tradephase: EnumTradeType.open,
  },
  callback,
}) => {
  const timerToString = () => {
    let seconds = (phase.timer % 60).toString().slice(-2);
    return seconds;
  };

  useEffect(() => {
    let timeId: any;
    timeId = setTimeout(() => {
      callback?.();
    }, 1000);

    return () => clearTimeout(timeId);
  }, [phase]);

  console.log('tradephase', phase);
  return (
    <TimerStyled tradephase={phase.tradephase}>
      {status ? status : timerToString()}
    </TimerStyled>
  );
};

export { Timer };
