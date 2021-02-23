import { createApp } from 'vue'
import App from './demo/App.vue'
import QuillEditor from './plugin'

createApp(App)
  .use(QuillEditor)
  .mount('#app')
