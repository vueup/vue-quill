<template>
  <Header></Header>
  <Hero></Hero>
  <DemoEditor></DemoEditor>
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
import DemoEditor from "./components/DemoEditor.vue";

export default defineComponent({
  components: {
    Prism,
    Header,
    Hero,
    DemoEditor,
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