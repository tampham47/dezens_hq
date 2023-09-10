import React from 'react';
import styled from 'styled-components';
import { InvestProps } from '../types';

const StatsStyled = styled.div<{ active: boolean; status: boolean }>`
  display: flex;
  align-items: center;
  width: 11%;
  height: 2.85em;
  padding-left: 0.5em;
  cursor: ${({ status }) => (status ? 'pointer' : 'disabled')};
  border: solid 0.1em rgba(245, 205, 72, 0.6);
  background-color: ${({ active }) =>
    active ? '#f4d56f' : 'rgba(12, 13, 19, 0.18)'};
  border-radius: 0.4em;
  @media screen and (max-width: 992px) {
    height: 1.85em;
    font-size: 0.7em;
  }
`;

const Invest: React.FC<InvestProps> = ({
  active = false,
  betPrice = 5,
  callback,
  status = false,
}) => {
  return (
    <StatsStyled
      active={active}
      status={status}
      onClick={() => callback?.(betPrice)}
    >
      $ {betPrice}
    </StatsStyled>
  );
};

export { Invest };
