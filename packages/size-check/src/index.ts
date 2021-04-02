import { h, createApp } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'

// The bare minimum code required for rendering something to the screen
const app = createApp({
  render: () => h('div', 'hello world!'),
})
app.component('Editor', QuillEditor)
app.mount('#app')
