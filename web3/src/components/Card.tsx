import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import Img from "gatsby-image";

import { Post } from "../types/Post";
import { ScAuthor } from "../templates/styled";

const ScMain = styled.div`
  max-width: 500px;
  margin-bottom: 4rem;

  @media screen and (min-width: 992px) {
    margin-left: 24px;
    margin-right: 24px;
    width: calc(33.33% - 48px);
    margin-bottom: 36px;
  }
`;

const ScFeatureImg = styled.div``;
const ScFeature = styled.div`
  margin-bottom: 16px;
  height: 220px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;

  ${ScFeatureImg} {
    width: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);

    img {
      width: 100%;
    }
  }

  @media screen and (min-width: 992px) {
    height: 240px;
  }
`;

const ScPanelContent = styled.div``;

const ScTitle = styled.h4`
  font-size: 18px;
  margin-bottom: 12px;

  a {
    color: white;

    &:hover {
      color: white;
    }
  }

  @media screen and (min-width: 992px) {
    margin-top: 16px;
    margin-top: 12px;
  }
`;

const ScOverview = styled.p`
  margin-top: 12px;
  margin-bottom: 0.5em;
  color: #b3b3b3;

  @media screen and (min-width: 992px) {
    margin-bottom: 12px;
  }
`;

type PtPostWithImage = Post & {
  featuredImg: any;
};

export const Card = ({ post }: { post: PtPostWithImage }) => {
  return (
    <ScMain>
      <ScFeature>
        <Link to={`/blog/${post.slug}`}>
          <ScFeatureImg>
            <Img fluid={post.featuredImg.childImageSharp.fluid} />
          </ScFeatureImg>
        </Link>
      </ScFeature>
      <ScPanelContent>
        <ScTitle>
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </ScTitle>
        <ScOverview>{post.summary}</ScOverview>
        <ScAuthor>{post.date ? <span>{post.date}</span> : null}</ScAuthor>
      </ScPanelContent>
    </ScMain>
  );
};
