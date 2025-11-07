<template>
  <a href="#">{{ feedStore.byId(item.feedId || '')?.title }}</a>
</template>

<script setup lang="ts">
import { useFeedStore } from 'src/stores/feedStore';
import { type Item } from 'src/utils/item';

const feedStore = useFeedStore()

const { item } = defineProps<{ item: Item }>()

</script>
