<template>
  <div class="content-section">
    <div class="section-header">
      <h3 class="section-title">短信配置</h3>
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
        <label class="setting-label">服务提供商</label>
        <div class="setting-value">
          <a-tag color="blue">{{ smsConfig.provider }}</a-tag>
        </div>
      </div>
      <div class="setting-item">
        <label class="setting-label">AccessKey ID</label>
        <div class="setting-value">{{ maskString(smsConfig.accessKeyId) }}</div>
      </div>
      <div class="setting-item">
        <label class="setting-label">签名</label>
        <div class="setting-value">{{ smsConfig.signName }}</div>
      </div>
      <div class="setting-item">
        <label class="setting-label">状态</label>
        <div class="setting-value">
          <a-tag :color="smsConfig.enabled ? 'green' : 'default'">
            {{ smsConfig.enabled ? '已启用' : '未启用' }}
          </a-tag>
        </div>
      </div>
      <div class="setting-item">
        <label class="setting-label">剩余条数</label>
        <div class="setting-value">
          <span class="text-lg font-bold text-blue-600">{{ smsConfig.remainingCount }}</span> 条
        </div>
      </div>
      <div class="setting-item">
        <label class="setting-label">本月已用</label>
        <div class="setting-value">{{ smsConfig.monthlyUsed }} 条</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import { SendOutlined, EditOutlined } from '@ant-design/icons-vue'

const smsConfig = reactive({
  provider: '阿里云',
  accessKeyId: '**********************',
  signName: '评审系统',
  enabled: true,
  remainingCount: 8500,
  monthlyUsed: 1500,
})

const maskString = (str: string) => {
  if (str.length <= 8) return str
  return str.substring(0, 4) + '********' + str.substring(str.length - 4)
}

const handleEdit = () => {
  message.info('编辑短信配置功能待实现')
}

const handleTest = () => {
  message.loading('正在发送测试短信...', 2)
  setTimeout(() => {
    message.success('测试短信发送成功')
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

