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
                  <a-menu-item v-if="userStore.isAdmin" key="switch-org" @click="handleSwitchOrg">
                    <ApartmentOutlined />
                    切换组织
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

    <!-- 切换组织模态框 -->
    <a-modal
      v-model:open="switchOrgVisible"
      title="切换组织"
      :footer="null"
      @cancel="handleCancelSwitchOrg"
    >
      <a-space direction="vertical" style="width: 100%" :size="16">
        <!-- 搜索区域 -->
        <a-space style="width: 100%">
          <a-input
            v-model:value="orgSearchKeyword"
            placeholder="搜索组织名称或编码"
            allow-clear
            style="width: 280px"
            @pressEnter="handleSearchOrg"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
          <a-select
            v-model:value="orgSearchStatus"
            placeholder="状态"
            allow-clear
            style="width: 120px"
            @change="handleSearchOrg"
          >
            <a-select-option value="enabled">启用</a-select-option>
            <a-select-option value="disabled">停用</a-select-option>
          </a-select>
          <a-button type="primary" @click="handleSearchOrg">
            <template #icon><SearchOutlined /></template>
            查询
          </a-button>
        </a-space>

        <!-- 组织列表表格 -->
        <a-table
          :columns="orgColumns"
          :data-source="organizations"
          :pagination="orgPagination"
          :loading="orgListLoading"
          row-key="id"
          size="small"
          :scroll="{ y: 360 }"
          @change="handleOrgTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <div>
                <div>{{ record.name }}</div>
                <a-tag v-if="record.id === userStore.userInfo?.orgId" color="blue" size="small" style="margin-top: 4px">当前组织</a-tag>
              </div>
            </template>
            <template v-else-if="column.key === 'type'">
              <a-tag color="blue">{{ record.typeName || record.type }}</a-tag>
            </template>
            <template v-else-if="column.key === 'status'">
              <a-tag :color="record.status === 'enabled' ? 'success' : 'default'">
                {{ record.status === 'enabled' ? '启用' : '停用' }}
              </a-tag>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-button
                type="link"
                size="small"
                :disabled="record.id === userStore.userInfo?.orgId || record.status === 'disabled'"
                @click="handleConfirmSwitch(record)"
              >
                切换
              </a-button>
            </template>
          </template>
        </a-table>
      </a-space>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { organizationApi, type Organization } from '@/api/organization'
import { message, Modal } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
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
  SearchOutlined,
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

// 切换组织
const switchOrgVisible = ref(false)
const switchOrgLoading = ref(false)
const orgListLoading = ref(false)
const organizations = ref<Organization[]>([])
const orgSearchKeyword = ref('')
const orgSearchStatus = ref<'enabled' | 'disabled' | undefined>(undefined)

// 组织分页配置
const orgPagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: false,
  showQuickJumper: false,
  showTotal: (total: number) => `共 ${total} 条`,
  size: 'small',
})

// 组织表格列
const orgColumns: TableColumnsType = [
  { title: '组织名称', key: 'name', dataIndex: 'name' },
  { title: '组织编码', key: 'code', dataIndex: 'code' },
  { title: '组织类型', key: 'type' },
  { title: '状态', key: 'status', align: 'center' },
  { title: '操作', key: 'action', align: 'center' },
]

// 打开切换组织对话框
const handleSwitchOrg = async () => {
  switchOrgVisible.value = true
  // 重置搜索条件和分页
  orgSearchKeyword.value = ''
  orgSearchStatus.value = undefined
  orgPagination.value.current = 1
  await loadOrganizations()
}

// 加载组织列表
const loadOrganizations = async () => {
  try {
    orgListLoading.value = true
    const res = await organizationApi.getOrganizationList({
      keyword: orgSearchKeyword.value,
      status: orgSearchStatus.value,
      current: orgPagination.value.current,
      size: orgPagination.value.pageSize,
    })
    if (res.code === 200) {
      organizations.value = res.data.records
      orgPagination.value.total = res.data.total
    }
  } catch (error) {
    message.error('加载组织列表失败')
    console.error('Load organizations error:', error)
  } finally {
    orgListLoading.value = false
  }
}

// 搜索组织
const handleSearchOrg = () => {
  orgPagination.value.current = 1
  loadOrganizations()
}

// 表格变化（分页、排序、筛选）
const handleOrgTableChange = (pagination: any) => {
  orgPagination.value.current = pagination.current
  orgPagination.value.pageSize = pagination.pageSize
  loadOrganizations()
}

// 确认切换组织
const handleConfirmSwitch = (org: Organization) => {
  Modal.confirm({
    title: '切换组织',
    content: `确定要切换到「${org.name}」吗？切换后页面将自动刷新。`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      await performSwitch(org.id)
    },
  })
}

// 执行切换
const performSwitch = async (orgId: string) => {
  try {
    switchOrgLoading.value = true
    const res = await organizationApi.switchOrganization(orgId)

    if (res.code === 200) {
      const {
        token,
        tokenType,
        userId,
        username,
        realName,
        orgId: newOrgId,
        isAdmin,
        permissions,
        roles,
      } = res.data

      // 构建用户信息
      const user = {
        id: userId,
        username,
        realName,
        orgId: newOrgId,
        isAdmin,
        permissions: permissions || [],
        roles: roles || [],
      }

      // 更新本地存储的 token 和用户信息
      const fullToken = tokenType ? `${tokenType} ${token}` : token
      userStore.setLoginState(fullToken, user)

      message.success('切换组织成功')
      switchOrgVisible.value = false

      // 刷新页面
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } else {
      message.error(res.message || '切换失败')
    }
  } catch (error: any) {
    console.error('Switch organization error:', error)
    message.error(error.response?.data?.message || '切换组织失败')
  } finally {
    switchOrgLoading.value = false
  }
}

// 取消切换
const handleCancelSwitchOrg = () => {
  switchOrgVisible.value = false
  orgSearchKeyword.value = ''
  orgSearchStatus.value = undefined
  organizations.value = []
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
