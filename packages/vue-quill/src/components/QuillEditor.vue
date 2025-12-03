<script setup lang="ts">
/**
 * QuillEditor Component
 *
 * A thin wrapper around useEditor for template-based usage.
 * Provides v-model binding and component events.
 *
 * @example
 * ```vue
 * <QuillEditor
 *   v-model="content"
 *   theme="snow"
 *   toolbar="essential"
 *   placeholder="Start writing..."
 *   @update="handleUpdate"
 * />
 * ```
 */

import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import { Editor } from '../Editor'
import type {
  ContentType,
  EditorTheme,
  ToolbarOption,
  QuillModule,
  Editor as IEditor,
  VueQuillOptions,
  ContentValue,
  DeltaLike,
} from '../types'
import type { Delta, EmitterSource, Range } from 'quill'
import { isSSR, isDelta } from '../utils'

// ─── Props ─────────────────────────────────────────────────────────────

const props = defineProps<{
  /** v-model binding for content */
  modelValue?: ContentValue
  /** Content format for serialization */
  contentType?: ContentType
  /** Editor theme */
  theme?: EditorTheme
  /** Toolbar configuration */
  toolbar?: ToolbarOption
  /** Placeholder text when empty */
  placeholder?: string
  /** Whether the editor is editable */
  editable?: boolean
  /** Autofocus on mount */
  autofocus?: boolean | 'start' | 'end'
  /** Custom Quill modules */
  modules?: QuillModule[]
  /** Raw Quill options (advanced) */
  quillOptions?: Record<string, unknown>
}>()

// ─── Emits ─────────────────────────────────────────────────────────────

const emit = defineEmits<{
  /** v-model update event */
  (e: 'update:modelValue', value: string | unknown): void
  /** Editor created */
  (e: 'create', payload: { editor: IEditor }): void
  /** Content updated */
  (e: 'update', payload: { editor: IEditor; delta: unknown; oldDelta: unknown; source: EmitterSource }): void
  /** Selection changed */
  (e: 'selectionUpdate', payload: { editor: IEditor; range: Range | null; oldRange: Range | null; source: EmitterSource }): void
  /** Editor focused */
  (e: 'focus', payload: { editor: IEditor; event: FocusEvent }): void
  /** Editor blurred */
  (e: 'blur', payload: { editor: IEditor; event: FocusEvent }): void
  /** Error occurred */
  (e: 'error', payload: { error: Error }): void
}>()

// ─── Slots ─────────────────────────────────────────────────────────────

defineSlots<{
  /** Custom toolbar slot */
  toolbar?(): unknown
}>()

// ─── State ─────────────────────────────────────────────────────────────

const editorRef = ref<HTMLDivElement | null>(null)
const editor = ref<IEditor | null>(null)
const isUpdatingFromModel = ref(false)

// ─── Computed ──────────────────────────────────────────────────────────

const containerClasses = computed(() => ({
  'vue-quill': true,
  'vue-quill--disabled': props.editable === false,
  [`vue-quill--${props.theme ?? 'snow'}`]: true,
}))

// ─── Editor Creation ───────────────────────────────────────────────────

function createEditor() {
  if (isSSR() || !editorRef.value) return

  // Build options, filtering out undefined values
  const options: Record<string, unknown> = {
    content: props.modelValue ?? null,
  }
  
  if (props.contentType !== undefined) options['contentType'] = props.contentType
  if (props.theme !== undefined) options['theme'] = props.theme
  if (props.toolbar !== undefined) options['toolbar'] = props.toolbar
  if (props.placeholder !== undefined) options['placeholder'] = props.placeholder
  if (props.editable !== undefined) options['editable'] = props.editable
  if (props.autofocus !== undefined) options['autofocus'] = props.autofocus
  if (props.modules !== undefined) options['modules'] = props.modules
  if (props.quillOptions !== undefined) options['quillOptions'] = props.quillOptions

  // Add lifecycle callbacks
  options['onCreate'] = (event: { editor: IEditor }) => {
    emit('create', event)
  }

  options['onUpdate'] = (event: { editor: IEditor; delta: Delta; oldDelta: Delta; source: EmitterSource }) => {
    if (!isUpdatingFromModel.value) {
      // Emit model update
      const content = getContent()
      if (content !== undefined) {
        emit('update:modelValue', content)
      }
    }
    emit('update', event)
  }

  options['onSelectionUpdate'] = (event: { editor: IEditor; range: Range | null; oldRange: Range | null; source: EmitterSource }) => {
    emit('selectionUpdate', event)
  }

  options['onFocus'] = (event: { editor: IEditor; event: FocusEvent }) => {
    emit('focus', event)
  }

  options['onBlur'] = (event: { editor: IEditor; event: FocusEvent }) => {
    emit('blur', event)
  }

  options['onError'] = ({ error }: { editor: IEditor; error: Error }) => {
    emit('error', { error })
  }

  const editorInstance = new Editor(options as VueQuillOptions)

  editorInstance.init(editorRef.value)
  editor.value = editorInstance
}

function destroyEditor() {
  if (editor.value) {
    editor.value.destroy()
    editor.value = null
  }
}

function getContent(): string | DeltaLike | undefined {
  if (!editor.value) return undefined

  switch (props.contentType) {
    case 'html':
      return editor.value.getHTML()
    case 'text':
      return editor.value.getText()
    case 'delta':
    default:
      return editor.value.getJSON() as DeltaLike
  }
}

// ─── Lifecycle ─────────────────────────────────────────────────────────

onMounted(() => {
  createEditor()
})

onBeforeUnmount(() => {
  destroyEditor()
})

// ─── Watchers ──────────────────────────────────────────────────────────

// Watch for model value changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (!editor.value?.isReady) return

    // Skip if the editor triggered this update
    const currentContent = getContent()
    if (isDelta(newValue) && isDelta(currentContent)) {
      // Compare deltas - simple JSON comparison
      if (JSON.stringify(newValue) === JSON.stringify(currentContent)) {
        return
      }
    } else if (newValue === currentContent) {
      return
    }

    // Update editor content
    isUpdatingFromModel.value = true
    editor.value.setContent(newValue as string ?? '', false)
    isUpdatingFromModel.value = false
  }
)

// Watch for editable changes
watch(
  () => props.editable,
  (newEditable) => {
    editor.value?.setEditable(newEditable)
  }
)

// Watch for placeholder changes
watch(
  () => props.placeholder,
  (newPlaceholder) => {
    if (editor.value?.quill) {
      // Update placeholder via Quill's root element
      const root = editor.value.element?.querySelector('.ql-editor')
      if (root) {
        root.setAttribute('data-placeholder', newPlaceholder ?? '')
      }
    }
  }
)

// ─── Expose ────────────────────────────────────────────────────────────

defineExpose({
  /** The editor instance */
  editor: editor,
})
</script>

<template>
  <div :class="containerClasses">
    <!-- Custom toolbar slot -->
    <slot name="toolbar" />
    
    <!-- Editor container -->
    <div ref="editorRef" class="vue-quill__editor" />
  </div>
</template>

<style>
/* Import Quill styles */
@import 'quill/dist/quill.snow.css';
@import 'quill/dist/quill.bubble.css';

/* Container styles */
.vue-quill {
  display: flex;
  flex-direction: column;
}

.vue-quill__editor {
  flex: 1;
}

/* Disabled state */
.vue-quill--disabled .ql-editor {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Ensure proper focus styling */
.vue-quill .ql-container:focus-within {
  outline: none;
}
</style>
