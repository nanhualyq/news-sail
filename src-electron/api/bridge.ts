import { ipcRenderer } from 'electron';

export type FetchOptions = RequestInit & {
  returnType?: string;
};

export default {
  fetch(url: string, options?: FetchOptions) {
    return ipcRenderer.invoke('fetch', url, options);
  },
  invoke(action: string, ...params: unknown[]) {
    return ipcRenderer.invoke(action, ...params);
  },
};
