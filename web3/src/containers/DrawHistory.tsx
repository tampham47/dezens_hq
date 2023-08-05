import React, { useEffect, useState } from 'react';
import { ScListItem } from '../components/Stack';
import { ScBlock, ScRow } from '../components/Common';
import { getShortAddress } from '../utils/address';
import styled from 'styled-components';
import { DrawInformation, LfxLotte } from '../apis/lfx-lotte';

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

const getTicketByNumber = (ticketNumber: number) => {
  const aa = Math.floor(ticketNumber / 60);
  const bb = ticketNumber % 60;
  return `${aa.toString().padStart(2, '0')}:${bb.toString().padStart(2, '0')}`;
};

export const DrawHistory = ({ index }: { index: number }) => {
  const [lastDraw, setLastDraw] = useState<DrawInformation>();

  useEffect(() => {
    (async () => {
      if (index < 0) return;
      const draw = await LfxLotte.getDrawByIndex(index);
      setLastDraw(draw);
    })();
  }, []);

  if (index < 0) {
    return '';
  }

  return (
    <ScListItem>
      <ScBlock>
        <h4>Round #{index}</h4>
        <ScRow>
          <p>Conducted by:</p>
          <a
            href={`${process.env.GATSBY_ETHER_SCAN}/address/${lastDraw?.actor}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {getShortAddress(lastDraw?.actor || '')}
          </a>
        </ScRow>
        <ScRow>
          <p>Time: </p>
          <p>{lastDraw?.timestamp}</p>
        </ScRow>
        <ScRow>
          <p>Winning Ticket:</p>
          <ScTicket style={{ marginRight: 0, marginBottom: 0 }}>
            {getTicketByNumber(lastDraw?.winningNumber || 0)}
          </ScTicket>
        </ScRow>
        <ScRow>
          <p>Winner Count:</p>
          <p>
            {lastDraw?.winnerCount === 0 ? 'No Winner' : lastDraw?.winnerCount}
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
      </ScBlock>
    </ScListItem>
  );
};
