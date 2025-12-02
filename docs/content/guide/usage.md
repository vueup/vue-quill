# Usage

VueQuill v2.0 provides two ways to use the editor:

1. **Component API** - Using `<QuillEditor>` with props and events
2. **Composable API** - Using `useEditor()` with `<EditorContent>` (TipTap-style)

## Quick Start

### Component API (Simple)

```vue
<template>
  <QuillEditor v-model="content" theme="snow" />
</template>

<script setup>
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.css'

const content = ref('<p>Hello World!</p>')
</script>
```

### Composable API (Advanced)

```vue
<template>
  <EditorContent :editor="editor" />
</template>

<script setup>
import { useEditor, EditorContent } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.css'

const editor = useEditor({
  theme: 'snow',
  content: '<p>Hello World!</p>',
  contentType: 'html',
  
  onUpdate: ({ editor }) => {
    console.log('Content:', editor.getHTML())
  },
})
</script>
```

## Global Registration

```javascript
import { createApp } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.css'

const app = createApp(App)
app.component('QuillEditor', QuillEditor)
app.mount('#app')
```

## Content Types

VueQuill supports three content types:

### HTML (Default)

```vue
<template>
  <QuillEditor v-model="content" contentType="html" />
</template>

<script setup>
import { ref } from 'vue'
const content = ref('<p>Hello <strong>World</strong>!</p>')
</script>
```

### Delta (Quill Native)

```vue
<template>
  <QuillEditor v-model="content" contentType="delta" />
</template>

<script setup>
import { ref } from 'vue'
const content = ref({
  ops: [
    { insert: 'Hello ' },
    { insert: 'World', attributes: { bold: true } },
    { insert: '!\n' }
  ]
})
</script>
```

### Plain Text

```vue
<template>
  <QuillEditor v-model="content" contentType="text" />
</template>

<script setup>
import { ref } from 'vue'
const content = ref('Hello World!')
</script>
```

## Events

### Component Events

```vue
<template>
  <QuillEditor
    v-model="content"
    @create="onCreate"
    @update="onUpdate"
    @selectionUpdate="onSelectionUpdate"
    @focus="onFocus"
    @blur="onBlur"
  />
</template>

<script setup>
const onCreate = ({ editor }) => {
  console.log('Editor created', editor)
}

const onUpdate = ({ editor, delta, oldDelta, source }) => {
  console.log('Content changed', editor.getHTML())
}

const onSelectionUpdate = ({ editor, range, oldRange, source }) => {
  console.log('Selection:', range)
}

const onFocus = ({ editor, event }) => {
  console.log('Focused')
}

const onBlur = ({ editor, event }) => {
  console.log('Blurred')
}
</script>
```

### Composable Callbacks

```ts
const editor = useEditor({
  onCreate: ({ editor }) => { /* ... */ },
  onUpdate: ({ editor, delta, oldDelta, source }) => { /* ... */ },
  onSelectionUpdate: ({ editor, range, oldRange, source }) => { /* ... */ },
  onFocus: ({ editor, event }) => { /* ... */ },
  onBlur: ({ editor, event }) => { /* ... */ },
  onError: ({ editor, error }) => { /* ... */ },
})
```

## Accessing Quill Instance

### Via Component Ref

```vue
<template>
  <QuillEditor ref="editorRef" />
  <button @click="insertText">Insert Text</button>
</template>

<script setup>
import { ref } from 'vue'

const editorRef = ref(null)

const insertText = () => {
  const editor = editorRef.value?.editor
  if (editor) {
    editor.insertText('Hello!')
    // Or access raw Quill:
    // editor.quill.insertText(0, 'Hello!')
  }
}
</script>
```

### Via Composable

```vue
<template>
  <EditorContent :editor="editor" />
  <button @click="insertText">Insert Text</button>
</template>

<script setup>
import { useEditor, EditorContent } from '@vueup/vue-quill'

const editor = useEditor({ theme: 'snow' })

const insertText = () => {
  if (editor.value) {
    editor.value.insertText('Hello!')
  }
}
</script>
```

## Chainable Commands

```ts
// Chain multiple operations
editor.value?.chain()
  .focus()
  .insertContent('<p>New paragraph</p>')
  .blur()
  .run()

// Check if command can execute
if (editor.value?.can().insertText('Hello')) {
  editor.value.insertText('Hello')
}
```

## Read-Only Mode

```vue
<template>
  <QuillEditor v-model="content" :editable="!readOnly" />
  <button @click="readOnly = !readOnly">Toggle Read-Only</button>
</template>

<script setup>
import { ref } from 'vue'

const content = ref('<p>Some content</p>')
const readOnly = ref(false)
</script>
```

## Next Steps

- [Themes](/guide/themes) - Customize the editor appearance
- [Toolbar](/guide/toolbar) - Configure toolbar options
- [Modules](/guide/modules) - Extend with Quill modules
- [Options](/guide/options) - Full list of props and options
