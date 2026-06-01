<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <section class="example-card" :aria-labelledby="`${title}-title`">
    <div class="example-card__header">
      <h2 :id="`${title}-title`">{{ title }}</h2>
      <p>{{ description }}</p>
    </div>
    <slot />
  </section>
</template>
