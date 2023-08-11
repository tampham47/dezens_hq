import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import Img from 'gatsby-image';

import { Container } from '../components/Grid';
import { Layout } from '../components/Layout';
import {
  ScCategoryText,
  ScContent,
  ScHeaderWrapper,
  ScHeader,
  ScMain,
} from './styled';

const ScRoot = styled.div`
  background-color: var(--darkmode);
`;

const ScFeature = styled.div`
  margin-bottom: 3rem;
  text-align: center;
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;

  img {
    max-width: 100%;
  }
`;

const PostTemplate = ({ pageContext: context }: any) => {
  const post = context.post;
  const cover = post.cover;
  const link = `https://dezens.io/blog/${post.slug}`;

  return (
    <Layout>
      <ScRoot>
        <Helmet titleTemplate="%s | Blog" key={post.slug}>
          <title>{post.title}</title>
          <meta property="og:image" content={cover} />
          <meta property="og:url" content={link} />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.summary} />
          <meta name="twitter:image" content={cover} />
          <meta name="twitter:url" content={link} />
          <meta name="twitter:title" content={post.title} />
          <meta name="twitter:description" content={post.summary} />
        </Helmet>
        <Container>
          <ScMain>
            <ScHeaderWrapper>
              <ScHeader>{post.title}</ScHeader>
              <ScCategoryText>{post.date}</ScCategoryText>
            </ScHeaderWrapper>

            <ScFeature>
              <Img
                fluid={post.featuredImg.childImageSharp.fluid}
                alt={post.title}
              />
            </ScFeature>

            <ScContent className="post-full-content">
              <div
                className="post-content"
                dangerouslySetInnerHTML={{ __html: post.html }}
              />
            </ScContent>
          </ScMain>
        </Container>
      </ScRoot>
    </Layout>
  );
};

export default PostTemplate;
