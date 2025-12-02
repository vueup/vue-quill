# Quickstart: VueQuill v2.0

> Vue 3.5+ Rich Text Editor powered by Quill 2.x — TipTap-inspired API

## Installation

```bash
# pnpm (recommended)
pnpm add @vueup/vue-quill

# npm
npm install @vueup/vue-quill

# yarn
yarn add @vueup/vue-quill
```

---

## Pattern 1: useEditor (Recommended)

The `useEditor` composable is the **primary API** for creating editors, following TipTap's composable-first pattern:

```vue
<script setup lang="ts">
import { EditorContent, useEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/style.css'

const { editor } = useEditor({
  content: '<p>Hello World</p>',
  contentType: 'html',
  onUpdate: ({ editor }) => {
    console.log('Content:', editor.getHTML())
  },
})
</script>

<template>
  <EditorContent :editor="editor" />
</template>
```

### Why useEditor?

- **Composable**: Access editor instance outside template
- **Event-driven**: Configure callbacks inline with options
- **Type-safe**: Full TypeScript inference
- **Flexible**: Combine with other composables

---

## Pattern 2: Component with v-model (Simple)

For simpler use cases, use the `QuillEditor` component with v-model:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/style.css'

const content = ref('<p>Hello World</p>')
</script>

<template>
  <QuillEditor v-model="content" contentType="html" />
</template>
```

---

## Content Types

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useEditor, EditorContent, type Delta } from '@vueup/vue-quill'

// HTML content
const { editor: htmlEditor } = useEditor({
  content: '<p>Hello <strong>World</strong></p>',
  contentType: 'html',
})

// Delta content (Quill's native format)
const { editor: deltaEditor } = useEditor({
  contentType: 'delta',
})

// Plain text
const { editor: textEditor } = useEditor({
  content: 'Hello World',
  contentType: 'text',
})
</script>

<template>
  <EditorContent :editor="htmlEditor" />
  <EditorContent :editor="deltaEditor" />
  <EditorContent :editor="textEditor" />
</template>
```

---

## Themes

```vue
<script setup lang="ts">
import { useEditor, EditorContent } from '@vueup/vue-quill'

// Snow theme (default) - toolbar above content
const { editor: snowEditor } = useEditor({ theme: 'snow' })

// Bubble theme - floating tooltip toolbar
const { editor: bubbleEditor } = useEditor({ theme: 'bubble' })

// No theme - bring your own styles
const { editor: customEditor } = useEditor({ theme: '' })
</script>

<template>
  <EditorContent :editor="snowEditor" />
  <EditorContent :editor="bubbleEditor" />
  <EditorContent :editor="customEditor" />
</template>
```

---

## Toolbar Presets

```vue
<script setup lang="ts">
import { useEditor, EditorContent } from '@vueup/vue-quill'

// Minimal: headers, basic formatting, lists
const { editor: minimalEditor } = useEditor({ toolbar: 'minimal' })

// Essential: minimal + blockquote, code, link, color
const { editor: essentialEditor } = useEditor({ toolbar: 'essential' })

// Full: all formatting options
const { editor: fullEditor } = useEditor({ toolbar: 'full' })

// Custom toolbar configuration
const { editor: customEditor } = useEditor({
  toolbar: [['bold', 'italic'], ['link', 'image']],
})

// Disable toolbar
const { editor: noToolbar } = useEditor({ toolbar: false })
</script>
```

---

## Event-Driven Callbacks

Following TipTap's pattern, configure callbacks directly in options:

```vue
<script setup lang="ts">
import { useEditor, EditorContent } from '@vueup/vue-quill'

const { editor } = useEditor({
  content: '<p>Start typing...</p>',
  contentType: 'html',
  
  // Called when editor is created and ready
  onCreate: ({ editor }) => {
    console.log('Editor created:', editor)
  },
  
  // Called when content changes
  onUpdate: ({ editor, delta, source }) => {
    console.log('Content updated:', editor.getHTML())
    console.log('Change delta:', delta)
    console.log('Source:', source)
  },
  
  // Called when selection changes
  onSelectionUpdate: ({ editor, range, oldRange }) => {
    console.log('Selection:', range)
  },
  
  // Called when editor gains focus
  onFocus: ({ editor, event }) => {
    console.log('Focused')
  },
  
  // Called when editor loses focus
  onBlur: ({ editor, event }) => {
    console.log('Blurred')
  },
  
  // Called before editor is destroyed
  onDestroy: () => {
    console.log('Destroying...')
  },
  
  // Called when an error occurs
  onError: ({ editor, error }) => {
    console.error('Error:', error)
  },
})
</script>

<template>
  <EditorContent :editor="editor" />
</template>
```

