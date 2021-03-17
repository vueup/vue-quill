# Installation

::: tip TIP
This guide assumes intermediate level knowledge of Vue 3. If you are totally new to Vue 3, grasp the [Basics of Vue 3](https://v3.vuejs.org/guide/introduction.html) first and then come back, but is not required.
:::

## CDN

VueUpQuill ships as an UMD module that is accessible in the browser. When loaded in the browser, you can access the component through the `VueUpQuill.QuillEditor` global variable. You'll need to load Vue.js, VueUpQuill JS & VueUpQuill CSS theme.

```html
<!-- include VueJS first -->
<script src="https://unpkg.com/vue@latest"></script>

<!-- use the latest VueUpQuill release -->
<script src="https://unpkg.com/@vueup/quill@latest"></script>
<link rel="stylesheet" href="https://unpkg.com/@vueup/quill@latest/dist/quill.snow.css">

<!-- or point to a specific VueUpQuill release -->
<script src="https://unpkg.com/@vueup/quill@0.1.2"></script>
<link rel="stylesheet" href="https://unpkg.com/@vueup/quill@0.1.2/dist/quill.snow.css">
```

::: warning 
For production, we recommend linking to a specific version number and build to avoid unexpected breakage from newer versions.
:::

## NPM / Yarn

Use the package manager [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) to install VueUpQuill.

```bash
npm install @vueup/quill --save
# OR
yarn add @vueup/quill
```

npm or yarn is the recommended installation method when you are using [Single File Component](usage.md#in-single-file-component), and there are two way to implement `VueUpQuill`, you can use it as a [Plugin](usage.md#use-as-a-plugin) or [Component](usage.md#use-as-a-component)
