# Usage

### Mount with global

``` javascript
import { createApp } from 'vue'
import VueUpQuill from '@vueup/quill'
import '@vueup/quill/dist/quill.snow.css';

const app = createApp()
app.use(VueUpQuill, /* { default global options } */)
```

### Mount with local component

``` javascript
import { QuillEditor } from '@vueup/quill'
import '@vueup/quill/dist/quill.snow.css';

export default {
  components: {
    QuillEditor
  }
}
```

### SFC Implementation

``` vue
<template>
  <!-- Two-way Data-Binding -->
  <QuillEditor
    theme="snow"
    toolbar="essential"
  />
</template>
```