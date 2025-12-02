<script setup lang="ts">
/**
 * Content Types Demo
 *
 * Demonstrates v-model binding with different content types:
 * - delta: Quill's Delta format (default, preserves all formatting)
 * - html: HTML string format (common for backend storage)
 * - text: Plain text (no formatting)
 */

import { ref, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import type { Delta } from 'quill'

// Delta content (default, recommended for rich editing)
const deltaContent = ref<Delta | null>(null)

// HTML content (common for web apps)
const htmlContent = ref<string>('<p>Hello <strong>HTML</strong> content!</p>')

// Plain text content
const textContent = ref<string>('Plain text only, no formatting preserved.')

// Watch for changes to demonstrate reactivity
watch(deltaContent, (newVal) => {
  console.log('Delta content updated:', JSON.stringify(newVal, null, 2))
})

watch(htmlContent, (newVal) => {
  console.log('HTML content updated:', newVal)
})

watch(textContent, (newVal) => {
  console.log('Text content updated:', newVal)
})
</script>

<template>
  <div class="content-types-demo">
    <h2>Content Types Demo</h2>
    <p>VueQuill supports three content types for v-model binding.</p>

    <!-- Delta Format (Default) -->
    <section class="demo-section">
      <h3>1. Delta Format (Default)</h3>
      <p>
        Quill's native format. Preserves all formatting including custom
        attributes. Best for applications where you need full fidelity.
      </p>
      <QuillEditor
        v-model="deltaContent"
        content-type="delta"
        theme="snow"
        toolbar="essential"
        placeholder="Type to see Delta output..."
      />
      <details>
        <summary>Current Delta Value</summary>
        <pre>{{ JSON.stringify(deltaContent, null, 2) }}</pre>
      </details>
    </section>

    <!-- HTML Format -->
    <section class="demo-section">
      <h3>2. HTML Format</h3>
      <p>
        HTML string format. Good for storing in databases or rendering
        outside of Quill. Some advanced formatting may be simplified.
      </p>
      <QuillEditor
        v-model="htmlContent"
        content-type="html"
        theme="snow"
        toolbar="essential"
        placeholder="Type to see HTML output..."
      />
      <details open>
        <summary>Current HTML Value</summary>
        <pre>{{ htmlContent }}</pre>
      </details>
    </section>

    <!-- Text Format -->
    <section class="demo-section">
      <h3>3. Text Format</h3>
      <p>
        Plain text only. All formatting is stripped. Use when you only
        need the text content without any styling.
      </p>
      <QuillEditor
        v-model="textContent"
        content-type="text"
        theme="snow"
        toolbar="essential"
        placeholder="Type to see plain text output..."
      />
      <details open>
        <summary>Current Text Value</summary>
        <pre>{{ textContent }}</pre>
      </details>
    </section>

    <!-- Programmatic Update Demo -->
    <section class="demo-section">
      <h3>4. Programmatic Updates</h3>
      <p>
        Update the v-model value programmatically to see bidirectional binding.
      </p>
      <div class="button-group">
        <button @click="htmlContent = '<p>Programmatically <em>updated</em> content!</p>'">
          Update HTML Content
        </button>
        <button @click="textContent = 'Programmatically updated text content!'">
          Update Text Content
        </button>
        <button @click="deltaContent = null">
          Clear Delta Content
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.content-types-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.demo-section h3 {
  margin-top: 0;
  color: #333;
}

.demo-section p {
  color: #666;
  margin-bottom: 16px;
}

details {
  margin-top: 16px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
}

details summary {
  cursor: pointer;
  font-weight: 500;
  color: #333;
}

pre {
  margin: 12px 0 0 0;
  padding: 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.button-group button {
  padding: 8px 16px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.button-group button:hover {
  background: #1565c0;
}
</style>
