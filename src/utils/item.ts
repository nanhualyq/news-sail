export type Item = {
  id: number;
  feed_id?: number;
  starred?: number;
  cover?: string;
  link?: string;
  title?: string;
  content?: string;
  contentSnippet?: string;
  pubDate?: string;
  isoDate?: string;
  read?: number;
};
