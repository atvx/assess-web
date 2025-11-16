<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="dashboard-page">
    <!-- 欢迎信息 -->
    <div class="mb-6 p-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 shadow-lg">
      <h2 class="text-3xl font-bold mb-2 text-white">
        欢迎回来，{{ userStore.realName || userStore.username }}！
      </h2>
      <p class="text-base text-blue-100">
        {{ greeting }}，今天是 {{ currentDate }}
      </p>
    </div>

    <!-- 关键指标卡片 -->
    <a-row :gutter="[16, 16]" class="mb-6">
      <a-col :xs="24" :sm="12" :lg="8" :xl="4">
        <a-card :bordered="false" class="stat-card" @click="navigateTo('/admin/activity/list')">
          <a-statistic
            title="活动总数"
            :value="statistics.totalActivities"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <CalendarOutlined />
            </template>
          </a-statistic>
          <div class="stat-footer">
            <span class="text-green-600">
              <ArrowUpOutlined /> {{ statistics.activeActivities }} 进行中
            </span>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="8" :xl="4">
        <a-card :bordered="false" class="stat-card" @click="navigateTo('/admin/participant/list')">
          <a-statistic
            title="参赛者"
            :value="statistics.totalParticipants"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix>
              <TeamOutlined />
            </template>
          </a-statistic>
          <div class="stat-footer">
            <span class="text-blue-600">
              今日新增 {{ statistics.todayParticipants }}
            </span>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="8" :xl="4">
        <a-card :bordered="false" class="stat-card" @click="navigateTo('/admin/participant/list')">
          <a-statistic
            title="作品数量"
            :value="statistics.totalWorks"
            :value-style="{ color: '#722ed1' }"
          >
            <template #prefix>
              <FileTextOutlined />
            </template>
          </a-statistic>
          <div class="stat-footer">
            <span class="text-purple-600">
              待审核 {{ statistics.pendingWorks }}
            </span>
        </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="8" :xl="4">
        <a-card :bordered="false" class="stat-card" @click="navigateTo('/admin/review/progress')">
          <a-statistic
            title="评审进度"
            :value="statistics.reviewProgress"
            suffix="%"
            :value-style="{ color: '#fa8c16' }"
          >
            <template #prefix>
              <CheckCircleOutlined />
            </template>
          </a-statistic>
          <div class="stat-footer">
            <a-progress
              :percent="statistics.reviewProgress"
              :show-info="false"
              :stroke-color="{ '0%': '#fa8c16', '100%': '#faad14' }"
            />
        </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="8" :xl="4">
        <a-card :bordered="false" class="stat-card" @click="navigateTo('/admin/review/my')">
          <a-statistic
            title="待办任务"
            :value="statistics.pendingTasks"
            :value-style="{ color: '#f5222d' }"
          >
            <template #prefix>
              <ClockCircleOutlined />
            </template>
          </a-statistic>
          <div class="stat-footer">
            <span class="text-red-600">
              紧急 {{ statistics.urgentTasks }} 项
            </span>
        </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="8" :xl="4">
        <a-card :bordered="false" class="stat-card" @click="navigateTo('/admin/message/my')">
          <a-statistic
            title="未读消息"
            :value="statistics.unreadMessages"
            :value-style="{ color: '#13c2c2' }"
          >
            <template #prefix>
              <BellOutlined />
            </template>
          </a-statistic>
          <div class="stat-footer">
            <span class="text-cyan-600">
              系统通知 {{ statistics.systemNotices }}
            </span>
        </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 中间内容区 -->
    <a-row :gutter="[16, 16]" class="mb-6">
      <!-- 左侧：数据趋势图表 -->
      <a-col :xs="24" :lg="16">
        <!-- 活动趋势图 -->
        <a-card :bordered="false" class="mb-4 rounded-lg shadow" title="活动趋势">
          <template #extra>
            <a-radio-group v-model:value="trendPeriod" size="small">
              <a-radio-button value="week">近7天</a-radio-button>
              <a-radio-button value="month">近30天</a-radio-button>
              <a-radio-button value="year">近一年</a-radio-button>
            </a-radio-group>
          </template>
          <div class="chart-container">
            <a-empty v-if="!chartData.activity.length" description="暂无数据" />
            <div v-else class="h-64 flex items-center justify-center text-gray-400">
              <!-- 图表占位区域，后续可集成 ECharts -->
              <div class="text-center">
                <LineChartOutlined style="font-size: 48px" />
                <p class="mt-2">图表数据加载中...</p>
                <p class="text-sm">可集成 ECharts 或 Chart.js 展示数据</p>
              </div>
            </div>
          </div>
        </a-card>

        <!-- 评审进度统计 -->
        <a-card :bordered="false" class="rounded-lg shadow" title="评审进度统计">
          <a-row :gutter="16">
            <a-col :span="12">
              <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ statistics.totalReviews }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">总评审任务</div>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ statistics.completedReviews }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">已完成</div>
              </div>
            </a-col>
            <a-col :span="12" class="mt-4">
              <div class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div class="text-2xl font-bold text-orange-600">{{ statistics.inProgressReviews }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">进行中</div>
              </div>
            </a-col>
            <a-col :span="12" class="mt-4">
              <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div class="text-2xl font-bold text-red-600">{{ statistics.overdueReviews }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">已逾期</div>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>

      <!-- 右侧：待办任务和系统通知 -->
      <a-col :xs="24" :lg="8">
        <!-- 待办任务 -->
        <a-card
          :bordered="false"
          class="mb-4 rounded-lg shadow"
          title="待办任务"
          :extra="pendingTasks.length > 0 ? `共 ${pendingTasks.length} 项` : ''"
        >
          <template #extra>
            <a-button type="link" size="small" @click="navigateTo('/admin/review/my')">
              查看全部
            </a-button>
          </template>
          <a-list
            v-if="pendingTasks.length > 0"
            :data-source="pendingTasks"
            size="small"
          >
            <template #renderItem="{ item }">
              <a-list-item class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                <a-list-item-meta>
                  <template #title>
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium">{{ item.title }}</span>
                      <a-tag :color="item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'orange' : 'default'" size="small">
                        {{ item.priorityText }}
                      </a-tag>
                    </div>
                  </template>
                  <template #description>
                    <div class="text-xs text-gray-500">
                      <ClockCircleOutlined class="mr-1" />
                      {{ item.deadline }}
                    </div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
          <a-empty v-else description="暂无待办任务" :image="Empty.PRESENTED_IMAGE_SIMPLE" />
        </a-card>

        <!-- 系统通知 -->
        <a-card
          :bordered="false"
          class="rounded-lg shadow"
          title="系统通知"
        >
          <template #extra>
            <a-button type="link" size="small" @click="navigateTo('/admin/message/my')">
              查看全部
            </a-button>
          </template>
          <a-list
            v-if="systemNotices.length > 0"
            :data-source="systemNotices"
            size="small"
          >
            <template #renderItem="{ item }">
              <a-list-item class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                <a-list-item-meta>
                  <template #avatar>
                    <a-badge dot :status="item.read ? 'default' : 'processing'">
                      <a-avatar :style="{ backgroundColor: item.color }">
                        <template #icon>
                          <component :is="item.icon" />
                        </template>
                      </a-avatar>
                    </a-badge>
                  </template>
                  <template #title>
                    <span class="text-sm" :class="{ 'font-medium': !item.read }">
                      {{ item.title }}
                    </span>
                  </template>
                  <template #description>
                    <div class="text-xs text-gray-500">{{ item.time }}</div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
          <a-empty v-else description="暂无系统通知" :image="Empty.PRESENTED_IMAGE_SIMPLE" />
        </a-card>
      </a-col>
    </a-row>

    <!-- 底部：快捷操作和最近活动 -->
    <a-row :gutter="[16, 16]">
      <!-- 快捷操作 -->
      <a-col :xs="24" :lg="8">
        <a-card :bordered="false" class="rounded-lg shadow" title="快捷操作">
          <a-space direction="vertical" :style="{ width: '100%' }" :size="12">
            <a-button type="primary" block @click="navigateTo('/admin/activity/list')">
                <template #icon>
                  <PlusOutlined />
                </template>
              创建新活动
            </a-button>
            <a-button block @click="navigateTo('/admin/participant/audit')">
              <template #icon>
                <AuditOutlined />
              </template>
              报名审核
              </a-button>
            <a-button block @click="navigateTo('/admin/review/task')">
                <template #icon>
                <CheckCircleOutlined />
                </template>
              评审任务分配
              </a-button>
            <a-button block @click="navigateTo('/admin/data/report')">
                <template #icon>
                <BarChartOutlined />
                </template>
              数据报表
              </a-button>
          </a-space>
        </a-card>
      </a-col>

      <!-- 最近活动 -->
      <a-col :xs="24" :lg="16">
        <a-card :bordered="false" class="rounded-lg shadow" title="最近活动">
          <a-list
            v-if="recentActivities.length > 0"
            :data-source="recentActivities"
            item-layout="horizontal"
          >
            <template #renderItem="{ item }">
              <a-list-item class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                <a-list-item-meta>
                  <template #avatar>
                    <a-avatar :style="{ backgroundColor: item.color }">
                      <template #icon>
                        <component :is="item.icon" />
                      </template>
                    </a-avatar>
                  </template>
                  <template #title>
                    <span class="font-medium">{{ item.title }}</span>
                  </template>
                  <template #description>
                    <div class="text-sm text-gray-500">
                      {{ item.description }} • {{ item.time }}
                    </div>
                  </template>
                </a-list-item-meta>
                <template #actions>
                  <a-tag :color="item.statusColor">{{ item.status }}</a-tag>
                  <a-button type="link" size="small">查看</a-button>
                </template>
              </a-list-item>
            </template>
          </a-list>
          <a-empty v-else description="暂无最近活动" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Empty } from 'ant-design-vue'
import {
  CalendarOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BellOutlined,
  PlusOutlined,
  AuditOutlined,
  BarChartOutlined,
  ArrowUpOutlined,
  LineChartOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  AlertOutlined,
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'

const router = useRouter()
const userStore = useUserStore()

// 问候语
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '凌晨好'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  if (hour < 22) return '晚上好'
  return '夜深了'
})

