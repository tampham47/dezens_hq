import React from "react";
import styled, { css } from "styled-components";
import { Link } from "gatsby";

import { Container } from "./Grid";

const ScHeader = styled.header`
  font-family: "Inter", sans-serif;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 98;
  background: #0b0b0f;
`;

const ScNavBar = styled.nav`
  display: flex;
  align-items: center;
  height: 64px;
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

const ScLinkComp = css`
  color: #f7f8f8;
  font-size: 14px;
  line-height: 1.4;
  line-height: 40px;
  margin-right: 24px;
  transition: all 0.3s;
  display: block;
  user-select: none;
  font-weight: bold;
  height: 40px;
  line-height: 40px;
  padding-left: 24px;
  padding-right: 24px;
  border-radius: 6px;

  &:hover {
    text-decoration: none;
    opacity: 0.75;
    color: #d8e9a8;
    background: #1e5128;
  }

  > span {
    margin-left: 8px;
  }

  @media screen and (min-width: 1024px) {
    display: inline-block;

    > span {
      display: none;
    }
  }
`;

const ScNavLink = styled(Link)`
  ${ScLinkComp}
`;

export const NavBar = () => {
  return (
    <>
      <ScHeader>
        <Container>
          <ScNavBar>
            <ScLogo to="/">
              <img src="/images/icon.png" loading="eager" />
              Gatsby
            </ScLogo>
            <ScNavLink to="/blog/">Blog</ScNavLink>
          </ScNavBar>
        </Container>
      </ScHeader>

      <div style={{ height: 64 }}></div>
    </>
  );
};
