<template>
  <h1>Add Modules</h1>
  <QuillEditor v-model:content="content" :modules="modules" toolbar="full" />
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { QuillEditor, Delta } from '@vueup/vue-quill'
import BlotFormatter from '@enzedonline/quill-blot-formatter2'
import '@enzedonline/quill-blot-formatter2/dist/css/quill-blot-formatter2.css'

export default defineComponent({
  components: {
    QuillEditor,
  },
  setup: () => {
    const modules = {
      name: 'blotFormatter2',
      module: BlotFormatter,
      options: {
        /* options */
      },
    }
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
