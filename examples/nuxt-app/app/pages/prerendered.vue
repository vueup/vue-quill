<script setup lang="ts">
import { useHead } from '#imports'

defineOptions({
  name: 'NuxtPrerenderedExamplePage',
})

useHead({
  title: 'Vue Quill Nuxt Prerendered Example',
})
</script>

<template>
  <RenderingEditorDemo
    eyebrow="Prerendered route"
    title="Static HTML with hydrated editor"
    description="This route is prerendered by Nitro, then the VueQuill editor hydrates and loads Quill in the browser."
    strategy="prerendered"
  />
</template>
