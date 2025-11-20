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
      // 仪表盘
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: {
          title: '仪表盘',
          requiresAuth: true,
        },
      },

      // 个人中心
      {
        path: 'profile',
        name: 'AdminProfile',
        component: () => import('@/views/admin/Profile.vue'),
        meta: {
          title: '个人中心',
          requiresAuth: true,
        },
      },

      // 参赛者管理
      {
        path: 'participant/list',
        name: 'ParticipantList',
        component: () => import('@/views/admin/participant/List.vue'),
        meta: {
          title: '报名列表',
          requiresAuth: true,
        },
      },
      {
        path: 'participant/audit',
        name: 'ParticipantAudit',
        component: () => import('@/views/admin/participant/Audit.vue'),
        meta: {
          title: '报名审核',
          requiresAuth: true,
        },
      },

      // 活动管理
      {
        path: 'activity/list',
        name: 'ActivityList',
        component: () => import('@/views/admin/activity/List.vue'),
        meta: {
          title: '活动列表',
          requiresAuth: true,
        },
      },
      {
        path: 'activity/create',
        name: 'ActivityCreate',
        component: () => import('@/views/admin/activity/Edit.vue'),
        meta: {
          title: '新增活动',
          requiresAuth: true,
        },
      },
      {
        path: 'activity/edit/:id',
        name: 'ActivityEdit',
        component: () => import('@/views/admin/activity/Edit.vue'),
        meta: {
          title: '编辑活动',
          requiresAuth: true,
        },
      },
      {
        path: 'activity/type',
        name: 'ActivityType',
        component: () => import('@/views/admin/activity/Type.vue'),
        meta: {
          title: '类型管理',
          requiresAuth: true,
        },
      },
      {
        path: 'activity/template',
        name: 'ActivityTemplate',
        component: () => import('@/views/admin/activity/Template.vue'),
        meta: {
          title: '模板管理',
          requiresAuth: true,
        },
      },

      // 评审管理
      {
        path: 'review/rule',
        name: 'ReviewRule',
        component: () => import('@/views/admin/review/Rule.vue'),
        meta: {
          title: '评审规则',
          requiresAuth: true,
        },
      },
      {
        path: 'review/expert',
        name: 'ReviewExpert',
        component: () => import('@/views/admin/review/Expert.vue'),
        meta: {
          title: '专家管理',
          requiresAuth: true,
        },
      },
      {
        path: 'review/task',
        name: 'ReviewTask',
        component: () => import('@/views/admin/review/Task.vue'),
        meta: {
          title: '评审任务',
          requiresAuth: true,
        },
      },
      {
        path: 'review/my',
        name: 'ReviewMy',
        component: () => import('@/views/admin/review/My.vue'),
        meta: {
          title: '我的评审',
          requiresAuth: true,
        },
      },
      {
        path: 'review/reaudit',
        name: 'ReviewReaudit',
        component: () => import('@/views/admin/review/Reaudit.vue'),
        meta: {
          title: '复审管理',
          requiresAuth: true,
        },
      },
      {
        path: 'review/progress',
        name: 'ReviewProgress',
        component: () => import('@/views/admin/review/Progress.vue'),
        meta: {
          title: '评审进度',
          requiresAuth: true,
        },
      },

      // 数据管理
      {
        path: 'data/statistics',
        name: 'DataStatistics',
        component: () => import('@/views/admin/data/Statistics.vue'),
        meta: {
          title: '数据统计',
          requiresAuth: true,
        },
      },
      {
        path: 'data/report',
        name: 'DataReport',
        component: () => import('@/views/admin/data/Report.vue'),
        meta: {
          title: '报表中心',
          requiresAuth: true,
        },
      },
      {
        path: 'data/log',
        name: 'DataLog',
        component: () => import('@/views/admin/data/Log.vue'),
        meta: {
          title: '日志管理',
          requiresAuth: true,
        },
      },

      // 消息中心
      {
        path: 'message/notification',
        name: 'MessageNotification',
        component: () => import('@/views/admin/message/Notification.vue'),
        meta: {
          title: '系统通知',
          requiresAuth: true,
        },
      },
      {
        path: 'message/template',
        name: 'MessageTemplate',
        component: () => import('@/views/admin/message/Template.vue'),
        meta: {
          title: '消息模板',
          requiresAuth: true,
        },
      },
      {
        path: 'message/log',
        name: 'MessageLog',
        component: () => import('@/views/admin/message/Log.vue'),
        meta: {
          title: '通知日志',
          requiresAuth: true,
        },
      },
      {
        path: 'message/my',
        name: 'MessageMy',
        component: () => import('@/views/admin/message/My.vue'),
        meta: {
          title: '我的消息',
          requiresAuth: true,
        },
      },

      // 系统管理
      {
        path: 'system/organization',
        name: 'SystemOrganization',
        component: () => import('@/views/admin/system/org/List.vue'),
        meta: {
          title: '组织管理',
          requiresAuth: true,
        },
      },
      {
        path: 'system/department',
        name: 'SystemDepartment',
        component: () => import('@/views/admin/system/dept/index.vue'),
        meta: {
          title: '部门管理',
          requiresAuth: true,
        },
      },
      {
        path: 'system/user',
        name: 'SystemUser',
        component: () => import('@/views/admin/user/List.vue'),
        meta: {
          title: '用户管理',
          requiresAuth: true,
        },
      },
      {
        path: 'system/user/create',
        name: 'SystemUserCreate',
        component: () => import('@/views/admin/user/Edit.vue'),
        meta: {
          title: '新增用户',
          requiresAuth: true,
        },
      },
      {
        path: 'system/user/edit/:id',
        name: 'SystemUserEdit',
        component: () => import('@/views/admin/user/Edit.vue'),
        meta: {
          title: '编辑用户',
          requiresAuth: true,
        },
      },
      {
        path: 'system/role',
        name: 'SystemRole',
        component: () => import('@/views/admin/system/role/List.vue'),
        meta: {
          title: '角色管理',
          requiresAuth: true,
        },
      },
      {
        path: 'system/permission',
        name: 'SystemPermission',
        component: () => import('@/views/admin/system/Permission.vue'),
        meta: {
          title: '权限管理',
          requiresAuth: true,
        },
      },
      {
        path: 'system/menu',
        name: 'SystemMenu',
        component: () => import('@/views/admin/system/Menu.vue'),
        meta: {
          title: '菜单管理',
          requiresAuth: true,
        },
      },

      // 系统设置
      {
        path: 'settings/basic',
        name: 'SettingsBasic',
        component: () => import('@/views/admin/settings/Basic.vue'),
        meta: {
          title: '基础配置',
          requiresAuth: true,
        },
      },
      {
        path: 'settings/dict',
        name: 'SettingsDict',
        component: () => import('@/views/admin/settings/Dict.vue'),
        meta: {
          title: '字典管理',
          requiresAuth: true,
        },
      },
    ],
  },
]
