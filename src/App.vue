<template>
  <router-view />
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue';
import { db } from './utils/db';

onUnmounted(() => db.close())
</script>
