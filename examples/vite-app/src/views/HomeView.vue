<script setup lang="ts">
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'

const content = ref('<p>Welcome to VueQuill v2.0! 🎉</p><p>Try editing this content...</p>')
</script>

<template>
  <div>
    <h1>VueQuill v2.0 Examples</h1>
    <p>A modern Quill editor for Vue 3.5+</p>
    
    <h2>Basic Example</h2>
    <QuillEditor v-model="content" theme="snow" />
    
    <h3>Content (HTML):</h3>
    <pre>{{ content }}</pre>
  </div>
</template>

<style scoped>
h1 {
  margin-bottom: 0.5rem;
}

h2 {
  margin-top: 2rem;
}

pre {
  background: #f7fafc;
  padding: 1rem;
  border-radius: 0.25rem;
  overflow-x: auto;
  margin-top: 1rem;
}
</style>
