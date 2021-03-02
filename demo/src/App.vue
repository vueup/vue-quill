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
  setup: () => {},
});
</script>