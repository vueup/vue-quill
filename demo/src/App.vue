<script setup lang="ts">
import { ref } from 'vue'
import { QuillEditor, useEditor, EditorContent } from '@vueup/vue-quill'
// CSS is imported in main.ts

// Example 1: Using QuillEditor component with v-model
const content = ref<string>('<p>Hello World!</p>')

// Example 2: Using useEditor composable (TipTap-style)
const { editor } = useEditor({
  content: '<p>This is the composable editor</p>',
  contentType: 'html',
  theme: 'snow',
  onUpdate: ({ editor: e }) => {
    console.log('Content updated:', e.getHTML())
  },
})
</script>

<template>
  <div id="app">
    <h1>VueQuill v2.0 Demo</h1>
    
    <section>
      <h2>1. QuillEditor Component (v-model)</h2>
      <QuillEditor
        v-model="content"
        theme="snow"
        toolbar="essential"
        placeholder="Type something..."
        content-type="html"
      />
      <details>
        <summary>Content</summary>
        <pre>{{ content }}</pre>
      </details>
    </section>

    <section>
      <h2>2. useEditor Composable (TipTap-style)</h2>
      <div v-if="editor">
        <div class="toolbar">
          <button @click="editor.chain().bold().run()">Bold</button>
          <button @click="editor.chain().italic().run()">Italic</button>
          <button @click="editor.chain().underline().run()">Underline</button>
          <button @click="editor.chain().setHeading(1).run()">H1</button>
          <button @click="editor.chain().setHeading(2).run()">H2</button>
          <button @click="editor.chain().setBulletList().run()">Bullet List</button>
        </div>
        <EditorContent :editor="editor" />
        <details>
          <summary>HTML Output</summary>
          <pre>{{ editor.getHTML() }}</pre>
        </details>
      </div>
    </section>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  border-bottom: 2px solid #42b983;
  padding-bottom: 10px;
}

section {
  margin: 30px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

h2 {
  margin-top: 0;
  color: #42b983;
}

.toolbar {
  margin-bottom: 10px;
}

.toolbar button {
  margin-right: 5px;
  padding: 5px 10px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.toolbar button:hover {
  background: #369970;
}

details {
  margin-top: 15px;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}

summary {
  cursor: pointer;
  font-weight: bold;
}

pre {
  margin: 10px 0 0;
  padding: 10px;
  background: #f0f0f0;
  overflow-x: auto;
  font-size: 12px;
}
</style>
