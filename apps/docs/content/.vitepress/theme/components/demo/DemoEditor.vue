<script setup lang="ts">
import { ref, watch } from 'vue'
import VOptions from './VOptions.vue'
import { deltaContent } from './delta-content'

const myEditor = ref<{ reinit: () => void } | null>(null)
const myContent = ref(deltaContent)

const selectedTheme = ref('snow')
const selectedToolbar = ref('essential')

watch([selectedTheme, selectedToolbar], () => {
  myEditor.value?.reinit()
})
</script>

<template>
  <div class="flex flex-col md:flex-row md:gap-3">
    <div class="flex flex-col md:w-28 mx-4 sm:mx-0">
      <div class="text-sm text-gray-400 font-bold mb-2">THEME</div>
      <div class="flex md:flex-col gap-2 mb-4">
        <VOptions
          v-model:selected="selectedTheme"
          name="theme"
          :options="[
            { value: 'snow', label: 'Snow' },
            { value: 'bubble', label: 'Bubble' },
            { value: '', label: 'None' },
          ]"
        />
      </div>
      <div class="text-sm text-gray-400 font-bold mb-2">TOOLBAR</div>
      <div class="flex md:flex-col gap-2 mb-4">
        <VOptions
          v-model:selected="selectedToolbar"
          name="toolbar"
          :options="[
            { value: 'essential', label: 'Essential' },
            { value: 'minimal', label: 'Minimal' },
            { value: 'full', label: 'Full' },
            { value: '', label: 'None' },
          ]"
        />
      </div>
    </div>
    <div class="initial flex-1 flex flex-col">
      <QuillEditor
        ref="myEditor"
        v-model="myContent"
        class="h-64 sm:h-96"
        :theme="selectedTheme"
        :toolbar="selectedToolbar"
      />
    </div>
  </div>
</template>

<style>
.ql-editor h2 {
  border: none;
}

img {
  display: inline-block !important;
}
</style>
