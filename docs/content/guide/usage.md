# Usage

## In The Browser

Register the component in your javascript:
```js
Vue.component('QuillEditor', VueUpQuill.QuillEditor);
```

or, use it as a plugin:

```js
Vue.use(VueUpQuill.default, /* { default global options } */);
```

Basic Usage:

``` html
<div id="app">
  <quill-editor theme="snow"></quill-editor>
</div>
```
::: tip INFO
We're showing you a simple example here, but in a typical Vue application we use Single File Components instead of a string template. You can find **SFC implementation** in [this section](usage.md#in-single-file-component).
:::

## In Single File Component

### Use as a Plugin
After a Vue app has been initialized with `createApp()`, you can add a `VueUpQuill` to your application by calling the `use()` method. The `use()` method takes two parameters. The first one is the plugin to be installed, in this case `VueUpQuill`. The second parameter is optional, in this case [Quill Options](options.md).

``` js
import { createApp } from 'vue'
import VueUpQuill from '@vueup/quill'
import '@vueup/quill/dist/quill.snow.css';

const app = createApp()
app.use(VueUpQuill, /* { default global options } */)
```

::: tip NOTE
When you are using it as a plugin, it is the same with register `QuillEditor` component globally with Default Options for all your component instance
:::

### Use as a Component

Alternatively it is possible to register the component directly, globallly or locally:

**Global Registration:**

``` javascript
import { createApp } from 'vue'
import { QuillEditor } from '@vueup/quill'
import '@vueup/quill/dist/quill.snow.css';

const app = createApp()
app.component('QuillEditor', QuillEditor)
```

**or Local Registration:**

``` javascript
import { QuillEditor } from '@vueup/quill'
import '@vueup/quill/dist/quill.snow.css';

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
`import '@vueup/quill/dist/quill.snow.css'` or `import '@vueup/quill/dist/quill.bubble.css'`
:::

