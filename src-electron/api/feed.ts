import Parser from 'rss-parser';
import { db } from './db';

export async function add(url: string) {
  const feed = await getRss(url);
  const res = db
    .prepare('INSERT INTO feed (link, title, description, icon) VALUES (?, ?, ?, ?)')
    .run(feed.feedUrl || url, feed.title || url, feed.description, feed.image?.url);
  addArticles(res.lastInsertRowid, feed.items);
  return res;
}

async function getRss(url: string) {
  const parser = new Parser();
  const feed = await parser.parseURL(url);
  return feed;
}

function addArticles(feed_id: number | bigint, items: Parser.Item[]) {
  const insert = db.prepare(
    'INSERT OR IGNORE INTO article (feed_id, link, title, pubDate, creator, summary, content, contentSnippet, enclosure) VALUES (?, @link, @title, @isoDate, @creator, @summary, @content, @contentSnippet, @enclosure)',
  );
  const insertMany = db.transaction((items: Parser.Item[]) => {
    for (const item of items) {
      const itemWithDefault = Object.assign({ creator: '', summary: '', enclosure: '' }, item);
      insert.run(feed_id, itemWithDefault);
    }
  });
  insertMany(items);
}

export function list() {
  return db.prepare('SELECT * FROM feed').all();
}

export async function fetch(feed: { id: number; link: string }) {
  const res = await getRss(feed.link);
  addArticles(feed.id, res.items);
}

export function deleteRow(id: number) {
  db.prepare('DELETE FROM feed WHERE id = ?').run(id);
}
