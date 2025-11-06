import type { RouteRecordRaw } from 'vue-router'

/**
 * 前台路由配置
 */
export const frontRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/FrontLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/front/Home.vue'),
        meta: {
          title: '首页',
        },
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/front/About.vue'),
        meta: {
          title: '关于我们',
        },
      },
      {
        path: 'review/:id',
        name: 'ReviewDetail',
        component: () => import('@/views/front/ReviewDetail.vue'),
        meta: {
          title: '评审详情',
        },
      },
    ],
  },
]
