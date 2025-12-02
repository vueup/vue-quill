# Data Model: Modern Stack Refactor (TipTap-Inspired)

**Date**: 2025-12-02  
**Feature**: 001-modern-stack-refactor

## Overview

This document defines the TypeScript types, interfaces, and data structures for VueQuill v2.0, following industry best practices from TipTap and other modern rich text editor libraries.

---

## Design Principles (Learned from TipTap)

1. **Composable-First**: `useEditor()` is the primary API, component is a thin wrapper
2. **Event-Driven Architecture**: Use callback options instead of component events where practical
3. **Extension System**: Allow configuration via `.configure()` pattern
4. **Type-Safe Content**: Support multiple content formats (JSON, HTML, text)
5. **Reactive State**: Expose reactive state for UI bindings
6. **Commands Pattern**: Chain commands for complex operations

---

## Core Entities

### 1. Editor Options (Primary Configuration)

Following TipTap's pattern, all configuration flows through editor options:

```typescript
import type Quill from 'quill'
import type { QuillOptions, Delta, Range, EmitterSource } from 'quill'

/**
 * Configuration options for VueQuill editor
 * Follows TipTap's EditorOptions pattern
 */
export interface VueQuillOptions {
  // ─── Content ───────────────────────────────────────────────────────
  /**
   * Initial content (HTML string, Delta, or plain text)
   */
  content?: string | Delta | null

  /**
   * Content format for serialization
   * @default 'delta'
   */
  contentType?: ContentType

  // ─── Appearance ────────────────────────────────────────────────────
  /**
   * Editor theme
   * @default 'snow'
   */
  theme?: EditorTheme

  /**
   * Toolbar configuration
   */
  toolbar?: ToolbarOption | false

  /**
   * Placeholder text when empty
   */
  placeholder?: string

  // ─── State ─────────────────────────────────────────────────────────
  /**
   * Whether the editor is editable
   * @default true
   */
  editable?: boolean

  /**
   * Autofocus on mount
   * @default false
   */
  autofocus?: boolean | 'start' | 'end'

  // ─── Extensions ────────────────────────────────────────────────────
  /**
   * Custom Quill modules to register
   */
  modules?: QuillModule[]

  /**
   * Raw Quill options (advanced usage)
   */
  quillOptions?: Partial<QuillOptions>

  // ─── Lifecycle Callbacks ───────────────────────────────────────────
  /**
   * Called when editor is created and ready
   */
  onCreate?: (props: { editor: Editor }) => void

  /**
   * Called when content changes
   */
  onUpdate?: (props: { editor: Editor; delta: Delta; oldDelta: Delta; source: EmitterSource }) => void

  /**
   * Called when selection changes
   */
  onSelectionUpdate?: (props: { editor: Editor; range: Range | null; oldRange: Range | null; source: EmitterSource }) => void

  /**
   * Called on any editor state change
   */
  onTransaction?: (props: { editor: Editor }) => void

  /**
   * Called when editor gains focus
   */
  onFocus?: (props: { editor: Editor; event: FocusEvent }) => void

  /**
   * Called when editor loses focus
   */
  onBlur?: (props: { editor: Editor; event: FocusEvent }) => void

  /**
   * Called before editor is destroyed
   */
  onDestroy?: () => void

  /**
   * Called when an error occurs
   */
  onError?: (props: { editor: Editor; error: Error }) => void
}
```

### 2. Content Types

```typescript
/**
 * Content format type
 */
export type ContentType = 'delta' | 'html' | 'text'

/**
 * Editor theme
 */
export type EditorTheme = 'snow' | 'bubble' | ''

/**
 * Toolbar preset or custom configuration
 */
export type ToolbarOption = 
  | 'minimal' 
  | 'essential' 
  | 'full' 
  | `#${string}` 
  | unknown[][]

/**
 * Quill module definition
 */
export interface QuillModule {
  name: string
  module: unknown
  options?: Record<string, unknown>
}
```

### 3. Editor Class (Core)

Following TipTap's pattern, the Editor is the central object:

```typescript
import type Quill from 'quill'
import type { Delta, Range, EmitterSource } from 'quill'

/**
 * VueQuill Editor instance
 * Wraps Quill with Vue reactivity and enhanced API
 */
export interface Editor {
  // ─── Quill Access ──────────────────────────────────────────────────
  /**
   * The underlying Quill instance
   */
  readonly quill: Quill | null

  /**
   * The editor's DOM element
   */
  readonly element: HTMLElement | null

