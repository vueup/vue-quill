<script setup lang="ts">
/**
 * EditorContent Component
 *
 * A TipTap-style component that renders the editor's DOM.
 * Used with the useEditor composable for separating logic from rendering.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useEditor, EditorContent } from '@vueup/vue-quill'
 *
 * const { editor } = useEditor({
 *   content: '<p>Hello World</p>',
 *   contentType: 'html',
 * })
 * <\/script>
 *
 * <template>
 *   <EditorContent :editor="editor" />
 * </template>
 * ```
 */

import { ref, onMounted, onBeforeUnmount, watch, computed, toRef } from 'vue'
import type { Editor } from '../types'
import { isSSR } from '../utils'

// ─── Props ─────────────────────────────────────────────────────────────

const props = defineProps<{
  /** The editor instance to render */
  editor: Editor | null
}>()

// Expose editor as a ref for template access
const editorRef = toRef(props, 'editor')

// ─── State ─────────────────────────────────────────────────────────────

const containerRef = ref<HTMLDivElement | null>(null)
const isInitialized = ref(false)

// ─── Computed ──────────────────────────────────────────────────────────

const containerClasses = computed(() => ({
  'vue-quill-content': true,
  'vue-quill-content--ready': isInitialized.value,
}))

// ─── Initialization ────────────────────────────────────────────────────

function initEditor() {
  if (isSSR() || !containerRef.value || !editorRef.value) return

  // Check if editor has the internal init method
  const editorInstance = editorRef.value as Editor & { _initElement?: (el: HTMLElement) => void }
  const initFn = editorInstance._initElement
  
  if (initFn && !editorRef.value.isReady) {
    initFn(containerRef.value)
    isInitialized.value = true
  }
}

// ─── Lifecycle ─────────────────────────────────────────────────────────

onMounted(() => {
  initEditor()
})

onBeforeUnmount(() => {
  // Editor cleanup is handled by useEditor's onBeforeUnmount
  isInitialized.value = false
})

// Watch for editor changes
watch(
  editorRef,
  (newEditor) => {
    if (newEditor && !newEditor.isReady && containerRef.value) {
      initEditor()
    }
  }
)
</script>

<template>
  <div
    ref="containerRef"
    :class="containerClasses"
  />
</template>

<style>
/* Import Quill styles */
@import 'quill/dist/quill.snow.css';
@import 'quill/dist/quill.bubble.css';

.vue-quill-content {
  display: block;
}

.vue-quill-content .ql-editor {
  min-height: 100px;
}
</style>
