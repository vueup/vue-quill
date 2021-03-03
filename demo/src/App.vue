<template>
  <Header></Header>
  <Hero></Hero>
  <DemoEditor></DemoEditor>
  <Footer></Footer>
</template>

<script lang="ts">
import "prismjs";
import "prismjs/themes/prism.css";

import { defineComponent, ref } from "vue";
import Prism from "vue-prism-component";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import Hero from "./components/Hero.vue";
import DemoEditor from "./components/DemoEditor.vue";

export default defineComponent({
  components: {
    Prism,
    Header,
    Footer,
    Hero,
    DemoEditor,
  },
  setup: () => {},
});
</script>