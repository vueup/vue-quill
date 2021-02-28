<template>
  <Header></Header>
  <Hero></Hero>
  <!-- ============ DEMO ============ -->
  <div class="container mx-auto xl:px-24">
    <div class="grid grid-cols-2 gap-3">
      <header class="col-start-1 col-end-3">Snow</header>
      <QuillEditor
        class="h-60 bg-white"
        v-model:content="myContent"
        @ready="handleReady"
        @textChange="handleTextChange"
        theme="bubble"
        options="full"
      >
        <!-- <template #toolbar>
          <h1>DAnceo</h1>
        </template> -->
      </QuillEditor>
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
import Header from "./components/Header.vue";
import Hero from "./components/Hero.vue";

export default defineComponent({
  components: {
    Prism,
    Header,
    Hero,
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