<template>
  <div class="content-section">
    <div class="section-header">
      <h3 class="section-title">第三方应用集成</h3>
      <a-button type="primary" @click="handleAdd">
        <PlusOutlined />
        添加集成
      </a-button>
    </div>

    <a-row :gutter="[16, 16]">
      <a-col :span="8" v-for="app in apps" :key="app.id">
        <div class="integration-card">
          <div class="integration-header">
            <a-avatar :src="app.icon" :size="48">
              {{ app.name.substring(0, 1) }}
            </a-avatar>
            <div class="integration-info">
              <div class="integration-name">{{ app.name }}</div>
              <div class="integration-desc">{{ app.description }}</div>
            </div>
          </div>
          <a-divider class="my-3" />
          <div class="integration-footer">
            <a-tag :color="app.status === 'active' ? 'green' : 'default'">
              {{ app.status === 'active' ? '已启用' : '未启用' }}
            </a-tag>
            <a-space>
              <a-button type="link" size="small" @click="handleConfig(app)">
                配置
              </a-button>
              <a-switch
                :checked="app.status === 'active'"
                @change="(checked: boolean) => handleToggleStatus(app, checked)"
                size="small"
              />
            </a-space>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'

const apps = ref([
  {
    id: '1',
    name: '钉钉',
    icon: '',
    description: '接入钉钉，实现消息通知和单点登录',
    status: 'active',
  },
  {
    id: '2',
    name: '企业微信',
    icon: '',
    description: '接入企业微信，实现消息推送',
    status: 'inactive',
  },
  {
    id: '3',
    name: '飞书',
    icon: '',
    description: '接入飞书，实现团队协作',
    status: 'inactive',
  },
])

const handleAdd = () => {
  message.info('添加集成功能待实现')
}

const handleConfig = (app: typeof apps.value[0]) => {
  message.info(`配置: ${app.name}`)
}

const handleToggleStatus = (app: typeof apps.value[0], checked: boolean) => {
  app.status = checked ? 'active' : 'inactive'
  message.success(`${app.name}已${checked ? '启用' : '禁用'}`)
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

.integration-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s;
  height: 100%;
}

.integration-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-color: #1890ff;
}

.integration-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.integration-info {
  flex: 1;
}

.integration-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.integration-desc {
  font-size: 12px;
  color: #999;
  line-height: 1.5;
}

.integration-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

