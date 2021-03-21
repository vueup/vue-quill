---
home: true
heroImage: /quill.svg
actionText: Get Started
actionLink: /guide/

altActionText: ⭐ Github
altActionLink: https://github.com/vueup/vue-quill

features:
  - title: 💚 Built With Vue 3
    details: More powerful and performant framework than ever before.
  - title: 🧙‍♂️ Fully Typescript
    details: VueQuill source code is written entirely in TypeScript.
  - title: 🛠️ Easy To Use
    details: Straightforward implementation through a simple API.
footer: MIT Licensed | Copyright © 2020-present Luthfi Masruri & VueQuill Contributors
---

<div class="border-t border-gray-200 block py-4">
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

<div class="frontpage sponsors">
  <h2>Sponsors</h2>
  <a v-for="{ href, src, name } of sponsors" :href="href" target="_blank" rel="noopener" aria-label="sponsor-img">
    <img :src="$withBase(src)" :alt="name">
  </a>
  <br>
  <a href="https://paypal.me/bledex" target="_blank" rel="noopener">Buy me a cup of coffee</a>
</div>

<script setup>
import DemoEditor from '../components/demo/DemoEditor.vue'
import sponsors from './.vitepress/theme/sponsors.json'
</script>