// 当前日期
const currentDate = computed(() => {
  return dayjs().format('YYYY年MM月DD日 dddd')
})

// 关键指标统计数据
const statistics = ref({
  totalActivities: 48,
  activeActivities: 12,
  totalParticipants: 1286,
  todayParticipants: 23,
  totalWorks: 856,
  pendingWorks: 45,
  reviewProgress: 68,
  pendingTasks: 15,
  urgentTasks: 3,
  unreadMessages: 8,
  systemNotices: 5,
  totalReviews: 156,
  completedReviews: 98,
  inProgressReviews: 45,
  overdueReviews: 13,
})

// 图表数据
const trendPeriod = ref('week')
const chartData = ref({
  activity: [1, 2, 3, 4, 5], // 模拟有数据
})

// 待办任务列表
const pendingTasks = ref([
  {
    id: 1,
    title: '2024年度创新大赛初审',
    priority: 'high',
    priorityText: '紧急',
    deadline: '2025-11-18 18:00',
  },
  {
    id: 2,
    title: '科技创新项目评审',
    priority: 'medium',
    priorityText: '普通',
    deadline: '2025-11-20 12:00',
  },
  {
    id: 3,
    title: '学生作品复审',
    priority: 'low',
    priorityText: '一般',
    deadline: '2025-11-25 17:00',
  },
  {
    id: 4,
    title: '企业创新项目终审',
    priority: 'high',
    priorityText: '紧急',
    deadline: '2025-11-19 15:00',
  },
  {
    id: 5,
    title: '参赛资格审核',
    priority: 'medium',
    priorityText: '普通',
    deadline: '2025-11-22 10:00',
  },
])

