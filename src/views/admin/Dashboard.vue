<template>
  <div class="dashboard-page">
    <!-- 欢迎信息 -->
    <div class="mb-8 p-6 rounded-lg bg-white dark:bg-gray-900 shadow-sm">
      <h2 class="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        欢迎回来，{{ userStore.username }}！
      </h2>
      <p class="text-base text-gray-600 dark:text-gray-400">
        这是您的工作台概览
      </p>
    </div>

    <!-- 数据统计卡片 -->
    <a-row :gutter="[24, 24]" class="mb-8">
      <a-col :xs="24" :sm="12" :md="6">
        <div class="p-6 rounded-lg bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
          <a-statistic title="总评审数" :value="156" suffix="个" />
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div class="p-6 rounded-lg bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
          <a-statistic title="进行中" :value="23" suffix="个">
            <template #prefix>
              <SyncOutlined :spin="true" />
            </template>
          </a-statistic>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div class="p-6 rounded-lg bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
          <a-statistic title="已完成" :value="120" suffix="个" />
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div class="p-6 rounded-lg bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
          <a-statistic title="待处理" :value="13" suffix="个" />
        </div>
      </a-col>
    </a-row>

    <!-- 快捷操作 -->
    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :md="16">
        <a-card :bordered="false" class="rounded-lg shadow">
          <template #title>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              最近评审
            </h3>
          </template>
          <a-list :data-source="recentReviews" item-layout="horizontal">
            <template #renderItem="{ item }">
              <a-list-item class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <a-list-item-meta>
                  <template #title>
                    <span class="font-medium">
                      {{ item.title }}
                    </span>
                  </template>
                  <template #description>
                    {{ item.description }}
                  </template>
                </a-list-item-meta>
                <template #actions>
                  <a-tag :color="item.statusColor">{{ item.status }}</a-tag>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>

      <a-col :xs="24" :md="8">
        <a-card :bordered="false" class="rounded-lg shadow">
          <template #title>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              快捷操作
            </h3>
          </template>
          <a-space direction="vertical" :style="{ width: '100%' }" :size="16">
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
