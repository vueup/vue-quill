# Data Model: Modern Stack Refactor

**Date**: 2025-12-02  
**Feature**: 001-modern-stack-refactor

## Overview

This document defines the TypeScript types, interfaces, and data structures for VueQuill v2.0.

---

## Core Entities

### 1. QuillEditor Component

The main Vue component that wraps the Quill editor.

```typescript
// Component instance type (exposed via defineExpose)
interface QuillEditorInstance {
  /** Get the underlying Quill instance */
  getQuill: () => Quill
  /** Get the editor container DOM element */
  getEditor: () => HTMLElement
  /** Get the toolbar container DOM element */
  getToolbar: () => HTMLElement | undefined
  /** Get current contents based on contentType */
  getContents: () => Delta | string
  /** Set contents based on contentType */
  setContents: (content: Delta | string, source?: EmitterSource) => void
  /** Get plain text content */
  getText: (index?: number, length?: number) => string
  /** Set plain text content */
  setText: (text: string, source?: EmitterSource) => void
  /** Get HTML content */
  getHTML: () => string
  /** Set HTML content */
  setHTML: (html: string) => void
  /** Paste HTML at current selection */
  pasteHTML: (html: string, source?: EmitterSource) => void
  /** Focus the editor */
  focus: () => void
  /** Reinitialize the editor (e.g., after theme change) */
  reinit: () => void
}
```

---

### 2. Props

```typescript
/** Content type discriminator */
type ContentType = 'delta' | 'html' | 'text'

/** Theme options */
type EditorTheme = 'snow' | 'bubble' | ''

/** Toolbar preset names */
type ToolbarPreset = 'minimal' | 'essential' | 'full'

/** Toolbar configuration - preset name, CSS selector, or custom config */
type ToolbarOption = ToolbarPreset | `#${string}` | unknown[][]

/** Custom Quill module registration */
interface QuillModule {
  /** Module name (without 'modules/' prefix) */
  name: string
  /** Module class/constructor */
  module: unknown
  /** Optional module configuration */
  options?: Record<string, unknown>
}

/** Component props interface */
interface QuillEditorProps {
  /** 
   * Editor content (v-model:content)
   * Type depends on contentType prop
   */
  content?: string | Delta | null

  /** 
   * Content format type
   * @default 'delta'
   */
  contentType?: ContentType

  /**
   * Editor theme
   * @default 'snow'
   */
  theme?: EditorTheme

  /**
   * Toolbar configuration
   * - Preset name: 'minimal' | 'essential' | 'full'
   * - CSS selector: '#my-toolbar'
   * - Custom array: [['bold', 'italic'], ['link']]
   */
  toolbar?: ToolbarOption

  /**
   * Custom Quill modules to register
   */
  modules?: QuillModule | QuillModule[]

  /**
   * Raw Quill options (merged with other props)
   */
  options?: QuillOptions

  /**
   * Read-only mode
   * @default false
   */
  readOnly?: boolean

  /**
   * Enable/disable editor
   * @default true
   */
  enable?: boolean

  /**
   * Placeholder text when empty
   */
  placeholder?: string
}
```

---

### 3. Events

```typescript
/** Text change event payload */
interface TextChangePayload {
  /** The change delta */
  delta: Delta
  /** Contents before the change */
  oldContents: Delta
  /** Source of change: 'user' | 'api' | 'silent' */
  source: EmitterSource
}

/** Selection change event payload */
interface SelectionChangePayload {
  /** New selection range (null if editor lost focus) */
  range: Range | null
  /** Previous selection range */
  oldRange: Range | null
  /** Source of change */
  source: EmitterSource
}

/** Editor change event payload (union of text and selection change) */
type EditorChangePayload = 
  | { name: 'text-change' } & TextChangePayload
  | { name: 'selection-change' } & SelectionChangePayload

/** Error event payload */
interface ErrorPayload {
  /** Error object */
  error: Error
  /** Error context */
  context: 'initialization' | 'operation'
}

