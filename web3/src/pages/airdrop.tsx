import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

import { Container, ScMain } from '../components/Grid';
import { Layout } from '../components/Layout';
import { Airdrop } from '../containers/Airdrop';

const ScRoot = styled.div`
  background-color: var(--darkmode);
  padding-top: 1px;
`;

const AirdropPage = () => {

  return (
    <Layout>
      <ScRoot>
        <Helmet>
          <title>Airdrop | Dezens</title>
        </Helmet>

        <Container>
          <ScMain>
            <Airdrop />
          </ScMain>
        </Container>
      </ScRoot>
    </Layout>
  );
};

export default AirdropPage;
