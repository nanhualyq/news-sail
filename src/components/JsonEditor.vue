<template>
  <q-dialog ref="dialogRef" persistent maximized>
    <q-card>
      <q-card-section>
        <q-input v-model="inputJson" type="textarea" autogrow />
      </q-card-section>
      <q-card-actions>
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Save" color="primary" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';

const props = defineProps(['jsonObject'])
const inputJson = ref(initInputJson())
const { dialogRef, onDialogOK } = useDialogPluginComponent()

function initInputJson() {
  const o = Object.assign({ category: '' }, props.jsonObject)
  return JSON.stringify(o, null, 2)
}
function save() {
  let newValue
  try {
    newValue = JSON.parse(inputJson.value)
  } catch (error) {
    alert('JSON Error:' + String(error))
    return
  }
  onDialogOK(newValue)
}
</script>
