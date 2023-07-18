export type Post = {
  id: string;
  slug: string;
  date: string;
  category: string;
  author: string;
  title: string;
  summary: string;
  cover: string;
  html: string;
  markdown: boolean;
  status: "draft" | "published";
};
