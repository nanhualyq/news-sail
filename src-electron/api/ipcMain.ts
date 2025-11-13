import { ipcMain } from 'electron';
import { type FetchOptions } from './bridge';
import * as table from './table';
import * as feed from './feed';
import * as article from './article';

export function regIpc() {
  ipcMain.handle(
    'fetch',
    async (_, url, options: FetchOptions) => await fetch(url, options).then((r) => r.text()),
  );
  ipcMain.handle('table.patch', (_event, tableName, row) => table.patch(tableName, row));
  ipcMain.handle('table.list', (_event, tableName, options) => table.list(tableName, options));
  ipcMain.handle('feed.add', (_event, ...params) => feed.add(params[0]));
  ipcMain.handle('feed.list', () => feed.list());
  ipcMain.handle('feed.fetch', (_, feedParam) => feed.fetch(feedParam));
  ipcMain.handle('feed.deleteRow', (_, id) => feed.deleteRow(id));
  ipcMain.handle('article.deleteByFeed', (_, feedId) => article.deleteByFeed(feedId));
}
