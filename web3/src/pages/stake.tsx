import React from 'react';
import styled from 'styled-components';
import { HeadFC, graphql } from 'gatsby';

import { Card } from '../components/Card';
import { Container, ScMain } from '../components/Grid';
import { Layout } from '../components/Layout';
import { normalizeNotionFrontMatter } from '../utils/normalizeNotionBlog';
import { Stake } from '../containers/Stake';
import { SEO } from '../components/SEO';

const ScRoot = styled.div`
  background-color: var(--darkmode);
  padding-top: 1px;
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
  {
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

const StakePage = ({ data }: any) => {
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
        <Container>
          <ScMain>
            <Stake />
          </ScMain>
        </Container>

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

export const Head: HeadFC = () => <SEO title="Stake | Dezens" />;

export default StakePage;
