<template>
  <div class="content-section">
    <div class="section-header">
      <h3 class="section-title">消息模板</h3>
      <a-button type="primary" @click="handleAdd">
        <PlusOutlined />
        新增模板
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="templates"
      :pagination="false"
      size="middle"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'type'">
          <a-tag :color="getTypeColor(record.type)">
            {{ getTypeLabel(record.type) }}
          </a-tag>
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
            <a-button type="link" size="small" @click="handleEdit(record)">
              编辑
            </a-button>
            <a-button type="link" size="small" @click="handlePreview(record)">
              预览
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

const templates = ref([
  {
    id: '1',
    name: '评审邀请',
    type: 'email',
    subject: '您有新的评审任务',
    content: '尊敬的{{name}}专家，您有新的评审任务等待处理...',
    status: 'active',
  },
  {
    id: '2',
    name: '任务提醒',
    type: 'sms',
    subject: '任务即将到期',
    content: '【评审系统】您的评审任务将于{{deadline}}到期，请及时完成',
    status: 'active',
  },
])

const columns = [
  { title: '模板名称', dataIndex: 'name', key: 'name', width: 150 },
  { title: '类型', key: 'type', width: 100 },
  { title: '主题/标题', dataIndex: 'subject', key: 'subject', width: 200 },
  { title: '状态', key: 'status', width: 80, align: 'center' as const },
  { title: '操作', key: 'action', width: 200, fixed: 'right' as const },
]

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

const handleAdd = () => {
  message.info('新增消息模板功能待实现')
}

const handleEdit = (template: typeof templates.value[0]) => {
  message.info(`编辑模板: ${template.name}`)
}

const handlePreview = (template: typeof templates.value[0]) => {
  message.info(`预览模板: ${template.name}`)
}

const handleToggleStatus = (template: typeof templates.value[0], checked: boolean) => {
  template.status = checked ? 'active' : 'inactive'
  message.success(`模板已${checked ? '启用' : '禁用'}`)
}

const handleDelete = (template: typeof templates.value[0]) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除模板「${template.name}」吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      message.success('模板已删除')
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

