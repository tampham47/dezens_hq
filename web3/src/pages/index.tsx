import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

import { Card } from '../components/Card';
import { Container, ScMain } from '../components/Grid';
import { Layout } from '../components/Layout';
import { graphql } from 'gatsby';
import { normalizeNotionFrontMatter } from '../utils/normalizeNotionBlog';
import { Lotte } from '../containers/Lotte';

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
        <Helmet titleTemplate="%s">
          <title>Dezens</title>
        </Helmet>

        <Container>
          <ScMain>
            <Lotte />
          </ScMain>
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

export default BlogTemplate;
