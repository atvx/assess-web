import { createRouter, createWebHistory } from 'vue-router'
import { frontRoutes } from './front'
import { adminRoutes } from './admin'
import { setupRouterGuards } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...frontRoutes,
    ...adminRoutes,
    // 登录路由
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/Login.vue'),
      meta: {
        title: '登录',
      },
    },
    // 404 页面
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/error/NotFound.vue'),
      meta: {
        title: '页面未找到',
      },
    },
  ],
})

// 设置路由守卫
setupRouterGuards(router)

export default router
