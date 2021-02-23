import { createApp } from 'vue'
import App from './demo/App.vue'
import VueQuill from './plugin'

createApp(App)
  .use(VueQuill)
  .mount('#app')
