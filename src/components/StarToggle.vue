<template>
  <q-btn flat round :icon :color size="sm" />
</template>

<script setup lang="ts">
import { type Item } from 'src/utils/item';
import { computed } from 'vue';

const { item } = defineProps<{ item: Item }>()

const icon = computed(() => {
  return item.star ? 'star' : 'star_border'
})
const color = computed(() => {
  return item.star ? 'orange-9' : 'grey-9'
})
</script>
