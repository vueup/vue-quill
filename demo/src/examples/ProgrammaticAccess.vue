<script setup lang="ts">
/**
 * Programmatic Access Demo
 *
 * Demonstrates:
 * - Accessing the Quill instance via template ref
 * - Using the Editor API
 * - Direct Quill API access for advanced operations
 */

import { ref, onMounted } from 'vue'
import { QuillEditor, useEditor, EditorContent } from '@vueup/vue-quill'
import type { QuillEditorInstance, Editor } from '@vueup/vue-quill'
import type { Delta, Range } from 'quill'

// ─── Example 1: Template Ref Access ─────────────────────────────────────

const editorRef = ref<QuillEditorInstance | null>(null)
const content1 = ref('<p>Access me programmatically!</p>')

// Get selection info
const selectionInfo = ref<string>('No selection')

function updateSelectionInfo() {
  const editor = editorRef.value?.editor
  if (!editor) return
  
  const range = editor.getSelection()
  if (range) {
    selectionInfo.value = `Index: ${range.index}, Length: ${range.length}`
    if (range.length > 0) {
      const text = editor.getText(range.index, range.length)
      selectionInfo.value += ` | Selected: "${text}"`
    }
  } else {
    selectionInfo.value = 'No selection (editor not focused)'
  }
}

// Insert content programmatically
function insertAtCursor() {
  const editor = editorRef.value?.editor
  if (!editor?.quill) return
  
  const range = editor.getSelection()
  const index = range ? range.index : editor.quill.getLength()
  
  // Use Quill API directly
  editor.quill.insertText(index, ' [INSERTED] ', { bold: true, color: '#1976d2' })
}

// Format selection
function formatSelection(format: string, value: boolean | string) {
  const editor = editorRef.value?.editor
  if (!editor?.quill) return
  
  const range = editor.getSelection()
  if (range && range.length > 0) {
    editor.quill.formatText(range.index, range.length, format, value)
  }
}

// Get all formats at cursor
function getFormatsAtCursor() {
  const editor = editorRef.value?.editor
  if (!editor?.quill) return '{}'
  
  const formats = editor.quill.getFormat()
  return JSON.stringify(formats, null, 2)
}

// ─── Example 2: useEditor Access ────────────────────────────────────────

const { editor: composableEditor } = useEditor({
  content: '<p>Composable editor with programmatic access</p>',
  contentType: 'html',
  theme: 'snow',
})

function getDelta(): string {
  if (!composableEditor.value) return '(editor not ready)'
  const delta = composableEditor.value.getJSON()
  return JSON.stringify(delta, null, 2)
}

function getFormattedHTML(): string {
  if (!composableEditor.value) return ''
  return composableEditor.value.getHTML()
}

// ─── Example 3: Editor Methods ──────────────────────────────────────────

const content3 = ref('<p>Test editor methods here</p>')
const editorRef3 = ref<QuillEditorInstance | null>(null)

function focusStart() {
  editorRef3.value?.editor?.focus('start')
}

function focusEnd() {
  editorRef3.value?.editor?.focus('end')
}

function selectAll() {
  editorRef3.value?.editor?.selectAll()
}

function clearContent() {
  editorRef3.value?.editor?.clearContent()
}

function undoAction() {
  const quill = editorRef3.value?.editor?.quill
  if (quill) {
    const history = quill.getModule('history')
    history?.undo()
  }
}

function redoAction() {
  const quill = editorRef3.value?.editor?.quill
  if (quill) {
    const history = quill.getModule('history')
    history?.redo()
  }
}
</script>

