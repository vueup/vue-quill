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

The `use()` method takes two parameters. The first one is the plugin to be installed, in this case `VueUpQuill`. The second parameter is optional, in this case [Quill Options](options.md).

``` js
import { createApp } from 'vue'
import VueUpQuill from '@vueup/quill'
import '@vueup/quill/dist/quill.snow.css';

const app = createApp()
app.use(VueUpQuill, /* { default global options } */)
```
::: tip NOTE
When you are using it as a plugin, it is the same with register it as a global component with Default Options for all your component instance
:::

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

::: tip NOTE
The component itself does not include any CSS theme. You'll need to include it separately:
`import '@vueup/quill/dist/quill.snow.css'` or `import '@vueup/quill/dist/quill.bubble.css'`
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

Then register the component in your javascript:
```js
Vue.component('QuillEditor', VueUpQuill.QuillEditor);
```

or, use it as a plugin:

```js
Vue.use(VueUpQuill.default, /* { default global options } */);
```