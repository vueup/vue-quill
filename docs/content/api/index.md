# Component API

VueQuill provides two primary APIs:

1. **`<QuillEditor>`** - Vue component with props and events
2. **`useEditor()`** - Composable function for advanced usage

## QuillEditor Props

### v-model

- **Type:** `Delta | string | null`
- **Default:** `null`

Two-way binding for editor content. Content type depends on `contentType` prop.

```vue
<QuillEditor v-model="content" contentType="html" />
```

### contentType

- **Type:** `'delta' | 'html' | 'text'`
- **Default:** `'delta'`

Determines the format of content for v-model binding.

| Type | Description |
|------|-------------|
| `delta` | Quill Delta object (recommended) |
| `html` | HTML string |
| `text` | Plain text string |

### theme

- **Type:** `'snow' | 'bubble' | ''`
- **Default:** `'snow'`

The visual theme for the editor. Use empty string for minimal/no theme.

### toolbar

- **Type:** `string | Array | false`
- **Default:** `'essential'`

Toolbar configuration. Can be:
- **Preset name:** `'minimal'`, `'essential'`, `'full'`
- **Custom array:** `[['bold', 'italic'], ['link']]`
- **CSS selector:** `'#my-toolbar'`
- **false:** Disable toolbar

### editable

- **Type:** `boolean`
- **Default:** `true`

Whether the editor allows content editing. Set to `false` for read-only mode.

### placeholder

- **Type:** `string`
- **Default:** `undefined`

Placeholder text shown when editor is empty.

### autofocus

- **Type:** `boolean`
- **Default:** `false`

Whether to focus the editor on mount.

### modules

- **Type:** `QuillModule[]`
- **Default:** `[]`

Array of custom Quill modules to register.

```ts
interface QuillModule {
  name: string
  module: any  // Quill module class
  options?: Record<string, any>
}
```

## QuillEditor Events

### @create

Fired when the editor is created and ready.

```vue
<QuillEditor @create="({ editor }) => console.log(editor)" />
```

**Payload:** `{ editor: Editor }`

### @update

Fired when content changes.

```vue
<QuillEditor @update="({ editor, delta }) => handleUpdate(delta)" />
```

**Payload:** `{ editor: Editor, delta: Delta, oldDelta: Delta, source: string }`

### @selectionUpdate

Fired when selection/cursor changes.

```vue
<QuillEditor @selectionUpdate="({ range }) => console.log(range)" />
```

**Payload:** `{ editor: Editor, range: Range | null, oldRange: Range | null, source: string }`

### @focus

Fired when editor receives focus.

```vue
<QuillEditor @focus="({ editor }) => console.log('focused')" />
```

**Payload:** `{ editor: Editor, event: FocusEvent }`

### @blur

Fired when editor loses focus.

```vue
<QuillEditor @blur="({ editor }) => console.log('blurred')" />
```

**Payload:** `{ editor: Editor, event: FocusEvent }`

### @error

Fired when an error occurs during initialization.

```vue
<QuillEditor @error="({ error }) => console.error(error)" />
```

**Payload:** `{ editor: Editor | null, error: Error }`

## QuillEditor Exposed

Access via template ref:

```vue
<template>
  <QuillEditor ref="editorRef" />
</template>

<script setup>
const editorRef = ref(null)
// Access: editorRef.value?.editor
</script>
```

### editor

- **Type:** `Editor | null`

The Editor instance. See [Editor Methods](./methods.md) for available methods.

---

## useEditor Composable

The composable API for advanced usage patterns.

```ts
import { useEditor, EditorContent } from '@vueup/vue-quill'

const editor = useEditor(options)
```

### Options

```ts
interface VueQuillOptions {
  // Configuration
  theme?: 'snow' | 'bubble' | ''
  content?: Delta | string | null
  contentType?: 'delta' | 'html' | 'text'
  placeholder?: string
  editable?: boolean
  autofocus?: boolean
  toolbar?: string | ToolbarOption[] | false
  modules?: QuillModule[]
  
  // Callbacks
  onCreate?: (payload: { editor: Editor }) => void
  onUpdate?: (payload: { 
    editor: Editor
    delta: Delta
    oldDelta: Delta
    source: string 
  }) => void
  onSelectionUpdate?: (payload: { 
    editor: Editor
    range: Range | null
    oldRange: Range | null
    source: string 
  }) => void
  onFocus?: (payload: { editor: Editor, event: FocusEvent }) => void
  onBlur?: (payload: { editor: Editor, event: FocusEvent }) => void
  onError?: (payload: { editor: Editor | null, error: Error }) => void
}
```

### Return Value

```ts
const editor: ShallowRef<Editor | null> = useEditor(options)
```

Returns a shallow ref containing the Editor instance (or null before initialization).

### Usage with EditorContent

```vue
<template>
  <EditorContent :editor="editor" />
</template>

<script setup>
import { useEditor, EditorContent } from '@vueup/vue-quill'

const editor = useEditor({
  theme: 'snow',
  content: '<p>Hello</p>',
  contentType: 'html',
  onUpdate: ({ editor }) => {
    console.log(editor.getHTML())
  },
})
</script>
```

---

## EditorContent Component

Renders the editor created by `useEditor()`.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| editor | `Editor \| null` | Yes | Editor instance from useEditor |
| class | `string` | No | CSS class for wrapper |

### Usage

```vue
<EditorContent 
  :editor="editor" 
  class="my-editor-wrapper" 
/>
```
