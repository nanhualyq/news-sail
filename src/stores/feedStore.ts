import { mapKeys } from 'lodash-es';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { db } from 'src/utils/db';

type Feed = {
  _id: string;
  type: 'feed';
  url?: string;
  title?: string;
};

export const useFeedStore = defineStore('feed', {
  state: () => ({
    feeds: [] as Feed[],
  }),

  getters: {
    idMap: (state) => mapKeys(state.feeds, '_id'),
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
    byId(id: string) {
      return this.idMap[id];
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFeedStore, import.meta.hot));
}
