<script setup lang="ts">
import WithModules from '@/components/ModulesExample.vue'
</script>

<template>
  <main>
    <WithModules />
  </main>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
