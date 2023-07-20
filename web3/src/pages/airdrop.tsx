import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

import { Card } from '../components/Card';
import { Container } from '../components/Grid';
import { Layout } from '../components/Layout';
import { graphql } from 'gatsby';
import { normalizeNotionFrontMatter } from '../utils/normalizeNotionBlog';
import airdrop from '../apis/lfx-airdrop';

const ScRoot = styled.div`
  background-color: var(--darkmode);
  padding-top: 1px;
`;

const ScMain = styled.div`
  margin-top: 3rem;
  margin-bottom: 5rem;

  @media screen and (min-width: 992px) {
    margin-top: 3rem;
    margin-bottom: 10rem;
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
          }
        }
      }
    }
  }
`;

const Airdrop = ({ data }: any) => {
  const [count, setCount] = useState<number>();
  const [depositAmount, setDepositAmount] = useState<number>();
  const [isWithdrawable, setIsWithdrawable] = useState<boolean>(false);

  useEffect(() => {
    airdrop.getParticipantsCount().then((res) => {
      console.log('getParticipantsCount', res);
      setCount(Number(res));
    });

    airdrop.getDepositAmount().then((res) => {
      console.log('getDepositAmount', res);
      setDepositAmount(Number(res / BigInt(Math.pow(10, 18))));
    });

    airdrop.getIsWithdrawable().then((res) => {
      console.log('getIsWithdrawable', res);
      setIsWithdrawable(res);
    });
  });

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
    .filter((i: any) => i.status === 'published');

  return (
    <Layout>
      <ScRoot>
        <Helmet>
          <title>Airdrop | Lotte.Fan</title>
        </Helmet>

        <Container>
          <ScMain>
            <h2>
              Airdrop {count} - {depositAmount} -{' '}
              {isWithdrawable ? 'TRUE' : 'FALSE'}
            </h2>

            <ScPostList>
              {posts.map((i) => (
                <Card key={i.id} post={i} />
              ))}
            </ScPostList>
          </ScMain>
        </Container>
      </ScRoot>
    </Layout>
  );
};

export default Airdrop;
