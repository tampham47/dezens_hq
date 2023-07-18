import React from "react";
import styled from "styled-components";

import { Container } from "./Grid";

const ScMain = styled.footer`
  font-size: 16px;
  color: #d6d7dc;
  background: #0b0b0f;
  padding-top: 100px;
  padding-bottom: 48px;

  a {
    color: #d6d7dc;

    &:active {
      color: #d6d7dc;
    }
  }
`;

const ScContent = styled.div`
  @media screen and (min-width: 992px) {
    display: flex;
    align-items: center;
  }
`;

export const Footer = () => {
  return (
    <ScMain>
      <Container>
        <ScContent>
          <div>@2023 Gatsby</div>
        </ScContent>
      </Container>
    </ScMain>
  );
};
