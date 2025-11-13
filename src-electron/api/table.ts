import { omit } from 'lodash-es';
import { db } from './db';

export function patch(table: string, row: { id: number; [key: string]: unknown }) {
  let set = '';
  const keys = Object.keys(omit(row, ['id']));
  if (keys.length === 0) {
    return;
  }
  for (const key of keys) {
    set += `${set ? ',' : ''}${key} = @${key}`;
  }
  db.prepare(`UPDATE ${table} SET ${set} WHERE id = @id`).run(row);
}

export function list(table: string, options: unknown) {
  const p = Object.assign(
    {
      limit: 20,
      offset: 0,
      where: '',
      orderBy: [],
    },
    options,
  );
  return db
    .prepare(
      `SELECT * FROM ${table} ${p.where ? `WHERE ${p.where}` : ''}
      ${p.orderBy.length ? `ORDER BY ${p.orderBy.join(' ')}` : ''}
      LIMIT @limit
      OFFSET @offset`,
    )
    .all(p);
}
