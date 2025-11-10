import { groupBy, mapKeys } from 'lodash-es';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { db } from 'src/utils/db';

export type Feed = {
  _id: string;
  _rev: string;
  type: 'feed';
  url?: string;
  title?: string;
  category?: string;
};

type CategoryTree = {
  _id: string;
  title: string;
  icon: string;
  children: Feed[];
};

export const useFeedStore = defineStore('feed', {
  state: () => ({
    feeds: [] as Feed[],
  }),

  getters: {
    idMap(state) {
      return mapKeys(state.feeds, '_id');
    },
    categoryTree(state) {
      const obj = groupBy(state.feeds, (o) => o.category || 'uncategorized');
      return Object.entries(obj).reduce((arr, [key, val]) => {
        arr.push({
          _id: key,
          title: key,
          icon: 'folder',
          children: val,
        });
        return arr;
      }, [] as CategoryTree[]);
    },
  },

  actions: {
    async fetchFeeds() {
      const res = await db.find({
        selector: {
          type: 'feed',
        },
        limit: 999,
      });
      this.feeds = res.docs as unknown as Feed[];
    },
    byId(id: string): Feed | undefined {
      return this.idMap[id];
    },
    byCategoryId(categoryId: string): CategoryTree | Feed | undefined {
      return this.idMap[categoryId] || this.categoryTree.find((o) => o._id === categoryId);
    },
    async updateFeed(feed: Feed) {
      const res = await db.put(feed);
      if (res.ok) {
        feed._rev = res.rev;
      }
      const index = this.feeds.findIndex((o) => o._id === feed._id);
      this.feeds[index] = feed;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFeedStore, import.meta.hot));
}
