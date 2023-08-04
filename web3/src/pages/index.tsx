import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

import { Container, ScMain } from '../components/Grid';
import { Layout } from '../components/Layout';
import { Lotte } from '../containers/Lotte';

const ScRoot = styled.div`
  background-color: var(--darkmode);
  padding-top: 1px;
`;

const BlogTemplate = () => {
  return (
    <Layout>
      <ScRoot>
        <Helmet titleTemplate="%s">
          <title>Dezens</title>
        </Helmet>

        <Container>
          <ScMain>
            <Lotte />
          </ScMain>
        </Container>
      </ScRoot>
    </Layout>
  );
};

export default BlogTemplate;
