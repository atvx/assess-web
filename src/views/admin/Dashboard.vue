<template>
  <div class="dashboard-page">
    <!-- 欢迎信息 -->
    <div class="mb-8 p-6 rounded-lg card-shadow-sm theme-transition" style="background: var(--bg-primary)">
      <h2 class="text-3xl font-bold mb-2 theme-transition" style="color: var(--text-primary)">
        欢迎回来，{{ userStore.username }}！
      </h2>
      <p class="text-base theme-transition" style="color: var(--text-secondary)">
        这是您的工作台概览
      </p>
    </div>

    <!-- 数据统计卡片 -->
    <a-row :gutter="[24, 24]" class="mb-8">
      <a-col :xs="24" :sm="12" :md="6">
        <div class="p-6 rounded-lg card-shadow-sm theme-transition" style="background: var(--bg-primary)">
          <a-statistic title="总评审数" :value="156" suffix="个" />
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div class="p-6 rounded-lg card-shadow-sm theme-transition" style="background: var(--bg-primary)">
          <a-statistic title="进行中" :value="23" suffix="个">
            <template #prefix>
              <SyncOutlined :spin="true" />
            </template>
          </a-statistic>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div class="p-6 rounded-lg card-shadow-sm theme-transition" style="background: var(--bg-primary)">
          <a-statistic title="已完成" :value="120" suffix="个" />
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div class="p-6 rounded-lg card-shadow-sm theme-transition" style="background: var(--bg-primary)">
          <a-statistic title="待处理" :value="13" suffix="个" />
        </div>
      </a-col>
    </a-row>

    <!-- 快捷操作 -->
    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :md="16">
        <a-card :bordered="false" class="card-shadow rounded-lg theme-transition">
          <template #title>
            <h3 class="text-xl font-bold theme-transition" style="color: var(--text-primary)">
              最近评审
            </h3>
          </template>
          <a-list :data-source="recentReviews" item-layout="horizontal">
            <template #renderItem="{ item }">
              <a-list-item class="px-4 py-3">
                <a-list-item-meta>
                  <template #title>
                    <span class="font-medium" style="color: var(--text-primary)">
                      {{ item.title }}
                    </span>
                  </template>
                  <template #description>
                    <span style="color: var(--text-secondary)">
                      {{ item.description }}
                    </span>
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
        <a-card :bordered="false" class="card-shadow rounded-lg theme-transition">
          <template #title>
            <h3 class="text-xl font-bold theme-transition" style="color: var(--text-primary)">
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
