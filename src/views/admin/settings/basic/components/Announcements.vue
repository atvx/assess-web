<template>
  <div class="content-section">
    <div class="section-header">
      <h3 class="section-title">系统公告</h3>
      <a-button type="primary" @click="handleAdd">
        <PlusOutlined />
        新增公告
      </a-button>
    </div>

    <div class="announcements-list">
      <div v-for="item in announcements" :key="item.id" class="announcement-card">
        <div class="announcement-header">
          <div class="announcement-info">
            <a-tag :color="getTypeColor(item.type)" size="small">
              {{ getTypeLabel(item.type) }}
            </a-tag>
            <span class="announcement-title">{{ item.title }}</span>
          </div>
          <a-space>
            <a-switch
              :checked="item.status === 'active'"
              @change="(checked: boolean) => handleToggleStatus(item, checked)"
              size="small"
            />
            <a-button type="link" size="small" @click="handleEdit(item)">
              <EditOutlined />
            </a-button>
            <a-button type="link" size="small" danger @click="handleDelete(item)">
              <DeleteOutlined />
            </a-button>
          </a-space>
        </div>
        <div class="announcement-content">{{ item.content }}</div>
        <div class="announcement-meta">
          发布时间: {{ item.publishedAt }} | 发布者: {{ item.publisher }}
        </div>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑公告' : '新增公告'"
      width="700px"
      @ok="handleSubmit"
    >
      <a-form
        :model="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
      >
        <a-form-item label="公告类型">
          <a-select v-model:value="form.type">
            <a-select-option value="info">通知</a-select-option>
            <a-select-option value="warning">警告</a-select-option>
            <a-select-option value="important">重要</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="公告标题">
          <a-input v-model:value="form.title" placeholder="请输入公告标题" />
        </a-form-item>
        <a-form-item label="公告内容">
          <a-textarea v-model:value="form.content" :rows="4" placeholder="请输入公告内容" />
        </a-form-item>
        <a-form-item label="发布者">
          <a-input v-model:value="form.publisher" placeholder="请输入发布者" />
        </a-form-item>
        <a-form-item label="状态">
          <a-radio-group v-model:value="form.status">
            <a-radio value="active">显示</a-radio>
            <a-radio value="inactive">隐藏</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'

const announcements = ref([
  {
    id: '1',
    type: 'important',
    title: '系统维护通知',
    content: '本系统将于2025年1月20日凌晨2:00-4:00进行系统维护升级，期间将暂停服务',
    status: 'active',
    publisher: '系统管理员',
    publishedAt: '2025-01-15 10:00',
  },
  {
    id: '2',
    type: 'info',
    title: '新功能上线',
    content: '评审进度实时监控功能已上线，欢迎使用',
    status: 'active',
    publisher: '系统管理员',
    publishedAt: '2025-01-10 14:30',
  },
])

const modalVisible = ref(false)
const isEdit = ref(false)
const form = reactive({
  id: '',
  type: 'info',
  title: '',
  content: '',
  publisher: '',
  status: 'active',
})

const getTypeColor = (type: string) => {
  const colors = {
    info: '#1890ff',
    warning: '#faad14',
    important: '#ff4d4f',
  }
  return colors[type as keyof typeof colors] || '#8c8c8c'
}

const getTypeLabel = (type: string) => {
  const labels = {
    info: '通知',
    warning: '警告',
    important: '重要',
  }
  return labels[type as keyof typeof labels] || type
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, {
    id: '',
    type: 'info',
    title: '',
    content: '',
    publisher: '系统管理员',
    status: 'active',
  })
  modalVisible.value = true
}

const handleEdit = (item: typeof announcements.value[0]) => {
  isEdit.value = true
  Object.assign(form, item)
  modalVisible.value = true
}

const handleSubmit = () => {
  if (isEdit.value) {
    const index = announcements.value.findIndex((a) => a.id === form.id)
    if (index > -1) {
      Object.assign(announcements.value[index], form)
    }
    message.success('公告已更新')
  } else {
    announcements.value.unshift({
      ...form,
      id: String(Date.now()),
      publishedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    })
    message.success('公告已发布')
  }
  modalVisible.value = false
}

const handleToggleStatus = (item: typeof announcements.value[0], checked: boolean) => {
  item.status = checked ? 'active' : 'inactive'
  message.success(`公告已${checked ? '显示' : '隐藏'}`)
}

const handleDelete = (item: typeof announcements.value[0]) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除公告「${item.title}」吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      const index = announcements.value.findIndex((a) => a.id === item.id)
      if (index > -1) {
        announcements.value.splice(index, 1)
        message.success('公告已删除')
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

.announcements-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.announcement-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 16px;
  transition: all 0.3s;
}

.announcement-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.announcement-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.announcement-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.announcement-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 8px;
}

.announcement-meta {
  font-size: 12px;
  color: #999;
}
</style>

