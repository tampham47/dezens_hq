import React from 'react';
import styled from 'styled-components';
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
import { SEO } from '../components/SEO';

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

  return (
    <Layout>
      <ScRoot>
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

        <Container>
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8804973181721405"
            crossOrigin="anonymous"
          ></script>
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-8804973181721405"
            data-ad-slot="9390937807"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </Container>
      </ScRoot>
    </Layout>
  );
};

export const Head = ({ pageContext: context }: any) => {
  const post = context.post;
  const url = 'https://dezens.io';
  const link = `${url}/blog/${post.slug}`;
  const cover = `${url}${post.cover}`;
  const title = post.title;
  const desc = post.summary;

  return <SEO title={title} cover={cover} desc={desc} url={link} />;
};

export default PostTemplate;
