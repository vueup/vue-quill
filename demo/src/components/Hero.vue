<template>
  <!-- ============ HERO ============ -->
  <div class="">
    <div class="container mx-auto lg:px-24 py-24 text-center">
      <header class="text-gray-900">
        <h1 class="text-6xl font-bold">VueUpQuill</h1>
        <h2 class="text-2xl font-medium mt-8">
          <span
            class="bg-yellow-200 px-2 transform -skew-x-12 inline-block leading-relaxed"
            >Vue 3 + Quill JS</span
          >
          plugin for your powerful text editor.
        </h2>
      </header>
      <div class="mt-10">
        <a
          href="#"
          class="inline-block py-2 px-6 bg-indigo-500 border-2 border-indigo-500 text-white font-semibold rounded-md mr-3"
          >Demo Examples</a
        >
        <a
          href="/docs/"
          class="inline-block py-2 px-6 bg-indigo-100 border-2 border-indigo-500 text-indigo-500 font-semibold rounded-md"
          >Documentation</a
        >
      </div>
    </div>
    <!-- {{ partial "icons/bg-hero.svg" "absolute top-0 w-full z-0" }} -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  setup: () => {},
});
</script>