# Research: Modern Stack Refactor

**Date**: 2025-12-02  
**Feature**: 001-modern-stack-refactor

## Overview

This document consolidates research findings for upgrading VueQuill to Vue 3.5+, TypeScript 5.x, Vite 6, and Quill 2.x.

---

## 1. Vue 3.5+ Component Patterns

### Decision: Use `<script setup>` with Modern Macros

**Rationale**: Vue 3.5+ provides superior TypeScript inference, reduced boilerplate, and clearer component contracts through macros.

**Alternatives Considered**:
- `defineComponent()` (current) — More verbose, weaker type inference
- Options API — Not recommended for libraries, poor tree-shaking

### Key Patterns

#### defineModel() for v-model Binding

```vue
<script setup lang="ts">
import type { Delta } from 'quill'

// Named v-model: v-model:content
const content = defineModel<string | Delta | null>('content')

// With content type discrimination
const contentType = defineProps<{
  contentType?: 'delta' | 'html' | 'text'
}>()
</script>
```

**Benefits**:
- Replaces manual prop + `emit('update:content')` pattern
- Returns a `Ref` that syncs bidirectionally with parent
- Full TypeScript inference

#### defineProps<T>() with Defaults

```vue
<script setup lang="ts">
interface Props {
  contentType?: 'delta' | 'html' | 'text'
  theme?: 'snow' | 'bubble' | ''
  toolbar?: string | unknown[] | object
  readOnly?: boolean
  enable?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  contentType: 'delta',
  theme: 'snow',
  readOnly: false,
  enable: true,
})
</script>
```

#### defineEmits<T>() with Typed Payloads

```vue
<script setup lang="ts">
import type { Delta, Range, EmitterSource } from 'quill'

const emit = defineEmits<{
  textChange: [delta: Delta, oldDelta: Delta, source: EmitterSource]
  selectionChange: [range: Range | null, oldRange: Range | null, source: EmitterSource]
  ready: [quill: Quill]
  focus: [editor: HTMLElement]
  blur: [editor: HTMLElement]
  error: [error: Error]
}>()
</script>
```

#### defineSlots<T>() for Typed Slots

```vue
<script setup lang="ts">
import type { VNode } from 'vue'

const slots = defineSlots<{
  toolbar(): VNode[]
  default(): VNode[]
}>()
</script>
```

#### defineExpose() for Public API

```vue
<script setup lang="ts">
defineExpose({
  getQuill,
  getEditor,
  getContents,
  setContents,
  getText,
  setText,
  getHTML,
  setHTML,
  pasteHTML,
  focus,
  getToolbar,
})
</script>
```

### SSR Handling Pattern

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isClient = ref(false)
const quill = ref<Quill | null>(null)

onMounted(async () => {
  isClient.value = true
  const Quill = (await import('quill')).default
  quill.value = new Quill(editorRef.value!, options)
})
</script>

<template>
  <div v-if="isClient" ref="editorRef"></div>
  <div v-else class="ql-container ql-snow">
    <div class="ql-editor ql-blank" data-placeholder="Loading..."></div>
  </div>
