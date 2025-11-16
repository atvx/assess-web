<template>
  <div class="admin-layout h-screen">
    <a-layout class="h-full">
      <!-- 侧边栏 -->
      <a-layout-sider v-model:collapsed="collapsed" collapsible theme="dark">
        <div class="logo p-4 text-center text-white font-bold text-lg">
          {{ collapsed ? '智审云' : '智审云' }}
        </div>
        <a-menu
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
          theme="dark"
          mode="inline"
          @click="handleMenuClick"
        >
          <!-- 仪表盘 -->
          <a-menu-item key="/admin/dashboard">
            <template #icon>
              <DashboardOutlined />
            </template>
            <span>仪表盘</span>
          </a-menu-item>

          <!-- 参赛者管理 -->
          <a-sub-menu key="sub-participant">
            <template #icon>
              <TeamOutlined />
            </template>
            <template #title>参赛者管理</template>
            <a-menu-item key="/admin/participant/list">报名列表</a-menu-item>
            <a-menu-item key="/admin/participant/audit">报名审核</a-menu-item>
          </a-sub-menu>

          <!-- 活动管理 -->
          <a-sub-menu key="sub-activity">
            <template #icon>
              <CalendarOutlined />
            </template>
            <template #title>活动管理</template>
            <a-menu-item key="/admin/activity/list">活动列表</a-menu-item>
            <a-menu-item key="/admin/activity/type">类型管理</a-menu-item>
            <a-menu-item key="/admin/activity/template">模板管理</a-menu-item>
          </a-sub-menu>

          <!-- 评审管理 -->
          <a-sub-menu key="sub-review">
            <template #icon>
              <CheckCircleOutlined />
            </template>
            <template #title>评审管理</template>
            <a-menu-item key="/admin/review/rule">评审规则</a-menu-item>
            <a-menu-item key="/admin/review/expert">专家管理</a-menu-item>
            <a-menu-item key="/admin/review/task">评审任务</a-menu-item>
            <a-menu-item key="/admin/review/my">我的评审</a-menu-item>
            <a-menu-item key="/admin/review/reaudit">复审管理</a-menu-item>
            <a-menu-item key="/admin/review/progress">评审进度</a-menu-item>
          </a-sub-menu>

          <!-- 数据管理 -->
          <a-sub-menu key="sub-data">
            <template #icon>
              <BarChartOutlined />
            </template>
            <template #title>数据管理</template>
            <a-menu-item key="/admin/data/statistics">数据统计</a-menu-item>
            <a-menu-item key="/admin/data/report">报表中心</a-menu-item>
            <a-menu-item key="/admin/data/log">日志管理</a-menu-item>
          </a-sub-menu>

          <!-- 消息中心 -->
          <a-sub-menu key="sub-message">
            <template #icon>
              <BellOutlined />
            </template>
            <template #title>消息中心</template>
            <a-menu-item key="/admin/message/notification">系统通知</a-menu-item>
            <a-menu-item key="/admin/message/template">消息模板</a-menu-item>
            <a-menu-item key="/admin/message/log">通知日志</a-menu-item>
            <a-menu-item key="/admin/message/my">我的消息</a-menu-item>
          </a-sub-menu>

          <!-- 系统管理 -->
          <a-sub-menu key="sub-system">
            <template #icon>
              <ApartmentOutlined />
            </template>
            <template #title>系统管理</template>
            <a-menu-item key="/admin/system/organization">组织管理</a-menu-item>
            <a-menu-item key="/admin/system/department">部门管理</a-menu-item>
            <a-menu-item key="/admin/system/user">用户管理</a-menu-item>
            <a-menu-item key="/admin/system/role">角色管理</a-menu-item>
            <a-menu-item key="/admin/system/permission">权限管理</a-menu-item>
            <a-menu-item key="/admin/system/menu">菜单管理</a-menu-item>
          </a-sub-menu>

          <!-- 系统设置 -->
          <a-sub-menu key="sub-settings">
            <template #icon>
              <SettingOutlined />
            </template>
            <template #title>系统设置</template>
            <a-menu-item key="/admin/settings/basic">基础配置</a-menu-item>
            <a-menu-item key="/admin/settings/dict">字典管理</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>

      <a-layout>
        <!-- 顶部栏 -->
        <a-layout-header class="!px-6 flex items-center justify-between !bg-white dark:!bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div class="text-gray-600 dark:text-gray-400">
            <a-breadcrumb>
              <a-breadcrumb-item>后台管理</a-breadcrumb-item>
              <a-breadcrumb-item>{{ currentPageTitle }}</a-breadcrumb-item>
            </a-breadcrumb>
          </div>

          <div class="flex items-center space-x-4">
            <!-- 主题切换 -->
            <ThemeToggle />

            <!-- 用户信息 -->
            <a-dropdown>
              <div class="flex items-center cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <a-avatar :style="{ backgroundColor: '#1890ff' }">
                  <template #icon>
                    <UserOutlined />
                  </template>
                </a-avatar>
                <span class="ml-2">{{ userStore.realName || userStore.username || '管理员' }}</span>
              </div>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="profile" @click="handleProfile">
                    <UserOutlined />
                    个人中心
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="logout" @click="handleLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </a-layout-header>

        <!-- 内容区 -->
        <a-layout-content class="m-6 p-6 rounded-lg overflow-auto !bg-white dark:!bg-gray-900 shadow">
          <router-view />
        </a-layout-content>

        <!-- 底部 -->
        <a-layout-footer class="text-center text-gray-500 dark:text-gray-400">
          智审云 &copy; 2025
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ApartmentOutlined,
  CalendarOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  BellOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const collapsed = ref(false)
