<script setup lang="ts">
import { useHead } from '#imports'

defineOptions({
  name: 'NuxtClientOnlyExamplePage',
})

useHead({
  title: 'Vue Quill Nuxt Client-only Example',
})
</script>

<template>
  <RenderingEditorDemo
    eyebrow="Client-only route"
    title="Client-rendered Nuxt route"
    description="This route uses Nuxt routeRules with ssr disabled, which is useful when a whole page should render only in the browser."
    strategy="client-only"
  />
</template>
