import { groupBy, mapKeys } from 'lodash-es';
import { defineStore, acceptHMRUpdate } from 'pinia';

export type Feed = {
  id: string;
  _rev: string;
  type: 'feed';
  url?: string;
  title?: string;
  category?: string;
  icon?: string;
};

type CategoryTree = {
  id: string;
  title: string;
  icon?: string;
  children: Feed[];
};

export const useFeedStore = defineStore('feed', {
  state: () => ({
    feeds: [] as Feed[],
    lastEmptiedFeed: -1,
  }),

  getters: {
    idMap(state) {
      return mapKeys(state.feeds, 'id');
    },
    categoryTree(state) {
      const obj = groupBy(state.feeds, (o) => o.category || 'uncategorized');
      return Object.entries(obj).reduce((arr, [key, val]) => {
        arr.push({
          id: key,
          title: key,
          children: val,
        });
        return arr;
      }, [] as CategoryTree[]);
    },
  },

  actions: {
    async fetchFeeds() {
      this.feeds = await window.backend.invoke('feed.list');
    },
    byId(id: string): Feed | undefined {
      return this.idMap[id];
    },
    byCategoryId(categoryId: string): CategoryTree | Feed | undefined {
      return this.idMap[categoryId] || this.categoryTree.find((o) => o.id === categoryId);
    },
    async updateFeed(feed: Feed) {
      await window.backend.invoke('table.patch', 'feed', feed);
      const index = this.feeds.findIndex((o) => o.id === feed.id);
      this.feeds[index] = feed;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFeedStore, import.meta.hot));
}