---

## Command Chaining

Following TipTap's fluent command API:

```vue
<script setup lang="ts">
import { useEditor, EditorContent } from '@vueup/vue-quill'

const { editor } = useEditor({
  content: '<p>Hello World</p>',
  contentType: 'html',
})

function formatBold() {
  editor.value?.chain().focus().bold().run()
}

function insertText() {
  editor.value?.chain()
    .focus('end')
    .insertContent('<p>New paragraph!</p>')
    .run()
}

function clearAll() {
  editor.value?.chain()
    .selectAll()
    .clearContent()
    .run()
}
</script>

<template>
  <div class="toolbar">
    <button 
      @click="formatBold"
      :disabled="!editor?.can().bold()"
    >
      Bold
    </button>
    <button @click="insertText">Insert</button>
    <button @click="clearAll">Clear</button>
  </div>
  <EditorContent :editor="editor" />
</template>
```

---

## Reactive State

Access editor state for UI bindings:

```vue
<script setup lang="ts">
import { useEditor, EditorContent } from '@vueup/vue-quill'
import { computed } from 'vue'

const { editor } = useEditor({
  content: '<p>Hello World</p>',
  contentType: 'html',
})

// Reactive state properties
const isFocused = computed(() => editor.value?.isFocused ?? false)
const isEmpty = computed(() => editor.value?.isEmpty ?? true)
const isEditable = computed(() => editor.value?.isEditable ?? true)
</script>

<template>
  <div class="status-bar">
    <span :class="{ active: isFocused }">{{ isFocused ? 'Focused' : 'Blurred' }}</span>
    <span>{{ isEmpty ? 'Empty' : 'Has content' }}</span>
    <span>{{ isEditable ? 'Editable' : 'Read-only' }}</span>
  </div>
  <EditorContent :editor="editor" />
</template>
```

---

## Content Methods

```vue
<script setup lang="ts">
import { useEditor, EditorContent } from '@vueup/vue-quill'

const { editor } = useEditor({
  content: '<p>Hello World</p>',
  contentType: 'html',
})

function getContent() {
  // Get as HTML
  const html = editor.value?.getHTML()
  console.log('HTML:', html)
  
  // Get as Delta (Quill's native format)
  const delta = editor.value?.getJSON()
  console.log('Delta:', delta)
  
  // Get as plain text
  const text = editor.value?.getText()
  console.log('Text:', text)
}

function setContent() {
  // Set content (auto-detects format based on contentType)
  editor.value?.setContent('<p>New content!</p>')
}

function clearContent() {
  editor.value?.clearContent()
}
</script>

<template>
  <EditorContent :editor="editor" />
  <button @click="getContent">Get Content</button>
  <button @click="setContent">Set Content</button>
  <button @click="clearContent">Clear</button>
</template>
```

---

## Focus & Selection

```vue
<script setup lang="ts">
import { useEditor, EditorContent } from '@vueup/vue-quill'

const { editor } = useEditor({
  content: '<p>Hello World</p>',
  contentType: 'html',
})

function focusStart() {
  editor.value?.focus('start')
}

function focusEnd() {
  editor.value?.focus('end')
}

function selectAll() {
  editor.value?.selectAll()
}

function blur() {
  editor.value?.blur()
}

function getSelection() {
  const range = editor.value?.getSelection()
  console.log('Selection:', range)
}
</script>

<template>
  <div class="toolbar">
    <button @click="focusStart">Focus Start</button>
    <button @click="focusEnd">Focus End</button>
    <button @click="selectAll">Select All</button>
    <button @click="blur">Blur</button>
    <button @click="getSelection">Get Selection</button>
  </div>
  <EditorContent :editor="editor" />
</template>
```

