# Usage

## In The Browser

Register the component with a Vue 3 app instance:

```js
const app = Vue.createApp({})
app.component('QuillEditor', VueQuill.QuillEditor)
app.mount('#app')
```

Basic Usage:

``` html
<div id="app">
  <quill-editor theme="snow"></quill-editor>
</div>
```
::: tip INFO
We're showing you a simple example here, but in a typical Vue application, we use Single File Components instead of a string template. You can find **SFC implementation** in [this section](usage.md#in-single-file-component).
:::

## In Single File Component

**Global Registration:**

```javascript
import { createApp } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import App from './App.vue'

const app = createApp(App)
app.component('QuillEditor', QuillEditor)
app.mount('#app')
```

**or Local Registration:**

```vue
<script>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default {
  components: {
    QuillEditor
  }
}
</script>
```

**Basic Usage:**

``` vue
<template>
  <QuillEditor theme="snow" />
</template>
```

::: tip NOTE
The component itself does not include any CSS theme. You'll need to include it separately:
`import '@vueup/vue-quill/dist/vue-quill.snow.css'` or `import '@vueup/vue-quill/dist/vue-quill.bubble.css'`
:::
