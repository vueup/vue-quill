<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Editor } from '../types'

const props = defineProps<{
  editor: Editor | null
}>()

const element = ref<HTMLElement | null>(null)

onMounted(() => {
  if (element.value && props.editor && !props.editor.isReady) {
    ;(props.editor as any)._initElement?.(element.value)
  }
})

watch(
  () => props.editor,
  (newEditor) => {
    if (element.value && newEditor && !newEditor.isReady) {
      ;(newEditor as any)._initElement?.(element.value)
    }
  }
)
</script>

<template>
  <div ref="element" class="vue-quill__editor" />
</template>
