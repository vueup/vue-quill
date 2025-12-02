/**
 * VueQuill Component API Contract
 * 
 * This file defines the complete TypeScript interface for the QuillEditor component
 * and useQuill composable. It serves as the contract for implementation.
 * 
 * @packageDocumentation
 */

import type { VNode, Ref, ShallowRef, MaybeRefOrGetter } from 'vue'
import type Quill from 'quill'
import type { QuillOptions, Range, Delta, EmitterSource } from 'quill'

// =============================================================================
// Content Types
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
 * - ToolbarPreset: Use a built-in preset
 * - `#${string}`: CSS selector for custom toolbar element
 * - unknown[][]: Custom toolbar button configuration
 */
export type ToolbarOption = ToolbarPreset | `#${string}` | unknown[][]

// =============================================================================
// Module Types
// =============================================================================

/**
 * Custom Quill module definition for registration
 */
export interface QuillModule {
  /**
   * Module name (registered under 'modules/{name}')
   * @example 'imageResize'
   */
  name: string

  /**
   * Module class or constructor
   * Must follow Quill's module interface
   */
  module: unknown

  /**
   * Optional configuration options passed to the module
   */
  options?: Record<string, unknown>
}

// =============================================================================
// Props Interface
// =============================================================================

/**
 * QuillEditor component props
 */
export interface QuillEditorProps {
  /**
   * Editor content bound via v-model:content
   * Type interpretation depends on `contentType` prop:
   * - contentType='delta': Delta object
   * - contentType='html': HTML string
   * - contentType='text': Plain text string
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
   * @example 'essential' // preset
   * @example '#my-toolbar' // CSS selector
   * @example [['bold', 'italic'], ['link']] // custom
   */
  toolbar?: ToolbarOption

  /**
   * Custom Quill modules to register and enable
   */
  modules?: QuillModule | QuillModule[]

  /**
   * Raw Quill options (merged with derived options from other props)
   * Lower priority than specific props
   */
  options?: QuillOptions

  /**
   * Read-only mode (content not editable)
   * @default false
   */
  readOnly?: boolean

  /**
   * Enable/disable the editor
   * @default true
   */
  enable?: boolean

  /**
   * Placeholder text shown when editor is empty
   */
  placeholder?: string
}

// =============================================================================
// Event Payloads
// =============================================================================

/**
 * Payload for textChange event
 */
export interface TextChangePayload {
  /** The change that occurred (as Delta) */
  delta: Delta
  /** Contents before the change */
  oldContents: Delta
  /** Source of the change */
  source: EmitterSource
}

/**
 * Payload for selectionChange event
 */
export interface SelectionChangePayload {
  /** New selection range, null if editor lost focus */
  range: Range | null
  /** Previous selection range */
  oldRange: Range | null
  /** Source of the change */
  source: EmitterSource
}

/**
 * Payload for editorChange event (union type)
 */
export type EditorChangePayload =
  | ({ name: 'text-change' } & TextChangePayload)
  | ({ name: 'selection-change' } & SelectionChangePayload)

/**
 * Payload for error event
 */
export interface ErrorPayload {
  /** The error that occurred */
  error: Error
  /** Context where error occurred */
  context: 'initialization' | 'operation'
}

// =============================================================================
// Emits Interface
// =============================================================================

/**
 * QuillEditor component events
 */
export interface QuillEditorEmits {
  /**
   * Emitted when content changes (v-model:content)
   */
  (e: 'update:content', content: string | Delta): void

  /**
   * Emitted when text content changes
   */
  (e: 'textChange', payload: TextChangePayload): void

  /**
   * Emitted when selection/cursor changes
   */
  (e: 'selectionChange', payload: SelectionChangePayload): void

  /**
   * Emitted for any editor change (text or selection)
   */
  (e: 'editorChange', payload: EditorChangePayload): void

  /**
   * Emitted when editor gains focus
   */
  (e: 'focus', editor: HTMLElement): void

  /**
   * Emitted when editor loses focus
   */
  (e: 'blur', editor: HTMLElement): void

  /**
   * Emitted when editor is initialized and ready
   */
  (e: 'ready', quill: Quill): void

  /**
   * Emitted when an error occurs
   */
  (e: 'error', payload: ErrorPayload): void
}

// =============================================================================
// Slots Interface
// =============================================================================

/**
 * QuillEditor component slots
 */
