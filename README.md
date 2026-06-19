<p align="center">
  <a href="https://vueup.github.io/vue-quill/" target="_blank" rel="noopener noreferrer">
    <img height="120" src="https://vueup.github.io/vue-quill/quill.svg" alt="Vue + Quill logo">
  </a>
</p>
<h1 align="center">VueQuill</h1>
<h3 align="center">
  Rich Text Editor Component for Vue 3.
</h3>
<p align="center">
  <a href="https://www.npmjs.com/package/@vueup/vue-quill" title="Version" target="_blank" rel="noopener noreferrer">
    <img alt="npm (tag)" src="https://img.shields.io/npm/v/@vueup/vue-quill">
  </a>
  <a href="https://www.npmjs.com/package/@vueup/vue-quill" title="License" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/npm/l/@vueup/vue-quill" alt="License">
  </a>
  <a href="https://github.com/vueup/vue-quill/actions" title="Checks" target="_blank" rel="noopener noreferrer">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/vueup/vue-quill/release-vue-quill.yml?branch=master&logo=github">
  </a>
  <a href="https://github.com/vueup/vue-quill" title="Last commit" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/github/last-commit/vueup/vue-quill?logo=github" alt="Last commit">
  </a>
  <a href="https://github.com/vueup/vue-quill" title="Github Repo Stars" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/github/stars/vueup/vue-quill?style=social" alt="Github Repo Stars">
  </a>
</p>
<p align="center">
  <a href="https://vueup.github.io/vue-quill/#demo" title="VueQuill Demo" target="_blank" rel="noopener noreferrer">
    <img src="https://user-images.githubusercontent.com/6185447/111898684-33761b00-8a5a-11eb-9458-372c0185f576.png" alt="VueQuill Editor">
  </a>
  <br>
  <a href="https://vueup.github.io/vue-quill/#demo" title="Live Demo" target="_blank" rel="noopener noreferrer">👀 See a Live Demo</a>
</p>

## 🔎 Overview

**VueQuill** is a Vue 3 component for building rich text editors with [Quill](https://quilljs.com/).

- 💚 **Built With Vue 3:** More powerful and performant framework than ever before.
- 🧙‍♂️ **Fully TypeScript:** VueQuill source code is written entirely in TypeScript.
- 🛠️ **Easy To Use:** Straightforward implementation through a simple API.
- 📦 **Quill 2 Ready:** Includes Quill 2 as a dependency and exposes the underlying Quill instance when you need it.
- 🖥️ **SSR Friendly:** Can be imported in Vue SSR applications and initializes Quill in the browser.

## 🚀 Quick Start

Install VueQuill with your package manager:

```bash
npm install @vueup/vue-quill@latest
# or
yarn add @vueup/vue-quill@latest
# or
pnpm add @vueup/vue-quill@latest
```

Use the component in a Vue single-file component and import the theme stylesheet you want:

```vue
<script setup>
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const content = ref('<p>Hello VueQuill!</p>')
</script>

<template>
  <QuillEditor
    v-model:content="content"
    content-type="html"
    theme="snow"
    toolbar="minimal"
  />
</template>
```

That is enough for a basic editor. Remember to import a theme stylesheet (`snow` or `bubble`) and set `content-type` when binding HTML or plain text content.

## 📚 Documentation

- **[📘 Guide](https://vueup.github.io/vue-quill/guide/)**
  - [🚀 Introduction](https://vueup.github.io/vue-quill/guide/)
  - [⚙️ Installation](https://vueup.github.io/vue-quill/guide/installation.html)
  - [💡 Usage](https://vueup.github.io/vue-quill/guide/usage.html)
  - [🎨 Themes](https://vueup.github.io/vue-quill/guide/themes.html)
  - [🚥 Toolbar](https://vueup.github.io/vue-quill/guide/toolbar.html)
  - [📦 Modules](https://vueup.github.io/vue-quill/guide/modules.html)
  - [🛠️ Options](https://vueup.github.io/vue-quill/guide/options.html)
  - [🖥️ Server-Side Rendering](https://vueup.github.io/vue-quill/guide/ssr.html)
- **[🧰 APIs](https://vueup.github.io/vue-quill/api/)**
  - [📌 Props](https://vueup.github.io/vue-quill/api/)
  - [⚡ Events](https://vueup.github.io/vue-quill/api/events.html)
  - [📢 Methods](https://vueup.github.io/vue-quill/api/methods.html)
  - [🔌 Slots](https://vueup.github.io/vue-quill/api/slots.html)
  - [↗️ Export](https://vueup.github.io/vue-quill/api/export.html)

## 👏 Contributing

Pull requests are welcome. For major changes, please create a [new discussion](https://github.com/vueup/vue-quill/discussions) first about what you would like to change.

## 📝 License

[MIT](https://choosealicense.com/licenses/mit/)
