<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="review-progress-page">
    <!-- 页面标题 -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">评审进度</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {{ isAdmin ? '监控所有评审任务的进度和专家工作量' : '查看我的评审进度和任务状态' }}
        </p>
      </div>
      <a-space v-if="isAdmin">
        <a-button @click="handleRefresh">
          <template #icon><ReloadOutlined /></template>
          刷新数据
        </a-button>
        <a-button type="primary" @click="handleExport">
          <template #icon><ExportOutlined /></template>
          导出报表
        </a-button>
      </a-space>
    </div>

    <!-- 管理员视图 -->
    <div v-if="isAdmin">
      <!-- 进度总览 -->
      <a-card title="进度总览" :bordered="false" class="mb-4">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-statistic
              title="整体完成度"
              :value="overallProgress.completion"
              suffix="%"
              :value-style="{ color: getProgressColor(overallProgress.completion) }"
            >
              <template #prefix>
                <PieChartOutlined />
              </template>
            </a-statistic>
            <a-progress
              :percent="overallProgress.completion"
              :status="overallProgress.completion >= 80 ? 'success' : 'active'"
              class="mt-2"
            />
          </a-col>
          <a-col :span="6">
            <a-statistic
              title="已完成评审"
              :value="overallProgress.completed"
              suffix="个"
            >
              <template #prefix>
                <CheckCircleOutlined />
              </template>
            </a-statistic>
            <div class="text-xs text-gray-500 mt-2">
              总计 {{ overallProgress.total }} 个
            </div>
          </a-col>
          <a-col :span="6">
            <a-statistic
              title="进行中"
              :value="overallProgress.ongoing"
              suffix="个"
              :value-style="{ color: '#1890ff' }"
            >
              <template #prefix>
                <SyncOutlined spin />
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="6">
            <a-statistic
              title="预期完成时间"
              :value="overallProgress.expectedDate"
            >
              <template #prefix>
                <ClockCircleOutlined />
              </template>
            </a-statistic>
          </a-col>
        </a-row>

        <a-divider>各阶段进度</a-divider>
        <a-row :gutter="16">
          <a-col
            :span="8"
            v-for="stage in stageProgress"
            :key="stage.name"
          >
            <a-card :bordered="false" size="small">
              <div class="text-center">
                <a-tag :color="getRoundColor(stage.key)" size="large">
                  {{ stage.name }}
                </a-tag>
                <div class="mt-3">
                  <div class="text-2xl font-bold" :style="{ color: getProgressColor(stage.progress) }">
                    {{ stage.progress }}%
                  </div>
                  <a-progress
                    :percent="stage.progress"
                    :size="'small'"
                    :show-info="false"
                    class="mt-2"
                  />
                  <div class="text-xs text-gray-500 mt-2">
                    {{ stage.completed }}/{{ stage.total }} 已完成
                  </div>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-card>

      <!-- 进度监控与预警 -->
      <a-card title="进度监控与预警" :bordered="false" class="mb-4">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-card :bordered="false" :hoverable="true" @click="handleViewAlerts('overdue')">
              <a-statistic
                title="超期任务"
                :value="alerts.overdue"
                suffix="个"
                :value-style="{ color: '#ff4d4f' }"
              >
                <template #prefix>
                  <ExclamationCircleOutlined />
                </template>
              </a-statistic>
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card :bordered="false" :hoverable="true" @click="handleViewAlerts('delayed')">
              <a-statistic
                title="进度落后"
                :value="alerts.delayed"
                suffix="个"
                :value-style="{ color: '#faad14' }"
              >
                <template #prefix>
                  <WarningOutlined />
                </template>
              </a-statistic>
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card :bordered="false" :hoverable="true" @click="handleViewAlerts('unbalanced')">
              <a-statistic
                title="工作量不均衡"
                :value="alerts.unbalanced"
                suffix="人"
                :value-style="{ color: '#1890ff' }"
              >
                <template #prefix>
                  <TeamOutlined />
                </template>
              </a-statistic>
            </a-card>
          </a-col>
        </a-row>

        <a-divider>预警详情</a-divider>
        <a-list
          :data-source="alertDetails"
          :pagination="false"
          size="small"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <template #actions>
                <a-button type="link" size="small" @click="handleViewAlertDetail(item)">
                  查看详情
                </a-button>
                <a-button
                  type="link"
                  size="small"
                  v-if="item.type === 'overdue' || item.type === 'delayed'"
                  @click="handleForcePush(item)"
                >
                  强制推进
                </a-button>
              </template>
              <a-list-item-meta>
                <template #avatar>
                  <a-avatar :style="{ backgroundColor: getAlertColor(item.type) }">
                    <ExclamationCircleOutlined v-if="item.type === 'overdue'" />
                    <WarningOutlined v-else-if="item.type === 'delayed'" />
                    <TeamOutlined v-else />
                  </a-avatar>
                </template>
                <template #title>
                  <a-tag :color="getAlertColor(item.type)">
                    {{ getAlertLabel(item.type) }}
                  </a-tag>
                  {{ item.title }}
                </template>
                <template #description>
                  {{ item.description }}
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-card>

      <!-- 详细进度查询 -->
      <a-card title="详细进度查询" :bordered="false">
        <a-tabs v-model:activeKey="adminActiveTab" type="card">
          <!-- 按活动查看 -->
          <a-tab-pane key="activity" tab="按活动">
            <div class="mb-4">
              <a-input-search
                v-model:value="activitySearchKeyword"
                placeholder="搜索活动名称"
                style="width: 300px"
                @search="handleActivitySearch"
              />
            </div>

            <a-table
              :columns="activityColumns"
              :data-source="activityProgressList"
              :loading="activityLoading"
              :pagination="activityPagination"
              row-key="id"
              @change="handleActivityTableChange"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'activity'">
                  <div>
                    <div class="font-medium text-gray-900 dark:text-gray-100">
                      {{ record.name }}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                      {{ record.round }}
                    </div>
                  </div>
                </template>
                <template v-else-if="column.key === 'progress'">
                  <div>
                    <a-progress
                      :percent="record.progress"
                      :size="'small'"
                    />
                    <div class="text-xs text-gray-500 text-center mt-1">
                      {{ record.completed }}/{{ record.total }}
                    </div>
                  </div>
                </template>
                <template v-else-if="column.key === 'status'">
                  <a-tag :color="getStatusColor(record.status)">
                    {{ record.status }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-space>
                    <a-button type="link" size="small" @click="handleViewActivityDetail(record)">
                      <EyeOutlined />
                      详情
                    </a-button>
                  </a-space>
                </template>
              </template>
            </a-table>
          </a-tab-pane>

          <!-- 按专家查看 -->
          <a-tab-pane key="expert" tab="按专家">
            <div class="mb-4">
              <a-space>
                <a-input-search
                  v-model:value="expertSearchKeyword"
                  placeholder="搜索专家姓名"
                  style="width: 250px"
                  @search="handleExpertSearch"
                />
                <a-select
                  v-model:value="expertFilterStatus"
                  placeholder="工作状态"
                  allow-clear
                  style="width: 150px"
                >
                  <a-select-option value="overload">超载</a-select-option>
                  <a-select-option value="normal">正常</a-select-option>
                  <a-select-option value="idle">空闲</a-select-option>
                </a-select>
              </a-space>
            </div>

            <a-table
              :columns="expertColumns"
              :data-source="expertProgressList"
              :loading="expertLoading"
              :pagination="expertPagination"
              row-key="id"
              @change="handleExpertTableChange"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'expert'">
                  <div class="flex items-center">
                    <a-avatar :src="record.avatar" size="small" class="mr-2">
                      {{ record.name.substring(0, 1) }}
                    </a-avatar>
                    <div>
                      <div class="font-medium">{{ record.name }}</div>
                      <div class="text-xs text-gray-500">{{ record.organization }}</div>
                    </div>
                  </div>
                </template>
                <template v-else-if="column.key === 'workload'">
                  <div class="text-center">
                    <div class="font-medium">{{ record.completed }}/{{ record.total }}</div>
                    <a-progress
                      :percent="Math.round((record.completed / record.total) * 100)"
                      :size="'small'"
                      :show-info="false"
                      class="mt-1"
                    />
                  </div>
                </template>
                <template v-else-if="column.key === 'workStatus'">
                  <a-tag :color="getWorkStatusColor(record.workStatus)">
                    {{ getWorkStatusLabel(record.workStatus) }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'avgTime'">
                  {{ record.avgTime }}
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-space>
                    <a-button type="link" size="small" @click="handleViewExpertDetail(record)">
                      <EyeOutlined />
                      详情
                    </a-button>
                  </a-space>
                </template>
              </template>
            </a-table>
          </a-tab-pane>

          <!-- 按阶段查看 -->
          <a-tab-pane key="stage" tab="按阶段">
            <a-collapse v-model:activeKey="stageActiveKeys">
              <a-collapse-panel
                v-for="stage in stageProgressDetailed"
                :key="stage.key"
                :header="`${stage.name} - 完成度 ${stage.progress}%`"
              >
                <template #extra>
                  <a-tag :color="getRoundColor(stage.key)">
                    {{ stage.completed }}/{{ stage.total }}
                  </a-tag>
                </template>

                <a-table
                  :columns="stageTaskColumns"
                  :data-source="stage.tasks"
                  :pagination="false"
                  size="small"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'progress'">
                      <a-progress
                        :percent="record.progress"
                        :size="'small'"
                      />
                    </template>
                    <template v-else-if="column.key === 'status'">
                      <a-tag :color="getTaskStatusColor(record.status)">
                        {{ record.status }}
                      </a-tag>
                    </template>
                  </template>
                </a-table>
              </a-collapse-panel>
            </a-collapse>
          </a-tab-pane>
        </a-tabs>
      </a-card>

      <!-- 延期申请审批 -->
      <a-card title="延期申请" :bordered="false" class="mt-4" v-if="extensionRequests.length > 0">
        <a-list
          :data-source="extensionRequests"
          :pagination="false"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <template #actions>
                <a-button type="primary" size="small" @click="handleApproveExtension(item)">
                  <CheckOutlined />
                  批准
                </a-button>
                <a-button danger size="small" @click="handleRejectExtension(item)">
                  <CloseOutlined />
                  拒绝
                </a-button>
              </template>
              <a-list-item-meta>
                <template #avatar>
                  <a-avatar style="background-color: #faad14">
                    <ClockCircleOutlined />
                  </a-avatar>
                </template>
                <template #title>
                  <span class="font-medium">{{ item.taskName }}</span>
                  <a-tag color="blue" class="ml-2">{{ item.expertName }}</a-tag>
                </template>
                <template #description>
                  <div class="space-y-1">
                    <div class="text-sm">
                      <span class="text-gray-500">原截止时间：</span>{{ item.originalDeadline }}
                    </div>
                    <div class="text-sm">
                      <span class="text-gray-500">申请延期至：</span>{{ item.requestedDeadline }}
                    </div>
                    <div class="text-sm">
                      <span class="text-gray-500">申请理由：</span>{{ item.reason }}
                    </div>
                    <div class="text-sm text-gray-400">
                      申请时间：{{ item.requestedAt }}
                    </div>
                  </div>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-card>
    </div>

    <!-- 评审专家视图 -->
    <div v-else>
      <!-- 个人进度总览 -->
      <a-card title="我的评审进度" :bordered="false" class="mb-4">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-card :bordered="false">
              <a-statistic
                title="整体完成度"
                :value="myProgress.completion"
                suffix="%"
                :value-style="{ color: getProgressColor(myProgress.completion) }"
              >
                <template #prefix>
                  <PieChartOutlined />
                </template>
              </a-statistic>
              <a-progress
                :percent="myProgress.completion"
                :status="myProgress.completion >= 80 ? 'success' : 'active'"
                class="mt-2"
              />
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card :bordered="false">
              <a-statistic
                title="已完成"
                :value="myProgress.completed"
                suffix="个"
              >
                <template #prefix>
                  <CheckCircleOutlined />
                </template>
              </a-statistic>
              <div class="text-xs text-gray-500 mt-2">
                总计 {{ myProgress.total }} 个
              </div>
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card :bordered="false">
              <a-statistic
                title="待完成"
                :value="myProgress.remaining"
                suffix="个"
                :value-style="{ color: '#faad14' }"
              >
                <template #prefix>
                  <ClockCircleOutlined />
                </template>
              </a-statistic>
            </a-card>
          </a-col>
        </a-row>

        <a-divider>预期完成时间</a-divider>
        <div class="text-center">
          <div class="text-lg font-medium text-gray-700 dark:text-gray-300">
            {{ myProgress.expectedDate }}
          </div>
          <div class="text-sm text-gray-500 mt-1">
            按当前进度预计完成日期
          </div>
        </div>
      </a-card>

      <!-- 我的任务进度 -->
      <a-card title="任务进度详情" :bordered="false" class="mb-4">
        <a-table
          :columns="myTaskColumns"
          :data-source="myTaskProgressList"
          :loading="myTaskLoading"
          :pagination="myTaskPagination"
          row-key="id"
          @change="handleMyTaskTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'task'">
              <div>
                <div class="font-medium text-gray-900 dark:text-gray-100">
                  {{ record.taskName }}
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  {{ record.activityName }}
                </div>
              </div>
            </template>
            <template v-else-if="column.key === 'progress'">
              <div>
                <a-progress
                  :percent="record.progress"
                  :size="'small'"
                />
                <div class="text-xs text-gray-500 text-center mt-1">
                  {{ record.completed }}/{{ record.total }}
                </div>
              </div>
            </template>
            <template v-else-if="column.key === 'deadline'">
              <div :class="record.isOverdue ? 'text-red-500' : ''">
                {{ record.deadline }}
                <a-tag v-if="record.isOverdue" color="red" size="small" class="ml-2">
                  已超期
                </a-tag>
                <a-tag v-else-if="record.isUrgent" color="orange" size="small" class="ml-2">
                  即将到期
                </a-tag>
              </div>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a-button
                  type="link"
                  size="small"
                  @click="handleApplyExtension(record)"
                  v-if="!record.hasExtension"
                >
                  <ClockCircleOutlined />
                  申请延期
                </a-button>
                <a-tag v-else color="orange" size="small">
                  延期审批中
                </a-tag>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-card>

      <!-- 我的预警信息 -->
      <a-card title="提醒与预警" :bordered="false" v-if="myAlerts.length > 0">
        <a-list
          :data-source="myAlerts"
          :pagination="false"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta>
                <template #avatar>
                  <a-avatar :style="{ backgroundColor: getAlertColor(item.type) }">
                    <ExclamationCircleOutlined v-if="item.type === 'overdue'" />
                    <WarningOutlined v-else />
                  </a-avatar>
                </template>
                <template #title>
                  <a-tag :color="getAlertColor(item.type)">
                    {{ getAlertLabel(item.type) }}
                  </a-tag>
                  {{ item.title }}
                </template>
                <template #description>
                  {{ item.description }}
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-card>
    </div>

    <!-- 延期申请弹窗（评审专家） -->
    <a-modal
      v-model:open="extensionModalVisible"
      title="申请延期"
      width="600px"
      @ok="handleSubmitExtension"
      @cancel="extensionModalVisible = false"
    >
      <a-form
        ref="extensionFormRef"
        :model="extensionForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="任务名称">
          <span class="text-gray-700">{{ currentExtensionTask?.taskName }}</span>
        </a-form-item>

        <a-form-item label="当前截止时间">
          <span class="text-gray-700">{{ currentExtensionTask?.deadline }}</span>
        </a-form-item>

        <a-form-item
          label="申请延期至"
          name="requestedDeadline"
          :rules="[{ required: true, message: '请选择延期日期' }]"
        >
          <a-date-picker
            v-model:value="extensionForm.requestedDeadline"
            show-time
            class="w-full"
            :disabled-date="disabledDate"
          />
        </a-form-item>

        <a-form-item
          label="延期理由"
          name="reason"
          :rules="[{ required: true, message: '请输入延期理由' }]"
        >
          <a-textarea
            v-model:value="extensionForm.reason"
            :rows="4"
            placeholder="请详细说明延期原因..."
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 强制推进确认弹窗（管理员） -->
    <a-modal
      v-model:open="forcePushModalVisible"
      title="强制推进确认"
      width="600px"
      @ok="handleConfirmForcePush"
      @cancel="forcePushModalVisible = false"
    >
      <a-alert
        message="警告"
        description="强制推进将通知相关专家加快评审进度，并可能影响评审质量。请谨慎操作！"
        type="warning"
        show-icon
        class="mb-4"
      />

      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="推进对象">
          <span class="text-gray-700">{{ currentForcePushItem?.title }}</span>
        </a-form-item>

        <a-form-item label="推进方式">
          <a-radio-group v-model:value="forcePushForm.method">
            <a-space direction="vertical">
              <a-radio value="notify">发送通知提醒</a-radio>
              <a-radio value="reassign">重新分配任务</a-radio>
              <a-radio value="extend">延长截止时间</a-radio>
            </a-space>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="备注说明">
          <a-textarea
            v-model:value="forcePushForm.remark"
            :rows="3"
            placeholder="请输入备注说明..."
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import type { Dayjs } from 'dayjs'
import {
  ReloadOutlined,
  ExportOutlined,
  PieChartOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  TeamOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons-vue'

const userStore = useUserStore()

// 判断是否为管理员（简化判断，实际应根据角色权限）
const isAdmin = computed(() => {
  // 这里应该根据实际的角色判断逻辑
  // 例如：return userStore.userInfo?.role === 'admin' || userStore.userInfo?.role === 'manager'
  return true // 默认显示管理员视图，实际使用时需要替换
})

// 管理员视图 - 总体进度
const overallProgress = reactive({
  completion: 72,
  completed: 156,
  total: 216,
  ongoing: 45,
  expectedDate: '2025-02-15',
})

// 各阶段进度
const stageProgress = ref([
  {
    key: 'preliminary',
    name: '初审',
    progress: 85,
    completed: 120,
    total: 141,
  },
  {
    key: 'semifinal',
    name: '复审',
    progress: 62,
    completed: 31,
    total: 50,
  },
  {
    key: 'final',
    name: '终审',
    progress: 20,
    completed: 5,
    total: 25,
  },
])

// 预警统计
const alerts = reactive({
  overdue: 8,
  delayed: 12,
  unbalanced: 5,
})

// 预警详情
const alertDetails = ref([
  {
    id: '1',
    type: 'overdue',
    title: '2025创新大赛初审任务',
    description: '专家李教授有3个作品超期未评审，已超期2天',
  },
  {
    id: '2',
    type: 'delayed',
    title: '优秀项目评审-复审',
    description: '专家王专家进度落后，当前完成率30%，低于平均水平',
  },
  {
    id: '3',
    type: 'unbalanced',
    title: '工作量分配不均',
    description: '专家张工程师当前任务量为25个，远超平均值15个',
  },
])

// 管理员标签页
const adminActiveTab = ref('activity')

// 按活动查看
const activitySearchKeyword = ref('')
const activityLoading = ref(false)
const activityProgressList = ref([
  {
    id: '1',
    name: '2025年度创新设计大赛',
    round: '初审',
    progress: 78,
    completed: 85,
    total: 109,
    status: '进行中',
    deadline: '2025-01-25 18:00',
  },
  {
    id: '2',
    name: '优秀项目评审活动',
    round: '复审',
    progress: 45,
    completed: 18,
    total: 40,
    status: '进行中',
    deadline: '2025-02-10 18:00',
  },
])

const activityColumns = [
  { title: '活动信息', key: 'activity', width: 250 },
  { title: '进度', key: 'progress', width: 200 },
  { title: '截止时间', dataIndex: 'deadline', key: 'deadline', width: 180 },
  { title: '状态', key: 'status', width: 120, align: 'center' as const },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
]

const activityPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 2,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

// 按专家查看
const expertSearchKeyword = ref('')
const expertFilterStatus = ref<string | undefined>()
const expertLoading = ref(false)
const expertProgressList = ref([
  {
    id: '1',
    name: '李教授',
    avatar: '',
    organization: '清华大学',
    completed: 45,
    total: 50,
    workStatus: 'normal',
    avgTime: '2.5小时/个',
    overdue: 3,
  },
  {
    id: '2',
    name: '王专家',
    avatar: '',
    organization: '北京大学',
    completed: 12,
    total: 40,
    workStatus: 'delayed',
    avgTime: '3.8小时/个',
    overdue: 0,
  },
  {
    id: '3',
    name: '张工程师',
    avatar: '',
    organization: '阿里巴巴',
    completed: 8,
    total: 25,
    workStatus: 'overload',
    avgTime: '4.2小时/个',
    overdue: 5,
  },
])

const expertColumns = [
  { title: '专家', key: 'expert', width: 200 },
  { title: '工作量', key: 'workload', width: 150, align: 'center' as const },
  { title: '工作状态', key: 'workStatus', width: 120, align: 'center' as const },
  { title: '平均用时', key: 'avgTime', width: 120 },
  { title: '超期数', dataIndex: 'overdue', key: 'overdue', width: 100, align: 'center' as const },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
]

const expertPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 3,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

// 按阶段查看
const stageActiveKeys = ref(['preliminary'])
const stageProgressDetailed = ref([
  {
    key: 'preliminary',
    name: '初审',
    progress: 85,
    completed: 120,
    total: 141,
    tasks: [
      { taskName: '2025创新大赛初审', progress: 80, status: '进行中', expertCount: 10 },
      { taskName: '优秀项目初评', progress: 90, status: '进行中', expertCount: 8 },
    ],
  },
  {
    key: 'semifinal',
    name: '复审',
    progress: 62,
    completed: 31,
    total: 50,
    tasks: [
      { taskName: '优秀项目复审', progress: 62, status: '进行中', expertCount: 5 },
    ],
  },
  {
    key: 'final',
    name: '终审',
    progress: 20,
    completed: 5,
    total: 25,
    tasks: [
      { taskName: '创新设计终审', progress: 20, status: '待开始', expertCount: 3 },
    ],
  },
])

const stageTaskColumns = [
  { title: '任务名称', dataIndex: 'taskName', key: 'taskName', width: 250 },
  { title: '进度', key: 'progress', width: 200 },
  { title: '专家人数', dataIndex: 'expertCount', key: 'expertCount', width: 100, align: 'center' as const },
  { title: '状态', key: 'status', width: 120, align: 'center' as const },
]

// 延期申请列表（管理员审批）
const extensionRequests = ref([
  {
    id: '1',
    taskName: '2025创新大赛初审任务',
    expertName: '李教授',
    originalDeadline: '2025-01-25 18:00',
    requestedDeadline: '2025-01-28 18:00',
    reason: '临时有重要学术会议需要参加，预计1月27日返回后继续评审',
    requestedAt: '2025-01-23 10:30',
  },
])

// 评审专家视图 - 个人进度
const myProgress = reactive({
  completion: 65,
  completed: 13,
  total: 20,
  remaining: 7,
  expectedDate: '2025-01-28',
})

// 我的任务进度
const myTaskLoading = ref(false)
const myTaskProgressList = ref([
  {
    id: '1',
    taskName: '2025创新大赛初审任务',
    activityName: '2025年度创新设计大赛',
    progress: 70,
    completed: 12,
    total: 17,
    deadline: '2025-01-25 18:00',
    isOverdue: false,
    isUrgent: true,
    hasExtension: false,
  },
  {
    id: '2',
    taskName: '优秀项目评审-复审',
    activityName: '优秀项目评审活动',
    progress: 33,
    completed: 1,
    total: 3,
    deadline: '2025-02-10 18:00',
    isOverdue: false,
    isUrgent: false,
    hasExtension: false,
  },
])

const myTaskColumns = [
  { title: '任务信息', key: 'task', width: 300 },
  { title: '进度', key: 'progress', width: 200 },
  { title: '截止时间', key: 'deadline', width: 200 },
  { title: '操作', key: 'action', width: 180, fixed: 'right' as const },
]

const myTaskPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 2,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

// 我的预警信息
const myAlerts = ref([
  {
    id: '1',
    type: 'urgent',
    title: '2025创新大赛初审任务即将到期',
    description: '该任务将于2天后到期，请抓紧完成剩余5个作品的评审',
  },
])

// 延期申请表单
const extensionModalVisible = ref(false)
const extensionFormRef = ref<FormInstance>()
const currentExtensionTask = ref<typeof myTaskProgressList.value[0] | null>(null)
const extensionForm = reactive({
  requestedDeadline: undefined as Dayjs | undefined,
  reason: '',
})

// 强制推进表单
const forcePushModalVisible = ref(false)
const currentForcePushItem = ref<typeof alertDetails.value[0] | null>(null)
const forcePushForm = reactive({
  method: 'notify',
  remark: '',
})

// 辅助函数
const getProgressColor = (progress: number) => {
  if (progress >= 80) return '#52c41a'
  if (progress >= 60) return '#1890ff'
  if (progress >= 40) return '#faad14'
  return '#ff4d4f'
}

const getRoundColor = (round: string) => {
  const colors = {
    preliminary: 'blue',
    semifinal: 'orange',
    final: 'red',
  }
  return colors[round as keyof typeof colors] || 'default'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '进行中': 'blue',
    '已完成': 'green',
    '待开始': 'default',
    '已超期': 'red',
  }
  return colors[status] || 'default'
}

const getAlertColor = (type: string) => {
  const colors = {
    overdue: '#ff4d4f',
    delayed: '#faad14',
    unbalanced: '#1890ff',
    urgent: '#faad14',
  }
  return colors[type as keyof typeof colors] || '#8c8c8c'
}

const getAlertLabel = (type: string) => {
  const labels = {
    overdue: '超期',
    delayed: '进度落后',
    unbalanced: '工作量不均',
    urgent: '紧急',
  }
  return labels[type as keyof typeof labels] || type
}

const getWorkStatusColor = (status: string) => {
  const colors = {
    normal: 'green',
    delayed: 'orange',
    overload: 'red',
    idle: 'blue',
  }
  return colors[status as keyof typeof colors] || 'default'
}

const getWorkStatusLabel = (status: string) => {
  const labels = {
    normal: '正常',
    delayed: '进度落后',
    overload: '超载',
    idle: '空闲',
  }
  return labels[status as keyof typeof labels] || status
}

const getTaskStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '进行中': 'blue',
    '已完成': 'green',
    '待开始': 'default',
  }
  return colors[status] || 'default'
}

