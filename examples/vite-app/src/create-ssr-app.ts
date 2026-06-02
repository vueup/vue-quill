import { createSSRApp } from 'vue'
import App from './App.vue'

export const createSsrApp = () => createSSRApp(App)