export interface QuillEditorSlots {
  /**
   * Custom toolbar slot
   * When provided, replaces the default theme toolbar
   */
  toolbar?(): VNode[]
}

// =============================================================================
// Exposed Instance Interface
// =============================================================================

/**
 * Public API exposed by QuillEditor via template ref
 * Access via: const editorRef = ref<QuillEditorInstance>()
 */
export interface QuillEditorInstance {
  /**
   * Get the underlying Quill instance
   * @throws If called before editor is ready
   */
  getQuill(): Quill

  /**
   * Get the editor container DOM element
   */
  getEditor(): HTMLElement

  /**
   * Get the toolbar container DOM element
   * @returns undefined if no toolbar
   */
  getToolbar(): HTMLElement | undefined

  /**
   * Get current contents in the format specified by contentType
   */
  getContents(): Delta | string

  /**
   * Set editor contents
   * @param content - Delta or string based on contentType
   * @param source - Change source (default: 'api')
   */
  setContents(content: Delta | string, source?: EmitterSource): void

  /**
   * Get plain text content
   * @param index - Start index
   * @param length - Length of text to get
   */
  getText(index?: number, length?: number): string

  /**
   * Set plain text content
   * @param text - Text to set
   * @param source - Change source (default: 'api')
   */
  setText(text: string, source?: EmitterSource): void

  /**
   * Get HTML content
   */
  getHTML(): string

  /**
   * Set HTML content
   * @param html - HTML string to set
   */
  setHTML(html: string): void

  /**
   * Paste HTML at current selection
   * @param html - HTML to paste
   * @param source - Change source (default: 'api')
   */
  pasteHTML(html: string, source?: EmitterSource): void

  /**
   * Focus the editor
   */
  focus(): void

  /**
   * Reinitialize the editor
   * Useful after theme or major configuration changes
   */
  reinit(): void
}

// =============================================================================
// useQuill Composable Types
// =============================================================================

/**
 * Options for useQuill composable
 */
export interface UseQuillOptions extends QuillOptions {
  /**
   * Auto-initialize on component mount
   * Set to false for manual initialization
   * @default true
   */
  autoInit?: boolean
}

/**
 * Return type of useQuill composable
 */
export interface UseQuillReturn {
  /** The Quill instance (readonly, null before init) */
  quill: Readonly<ShallowRef<Quill | null>>

  /** Current content as Delta (readonly) */
  content: Readonly<Ref<Delta | null>>

  /** Current selection range (readonly) */
  selection: Readonly<Ref<Range | null>>

  /** Whether editor is focused (readonly) */
  isFocused: Readonly<Ref<boolean>>

  /** Whether editor has been initialized (readonly) */
  isReady: Readonly<Ref<boolean>>

  /** Get current contents as Delta */
  getContents(): Delta | undefined

  /** Set contents from Delta */
  setContents(delta: Delta, source?: EmitterSource): void

  /** Get plain text content */
  getText(index?: number, length?: number): string

  /** Set plain text content */
  setText(text: string, source?: EmitterSource): void

  /** Get HTML content */
  getHTML(): string

  /** Set HTML content */
  setHTML(html: string): void

  /** Focus the editor */
  focus(): void

  /** Blur the editor */
  blur(): void

  /**
   * Manually initialize the editor
   * Only needed when autoInit: false
   */
  initialize(): Promise<Quill>

  /** Destroy the editor instance */
  destroy(): void
}

/**
 * useQuill composable function signature
 */
export type UseQuillFn = (
  element: MaybeRefOrGetter<HTMLElement | null>,
  options?: MaybeRefOrGetter<UseQuillOptions>
) => UseQuillReturn

// =============================================================================
// Toolbar Presets
// =============================================================================

/**
 * Built-in toolbar preset configurations
 */
export interface ToolbarPresets {
  minimal: unknown[][]
  essential: unknown[][]
  full: unknown[][]
}

// =============================================================================
// Package Exports
// =============================================================================

/**
 * Main package exports interface
 * Documents what is exported from '@vueup/vue-quill'
 */
export interface VueQuillExports {
  /** Main editor component */
  QuillEditor: unknown // Component type

  /** Editor composable for advanced usage */
  useQuill: UseQuillFn

  /** Toolbar preset configurations */
  toolbarPresets: ToolbarPresets

  // Re-exports from Quill
  Quill: typeof Quill
  Delta: typeof Delta
}