const disabledDate = (current: Dayjs) => {
  // 只能选择未来的日期
  return current && current.valueOf() < Date.now()
}

// 事件处理
const handleRefresh = () => {
  message.success('数据已刷新')
}

const handleExport = () => {
  message.success('导出功能待实现')
}

const handleViewAlerts = (type: string) => {
  adminActiveTab.value = 'expert'
  if (type === 'overdue') {
    message.info('查看超期任务')
  } else if (type === 'delayed') {
    message.info('查看进度落后任务')
  } else if (type === 'unbalanced') {
    message.info('查看工作量不均衡专家')
  }
}

const handleViewAlertDetail = (alert: typeof alertDetails.value[0]) => {
  message.info(`查看预警详情: ${alert.title}`)
}

const handleForcePush = (alert: typeof alertDetails.value[0]) => {
  currentForcePushItem.value = alert
  forcePushForm.method = 'notify'
  forcePushForm.remark = ''
  forcePushModalVisible.value = true
}

const handleConfirmForcePush = () => {
  if (!currentForcePushItem.value) return
  
  message.success('强制推进操作已执行，已通知相关专家')
  forcePushModalVisible.value = false
  
  // 从预警列表中移除
  const index = alertDetails.value.findIndex((a) => a.id === currentForcePushItem.value?.id)
  if (index > -1) {
    alertDetails.value.splice(index, 1)
    
    // 更新统计
    const type = currentForcePushItem.value.type as keyof typeof alerts
    if (alerts[type] > 0) {
      alerts[type]--
    }
  }
}

