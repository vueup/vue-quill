# Installation

::: tip TIP
This guide assumes intermediate-level knowledge of Vue 3. If you are totally new to Vue 3, grasp the [Basics of Vue 3](https://v3.vuejs.org/guide/introduction.html) first and then come back, but is not required.
:::

## CDN

VueQuill ships as a UMD module that is accessible in the browser. When loaded in the browser, you can access the component through the `VueQuill.QuillEditor` global variable. You'll need to load Vue.js, VueQuill JS & VueQuill CSS theme.

<div class="replaceable-area">

```html
<!-- include VueJS first -->
<script src="https://unpkg.com/vue@next"></script>

<!-- use the latest VueQuill release -->
<script src="https://unpkg.com/@vueup/vue-quill@latest"></script>
<link rel="stylesheet" href="https://unpkg.com/@vueup/vue-quill@latest/dist/vue-quill.snow.prod.css">

<!-- or point to a specific VueQuill release -->
<script src="https://unpkg.com/@vueup/vue-quill@version"></script>
<link rel="stylesheet" href="https://unpkg.com/@vueup/vue-quill@version/dist/vue-quill.snow.prod.css">
```

::: warning 
For production, we recommend linking to a specific version number and build to avoid unexpected breakage from newer versions.
:::

## NPM / Yarn

Use the package manager [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) to install VueQuill.

```bash
npm install @vueup/vue-quill@latest --save
# OR
yarn add @vueup/vue-quill@latest
```

</div>

npm or yarn is the recommended installation method when you are using [Single File Component](usage.md#in-single-file-component), and then you can register the [Component](usage.md#in-single-file-component) in your app.

<!-- TextReplacer used to replace text after component mounted -->
<ClientOnly>
  <TextReplacer 
    container=".replaceable-area"
    pattern="@latest" 
    prefix="@"
    :replacement="latestRelease"
  ></TextReplacer>
  <TextReplacer 
    container=".replaceable-area"
    pattern="@version"
    prefix="@"
    :replacement="latestReleaseVersion"
  ></TextReplacer>
</ClientOnly>

<script setup>
  import { onMounted, ref } from 'vue'
  import TextReplacer from '../../components/TextReplacer.vue'
  import { getLatestRelease, getLatestReleaseVersion } from '../../utils/github-api.ts'

  const latestRelease = ref('')
  const latestReleaseVersion = ref('')
  onMounted(async () => {
    latestRelease.value = await getLatestRelease('vueup', 'vue-quill').then(data => data)
    latestReleaseVersion.value = await getLatestReleaseVersion('vueup', 'vue-quill').then(data => data)
  })
</script>