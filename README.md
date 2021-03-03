# VueUpQuill

A Quill Editor for Vue 3 plugin or component.
<p>
  <a href="https://www.npmjs.com/package/@vueup/quill" title="Version">
    <img src="https://img.shields.io/npm/v/@vueup/quill?color=blue" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/@vueup/quill" title="Total downloads">
    <img src="https://img.shields.io/npm/dt/@vueup/quill" alt="Total downloads">
  </a>
  <a href="https://www.npmjs.com/package/@vueup/quill" title="License">
    <img src="https://img.shields.io/npm/l/@vueup/quill?color=orange" alt="License">
  </a>
  <a href="https://github.com/vueup/vueup-quill" title="Checks">
    <img src="https://img.shields.io/github/checks-status/vueup/vueup-quill/master?logo=github" alt="Checks">
  </a>
  <a href="https://github.com/vueup/vueup-quill" title="Last commit">
    <img src="https://img.shields.io/github/last-commit/vueup/vueup-quill?logo=github" alt="Last commit">
  </a>
 </p>

## Installation

Use the package manager [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) to install VueUpQuill.

``` bash
npm install @vueup/quill --save
# OR
yarn add @vueup/quill
```

## Usage

**Mount with global**

``` javascript
import { createApp } from 'vue'
import VueUpQuill from '@vueup/quill'
import '@vueup/quill/dist/quill.snow.css';

const app = createApp()
app.use(VueUpQuill, /* { default global options } */)

```

**Mount with local component**

``` javascript
import { QuillEditor } from '@vueup/quill'
import '@vueup/quill/dist/quill.snow.css';

export default {
  components: {
    QuillEditor
  }
}

```

**SFC Implementation**

``` vue
<template>
  <!-- Two-way Data-Binding -->
  <QuillEditor
    theme="snow"
    toolbar="default"
    v-model:content="content"
    :options="editorOption"
    @blur="onEditorBlur(quill)"
    @focus="onEditorFocus(quill)"
    @ready="onEditorReady(quill)"
    @textChange="onTextChange(...args)"
    @editorChange="onEditorChange(...args)"
    @selectionChange="onSelectionChange(...args)"
  />
</template>
```
### Themes
Quill features two offically supported themes: `snow` and `bubble` see [DEMO](https://vueup.github.io/vueup-quill/).
Themes primarily control the visual look of Quill through its CSS stylesheet, and many changes can easily be made by overriding these rules. At the very least, the `core` theme must be included for modules like toolbars or tooltips to work.

To activate a theme, import the stylesheet for the themes you want to use.
~~~ javascript
import '@vueup/quill/dist/quill.snow.css';
// OR | AND
import '@vueup/quill/dist/quill.bubble.css';
// you can use both themes at the same time and use them interchangeably
~~~

These stylesheets can be found in the Quill distribution, but for convenience they are also linked in VueUpQuill's `dist` folder.

Then, pass the name of the theme to the `theme` [prop](#props).

~~~ vue
<template>
  <QuillEditor theme="snow" .../>
  <!-- you can bind :theme="value" and it will automatically re render when its value change -->
  <QuillEditor :theme="value" .../>
  <button @click="value = 'snow'">Snow</button>
  <button @click="value = 'bubble'">Bubble</button>
</template>

<script>
  ...
</script>
~~~

### Toolbar


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Quill
[Quill API document](https://quilljs.com/docs/quickstart/)

## License
[MIT](https://choosealicense.com/licenses/mit/)
