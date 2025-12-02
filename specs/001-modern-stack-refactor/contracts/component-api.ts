/**
 * VueQuill Component API Contract (TipTap-Inspired)
 *
 * This file defines the complete TypeScript interface for VueQuill v2.0,
 * following industry best practices from TipTap and other modern editors.
 *
 * Design Principles:
 * 1. Composable-First: useEditor() is the primary API
 * 2. Event-Driven: Callback options instead of template events
 * 3. Chainable Commands: Fluent API for complex operations
 * 4. Reactive State: Built-in reactivity for UI bindings
 *
 * @packageDocumentation
 */

import type { VNode, ShallowRef } from 'vue'
import type Quill from 'quill'
import type { QuillOptions, Range, Delta, EmitterSource } from 'quill'

// =============================================================================
// Content & Theme Types
// =============================================================================

/**
 * Content format type for the editor
 * - 'delta': Quill's native Delta format (default)
 * - 'html': HTML string
 * - 'text': Plain text string
 */
export type ContentType = 'delta' | 'html' | 'text'

/**
 * Editor theme options
 * - 'snow': Traditional toolbar theme (default)
 * - 'bubble': Floating tooltip theme
 * - '': No theme (custom styling)
 */
export type EditorTheme = 'snow' | 'bubble' | ''

/**
 * Built-in toolbar preset names
 */
export type ToolbarPreset = 'minimal' | 'essential' | 'full'

/**
 * Toolbar configuration options
 */
export type ToolbarOption =
  | ToolbarPreset
  | `#${string}` // CSS selector
  | unknown[][] // Custom button config
  | false // Disable toolbar

// =============================================================================
// Module Types
// =============================================================================

/**
 * Custom Quill module definition for registration
 */
export interface QuillModule {
  /** Module name (registered under 'modules/{name}') */
  name: string
  /** Module class or constructor */
  module: unknown
  /** Optional configuration options */
  options?: Record<string, unknown>
}

// =============================================================================
// Editor Instance Interface (Core)
// =============================================================================

/**
 * VueQuill Editor instance
 * The central object that wraps Quill with Vue reactivity and enhanced API.
 * Following TipTap's Editor class pattern.
 */
export interface Editor {
  // ─── Quill Access ──────────────────────────────────────────────────
  /** The underlying Quill instance */
  readonly quill: Quill | null
  /** The editor's DOM element */
  readonly element: HTMLElement | null

  // ─── Reactive State ────────────────────────────────────────────────
  /** Whether editor is created and ready */
  readonly isReady: boolean
  /** Whether editor is currently focused */
  readonly isFocused: boolean
  /** Whether editor is editable */
  readonly isEditable: boolean
  /** Whether editor content is empty */
  readonly isEmpty: boolean

  // ─── Content Methods ───────────────────────────────────────────────
  /** Get content as Delta (Quill's native format) */
  getJSON(): Delta
  /** Get content as HTML string */
  getHTML(): string
  /** Get content as plain text */
  getText(index?: number, length?: number): string
  /** Set content from Delta, HTML, or text */
  setContent(content: string | Delta, emitUpdate?: boolean): this
  /** Clear all content */
  clearContent(emitUpdate?: boolean): this
  /** Insert content at position */
  insertContent(content: string | Delta, index?: number): this

  // ─── Selection Methods ─────────────────────────────────────────────
  /** Get current selection */
  getSelection(): Range | null
  /** Set selection by index and length */
  setSelection(index: number, length?: number, source?: EmitterSource): this
  /** Set selection by range */
  setSelection(range: Range | null, source?: EmitterSource): this
  /** Select all content */
  selectAll(): this

  // ─── Focus Methods ─────────────────────────────────────────────────
  /** Focus the editor at specified position */
  focus(position?: 'start' | 'end' | 'all' | number): this
  /** Remove focus from editor */
  blur(): this

  // ─── State Methods ─────────────────────────────────────────────────
  /** Enable or disable editing */
  setEditable(editable: boolean): this
  /** Update editor options dynamically */
  setOptions(options: Partial<VueQuillOptions>): this

