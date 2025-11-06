<template>
  <div class="dashboard-page">
    <!-- 欢迎信息 -->
    <a-card class="mb-6">
      <h2 class="text-2xl font-bold mb-2">欢迎回来，{{ userStore.username }}！</h2>
      <p class="text-gray-500">这是您的工作台概览</p>
    </a-card>

    <!-- 数据统计卡片 -->
    <a-row :gutter="[16, 16]" class="mb-6">
      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <a-statistic title="总评审数" :value="156" :value-style="{ color: '#3f8600' }">
            <template #prefix>
              <FileTextOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <a-statistic title="进行中" :value="23" :value-style="{ color: '#1890ff' }">
            <template #prefix>
              <SyncOutlined :spin="true" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <a-statistic title="已完成" :value="120" :value-style="{ color: '#52c41a' }">
            <template #prefix>
              <CheckCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <a-statistic title="待处理" :value="13" :value-style="{ color: '#faad14' }">
            <template #prefix>
              <ClockCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- 快捷操作 -->
    <a-row :gutter="[16, 16]" class="mb-6">
      <a-col :xs="24" :md="16">
        <a-card title="最近评审" :bordered="false">
          <a-list :data-source="recentReviews" item-layout="horizontal">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :title="item.title" :description="item.description" />
                <template #actions>
                  <a-tag :color="item.statusColor">{{ item.status }}</a-tag>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>

      <a-col :xs="24" :md="8">
        <a-card title="快捷操作" :bordered="false">
          <a-space direction="vertical" :style="{ width: '100%' }">
            <router-link to="/admin/review/create">
              <a-button type="primary" block size="large">
                <template #icon>
                  <PlusOutlined />
                </template>
                创建新评审
              </a-button>
            </router-link>
            <router-link to="/admin/review/list">
              <a-button block size="large">
                <template #icon>
                  <UnorderedListOutlined />
                </template>
                查看所有评审
              </a-button>
            </router-link>
            <router-link to="/admin/user/list">
              <a-button block size="large">
                <template #icon>
                  <TeamOutlined />
                </template>
                用户管理
              </a-button>
            </router-link>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import {
  FileTextOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  TeamOutlined,
} from '@ant-design/icons-vue'

const userStore = useUserStore()

// 模拟最近评审数据
const recentReviews = ref([
  {
    title: '前端代码评审',
    description: '2025-01-05 创建',
    status: '进行中',
    statusColor: 'blue',
  },
  {
    title: '产品需求评审',
    description: '2025-01-04 创建',
    status: '已完成',
    statusColor: 'green',
  },
  {
    title: '设计稿评审',
    description: '2025-01-03 创建',
    status: '待处理',
    statusColor: 'orange',
  },
])
</script>
