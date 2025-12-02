# Migration Guide: v1.x → v2.0

This guide helps you migrate from VueQuill v1.x to v2.0.

## Overview

VueQuill v2.0 is a major refactor that introduces:

- **TipTap-inspired API**: New `useEditor` composable and `EditorContent` component
- **Modern Vue 3.5+**: Uses `defineModel`, improved TypeScript inference
- **Quill 2.x**: Breaking changes from Quill upstream
- **Vite 6**: New build system (replaces Rollup)
- **Smaller Bundle**: ~5KB gzipped (excludes Quill as peer dependency)

## Breaking Changes

### 1. Installation

**Before (v1.x):**
```bash
npm install @vueup/vue-quill@^1.0.0
```

**After (v2.0):**
```bash
npm install @vueup/vue-quill@^2.0.0 quill@^2.0.0
```

> ⚠️ Quill is now a **peer dependency**. You must install it explicitly.

### 2. Import Changes

**Before (v1.x):**
```ts
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
```

**After (v2.0):**
```ts
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.css'
```

> The CSS file is now consolidated. Theme is controlled via the `theme` prop.

### 3. Content Type Prop

**Before (v1.x):**
```vue
<QuillEditor contentType="html" v-model:content="content" />
```

**After (v2.0):**
```vue
<QuillEditor contentType="html" v-model="content" />
```

> `v-model:content` is now just `v-model` using Vue 3.5's `defineModel`.

### 4. Event Names

**Before (v1.x):**
```vue
<QuillEditor
  @ready="onReady"
  @textChange="onTextChange"
  @selectionChange="onSelectionChange"
/>
```

**After (v2.0):**
```vue
<QuillEditor
  @create="onCreate"
  @update="onUpdate"
  @selectionUpdate="onSelectionUpdate"
  @focus="onFocus"
  @blur="onBlur"
/>
```

Event mapping:
| v1.x Event | v2.0 Event | Payload Change |
|------------|------------|----------------|
| `@ready` | `@create` | Now receives `{ editor }` |
| `@textChange` | `@update` | Now receives `{ editor, delta, oldDelta, source }` |
| `@selectionChange` | `@selectionUpdate` | Now receives `{ editor, range, oldRange, source }` |
| N/A | `@focus` | New: `{ editor, event }` |
| N/A | `@blur` | New: `{ editor, event }` |
| N/A | `@error` | New: `{ editor, error }` |

### 5. Accessing Quill Instance

**Before (v1.x):**
```vue
<template>
  <QuillEditor ref="editorRef" />
</template>

<script setup>
const editorRef = ref(null)

onMounted(() => {
  const quill = editorRef.value?.getQuill()
})
</script>
```

**After (v2.0):**
```vue
<template>
  <QuillEditor ref="editorRef" />
</template>

<script setup>
import { ref, onMounted } from 'vue'

const editorRef = ref(null)

onMounted(() => {
  // Access via editor wrapper (recommended)
  const editor = editorRef.value?.editor
  
  // Or access raw Quill directly
  const quill = editorRef.value?.editor?.quill
})
</script>
```

### 6. Toolbar Configuration

**Before (v1.x):**
```vue
<QuillEditor :toolbar="[['bold', 'italic'], ['link']]" />
```

**After (v2.0):**
```vue
<!-- Using presets -->
<QuillEditor toolbar="essential" />

<!-- Using custom config -->
<QuillEditor :toolbar="[['bold', 'italic'], ['link']]" />

<!-- Using toolbar slot -->
<QuillEditor>
  <template #toolbar>
    <div id="my-toolbar">
      <button class="ql-bold">Bold</button>
    </div>
  </template>
</QuillEditor>
```

Available presets: `minimal`, `essential`, `full`

### 7. Read-Only State

**Before (v1.x):**
```vue
<QuillEditor :readOnly="true" />
```

**After (v2.0):**
```vue
<QuillEditor :editable="false" />
```

> Property renamed from `readOnly` to `editable` (inverted logic).

## New Features in v2.0

### 1. useEditor Composable (TipTap-style)

The new composable API offers more control:

```vue
<template>
  <EditorContent :editor="editor" />
</template>

<script setup>
import { useEditor, EditorContent } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.css'

const editor = useEditor({
  theme: 'snow',
  content: '<p>Hello World</p>',
  contentType: 'html',
  
  onCreate: ({ editor }) => {
    console.log('Editor created', editor)
  },
  
  onUpdate: ({ editor, delta }) => {
    console.log('Content changed', editor.getHTML())
  },
})
</script>
```

### 2. Chainable Commands

```ts
editor.value?.chain()
  .focus()
  .insertContent('<p>Hello</p>')
  .blur()
  .run()
```

### 3. Can Commands

Check if a command can be executed:

```ts
if (editor.value?.can().insertText('Hello')) {
  editor.value.insertText('Hello')
}
```

### 4. Enhanced Event Payloads

All events now include the `editor` instance:

```ts
const handleUpdate = ({ editor, delta, oldDelta, source }) => {
  const html = editor.getHTML()
  const text = editor.getText()
  const json = editor.getJSON()
}
```

## Migration Checklist

- [ ] Update package.json dependencies
- [ ] Install quill as explicit dependency
- [ ] Update CSS import path
- [ ] Change `v-model:content` to `v-model`
- [ ] Rename event handlers (ready → create, textChange → update, etc.)
- [ ] Update Quill instance access pattern
- [ ] Change `readOnly` to `editable` (with inverted value)
- [ ] Test all editor functionality
- [ ] Update any custom module registrations

## Quill 2.x Breaking Changes

VueQuill v2.0 uses Quill 2.x. See [Quill 2.0 Migration Guide](https://quilljs.com/docs/migration) for Quill-specific changes:

- New Delta import: `import { Delta } from 'quill'`
- Updated keyboard bindings API
- New clipboard matchers API
- Registry changes for custom formats/blots

## Getting Help

- [GitHub Issues](https://github.com/vueup/vue-quill/issues)
- [Discussions](https://github.com/vueup/vue-quill/discussions)
- [Documentation](https://vueup.github.io/vue-quill/)
