import React, { useRef } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'gatsby';
import { Web3Button } from '@web3modal/react';
import { IconMenu } from '@tabler/icons-react';

import { Container } from './Grid';
import { useWalletClient } from 'wagmi';
import { contractConfig } from '../contracts';

const ScHeader = styled.header`
  font-family: 'Inter', sans-serif;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 98;

  background: #000428;
  background: linear-gradient(to right, #004e92, #000428);
`;

const ScMenuController = styled.input`
  visibility: hidden;
  width: 0;
  flex: 1;

  @media screen and (min-width: 1024px) {
    flex: none;
  }
`;
const ScNavBarContent = styled.div`
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  display: none;
  padding: 12px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: #232526;
  padding-top: 2rem;

  @media screen and (min-width: 1024px) {
    padding-top: 12px;
    background: transparent;
    position: static;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
    padding: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: 0;
  }
`;
const ScNavBar = styled.nav`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 64px;

  ${ScMenuController}:checked ~ ${ScNavBarContent} {
    display: block;
  }

  @media screen and (min-width: 1024px) {
    ${ScMenuController}:checked ~ ${ScNavBarContent} {
      display: flex;
    }
  }
`;
const ScNavBarLeft = styled.div`
  flex: 1;
  margin-bottom: 1rem;

  @media screen and (min-width: 1024px) {
    margin-bottom: 0;
  }
`;
const ScNavBarRight = styled.div`
  display: none;
  flex: none;

  @media screen and (min-width: 1024px) {
    display: initial;
  }
`;

const ScLinkComp = css`
  color: #f7f8f8;
  font-size: 14px;
  line-height: 1.4;
  line-height: 40px;
  transition: all 0.3s;
  display: block;
  user-select: none;
  height: 40px;
  line-height: 40px;
  margin-bottom: 8px;
  border-radius: 4px;
  font-size: 16px;
  padding-left: 20px;
  padding-right: 20px;

  &:hover {
    text-decoration: none;
    opacity: 0.75;
    color: black;
    background: #7dd2f0;
  }

  > span {
    margin-left: 8px;
  }

  @media screen and (min-width: 1024px) {
    display: inline-block;
    border: none;
    margin-bottom: 0;
    margin-right: 8px;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 20px;

    > span {
      display: none;
    }
  }
`;

const ScNavLink = styled(Link)`
  ${ScLinkComp}
`;

const ScMenuButton = styled.button`
  padding: 8px 12px;
  background: transparent;
  border-radius: 4px;
  border: 0;
  color: white;
  cursor: pointer;
  margin-left: 8px;
  margin-right: -12px;

  @media screen and (min-width: 1024px) {
    display: none;
  }
`;

const ScLogo = styled(Link)`
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-right: 24px;
  font-size: 17px;

  img {
    height: 32px;
    margin-right: 8px;
  }

  &:hover {
    text-decoration: none;
  }
`;

const ScMobileOnly = styled.div`
  @media screen and (min-width: 1024px) {
    display: none;
  }
`;

export const NavBar = () => {
  const { data: walletClient } = useWalletClient();
  const refMenuController = useRef<HTMLInputElement>(null);

  const addDezIntoMetamask = async () => {
    if (!walletClient) {
      return;
    }

    try {
      await walletClient.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: contractConfig.Lfx.Token,
            symbol: 'DEZ',
            decimals: 18,
            image: 'https://dezens.io/images/dezens-420.png',
          },
        },
      });
    } catch (err) {
      console.log('err', err);
    }
  };

  return (
    <>
      <ScHeader>
        <Container>
          <ScNavBar>
            <ScLogo to="/">
              <img src="/images/icon.png" loading="eager" />
              Dezens
            </ScLogo>

            <ScMenuController
              type="checkbox"
              name="menu-controller"
              ref={refMenuController}
            />

            <ScMobileOnly>
              <Web3Button />
            </ScMobileOnly>

            <ScMenuButton
              onClick={() => {
                if (!refMenuController?.current) {
                  return;
                }

                refMenuController.current.checked =
                  !refMenuController.current.checked ?? false;
              }}
            >
              <IconMenu size={24} />
            </ScMenuButton>

            <ScNavBarContent>
              <ScNavBarLeft>
                <ScNavLink to="/stake/">Stake</ScNavLink>
                <ScNavLink to="/airdrop/">Airdrop</ScNavLink>
                <ScNavLink to="/blog/">Blog</ScNavLink>
                <ScNavLink to="#" onClick={addDezIntoMetamask}>
                  Add $DEZ to your wallet
                </ScNavLink>
              </ScNavBarLeft>

              <ScNavBarRight>
                <Web3Button />
              </ScNavBarRight>
            </ScNavBarContent>
          </ScNavBar>
        </Container>
      </ScHeader>

      <div style={{ height: 64 }}></div>
    </>
  );
};
