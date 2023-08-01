import React from 'react';
import styled from 'styled-components';
import { IconChevronRight } from '@tabler/icons-react';

const ScLink = styled.a`
  background-color: #8062d6;
  padding: 16px 24px;
  border-radius: 8px;
  display: block;
  font-weight: bold;
  text-align: center;
  font-size: 18px;
  line-height: 24px;
  transition: all 0.3s;
  margin-top: 2rem;

  &:hover {
    text-decoration: none;
    background-color: #6527be;
  }
`;

export const BuyLfx = () => {
  return (
    <ScLink
      href="https://app.uniswap.org/#/swap?chain=polygon&inputCurrency=ETH&outputCurrency=0xd0b2c5834816f9884a537482F92F1A41d356aDfE"
      target="_blank"
      rel="noopener noreferrer"
    >
      Buy LFX
      <IconChevronRight size={24} />
    </ScLink>
  );
};
