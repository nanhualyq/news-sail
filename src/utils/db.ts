import PouchDB from 'pouchdb-browser';
import pouchdbFind from 'pouchdb-find';
PouchDB.plugin(pouchdbFind);

export const db = new PouchDB('data', {
  auto_compaction: true,
});
void db.createIndex({
  index: {
    fields: ['isoDate', 'type', 'feedId'],
  },
});
