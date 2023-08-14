import React from 'react';
import styled from 'styled-components';

import { Container as ContainerSrc, ScMain } from '../../components/Grid';

import imgDezens from './star-shape.png';
import imgDez from './circle-shape.png';
import imgEcosystem from './spring-shape.png';

const Container = styled(ContainerSrc)`
  max-width: 960px;
  margin-bottom: 4rem;

  @media screen and (min-width: 960px) {
    margin-bottom: 8rem;
  }
`;

const ScHeader = styled.div`
  margin-bottom: 2rem;

  @media screen and (min-width: 960px) {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    margin-bottom: 4rem;
  }
`;
const ScHeaderImg = styled.div`
  flex: 2;

  @media screen and (min-width: 960px) {
    min-height: 384px;
  }
`;
const ScHeaderContent = styled.div`
  flex: 3;
  margin-bottom: 4rem;

  h1 {
    line-height: 1.4;
    font-size: 28px;
  }

  @media screen and (min-width: 960px) {
    h1 {
      font-size: 32px;
    }
  }
`;

const ScRow = styled.div`
  margin-bottom: 2rem;

  @media screen and (min-width: 960px) {
    display: flex;
    align-items: center;
    margin-bottom: 4rem;
  }
`;
const ScRowReverse = styled(ScRow)`
  @media screen and (min-width: 960px) {
    flex-direction: row-reverse;
  }
`;
const ScRowImg = styled.div`
  flex: 2;
  text-align: center;

  img {
    width: 70%;
    max-width: 220px;
  }
`;
const ScRowContent = styled.div`
  flex: 5;
  font-size: 17px;
  line-height: 1.6;

  h3 {
    margin-bottom: 0.25em;
  }
`;

export const DezensIntro = () => {
  return (
    <Container>
      <ScMain>
        <ScHeader>
          <ScHeaderImg>
            <lottie-player
              src="/dezens/man-working-on-nft-blockchain.json"
              background="transparent"
              style={{ width: '100%' }}
              speed="1"
              loop
              autoplay
            />
          </ScHeaderImg>
          <ScHeaderContent>
            <h1>Truly decentralized applications for&nbsp;degens.</h1>
          </ScHeaderContent>
        </ScHeader>

        <ScRow>
          <ScRowImg>
            <img src={imgDezens} />
          </ScRowImg>
          <ScRowContent>
            <h3>About Dezens</h3>
            Dezens is a blockchain application development company focused on
            bringing blockchain applications closer to the daily lives of
            everyone. We specialize in decentralized small games that take less
            than 5 minutes for one&nbsp;round.
          </ScRowContent>
        </ScRow>

        <ScRowReverse>
          <ScRowImg>
            <img src={imgDez} />
          </ScRowImg>
          <ScRowContent>
            <h3>$DEZ Token</h3>
            DEZ is an ERC20 token that will be used as the center of all of
            Dezens' smart contracts. A certain amount of DEZ will be burned from
            the revenue of the&nbsp;applications.
          </ScRowContent>
        </ScRowReverse>

        <ScRow>
          <ScRowImg>
            <img src={imgEcosystem} />
          </ScRowImg>
          <ScRowContent>
            <h3>Ecosystem</h3>
            Dezens plans to develop many smart contracts in which the DEZ token
            is the center. Almost profit from applications will be sent to the Vault to share with the
            stakers who trust&nbsp;Dezens.
          </ScRowContent>
        </ScRow>
      </ScMain>
    </Container>
  );
};
