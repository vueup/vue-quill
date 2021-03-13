# Installation

::: tip TIP
This guide assumes intermediate level knowledge of Vue 3. If you are totally new to Vue 3, grasp the [Basics of Vue 3](https://v3.vuejs.org/guide/introduction.html) first and then come back, but is not required.
:::

## NPM / Yarn

Use the package manager [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) to install VueUpQuill.

```bash
npm install @vueup/quill --save
# OR
yarn add @vueup/quill
```
Then, there are two way to implement `VueUpQuill`, you can use it as a [Plugin](installation.md#use-as-a-plugin) or [Component](installation.md#use-as-a-component)

### Use as a Plugin

After a Vue app has been initialized with `createApp()`, you can add a plugin to your application by calling the `use()` method.

The `use()` method takes two parameters. The first one is the plugin to be installed, in this case `VueUpQuill`. The second parameter is optional, in the case [Quill Options](options.md).

``` js
import { createApp } from 'vue'
import VueUpQuill from '@vueup/quill'
import '@vueup/quill/dist/quill.snow.css';

const app = createApp()
app.use(VueUpQuill, /* { default global options } */)
```

When you are using it as a plugin, it is the same with register it as a global component with Default Options for all your component instance

### Use as a Component

**Global Registration**

``` javascript
import { createApp } from 'vue'
import { QuillEditor } from '@vueup/quill'
import '@vueup/quill/dist/quill.snow.css';

const app = createApp()
app.component('QuillEditor', QuillEditor)
```

**Local Registration**

``` javascript
import { QuillEditor } from '@vueup/quill'
import '@vueup/quill/dist/quill.snow.css';

export default {
  components: {
    QuillEditor
  }
}
```

::: warning NOTE
The component itself does not include any CSS theme. You'll need to include it separately:
`import '@vueup/quill/dist/quill.snow.css'` or `import '@vueup/quill/dist/quill.bubble.css'`
:::

## CDN