  /**
   * Whether editor is ready
   */
  readonly isReady: boolean

  /**
   * Whether editor is currently focused
   */
  readonly isFocused: boolean

  /**
   * Whether editor is editable
   */
  readonly isEditable: boolean

  /**
   * Whether editor is empty
   */
  readonly isEmpty: boolean

  // ─── Content Methods ───────────────────────────────────────────────
  /**
   * Get content as Delta
   */
  getJSON(): Delta

  /**
   * Get content as HTML
   */
  getHTML(): string

  /**
   * Get content as plain text
   */
  getText(index?: number, length?: number): string

  /**
   * Set content from Delta, HTML, or text
   */
  setContent(content: string | Delta, emitUpdate?: boolean): this

  /**
   * Clear all content
   */
  clearContent(emitUpdate?: boolean): this

  /**
   * Insert content at position
   */
  insertContent(content: string | Delta, index?: number): this

  // ─── Selection Methods ─────────────────────────────────────────────
  /**
   * Get current selection
   */
  getSelection(): Range | null

  /**
   * Set selection
   */
  setSelection(index: number, length?: number, source?: EmitterSource): this
  setSelection(range: Range | null, source?: EmitterSource): this

  /**
   * Select all content
   */
  selectAll(): this

  // ─── Focus Methods ─────────────────────────────────────────────────
  /**
   * Focus the editor
   */
  focus(position?: 'start' | 'end' | 'all' | number): this

  /**
   * Blur the editor
   */
  blur(): this

  // ─── State Methods ─────────────────────────────────────────────────
  /**
   * Set editable state
   */
  setEditable(editable: boolean): this

  /**
   * Update editor options
   */
  setOptions(options: Partial<VueQuillOptions>): this

  // ─── Command Chain ─────────────────────────────────────────────────
  /**
   * Start a command chain
   * Follows TipTap's chainable commands pattern
   */
  chain(): EditorCommandChain

  /**
   * Check if a command can be executed
   */
  can(): EditorCanCommands

  // ─── Event Methods ─────────────────────────────────────────────────
  /**
   * Add event listener
   */
  on<E extends keyof EditorEvents>(event: E, handler: EditorEvents[E]): this

  /**
   * Remove event listener
   */
  off<E extends keyof EditorEvents>(event: E, handler: EditorEvents[E]): this

  // ─── Lifecycle ─────────────────────────────────────────────────────
  /**
   * Destroy the editor
   */
  destroy(): void
}
```

### 4. Command Chain Pattern

Following TipTap's chainable commands:

```typescript
/**
 * Chainable editor commands
 */
export interface EditorCommandChain {
  // Formatting
  bold(): EditorCommandChain
  italic(): EditorCommandChain
  underline(): EditorCommandChain
  strike(): EditorCommandChain
  
  // Structure
  setHeading(level: 1 | 2 | 3 | 4 | 5 | 6): EditorCommandChain
  setParagraph(): EditorCommandChain
  setBlockquote(): EditorCommandChain
  setCodeBlock(): EditorCommandChain
  
  // Lists
  setBulletList(): EditorCommandChain
  setOrderedList(): EditorCommandChain
  
  // Selection
  focus(position?: 'start' | 'end' | number): EditorCommandChain
  blur(): EditorCommandChain
  selectAll(): EditorCommandChain
  
  // Content
  setContent(content: string | Delta): EditorCommandChain
  insertContent(content: string | Delta): EditorCommandChain
  clearContent(): EditorCommandChain
  
  // Execute the chain
  run(): boolean
}

/**
 * Check if commands can be executed
 */
export interface EditorCanCommands {
  bold(): boolean
  italic(): boolean
  underline(): boolean
  undo(): boolean
  redo(): boolean
  // ... etc
}
```

### 5. Editor Events

```typescript
/**
 * Editor event handlers
 */
export interface EditorEvents {
  create: (props: { editor: Editor }) => void
  update: (props: { editor: Editor; delta: Delta; oldDelta: Delta; source: EmitterSource }) => void
  selectionUpdate: (props: { editor: Editor; range: Range | null; oldRange: Range | null; source: EmitterSource }) => void
  transaction: (props: { editor: Editor }) => void
  focus: (props: { editor: Editor; event: FocusEvent }) => void
  blur: (props: { editor: Editor; event: FocusEvent }) => void
  destroy: () => void
  error: (props: { editor: Editor; error: Error }) => void
}
```

---

## useEditor Composable (Primary API)

Following TipTap's composable-first approach:

```typescript
import type { ShallowRef, Ref } from 'vue'

