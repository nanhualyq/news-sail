export type Item = {
  _id: string;
  _rev: string;
  type?: string;
  star?: boolean;
  cover?: string;
  link?: string;
  title?: string;
  content?: string;
  contentSnippet?: string;
  pubDate?: string;
  feedId?: string;
};