  // ─── Command Chain (TipTap-style) ──────────────────────────────────
  /** Start a command chain for fluent operations */
  chain(): EditorCommandChain
  /** Check if commands can be executed */
  can(): EditorCanCommands

  // ─── Event Methods ─────────────────────────────────────────────────
  /** Subscribe to editor events */
  on<E extends keyof EditorEvents>(event: E, handler: EditorEvents[E]): this
  /** Unsubscribe from editor events */
  off<E extends keyof EditorEvents>(event: E, handler: EditorEvents[E]): this

  // ─── Lifecycle ─────────────────────────────────────────────────────
  /** Destroy the editor and cleanup resources */
  destroy(): void
}

// =============================================================================
// Command Chain Pattern (TipTap-style)
// =============================================================================

/**
 * Chainable editor commands for fluent operations
 * Usage: editor.chain().focus().bold().insertContent('Hello').run()
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

  // Selection & Focus
  focus(position?: 'start' | 'end' | number): EditorCommandChain
  blur(): EditorCommandChain
  selectAll(): EditorCommandChain

  // Content
  setContent(content: string | Delta): EditorCommandChain
  insertContent(content: string | Delta): EditorCommandChain
  clearContent(): EditorCommandChain

  // Execute the accumulated commands
  run(): boolean
}

/**
 * Check if commands can be executed
 * Usage: if (editor.can().bold()) { ... }
 */
export interface EditorCanCommands {
  bold(): boolean
  italic(): boolean
  underline(): boolean
  strike(): boolean
  undo(): boolean
  redo(): boolean
}

// =============================================================================
// Editor Events
// =============================================================================

/**
 * Editor event handler signatures
 */
export interface EditorEvents {
  /** Fired when editor is created */
  create: (props: { editor: Editor }) => void
  /** Fired when content changes */
  update: (props: {
    editor: Editor
    delta: Delta
    oldDelta: Delta
    source: EmitterSource
  }) => void
  /** Fired when selection changes */
  selectionUpdate: (props: {
    editor: Editor
    range: Range | null
    oldRange: Range | null
    source: EmitterSource
  }) => void
  /** Fired on any state change */
  transaction: (props: { editor: Editor }) => void
  /** Fired when editor gains focus */
  focus: (props: { editor: Editor; event: FocusEvent }) => void
  /** Fired when editor loses focus */
  blur: (props: { editor: Editor; event: FocusEvent }) => void
  /** Fired before editor is destroyed */
  destroy: () => void
  /** Fired when an error occurs */
  error: (props: { editor: Editor; error: Error }) => void
}

// =============================================================================
// VueQuill Options (Primary Configuration)
// =============================================================================

/**
 * Configuration options for VueQuill editor
 * This is the primary configuration interface, following TipTap's EditorOptions pattern.
 */
export interface VueQuillOptions {
  // ─── Content ───────────────────────────────────────────────────────
  /** Initial content (HTML string, Delta, or plain text) */
  content?: string | Delta | null
  /** Content format for serialization @default 'delta' */
  contentType?: ContentType

  // ─── Appearance ────────────────────────────────────────────────────
  /** Editor theme @default 'snow' */
  theme?: EditorTheme
  /** Toolbar configuration */
  toolbar?: ToolbarOption
  /** Placeholder text when empty */
  placeholder?: string

  // ─── State ─────────────────────────────────────────────────────────
  /** Whether the editor is editable @default true */
  editable?: boolean
  /** Autofocus on mount @default false */
  autofocus?: boolean | 'start' | 'end'

  // ─── Extensions ────────────────────────────────────────────────────
  /** Custom Quill modules to register */
  modules?: QuillModule[]
  /** Raw Quill options (advanced usage) */
  quillOptions?: Partial<QuillOptions>

