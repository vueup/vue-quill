/**
 * VueQuill TypeScript Type Definitions
 *
 * This file contains all TypeScript types, interfaces, and type aliases
 * for VueQuill v2.0, following TipTap-inspired patterns.
 *
 * @packageDocumentation
 */

import type { ShallowRef } from 'vue'
import type Quill from 'quill'
import type { QuillOptions, Range, Delta, EmitterSource } from 'quill'
import type { Blot, LeafBlot, BlockBlot, EmbedBlot } from 'parchment'

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
  /** Fired on either text-change or selection-change */
  editorChange: (props: {
    editor: Editor
    name: 'text-change' | 'selection-change'
    args: unknown[]
  }) => void
}

// =============================================================================
// Editor Instance Interface (Core)
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
  color(color: string): EditorCommandChain
  background(color: string): EditorCommandChain
  link(url: string | false): EditorCommandChain
  align(alignment: 'left' | 'center' | 'right' | 'justify' | false): EditorCommandChain

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

  // Embeds
  insertImage(url: string): EditorCommandChain
  insertVideo(url: string): EditorCommandChain

  // History
  undo(): EditorCommandChain
  redo(): EditorCommandChain

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

  // ─── History Methods ───────────────────────────────────────────────
  /** Undo the last change */
  undo(): this
  /** Redo the last undone change */
  redo(): this
  /** Clear the entire history stack */
  clearHistory(): this

  // ─── Formatting Methods ────────────────────────────────────────────
  /** Apply format to current selection or cursor */
  format(name: string, value: any, source?: EmitterSource): this
  /** Format text in a specific range */
  formatText(index: number, length: number, formatOrFormats: string | Record<string, any>, value?: any): this
  /** Get formats at selection or specific range */
  getFormat(index?: number, length?: number): Record<string, any>
  /** Remove all formatting in a range */
  removeFormat(index: number, length: number): this

  // ─── Embed Methods ─────────────────────────────────────────────────
  /** Insert an embed (image, video, etc.) at the specified index */
  insertEmbed(index: number, type: string, value: any): this
  /** Insert an image at the specified index */
  insertImage(index: number, url: string): this
  /** Insert a video at the specified index */
  insertVideo(index: number, url: string): this

  // ─── Selection & Scroll Utilities ──────────────────────────────────
  /** Get pixel bounds of a text range */
  getBounds(index: number, length?: number): { top: number; left: number; height: number; width: number } | null
  /** Scroll the current selection into view */
  scrollSelectionIntoView(): this
  /** Check if the editor currently has focus */
  hasFocus(): boolean
  /** Synchronously check editor for updates and fire events */
  update(source?: EmitterSource): this

  // ─── Content Manipulation ──────────────────────────────────────────
  /** Insert text at a specific index */
  insertText(index: number, text: string, formats?: Record<string, any>): this
  /** Delete text in a specific range */
  deleteText(index: number, length: number): this
  /** Apply Delta changes to the editor */
  updateContents(delta: Delta, source?: EmitterSource): this

  // ─── Command Chain (TipTap-style) ──────────────────────────────────
  /** Start a command chain for fluent operations */
  chain(): EditorCommandChain
  /** Check if commands can be executed */
  can(): EditorCanCommands

  // ─── Extension Methods ─────────────────────────────────────────────
  /** Get a Quill module instance by name */
  getModule<T = any>(name: string): T | null

  // ─── Event Methods ─────────────────────────────────────────────────
  /** Subscribe to editor events */
  on<E extends keyof EditorEvents>(event: E, handler: EditorEvents[E]): this
  /** Unsubscribe from editor events */
  off<E extends keyof EditorEvents>(event: E, handler: EditorEvents[E]): this
  /** Subscribe to an event once (automatically unsubscribes after first call) */
  once<E extends keyof EditorEvents>(event: E, handler: EditorEvents[E]): this

  // ─── Lifecycle ─────────────────────────────────────────────────────
  /** Destroy the editor and cleanup resources */
  destroy(): void

  // ─── Model Methods (Advanced) ──────────────────────────────────────
  /** Find the Blot or Quill instance for a DOM node */
  find(domNode: Node, bubble?: boolean): Blot | Quill | null
  /** Get the index of a Blot */
  getIndex(blot: Blot): number
  /** Get the leaf Blot at an index */
  getLeaf(index: number): [LeafBlot | null, number]
  /** Get the line Blot at an index */
  getLine(index: number): [BlockBlot | EmbedBlot | null, number]
  /** Get lines at an index or range */
  getLines(index?: number | Range, length?: number): (BlockBlot | EmbedBlot)[]
  /** Add a container element inside the editor */
  addContainer(classNameOrNode: string | Node, refNode?: Node): Element
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

// =============================================================================
// Component Types
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
 * QuillEditor exposed instance (via template ref)
 */
export interface QuillEditorInstance {
  /** The editor instance */
  editor: Editor | null
}

/**
 * EditorContent component props
 * Renders the editor's DOM, separating logic from rendering.
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

// =============================================================================
// Re-exports from Quill
// =============================================================================

export type { Range, EmitterSource, QuillOptions } from 'quill'
export type { Delta } from 'quill'

// =============================================================================
// Simplified Types for Component Props (avoids complex type inference)
// =============================================================================

/**
 * Delta-like object structure for component props
 * This avoids complex type inference issues with Quill's Delta class
 */
export interface DeltaLike {
  ops: Array<{
    insert?: string | Record<string, unknown>
    delete?: number
    retain?: number
    attributes?: Record<string, unknown>
  }>
}

/**
 * Content value type for v-model binding
 * Uses simplified DeltaLike instead of Quill's Delta to avoid type inference issues
 */
export type ContentValue = string | DeltaLike | null
