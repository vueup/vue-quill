<script setup lang="ts">
import DemoEditor from './demo/DemoEditor.vue'
</script>

<template>
  <div class="VPHomeDemo">
    <div class="wrapper">
      <div class="container">
        <div class="block py-4">
          <header class="text-center pb-5">
            <h2 id="demo" class="font-semibold border-none mb-2">Interactive Demo</h2>
            <p class="mx-auto max-w-lg my-2">
              What you see is what you get. Try out our interactive demo and discover all the features packed into VueQuill.
            </p>
          </header>
          <ClientOnly>
            <DemoEditor></DemoEditor>
          </ClientOnly>
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
</style>
