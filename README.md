<p align="center">
  <a href="https://vueup.github.io/vue-quill/" target="_blank" rel="noopener noreferrer">
    <img height="120" src="https://vueup.github.io/vue-quill/quill.svg" alt="Vue + Quill logo">
  </a>
</p>
<h1 align="center">VueQuill v2.0</h1>
<h3 align="center">
  Rich Text Editor Component for Vue 3
</h3>
<p align="center">
  <a href="https://www.npmjs.com/package/@vueup/vue-quill" title="Version" target="_blank" rel="noopener noreferrer">
    <img alt="npm (tag)" src="https://img.shields.io/npm/v/@vueup/vue-quill">
  </a>
  <a href="https://www.npmjs.com/package/@vueup/vue-quill" title="License" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/npm/l/@vueup/vue-quill" alt="License">
  </a>
  <a href="https://github.com/vueup/vue-quill/actions" title="Checks" target="_blank" rel="noopener noreferrer">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/vueup/vue-quill/release-vue-quill.yml?branch=master&logo=github">
  </a>
  <a href="https://github.com/vueup/vue-quill" title="Github Repo Stars" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/github/stars/vueup/vue-quill?style=social" alt="Github Repo Stars">
  </a>
</p>

## �� Overview

**VueQuill** is a rich text editor component for Vue 3, powered by Quill 2.x.

- 💚 **Vue 3.5+** - Modern Vue with Composition API and \`<script setup>\`
- 🧙‍♂️ **TypeScript** - Full type safety with TypeScript 5.x
- 🎨 **TipTap-style API** - Familiar composable pattern with \`useEditor\`
- ⚡ **Vite 6** - Lightning-fast development and builds
- 📦 **Tree-shakeable** - Import only what you need

## 🚀 Quick Start

### Installation

\`\`\`bash
npm install @vueup/vue-quill
# or
pnpm add @vueup/vue-quill
# or
yarn add @vueup/vue-quill
\`\`\`

### Basic Usage

#### Option 1: Component (Recommended for Templates)

\`\`\`vue
<script setup lang="ts">
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/style.css'

const content = ref('<p>Hello World!</p>')
</script>

<template>
  <QuillEditor
    v-model="content"
    theme="snow"
    toolbar="essential"
    content-type="html"
    placeholder="Start writing..."
  />
</template>
\`\`\`

#### Option 2: Composable (TipTap-style)

\`\`\`vue
<script setup lang="ts">
import { useEditor, EditorContent } from '@vueup/vue-quill'
import '@vueup/vue-quill/style.css'

const { editor } = useEditor({
  content: '<p>Hello World!</p>',
  contentType: 'html',
  theme: 'snow',
  toolbar: 'essential',
  onUpdate: ({ editor }) => {
    console.log('Content:', editor.getHTML())
  },
})
</script>

<template>
  <div v-if="editor">
    <button @click="editor.chain().bold().run()">Bold</button>
    <button @click="editor.chain().italic().run()">Italic</button>
    <EditorContent :editor="editor" />
  </div>
</template>
\`\`\`

## 📚 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`modelValue\` | \`string \| Delta \| null\` | \`null\` | v-model binding for content |
| \`contentType\` | \`'delta' \| 'html' \| 'text'\` | \`'delta'\` | Content format for serialization |
| \`theme\` | \`'snow' \| 'bubble' \| ''\` | \`'snow'\` | Editor theme |
| \`toolbar\` | \`'minimal' \| 'essential' \| 'full' \| string \| array \| false\` | \`'essential'\` | Toolbar configuration |
| \`placeholder\` | \`string\` | \`undefined\` | Placeholder text |
| \`editable\` | \`boolean\` | \`true\` | Whether editor is editable |
| \`autofocus\` | \`boolean \| 'start' \| 'end'\` | \`false\` | Auto focus on mount |
| \`modules\` | \`QuillModule[]\` | \`[]\` | Custom Quill modules |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| \`@update:modelValue\` | \`string \| Delta\` | v-model update |
| \`@create\` | \`{ editor }\` | Editor initialized |
| \`@update\` | \`{ editor, delta, oldDelta, source }\` | Content changed |
| \`@selection-update\` | \`{ editor, range, oldRange, source }\` | Selection changed |
| \`@focus\` | \`{ editor, event }\` | Editor focused |
| \`@blur\` | \`{ editor, event }\` | Editor blurred |
| \`@error\` | \`{ error }\` | Error occurred |

### Editor Instance Methods

\`\`\`typescript
// Content
editor.getHTML()                    // Get content as HTML
editor.getJSON()                    // Get content as Delta
editor.getText()                    // Get content as plain text
editor.setContent(content)          // Set content
editor.clearContent()               // Clear content

// Selection
editor.getSelection()               // Get current selection
editor.setSelection(index, length)  // Set selection
editor.selectAll()                  // Select all

// Focus
editor.focus('start' | 'end')       // Focus editor
editor.blur()                       // Remove focus

// State
editor.setEditable(boolean)         // Toggle editable
editor.isReady                      // Is initialized
editor.isFocused                    // Has focus
editor.isEditable                   // Is editable
editor.isEmpty                      // Has no content

// Commands (chainable)
editor.chain().bold().italic().run()

// Quill access
editor.quill                        // Underlying Quill instance
editor.element                      // Container element
\`\`\`

## 🎨 Themes

### Snow Theme (Default)
\`\`\`vue
<QuillEditor theme="snow" />
\`\`\`

### Bubble Theme
\`\`\`vue
<QuillEditor theme="bubble" />
\`\`\`

## 🛠️ Toolbar Presets

\`\`\`vue
<!-- Minimal: Bold, Italic, Underline -->
<QuillEditor toolbar="minimal" />

<!-- Essential: Basic formatting + lists -->
<QuillEditor toolbar="essential" />

<!-- Full: All available options -->
<QuillEditor toolbar="full" />

<!-- Custom array -->
<QuillEditor :toolbar="[['bold', 'italic'], [{ 'list': 'bullet' }]]" />

<!-- No toolbar -->
<QuillEditor :toolbar="false" />
\`\`\`

## 📦 Custom Modules

\`\`\`vue
<script setup>
import { QuillEditor } from '@vueup/vue-quill'
import ImageResize from 'quill-image-resize-module'

const modules = [
  {
    name: 'imageResize',
    module: ImageResize,
    options: { displaySize: true },
  },
]
</script>

<template>
  <QuillEditor :modules="modules" />
</template>
\`\`\`

## 📝 License

[MIT](https://choosealicense.com/licenses/mit/)

## 👏 Contributing

Pull requests are welcome. For major changes, please create a [new discussion](https://github.com/vueup/vue-quill/discussions) first.
