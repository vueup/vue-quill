import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/modules',
      name: 'modules',
      component: () => import('../views/ModulesView.vue'),
    },
    {
      path: '/content-types',
      name: 'content-types',
      component: () => import('../views/ContentTypesView.vue'),
    },
    {
      path: '/form',
      name: 'form',
      component: () => import('../views/FormView.vue'),
    },
  ],
})

export default router
