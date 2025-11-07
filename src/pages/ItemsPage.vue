<template>
  <q-page>
    <q-list>
      <q-infinite-scroll @load="loadNextPage" :offset="10">
        <q-item clickable v-for="(item, index) in items" :key="get(item, '_id', index)" @click="activeIndex = index">
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
              <StarToggle :star="!!item.star" @click.stop="toggleStar(index)" padding="none" />
            </q-item-label>
          </q-item-section>
        </q-item>
        <template v-slot:loading v-if="hasMore">
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </q-list>
    <ItemPage v-if="activeItem" :item="activeItem" :key="activeItem?._id" @close="activeIndex = -1"
      @toggle-star="toggleStar(activeIndex)" />
  </q-page>
</template>

<script setup lang="ts">
import { get, set } from 'lodash-es';
import { db } from 'src/utils/db';
import { computed, ref, toRaw, watchEffect } from 'vue';
import StarToggle from 'src/components/StarToggle.vue';
import { type Item } from 'src/utils/item';
import ItemPage from './ItemPage.vue';
import ItemTime from 'src/components/ItemTime.vue';
import ItemFeed from 'src/components/ItemFeed.vue';


const items = ref<Item[]>([])
const skip = ref(0)
const limit = 5
const hasMore = ref(true)
const activeIndex = ref(-1)

const activeItem = computed(() => items.value[activeIndex.value])

async function fetchItems() {
  const res = await db.find({
    selector: {
      type: 'item'
    },
    limit,
    skip: skip.value
  })
  hasMore.value = res.docs.length === limit
  res.docs.forEach(setItemCover)
  items.value = items.value.concat(res.docs as Item[])
}

watchEffect(() => void fetchItems())

function loadNextPage() {
  skip.value += limit
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
async function toggleStar(index: number) {
  const newItem = toRaw(items.value[index])
  if (!newItem) {
    return
  }
  newItem.star = !newItem.star
  const res = await db.put(newItem)
  if (res.ok) {
    const latest = await db.get(newItem._id)
    items.value[index] = latest
  }
}
</script>

<style scoped lang="scss"></style>
