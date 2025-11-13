import Database from 'better-sqlite3';

let options = {};

if (process.env.DEV) {
  options = { verbose: console.log };
}

export const db = new Database('data.db', options);
if (process.env.PROD) {
  db.pragma('journal_mode = WAL');
}

const migration = `
CREATE TABLE IF NOT EXISTS feed (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  link TEXT NOT NULL UNIQUE,
  title TEXT,
  icon TEXT,
  description TEXT,
  category TEXT
);
CREATE TABLE IF NOT EXISTS article (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  feed_id INTEGER,
  link TEXT NOT NULL UNIQUE,
  title TEXT,
  pubDate DATETIME,
  creator TEXT,
  summary TEXT,
  content TEXT,
  contentSnippet TEXT,
  enclosure TEXT,
  read INTEGER DEFAULT 0,
  starred INTEGER DEFAULT 0,
  FOREIGN KEY (feed_id) REFERENCES feed (id) ON DELETE CASCADE
);
`;
db.exec(migration);
