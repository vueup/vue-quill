# Usage

## In The Browser

Register the component in your javascript:

```js
Vue.component('QuillEditor', VueQuill.QuillEditor);
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

``` javascript
import { createApp } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const app = createApp()
app.component('QuillEditor', QuillEditor)
```

**or Local Registration:**

``` javascript
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
  components: {
    QuillEditor
  }
}
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
