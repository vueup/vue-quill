<script setup lang="ts">
import { useHead } from '#imports'

defineOptions({
  name: 'NuxtSsrExamplePage',
})

useHead({
  title: 'Vue Quill Nuxt SSR Example',
})
</script>

<template>
  <RenderingEditorDemo
    eyebrow="Universal SSR"
    title="Server-rendered shell, client-mounted editor"
    description="Nuxt universal rendering emits the page shell on the server while VueQuill waits until the browser mounts before loading Quill."
    strategy="universal-ssr"
  />
</template>
