<template>
  <h1>Basic Example</h1>
  <QuillEditor v-model:content="content" />
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { QuillEditor, Delta } from '@vueup/vue-quill'
import '@vueup/vue-quill/../dist/vue-quill.snow.css'

export default defineComponent({
  components: {
    QuillEditor,
  },
  setup: () => {
    const content = ref<Delta>(
      new Delta([
        { insert: 'Gandalf', attributes: { bold: true } },
        { insert: ' the ' },
        { insert: 'Grey', attributes: { color: '#ccc' } },
      ])
    )

    return { content }
  },
})
</script>

