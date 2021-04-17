<template>
  <h1>Add Modules</h1>
  <QuillEditor v-model:content="content" :modules="modules" toolbar="full" />
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { QuillEditor, Delta, Module } from '@vueup/vue-quill'
import BlotFormatter from 'quill-blot-formatter'
import '@vueup/vue-quill/../dist/vue-quill.snow.css'

export default defineComponent({
  components: {
    QuillEditor,
  },
  setup: () => {
    const modules: Module = [
      'blotFormatter',
      BlotFormatter,
      {
        /* options */
      },
    ]
    const content = ref<Delta>(
      new Delta([
        { insert: 'Gandalf', attributes: { bold: true } },
        { insert: ' the ' },
        { insert: 'Grey', attributes: { color: '#ccc' } },
      ])
    )

    return { content, modules }
  },
})
</script>

