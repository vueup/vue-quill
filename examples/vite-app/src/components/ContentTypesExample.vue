<script setup lang="ts">
import { ref } from 'vue'
import { Delta } from '@vueup/vue-quill'
const contentDelta = ref<Delta>(
  new Delta([
    { insert: 'Gandalf', attributes: { bold: true } },
    { insert: ' the ' },
    { insert: 'Grey', attributes: { color: '#ccc' } },
  ])
)
const contentHTML = ref('<h1>This is html header</h1>')
const contentText = ref('This is just plain text')
</script>

<template>
  <div>
    <h2>Delta</h2>
    <QuillEditor v-model:content="contentDelta" contentType="delta" />
    <pre v-highlightjs><code class="json">{{contentDelta}}</code></pre>
    <br />
    <h2>HTML</h2>
    <QuillEditor v-model:content="contentHTML" contentType="html" />
    <pre v-highlightjs><code class="json">{{contentHTML}}</code></pre>
    <br />
    <h2>Plain Text</h2>
    <QuillEditor v-model:content="contentText" contentType="text" />
    <pre v-highlightjs><code class="json">{{contentText}}</code></pre>
    <br />
  </div>
</template>

<style scoped></style>
