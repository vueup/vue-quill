<script setup lang="ts">
import VueQuillExample from '@vue-quill-example/App.vue'

const baseUrl = import.meta.env.BASE_URL
const isSsrPage = baseUrl.endsWith('/ssr/')
const spaHref = isSsrPage ? baseUrl.replace(/ssr\/$/, '') : baseUrl
const ssrHref = isSsrPage ? baseUrl : `${baseUrl.replace(/\/$/, '')}/ssr/`
</script>

<template>
  <header class="site-nav" aria-label="Vite rendering examples">
    <a
      :href="spaHref"
      :class="{ 'is-active': !isSsrPage }"
      :aria-current="!isSsrPage ? 'page' : undefined"
    >
      SPA
    </a>
    <a
      :href="ssrHref"
      :class="{ 'is-active': isSsrPage }"
      :aria-current="isSsrPage ? 'page' : undefined"
    >
      SSR
    </a>
  </header>

  <VueQuillExample />
</template>
