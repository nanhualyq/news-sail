<template>
  <span :title="item.pubDate">{{ timeText }}</span>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { type Item } from 'src/utils/item';
import { computed } from 'vue';
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const { item } = defineProps<{ item: Item }>()

const timeText = computed(getItemTime)

function getItemTime() {
  const time = item?.pubDate
  if (!time) {
    return ''
  }
  return dayjs(time).fromNow()
}
</script>
