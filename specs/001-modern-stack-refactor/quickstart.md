# Quickstart: VueQuill v2.0

> Vue 3.5+ Rich Text Editor Component powered by Quill 2.x

## Installation

```bash
# pnpm (recommended)
pnpm add @vueup/vue-quill

# npm
npm install @vueup/vue-quill

# yarn
yarn add @vueup/vue-quill
```

## Basic Usage

### 1. Import Component and Styles

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/style.css'

const content = ref('')
</script>

<template>
  <QuillEditor v-model:content="content" contentType="html" />
</template>
```

### 2. Content Types

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { QuillEditor, Delta } from '@vueup/vue-quill'

// HTML content
const htmlContent = ref('<p>Hello <strong>World</strong></p>')

// Delta content (Quill's native format)
const deltaContent = ref<Delta | null>(null)

// Plain text
const textContent = ref('Hello World')
</script>

<template>
  <!-- HTML -->
  <QuillEditor v-model:content="htmlContent" contentType="html" />

  <!-- Delta (default) -->
  <QuillEditor v-model:content="deltaContent" contentType="delta" />

  <!-- Text -->
  <QuillEditor v-model:content="textContent" contentType="text" />
</template>
```

### 3. Themes

```vue
<template>
  <!-- Snow theme (default) - toolbar above content -->
  <QuillEditor theme="snow" />

  <!-- Bubble theme - floating tooltip toolbar -->
  <QuillEditor theme="bubble" />

  <!-- No theme - bring your own styles -->
  <QuillEditor theme="" />
</template>
```

### 4. Toolbar Presets

```vue
<template>
  <!-- Minimal: headers, basic formatting, lists -->
  <QuillEditor toolbar="minimal" />

  <!-- Essential: minimal + blockquote, code, link, color -->
  <QuillEditor toolbar="essential" />

  <!-- Full: all formatting options -->
  <QuillEditor toolbar="full" />

  <!-- Custom toolbar configuration -->
  <QuillEditor :toolbar="[['bold', 'italic'], ['link', 'image']]" />

  <!-- External toolbar element -->
  <div id="my-toolbar">
    <button class="ql-bold"></button>
    <button class="ql-italic"></button>
  </div>
  <QuillEditor toolbar="#my-toolbar" />
</template>
```

### 5. Events

```vue
<script setup lang="ts">
import type { TextChangePayload, SelectionChangePayload } from '@vueup/vue-quill'

function onTextChange(payload: TextChangePayload) {
  console.log('Text changed:', payload.delta)
}

function onSelectionChange(payload: SelectionChangePayload) {
  console.log('Selection:', payload.range)
}

function onReady(quill: Quill) {
  console.log('Editor ready:', quill)
}
</script>

<template>
  <QuillEditor
    @text-change="onTextChange"
    @selection-change="onSelectionChange"
    @focus="() => console.log('focused')"
    @blur="() => console.log('blurred')"
    @ready="onReady"
    @error="(e) => console.error('Error:', e.error)"
  />
</template>
```

### 6. Access Quill Instance

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { QuillEditorInstance } from '@vueup/vue-quill'

const editorRef = ref<QuillEditorInstance | null>(null)

function focusEditor() {
  editorRef.value?.focus()
}

function getQuillInstance() {
  const quill = editorRef.value?.getQuill()
  console.log('Quill:', quill)
}
</script>

<template>
  <QuillEditor ref="editorRef" />
  <button @click="focusEditor">Focus</button>
  <button @click="getQuillInstance">Get Quill</button>
</template>
```

### 7. Read-Only Mode

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isReadOnly = ref(false)
const content = ref('<p>Toggle read-only mode</p>')
</script>

<template>
  <QuillEditor v-model:content="content" :readOnly="isReadOnly" />
  <button @click="isReadOnly = !isReadOnly">
    {{ isReadOnly ? 'Enable Editing' : 'Make Read-Only' }}
  </button>
</template>
```

### 8. Custom Modules

```vue
<script setup lang="ts">
import ImageResize from 'quill-image-resize-module'

const modules = [
  {
    name: 'imageResize',
    module: ImageResize,
    options: {
      displaySize: true,
    },
  },
]
</script>

<template>
  <QuillEditor :modules="modules" />
</template>
```

---

## Advanced: useQuill Composable

For advanced use cases, use the `useQuill` composable directly:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuill } from '@vueup/vue-quill'
import '@vueup/vue-quill/style.css'

const editorRef = ref<HTMLElement | null>(null)

const {
  quill,
  content,
  selection,
  isFocused,
  isReady,
  getContents,
  setContents,
  focus,
} = useQuill(editorRef, {
  theme: 'snow',
  placeholder: 'Start writing...',
})

// React to content changes
watch(content, (newContent) => {
  console.log('Content updated:', newContent)
})
</script>

<template>
  <div ref="editorRef"></div>
  <p>Ready: {{ isReady }}</p>
  <p>Focused: {{ isFocused }}</p>
</template>
```

---

## TypeScript Support

VueQuill v2.0 includes full TypeScript definitions:

```typescript
import {
  QuillEditor,
  useQuill,
  // Types
  type QuillEditorProps,
  type QuillEditorInstance,
  type QuillEditorEmits,
  type QuillEditorSlots,
  type UseQuillReturn,
  type TextChangePayload,
  type SelectionChangePayload,
  type ContentType,
  type EditorTheme,
  type QuillModule,
  // Re-exports from Quill
  Quill,
  Delta,
  type QuillOptions,
  type Range,
  type EmitterSource,
} from '@vueup/vue-quill'
```

---

## SSR / Nuxt

VueQuill handles SSR automatically by rendering a placeholder during server-side rendering and hydrating with the interactive editor on the client:

```vue
<!-- Works out of the box in Nuxt -->
<template>
  <QuillEditor v-model:content="content" />
</template>
```

For manual SSR handling:

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
    <QuillEditor v-model:content="content" />
  </ClientOnly>
</template>
```

---

## Migration from v1.x

See the [Migration Guide](../docs/content/guide/migration.md) for upgrading from VueQuill v1.x.

Key changes:
- Vue 3.5+ required (was 3.2+)
- Quill 2.x only (Quill 1.x no longer supported)
- Event payloads are now typed objects
- `useQuill` composable is now a first-class export
