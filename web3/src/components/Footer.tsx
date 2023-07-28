import React from 'react';
import styled from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';

import { Container } from './Grid';
import { normalizeNotionFrontMatter } from '../utils/normalizeNotionBlog';
import { Post } from '../types/Post';
import { ScContent as ScContentSrc } from '../templates/styled';

const ScContent = styled(ScContentSrc)`
  margin-left: initial;
  max-width: 780px;

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

  @media screen and (min-width: 992px) {
    display: flex;
    flex-direction: row;

    > div {
      flex: 1;
      margin-right: 24px;

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
    <StaticQuery
      query={graphql`
        {
          allMarkdownRemark(
            sort: { frontmatter: { publish_date: { start: DESC } } }
            limit: 1000
          ) {
            edges {
              node {
                html
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
      `}
      render={(data) => {
        const posts: Post[] = data.allMarkdownRemark.edges
          .map(({ node }: any) => {
            const frontmatter = normalizeNotionFrontMatter(node.frontmatter);
            return {
              ...node,
              ...frontmatter,
              cover: frontmatter.cover,
              markdown: true,
            };
          })
          .filter((i: any) => i.status === 'published');

        const contactPost = posts.find((i) => i.slug === 'x-footer01');
        const servicePost = posts.find((i) => i.slug === 'x-footer02');
        const partnerPost = posts.find((i) => i.slug === 'x-footer03');

        return (
          <ScMain>
            <Container>
              <ScGroup>
                <div>
                  <ScContent>
                    <div
                      className="post-content"
                      dangerouslySetInnerHTML={{
                        __html: contactPost?.html ?? '',
                      }}
                    />
                  </ScContent>
                </div>
                <div>
                  <ScContent>
                    <div
                      className="post-content"
                      dangerouslySetInnerHTML={{
                        __html: servicePost?.html ?? '',
                      }}
                    />
                  </ScContent>
                </div>
                <div>
                  <ScContent>
                    <div
                      className="post-content"
                      dangerouslySetInnerHTML={{
                        __html: partnerPost?.html ?? '',
                      }}
                    />
                  </ScContent>
                </div>
              </ScGroup>
            </Container>

            <Container>
              <ScContent>
                <ScMark>@2023 Lotte.Fan</ScMark>
              </ScContent>
            </Container>
          </ScMain>
        );
      }}
    />
  );
};
