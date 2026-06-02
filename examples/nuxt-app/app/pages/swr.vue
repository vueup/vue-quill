<script setup lang="ts">
import { useHead } from '#imports'

defineOptions({
  name: 'NuxtSwrExamplePage',
})

useHead({
  title: 'Vue Quill Nuxt SWR Example',
})
</script>

<template>
  <RenderingEditorDemo
    eyebrow="SWR route rule"
    title="Cached server response with browser editor"
    description="This route uses Nuxt's stale-while-revalidate route rule while keeping VueQuill browser-only at runtime."
    strategy="swr"
  />
</template>