const selectedKeys = ref<string[]>([route.path])
const openKeys = ref<string[]>([])

// 根据路由获取当前页面标题
const currentPageTitle = computed(() => {
  const path = route.path
  const titleMap: Record<string, string> = {
    // 仪表盘
    '/admin/dashboard': '仪表盘',
    '/admin/profile': '个人中心',

    // 活动管理
    '/admin/activity/list': '活动列表',
    '/admin/activity/type': '类型管理',
    '/admin/activity/template': '模板管理',
    '/admin/activity/create': '新增活动',

    // 参赛者管理
    '/admin/participant/list': '报名列表',
    '/admin/participant/audit': '报名审核',

    // 评审管理
    '/admin/review/rule': '评审规则',
    '/admin/review/expert': '专家管理',
    '/admin/review/task': '评审任务',
    '/admin/review/my': '我的评审',
    '/admin/review/reaudit': '复审管理',
    '/admin/review/progress': '评审进度',

    // 系统管理
    '/admin/system/organization': '组织管理',
    '/admin/system/department': '部门管理',
    '/admin/system/user': '用户管理',
    '/admin/system/role': '角色管理',
    '/admin/system/permission': '权限管理',
    '/admin/system/menu': '菜单管理',
    '/admin/system/user/create': '新增用户',

    // 数据管理
    '/admin/data/statistics': '数据统计',
    '/admin/data/report': '报表中心',
    '/admin/data/log': '日志管理',

    // 系统设置
    '/admin/settings/basic': '基础配置',
    '/admin/settings/dict': '字典管理',

    // 消息中心
    '/admin/message/notification': '系统通知',
    '/admin/message/template': '消息模板',
    '/admin/message/log': '通知日志',
    '/admin/message/my': '我的消息',
  }

  // 处理编辑页面
  if (path.startsWith('/admin/system/user/edit/')) {
    return '编辑用户'
  }
  if (path.startsWith('/admin/activity/edit/')) {
    return '编辑活动'
  }
  if (path.startsWith('/admin/participant/detail/')) {
    return '报名详情'
  }
  if (path.startsWith('/admin/review/task/detail/')) {
    return '任务详情'
  }

  return titleMap[path] || '后台首页'
})

// 菜单点击事件
const handleMenuClick = ({ key }: { key: string }) => {
  selectedKeys.value = [key]
  router.push(key)
}

// 个人中心
const handleProfile = () => {
  router.push('/admin/profile')
}

// 退出登录
const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* 使用 Tailwind 类，最小化自定义样式 */
.logo {
  transition: all 0.3s;
}

:deep(.ant-layout) {
  background: transparent;
}

:deep(.ant-layout-header) {
  line-height: 64px;
  height: 64px;
}

:deep(.ant-layout-content) {
  min-height: 280px;
}

:deep(.ant-layout-footer) {
  background: transparent;
}
</style>
