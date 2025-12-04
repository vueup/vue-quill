/**
 * VueQuill - A Vue 3 Component for Quill Rich Text Editor
 *
 * @packageDocumentation
 */

// Components
export { default as QuillEditor } from './components/QuillEditor.vue'
export { default as EditorContent } from './components/EditorContent.vue'
export { default as QuillEditorContent } from './components/QuillEditorContent.vue'

// Core editor
export { Editor } from './Editor'
export { useEditor } from './useEditor'

// Types
export type {
  ContentType,
  EditorTheme,
  ToolbarPreset,
  ToolbarOption,
  QuillModule,
  Editor as IEditor,
  EditorEvents,
  EditorCommandChain,
  EditorCanCommands,
  VueQuillOptions,
  UseEditorReturn,
  QuillEditorProps,
  QuillEditorInstance,
  EditorContentProps,
  ToolbarPresets,
} from './types'

// Toolbar presets
export { toolbarPresets, resolveToolbar } from './toolbar-presets'

// Utilities
export {
  isSSR,
  isDelta,
  isHTML,
  normalizeContent,
  createEditorId,
  debounce,
  deltasEqual,
  getContentLength,
  isContentEmpty,
  createEmptyDelta,
} from './utils'

// Re-export Quill types for convenience
export type { Range, EmitterSource, QuillOptions, Delta } from 'quill'
