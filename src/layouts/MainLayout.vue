<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <button @click="addFeed">Add Feed</button>
        <q-item v-for="feed in feedStore.feeds" :key="feed._id">
          <q-item-section>
            <q-item-label>{{ feed.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { omit } from 'lodash-es';
import { useQuasar } from 'quasar';
import Parser from 'rss-parser/dist/rss-parser.min.js';
import { useFeedStore } from 'src/stores/feedStore';
import { db } from 'src/utils/db';
import { ref } from 'vue';

const $q = useQuasar()

const leftDrawerOpen = ref(false);
const feedStore = useFeedStore()
void feedStore.fetchFeeds()

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function addFeed() {
  $q.dialog({
    title: 'Add Feed',
    prompt: {
      model: '',
    }
  })
    // https://kite.kagi.com/ai_zh-Hans.xml
    .onOk(url => void fetchFeedAndSave(url))
}

async function fetchFeedAndSave(url: string) {
  const xml = await window.backend.fetch(url)
  const parser = new Parser()
  const feed = await parser.parseString(xml)
  console.log(feed)
  const feedId = feed.link || `feed-${Date.now()}`
  const docs = [
    {
      _id: feedId,
      type: 'feed',
      ...omit(feed, 'items')
    },
    ...feed.items.map(item => ({
      _id: item.guid || item.link || `item-${Date.now()}`,
      feedId,
      type: 'item',
      ...item
    }))
  ]
  const res = await db.bulkDocs(docs)
  console.log(res);
}
</script>