// 系统通知列表
const systemNotices = ref([
  {
    id: 1,
    title: '新的评审任务已分配',
    time: '5分钟前',
    read: false,
    icon: InfoCircleOutlined,
    color: '#1890ff',
  },
  {
    id: 2,
    title: '有3个报名申请待审核',
    time: '1小时前',
    read: false,
    icon: WarningOutlined,
    color: '#fa8c16',
  },
  {
    id: 3,
    title: '系统将于今晚22:00进行维护',
    time: '2小时前',
    read: true,
    icon: AlertOutlined,
    color: '#f5222d',
  },
  {
    id: 4,
    title: '本周评审进度报告已生成',
    time: '3小时前',
    read: true,
    icon: InfoCircleOutlined,
    color: '#52c41a',
  },
  {
    id: 5,
    title: '有新的参赛者完成报名',
    time: '5小时前',
    read: true,
    icon: InfoCircleOutlined,
    color: '#722ed1',
  },
])

// 最近活动列表
const recentActivities = ref([
  {
    id: 1,
    title: '2024年度创新创业大赛',
    description: '已有128人报名',
    status: '进行中',
    statusColor: 'blue',
    time: '2小时前更新',
    icon: CalendarOutlined,
    color: '#1890ff',
  },
  {
    id: 2,
    title: '全国大学生科技竞赛',
    description: '初审已完成',
    status: '评审中',
    statusColor: 'orange',
    time: '5小时前更新',
    icon: CalendarOutlined,
    color: '#fa8c16',
  },
  {
    id: 3,
    title: '青年创新项目评选',
    description: '报名截止',
    status: '已结束',
    statusColor: 'green',
    time: '1天前更新',
    icon: CalendarOutlined,
    color: '#52c41a',
  },
  {
    id: 4,
    title: '企业技术创新大赛',
    description: '正在招募评审专家',
    status: '筹备中',
    statusColor: 'default',
    time: '2天前更新',
    icon: CalendarOutlined,
    color: '#8c8c8c',
  },
])

// 路由跳转
const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.stat-card {
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.stat-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  font-size: 12px;
}

.dark .stat-footer {
  border-top-color: #303030;
}

.chart-container {
  min-height: 280px;
}
</style>
