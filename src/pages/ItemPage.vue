<template>
  <q-dialog :model-value="true" maximized>
    <q-card class="column">
      <q-card-section style="flex: 1;" class="scroll">
        <h5>{{ item.title }}</h5>
        <hr>
        <div class="content" v-html="item.content"></div>
      </q-card-section>
      <q-bar>
        <div class="row" style="font-size: 14px !important; gap: 0.5rem;">
          <ItemTime :item />
          <ItemFeed :item />
          <StarToggle :star="!!item.star" @click.stop="emit('toggleStar')" padding="none" />
        </div>

        <q-space />

        <q-btn dense flat icon="close" @click="emit('close')">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import ItemFeed from 'src/components/ItemFeed.vue';
import ItemTime from 'src/components/ItemTime.vue';
import StarToggle from 'src/components/StarToggle.vue';
import { type Item } from 'src/utils/item';

const emit = defineEmits(['close', 'toggleStar'])
const { item } = defineProps<{ item: Item }>()
</script>

<style scoped lang="scss">
.content {

  :global(img),
  :global(video) {
    max-width: 100%;
  }

  :global(h1),
  :global(h2),
  :global(h3),
  :global(h4),
  :global(h5),
  :global(h6) {
    margin: 0;
    padding: 0;
    line-height: 1.5em;
  }
}
</style>
