<template>
  <div class="content-section">
    <div class="section-header">
      <h3 class="section-title">Webhook配置</h3>
      <a-button type="primary" @click="handleAdd">
        <PlusOutlined />
        新增Webhook
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="webhooks"
      :pagination="false"
      size="middle"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'events'">
          <a-space wrap>
            <a-tag v-for="event in record.events" :key="event" size="small">
              {{ event }}
            </a-tag>
          </a-space>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-switch
            :checked="record.status === 'active'"
            @change="(checked: boolean) => handleToggleStatus(record, checked)"
            size="small"
          />
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleTest(record)">
              测试
            </a-button>
            <a-button type="link" size="small" @click="handleEdit(record)">
              编辑
            </a-button>
            <a-button type="link" size="small" @click="handleViewLogs(record)">
              日志
            </a-button>
            <a-button type="link" size="small" danger @click="handleDelete(record)">
              删除
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'

const webhooks = ref([
  {
    id: '1',
    name: '评审完成通知',
    url: 'https://api.example.com/webhook/review-complete',
    events: ['评审完成', '任务结束'],
    status: 'active',
  },
  {
    id: '2',
    name: '参赛者注册通知',
    url: 'https://api.example.com/webhook/participant-register',
    events: ['报名提交', '审核通过'],
    status: 'active',
  },
])

const columns = [
  { title: 'Webhook名称', dataIndex: 'name', key: 'name', width: 150 },
  { title: 'URL', dataIndex: 'url', key: 'url', width: 250 },
  { title: '触发事件', key: 'events', width: 200 },
  { title: '状态', key: 'status', width: 80, align: 'center' as const },
  { title: '操作', key: 'action', width: 280, fixed: 'right' as const },
]

const handleAdd = () => {
  message.info('新增Webhook功能待实现')
}

const handleEdit = (webhook: typeof webhooks.value[0]) => {
  message.info(`编辑Webhook: ${webhook.name}`)
}

const handleTest = (webhook: typeof webhooks.value[0]) => {
  message.loading('正在测试Webhook...', 2)
  setTimeout(() => {
    message.success('Webhook测试成功')
  }, 2000)
}

const handleViewLogs = (webhook: typeof webhooks.value[0]) => {
  message.info(`查看Webhook日志: ${webhook.name}`)
}

const handleToggleStatus = (webhook: typeof webhooks.value[0], checked: boolean) => {
  webhook.status = checked ? 'active' : 'inactive'
  message.success(`Webhook已${checked ? '启用' : '禁用'}`)
}

const handleDelete = (webhook: typeof webhooks.value[0]) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除Webhook「${webhook.name}」吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      const index = webhooks.value.findIndex((w) => w.id === webhook.id)
      if (index > -1) {
        webhooks.value.splice(index, 1)
        message.success('Webhook已删除')
      }
    },
  })
}
</script>

<style scoped>
.content-section {
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}
</style>

