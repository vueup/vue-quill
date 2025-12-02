import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import '@vueup/vue-quill/dist/vue-quill.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/HomeView.vue')
    },
    {
      path: '/content-types',
      name: 'content-types',
      component: () => import('./views/ContentTypesView.vue')
    },
    {
      path: '/modules',
      name: 'modules',
      component: () => import('./views/ModulesView.vue')
    },
    {
      path: '/form',
      name: 'form',
      component: () => import('./views/FormView.vue')
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
