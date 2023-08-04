import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

import { Container, ScMain } from '../components/Grid';
import { Layout } from '../components/Layout';
import { Stake } from '../containers/Stake';

const ScRoot = styled.div`
  background-color: var(--darkmode);
  padding-top: 1px;
`;

const StakePage = () => {
  return (
    <Layout>
      <ScRoot>
        <Helmet>
          <title>Stake | Dezens</title>
        </Helmet>

        <Container>
          <ScMain>
            <Stake />
          </ScMain>
        </Container>
      </ScRoot>
    </Layout>
  );
};

export default StakePage;
