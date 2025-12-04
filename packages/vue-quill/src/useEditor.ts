/**
 * VueQuill useEditor Composable
 *
 * The PRIMARY API for creating VueQuill editors, following TipTap's pattern.
 * This composable manages the editor lifecycle and provides reactive state.
 *
 * @packageDocumentation
 */

import {
  shallowRef,
  onMounted,
  onBeforeUnmount,
  watch,
  type ShallowRef,
  nextTick,
} from 'vue'
import { Editor } from './Editor'
import type { VueQuillOptions, Editor as IEditor, UseEditorReturn } from './types'
import { isSSR } from './utils'

/**
 * Create a VueQuill editor instance
 *
 * This is the PRIMARY API for creating editors, following TipTap's useEditor pattern.
 * The editor is created on mount and destroyed on unmount automatically.
 *
 * @param options - Editor configuration options
 * @returns Object containing the reactive editor ref
 *
 * @example
 * ```typescript
 * import { useEditor, EditorContent } from '@vueup/vue-quill'
 *
 * const { editor } = useEditor({
 *   content: '<p>Hello World</p>',
 *   contentType: 'html',
 *   onUpdate: ({ editor }) => {
 *     console.log(editor.getHTML())
 *   },
 * })
 * ```
 *
 * @example
 * ```vue
 * <template>
 *   <EditorContent :editor="editor" />
 * </template>
 *
 * <script setup lang="ts">
 * import { useEditor, EditorContent } from '@vueup/vue-quill'
 *
 * const { editor } = useEditor({
 *   content: '',
 *   placeholder: 'Start typing...',
 * })
 * </script>
 * ```
 */
export function useEditor(
  options: Partial<VueQuillOptions> = {}
): UseEditorReturn {
  // Create editor instance (but don't initialize Quill yet)
  const editorInstance = new Editor(options)

  // Expose editor instance immediately so EditorContent can access _initElement
  const editor: ShallowRef<IEditor | null> = shallowRef(editorInstance)

  // Element ref will be provided by EditorContent or manually
  let editorElement: HTMLElement | null = null

  /**
   * Initialize the editor with a DOM element
   * Called by EditorContent or manually
   */
  const initEditor = (element: HTMLElement) => {
    if (isSSR()) {
      console.warn('[VueQuill] Cannot initialize editor during SSR')
      return
    }

    if (editorInstance.isReady) {
      console.warn('[VueQuill] Editor is already initialized')
      return
    }

    editorElement = element
    editorInstance.init(element)
    // Trigger reactivity update
    editor.value = editorInstance
  }

  /**
   * Destroy the editor and cleanup
   */
  const destroyEditor = () => {
    if (editor.value) {
      editor.value.destroy()
      editor.value = null
      editorElement = null
    }
  }

  // Lifecycle hooks
  onMounted(() => {
    // If element is already set (via EditorContent), initialize
    if (editorElement && !editorInstance.isReady) {
      initEditor(editorElement)
    }
  })

  onBeforeUnmount(() => {
    destroyEditor()
  })

  // Watch for editable changes
  if (options.editable !== undefined) {
    watch(
      () => options.editable,
      (newEditable) => {
        if (editor.value && newEditable !== undefined) {
          editor.value.setEditable(newEditable)
        }
      }
    )
  }

  // Expose initialization function for EditorContent
  // We need a way for EditorContent to call initEditor
  // Store it on the editor instance for access
  Object.defineProperty(editorInstance, '_initElement', {
    value: initEditor,
    writable: false,
    enumerable: false,
  })

  Object.defineProperty(editorInstance, '_destroyEditor', {
    value: destroyEditor,
    writable: false,
    enumerable: false,
  })

  // Watch for configuration changes that require re-initialization
  // Only watch primitive values, not deep objects
  watch(
    () => [options.theme, options.toolbar] as const,
    ([newTheme, newToolbar], [oldTheme, oldToolbar]) => {
      // Only re-init if theme or toolbar preset actually changed
      if (editorElement && (newTheme !== oldTheme || newToolbar !== oldToolbar)) {
        // Re-initialize
        destroyEditor()
        // Create new instance with current options
        const newInstance = new Editor(options)
        // Preserve internal methods
        Object.defineProperty(newInstance, '_initElement', {
          value: initEditor,
          writable: false,
          enumerable: false,
        })
        Object.defineProperty(newInstance, '_destroyEditor', {
          value: destroyEditor,
          writable: false,
          enumerable: false,
        })

        // Update ref
        editor.value = newInstance

        // Re-mount
        nextTick(() => {
          if (editorElement) {
            newInstance.init(editorElement)
          }
        })
      }
    }
  )

  return {
    editor,
  }
}

/**
 * Type augmentation for Editor to include internal init method
 */
declare module './types' {
  interface Editor {
    /** @internal */
    _initElement?: (element: HTMLElement) => void
    /** @internal */
    _destroyEditor?: () => void
  }
}
