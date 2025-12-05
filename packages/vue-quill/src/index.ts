/**
 * VueQuill - A Vue 3 Component for Quill Rich Text Editor
 *
 * @packageDocumentation
 */

// Components
export { default as QuillEditor } from './components/QuillEditor.vue'
export { default as QuillEditorContent } from './components/QuillEditorContent.vue'
// Alias for backwards compatibility
export { default as EditorContent } from './components/QuillEditorContent.vue'

// Core editor
export { Editor } from './Editor'
export { useEditor } from './useEditor'

// Types
export type {
  EditorTheme,
  ToolbarPreset,
  ToolbarOption,
  ToolbarItem,
  ToolbarItemGroup,
  QuillModule,
  Editor as IEditor,
  EditorEvents,
  Commands,
  EditorCanCommands,
  VueQuillOptions,
  UseEditorReturn,
  QuillEditorProps,
  QuillEditorInstance,
  EditorContentProps,
  ToolbarPresets,
  // Format types
  FormatName,
  FormatValue,
  Formats,
  EmbedType,
  ContentValue,
} from './types'

// Toolbar presets
export { toolbarPresets, resolveToolbar } from './toolbar'

// Utilities
export {
  isSSR,
  isDelta,
  isHTML,
  debounce,
  deltasEqual,
  getContentLength,
  isContentEmpty,
} from './utils'

// Re-export Quill types for convenience
export type { Range, EmitterSource, QuillOptions, Bounds } from 'quill'
export { Delta, Op, AttributeMap } from 'quill'
