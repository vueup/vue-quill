<script setup lang="ts">
/**
 * Read-Only and Disabled States Demo
 *
 * Demonstrates:
 * - editable prop for read-only mode
 * - Reactive editable state changes
 * - Placeholder text
 * - Disabled styling
 */

import { ref } from 'vue'
import { QuillEditor, useEditor, EditorContent } from '@vueup/vue-quill'

// ─── Example 1: Toggle Editable ─────────────────────────────────────────

const content1 = ref('<p>This content can be toggled between editable and read-only.</p>')
const isEditable1 = ref(true)

// ─── Example 2: useEditor with Editable ─────────────────────────────────

const { editor: composableEditor } = useEditor({
  content: '<p>Composable editor with editable control</p>',
  contentType: 'html',
  theme: 'snow',
  editable: true,
})

const isEditable2 = ref(true)

function toggleComposableEditable() {
  isEditable2.value = !isEditable2.value
  composableEditor.value?.setEditable(isEditable2.value)
}

// ─── Example 3: Read-Only Display ───────────────────────────────────────

const displayContent = ref(`
<h2>Article Title</h2>
<p>This is a <strong>read-only</strong> display of rich text content. Users cannot edit this content, but the formatting is preserved.</p>
<ul>
  <li>Bullet point one</li>
  <li>Bullet point two</li>
  <li>Bullet point three</li>
</ul>
<p>Perfect for displaying formatted user-generated content in a consistent way.</p>
`)

// ─── Example 4: Placeholder Text ────────────────────────────────────────

const emptyContent = ref('')
const placeholderText = ref('Enter your text here...')

// ─── Example 5: Dynamic Placeholder ─────────────────────────────────────

const dynamicPlaceholder = ref('Start typing...')
const placeholderOptions = [
  'Start typing...',
  'Write something amazing!',
  'Your content goes here',
  'Share your thoughts...',
]
</script>

<template>
  <div class="readonly-demo">
    <h2>Read-Only and Disabled States</h2>
    <p>Control editor editability and placeholder text.</p>

    <!-- Toggle Editable -->
    <section class="demo-section">
      <h3>1. Toggle Editable State</h3>
      <p>Switch between editable and read-only mode dynamically.</p>

      <div class="controls">
        <label class="toggle">
          <input
            v-model="isEditable1"
            type="checkbox"
          />
          <span>Editable</span>
        </label>
      </div>

      <QuillEditor
        v-model="content1"
        theme="snow"
        toolbar="essential"
        :editable="isEditable1"
        placeholder="Type here..."
      />

      <div :class="['status', isEditable1 ? 'editable' : 'readonly']">
        Status: {{ isEditable1 ? 'Editable' : 'Read-Only' }}
      </div>
    </section>

    <!-- useEditor Editable -->
    <section class="demo-section">
      <h3>2. Programmatic Editable Control</h3>
      <p>Use <code>setEditable()</code> method on the Editor instance.</p>

      <div class="controls">
        <button @click="toggleComposableEditable">
          {{ isEditable2 ? 'Make Read-Only' : 'Make Editable' }}
        </button>
      </div>

      <EditorContent v-if="composableEditor" :editor="composableEditor" />

      <div :class="['status', isEditable2 ? 'editable' : 'readonly']">
        Status: {{ isEditable2 ? 'Editable' : 'Read-Only' }}
      </div>

      <details>
        <summary>Code</summary>
        <pre>{{ programmaticCode }}</pre>
      </details>
    </section>

    <!-- Read-Only Display -->
    <section class="demo-section">
      <h3>3. Read-Only Content Display</h3>
      <p>Display formatted content without editing capabilities.</p>

      <QuillEditor
        v-model="displayContent"
        theme="snow"
        :toolbar="false"
        :editable="false"
      />

      <p class="hint">
        No toolbar, no cursor, no editing. Perfect for displaying rich text in a read-only context.
      </p>
    </section>

    <!-- Placeholder -->
    <section class="demo-section">
      <h3>4. Placeholder Text</h3>
      <p>Show placeholder text when the editor is empty.</p>

      <QuillEditor
        v-model="emptyContent"
        theme="snow"
        toolbar="minimal"
        :placeholder="placeholderText"
      />

      <div class="controls">
        <input
          v-model="placeholderText"
          type="text"
          placeholder="Enter custom placeholder..."
        />
      </div>
    </section>

    <!-- Dynamic Placeholder -->
    <section class="demo-section">
      <h3>5. Dynamic Placeholder</h3>
      <p>Change placeholder text dynamically.</p>

      <QuillEditor
        v-model="emptyContent"
        theme="snow"
        toolbar="minimal"
        :placeholder="dynamicPlaceholder"
      />

      <div class="button-group">
        <button
          v-for="option in placeholderOptions"
          :key="option"
          :class="{ active: dynamicPlaceholder === option }"
          @click="dynamicPlaceholder = option"
        >
          {{ option }}
        </button>
      </div>
    </section>

    <!-- API Reference -->
    <section class="demo-section">
      <h3>Props Reference</h3>

      <table class="props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>editable</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Whether the editor is editable</td>
          </tr>
          <tr>
            <td><code>placeholder</code></td>
            <td><code>string</code></td>
            <td><code>undefined</code></td>
            <td>Placeholder text when empty</td>
          </tr>
        </tbody>
      </table>

      <h4>Editor Methods</h4>
      <table class="props-table">
        <thead>
          <tr>
            <th>Method</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>editor.setEditable(boolean)</code></td>
            <td>Programmatically set editable state</td>
          </tr>
          <tr>
            <td><code>editor.isEditable</code></td>
            <td>Get current editable state (getter)</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script lang="ts">
const programmaticCode = `// Using useEditor
const { editor } = useEditor({
  content: '<p>Hello</p>',
  editable: true,
})

// Toggle editability
function toggleEditable() {
  const current = editor.value?.isEditable ?? true
  editor.value?.setEditable(!current)
}

// Using template ref
const editorRef = ref<QuillEditorInstance>()

function makeReadOnly() {
  editorRef.value?.editor?.setEditable(false)
}`

export { programmaticCode }
</script>

<style scoped>
.readonly-demo {
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

.demo-section code {
  background: #e8e8e8;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
}

.controls {
  margin-bottom: 16px;
}

.controls input[type="text"] {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  max-width: 300px;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
}

.toggle input {
  width: 18px;
  height: 18px;
}

.status {
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.status.editable {
  background: #e8f5e9;
  color: #2e7d32;
}

.status.readonly {
  background: #fff3e0;
  color: #e65100;
}

.button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.button-group button {
  padding: 8px 16px;
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.button-group button:hover {
  background: #e0e0e0;
}

.button-group button.active {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

.controls button {
  padding: 8px 16px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.controls button:hover {
  background: #1565c0;
}

.hint {
  font-size: 13px;
  color: #888;
  margin-top: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 4px;
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
  font-size: 12px;
  white-space: pre-wrap;
}

.props-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-top: 16px;
}

.props-table th,
.props-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.props-table th {
  background: #f5f5f5;
  font-weight: 600;
}

.props-table code {
  background: #e8e8e8;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

h4 {
  margin-top: 24px;
  margin-bottom: 8px;
}
</style>
