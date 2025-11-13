<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>{{ currentCategory?.title || 'Feeds' }}</q-toolbar-title>

        <q-select v-model="articleType" :options="['unread', 'read', 'starred', 'all']" label="Type" />
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
        <q-tree :nodes="feedStore.categoryTree" node-key="id" label-key="title" no-connectors selected-color="primary"
          v-model:selected="selected">
          <template v-slot:default-header="prop">
            <div class="row items-center" style="gap: 4px;">
              <img v-if="prop.node.icon" :src="prop.node.icon" style="width: 1rem; height: 1rem;">
              <q-icon v-else :name="prop.node.children ? 'folder' : 'feed'" size="1rem" />
              <div>{{ prop.node.title }}</div>
              <q-menu touch-position context-menu v-if="!prop.node.children">
                <q-list>
                  <q-item clickable v-close-popup @click="editFeed(prop.node)">
                    <q-item-section>Edit Feed</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="fetchFeed(prop.node)">
                    <q-item-section>Fetch Feed</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="deleteFeed(prop.node.id)">
                    <q-item-section>Delete Feed</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="deleteArticlesByFeed(prop.node.id)">
                    <q-item-section>Delete Articles</q-item-section>
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
import { pick } from 'lodash-es';
import { useQuasar } from 'quasar';
import JsonEditor from 'src/components/JsonEditor.vue';
import useDialog from 'src/composables/useDialog';
import type { Feed } from 'src/stores/feedStore';
import { useFeedStore } from 'src/stores/feedStore';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const dialog = useDialog()

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
const articleType = computed({
  get() {
    return route.query.type || 'unread'
  },
  set(status) {
    void router.push({
      path: '/items',
      query: {
        type: status
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
    .onOk(url => void window.backend.invoke('feed.add', url))
}

function editFeed(feed: Feed) {
  $q.dialog({
    component: JsonEditor,
    componentProps: {
      jsonObject: feed
    }
  }).onOk(feed => void feedStore.updateFeed(feed))
}
async function deleteArticlesByFeed(feedId: number) {
  const res = await dialog({
    title: 'DELETE',
    message: 'All articles under this feed will be deleted',
    cancel: true,
    persistent: true
  })
  if (!res.ok) {
    return
  }
  await window.backend.invoke('article.deleteByFeed', feedId)
  // notify article list page
  feedStore.lastEmptiedFeed = feedId
}
function fetchFeed(feed: Feed) {
  void window.backend.invoke('feed.fetch', pick(feed, ['id', 'link']))
}
async function deleteFeed(feedId: number) {
  const res = await dialog({
    title: 'DELETE',
    message: 'This feed will be deleted (including all articles)',
    cancel: true,
    persistent: true
  })
  if (!res.ok) {
    return
  }
  await window.backend.invoke('feed.deleteRow', feedId)
  feedStore.lastEmptiedFeed = feedId
}
</script>
