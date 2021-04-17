<template>
  <div class="flex flex-col md:flex-row md:gap-3">
    <!-- Theme and Toolbar menu -->
    <div class="flex flex-col md:w-28 mx-4 sm:mx-0">
      <div class="text-sm text-gray-400 font-bold mb-2">THEME</div>
      <div class="flex md:flex-col gap-2 mb-4">
        <VOptions
          name="theme"
          v-model:selected="selectedTheme"
          :options="[
            { value: 'snow', label: 'Snow' },
            { value: 'bubble', label: 'Bubble' },
            { value: '', label: 'None' },
          ]"
        ></VOptions>
      </div>
      <div class="text-sm text-gray-400 font-bold mb-2">TOOLBAR</div>
      <div class="flex md:flex-col gap-2 mb-4">
        <VOptions
          name="toolbar"
          v-model:selected="selectedToolbar"
          :options="[
            { value: 'essential', label: 'Essential' },
            { value: 'minimal', label: 'Minimal' },
            { value: 'full', label: 'Full' },
            { value: '', label: 'None' },
          ]"
        ></VOptions>
      </div>
    </div>
    <div class="initial flex-1 flex flex-col">
      <QuillEditor
        ref="myEditor"
        class="h-64 sm:h-96"
        v-model:content="myContent"
        @ready="handleReady"
        @textChange="handleTextChange"
        :theme="selectedTheme"
        :toolbar="selectedToolbar"
        :modules="myModules"
      >
      </QuillEditor>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import VOptions from '../VOptions.vue'
import { deltaContent } from './delta-content'
import BlotFormatter from 'quill-blot-formatter'

export default defineComponent({
  components: { VOptions },
  setup: () => {
    const myEditor = ref()
    const myContent = ref(deltaContent)
    const myModules = [
      'blotFormatter',
      BlotFormatter,
      {
        /* options */
      },
    ]

    // ============ OPTIONS =====================
    const selectedTheme = ref<string>('snow')
    const selectedToolbar = ref<string>('essential')

    watch([selectedTheme, selectedToolbar], () => {
      myEditor.value.reinit()
    })

    return {
      selectedTheme,
      selectedToolbar,
      // ---------------
      myEditor,
      myContent,
      myModules,
    }
  },
})
</script>

<style>
.ql-editor h2 {
  border: none;
}
</style>