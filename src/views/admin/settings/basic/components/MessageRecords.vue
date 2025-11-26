<template>
  <div class="content-section">
    <div class="section-header">
      <h3 class="section-title">消息发送记录</h3>
      <a-space>
        <a-date-picker placeholder="选择日期" size="small" />
        <a-button @click="handleExport">
          <ExportOutlined />
          导出
        </a-button>
      </a-space>
    </div>

    <a-table
      :columns="columns"
      :data-source="records"
      :pagination="pagination"
      size="middle"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'type'">
          <a-tag :color="getTypeColor(record.type)">
            {{ getTypeLabel(record.type) }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">
            {{ record.status }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button type="link" size="small" @click="handleView(record)">
            详情
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { ExportOutlined } from '@ant-design/icons-vue'

const records = ref([
  {
    id: '1',
    type: 'email',
    receiver: 'expert@example.com',
    subject: '您有新的评审任务',
    status: '成功',
    sentAt: '2025-01-16 10:30',
  },
  {
    id: '2',
    type: 'sms',
    receiver: '138****8888',
    subject: '任务即将到期',
    status: '成功',
    sentAt: '2025-01-16 09:15',
  },
])

const columns = [
  { title: '类型', key: 'type', width: 80 },
  { title: '接收人', dataIndex: 'receiver', key: 'receiver', width: 150 },
  { title: '主题/内容', dataIndex: 'subject', key: 'subject', width: 200 },
  { title: '状态', key: 'status', width: 80 },
  { title: '发送时间', dataIndex: 'sentAt', key: 'sentAt', width: 150 },
  { title: '操作', key: 'action', width: 100, fixed: 'right' as const },
]

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 2,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

const getTypeColor = (type: string) => {
  const colors = {
    email: 'blue',
    sms: 'green',
    notification: 'orange',
  }
  return colors[type as keyof typeof colors] || 'default'
}

const getTypeLabel = (type: string) => {
  const labels = {
    email: '邮件',
    sms: '短信',
    notification: '站内通知',
  }
  return labels[type as keyof typeof labels] || type
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '成功': 'green',
    '失败': 'red',
    '发送中': 'blue',
  }
  return colors[status] || 'default'
}

const handleTableChange = (pag: typeof pagination) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}

const handleExport = () => {
  message.success('导出功能待实现')
}

const handleView = (record: typeof records.value[0]) => {
  message.info(`查看记录详情: ${record.id}`)
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

