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
  <!-- ============ HERO ============ -->
  <div class="">
    <div class="container mx-auto lg:px-24 py-24 text-center">
      <h1 class="text-6xl font-bold">VueUpQuill</h1>
      <h2 class="text-2xl font-medium mt-8">
        <span
          class="bg-yellow-200 px-2 text-gray-900 transform -skew-x-12 inline-block leading-relaxed"
          >Vue 3 + Quill JS</span
        >
        for your powerful rich text editor.
      </h2>
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

  <!-- ============ DEMO ============ -->
  <div class="container mx-auto xl:px-24">
    <div class="grid grid-cols-2 gap-3">
      <header class="col-start-1 col-end-3">Snow</header>
      <QuillEditor
        class="h-60 bg-white"
        v-model:content="myContent"
        @ready="handleReady"
        @textChange="handleTextChange"
        theme="snow"
      ></QuillEditor>
      <Prism language="html" :code="myHTML"></Prism>
      <button @click="clickMe">Click</button>
    </div>
  </div>
</template>

<script lang="ts">
import "prismjs";
import "prismjs/themes/prism.css";

import Quill from "quill";
import { Delta } from "types-quill-delta";
import { defineComponent, ref } from "vue";
import Prism from "vue-prism-component";

export default defineComponent({
  components: {
    Prism,
  },
  setup: () => {
    const myContent = ref([
      { insert: "Hello " },
      { insert: "World!", attributes: { bold: true } },
      { insert: "\n" },
    ]);
    const myHTML = ref<string>("");
    let myQuill: Quill | null = null;

    const handleReady = (quill) => {
      myQuill = quill;
    };

    const handleTextChange = (a: Delta, b: Delta, c: any) => {
      myHTML.value = myQuill?.root.innerHTML as string;
    };

    const clickMe = () => {
      myHTML.value = myQuill?.root.innerHTML as string;
      console.log(myQuill?.root.innerHTML);
    };

    return { clickMe, myContent, myHTML, handleReady, handleTextChange };
  },
});
</script>