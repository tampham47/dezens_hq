import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import { Card } from "../components/Card";
import { Container } from "../components/Grid";
import { Layout } from "../components/Layout";
import { graphql } from "gatsby";
import { normalizeNotionFrontMatter } from "../utils/normalizeNotionBlog";

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

const BlogTemplate = ({ data }: any) => {
  console.log("data", data);

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
    .filter((i: any) => i.status === "published");

  return (
    <Layout>
      <ScRoot>
        <Helmet titleTemplate="%s">
          <title>Gatsby</title>
        </Helmet>

        <Container>
          <main>
            <p>
              Consectetur adipisicing deserunt reprehenderit irure ex. Sint
              eiusmod officia magna quis ea do. Aliquip reprehenderit non
              adipisicing dolore eu reprehenderit nisi laborum anim non irure ad
              ad. Proident in nulla cupidatat ex quis. Consectetur nulla sit ex
              esse ex irure id tempor velit consectetur voluptate ullamco.
              Nostrud laborum dolore ipsum dolor in non ipsum cupidatat commodo
              deserunt aliquip in qui tempor.
            </p>
            <p>
              Exercitation fugiat cillum eu ut incididunt laboris quis fugiat
              officia dolor veniam pariatur. Amet est nostrud aute ad dolor
              proident culpa ipsum voluptate veniam fugiat quis. Occaecat nisi
              elit sit sint officia amet. Ut est consequat ad velit consequat
              Lorem. Cupidatat mollit in magna minim cillum officia minim culpa
              occaecat incididunt occaecat aute fugiat aute.
            </p>
            <p>
              Ipsum tempor irure amet minim est quis ullamco ut. Excepteur
              tempor ipsum non ex reprehenderit. Dolor consectetur anim ut enim
              ipsum eu duis tempor sit mollit consectetur exercitation. Sunt
              dolore nisi sit dolor aliquip velit non non excepteur velit minim
              officia.
            </p>
          </main>
        </Container>

        <Container>
          <ScMain>
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

export default BlogTemplate;
