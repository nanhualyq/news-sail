<template>
  <q-page>
    <q-list v-scrollToItem="activeIndex">
      <q-infinite-scroll @load="loadNextPage" :disable="!hasMore">
        <q-item clickable v-for="(item, index) in items" :key="item.id" @click="viewItem(index)"
          :class="{ read: item.read }">
          <q-item-section thumbnail v-if="item.cover">
            <img :src="item.cover" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">
              <a :href="item.link" target="_blank">{{ item.title }}</a>
            </q-item-label>
            <q-item-label :lines="3">{{ item.contentSnippet }}</q-item-label>
            <q-item-label class="row q-gutter-x-sm items-center">
              <ItemTime :item />
              <ItemFeed :item />
              <StarToggle :star="!!item.starred" @click.stop="toggleStar(index)" padding="none" />
            </q-item-label>
          </q-item-section>
        </q-item>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </q-list>
    <ArticlePage v-if="activeItem" :item="activeItem" :key="activeItem?.id" @close="activeIndex = -1"
      @toggle-star="toggleStar(activeIndex)" />
  </q-page>
</template>

<script setup lang="ts">
import { get, pick, set } from 'lodash-es';
import { computed, ref, toRaw, watch } from 'vue';
import { useFeedStore } from 'src/stores/feedStore';
import StarToggle from 'src/components/StarToggle.vue';
import { type Item } from 'src/utils/item';
import ArticlePage from './ArticlePage.vue';
import ItemTime from 'src/components/ItemTime.vue';
import { useRoute } from 'vue-router';
import ItemFeed from 'src/components/ItemFeed.vue';
import { useEventListener } from '@vueuse/core';

const route = useRoute()

const items = ref<Item[]>([])
const skip = ref(0)
const limit = 20
const hasMore = ref(true)
const feedStore = useFeedStore()
const activeIndex = ref(-1)

const activeItem = computed(() => items.value[activeIndex.value])
const currentCategory = computed(() => feedStore.byCategoryId(route.query.category as string))
const queryFeed = computed(() => {
  const cate = currentCategory.value
  if (!cate) {
    return ''
  }
  if ('children' in cate) {
    return `feed_id IN (${cate.children.map(c => c.id).join(',')})`
  } else {
    return `feed_id=${cate.id}`
  }
})
const queryType = computed(() => {
  const type = route.query.type as string
  switch (type) {
    case 'unread':
      return 'read=0'
    case 'read':
      return 'read=1'
    case 'starred':
      return 'starred=1'
    case 'all':
      return ''
    default:
      return 'read=0'
  }
})

watch(() => route.query, () => {
  skip.value = 0
  items.value = []
  void fetchItems()
}, { deep: true, immediate: false })

watch(() => feedStore.lastEmptiedFeed, (feedId) => {
  items.value = items.value.filter(item => item.feed_id !== feedId)
})

useEventListener(window, 'keydown', (e) => {
  // avoid when input
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    return
  }
  if (e.key === 'j') {
    activeIndex.value = Math.min(activeIndex.value + 1, items.value.length - 1)
  } else if (e.key === 'k') {
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  }
})

const vScrollToItem = {
  updated(el: Element, binding: { value: number }) {
    el.querySelector(`.q-item:nth-child(${binding.value + 1})`)?.scrollIntoView({ block: 'center' })
  }
}

async function fetchItems() {
  const res = await window.backend.invoke('table.list', 'article', {
    limit: limit + 1,
    offset: skip.value,
    orderBy: ['pubDate', 'desc'],
    where: `${[queryFeed.value, queryType.value].filter(Boolean).join(' AND ')}`
  })

  hasMore.value = res.length > limit
  res.forEach(setItemCover)
  items.value = items.value.concat(res.slice(0, limit) as Item[])
}

function loadNextPage(_index: number, done: () => void) {
  if (items.value.length > 0) {
    skip.value += limit
  }
  void fetchItems().then(done)
}

function setItemCover(item: unknown) {
  const html = get(item, 'content')
  if (!html) {
    return ''
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const src = doc.querySelector('img')?.src
  set(item as object, 'cover', src)
}
async function updateItem(index: number, cb: (item: Item) => void) {
  const item = items.value[index]
  if (!item) {
    return
  }
  cb(item)
  await window.backend.invoke('table.patch', 'article', pick(toRaw(item), ['id', 'read', 'starred']))
}
function viewItem(index: number) {
  activeIndex.value = index
  if (items.value[index]?.read) {
    return
  }
  void updateItem(index, o => o.read = 1)
}
function toggleStar(index: number) {
  void updateItem(index, o => o.starred = Number(!o.starred))
}
</script>

<style scoped lang="scss">
.read {
  opacity: .6;
  filter: grayscale(100%);
}
</style>
