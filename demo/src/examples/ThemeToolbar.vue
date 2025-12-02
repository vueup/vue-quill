<script setup lang="ts">
/**
 * Theme and Toolbar Demo
 *
 * Demonstrates:
 * - Theme options (snow, bubble, none)
 * - Toolbar presets (minimal, essential, full)
 * - Custom toolbar arrays
 * - External toolbar via CSS selector
 * - Toolbar slot for custom markup
 */

import { ref } from 'vue'
import { QuillEditor, toolbarPresets } from '@vueup/vue-quill'
import type { EditorTheme, ToolbarOption } from '@vueup/vue-quill'

// Current theme selection
const currentTheme = ref<EditorTheme>('snow')

// Content for each example
const content1 = ref('<p>Snow theme with essential toolbar</p>')
const content2 = ref('<p>Bubble theme (select text to see toolbar)</p>')
const content3 = ref('<p>Minimal toolbar preset</p>')
const content4 = ref('<p>Full toolbar preset</p>')
const content5 = ref('<p>Custom toolbar configuration</p>')
const content6 = ref('<p>Toolbar slot for custom controls</p>')

// Custom toolbar configuration
const customToolbar: ToolbarOption = [
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link', 'image'],
  ['clean'],
]

// Handle custom button in toolbar slot
function insertEmoji() {
  // Note: This is a simple example. In production, you'd use the editor ref
  alert('Emoji picker would open here!')
}
</script>

<template>
  <div class="theme-toolbar-demo">
    <h2>Theme and Toolbar Customization</h2>

    <!-- Theme Selection -->
    <section class="demo-section">
      <h3>1. Theme Options</h3>
      <p>VueQuill supports Snow (default), Bubble, and no theme.</p>

      <div class="theme-selector">
        <label>
          <input
            v-model="currentTheme"
            type="radio"
            name="theme"
            value="snow"
          />
          Snow Theme
        </label>
        <label>
          <input
            v-model="currentTheme"
            type="radio"
            name="theme"
            value="bubble"
          />
          Bubble Theme
        </label>
        <label>
          <input
            v-model="currentTheme"
            type="radio"
            name="theme"
            value=""
          />
          No Theme
        </label>
      </div>

      <QuillEditor
        v-model="content1"
        :theme="currentTheme"
        toolbar="essential"
        placeholder="Try different themes..."
      />
      <p class="hint">
        <strong>Snow:</strong> Traditional toolbar above editor.<br />
        <strong>Bubble:</strong> Floating toolbar appears on text selection.<br />
        <strong>None:</strong> No built-in styling (bring your own).
      </p>
    </section>

    <!-- Toolbar Presets -->
    <section class="demo-section">
      <h3>2. Toolbar Presets</h3>
      <p>Three built-in presets: minimal, essential (default), and full.</p>

      <h4>Minimal</h4>
      <QuillEditor
        v-model="content3"
        theme="snow"
        toolbar="minimal"
        placeholder="Minimal toolbar..."
      />
      <details>
        <summary>Minimal Preset Config</summary>
        <pre>{{ JSON.stringify(toolbarPresets.minimal, null, 2) }}</pre>
      </details>

      <h4>Essential (Default)</h4>
      <QuillEditor
        v-model="content1"
        theme="snow"
        toolbar="essential"
        placeholder="Essential toolbar..."
      />
      <details>
        <summary>Essential Preset Config</summary>
        <pre>{{ JSON.stringify(toolbarPresets.essential, null, 2) }}</pre>
      </details>

      <h4>Full</h4>
      <QuillEditor
        v-model="content4"
        theme="snow"
        toolbar="full"
        placeholder="Full toolbar..."
      />
      <details>
        <summary>Full Preset Config</summary>
        <pre>{{ JSON.stringify(toolbarPresets.full, null, 2) }}</pre>
      </details>
    </section>

    <!-- Custom Toolbar Array -->
    <section class="demo-section">
      <h3>3. Custom Toolbar Array</h3>
      <p>Pass a custom array of toolbar groups.</p>

      <QuillEditor
        v-model="content5"
        theme="snow"
        :toolbar="customToolbar"
        placeholder="Custom toolbar configuration..."
      />
      <details open>
        <summary>Custom Toolbar Config</summary>
        <pre>{{ JSON.stringify(customToolbar, null, 2) }}</pre>
      </details>
    </section>

    <!-- Bubble Theme -->
    <section class="demo-section">
      <h3>4. Bubble Theme</h3>
      <p>Select some text to see the floating toolbar.</p>

      <QuillEditor
        v-model="content2"
        theme="bubble"
        toolbar="essential"
        placeholder="Select text to see bubble toolbar..."
      />
    </section>

    <!-- Toolbar Slot -->
    <section class="demo-section">
      <h3>5. Custom Toolbar Slot</h3>
      <p>Use the toolbar slot for completely custom toolbar markup.</p>

      <QuillEditor
        v-model="content6"
        theme="snow"
        :toolbar="false"
        placeholder="Custom toolbar via slot..."
      >
        <template #toolbar>
          <div class="custom-toolbar">
            <button class="ql-bold" title="Bold"></button>
            <button class="ql-italic" title="Italic"></button>
            <button class="ql-underline" title="Underline"></button>
            <span class="separator"></span>
            <button class="ql-list" value="ordered" title="Ordered List"></button>
            <button class="ql-list" value="bullet" title="Bullet List"></button>
            <span class="separator"></span>
            <button class="custom-button" @click="insertEmoji">
              😀 Emoji
            </button>
          </div>
        </template>
      </QuillEditor>
      <p class="hint">
        Note: Use <code>ql-*</code> classes for Quill to bind handlers automatically.
        Add custom buttons for your own functionality.
      </p>
    </section>

    <!-- Disabled Toolbar -->
    <section class="demo-section">
      <h3>6. No Toolbar</h3>
      <p>Set <code>toolbar="false"</code> to hide the toolbar completely.</p>

      <QuillEditor
        v-model="content1"
        theme="snow"
        :toolbar="false"
        placeholder="No toolbar..."
      />
    </section>
  </div>
</template>

<style scoped>
.theme-toolbar-demo {
  max-width: 900px;
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

.demo-section h4 {
  margin-top: 24px;
  margin-bottom: 12px;
  color: #666;
}

.demo-section p {
  color: #666;
  margin-bottom: 16px;
}

.theme-selector {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.theme-selector label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
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
}

.hint {
  font-size: 13px;
  color: #888;
  margin-top: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 4px;
}

.hint code {
  background: #e8e8e8;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

/* Custom toolbar styling */
.custom-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border: 1px solid #ccc;
  border-bottom: none;
  background: #f3f3f3;
}

.custom-toolbar button {
  padding: 5px 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.custom-toolbar button:hover {
  background: #e8e8e8;
}

.custom-toolbar .separator {
  width: 1px;
  height: 20px;
  background: #ddd;
  margin: 0 8px;
}

.custom-button {
  font-size: 14px !important;
}
</style>