<template>
  <div class="programmatic-demo">
    <h2>Programmatic Access Demo</h2>
    <p>Access the Quill instance for advanced operations.</p>

    <!-- Template Ref Access -->
    <section class="demo-section">
      <h3>1. Template Ref Access</h3>
      <p>Get a reference to the editor component and access its API.</p>

      <QuillEditor
        ref="editorRef"
        v-model="content1"
        theme="snow"
        toolbar="essential"
        @selection-update="updateSelectionInfo"
      />

      <div class="info-panel">
        <strong>Selection:</strong> {{ selectionInfo }}
      </div>

      <div class="button-group">
        <button @click="insertAtCursor">Insert at Cursor</button>
        <button @click="formatSelection('bold', true)">Bold Selection</button>
        <button @click="formatSelection('italic', true)">Italic Selection</button>
        <button @click="formatSelection('color', 'red')">Red Selection</button>
      </div>

      <details>
        <summary>Formats at Cursor</summary>
        <pre>{{ getFormatsAtCursor() }}</pre>
      </details>

      <details>
        <summary>Code Example</summary>
        <pre>{{ templateRefCode }}</pre>
      </details>
    </section>

    <!-- useEditor Access -->
    <section class="demo-section">
      <h3>2. useEditor Composable Access</h3>
      <p>Direct access to the Editor instance from the composable.</p>

      <EditorContent v-if="composableEditor" :editor="composableEditor" />

      <div class="button-group">
        <button @click="composableEditor?.chain().bold().run()">Bold</button>
        <button @click="composableEditor?.chain().italic().run()">Italic</button>
        <button @click="composableEditor?.chain().setHeading(2).run()">H2</button>
        <button @click="composableEditor?.focus('end')">Focus End</button>
      </div>

      <details>
        <summary>Current Delta</summary>
        <pre>{{ getDelta() }}</pre>
      </details>

      <details>
        <summary>Current HTML</summary>
        <pre>{{ getFormattedHTML() }}</pre>
      </details>
    </section>

    <!-- Editor Methods -->
    <section class="demo-section">
      <h3>3. Editor Methods</h3>
      <p>Common editor operations via the Editor class.</p>

      <QuillEditor
        ref="editorRef3"
        v-model="content3"
        theme="snow"
        toolbar="essential"
      />

      <div class="button-group">
        <button @click="focusStart">Focus Start</button>
        <button @click="focusEnd">Focus End</button>
        <button @click="selectAll">Select All</button>
        <button @click="clearContent">Clear</button>
        <button @click="undoAction">Undo</button>
        <button @click="redoAction">Redo</button>
      </div>

      <details>
        <summary>Available Methods</summary>
        <pre>{{ editorMethods }}</pre>
      </details>
    </section>

    <!-- Direct Quill Access -->
    <section class="demo-section">
      <h3>4. Direct Quill Instance</h3>
      <p>For advanced operations, access the underlying Quill instance.</p>

      <pre class="code-block">{{ quillAccessCode }}</pre>

      <div class="hint">
        <strong>Note:</strong> Prefer using the Editor API when possible.
        Direct Quill access is useful for features not wrapped by VueQuill.
      </div>
    </section>
  </div>
</template>

<script lang="ts">
const templateRefCode = `// Template
<QuillEditor ref="editorRef" v-model="content" />

// Script
const editorRef = ref<QuillEditorInstance | null>(null)

// Access the editor
const editor = editorRef.value?.editor
const quill = editor?.quill

// Use editor methods
editor?.focus('end')
editor?.setContent('<p>New content</p>')

// Use quill directly
quill?.getSelection()
quill?.formatText(0, 5, 'bold', true)`

const quillAccessCode = `// Access Quill instance
const quill = editorRef.value?.editor?.quill

// Quill API examples:
quill?.getText()                       // Get plain text
quill?.getContents()                   // Get Delta
quill?.getSemanticHTML()               // Get HTML
quill?.getSelection()                  // Get current selection
quill?.setSelection(5, 10)             // Set selection
quill?.formatText(0, 5, 'bold', true)  // Format text
quill?.insertText(0, 'Hello')          // Insert text
quill?.insertEmbed(0, 'image', url)    // Insert embed
quill?.deleteText(0, 5)                // Delete text
quill?.getModule('history')            // Access modules
quill?.getFormat()                     // Get formats at selection`

const editorMethods = `// Editor instance methods
editor.getHTML()           // Get content as HTML
editor.getJSON()           // Get content as Delta
editor.getText()           // Get content as plain text
editor.setContent(val)     // Set content (string or Delta)
editor.clearContent()      // Clear all content
editor.focus('start')      // Focus at start
editor.focus('end')        // Focus at end
editor.blur()              // Remove focus
editor.selectAll()         // Select all content
editor.getSelection()      // Get current selection
editor.setSelection(...)   // Set selection
editor.setEditable(bool)   // Toggle read-only
editor.chain()             // Start command chain
editor.can()               // Check if commands can run
editor.on('event', fn)     // Add event listener
editor.off('event', fn)    // Remove event listener
editor.destroy()           // Cleanup editor

// Properties
editor.quill               // Quill instance
editor.element             // Container DOM element
editor.isReady             // Is initialized
editor.isFocused           // Has focus
editor.isEditable          // Is editable
editor.isEmpty             // Has content`

export { templateRefCode, quillAccessCode, editorMethods }
</script>

<style scoped>
.programmatic-demo {
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

.info-panel {
  margin-top: 12px;
  padding: 12px;
  background: #e3f2fd;
  border-radius: 4px;
  font-size: 14px;
}

.button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.button-group button {
  padding: 8px 16px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.button-group button:hover {
  background: #1565c0;
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
}

.code-block {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 16px;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
}

.hint {
  margin-top: 16px;
  padding: 12px;
  background: #fff3e0;
  border-left: 4px solid #ff9800;
  border-radius: 4px;
  font-size: 13px;
}

.hint strong {
  color: #e65100;
}
</style>
