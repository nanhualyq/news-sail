<template>
  <q-btn flat round :icon :color size="sm" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const { star } = defineProps<{ star: boolean }>()

const icon = computed(() => {
  return star ? 'star' : 'star_border'
})
const color = computed(() => {
  return star ? 'orange-9' : 'grey-9'
})
</script>
