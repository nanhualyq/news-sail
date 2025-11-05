import { ipcMain } from 'electron';
import { type FetchOptions } from './bridge';

export function regIpc() {
  ipcMain.handle(
    'fetch',
    async (_, url, options: FetchOptions) => await fetch(url, options).then((r) => r.text()),
  );
}
