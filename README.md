# VueUpQuill

A Quill Editor for Vue 3 plugin or component.

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

### Quill
[Quill API document](https://quilljs.com/docs/quickstart/)

## License
[MIT](https://choosealicense.com/licenses/mit/)
