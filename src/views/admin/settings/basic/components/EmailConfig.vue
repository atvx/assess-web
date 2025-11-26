<template>
  <div class="content-section">
    <div class="section-header">
      <h3 class="section-title">邮件配置</h3>
      <a-space>
        <a-button @click="handleTest">
          <SendOutlined />
          测试发送
        </a-button>
        <a-button type="primary" @click="handleEdit">
          <EditOutlined />
          编辑
        </a-button>
      </a-space>
    </div>

    <div class="setting-groups">
      <div class="setting-item">
        <label class="setting-label">SMTP服务器</label>
        <div class="setting-value">{{ emailConfig.smtpHost }}</div>
      </div>
      <div class="setting-item">
        <label class="setting-label">SMTP端口</label>
        <div class="setting-value">{{ emailConfig.smtpPort }}</div>
      </div>
      <div class="setting-item">
        <label class="setting-label">发件人邮箱</label>
        <div class="setting-value">{{ emailConfig.fromEmail }}</div>
      </div>
      <div class="setting-item">
        <label class="setting-label">发件人名称</label>
        <div class="setting-value">{{ emailConfig.fromName }}</div>
      </div>
      <div class="setting-item">
        <label class="setting-label">加密方式</label>
        <div class="setting-value">
          <a-tag>{{ emailConfig.encryption }}</a-tag>
        </div>
      </div>
      <div class="setting-item">
        <label class="setting-label">状态</label>
        <div class="setting-value">
          <a-tag :color="emailConfig.enabled ? 'green' : 'default'">
            {{ emailConfig.enabled ? '已启用' : '未启用' }}
          </a-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import { SendOutlined, EditOutlined } from '@ant-design/icons-vue'

const emailConfig = reactive({
  smtpHost: 'smtp.example.com',
  smtpPort: 465,
  fromEmail: 'noreply@example.com',
  fromName: '评审系统',
  encryption: 'SSL',
  enabled: true,
})

const handleEdit = () => {
  message.info('编辑邮件配置功能待实现')
}

const handleTest = () => {
  message.loading('正在发送测试邮件...', 2)
  setTimeout(() => {
    message.success('测试邮件发送成功')
  }, 2000)
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

.setting-groups {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  flex-shrink: 0;
  width: 180px;
  font-size: 14px;
  color: #666;
  line-height: 32px;
}

.setting-value {
  flex: 1;
  font-size: 14px;
  color: #333;
  line-height: 32px;
}
</style>

