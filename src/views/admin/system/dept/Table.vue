<!-- 部门列表表格组件 -->
<template>
  <div class="department-list-section">
    <!-- 搜索表单 -->
    <a-card class="mb-4 rounded-lg shadow" :bordered="false">
      <a-form layout="inline" :model="queryParams" @submit.prevent="handleSearch">
        <a-form-item label="关键词">
          <a-input
            v-model:value="queryParams.keyword"
            placeholder="搜索部门名称或编码"
            allow-clear
            style="width: 220px"
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

    <!-- 部门列表 -->
    <a-card class="rounded-lg shadow" :bordered="false">
      <template #title>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ selectedDepartmentName || '全部部门' }}
          </span>
          <a-space>
            <a-button @click="handleDownloadTemplate">
              <template #icon>
                <DownloadOutlined />
              </template>
              下载模板
            </a-button>
            <a-upload
              :show-upload-list="false"
              :before-upload="handleImport"
              accept=".xlsx,.xls"
            >
              <a-button>
                <template #icon>
                  <UploadOutlined />
                </template>
                导入
              </a-button>
            </a-upload>
            <a-button @click="handleExport">
              <template #icon>
                <ExportOutlined />
              </template>
              导出
            </a-button>
          </a-space>
        </div>
      </template>

      <a-table
        :columns="columns"
        :data-source="departmentList"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 1200 }"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <!-- 部门信息 -->
          <template v-if="column.key === 'department'">
            <div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ record.name }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ record.code }}
              </div>
            </div>
          </template>

          <!-- 上级部门 -->
          <template v-else-if="column.key === 'parent'">
            <span class="text-sm">
              {{ record.parentName || '-' }}
            </span>
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
              <a-button type="link" size="small" @click="handleEdit(record)">
                编辑
              </a-button>
              <a-button
                type="link"
                size="small"
                danger
                @click="handleDelete(record)"
              >
                删除
              </a-button>
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
          :show-total="(total: number) => `共 ${total} 个部门`"
          :page-size-options="['10', '20', '50', '100']"
          show-size-changer
          show-quick-jumper
          @change="handlePageChange"
        />
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  UploadOutlined,
  ExportOutlined,
} from '@ant-design/icons-vue'
import {
  departmentApi,
  type Department,
} from '@/api/department'
import dayjs from 'dayjs'

interface Props {
  orgId: string
  selectedDepartmentId?: string
  selectedDepartmentName?: string
}

interface Emits {
  (e: 'edit', department: Department): void
  (e: 'delete', department: Department): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 状态
const departmentList = ref<Department[]>([])
const loading = ref(false)

// 查询参数
const queryParams = reactive<{
  keyword: string
  status: 'enabled' | 'disabled' | undefined
  orgId: string
  parentId: string | undefined
  sortBy: string
  sortOrder: string
}>({
  keyword: '',
  status: undefined,
  orgId: props.orgId,
  parentId: undefined,
  sortBy: 'sort',
  sortOrder: 'desc',
})

// 分页信息
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
})

// 表格列定义
const columns = [
  {
    title: '部门信息',
    key: 'department',
    width: 220,
    fixed: 'left',
  },
  {
    title: '上级部门',
    key: 'parent',
    width: 150,
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
    width: 150,
    fixed: 'right',
  },
]

// ==================== 工具函数 ====================
// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// ==================== 数据加载 ====================
// 加载部门列表
const loadList = async () => {
  loading.value = true
  try {
    const response = await departmentApi.getDepartmentList({
      ...queryParams,
      current: pagination.current,
      size: pagination.size,
    })

    if (response.code === 200) {
      departmentList.value = response.data.records
      pagination.total = response.data.total
    } else {
      message.error(response.message || '获取部门列表失败')
    }
  } catch (error) {
    message.error('获取部门列表失败')
  } finally {
    loading.value = false
  }
}

// ==================== 事件处理 ====================
// 搜索
const handleSearch = () => {
  pagination.current = 1
  loadList()
}

// 重置
const handleReset = () => {
  queryParams.keyword = ''
  queryParams.status = undefined
  pagination.current = 1
  loadList()
}

// 分页变化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.current = page
  pagination.size = pageSize
  loadList()
}

// 编辑
const handleEdit = (record: Department) => {
  emit('edit', record)
}

// 删除
const handleDelete = (record: Department) => {
  Modal.confirm({
    title: '删除部门',
    content: `确定要删除部门 "${record.name}" 吗？删除后该部门下的所有子部门将一并删除，此操作不可恢复！`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        const response = await departmentApi.deleteDepartment(record.id)
        if (response.code === 200) {
          message.success('删除成功')
          emit('refresh')
          if (departmentList.value.length === 1 && pagination.current > 1) {
            pagination.current--
          }
          loadList()
        } else {
          message.error(response.message || '删除失败')
        }
      } catch (error) {
        message.error('删除失败')
      }
    },
  })
}

// 下载模板
const handleDownloadTemplate = async () => {
  try {
    const blob = await departmentApi.downloadTemplate()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `部门导入模板_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    message.success('下载成功')
  } catch (error) {
    message.error('下载模板失败')
  }
}

// 导入
const handleImport = async (file: File) => {
  try {
    const response = await departmentApi.importDepartments(file)
    if (response.code === 200) {
      message.success(`导入完成：成功 ${response.data.success} 条，失败 ${response.data.fail} 条`)
      emit('refresh')
      loadList()
    } else {
      message.error(response.message || '导入失败')
    }
  } catch (error) {
    message.error('导入失败')
  }
  return false // 阻止默认上传行为
}

// 导出
const handleExport = async () => {
  try {
    const blob = await departmentApi.exportDepartments(queryParams)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `部门列表_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    message.success('导出成功')
  } catch (error) {
    message.error('导出失败')
  }
}

// ==================== 监听器 ====================
// 监听选中部门变化
watch(() => props.selectedDepartmentId, (newId) => {
  queryParams.parentId = newId
  pagination.current = 1
  loadList()
}, { immediate: true })

// 对外暴露
defineExpose({
  loadList,
})
</script>

<style scoped>
.department-list-section {
  display: flex;
  flex-direction: column;
}
</style>

