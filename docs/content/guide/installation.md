# Installation

::: tip TIP
This guide assumes intermediate-level knowledge of Vue 3. If you are totally new to Vue 3, grasp the [Basics of Vue 3](https://v3.vuejs.org/guide/introduction.html) first and then come back, but is not required.
:::

## CDN

VueQuill ships as a UMD module that is accessible in the browser. When loaded in the browser, you can access the component through the `VueQuill.QuillEditor` global variable. You'll need to load Vue.js, VueQuill JS & VueQuill CSS theme.

<div id="cdn-install">

  ```html
  <!-- include VueJS first -->
  <script src="https://unpkg.com/vue@latest"></script>

  <!-- use the latest VueQuill release -->
  <script src="https://unpkg.com/@vueup/vue-quill@latest"></script>
  <link rel="stylesheet" href="https://unpkg.com/@vueup/vue-quill@latest/dist/vue-quill.snow.css">

  <!-- or point to a specific VueQuill release -->
  <script src="https://unpkg.com/@vueup/vue-quill@$latestVersion"></script>
  <link rel="stylesheet" href="https://unpkg.com/@vueup/vue-quill@$latestVersion/dist/vue-quill.snow.css">
  ```
</div>

  ::: warning 
  For production, we recommend linking to a specific version number and build to avoid unexpected breakage from newer versions.
  :::

## NPM / Yarn

Use the package manager [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) to install VueQuill.

```bash
npm install @vueup/vue-quill --save
# OR
yarn add @vueup/vue-quill
```

npm or yarn is the recommended installation method when you are using [Single File Component](usage.md#in-single-file-component), and then you can register the [Component](usage.md#in-single-file-component) in your app.

<!-- GithubVersionSetter used to replace target with the latest github-release tag name -->
<ClientOnly>
  <GithubVersionSetter 
    container="#cdn-install" 
    target="$latestVersion" 
    owner="vueup" 
    repo="vue-quill"
  ></GithubVersionSetter>
</ClientOnly>

<script setup>
  import GithubVersionSetter from '../../components/GithubVersionSetter.vue'
</script>