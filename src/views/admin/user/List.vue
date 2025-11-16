<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="user-list-page">
    <!-- 搜索表单 -->
    <a-card class="mb-6 rounded-lg shadow" :bordered="false">
      <a-form layout="inline" :model="queryParams" @submit.prevent="handleSearch">
        <a-form-item label="关键词">
          <a-input
            v-model:value="queryParams.keyword"
            placeholder="搜索用户名、姓名、邮箱"
            allow-clear
            style="width: 200px"
            @pressEnter="handleSearch"
          />
        </a-form-item>

        <a-form-item label="状态">
          <a-select
            v-model:value="queryParams.status"
            placeholder="请选择状态"
            allow-clear
            style="width: 120px"
          >
            <a-select-option value="enabled">启用</a-select-option>
            <a-select-option value="disabled">禁用</a-select-option>
            <a-select-option value="locked">锁定</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="管理员">
          <a-select
            v-model:value="queryParams.isAdmin"
            placeholder="全部"
            allow-clear
            style="width: 100px"
          >
            <a-select-option value="true">是</a-select-option>
            <a-select-option value="false">否</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="loading">
              <template #icon>
                <SearchOutlined />
              </template>
              查询
            </a-button>
            <a-button @click="handleReset">
              <template #icon>
                <ReloadOutlined />
              </template>
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 用户列表 -->
    <a-card class="rounded-lg shadow" :bordered="false">
      <template #title>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold text-gray-900 dark:text-white">用户列表</span>
          <a-button type="primary" @click="handleAdd">
            <template #icon>
              <PlusOutlined />
            </template>
            新增用户
          </a-button>
        </div>
      </template>

      <a-table
        :columns="columns"
        :data-source="userList"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 1200 }"
        row-key="id"
      >
        <!-- 用户信息 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'user'">
            <div class="flex items-center">
              <a-avatar :src="record.avatar" :size="40" class="mr-3">
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">
                  {{ record.realName || record.username }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  @{{ record.username }}
                </div>
              </div>
            </div>
          </template>

          <!-- 联系方式 -->
          <template v-else-if="column.key === 'contact'">
            <div>
              <div v-if="record.email" class="text-sm">
                <MailOutlined class="mr-1" />
                {{ record.email }}
              </div>
              <div v-if="record.phone" class="text-sm text-gray-500 dark:text-gray-400">
                <PhoneOutlined class="mr-1" />
                {{ record.phone }}
              </div>
            </div>
          </template>

          <!-- 组织部门 -->
          <template v-else-if="column.key === 'org'">
            <div>
              <div v-if="record.orgName" class="text-sm">{{ record.orgName }}</div>
              <div v-if="record.deptName" class="text-sm text-gray-500 dark:text-gray-400">
                {{ record.deptName }}
              </div>
            </div>
          </template>

          <!-- 状态 -->
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>

          <!-- 是否管理员 -->
          <template v-else-if="column.key === 'isAdmin'">
            <a-tag v-if="record.isAdmin" color="blue">管理员</a-tag>
            <span v-else class="text-gray-400">-</span>
          </template>

          <!-- 创建时间 -->
          <template v-else-if="column.key === 'createdAt'">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(record.createdAt) }}
            </span>
          </template>

          <!-- 操作 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">
                查看
              </a-button>
              <a-button type="link" size="small" @click="handleEdit(record)">
                编辑
              </a-button>
              <a-dropdown>
                <a-button type="link" size="small">
                  更多
                  <DownOutlined />
                </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="handleResetPassword(record)">
                      <KeyOutlined />
                      重置密码
                    </a-menu-item>
                    <a-menu-item @click="handleToggleStatus(record)">
                      <template v-if="record.status === 'enabled'">
                        <StopOutlined />
                        禁用
                      </template>
                      <template v-else>
                        <CheckCircleOutlined />
                        启用
                      </template>
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item danger @click="handleDelete(record)">
                      <DeleteOutlined />
                      删除
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>

      <!-- 分页 -->
      <div class="mt-6 flex justify-end">
        <a-pagination
          v-model:current="pagination.current"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :show-total="(total: number) => `共 ${total} 条记录`"
          :page-size-options="['10', '20', '50', '100']"
          show-size-changer
          show-quick-jumper
          @change="handlePageChange"
        />
      </div>
    </a-card>

    <!-- 查看用户详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="用户详情"
      :width="680"
      :footer="null"
    >
      <a-descriptions bordered :column="2" v-if="currentUser">
        <a-descriptions-item label="用户名" :span="1">
          {{ currentUser.username }}
        </a-descriptions-item>
        <a-descriptions-item label="真实姓名" :span="1">
          {{ currentUser.realName || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="邮箱" :span="2">
          {{ currentUser.email || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="手机号" :span="2">
          {{ currentUser.phone || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="组织" :span="1">
          {{ currentUser.orgName || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="部门" :span="1">
          {{ currentUser.deptName || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="状态" :span="1">
          <a-tag :color="getStatusColor(currentUser.status)">
            {{ getStatusText(currentUser.status) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="角色" :span="1">
          <a-tag v-if="currentUser.isAdmin" color="blue">管理员</a-tag>
          <span v-else class="text-gray-400">普通用户</span>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" :span="2">
          {{ formatDate(currentUser.createdAt) }}
        </a-descriptions-item>
        <a-descriptions-item label="更新时间" :span="2">
          {{ formatDate(currentUser.updatedAt) }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  DownOutlined,
  KeyOutlined,
  StopOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import { userApi, type User, type UserQueryDTO } from '@/api/user'
import dayjs from 'dayjs'

const router = useRouter()

// 查询参数（表单使用）
const queryParams = reactive({
  keyword: '',
  status: undefined as string | undefined,
  isAdmin: undefined as string | undefined, // 'true' | 'false' | undefined
  current: 1,
  size: 10,
})

// 分页信息
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
})

// 用户列表
const userList = ref<User[]>([])
const loading = ref(false)

// 详情弹窗相关
const detailModalVisible = ref(false)
const currentUser = ref<User | null>(null)

// 表格列定义
const columns = [
  {
    title: '用户信息',
    key: 'user',
    width: 220,
    fixed: 'left',
  },
  {
    title: '联系方式',
    key: 'contact',
    width: 200,
  },
  {
    title: '组织/部门',
    key: 'org',
    width: 180,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '角色',
    key: 'isAdmin',
    width: 100,
  },
  {
    title: '创建时间',
    key: 'createdAt',
    width: 160,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
  },
]

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true
  try {
    // 转换查询参数类型
    const params: UserQueryDTO = {
      keyword: queryParams.keyword,
      status: (queryParams.status as 'enabled' | 'disabled' | 'locked') || undefined,
      isAdmin: queryParams.isAdmin === 'true' ? true : queryParams.isAdmin === 'false' ? false : undefined,
      current: pagination.current,
      size: pagination.size,
    }

    const response = await userApi.getUserList(params)

    if (response.code === 200) {
      userList.value = response.data.records
      pagination.total = response.data.total
    } else {
      message.error(response.message || '获取用户列表失败')
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    message.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchUserList()
}

// 重置
const handleReset = () => {
  queryParams.keyword = ''
  queryParams.status = undefined
  queryParams.isAdmin = undefined
  pagination.current = 1
  fetchUserList()
}

// 分页变化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.current = page
  pagination.size = pageSize
  fetchUserList()
}

// 新增用户
const handleAdd = () => {
  router.push('/admin/system/user/create')
}

// 查看用户
const handleView = async (record: User) => {
  try {
    const response = await userApi.getUserById(record.id)
    if (response.code === 200) {
      currentUser.value = response.data
      detailModalVisible.value = true
    } else {
      message.error(response.message || '获取用户详情失败')
    }
  } catch (error) {
    console.error('获取用户详情失败:', error)
    message.error('获取用户详情失败')
  }
}

// 编辑用户
const handleEdit = (record: User) => {
  router.push(`/admin/system/user/edit/${record.id}`)
}

// 重置密码
const handleResetPassword = (record: User) => {
  Modal.confirm({
    title: '重置密码',
    content: `确定要重置用户 "${record.realName || record.username}" 的密码吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const response = await userApi.resetPassword(record.id)
        if (response.code === 200) {
          Modal.success({
            title: '密码重置成功',
            content: `新密码: ${response.data.password}`,
          })
        } else {
          message.error(response.message || '重置密码失败')
        }
      } catch (error) {
        console.error('重置密码失败:', error)
        message.error('重置密码失败')
      }
    },
  })
}

// 切换用户状态
const handleToggleStatus = async (record: User) => {
  const newStatus = record.status === 'enabled' ? 'disabled' : 'enabled'
  const actionText = newStatus === 'enabled' ? '启用' : '禁用'

  Modal.confirm({
    title: `${actionText}用户`,
    content: `确定要${actionText}用户 "${record.realName || record.username}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const response = await userApi.toggleUserStatus(record.id, newStatus)
        if (response.code === 200) {
          message.success(`${actionText}成功`)
          fetchUserList()
        } else {
          message.error(response.message || `${actionText}失败`)
        }
      } catch (error) {
        console.error(`${actionText}失败:`, error)
        message.error(`${actionText}失败`)
      }
    },
  })
}

// 删除用户
const handleDelete = (record: User) => {
  Modal.confirm({
    title: '删除用户',
    content: `确定要删除用户 "${record.realName || record.username}" 吗？此操作不可恢复！`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        const response = await userApi.deleteUser(record.id)
        if (response.code === 200) {
          message.success('删除成功')
          // 如果删除后当前页没有数据了，返回上一页
          if (userList.value.length === 1 && pagination.current > 1) {
            pagination.current--
          }
          fetchUserList()
        } else {
          message.error(response.message || '删除失败')
        }
      } catch (error) {
        console.error('删除失败:', error)
        message.error('删除失败')
      }
    },
  })
}

// 获取状态颜色
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    enabled: 'green',
    disabled: 'red',
    locked: 'orange',
  }
  return colorMap[status] || 'default'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    enabled: '启用',
    disabled: '禁用',
    locked: '锁定',
  }
  return textMap[status] || status
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 初始化
onMounted(() => {
  fetchUserList()
})
</script>

<style scoped>
/* 使用 Tailwind 类，无需自定义样式 */
</style>
