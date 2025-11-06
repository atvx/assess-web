<template>
  <div class="review-list-page">
    <a-card title="评审列表" :bordered="false">
      <!-- 搜索和操作栏 -->
      <div class="mb-4 flex justify-between items-center">
        <a-space>
          <a-input-search
            v-model:value="searchText"
            placeholder="搜索评审"
            style="width: 300px"
            @search="handleSearch"
          />
          <a-select v-model:value="statusFilter" style="width: 120px" placeholder="状态筛选">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="pending">待处理</a-select-option>
            <a-select-option value="processing">进行中</a-select-option>
            <a-select-option value="completed">已完成</a-select-option>
          </a-select>
        </a-space>
        <router-link to="/admin/review/create">
          <a-button type="primary">
            <template #icon>
              <PlusOutlined />
            </template>
            新建评审
          </a-button>
        </router-link>
      </div>

      <!-- 评审列表表格 -->
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small">查看</a-button>
              <a-button type="link" size="small">编辑</a-button>
              <a-button type="link" size="small" danger>删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'

const searchText = ref('')
const statusFilter = ref('')
const loading = ref(false)

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '评审标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '创建人',
    dataIndex: 'creator',
    key: 'creator',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
  },
]

// 模拟数据
const dataSource = ref([
  {
    id: 1,
    title: '前端代码评审',
    creator: '张三',
    status: 'processing',
    createTime: '2025-01-05 10:00',
  },
  {
    id: 2,
    title: '产品需求评审',
    creator: '李四',
    status: 'completed',
    createTime: '2025-01-04 14:30',
  },
  {
    id: 3,
    title: '设计稿评审',
    creator: '王五',
    status: 'pending',
    createTime: '2025-01-03 09:15',
  },
])

const pagination = {
  total: 3,
  current: 1,
  pageSize: 10,
}

const handleSearch = () => {
  // TODO: 实现搜索逻辑
  console.log('Search:', searchText.value)
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: 'orange',
    processing: 'blue',
    completed: 'green',
  }
  return colorMap[status] || 'default'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待处理',
    processing: '进行中',
    completed: '已完成',
  }
  return textMap[status] || status
}
</script>
