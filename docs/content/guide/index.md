# Introduction

<div class="replaceable-area">

::: warning
🚀 **VueQuill** is in **@alpha** version! Currently the focus is on making VueQuill stable and feature complete first. It is not recommended to use this for anything serious yet. Some of its features are not "finalized" and will have breaking changes over time as we discover better solutions.
:::

</div>

## What is VueQuill

**VueQuill** is a **Vue Component** for building rich text editors, this package is a thin wrapper around Quill to make it easier to use in a Vue 3 application.

## What is Quill

**Quill** is a modern rich text editor built for compatibility and extensibility. It was created by Jason Chen and Byron Milligan and actively maintained by [Slab](https://slab.com/).

You can learn more about the rationale behind the project in the [Why Quill](https://quilljs.com/guides/why-quill/) guides.

## Browser Support

Cross-platform support is important to many Javascript libraries, but the criteria for what this means often differ. For Quill, the bar is not just that it runs or works, it has to run or work the same way. Not only is functionality a cross-platform consideration, but the user and developer experience are as well. If some content produces a particular markup in Chrome on OSX, it will produce the same markup on IE. If hitting enter preserves bold format state in Firefox on Windows, it will be preserved on mobile Safari.

Quill supports all modern browsers on desktops, tablets, and phones. Experience the same consistent behavior and produced HTML across platforms. [See the chart](https://github.com/quilljs/quill/#readme) for more details.

## Community

If you have questions or need help, reach out to the community at [GitHub Discussions](https://github.com/vueup/vue-quill/discussions).

<!-- TextReplacer used to replace text after component mounted -->
<ClientOnly>
  <TextReplacer 
    container=".replaceable-area"
    pattern="@alpha" 
    :replacement="latestRelease"
  ></TextReplacer>
</ClientOnly>

<script setup>
  import { onMounted, ref } from 'vue'
  import TextReplacer from '../../components/TextReplacer.vue'
  import { getLatestRelease } from '../../utils/github-api.ts'

  const latestRelease = ref('')
  onMounted(async () => {
    latestRelease.value = await getLatestRelease('vueup', 'vue-quill').then(data => data)
  })
</script>
