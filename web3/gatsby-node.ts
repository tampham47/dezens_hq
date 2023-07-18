import path from "path";

import { Post } from "./src/types/Post";
import { normalizeNotionFrontMatter } from "./src/utils/normalizeNotionBlog";
import { createRemoteFileNode } from "gatsby-source-filesystem";

export const createSchemaCustomization = ({ actions }: any) => {
  const { createTypes } = actions;

  createTypes(`
    type MarkdownRemark implements Node {
      featuredImg: File @link(from: "fields.coverImageLocal")
    }
  `);
};

export const onCreateNode = async ({
  node,
  actions: { createNode, createNodeField },
  createNodeId,
  getCache,
}: any) => {
  if (node.internal.type === "MarkdownRemark") {
    const cover = node.frontmatter.cover[0];

    if (cover.file.url.startsWith("http")) {
      const fileNode = await createRemoteFileNode({
        url: cover.file.url,
        parentNodeId: node.id,
        createNode,
        createNodeId,
        getCache,
      });

      if (fileNode) {
        createNodeField({
          node: node,
          name: "coverImageLocal",
          value: fileNode.id,
        });
      }
    }
  }
};

export const createPages = ({ actions, graphql }: any) => {
  const { createPage } = actions;

  return graphql(`
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
  `).then((result: any) => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    const allPosts: Post[] = result.data.allMarkdownRemark.edges
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

    return allPosts.forEach((post: Post) => {
      createPage({
        path: `blog/${post.slug}`,
        component: path.resolve(`./src/templates/post.tsx`),
        context: {
          slug: post.slug,
        },
      });
    });
  });
};
