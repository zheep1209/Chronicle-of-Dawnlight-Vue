import { createRouter, createWebHistory } from 'vue-router'
import HOME from "@/views/HOME.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HOME
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue')
    },{
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue')
    },
  ]
})

export default router
