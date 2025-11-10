import PouchDB from 'pouchdb-browser';
import pouchdbFind from 'pouchdb-find';
import { type Item } from './item';
PouchDB.plugin(pouchdbFind);

export const db = new PouchDB('data', {
  auto_compaction: true,
});
// void db
//   .createIndex({
//     index: {
//       fields: ['isoDate', 'type', 'feedId', 'read'],
//     },
//   })
//   .then(console.log);
// .then((res) => db.deleteIndex({ ddoc: res['id'], name: res['name'] }))
// .then(console.log);

const ddoc = {
  _id: '_design/items_by_date',
  views: {
    by_feed_type_date_read: {
      // emit key = [feedId, type, isoDate, read]
      map: function (doc: Item) {
        if (doc.type === 'item' && doc.feedId && doc.isoDate) {
          PouchDB.emit([doc.feedId, doc.type, doc.isoDate, doc.read || false] as unknown as
            | string
            | symbol);
        }
      }.toString(),
    },
  },
};

try {
  await db.put(ddoc);
} catch (err) {
  if (err instanceof Error && err.name !== 'conflict') throw err;
}

db.on('error', function (err: unknown) {
  console.error(err);
  debugger;
});
