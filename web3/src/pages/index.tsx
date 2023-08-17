import React from 'react';
import styled from 'styled-components';

import { Card } from '../components/Card';
import { Container, ScMain } from '../components/Grid';
import { Layout } from '../components/Layout';
import { HeadFC, graphql } from 'gatsby';
import { normalizeNotionFrontMatter } from '../utils/normalizeNotionBlog';
import { SEO } from '../components/SEO';
import { DezensIntro } from '../containers/dezens/dezens';

const ScRoot = styled.div`
  background-color: var(--darkmode);
  padding-top: 1px;
  margin-top: 2rem;

  @media screen and (min-width: 992px) {
    margin-top: 4rem;
  }
`;

const ScPostList = styled.div`
  @media screen and (min-width: 992px) {
    display: flex;
    flex-wrap: wrap;
    margin-left: -24px;
    margin-right: -24px;
  }
`;

export const pageQuery = graphql`
  query IndexPageQuery {
    imgBanner: file(relativePath: { eq: "dezens/cover-bg.png" }) {
      childImageSharp {
        fluid(maxWidth: 500, quality: 100) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    imgDezens: file(relativePath: { eq: "dezens/star-shape.png" }) {
      childImageSharp {
        fluid(maxWidth: 500, quality: 100) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    imgDez: file(relativePath: { eq: "dezens/circle-shape.png" }) {
      childImageSharp {
        fluid(maxWidth: 500, quality: 100) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    imgEcosystem: file(relativePath: { eq: "dezens/spring-shape.png" }) {
      childImageSharp {
        fluid(maxWidth: 500, quality: 100) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { publish_date: { start: DESC } } }
      limit: 1000
    ) {
      edges {
        node {
          featuredImg {
            childImageSharp {
              fluid(maxWidth: 800, quality: 100) {
                base64
                aspectRatio
                src
                srcSet
                srcWebp
                srcSetWebp
                sizes
              }
            }
          }
          frontmatter {
            slug
            status {
              name
            }
            title
            author {
              name
            }
            category {
              name
            }
            cover {
              file {
                url
              }
              name
            }
            publish_date {
              start(formatString: "MMMM DD, YYYY")
            }
            summary
            lang {
              name
            }
          }
        }
      }
    }
  }
`;

const BlogTemplate = ({ data }: any) => {
  const posts: any[] = data.allMarkdownRemark.edges
    .map(({ node }: any) => {
      const frontmatter = normalizeNotionFrontMatter(node.frontmatter);
      return {
        ...node,
        ...frontmatter,
        cover: frontmatter.cover,
        markdown: true,
      };
    })
    .filter(
      (i: any) =>
        i.status === 'published' && i.lang === 'en' && i.category === 'blog'
    );

  return (
    <Layout>
      <ScRoot>
        <DezensIntro data={data} />

        <Container>
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

        <Container>
          <ScMain>
            <h3>News</h3>
            <ScPostList>
              {posts.slice(0, 3).map((i) => (
                <Card key={i.slug} post={i} />
              ))}
            </ScPostList>
          </ScMain>
        </Container>
      </ScRoot>
    </Layout>
  );
};

export const Head: HeadFC = () => (
  <SEO title="Dezens">
    <script src="https://unpkg.com/@dotlottie/player-component@1.0.0/dist/dotlottie-player.js" />
    <link rel="preload" href="/images/dezens/llayhwtg.lottie" as="fetch" />
  </SEO>
);

export default BlogTemplate;