---

## Read-Only Mode

```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useEditor, EditorContent } from '@vueup/vue-quill'

const isEditable = ref(true)

const { editor } = useEditor({
  content: '<p>Toggle editable mode</p>',
  contentType: 'html',
  editable: isEditable.value,
})

// React to editable changes
watchEffect(() => {
  editor.value?.setEditable(isEditable.value)
})
</script>

<template>
  <EditorContent :editor="editor" />
  <button @click="isEditable = !isEditable">
    {{ isEditable ? 'Make Read-Only' : 'Enable Editing' }}
  </button>
</template>
```

---

## Custom Modules

```vue
<script setup lang="ts">
import { useEditor, EditorContent } from '@vueup/vue-quill'
import ImageResize from 'quill-image-resize-module'

const { editor } = useEditor({
  content: '<p>Editor with image resize</p>',
  contentType: 'html',
  modules: [
    {
      name: 'imageResize',
      module: ImageResize,
      options: {
        displaySize: true,
      },
    },
  ],
})
</script>

<template>
  <EditorContent :editor="editor" />
</template>
```

---

## Custom Toolbar Slot

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'

const content = ref('<p>Hello World</p>')
</script>

<template>
  <QuillEditor v-model="content" contentType="html" toolbar="#custom-toolbar">
    <template #toolbar>
      <div id="custom-toolbar">
        <button class="ql-bold">B</button>
        <button class="ql-italic">I</button>
        <button class="ql-underline">U</button>
        <select class="ql-size">
          <option value="small">Small</option>
          <option selected>Normal</option>
          <option value="large">Large</option>
        </select>
      </div>
    </template>
  </QuillEditor>
</template>
```

---

## TypeScript Support

VueQuill v2.0 includes full TypeScript definitions:

```typescript
import {
  // Components
  QuillEditor,
  EditorContent,
  
  // Composables
  useEditor,
  
  // Configuration
  toolbarPresets,
  
  // Types
  type Editor,
  type VueQuillOptions,
  type EditorEvents,
  type EditorCommandChain,
  type EditorCanCommands,
  type UseEditorReturn,
  type QuillEditorProps,
  type QuillEditorEmits,
  type QuillEditorSlots,
  type QuillEditorInstance,
  type EditorContentProps,
  type ContentType,
  type EditorTheme,
  type ToolbarOption,
  type QuillModule,
  
  // Re-exports from Quill
  Delta,
  type Range,
  type EmitterSource,
  type QuillOptions,
} from '@vueup/vue-quill'
```

---

## SSR / Nuxt

VueQuill handles SSR automatically by rendering a placeholder during server-side rendering:

```vue
<!-- Works out of the box in Nuxt -->
<script setup lang="ts">
import { useEditor, EditorContent } from '@vueup/vue-quill'
import '@vueup/vue-quill/style.css'

const { editor } = useEditor({
  content: '<p>Hello from Nuxt</p>',
  contentType: 'html',
})
</script>

<template>
  <EditorContent :editor="editor" />
</template>
```

For manual SSR control:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isClient = ref(false)

onMounted(() => {
  isClient.value = true
})
</script>

<template>
  <ClientOnly>
    <EditorContent :editor="editor" />
  </ClientOnly>
</template>
```

---

## Cleanup

The editor is automatically destroyed when the component unmounts. For manual cleanup:

```vue
<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@vueup/vue-quill'

const { editor } = useEditor({
  content: '<p>Hello World</p>',
  contentType: 'html',
  onDestroy: () => {
    console.log('Editor destroyed')
  },
})

// Manual cleanup (optional - automatic on unmount)
onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>
```

---

## Migration from v1.x

Key changes from VueQuill v1.x:

| v1.x | v2.0 |
|------|------|
| Component-first | **useEditor composable-first** |
| Template events (`@text-change`) | **Callback options (`onUpdate`)** |
| `getQuill()` method | **`editor.quill` property** |
| Quill 1.x/2.x support | **Quill 2.x only** |
| Vue 3.2+ | **Vue 3.5+** |
| `v-model:content` | **`v-model` or callback options** |

See the [Migration Guide](../docs/content/guide/migration.md) for complete details.
