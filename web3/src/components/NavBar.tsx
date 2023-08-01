import React, { useRef } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'gatsby';
import { Web3Button } from '@web3modal/react';
import { Menu } from 'react-feather';

import { Container } from './Grid';

const ScHeader = styled.header`
  font-family: 'Inter', sans-serif;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 98;
  background: #0b0b0f;
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
  background: #0b0b0f;
  display: none;
  padding: 12px 24px;
  padding-bottom: 36px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media screen and (min-width: 1024px) {
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
  font-weight: bold;
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 20px;
  border: 1px solid gray;
  margin-bottom: 8px;

  &:hover {
    text-decoration: none;
    opacity: 0.75;
    color: white;
    background: #6527be;
  }

  > span {
    margin-left: 8px;
  }

  @media screen and (min-width: 1024px) {
    display: inline-block;
    border: none;
    margin-bottom: 0;
    margin-right: 8px;

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
  const refMenuController = useRef<HTMLInputElement>(null);

  return (
    <>
      <ScHeader>
        <Container>
          <ScNavBar>
            <ScLogo to="/">
              <img src="/images/icon.png" loading="eager" />
              Lotte.Fan
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
              <Menu size={24} />
            </ScMenuButton>

            <ScNavBarContent>
              <ScNavBarLeft>
                <ScNavLink to="/stake/">Stake</ScNavLink>
                <ScNavLink to="/airdrop/">Airdrop</ScNavLink>
                <ScNavLink to="/blog/">Blog</ScNavLink>
                <ScNavLink to="/vn/">Vn🇻🇳</ScNavLink>
                <ScNavLink to="/ph/">Ph🇵🇭</ScNavLink>
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