/**
 * Return type of useEditor composable
 */
export interface UseEditorReturn {
  /**
   * The editor instance (reactive)
   */
  editor: ShallowRef<Editor | null>
}

/**
 * useEditor composable signature
 * This is the PRIMARY API for creating editors
 */
export type UseEditorFn = (
  options?: Partial<VueQuillOptions>
) => UseEditorReturn
```

---

## Component API (Thin Wrapper)

The component is a thin wrapper around `useEditor`:

```typescript
/**
 * QuillEditor component props
 * Extends VueQuillOptions with Vue-specific bindings
 */
export interface QuillEditorProps extends Omit<VueQuillOptions, 'content' | 'onCreate' | 'onUpdate' | 'onDestroy'> {
  /**
   * v-model binding for content
   * Reactive, two-way binding
   */
  modelValue?: string | Delta | null
}

/**
 * QuillEditor component emits
 */
export interface QuillEditorEmits {
  /**
   * v-model update
   */
  (e: 'update:modelValue', value: string | Delta): void

  /**
   * Editor created
   */
  (e: 'create', props: { editor: Editor }): void

  /**
   * Content updated
   */
  (e: 'update', props: { editor: Editor; delta: Delta }): void

  /**
   * Selection changed
   */
  (e: 'selectionUpdate', props: { editor: Editor; range: Range | null }): void

  /**
   * Editor focused
   */
  (e: 'focus', props: { editor: Editor }): void

  /**
   * Editor blurred
   */
  (e: 'blur', props: { editor: Editor }): void

  /**
   * Error occurred
   */
  (e: 'error', props: { error: Error }): void
}

/**
 * Component slots
 */
export interface QuillEditorSlots {
  /**
   * Custom toolbar slot
   */
  toolbar?(): VNode[]
}

/**
 * Component exposed instance
 */
export interface QuillEditorInstance {
  /**
   * The editor instance
   */
  editor: Editor | null
}
```

---

## EditorContent Component

Following TipTap's pattern of separating editor logic from rendering:

```typescript
/**
 * EditorContent component props
 * Renders the editor's DOM
 */
export interface EditorContentProps {
  /**
   * The editor instance to render
   */
  editor: Editor | null
}
```

---

## Toolbar Presets

```typescript
/**
 * Built-in toolbar configurations
 */
export const toolbarPresets = {
  minimal: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
  ],

  essential: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean'],
  ],

  full: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ align: [] }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    ['clean'],
  ],
} as const satisfies Record<string, unknown[][]>
```

---

## Usage Patterns

### Pattern 1: useEditor (Recommended)

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

### Pattern 2: Component with v-model (Simpler)

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

### Pattern 3: Command Chaining

```typescript
// TipTap-style command chaining
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

---

## Type Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                      VueQuillOptions                            │
│  - content, contentType, theme, toolbar                        │
│  - editable, autofocus, placeholder                            │
│  - onCreate, onUpdate, onSelectionUpdate, onFocus, onBlur      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      useEditor(options)                         │
│  Returns: { editor: ShallowRef<Editor | null> }                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Editor                                  │
│  - quill, element, isReady, isFocused, isEditable              │
│  - getJSON(), getHTML(), getText()                             │
│  - setContent(), focus(), blur()                               │
│  - chain(), can()                                              │
│  - on(), off(), destroy()                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
┌─────────────────────────────────────┐  ┌─────────────────────────┐
│         EditorContent               │  │     QuillEditor         │
│  <EditorContent :editor="editor" />│  │  <QuillEditor           │
│  (Renders DOM)                      │  │    v-model="content" /> │
└─────────────────────────────────────┘  └─────────────────────────┘
```

---

## Package Exports

```typescript
// Main exports
export { QuillEditor } from './components/QuillEditor.vue'
export { EditorContent } from './components/EditorContent.vue'
export { useEditor } from './composables/useEditor'
export { Editor } from './Editor'

// Configuration
export { toolbarPresets } from './toolbar'

// Types
export type {
  VueQuillOptions,
  Editor,
  EditorEvents,
  EditorCommandChain,
  EditorCanCommands,
  UseEditorReturn,
  QuillEditorProps,
  QuillEditorEmits,
  QuillEditorSlots,
  QuillEditorInstance,
  EditorContentProps,
  ContentType,
  EditorTheme,
  ToolbarOption,
  QuillModule,
}

// Re-exports from Quill
export { Delta } from 'quill'
export type { Range, EmitterSource, QuillOptions } from 'quill'
```