/** Component events interface */
interface QuillEditorEmits {
  /** v-model:content update */
  'update:content': [content: string | Delta]
  /** Text content changed */
  textChange: [payload: TextChangePayload]
  /** Selection/cursor changed */
  selectionChange: [payload: SelectionChangePayload]
  /** Any editor change (text or selection) */
  editorChange: [payload: EditorChangePayload]
  /** Editor gained focus */
  focus: [editor: HTMLElement]
  /** Editor lost focus */
  blur: [editor: HTMLElement]
  /** Editor initialized and ready */
  ready: [quill: Quill]
  /** Error during initialization or operation */
  error: [payload: ErrorPayload]
}
```

---

### 4. Slots

```typescript
/** Component slots interface */
interface QuillEditorSlots {
  /** 
   * Custom toolbar slot
   * When provided, replaces the default toolbar
   */
  toolbar(): VNode[]
}
```

---

### 5. Toolbar Presets

```typescript
/** Toolbar preset configurations */
const toolbarPresets = {
  minimal: [
    [{ header: 1 }, { header: 2 }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
  ],

  essential: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
    ['blockquote', 'code-block', 'link'],
    [{ color: [] }, 'clean'],
  ],

  full: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ header: 1 }, { header: 2 }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['link', 'video', 'image'],
    ['clean'],
  ],
} as const satisfies Record<ToolbarPreset, unknown[][]>
```

---

### 6. useQuill Composable

```typescript
/** Options for useQuill composable */
interface UseQuillOptions extends QuillOptions {
  /** 
   * Auto-initialize on mount
   * @default true
   */
  autoInit?: boolean
}

/** Return type of useQuill composable */
interface UseQuillReturn {
  /** The Quill instance (readonly) */
  quill: Readonly<ShallowRef<Quill | null>>
  /** Current editor content as Delta */
  content: Readonly<Ref<Delta | null>>
  /** Current selection range */
  selection: Readonly<Ref<Range | null>>
  /** Whether editor is currently focused */
  isFocused: Readonly<Ref<boolean>>
  /** Whether editor has been initialized */
  isReady: Readonly<Ref<boolean>>
  /** Get current contents as Delta */
  getContents: () => Delta | undefined
  /** Set contents from Delta */
  setContents: (delta: Delta, source?: EmitterSource) => void
  /** Get plain text content */
  getText: (index?: number, length?: number) => string
  /** Set plain text content */
  setText: (text: string, source?: EmitterSource) => void
  /** Get HTML content */
  getHTML: () => string
  /** Set HTML content */
  setHTML: (html: string) => void
  /** Focus the editor */
  focus: () => void
  /** Blur the editor */
  blur: () => void
  /** Manually initialize (when autoInit: false) */
  initialize: () => Promise<Quill>
  /** Destroy the editor instance */
  destroy: () => void
}
```

---

## Re-exported Quill Types

For consumer convenience, these Quill types are re-exported:

```typescript
// From 'quill'
export type {
  QuillOptions,
  Range,
  Bounds,
  EmitterSource,
  Delta,
  Op,
}

// Quill class
export { default as Quill } from 'quill'
```

---

## Type Relationships Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      QuillEditorProps                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ content      │  │ contentType  │  │ theme        │          │
│  │ Delta|string │  │ ContentType  │  │ EditorTheme  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ toolbar      │  │ modules      │  │ options      │          │
│  │ ToolbarOpt   │  │ QuillModule[]│  │ QuillOptions │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      QuillEditor                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Quill Instance                                           │  │
│  │ - Delta content                                          │  │
│  │ - Range selection                                        │  │
│  │ - Modules (toolbar, clipboard, etc.)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      QuillEditorEmits                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │update:content│  │ textChange   │  │selectionChg  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ focus        │  │ blur         │  │ ready        │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Validation Rules

| Field | Type | Validation |
|-------|------|------------|
| content | `string \| Delta \| null` | Must match contentType |
| contentType | `'delta' \| 'html' \| 'text'` | Enum validation |
| theme | `'snow' \| 'bubble' \| ''` | Enum validation |
| toolbar | `string \| unknown[][]` | Preset name, CSS selector, or array |
| modules | `QuillModule[]` | Each must have `name` and `module` |
| enable | `boolean` | Boolean |
| readOnly | `boolean` | Boolean |

---

## State Transitions

### Editor Lifecycle

```
[Unmounted] 
    │
    ▼ onMounted()
[Initializing] ──error──► [Error] ──► emit('error')
    │
    ▼ Quill created
[Ready] ──► emit('ready', quill)
    │
    ├──► [Focused] ◄──► [Blurred]
    │         │              │
    │         ▼              ▼
    │    emit('focus')  emit('blur')
    │
    ▼ onBeforeUnmount()
[Destroyed]
```

### Content Update Flow

```
[User types in editor]
    │
    ▼
Quill emits 'text-change'
    │
    ├──► emit('textChange', payload)
    │
    ├──► emit('editorChange', payload)
    │
    ▼
emit('update:content', newContent)
    │
    ▼
[Parent v-model updates]
```
