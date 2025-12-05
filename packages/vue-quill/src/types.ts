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
import type { QuillOptions, Range, EmitterSource, Bounds } from 'quill'
import { Delta, Op, AttributeMap } from 'quill'
import type { Blot, LeafBlot, BlockBlot, EmbedBlot } from 'parchment'

// =============================================================================
// Format Types (Stricter Types for Better DX)
// =============================================================================

/**
 * Known format names that Quill supports
 */
export type FormatName =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'color'
  | 'background'
  | 'font'
  | 'size'
  | 'link'
  | 'script'
  | 'header'
  | 'blockquote'
  | 'code-block'
  | 'list'
  | 'indent'
  | 'direction'
  | 'align'
  | 'image'
  | 'video'
  | 'formula'
  | (string & {}) // Allow custom formats while keeping autocomplete

/**
 * Possible format values
 */
export type FormatValue = string | number | boolean | null | undefined

/**
 * Format object (key-value pairs of format names and values)
 */
export type Formats = Partial<Record<FormatName, FormatValue>>

/**
 * Embed types supported by Quill
 */
export type EmbedType = 'image' | 'video' | 'formula' | (string & {})

// =============================================================================
// Content & Theme Types
// =============================================================================

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
  | ToolbarItemGroup[] // Custom button config
  | false // Disable toolbar

/**
 * A single toolbar item (button or dropdown)
 */
export type ToolbarItem =
  | string // Simple format name like 'bold'
  | { header: number | number[] } // Header dropdown
  | { list: 'ordered' | 'bullet' | 'check' }
  | { script: 'sub' | 'super' }
  | { indent: '-1' | '+1' }
  | { direction: 'rtl' }
  | { size: string[] }
  | { color: string[] }
  | { background: string[] }
  | { font: string[] }
  | { align: string[] }
  | Record<string, unknown> // Custom formats

/**
 * A group of toolbar items
 */
export type ToolbarItemGroup = ToolbarItem[]

// =============================================================================
// Module Types
// =============================================================================

/**
 * Custom Quill module definition for registration
 */
export interface QuillModule<TOptions = Record<string, unknown>> {
  /** Module name (registered under 'modules/{name}') */
  name: string
  /** Module class or constructor */
  module: new (quill: Quill, options?: TOptions) => unknown
  /** Optional configuration options */
  options?: TOptions
}

// =============================================================================
// Editor Events
// =============================================================================

export interface EditorUpdatePayload {
  editor: Editor
  delta: Delta
  oldDelta: Delta
  source: EmitterSource
  html: string
  text: string
}

/**
 * Editor event handler signatures
 */
export interface EditorEvents {
  /** Fired when editor is created */
  create: (props: { editor: Editor }) => void
  /** Fired when content changes */
  update: (props: EditorUpdatePayload) => void
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
export interface Commands {
  // Formatting
  bold(): Commands
  italic(): Commands
  underline(): Commands
  strike(): Commands
  color(color: string): Commands
  background(color: string): Commands
  link(url: string | false): Commands
  align(alignment: 'left' | 'center' | 'right' | 'justify' | false): Commands

  // Structure
  setHeading(level: 1 | 2 | 3 | 4 | 5 | 6): Commands
  setParagraph(): Commands
  setBlockquote(): Commands
  setCodeBlock(): Commands

  // Lists
  setBulletList(): Commands
  setOrderedList(): Commands

  // Selection & Focus
  focus(position?: 'start' | 'end' | number): Commands
  blur(): Commands
  selectAll(): Commands

  // Content
  setContent(content: string | Delta): Commands
  insertContent(content: string | Delta): Commands
  clearContent(): Commands

  // Embeds
  insertImage(url: string): Commands
  insertVideo(url: string): Commands

  // History
  undo(): Commands
  redo(): Commands

  // Reset for reuse
  reset(): Commands

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
  format(name: FormatName, value: FormatValue, source?: EmitterSource): this
  /** Format text in a specific range */
  formatText(index: number, length: number, formatOrFormats: FormatName | Formats, value?: FormatValue): this
  /** Get formats at selection or specific range */
  getFormat(index?: number, length?: number): Formats
  /** Remove all formatting in a range */
  removeFormat(index: number, length: number): this

  // ─── Embed Methods ─────────────────────────────────────────────────
  /** Insert an embed (image, video, etc.) at the specified index */
  insertEmbed(index: number, type: EmbedType, value: string | Record<string, unknown>): this
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
  insertText(index: number, text: string, formats?: Formats): this
  /** Delete text in a specific range */
  deleteText(index: number, length: number): this
  /** Apply Delta changes to the editor */
  updateContents(delta: Delta, source?: EmitterSource): this

  // ─── Command Chain (TipTap-style) ──────────────────────────────────
  /** Start a command chain for fluent operations */
  chain(): Commands
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
  modelValue?: Delta | null
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
 * Uses Quill's native toolbar format (unknown[][] for flexibility)
 */
export interface ToolbarPresets {
  readonly minimal: readonly unknown[][]
  readonly essential: readonly unknown[][]
  readonly full: readonly unknown[][]
}

// =============================================================================
// Re-exports from Quill (for convenience)
// =============================================================================

export type { Range, EmitterSource, QuillOptions, Bounds } from 'quill'
export { Delta, Op, AttributeMap } from 'quill'

// =============================================================================
// Simplified Types for Component Props
// =============================================================================

/**
 * Content value type for v-model binding
 * Delta is the canonical format; HTML/text should be derived from events
 */
export type ContentValue = Delta | null
