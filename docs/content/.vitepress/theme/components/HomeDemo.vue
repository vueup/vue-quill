<script setup lang="ts">
import DemoEditor from './demo/DemoEditor.vue'

const exampleLinks = [
  {
    label: 'Open Vite example',
    href: 'https://vueup.github.io/vue-quill/examples/vite-app/',
  },
  {
    label: 'Open Nuxt example',
    href: 'https://vueup.github.io/vue-quill/examples/nuxt-app/',
  },
]
</script>

<template>
  <div class="VPHomeDemo">
    <div class="wrapper">
      <div class="container">
        <div class="block py-4">
          <header class="text-center pb-5">
            <h2 id="demo" class="font-semibold border-none mb-2">
              Interactive Demo
            </h2>
            <p class="mx-auto max-w-lg my-2">
              What you see is what you get. Try out our interactive demo and
              discover all the features packed into VueQuill.
            </p>
          </header>
          <ClientOnly>
            <DemoEditor></DemoEditor>
          </ClientOnly>
          <div class="demo-links" aria-label="Full example applications">
            <a
              v-for="link in exampleLinks"
              :key="link.href"
              class="demo-link"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ link.label }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.VPHomeDemo {
  margin-top: 112px;
  margin-bottom: -128px;
  border-top: 1px solid var(--vp-c-divider-light);
  padding: 88px 24px 96px;
  background-color: var(--vp-c-bg);
}
.container {
  margin: 0 auto;
  max-width: 1152px;
}

.demo-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}

.demo-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-brand);
  font-weight: 600;
  text-decoration: none;
  transition:
    border-color 0.2s,
    color 0.2s;
}

.demo-link:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand-dark);
}

.dark .demo-link:hover {
  color: var(--vp-c-brand-lightest);
}
</style>
