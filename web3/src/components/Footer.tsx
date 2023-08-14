import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

import { Container } from './Grid';
import { ScContent as ScContentSrc } from '../templates/styled';

const ScContent = styled(ScContentSrc)`
  margin-left: initial;
  max-width: 780px;

  p {
    font-size: 16px;
  }

  h3,
  h4 {
    margin-top: 1em;
    margin-bottom: 1em;
  }

  a {
    color: white;
    opacity: 0.75;
  }
`;

const ScGroup = styled.div`
  display: flex;
  flex-direction: column-reverse;

  > div {
    margin-bottom: 2rem;
  }

  @media screen and (min-width: 992px) {
    display: flex;
    flex-direction: row;

    > div {
      flex: 1;
      margin-right: 24px;
      margin-bottom: 1rem;

      &:first-child {
        flex: 2;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
`;

const ScMain = styled.footer`
  font-size: 16px;
  color: #d6d7dc;
  background: #0b0b0f;
  padding-top: 100px;
  padding-bottom: 48px;
`;

const ScMark = styled.div`
  opacity: 0.5;
  margin-top: 1rem;
`;

export const Footer = () => {
  return (
    <ScMain>
      <Container>
        <ScGroup>
          <div>
            <ScContent>
              <h3>Dezens</h3>
              <p>
                <span>Truly decentralized applications for degens</span>
              </p>
            </ScContent>
          </div>
          <div>
            <ScContent>
              <h3>Contact</h3>
              🔥{' '}
              <a href="https://t.me/dezens_io" target="_blank">
                Telegram
              </a>
              <br />
              🐦{' '}
              <a href="https://twitter.com/heydezens" target="_blank">
                Twitter
              </a>
              <br />
              🍏{' '}
              <a href="https://t.me/xaolonist" target="_blank">
                OTC Trading - DM
              </a>
              <br />
              💌{' '}
              <a href="mailto:heydezens@gmail.com" target="_blank">
                heydezens@gmail.com
              </a>
            </ScContent>
          </div>
          <div>
            <ScContent>
              <h3>Links</h3>
              🌍 
              <a
                href="https://dezens.io/blog/dezens-white-paper/"
                target="_blank"
              >
                Dezens White Paper
              </a>
              <br />
              ⛓️ 
              <a
                href="https://dezens.io/blog/official-contracts/"
                target="_blank"
              >
                Official Contracts
              </a>
              <br />
              😤 <Link to="/blog/faq">FAQ</Link>
            </ScContent>
          </div>
          <div>
            <ScContent>
              <h3>Apps</h3>
              💦 <Link to="/airdrop">Airdrop Round #1</Link>
            </ScContent>
          </div>
        </ScGroup>
      </Container>

      <Container>
        <ScContent>
          <ScMark>@2023 Dezens</ScMark>
        </ScContent>
      </Container>
    </ScMain>
  );
};
