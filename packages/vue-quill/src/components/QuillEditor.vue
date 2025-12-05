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
  EditorTheme,
  ToolbarOption,
  QuillModule,
  Editor as IEditor,
  VueQuillOptions,
  ContentValue,
} from '../types'
import { Delta } from 'quill'
import type { EmitterSource, Range } from 'quill'
import { isSSR, isDelta, deltasEqual } from '../utils'

// ─── Props ─────────────────────────────────────────────────────────────

const props = withDefaults(
  defineProps<{
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
  (e: 'update', payload: { editor: IEditor; delta: Delta; oldDelta: Delta; source: EmitterSource; html: string; text: string }): void
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
const loadedThemes = new Set<EditorTheme | ''>()

// ─── Computed ──────────────────────────────────────────────────────────

const containerClasses = computed(() => ({
  'vue-quill': true,
  'vue-quill--disabled': !props.editable,
  [`vue-quill--${props.theme ?? 'snow'}`]: true,
}))

// ─── Styles ───────────────────────────────────────────────────────────

function loadThemeStyles(theme?: EditorTheme) {
  if (isSSR()) return
  const effectiveTheme = theme ?? 'snow'
  if (!effectiveTheme || loadedThemes.has(effectiveTheme)) return

  if (effectiveTheme === 'bubble') {
    import('quill/dist/quill.bubble.css')
  } else {
    import('quill/dist/quill.snow.css')
  }

  loadedThemes.add(effectiveTheme)
}

// ─── Editor Creation ───────────────────────────────────────────────────

function createEditor() {
  if (isSSR() || !editorRef.value) return

  loadThemeStyles(props.theme)

  const options: VueQuillOptions = {
    content: model.value ?? null,
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
        const content = deriveContentFromUpdate(event)
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

function getContent(): Delta | undefined {
  if (!editor.value) return undefined
  return editor.value.getJSON()
}

function deriveContentFromUpdate(event: { delta: Delta; html: string; text: string }): ContentValue {
  return event.delta
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

  // Compare content to avoid unnecessary updates
  const currentContent = getContent()
  
  if (isDelta(newValue) && isDelta(currentContent) && deltasEqual(newValue, currentContent)) return

  isUpdatingFromModel.value = true
  const nextContent = (newValue ?? new Delta()) as Delta
  editor.value?.setContent(nextContent, false)
  isUpdatingFromModel.value = false
})

watch(() => props.editable, (val) => editor.value?.setEditable(val))

watch(() => props.placeholder, (val) => {
  const root = editor.value?.element?.querySelector('.ql-editor')
  root?.setAttribute('data-placeholder', val ?? '')
})

watch(
  () => props.theme,
  (theme) => {
    loadThemeStyles(theme)
  },
  { immediate: true }
)

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
