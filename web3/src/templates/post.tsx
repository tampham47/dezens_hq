import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import Img from "gatsby-image";

import { Container } from "../components/Grid";
import { Layout } from "../components/Layout";
import {
  ScCategoryText,
  ScContent,
  ScHeaderWrapper,
  ScHeader,
  ScMain,
} from "./styled";
import { normalizeNotionFrontMatter } from "../utils/normalizeNotionBlog";

const ScRoot = styled.div`
  background-color: var(--darkmode);
`;

const ScFeature = styled.div`
  margin-bottom: 3rem;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  img {
    max-width: 100%;
  }
`;

const PostTemplate = ({ data }: any) => {
  const { markdownRemark } = data; // data.markdownRemark holds our post data
  const { frontmatter: frontmatterSrc, html } = markdownRemark;
  const frontmatter = normalizeNotionFrontMatter(frontmatterSrc);
  const cover = frontmatter.cover;
  const link = `https://example.com/blog/${frontmatter.slug}`;

  return (
    <Layout>
      <ScRoot>
        <Helmet titleTemplate="%s | Blog">
          <title>{frontmatter.title}</title>
          <meta property="og:image" content={cover} />
          <meta property="og:url" content={link} />
          <meta property="og:title" content={frontmatter.title} />
          <meta property="og:description" content={frontmatter.summary} />
          <meta name="twitter:image" content={cover} />
          <meta name="twitter:url" content={link} />
          <meta name="twitter:title" content={frontmatter.title} />
          <meta name="twitter:description" content={frontmatter.summary} />
        </Helmet>
        <Container>
          <ScMain>
            <ScHeaderWrapper>
              <ScHeader>{frontmatter.title}</ScHeader>
              <ScCategoryText>{frontmatter.date}</ScCategoryText>
            </ScHeaderWrapper>

            <ScFeature>
              <Img
                fluid={markdownRemark.featuredImg.childImageSharp.fluid}
                alt={frontmatter.title}
              />
            </ScFeature>

            <ScContent className="post-full-content">
              <div
                className="post-content"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </ScContent>
          </ScMain>
        </Container>
      </ScRoot>
    </Layout>
  );
};

export default PostTemplate;

export const pageQuery = graphql`
  query ($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
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
        slug
        status {
          name
        }
        summary
        title
      }
    }
  }
`;
