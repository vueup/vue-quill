### Install

**NPM**

``` bash
npm install @vueup/quill --save

# or
yarn add @vueup/quill
```

### Mount

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

### Component

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

### Quill
[Quill API document](https://quilljs.com/docs/quickstart/)
