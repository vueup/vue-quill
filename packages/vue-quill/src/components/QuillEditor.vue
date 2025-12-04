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
} from '../types'
import type { EmitterSource, Range, Delta } from 'quill'
import { isSSR, isDelta } from '../utils'

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

const editorRef = ref<HTMLDivElement | null>(null)
const editor = ref<IEditor | null>(null)
const isUpdatingFromModel = ref(false)

// ─── Computed ──────────────────────────────────────────────────────────

const containerClasses = computed(() => ({
  'vue-quill': true,
  'vue-quill--disabled': !props.editable,
  [`vue-quill--${props.theme ?? 'snow'}`]: true,
}))

// ─── Editor Creation ───────────────────────────────────────────────────

function createEditor() {
  if (isSSR() || !editorRef.value) return

  const options: VueQuillOptions = {
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
      if (!isUpdatingFromModel.value) {
        const content = getContent()
        if (content !== undefined) model.value = content
      }
      emit('update', event)
    },
    onSelectionUpdate: (event) => emit('selectionUpdate', event),
    onFocus: (event) => emit('focus', event),
    onBlur: (event) => emit('blur', event),
    onError: ({ error }) => emit('error', { error }),
    // @ts-expect-error - Custom event
    onEditorChange: (event) => emit('editorChange', event),
  }

  const editorInstance = new Editor(options)
  editorInstance.init(editorRef.value)
  editor.value = editorInstance
}

function destroyEditor() {
  editor.value?.destroy()
  editor.value = null
  if (editorRef.value) editorRef.value.innerHTML = ''
}

function getContent(): string | Delta | undefined {
  if (!editor.value) return undefined
  switch (props.contentType) {
    case 'html': return editor.value.getHTML()
    case 'text': return editor.value.getText()
    default: return editor.value.getJSON()
  }
}

function reinit() {
  destroyEditor()
  createEditor()
}

// ─── Lifecycle ─────────────────────────────────────────────────────────

onMounted(createEditor)
onBeforeUnmount(destroyEditor)

// ─── Watchers ──────────────────────────────────────────────────────────

watch(model, (newValue, oldValue) => {
  if (!editor.value?.isReady || newValue === oldValue || isUpdatingFromModel.value) return

  // Fast path: string comparison (most common case)
  if (typeof newValue === 'string' && typeof getContent() === 'string') {
    if (newValue === getContent()) return
  }
  // Delta comparison: check ops length first (fast), then compare
  else if (isDelta(newValue)) {
    const currentContent = getContent()
    if (isDelta(currentContent)) {
      // Fast: compare ops length first
      if (newValue.ops.length === currentContent.ops.length) {
        // Only stringify if lengths match (rare case where content might be same)
        if (JSON.stringify(newValue.ops) === JSON.stringify(currentContent.ops)) return
      }
    }
  }

  isUpdatingFromModel.value = true
  try {
    editor.value.setContent(newValue as string ?? '', false)
  } finally {
    isUpdatingFromModel.value = false
  }
})

watch(() => props.editable, (val) => editor.value?.setEditable(val))

watch(() => props.placeholder, (val) => {
  const root = editor.value?.element?.querySelector('.ql-editor')
  root?.setAttribute('data-placeholder', val ?? '')
})

// Re-initialize editor when configuration props change
watch(
  [() => props.theme, () => props.toolbar, () => props.modules],
  () => {
    reinit()
  },
  { deep: true }
)

// ─── Expose ────────────────────────────────────────────────────────────

defineExpose({ editor, reinit })
</script>

<template>
  <div :class="containerClasses">
    <slot name="toolbar" />
    <div ref="editorRef" class="vue-quill__editor" />
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