const handleActivitySearch = () => {
  message.info('搜索功能待实现')
}

const handleActivityTableChange = (pag: typeof activityPagination) => {
  activityPagination.current = pag.current
  activityPagination.pageSize = pag.pageSize
}

const handleViewActivityDetail = (activity: typeof activityProgressList.value[0]) => {
  message.info(`查看活动详情: ${activity.name}`)
}

const handleExpertSearch = () => {
  message.info('搜索功能待实现')
}

const handleExpertTableChange = (pag: typeof expertPagination) => {
  expertPagination.current = pag.current
  expertPagination.pageSize = pag.pageSize
}

const handleViewExpertDetail = (expert: typeof expertProgressList.value[0]) => {
  message.info(`查看专家详情: ${expert.name}`)
}

const handleApproveExtension = (request: typeof extensionRequests.value[0]) => {
  Modal.confirm({
    title: '批准延期申请',
    content: `确定要批准「${request.expertName}」的延期申请吗？截止时间将延长至 ${request.requestedDeadline}`,
    okText: '批准',
    cancelText: '取消',
    onOk: () => {
      const index = extensionRequests.value.findIndex((r) => r.id === request.id)
      if (index > -1) {
        extensionRequests.value.splice(index, 1)
        message.success('延期申请已批准')
      }
    },
  })
}

