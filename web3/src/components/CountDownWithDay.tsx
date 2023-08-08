import React, { useState, useEffect, memo } from 'react';
import styled from 'styled-components';

const ScBox = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 4px;
  background-color: #251749;
  font-size: 24px;

  @media screen and (min-width: 960px) {
    padding: 12px 16px;
    font-size: 28px;
  }
`;

const dayInSeconds = 86400;

export const CountDownWithDay = memo(
  ({ targetTime }: { targetTime: number }) => {
    const [totalTime, setTotalTime] = useState<number>(0);

    const dd = Math.floor(totalTime / dayInSeconds);
    const totalHH = totalTime - dd * dayInSeconds;
    const hh = Math.floor(totalHH / (60 * 60));
    const mm = Math.floor((totalHH - hh * 60 * 60) / 60);
    const ss = (totalHH % 60).toString().padStart(2, '0');

    const ddString = dd.toString().padStart(2, '0');
    const hhString = hh.toString().padStart(2, '0');
    const mmString = mm.toString().padStart(2, '0');
    const ssString = ss.toString().padStart(2, '0');

    useEffect(() => {
      setInterval(() => {
        const ts = Math.floor(Date.now() / 1000);
        const countdown = targetTime - ts;
        setTotalTime(Math.max(0, countdown));
      }, 1000);
    }, []);

    return (
      <span>
        <ScBox>
          {ddString}
          {dd > 1 ? 'DAYS' : 'DAY'}
        </ScBox>{' '}
        <ScBox>{hhString}</ScBox>:<ScBox>{mmString}</ScBox>:
        <ScBox>{ssString}</ScBox>
      </span>
    );
  }
);
