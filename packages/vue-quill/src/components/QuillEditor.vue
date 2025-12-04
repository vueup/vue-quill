<script setup lang="ts">
/**
 * QuillEditor Component
 *
 * A Vue 3 component wrapper for Quill editor.
 * Provides v-model binding and component events.
 *
 * @example
 * ```vue
 * <QuillEditor
 *   v-model="content"
 *   theme="snow"
 *   toolbar="essential"
 *   placeholder="Start writing..."
 * />
 * ```
 */

defineOptions({
  name: 'QuillEditor',
})

import { watch, computed, withDefaults } from 'vue'
import { useEditor } from '../useEditor'
import QuillEditorContent from './QuillEditorContent.vue'
import type {
  ContentType,
  EditorTheme,
  ToolbarOption,
  QuillModule,
  Editor as IEditor,
  ContentValue,
  DeltaLike,
} from '../types'
import type { EmitterSource, Range } from 'quill'
import { isDelta } from '../utils'

// ─── Props ─────────────────────────────────────────────────────────────

const props = withDefaults(
  defineProps<{
    contentType?: ContentType
    theme?: EditorTheme
    toolbar?: ToolbarOption
    placeholder?: string
    editable?: boolean
    autofocus?: boolean | 'start' | 'end'
    modules?: QuillModule[]
    quillOptions?: Record<string, unknown>
  }>(),
  { editable: true }
)

const model = defineModel<ContentValue>()

// ─── Emits ─────────────────────────────────────────────────────────────

const emit = defineEmits<{
  (e: 'create', payload: { editor: IEditor }): void
  (e: 'update', payload: { editor: IEditor; delta: unknown; oldDelta: unknown; source: EmitterSource }): void
  (e: 'selectionUpdate', payload: { editor: IEditor; range: Range | null; oldRange: Range | null; source: EmitterSource }): void
  (e: 'focus', payload: { editor: IEditor; event: FocusEvent }): void
  (e: 'blur', payload: { editor: IEditor; event: FocusEvent }): void
  (e: 'error', payload: { error: Error }): void
  (e: 'editorChange', payload: { editor: IEditor; name: 'text-change' | 'selection-change'; args: unknown[] }): void
}>()

// ─── Slots ─────────────────────────────────────────────────────────────

defineSlots<{ toolbar?(): unknown }>()

// ─── State ─────────────────────────────────────────────────────────────

const isUpdatingFromModel = computed(() => false) // Placeholder if needed, but useEditor handles sync?
// Actually useEditor doesn't handle v-model sync automatically unless we pass a ref.
// But here we are using useEditor to get the editor instance, and we need to sync model.

// ─── Computed ──────────────────────────────────────────────────────────

const containerClasses = computed(() => ({
  'vue-quill': true,
  'vue-quill--disabled': !props.editable,
  [`vue-quill--${props.theme ?? 'snow'}`]: true,
}))

// ─── Editor Creation ───────────────────────────────────────────────────

const { editor } = useEditor({
  content: model.value as string | null,
  contentType: props.contentType,
  theme: props.theme,
  toolbar: props.toolbar,
  placeholder: props.placeholder,
  editable: props.editable,
  autofocus: props.autofocus,
  modules: props.modules,
  quillOptions: props.quillOptions,
  onCreate: (event) => emit('create', event),
  onUpdate: (event) => {
    // Sync model
    const content = getContent()
    if (content !== undefined && content !== model.value) {
       model.value = content
    }
    emit('update', event)
  },
  onSelectionUpdate: (event) => emit('selectionUpdate', event),
  onFocus: (event) => emit('focus', event),
  onBlur: (event) => emit('blur', event),
  onError: ({ error }) => emit('error', { error }),
  // @ts-expect-error - Custom event
  onEditorChange: (event) => emit('editorChange', event),
})

function getContent(): string | DeltaLike | undefined {
  if (!editor.value) return undefined
  switch (props.contentType) {
    case 'html': return editor.value.getHTML()
    case 'text': return editor.value.getText()
    default: return editor.value.getJSON() as DeltaLike
  }
}

function reinit() {
  // handled by useEditor watcher
}

// ─── Lifecycle ─────────────────────────────────────────────────────────

// Managed by useEditor

// ─── Watchers ──────────────────────────────────────────────────────────

watch(model, (newValue) => {
  if (editor.value && newValue !== getContent()) {
    editor.value.setContent(newValue as string ?? '')
  }
})

watch(() => props.editable, (val) => editor.value?.setEditable(val))

watch(() => props.placeholder, (val) => {
  const root = editor.value?.element?.querySelector('.ql-editor')
  root?.setAttribute('data-placeholder', val ?? '')
})

// Re-initialize editor when configuration props change
// Handled by useEditor

// ─── Expose ────────────────────────────────────────────────────────────

defineExpose({ editor, reinit })
</script>

<template>
  <div :class="containerClasses">
    <slot name="toolbar" />
    <QuillEditorContent :editor="editor" />
  </div>
</template>

<style>
@import 'quill/dist/quill.snow.css';
@import 'quill/dist/quill.bubble.css';

.vue-quill {
  display: flex;
  flex-direction: column;
}

.vue-quill__editor {
  flex: 1;
}

.vue-quill--disabled .ql-editor {
  opacity: 0.65;
  cursor: not-allowed;
}

.vue-quill .ql-container:focus-within {
  outline: none;
}
</style>
