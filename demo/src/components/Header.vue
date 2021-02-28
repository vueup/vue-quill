<template>
  <!-- ============ HEADER ============ -->
  <header class="flex justify-between items-center">
    <div
      class="container mx-auto xl:px-24 py-4 flex items-center justify-between"
    >
      <div class="flex items-center justify-between px-4 py-3 sm:p-0">
        <div>
          <a href="/" class="flex items-center">
            <img src="/logo.png" alt="VueUpQuill" class="h-10" />
            <span class="font-semibold ml-1 text-lg">VueUpQuill</span>
            <span
              class="bg-blue-100 text-indigo-600 font-medium px-1 text-sm rounded-sm ml-2"
              >v0.0.1</span
            >
          </a>
        </div>
      </div>
      <div
        class="px-2 pt-2 pb-4 sm:flex sm:p-0 hidden font-semibold text-gray-600"
      >
        <a
          href="/docs/"
          rel="noopener"
          target="_blank"
          class="px-3 py-1 rounded mt-1 sm:mt-0 sm:ml-2 hover:bg-gray-200"
        >
          Documentation
        </a>
        <a
          href="https://paypal.me/bledex"
          class="px-3 py-1 rounded mt-1 sm:mt-0 sm:ml-2 hover:bg-gray-200"
        >
          Donate
        </a>
        <a
          href="#"
          rel="noopener"
          target="_blank"
          class="px-3 py-1 rounded mt-1 sm:mt-0 sm:ml-2 bg-indigo-100 hover:bg-indigo-200 text-blue-700"
        >
          GET STARTED
        </a>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  setup: () => {},
});
</script>