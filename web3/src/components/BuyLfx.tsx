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
      href="https://spooky.fi/#/swap?outputCurrency=0x3C5BD56dF41A4a7f6c3BaFe5FFFd3d832d699f4F&inputCurrency=ETH"
      target="_blank"
      rel="noopener noreferrer"
    >
      Buy DEZ
      <IconChevronRight size={24} />
    </ScLink>
  );
};
