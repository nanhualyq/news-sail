import { db } from './db';

export function deleteByFeed(feedId: number) {
  return db.prepare('DELETE FROM article WHERE feed_id = ?').run(feedId);
}
