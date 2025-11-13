<template>
  <router-link :to="{ path: '/items', query: { category: item.feed_id } }">
    <img v-if="feed?.icon" :src="feed?.icon" style="width: 1rem; height: 1rem; vertical-align: text-bottom;">
    {{ feed?.title }}
  </router-link>
</template>

<script setup lang="ts">
import { useFeedStore } from 'src/stores/feedStore';
import { type Item } from 'src/utils/item';
import { computed } from 'vue';

const feedStore = useFeedStore()

const { item } = defineProps<{ item: Item }>()
const feed = computed(() => feedStore.byId(item.feed_id + ''))
</script>