</template>
```

---

## 2. Vite 6 Library Mode

### Decision: Use Vite 6 with `build.lib` Configuration

**Rationale**: Vite 6 provides faster builds, better ESM support, and simpler configuration than Rollup.

**Alternatives Considered**:
- Rollup (current) — More complex configuration, slower
- tsup — Good for simple libraries, less control over Vue SFC processing

### Complete vite.config.ts

```typescript
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'unplugin-dts/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    dts({
      processor: 'vue',
      insertTypesEntry: true,
      cleanVueFileName: true,
      tsconfigPath: './tsconfig.json',
    }),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueQuill',
      fileName: (format) => `vue-quill.${format === 'es' ? 'esm' : format}.js`,
      cssFileName: 'vue-quill',
      formats: ['es', 'cjs'],
    },

    rollupOptions: {
      external: ['vue', 'quill'],
      output: {
        globals: {
          vue: 'Vue',
          quill: 'Quill',
        },
      },
    },

    sourcemap: true,
    cssCodeSplit: false,
    minify: 'esbuild',
  },
})
```

### package.json exports Field

```json
{
  "name": "@vueup/vue-quill",
  "version": "2.0.0",
  "type": "module",
  
  "main": "./dist/vue-quill.cjs.js",
  "module": "./dist/vue-quill.esm.js",
  "types": "./dist/index.d.ts",
  
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/vue-quill.esm.js"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/vue-quill.cjs.js"
      }
    },
    "./style.css": "./dist/vue-quill.css"
  },
  
  "sideEffects": ["*.css", "*.vue"],
  
  "peerDependencies": {
    "vue": "^3.5.0"
  },
  
  "dependencies": {
    "quill": "^2.0.0"
  }
}
```

### Build Output Structure

```
dist/
├── index.d.ts              # Main TypeScript declarations
├── vue-quill.esm.js        # ES Module (primary)
├── vue-quill.esm.js.map    # ESM source map
├── vue-quill.cjs.js        # CommonJS (Node.js)
├── vue-quill.cjs.js.map    # CJS source map
└── vue-quill.css           # Extracted CSS
```

---

## 3. Quill 2.x Migration

### Decision: Quill 2.x Only (Drop 1.x Support)

**Rationale**: Per clarification, clean break to Quill 2.x simplifies maintenance and enables modern features.

**Alternatives Considered**:
- Support both 1.x and 2.x — Complex peer dependency management
- Stay on 1.x — Missing modern features and security updates

### Breaking Changes from Quill 1.x to 2.x

| Area | Quill 1.x | Quill 2.x |
|------|-----------|-----------|
| Types | `@types/quill` package | Built-in TypeScript |
| Delta | `quill-delta` separate | Re-exported from `quill` |
| Options Type | `QuillOptionsStatic` | `QuillOptions` |
| Range Type | `RangeStatic` | `Range` |
| Source Type | `Sources` | `EmitterSource` |
| Clipboard API | `convert({})` | `convert({ html })` |

### Updated Imports

```typescript
// OLD (1.x)
import Quill from 'quill'
import Delta from 'quill-delta'
import type { QuillOptionsStatic, RangeStatic, Sources } from 'quill'

// NEW (2.x)
import Quill, { Delta } from 'quill'
import type { QuillOptions, Range, EmitterSource } from 'quill'
```

### Clipboard API Change

```typescript
// OLD (1.x)
const delta = quill.clipboard.convert(html as {})

// NEW (2.x)
const delta = quill.clipboard.convert({ html })
```

### SSR Dynamic Import

```typescript
// Quill accesses DOM on import, so use dynamic import for SSR
onMounted(async () => {
  const Quill = (await import('quill')).default
  quill.value = new Quill(element, options)
})
```

---

## 4. Vitest Testing Setup

### Decision: Vitest with Vue Test Utils

**Rationale**: Vitest is the Vue-recommended testing framework, faster than Jest, native ESM support.

**Alternatives Considered**:
- Jest (current) — Slower, ESM configuration complex
- Playwright Component Testing — Overkill for unit tests

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{js,ts}'],
    setupFiles: ['./src/__tests__/setup.ts'],
    
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/**/*.{test,spec}.ts', 'src/__tests__/**'],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80,
      },
    },
  },
})
```

### Test Setup File (setup.ts)

```typescript
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock MutationObserver
global.MutationObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(() => []),
}))

// Global stubs
config.global.stubs = {}
```

### Mocking Quill

```typescript
// __tests__/mocks/quill.ts
import { vi } from 'vitest'
import type { Delta, Range, EmitterSource } from 'quill'

export function createMockQuill() {
  const handlers: Record<string, Function[]> = {}
  
  return {
    root: { innerHTML: '' },
    getContents: vi.fn(() => new Delta()),
    setContents: vi.fn(),
    getText: vi.fn(() => ''),
    setText: vi.fn(),
    getSelection: vi.fn(() => null),
    setSelection: vi.fn(),
    focus: vi.fn(),
    blur: vi.fn(),
    hasFocus: vi.fn(() => false),
    enable: vi.fn(),
    disable: vi.fn(),
    getModule: vi.fn(() => ({ container: document.createElement('div') })),
    on: vi.fn((event: string, handler: Function) => {
      handlers[event] = handlers[event] || []
      handlers[event].push(handler)
    }),
    off: vi.fn(),
    __trigger: (event: string, ...args: unknown[]) => {
      handlers[event]?.forEach(h => h(...args))
    },
  }
}
```

### Component Test Example

```typescript
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import QuillEditor from '../QuillEditor.vue'
import { createMockQuill } from './mocks/quill'

vi.mock('quill', () => ({
  default: vi.fn(() => createMockQuill()),
}))

describe('QuillEditor', () => {
  it('emits update:content when text changes', async () => {
    const wrapper = mount(QuillEditor, {
      props: { content: '', contentType: 'html' },
    })
    
    await wrapper.vm.$nextTick()
    
    // Trigger text change via mock
    const quill = wrapper.vm.getQuill()
    quill.__trigger('text-change', new Delta(), new Delta(), 'user')
    
    expect(wrapper.emitted('update:content')).toBeTruthy()
  })
  
  it('exposes getQuill method', async () => {
    const wrapper = mount(QuillEditor)
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.getQuill).toBeDefined()
    expect(wrapper.vm.getQuill()).toBeDefined()
  })
})
```

