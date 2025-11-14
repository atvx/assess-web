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
          theme="dark"
          mode="inline"
          @click="handleMenuClick"
        >
          <a-menu-item key="/admin/dashboard">
            <template #icon>
              <DashboardOutlined />
            </template>
            <span>仪表盘</span>
          </a-menu-item>

          <a-sub-menu key="sub1">
            <template #icon>
              <FileTextOutlined />
            </template>
            <template #title>评审管理</template>
            <a-menu-item key="/admin/review/list">评审列表</a-menu-item>
            <a-menu-item key="/admin/review/create">创建评审</a-menu-item>
          </a-sub-menu>

          <a-sub-menu key="sub2">
            <template #icon>
              <UserOutlined />
            </template>
            <template #title>用户管理</template>
            <a-menu-item key="/admin/user/list">用户列表</a-menu-item>
          </a-sub-menu>

          <a-sub-menu key="sub3">
            <template #icon>
              <SettingOutlined />
            </template>
            <template #title>系统设置</template>
            <a-menu-item key="/admin/settings/basic">基础设置</a-menu-item>
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
                  <a-menu-item key="profile">
                    <UserOutlined />
                    个人信息
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
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const collapsed = ref(false)
const selectedKeys = ref<string[]>([route.path])

// 根据路由获取当前页面标题
const currentPageTitle = computed(() => {
  const path = route.path
  const titleMap: Record<string, string> = {
    '/admin/dashboard': '仪表盘',
    '/admin/review/list': '评审列表',
    '/admin/review/create': '创建评审',
    '/admin/user/list': '用户列表',
    '/admin/settings/basic': '基础设置',
  }
  return titleMap[path] || '后台首页'
})

// 菜单点击事件
const handleMenuClick = ({ key }: { key: string }) => {
  selectedKeys.value = [key]
  router.push(key)
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
