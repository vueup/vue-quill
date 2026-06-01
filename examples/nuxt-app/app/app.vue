<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator color="#2563eb" />

    <header class="site-nav" aria-label="Nuxt rendering examples">
      <NuxtLink to="/">Full catalog</NuxtLink>
      <NuxtLink to="/ssr">SSR</NuxtLink>
      <NuxtLink to="/client-only">Client-only</NuxtLink>
      <NuxtLink to="/prerendered">Prerendered</NuxtLink>
      <NuxtLink to="/swr">SWR</NuxtLink>
      <NuxtLink to="/isr">ISR</NuxtLink>
    </header>

    <NuxtPage />
  </div>
</template>
