declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

declare module 'rss-parser/dist/rss-parser.min.js' {
  import Parser from 'rss-parser';
  export default Parser;
}
