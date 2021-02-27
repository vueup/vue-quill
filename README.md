# VueUpQuill

A Quill Editor for Vue 3 plugin or component.

![npm (scoped)](https://img.shields.io/npm/v/@vueup/quill?color=blue) 
![npm](https://img.shields.io/npm/dw/@vueup/quill)
![NPM](https://img.shields.io/npm/l/@vueup/quill?color=orange)
![GitHub branch checks state](https://img.shields.io/github/checks-status/vueup/vueup-quill/master?logo=github)
![GitHub commit activity](https://img.shields.io/github/commit-activity/y/vueup/vueup-quill?logo=github)
![GitHub last commit](https://img.shields.io/github/last-commit/vueup/vueup-quill?logo=github)

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

const app = createApp()
app.use(VueUpQuill, /* { default global options } */)

```

**Mount with local component**

```javascript
import { QuillEditor } from '@vueup/quill'

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
  <quill-editor
    ref="myQuillEditor"
    v-model:content="content"
    :options="editorOption"
    @blur="onEditorBlur($event)"
    @focus="onEditorFocus($event)"
    @ready="onEditorReady($event)"
  />

  <!-- Or manually control the data synchronization -->
  <quill-editor
    v-model:content="content"
    :options="editorOption"
    @editorChange="onEditorChange($event)"
  />
</template>
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Quill
[Quill API document](https://quilljs.com/docs/quickstart/)

## License
[MIT](https://choosealicense.com/licenses/mit/)
