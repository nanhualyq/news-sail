<template>
  <dialog class="dialog-box" ref="dialogRef" @close="emit('close')">
    <q-card class="column" style="height: 90vh;">
      <q-card-section style="flex: 1;" class="scroll">
        <h1>{{ item.title }}</h1>
        <hr>
        <div class="content" v-html="item.content"></div>
      </q-card-section>
      <q-bar>
        <div class="row" style="font-size: 14px !important; gap: 0.5rem;">
          <ItemTime :item />
          <ItemFeed :item />
          <StarToggle :star="!!item.starred" @click.stop="emit('toggleStar')" padding="none" />
        </div>

        <q-space />

        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>
    </q-card>
  </dialog>
</template>

<script setup lang="ts">
import ItemFeed from 'src/components/ItemFeed.vue';
import ItemTime from 'src/components/ItemTime.vue';
import StarToggle from 'src/components/StarToggle.vue';
import { type Item } from 'src/utils/item';
import { onMounted, useTemplateRef } from 'vue';

const emit = defineEmits(['close', 'toggleStar'])
const { item } = defineProps<{ item: Item }>()

const dialogRef = useTemplateRef('dialogRef')
onMounted(() => dialogRef.value?.showModal())
</script>

<style scoped lang="scss">
.content {

  :global(img),
  :global(video) {
    max-width: 100%;
  }

  :global(h1) {
    font-size: 1.5em;
  }

  :global(h2) {
    font-size: 1.2em;
  }

  :global(h3) {
    font-size: 1.17em;
  }

  :global(h4) {
    font-size: 1em;
  }

  :global(h5) {
    font-size: 0.83em;
  }

  :global(h6) {
    font-size: 0.75em;
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

.dialog-box {
  padding: 0;
}
</style>
