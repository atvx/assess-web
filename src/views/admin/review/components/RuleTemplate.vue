<!-- 规则模板管理 -->
<template>
  <a-card :bordered="false">
    <template #title>
      <span class="text-base font-semibold">规则模板管理</span>
    </template>
    <template #extra>
      <a-space>
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          新增模板
        </a-button>
      </a-space>
    </template>

    <!-- 模板列表 -->
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="record.status === 'enabled' ? 'success' : 'default'">
            {{ record.status === 'enabled' ? '启用' : '禁用' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'isDefault'">
          <a-tag v-if="record.isDefault" color="blue">默认</a-tag>
          <span v-else>-</span>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleView(record)">
              预览
            </a-button>
            <a-button type="link" size="small" @click="handleEdit(record)">
              编辑
            </a-button>
            <a-button type="link" size="small" @click="handleCopy(record)">
              复制
            </a-button>
            <a-button type="link" size="small" @click="handleApply(record)">
              应用
            </a-button>
            <a-popconfirm
              title="确定要删除此模板吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(record.id)"
            >
              <a-button type="link" size="small" danger>
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'

const loading = ref(false)
const dataSource = ref([
  {
    id: '1',
    name: '标准评审模板',
    description: '适用于一般性评审活动',
    status: 'enabled',
    isDefault: true,
    createdAt: '2025-01-01',
  },
])

const columns = [
  { title: '模板名称', dataIndex: 'name', key: 'name' },
  { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: '状态', key: 'status', width: 100 },
  { title: '默认', key: 'isDefault', width: 80 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 120 },
  { title: '操作', key: 'action', width: 300, fixed: 'right' },
]

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 1,
})

const handleAdd = () => {
  message.info('打开新增模板弹窗')
}

const handleView = (record: unknown) => {
  message.info('预览模板：' + JSON.stringify(record))
}

const handleEdit = (record: unknown) => {
  message.info('编辑模板：' + JSON.stringify(record))
}

const handleCopy = (record: unknown) => {
  message.info('复制模板：' + JSON.stringify(record))
}

const handleApply = (record: unknown) => {
  message.info('应用模板到活动：' + JSON.stringify(record))
}

const handleDelete = (id: string) => {
  message.success('删除模板：' + id)
}
</script>

