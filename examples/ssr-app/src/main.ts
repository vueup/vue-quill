import { createSSRApp } from 'vue'
import App from './App.vue'

export const createApp = () => {
  return createSSRApp(App)
}
