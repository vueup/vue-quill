<script setup lang="ts">
import { watch, onMounted, ref } from 'vue'
import { escapeRegExp } from '../utils/regex'

interface Props {
  container?: string
  pattern: string
  replacement: string
  prefix?: string
  suffix?: string
}

const props = withDefaults(defineProps<Props>(), {
  container: 'body',
  prefix: '',
  suffix: '',
})

const replacedText = ref<string | null>(null)

const replaceDomText = (
  container: string,
  pattern: string,
  replacement: string
) => {
  const regex = new RegExp(escapeRegExp(pattern), 'g')
  document.querySelectorAll(container).forEach((el) => {
    el.innerHTML = el.innerHTML.replace(regex, replacement)
  })
}

onMounted(() => {
  watch(
    () => props.replacement,
    (value) => {
      if (value && value !== '') {
        const pattern = replacedText.value ?? props.pattern
        const replacement = props.prefix + value + props.suffix
        replaceDomText(props.container, pattern, replacement)
        replacedText.value = replacement
      }
    },
    { immediate: true }
  )
})
</script>

<template>
  <slot />
</template>
