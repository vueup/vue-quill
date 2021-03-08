---
home: true
heroImage: /quill.svg
actionText: Get Started
actionLink: /guide/

altActionText: Learn More
altActionLink: /guide/why

features:
  - title: 💚 Built With Vue 3
    details: More powerful and performant framework than ever before.
  - title: 🧙‍♂️ Fully Typescript
    details: VueUpQuill source code is written entirely in TypeScript.
  - title: 🛠️ Easy To Use
    details: Straightforward implementation through a simple API.
footer: MIT Licensed | Copyright © 2019-present Luthfi Masruri & VueUpQuill Contributors
---

<div class="border-t border-gray-200 py-12">
  <header class="text-center mb-4">
    <h2 class="mb-2 font-semibold text-3xl border-none">VueUpQuill <br>Interactive Demo</h2>
    <p class="mx-auto max-w-lg">
      What you see is what you get. Check out our interactive product demos and discover all the features packed into TinyMCE.
    </p>
  </header>
  <!-- <ClientOnly> -->
    <DemoEditor></DemoEditor>
  <!-- </ClientOnly> -->
</div>

<div class="frontpage sponsors">
  <h2>Sponsors</h2>
  <a v-for="{ href, src, name } of sponsors" :href="href" target="_blank" rel="noopener" aria-label="sponsor-img">
    <img :src="src" :alt="name">
  </a>
  <br>
  <a href="https://paypal.me/bledex" target="_blank" rel="noopener">Buy me a cup of coffee</a>
</div>


<script setup>
import DemoEditor from './examples/DemoEditor.vue'
import sponsors from './.vitepress/theme/sponsors.json'
</script>