### Composable Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useQuill } from '../useQuill'

// Helper for testing composables with lifecycle hooks
function withSetup<T>(composable: () => T): T & { app: any } {
  let result: T
  const app = createApp({
    setup() {
      result = composable()
      return () => {}
    },
  })
  app.mount(document.createElement('div'))
  return { ...result!, app }
}

describe('useQuill', () => {
  it('returns null before mount', () => {
    const el = ref<HTMLElement | null>(null)
    const { quill } = withSetup(() => useQuill(el))
    expect(quill.value).toBeNull()
  })
})
```

---

## 5. useQuill Composable Design

### Decision: Export as First-Class API

**Rationale**: Per clarification, useQuill MUST be exported alongside the component for advanced use cases.

### API Design

```typescript
// useQuill.ts
import { ref, onMounted, onBeforeUnmount, toValue, readonly } from 'vue'
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'
import type Quill from 'quill'
import type { QuillOptions, Delta, Range, EmitterSource } from 'quill'

export interface UseQuillReturn {
  /** The Quill instance (readonly) */
  quill: Readonly<ShallowRef<Quill | null>>
  /** Current editor content as Delta */
  content: Readonly<Ref<Delta | null>>
  /** Current selection range */
  selection: Readonly<Ref<Range | null>>
  /** Whether editor is focused */
  isFocused: Readonly<Ref<boolean>>
  /** Get current contents */
  getContents: () => Delta | undefined
  /** Set contents */
  setContents: (delta: Delta, source?: EmitterSource) => void
  /** Get plain text */
  getText: (index?: number, length?: number) => string
  /** Set plain text */
  setText: (text: string, source?: EmitterSource) => void
  /** Get HTML content */
  getHTML: () => string
  /** Set HTML content */
  setHTML: (html: string) => void
  /** Focus editor */
  focus: () => void
  /** Blur editor */
  blur: () => void
}

export function useQuill(
  element: MaybeRefOrGetter<HTMLElement | null>,
  options?: MaybeRefOrGetter<QuillOptions>
): UseQuillReturn {
  const quill = shallowRef<Quill | null>(null)
  const content = ref<Delta | null>(null)
  const selection = ref<Range | null>(null)
  const isFocused = ref(false)

  onMounted(async () => {
    const el = toValue(element)
    if (!el) return

    const Quill = (await import('quill')).default
    quill.value = new Quill(el, toValue(options) ?? {})

    quill.value.on('text-change', () => {
      content.value = quill.value?.getContents() ?? null
    })

    quill.value.on('selection-change', (range) => {
      selection.value = range
      isFocused.value = range !== null
    })
  })

  onBeforeUnmount(() => {
    quill.value = null
  })

  return {
    quill: readonly(quill),
    content: readonly(content),
    selection: readonly(selection),
    isFocused: readonly(isFocused),
    getContents: () => quill.value?.getContents(),
    setContents: (delta, source = 'api') => quill.value?.setContents(delta, source),
    getText: (index, length) => quill.value?.getText(index, length) ?? '',
    setText: (text, source = 'api') => quill.value?.setText(text, source),
    getHTML: () => quill.value?.root.innerHTML ?? '',
    setHTML: (html) => { if (quill.value) quill.value.root.innerHTML = html },
    focus: () => quill.value?.focus(),
    blur: () => quill.value?.blur(),
  }
}
```

---

## 6. ESLint 9+ Flat Config

### Decision: Use ESLint 9+ with Flat Config

**Rationale**: Constitution mandates ESLint 9+ flat config for modern linting.

### eslint.config.js

```javascript
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...vue.configs['flat/recommended'],
  {
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js'],
  }
)
```

---

## 6. TipTap API Patterns (Industry Best Practice)

### Decision: Adopt TipTap's Composable-First Architecture

**Rationale**: TipTap is the gold standard for Vue rich text editor APIs. Their patterns are battle-tested, widely adopted, and provide excellent DX.

**Key Patterns Adopted**:

### 6.1 useEditor Composable (Primary API)

TipTap's `useEditor` is the primary way to create editors, not the component:

```typescript
import { useEditor, EditorContent } from '@tiptap/vue-3'

