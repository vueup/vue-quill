<template>
  <h1>Content Type</h1>
  <QuillEditor v-model:content="contentDelta" contentType="delta" />
  <pre>{{ contentDelta }}</pre>
  <QuillEditor v-model:content="contentHTML" contentType="html" />
  <pre>{{ contentHTML }}</pre>
  <QuillEditor v-model:content="contentText" contentType="text" />
  <pre>{{ contentText }}</pre>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { QuillEditor, Delta } from '@vueup/vue-quill'

export default defineComponent({
  components: {
    QuillEditor,
  },
  setup: () => {
    const contentDelta = ref<Delta>(
      new Delta([
        { insert: 'Gandalf', attributes: { bold: true } },
        { insert: ' the ' },
        { insert: 'Grey', attributes: { color: '#ccc' } },
      ])
    )
    const contentHTML = ref('<h1>This is html header</h1>')
    const contentText = ref('This is just plain text')

    return { contentDelta, contentHTML, contentText }
  },
})
</script>

