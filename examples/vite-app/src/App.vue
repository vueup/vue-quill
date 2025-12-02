<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/content-types">Content Types</RouterLink>
      <RouterLink to="/modules">Modules</RouterLink>
      <RouterLink to="/form">Form</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  color: #4a5568;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}

nav a:hover {
  background: #f7fafc;
}

nav a.router-link-active {
  background: #edf2f7;
  color: #2d3748;
}

main {
  padding: 0 1rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
