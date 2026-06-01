<script setup lang="ts">
import { ref } from 'vue'
import { Delta, QuillEditor } from '@vueup/vue-quill'

const deltaContent = ref(
  new Delta()
    .insert('VueQuill can now be imported during SSR.\n', { bold: true })
    .insert('The Quill runtime initializes only after the browser mounts.'),
)
const htmlContent = ref(
  '<p>Server rendering outputs a stable editor placeholder, then the browser hydrates and creates Quill.</p>',
)
const editorReady = ref(false)

const handleReady = () => {
  editorReady.value = true
}
</script>

<template>
  <main class="app-shell">
    <header class="hero">
      <p class="eyebrow">VueQuill SSR example</p>
      <h1>Server-rendered shell, client-mounted editor</h1>
      <p>
        This example renders with Vue SSR without importing the Quill browser
        runtime on the server. The editor placeholder is emitted in SSR HTML and
        Quill is created in the browser after mount.
      </p>
    </header>

    <section class="status-panel" aria-label="SSR status">
      <h2>SSR status</h2>
      <p data-testid="ssr-status">
        SSR shell rendered; editor ready:
        <strong>{{ editorReady ? 'yes' : 'waiting for client mount' }}</strong>
      </p>
    </section>

    <section class="example-grid">
      <article class="example-card">
        <h2>Delta content</h2>
        <div class="editor-frame">
          <QuillEditor
            v-model:content="deltaContent"
            theme="snow"
            toolbar="minimal"
            placeholder="Hydrated Delta editor..."
            @ready="handleReady"
          />
        </div>
      </article>

      <article class="example-card">
        <h2>HTML content</h2>
        <div class="editor-frame">
          <QuillEditor
            v-model:content="htmlContent"
            content-type="html"
            theme="snow"
            toolbar="essential"
            placeholder="Hydrated HTML editor..."
          />
        </div>
      </article>
    </section>
  </main>
</template>