const handleRejectExtension = (request: typeof extensionRequests.value[0]) => {
  Modal.confirm({
    title: '拒绝延期申请',
    content: `确定要拒绝「${request.expertName}」的延期申请吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      const index = extensionRequests.value.findIndex((r) => r.id === request.id)
      if (index > -1) {
        extensionRequests.value.splice(index, 1)
        message.success('延期申请已拒绝')
      }
    },
  })
}

const handleMyTaskTableChange = (pag: typeof myTaskPagination) => {
  myTaskPagination.current = pag.current
  myTaskPagination.pageSize = pag.pageSize
}

const handleApplyExtension = (task: typeof myTaskProgressList.value[0]) => {
  currentExtensionTask.value = task
  extensionForm.requestedDeadline = undefined
  extensionForm.reason = ''
  extensionModalVisible.value = true
}

const handleSubmitExtension = async () => {
  try {
    await extensionFormRef.value?.validate()
    
    if (!currentExtensionTask.value) return
    
    // 标记任务为延期申请中
    currentExtensionTask.value.hasExtension = true
    
    message.success('延期申请已提交，等待管理员审批')
    extensionModalVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style scoped>
.review-progress-page {
  padding: 0;
}

:deep(.ant-card-hoverable) {
  cursor: pointer;
  transition: all 0.3s;
}

:deep(.ant-card-hoverable:hover) {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
