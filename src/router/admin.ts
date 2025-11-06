import type { RouteRecordRaw } from 'vue-router'

/**
 * 后台路由配置
 */
export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/admin/dashboard',
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: {
          title: '仪表盘',
          requiresAuth: true,
        },
      },
      // 评审管理
      {
        path: 'review/list',
        name: 'ReviewList',
        component: () => import('@/views/admin/review/List.vue'),
        meta: {
          title: '评审列表',
          requiresAuth: true,
        },
      },
      {
        path: 'review/create',
        name: 'ReviewCreate',
        component: () => import('@/views/admin/review/Create.vue'),
        meta: {
          title: '创建评审',
          requiresAuth: true,
        },
      },
      {
        path: 'review/edit/:id',
        name: 'ReviewEdit',
        component: () => import('@/views/admin/review/Edit.vue'),
        meta: {
          title: '编辑评审',
          requiresAuth: true,
        },
      },
      // 用户管理
      {
        path: 'user/list',
        name: 'UserList',
        component: () => import('@/views/admin/user/List.vue'),
        meta: {
          title: '用户列表',
          requiresAuth: true,
        },
      },
      // 系统设置
      {
        path: 'settings/basic',
        name: 'SettingsBasic',
        component: () => import('@/views/admin/settings/Basic.vue'),
        meta: {
          title: '基础设置',
          requiresAuth: true,
        },
      },
    ],
  },
]