  // ─── Lifecycle Callbacks ───────────────────────────────────────────
  /** Called when editor is created and ready */
  onCreate?: EditorEvents['create']
  /** Called when content changes */
  onUpdate?: EditorEvents['update']
  /** Called when selection changes */
  onSelectionUpdate?: EditorEvents['selectionUpdate']
  /** Called on any editor state change */
  onTransaction?: EditorEvents['transaction']
  /** Called when editor gains focus */
  onFocus?: EditorEvents['focus']
  /** Called when editor loses focus */
  onBlur?: EditorEvents['blur']
  /** Called before editor is destroyed */
  onDestroy?: EditorEvents['destroy']
  /** Called when an error occurs */
  onError?: EditorEvents['error']
}

// =============================================================================
// useEditor Composable (Primary API)
// =============================================================================

/**
 * Return type of useEditor composable
 */
export interface UseEditorReturn {
  /**
   * The editor instance (reactive, wrapped in ShallowRef)
   * null until editor is ready
   */
  editor: ShallowRef<Editor | null>
}

/**
 * useEditor composable signature
 *
 * This is the PRIMARY API for creating editors, following TipTap's pattern.
 *
 * @example
 * ```typescript
 * const { editor } = useEditor({
 *   content: '<p>Hello World</p>',
 *   contentType: 'html',
 *   onUpdate: ({ editor }) => {
 *     console.log(editor.getHTML())
 *   },
 * })
 * ```
 */
export type UseEditorFn = (options?: Partial<VueQuillOptions>) => UseEditorReturn

// =============================================================================
// Component API (Thin Wrapper)
// =============================================================================

/**
 * QuillEditor component props
 * A thin wrapper around useEditor for template-based usage.
 */
export interface QuillEditorProps
  extends Omit<VueQuillOptions, 'content' | 'onCreate' | 'onUpdate' | 'onDestroy'> {
  /**
   * v-model binding for content
   * Two-way binding with automatic synchronization
   */
  modelValue?: string | Delta | null
}

/**
 * QuillEditor component events
 * Emitted as Vue component events for template integration.
 */
export interface QuillEditorEmits {
  /** v-model update event */
  (e: 'update:modelValue', value: string | Delta): void
  /** Editor created */
  (e: 'create', props: { editor: Editor }): void
  /** Content updated */
  (e: 'update', props: { editor: Editor; delta: Delta }): void
  /** Selection changed */
  (e: 'selectionUpdate', props: { editor: Editor; range: Range | null }): void
  /** Editor focused */
  (e: 'focus', props: { editor: Editor }): void
  /** Editor blurred */
  (e: 'blur', props: { editor: Editor }): void
  /** Error occurred */
  (e: 'error', props: { error: Error }): void
}

/**
 * QuillEditor component slots
 */
export interface QuillEditorSlots {
  /** Custom toolbar slot (replaces default toolbar) */
  toolbar?(): VNode[]
}

/**
 * QuillEditor exposed instance (via template ref)
 */
export interface QuillEditorInstance {
  /** The editor instance */
  editor: Editor | null
}

// =============================================================================
// EditorContent Component (TipTap-style)
// =============================================================================

/**
 * EditorContent component props
 * Renders the editor's DOM, separating logic from rendering.
 *
 * @example
 * ```vue
 * <EditorContent :editor="editor" />
 * ```
 */
export interface EditorContentProps {
  /** The editor instance to render */
  editor: Editor | null
}

// =============================================================================
// Toolbar Presets
// =============================================================================

/**
 * Built-in toolbar configurations
 */
export interface ToolbarPresets {
  readonly minimal: readonly unknown[][]
  readonly essential: readonly unknown[][]
  readonly full: readonly unknown[][]
}

/**
 * Toolbar presets constant
 */
export declare const toolbarPresets: ToolbarPresets

// =============================================================================
// Package Exports Declaration
// =============================================================================

/**
 * Main exports from @vueup/vue-quill
 */
export interface VueQuillExports {
  // Components
  QuillEditor: unknown // Vue component
  EditorContent: unknown // Vue component

  // Composables
  useEditor: UseEditorFn

  // Constants
  toolbarPresets: ToolbarPresets
}

// =============================================================================
// Type Re-exports from Quill
// =============================================================================

export type { Range, EmitterSource, QuillOptions } from 'quill'
export type { Delta } from 'quill'