const { editor } = useEditor({
  content: '<p>Hello World</p>',
  onUpdate: ({ editor }) => {
    console.log(editor.getHTML())
  },
})
```

**Benefits**:
- Editor instance is available outside template
- Cleaner separation of logic and rendering
- Better composability with other hooks
- Consistent with React/Vue composables patterns

### 6.2 Event-Driven Callbacks

TipTap uses callback options instead of component events:

```typescript
const { editor } = useEditor({
  onCreate: ({ editor }) => { /* Called on creation */ },
  onUpdate: ({ editor }) => { /* Called on content change */ },
  onSelectionUpdate: ({ editor }) => { /* Called on selection change */ },
  onFocus: ({ editor, event }) => { /* Called on focus */ },
  onBlur: ({ editor, event }) => { /* Called on blur */ },
  onDestroy: () => { /* Called before destruction */ },
})
```

**Benefits**:
- Type-safe callback signatures
- Co-located with configuration
- Avoids template event binding noise
- Consistent between component and composable usage

### 6.3 EditorContent Component (Rendering)

TipTap separates logic from rendering:

```vue
<template>
  <EditorContent :editor="editor" />
</template>
```

**Benefits**:
- Editor can be created before DOM is ready
- Supports dynamic mounting/unmounting
- Clean separation of concerns

### 6.4 Chainable Commands

TipTap provides fluent command chaining:

```typescript
editor.chain()
  .focus()
  .bold()
  .insertContent('Hello!')
  .run()

// Check if command can execute
if (editor.can().bold()) {
  editor.chain().bold().run()
}
```

**Benefits**:
- Discoverable API via autocomplete
- Batch multiple operations
- Query capability before execution

### 6.5 Reactive State Properties

TipTap exposes reactive state for UI bindings:

```typescript
editor.isFocused  // boolean
editor.isEmpty    // boolean
editor.isEditable // boolean
```

**Benefits**:
- Easy UI state binding (toolbar button states, etc.)
- No need to manually track editor state
- Reactive updates

### 6.6 Content Methods

TipTap provides clear content access methods:

```typescript
editor.getHTML()       // Get as HTML
editor.getJSON()       // Get as JSON/Delta
editor.getText()       // Get as plain text
editor.setContent()    // Set content
editor.clearContent()  // Clear content
```

**Adoption for VueQuill**:

| TipTap Pattern | VueQuill Adoption |
|----------------|-------------------|
| `useEditor()` | `useEditor()` - Primary API |
| `EditorContent` | `EditorContent` - Renderer component |
| Callback options | `onCreate`, `onUpdate`, etc. |
| Command chaining | `editor.chain().bold().run()` |
| Reactive state | `editor.isFocused`, `editor.isEmpty`, etc. |
| Content methods | `getHTML()`, `getJSON()`, `getText()` |

### 6.7 Type Definitions

TipTap's TypeScript patterns:

```typescript
// Options interface
export interface EditorOptions {
  content?: Content
  extensions?: Extensions
  editable?: boolean
  autofocus?: FocusPosition
  // Callbacks
  onCreate?: (props: { editor: Editor }) => void
  onUpdate?: (props: { editor: Editor }) => void
  // ... etc
}

// Return type
export interface UseEditorReturn {
  editor: ShallowRef<Editor | null>
}
```

---

## Summary Checklist

| Topic | Decision | Status |
|-------|----------|--------|
| Component syntax | `<script setup>` with macros | ✅ Researched |
| v-model binding | `defineModel()` | ✅ Researched |
| Props/Emits | `defineProps<T>()`, `defineEmits<T>()` | ✅ Researched |
| Build system | Vite 6 library mode | ✅ Researched |
| TypeScript declarations | unplugin-dts with vue processor | ✅ Researched |
| Package exports | Modern `exports` field | ✅ Researched |
| Quill version | 2.x only, drop 1.x | ✅ Researched |
| Quill types | Built-in (no @types/quill) | ✅ Researched |
| Testing | Vitest + Vue Test Utils | ✅ Researched |
| Coverage | @vitest/coverage-v8, 80% threshold | ✅ Researched |
| SSR handling | Dynamic import + placeholder | ✅ Researched |
| useQuill composable | First-class export (TipTap-style) | ✅ Researched |
| Linting | ESLint 9+ flat config | ✅ Researched |
| **API Design** | **TipTap patterns (composable-first)** | ✅ Researched |
| **Command Chaining** | **`editor.chain().bold().run()`** | ✅ Researched |
| **Event Architecture** | **Callback options** | ✅ Researched |
