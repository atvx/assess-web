<!-- eslint-disable vue/multi-word-component-names -->
<!-- 角色管理主页面 -->
<template>
  <div class="role-page">
    <!-- 搜索表单 -->
    <a-card class="mb-6 rounded-lg shadow" :bordered="false">
      <a-form layout="inline" :model="queryParams" @submit.prevent="handleSearch">
        <a-form-item label="角色名称">
          <a-input
            v-model:value="queryParams.roleName"
            placeholder="搜索角色名称"
            allow-clear
            style="width: 200px"
            @pressEnter="handleSearch"
          />
        </a-form-item>

        <a-form-item label="角色编码">
          <a-input
            v-model:value="queryParams.roleCode"
            placeholder="搜索角色编码"
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

    <!-- 角色列表 -->
    <a-card class="rounded-lg shadow" :bordered="false">
      <template #title>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold text-gray-900 dark:text-white">角色列表</span>
          <a-button type="primary" @click="handleAdd">
            <template #icon>
              <PlusOutlined />
            </template>
            新增角色
          </a-button>
        </div>
      </template>

      <a-table
        :columns="columns"
        :data-source="roleList"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 1200 }"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <!-- 角色信息 -->
          <template v-if="column.key === 'role'">
            <div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ record.roleName }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ record.roleCode }}
              </div>
            </div>
          </template>

          <!-- 描述 -->
          <template v-else-if="column.key === 'description'">
            <span class="text-sm text-gray-600 dark:text-gray-300">
              {{ record.description || '-' }}
            </span>
          </template>

          <!-- 是否评审角色 -->
          <template v-else-if="column.key === 'isReviewer'">
            <a-tag :color="record.isReviewer ? 'blue' : 'default'">
              {{ record.isReviewer ? '是' : '否' }}
            </a-tag>
          </template>

          <!-- 状态 -->
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === 'enabled' ? 'green' : 'red'">
              {{ record.status === 'enabled' ? '启用' : '禁用' }}
            </a-tag>
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
          :show-total="(total: number) => `共 ${total} 个角色`"
          :page-size-options="['10', '20', '50', '100']"
          show-size-changer
          show-quick-jumper
          @change="handlePageChange"
        />
      </div>
    </a-card>

    <!-- 查看角色详情弹窗 -->
    <RoleView
      v-model:visible="detailModalVisible"
      :role="currentRole"
    />

    <!-- 新增/编辑角色弹窗 -->
    <RoleEdit
      v-model:visible="formModalVisible"
      :role="editRole"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  DownOutlined,
  StopOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import { roleApi, type Role } from '@/api/role'
import RoleView from './View.vue'
import RoleEdit from './Edit.vue'
import dayjs from 'dayjs'

// 查询参数
const queryParams = reactive({
  roleName: '',
  roleCode: '',
  status: undefined as 'enabled' | 'disabled' | undefined,
})

// 分页信息
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
})

// 角色列表
const roleList = ref<Role[]>([])
const loading = ref(false)

// 详情弹窗
const detailModalVisible = ref(false)
const currentRole = ref<Role | null>(null)

// 表单弹窗
const formModalVisible = ref(false)
const editRole = ref<Role | null>(null)

// 表格列定义
const columns = [
  {
    title: '角色信息',
    key: 'role',
    width: 220,
    fixed: 'left',
  },
  {
    title: '描述',
    key: 'description',
    width: 200,
  },
  {
    title: '评审角色',
    key: 'isReviewer',
    width: 100,
  },
  {
    title: '状态',
    key: 'status',
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
    width: 180,
    fixed: 'right',
  },
]

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 获取角色列表
const fetchRoleList = async () => {
  loading.value = true
  try {
    const response = await roleApi.getRoleList({
      roleName: queryParams.roleName || undefined,
      roleCode: queryParams.roleCode || undefined,
      status: queryParams.status,
      current: pagination.current,
      size: pagination.size,
    })

    if (response.code === 200) {
      roleList.value = response.data.records
      pagination.total = response.data.total
    } else {
      message.error(response.message || '获取角色列表失败')
    }
  } catch (error) {
    console.error('获取角色列表失败:', error)
    message.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchRoleList()
}

// 重置
const handleReset = () => {
  queryParams.roleName = ''
  queryParams.roleCode = ''
  queryParams.status = undefined
  pagination.current = 1
  fetchRoleList()
}

// 分页变化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.current = page
  pagination.size = pageSize
  fetchRoleList()
}

// 新增角色
const handleAdd = () => {
  editRole.value = null
  formModalVisible.value = true
}

// 查看角色详情
const handleView = async (record: Role) => {
  try {
    const response = await roleApi.getRoleById(record.id)
    if (response.code === 200) {
      currentRole.value = response.data
      detailModalVisible.value = true
    } else {
      message.error(response.message || '获取角色详情失败')
    }
  } catch (error) {
    console.error('获取角色详情失败:', error)
    message.error('获取角色详情失败')
  }
}

// 编辑角色
const handleEdit = (record: Role) => {
  editRole.value = record
  formModalVisible.value = true
}

// 编辑成功回调
const handleEditSuccess = () => {
  fetchRoleList()
}

// 切换角色状态
const handleToggleStatus = async (record: Role) => {
  const newStatus = record.status === 'enabled' ? 'disabled' : 'enabled'
  const actionText = newStatus === 'enabled' ? '启用' : '禁用'

  Modal.confirm({
    title: `${actionText}角色`,
    content: `确定要${actionText}角色 "${record.roleName}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const response = await roleApi.updateRole({
          id: record.id,
          status: newStatus,
        })
        if (response.code === 200) {
          message.success(`${actionText}成功`)
          fetchRoleList()
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

// 删除角色
const handleDelete = (record: Role) => {
  Modal.confirm({
    title: '删除角色',
    content: `确定要删除角色 "${record.roleName}" 吗？此操作不可恢复！`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        const response = await roleApi.deleteRole(record.id)
        if (response.code === 200) {
          message.success('删除成功')
          if (roleList.value.length === 1 && pagination.current > 1) {
            pagination.current--
          }
          fetchRoleList()
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

// 初始化
onMounted(() => {
  fetchRoleList()
})
</script>

<style scoped>
/* 使用 Tailwind 类，无需自定义样式 */
</style>
