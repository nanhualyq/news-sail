<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>{{ currentCategory?.title || 'Feeds' }}</q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item clickable v-ripple :to="{ query: null }" exact>
          <q-item-section>Timeline</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="addFeed">
          <q-item-section>Add Feed</q-item-section>
        </q-item>
        <q-separator />
        <q-tree :nodes="feedStore.categoryTree" node-key="_id" label-key="title" no-connectors selected-color="primary"
          v-model:selected="selected">
          <template v-slot:default-header="prop">
            <div class="row items-center" style="gap: 4px;">
              <q-icon :name="prop.node.icon || 'feed'" size="1rem" />
              <div>{{ prop.node.title }}</div>
              <q-menu touch-position context-menu v-if="!prop.node.children">
                <q-list>
                  <q-item clickable v-close-popup @click="editFeed(prop.node)">
                    <q-item-section>Edit Feed</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>Delete Feed (With Items)</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </div>
          </template>
        </q-tree>
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
import JsonEditor from 'src/components/JsonEditor.vue';
import type { Feed } from 'src/stores/feedStore';
import { useFeedStore } from 'src/stores/feedStore';
import { db } from 'src/utils/db';
import { urlToHashId } from 'src/utils/helpers';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const leftDrawerOpen = ref(false);
const feedStore = useFeedStore()
void feedStore.fetchFeeds()

const currentCategory = computed(() => feedStore.byCategoryId(route.query.category as string))

const selected = computed({
  get() {
    return route.query.category || null
  },
  set(feedId) {
    void router.push({
      path: '/items',
      query: {
        category: feedId
      }
    })
  }
})

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
  const feedId = await urlToHashId(feed.link || url)
  const docs = [];
  const feedDoc = {
    _id: feedId,
    type: 'feed',
    ...omit(feed, 'items')
  }
  docs.push(feedDoc)
  for (const item of feed.items) {
    docs.push({
      _id: await urlToHashId(item.guid || item.link || `item-${Date.now()}`),
      feedId,
      type: 'item',
      read: false,
      ...item
    });
  }
  const res = await db.bulkDocs(docs)
  console.log(res);
}
function editFeed(feed: Feed) {
  $q.dialog({
    component: JsonEditor,
    componentProps: {
      jsonObject: feed
    }
  }).onOk(feed => void feedStore.updateFeed(feed))
}
</script>
