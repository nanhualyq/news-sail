import type IBridge from '../src-electron/api/bridge';

declare global {
  interface Window {
    backend: typeof IBridge;
  }
}
