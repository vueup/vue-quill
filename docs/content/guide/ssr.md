# Server-Side Rendering

VueQuill can be imported and rendered in Vue SSR applications. During server
rendering, `QuillEditor` outputs a stable placeholder element and does not load
the Quill browser runtime. The real Quill editor is created in the browser after
Vue mounts the component.

```vue
<script setup>
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const content = ref('<p>Hydrated in the browser.</p>')
</script>

<template>
  <QuillEditor
    v-model:content="content"
    content-type="html"
    theme="snow"
    toolbar="minimal"
  />
</template>
```

## Direct Quill API Access

The `Quill` runtime depends on browser APIs such as `document`. If you need to
call direct Quill APIs in an SSR app, do it from a browser-only lifecycle hook.

```vue
<script setup>
import { onMounted } from 'vue'
import { loadQuill } from '@vueup/vue-quill'

onMounted(async () => {
  const Quill = await loadQuill()
  Quill.register('modules/example', ExampleModule)
})
</script>
```

For complete examples, see `examples/vite-app` for the Vite SPA and SSR setup,
and `examples/nuxt-app` for Nuxt universal, client-only, prerendered, SWR, and
ISR routes.
