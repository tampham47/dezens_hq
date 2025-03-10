import path from 'path';
import webpack from 'webpack';
import { createRemoteFileNode } from 'gatsby-source-filesystem';

import { Post } from './src/types/Post';
import { normalizeNotionFrontMatter } from './src/utils/normalizeNotionBlog';

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
  if (node.internal.type === 'MarkdownRemark') {
    const cover = node.frontmatter.cover[0];

    if (cover.file.url.startsWith('http')) {
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
          name: 'coverImageLocal',
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
              lang {
                name
              }
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
          cover: node.featuredImg.childImageSharp.fluid.srcWebp,
          markdown: true,
        };
      })
      .filter((i: any) => i.status === 'published');

    return allPosts.forEach((post: Post) => {
      createPage({
        path: `blog/${post.slug}`,
        component: path.resolve(`./src/templates/post.tsx`),
        context: {
          slug: post.slug,
          post: post,
        },
      });
    });
  });
};

export const onCreateWebpackConfig = ({ actions }: any) => {
  actions.setWebpackConfig({
    plugins: [
      new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, '');
      }),
    ],
    resolve: {
      fallback: {
        crypto: false,
      },
    },
  });
};
