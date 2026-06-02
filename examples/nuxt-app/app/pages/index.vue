<script setup lang="ts">
import { useHead } from '#imports'

defineOptions({
  name: 'NuxtExamplePage',
})

useHead({
  title: 'Vue Quill Nuxt Example',
})
</script>

<template>
  <NuxtQuillCatalog />
</template>
