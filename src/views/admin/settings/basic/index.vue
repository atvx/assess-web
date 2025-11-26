<template>
  <div class="settings-basic-page">
    <div class="settings-layout">
      <!-- 左侧导航菜单 -->
      <div class="settings-sidebar">
        <div class="sidebar-menu">
          <div
            v-for="menu in menuItems"
            :key="menu.key"
            :class="['menu-item', { active: activeMenu === menu.key }]"
            @click="activeMenu = menu.key"
          >
            {{ menu.label }}
          </div>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="settings-content">
        <a-card :bordered="false" class="content-card">
          <!-- 系统参数 -->
          <SystemParams v-show="activeMenu === 'params'" />

          <!-- 系统公告 -->
          <Announcements v-show="activeMenu === 'announcements'" />

          <!-- 文件配置 -->
          <FileConfig v-show="activeMenu === 'file'" />

          <!-- 消息模板 -->
          <MessageTemplates v-show="activeMenu === 'templates'" />

          <!-- 消息发送记录 -->
          <MessageRecords v-show="activeMenu === 'records'" />

          <!-- 邮件配置 -->
          <EmailConfig v-show="activeMenu === 'email'" />

          <!-- 短信配置 -->
          <SmsConfig v-show="activeMenu === 'sms'" />

          <!-- 第三方应用集成 -->
          <ThirdPartyIntegration v-show="activeMenu === 'apps'" />

          <!-- Webhook配置 -->
          <WebhookConfig v-show="activeMenu === 'webhooks'" />
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SystemParams from './components/SystemParams.vue'
import Announcements from './components/Announcements.vue'
import FileConfig from './components/FileConfig.vue'
import MessageTemplates from './components/MessageTemplates.vue'
import MessageRecords from './components/MessageRecords.vue'
import EmailConfig from './components/EmailConfig.vue'
import SmsConfig from './components/SmsConfig.vue'
import ThirdPartyIntegration from './components/ThirdPartyIntegration.vue'
import WebhookConfig from './components/WebhookConfig.vue'

// 左侧菜单项
const menuItems = [
  { key: 'params', label: '系统参数' },
  { key: 'announcements', label: '系统公告' },
  { key: 'file', label: '文件配置' },
  { key: 'templates', label: '消息模板' },
  { key: 'records', label: '消息记录' },
  { key: 'email', label: '邮件配置' },
  { key: 'sms', label: '短信配置' },
  { key: 'apps', label: '第三方集成' },
  { key: 'webhooks', label: 'Webhook配置' },
]

// 当前选中的菜单
const activeMenu = ref('params')
</script>

<style scoped>
.settings-basic-page {
  padding: 0;
  height: 100%;
}

.settings-layout {
  display: flex;
  height: 100%;
  gap: 0;
}

.settings-sidebar {
  width: 200px;
  background: #fff;
  border-right: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.sidebar-menu {
  padding: 16px 0;
}

.menu-item {
  padding: 12px 24px;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.menu-item:hover {
  background: #f5f5f5;
  color: #1890ff;
}

.menu-item.active {
  background: #e6f7ff;
  color: #1890ff;
  border-left-color: #1890ff;
  font-weight: 500;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  background: #f5f5f5;
}

.content-card {
  margin: 0;
  min-height: 100%;
}
</style>
