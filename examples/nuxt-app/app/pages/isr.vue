<script setup lang="ts">
import { useHead } from '#imports'

defineOptions({
  name: 'NuxtIsrExamplePage',
})

useHead({
  title: 'Vue Quill Nuxt ISR Example',
})
</script>

<template>
  <RenderingEditorDemo
    eyebrow="ISR route rule"
    title="Incremental static route with browser editor"
    description="This route declares Nitro ISR behavior for supported deployment providers and uses the same SSR-safe VueQuill import path."
    strategy="isr"
  />
</template>
