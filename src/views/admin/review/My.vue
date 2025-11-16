<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="my-review-page">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">我的评审</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        查看评审任务、进行作品评审、管理评审记录
      </p>
    </div>

    <!-- 统计卡片 -->
    <a-row :gutter="16" class="mb-4">
      <a-col :span="6">
        <a-card :bordered="false" :hoverable="true" @click="handleFilterChange('pending')">
          <a-statistic
            title="待评审"
            :value="reviewStats.pending"
            :value-style="{ color: '#faad14' }"
          >
            <template #prefix>
              <ClockCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false" :hoverable="true" @click="handleFilterChange('ongoing')">
          <a-statistic
            title="进行中"
            :value="reviewStats.ongoing"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <SyncOutlined spin />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false" :hoverable="true" @click="handleFilterChange('completed')">
          <a-statistic
            title="已完成"
            :value="reviewStats.completed"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix>
              <CheckCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false" :hoverable="true" @click="handleFilterChange('draft')">
          <a-statistic
            title="草稿"
            :value="reviewStats.draft"
            :value-style="{ color: '#8c8c8c' }"
          >
            <template #prefix>
              <FileTextOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- 标签页 -->
    <a-card :bordered="false">
      <a-tabs v-model:activeKey="activeTab" type="card" size="large">
        <!-- 我的任务 -->
        <a-tab-pane key="tasks" tab="我的任务">
          <div class="mb-4">
            <a-space>
              <a-input-search
                v-model:value="taskSearchKeyword"
                placeholder="搜索任务名称"
                style="width: 250px"
                @search="handleTaskSearch"
              />
              <a-select
                v-model:value="taskQueryParams.status"
                placeholder="任务状态"
                allow-clear
                style="width: 150px"
              >
                <a-select-option value="pending">待评审</a-select-option>
                <a-select-option value="ongoing">进行中</a-select-option>
                <a-select-option value="completed">已完成</a-select-option>
              </a-select>
            </a-space>
          </div>

          <a-list
            :data-source="filteredTasks"
            :loading="tasksLoading"
            item-layout="horizontal"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <a-button type="link" @click="handleViewTaskDetail(item)">
                    <EyeOutlined />
                    查看详情
                  </a-button>
                  <a-button type="primary" @click="handleStartReview(item)">
                    <EditOutlined />
                    开始评审
                  </a-button>
                </template>
                <a-list-item-meta>
                  <template #avatar>
                    <a-avatar style="background-color: #1890ff">
                      {{ item.activityName.substring(0, 2) }}
                    </a-avatar>
                  </template>
                  <template #title>
                    <div class="flex items-center">
                      <span class="font-medium text-base">{{ item.taskName }}</span>
                      <a-tag :color="getStatusColor(item.status)" class="ml-2">
                        {{ getStatusLabel(item.status) }}
                      </a-tag>
                      <a-tag :color="getRoundColor(item.round)" class="ml-2">
                        {{ getRoundLabel(item.round) }}
                      </a-tag>
                    </div>
                  </template>
                  <template #description>
                    <div class="space-y-1">
                      <div class="text-sm">
                        <span class="text-gray-500">活动：</span>{{ item.activityName }}
                      </div>
                      <div class="text-sm">
                        <span class="text-gray-500">进度：</span>
                        <a-progress
                          :percent="item.progress"
                          :size="'small'"
                          style="width: 200px; display: inline-block"
                          class="ml-2"
                        />
                        <span class="ml-2">{{ item.completedCount }}/{{ item.totalCount }}</span>
                      </div>
                      <div class="text-sm">
                        <span class="text-gray-500">截止时间：</span>
                        <span :class="item.isUrgent ? 'text-red-500' : ''">
                          {{ item.deadline }}
                        </span>
                        <a-tag v-if="item.isUrgent" color="red" size="small" class="ml-2">
                          即将到期
                        </a-tag>
                      </div>
                    </div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-tab-pane>

        <!-- 待评审作品 -->
        <a-tab-pane key="pending" tab="待评审">
          <div class="mb-4 flex justify-between items-center">
            <a-space>
              <a-input-search
                v-model:value="workSearchKeyword"
                placeholder="搜索作品名称"
                style="width: 250px"
                @search="handleWorkSearch"
              />
              <a-select
                v-model:value="workQueryParams.taskId"
                placeholder="所属任务"
                allow-clear
                style="width: 200px"
              >
                <a-select-option value="1">2025创新大赛初审任务</a-select-option>
                <a-select-option value="2">优秀项目评审-复审</a-select-option>
              </a-select>
            </a-space>
            <a-button type="primary" @click="handleBatchReview" :disabled="selectedWorks.length === 0">
              <CheckOutlined />
              批量评审 ({{ selectedWorks.length }})
            </a-button>
          </div>

          <a-table
            :columns="pendingColumns"
            :data-source="pendingWorks"
            :loading="worksLoading"
            :pagination="pagination"
            :row-selection="{
              selectedRowKeys: selectedWorks,
              onChange: (keys: (string | number)[]) => { selectedWorks = keys as string[] }
            }"
            row-key="id"
            @change="handleTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'work'">
                <div>
                  <div class="font-medium text-gray-900 dark:text-gray-100">
                    {{ record.workTitle }}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    参赛者: {{ record.participantName }}
                  </div>
                  <div class="text-xs text-gray-500">
                    类别: {{ record.category }}
                  </div>
                </div>
              </template>
              <template v-else-if="column.key === 'task'">
                <div class="text-sm">
                  <div>{{ record.taskName }}</div>
                  <a-tag :color="getRoundColor(record.round)" size="small" class="mt-1">
                    {{ getRoundLabel(record.round) }}
                  </a-tag>
                </div>
              </template>
              <template v-else-if="column.key === 'deadline'">
                <div :class="record.isUrgent ? 'text-red-500' : ''">
                  {{ record.deadline }}
                </div>
              </template>
              <template v-else-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" size="small" @click="handlePreviewWork(record)">
                    <EyeOutlined />
                    预览
                  </a-button>
                  <a-button type="primary" size="small" @click="handleReviewWork(record)">
                    <EditOutlined />
                    评审
                  </a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <!-- 已评审 -->
        <a-tab-pane key="completed" tab="已评审">
          <div class="mb-4">
            <a-space>
              <a-input-search
                v-model:value="completedSearchKeyword"
                placeholder="搜索作品名称"
                style="width: 250px"
                @search="handleCompletedSearch"
              />
              <a-range-picker
                v-model:value="completedDateRange"
                :placeholder="['开始日期', '结束日期']"
              />
              <a-button @click="handleExportCompleted">
                <ExportOutlined />
                导出记录
              </a-button>
            </a-space>
          </div>

          <a-table
            :columns="completedColumns"
            :data-source="completedWorks"
            :loading="completedLoading"
            :pagination="completedPagination"
            row-key="id"
            @change="handleCompletedTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'work'">
                <div>
                  <div class="font-medium text-gray-900 dark:text-gray-100">
                    {{ record.workTitle }}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    参赛者: {{ record.participantName }}
                  </div>
                </div>
              </template>
              <template v-else-if="column.key === 'score'">
                <div class="text-center">
                  <div class="text-lg font-bold text-blue-600">{{ record.score }}</div>
                  <div class="text-xs text-gray-500">分</div>
                </div>
              </template>
              <template v-else-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" size="small" @click="handleViewReview(record)">
                    <EyeOutlined />
                    查看
                  </a-button>
                  <a-button type="link" size="small" @click="handleEditReview(record)">
                    <EditOutlined />
                    修改
                  </a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <!-- 草稿 -->
        <a-tab-pane key="draft" tab="草稿">
          <a-list
            :data-source="draftWorks"
            :loading="draftLoading"
            item-layout="horizontal"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <a-button type="link" @click="handleContinueReview(item)">
                    <EditOutlined />
                    继续编辑
                  </a-button>
                  <a-button type="link" danger @click="handleDeleteDraft(item)">
                    <DeleteOutlined />
                    删除
                  </a-button>
                </template>
                <a-list-item-meta>
                  <template #avatar>
                    <a-avatar style="background-color: #8c8c8c">
                      <FileTextOutlined />
                    </a-avatar>
                  </template>
                  <template #title>
                    {{ item.workTitle }}
                  </template>
                  <template #description>
                    <div class="space-y-1">
                      <div class="text-sm">
                        <span class="text-gray-500">任务：</span>{{ item.taskName }}
                      </div>
                      <div class="text-sm">
                        <span class="text-gray-500">保存时间：</span>{{ item.savedAt }}
                      </div>
                    </div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-tab-pane>

        <!-- 评审统计 -->
        <a-tab-pane key="statistics" tab="评审统计">
          <a-row :gutter="16" class="mb-6">
            <a-col :span="8">
              <a-card :bordered="false">
                <a-statistic
                  title="本月评审数"
                  :value="statistics.monthlyCount"
                  suffix="个"
                >
                  <template #prefix>
                    <CalendarOutlined />
                  </template>
                </a-statistic>
              </a-card>
            </a-col>
            <a-col :span="8">
              <a-card :bordered="false">
                <a-statistic
                  title="总评审数"
                  :value="statistics.totalCount"
                  suffix="个"
                >
                  <template #prefix>
                    <BarChartOutlined />
                  </template>
                </a-statistic>
              </a-card>
            </a-col>
            <a-col :span="8">
              <a-card :bordered="false">
                <a-statistic
                  title="平均评分"
                  :value="statistics.avgScore"
                  :precision="1"
                  suffix="分"
                >
                  <template #prefix>
                    <TrophyOutlined />
                  </template>
                </a-statistic>
              </a-card>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-card title="评审趋势" :bordered="false">
                <div class="h-64 flex items-center justify-center text-gray-400">
                  <BarChartOutlined class="text-4xl" />
                  <span class="ml-2">评审趋势图表（待集成 ECharts）</span>
                </div>
              </a-card>
            </a-col>
            <a-col :span="12">
              <a-card title="评分分布" :bordered="false">
                <div class="h-64 flex items-center justify-center text-gray-400">
                  <PieChartOutlined class="text-4xl" />
                  <span class="ml-2">评分分布图表（待集成 ECharts）</span>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 评审工作台抽屉 -->
    <a-drawer
      v-model:open="reviewDrawerVisible"
      title="评审工作台"
      width="900"
      :body-style="{ paddingBottom: '80px' }"
      :closable="false"
      :mask-closable="false"
    >
      <a-tabs v-model:activeKey="reviewTab" v-if="currentWork">
        <!-- 作品详情 -->
        <a-tab-pane key="detail" tab="作品详情">
          <a-descriptions bordered :column="2">
            <a-descriptions-item label="作品名称" :span="2">
              {{ currentWork.workTitle }}
            </a-descriptions-item>
            <a-descriptions-item label="参赛者">
              {{ currentWork.participantName }}
            </a-descriptions-item>
            <a-descriptions-item label="联系方式">
              {{ currentWork.participantPhone || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="作品类别">
              {{ currentWork.category }}
            </a-descriptions-item>
            <a-descriptions-item label="提交时间">
              {{ currentWork.submittedAt || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="作品描述" :span="2">
              {{ currentWork.description || '-' }}
            </a-descriptions-item>
          </a-descriptions>

          <a-divider>作品附件</a-divider>
          <a-list
            v-if="currentWork.attachments && currentWork.attachments.length > 0"
            :data-source="currentWork.attachments"
            bordered
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <a-button type="link" size="small" @click="handlePreviewAttachment(item)">
                    <EyeOutlined />
                    预览
                  </a-button>
                  <a-button type="link" size="small" @click="handleDownloadAttachment(item)">
                    <DownloadOutlined />
                    下载
                  </a-button>
                </template>
                <a-list-item-meta>
                  <template #avatar>
                    <FileOutlined style="font-size: 24px; color: #1890ff" />
                  </template>
                  <template #title>{{ item.name }}</template>
                  <template #description>
                    {{ item.size }} | 上传于 {{ item.uploadedAt }}
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
          <a-empty v-else description="暂无附件" />
        </a-tab-pane>

        <!-- 评分打分 -->
        <a-tab-pane key="score" tab="评分打分">
          <a-form
            ref="scoreFormRef"
            :model="scoreForm"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-divider orientation="left">评分项</a-divider>
            
            <a-form-item
              v-for="item in scoringItems"
              :key="item.id"
              :label="item.name"
              :name="['scores', item.id]"
              :rules="[{ required: true, message: `请为${item.name}打分` }]"
            >
              <div>
                <a-slider
                  v-model:value="scoreForm.scores[item.id]"
                  :min="0"
                  :max="item.maxScore"
                  :marks="generateMarks(item.maxScore)"
                  :tooltip="{ formatter: (value?: number) => `${value || 0}分` }"
                />
                <div class="text-xs text-gray-500 mt-2">
                  权重: {{ item.weight }}% | 满分: {{ item.maxScore }}分 | 
                  当前得分: {{ scoreForm.scores[item.id] || 0 }}分
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  说明: {{ item.description }}
                </div>
              </div>
            </a-form-item>

            <a-divider orientation="left">总分</a-divider>
            
            <a-form-item label="计算方式">
              <a-radio-group v-model:value="scoreForm.calculationMethod">
                <a-radio value="weighted">加权求和</a-radio>
                <a-radio value="average">简单平均</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="总分">
              <div class="text-2xl font-bold text-blue-600">
                {{ calculateTotalScore() }} 分
              </div>
              <a-progress
                :percent="(calculateTotalScore() / 100) * 100"
                :status="calculateTotalScore() >= 60 ? 'success' : 'exception'"
              />
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 评审意见 -->
        <a-tab-pane key="comment" tab="评审意见">
          <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-form-item label="评审等级">
              <a-rate v-model:value="scoreForm.rating" allow-half />
              <span class="ml-2 text-gray-500">{{ getRatingLabel(scoreForm.rating) }}</span>
            </a-form-item>

            <a-form-item label="优点">
              <a-textarea
                v-model:value="scoreForm.strengths"
                :rows="4"
                placeholder="请描述作品的优点..."
              />
            </a-form-item>

            <a-form-item label="不足">
              <a-textarea
                v-model:value="scoreForm.weaknesses"
                :rows="4"
                placeholder="请描述作品的不足..."
              />
            </a-form-item>

            <a-form-item label="改进建议">
              <a-textarea
                v-model:value="scoreForm.suggestions"
                :rows="4"
                placeholder="请给出改进建议..."
              />
            </a-form-item>

            <a-form-item label="综合评价">
              <a-textarea
                v-model:value="scoreForm.overallComment"
                :rows="6"
                placeholder="请输入综合评价..."
              />
            </a-form-item>

            <a-form-item label="快捷短语">
              <a-space wrap>
                <a-button
                  size="small"
                  v-for="phrase in quickPhrases"
                  :key="phrase"
                  @click="handleInsertPhrase(phrase)"
                >
                  {{ phrase }}
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 附件上传 -->
        <a-tab-pane key="upload" tab="附件上传">
          <a-alert
            message="评审附件"
            description="您可以上传评审过程中的相关附件，如评审表格、补充说明等"
            type="info"
            show-icon
            class="mb-4"
          />

          <a-upload
            v-model:file-list="scoreForm.reviewAttachments"
            :before-upload="() => false"
            :max-count="10"
            list-type="text"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
          >
            <a-button>
              <UploadOutlined />
              选择文件
            </a-button>
          </a-upload>

          <div class="mt-4 text-xs text-gray-500">
            <div>• 支持格式: PDF, Word, Excel, PPT, ZIP, RAR</div>
            <div>• 单个文件不超过 50MB</div>
            <div>• 最多上传 10 个文件</div>
          </div>
        </a-tab-pane>
      </a-tabs>

      <template #footer>
        <a-space>
          <a-button @click="handleCancelReview">
            <CloseOutlined />
            取消
          </a-button>
          <a-button @click="handleSaveDraft">
            <SaveOutlined />
            保存草稿
          </a-button>
          <a-button type="primary" @click="handleSubmitReview">
            <CheckOutlined />
            提交评审
          </a-button>
        </a-space>
      </template>
    </a-drawer>

    <!-- 作品预览抽屉 -->
    <a-drawer
      v-model:open="previewDrawerVisible"
      title="作品预览"
      width="800"
    >
      <div v-if="previewWork">
        <a-descriptions bordered :column="2">
          <a-descriptions-item label="作品名称" :span="2">
            {{ previewWork.workTitle }}
          </a-descriptions-item>
          <a-descriptions-item label="参赛者">
            {{ previewWork.participantName }}
          </a-descriptions-item>
          <a-descriptions-item label="类别">
            {{ previewWork.category }}
          </a-descriptions-item>
          <a-descriptions-item label="作品描述" :span="2">
            {{ previewWork.description || '-' }}
          </a-descriptions-item>
        </a-descriptions>

        <a-divider>作品附件</a-divider>
        <a-list
          v-if="previewWork.attachments && previewWork.attachments.length > 0"
          :data-source="previewWork.attachments"
          bordered
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <template #actions>
                <a-button type="link" size="small">
                  <EyeOutlined />
                  预览
                </a-button>
                <a-button type="link" size="small">
                  <DownloadOutlined />
                  下载
                </a-button>
              </template>
              <a-list-item-meta>
                <template #avatar>
                  <FileOutlined style="font-size: 24px; color: #1890ff" />
                </template>
                <template #title>{{ item.name }}</template>
                <template #description>{{ item.size }}</template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
        <a-empty v-else description="暂无附件" />
      </div>

      <template #footer>
        <a-space>
          <a-button @click="previewDrawerVisible = false">关闭</a-button>
          <a-button type="primary" @click="handleReviewWork(previewWork)">
            <EditOutlined />
            开始评审
          </a-button>
        </a-space>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import {
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  ExportOutlined,
  CalendarOutlined,
  BarChartOutlined,
  TrophyOutlined,
  PieChartOutlined,
  DownloadOutlined,
  FileOutlined,
  UploadOutlined,
  CloseOutlined,
  SaveOutlined,
} from '@ant-design/icons-vue'

// 统计数据
const reviewStats = reactive({
  pending: 12,
  ongoing: 5,
  completed: 38,
  draft: 3,
})

// 当前标签页
const activeTab = ref('tasks')

// 任务列表
const taskSearchKeyword = ref('')
const taskQueryParams = reactive({
  status: undefined as string | undefined,
})
const tasksLoading = ref(false)

const myTasks = ref([
  {
    id: '1',
    taskName: '2025创新大赛初审任务',
    activityName: '2025年度创新设计大赛',
    round: 'preliminary',
    status: 'ongoing',
    totalCount: 15,
    completedCount: 8,
    progress: 53,
    deadline: '2025-01-25 18:00',
    isUrgent: false,
  },
  {
    id: '2',
    taskName: '优秀项目评审-复审',
    activityName: '优秀项目评审活动',
    round: 'semifinal',
    status: 'pending',
    totalCount: 10,
    completedCount: 0,
    progress: 0,
    deadline: '2025-01-20 18:00',
    isUrgent: true,
  },
])

const filteredTasks = computed(() => {
  let tasks = myTasks.value
  
  if (taskQueryParams.status) {
    tasks = tasks.filter((t) => t.status === taskQueryParams.status)
  }
  
  if (taskSearchKeyword.value) {
    const keyword = taskSearchKeyword.value.toLowerCase()
    tasks = tasks.filter(
      (t) =>
        t.taskName.toLowerCase().includes(keyword) ||
        t.activityName.toLowerCase().includes(keyword)
    )
  }
  
  return tasks
})

// 待评审作品
const workSearchKeyword = ref('')
const workQueryParams = reactive({
  taskId: undefined as string | undefined,
})
const worksLoading = ref(false)
const selectedWorks = ref<string[]>([])

const pendingWorks = ref([
  {
    id: '1',
    workTitle: '智能交通管理系统',
    participantName: '张三',
    category: '计算机应用',
    taskName: '2025创新大赛初审任务',
    round: 'preliminary',
    deadline: '2025-01-25 18:00',
    isUrgent: false,
    participantPhone: '13800138001',
    submittedAt: '2025-01-10 14:30',
    description: '基于深度学习的智能交通管理系统...',
    attachments: [
      { name: '项目文档.pdf', size: '2.5 MB', uploadedAt: '2025-01-10 14:30' },
      { name: '演示视频.mp4', size: '35 MB', uploadedAt: '2025-01-10 14:32' },
    ],
  },
  {
    id: '2',
    workTitle: '在线教育平台',
    participantName: '李四',
    category: 'Web应用',
    taskName: '2025创新大赛初审任务',
    round: 'preliminary',
    deadline: '2025-01-25 18:00',
    isUrgent: false,
    participantPhone: '13900139002',
    submittedAt: '2025-01-11 09:15',
    description: '功能丰富的在线教育平台...',
    attachments: [
      { name: '系统设计文档.docx', size: '1.8 MB', uploadedAt: '2025-01-11 09:15' },
    ],
  },
])

const pendingColumns = [
  { title: '作品信息', key: 'work', width: 250 },
  { title: '所属任务', key: 'task', width: 200 },
  { title: '截止时间', key: 'deadline', width: 180 },
  { title: '操作', key: 'action', width: 180, fixed: 'right' as const },
]

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 2,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

// 已评审作品
const completedSearchKeyword = ref('')
const completedDateRange = ref([])
const completedLoading = ref(false)

const completedWorks = ref([
  {
    id: '1',
    workTitle: '智慧农业监控系统',
    participantName: '王五',
    taskName: '2024年终评审',
    round: 'final',
    score: 85,
    reviewedAt: '2025-01-15 16:30',
  },
  {
    id: '2',
    workTitle: '物联网家居系统',
    participantName: '赵六',
    taskName: '2024年终评审',
    round: 'final',
    score: 78,
    reviewedAt: '2025-01-14 10:20',
  },
])

const completedColumns = [
  { title: '作品信息', key: 'work', width: 250 },
  { title: '任务', dataIndex: 'taskName', key: 'taskName', width: 200 },
  { title: '评分', key: 'score', width: 100, align: 'center' as const },
  { title: '评审时间', dataIndex: 'reviewedAt', key: 'reviewedAt', width: 180 },
  { title: '操作', key: 'action', width: 150, fixed: 'right' as const },
]

const completedPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 2,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

// 草稿
const draftLoading = ref(false)
const draftWorks = ref([
  {
    id: '1',
    workTitle: '区块链溯源系统',
    taskName: '2025创新大赛初审任务',
    savedAt: '2025-01-16 14:22',
  },
])

// 评审统计
const statistics = reactive({
  monthlyCount: 15,
  totalCount: 156,
  avgScore: 82.5,
})

// 评审工作台
const reviewDrawerVisible = ref(false)
const reviewTab = ref('detail')
const currentWork = ref<typeof pendingWorks.value[0] | null>(null)
const scoreFormRef = ref<FormInstance>()

const scoringItems = ref([
  {
    id: 'innovation',
    name: '创新性',
    weight: 30,
    maxScore: 100,
    description: '作品的创新程度、独特性和原创性',
  },
  {
    id: 'technical',
    name: '技术实现',
    weight: 30,
    maxScore: 100,
    description: '技术难度、实现质量和代码规范',
  },
  {
    id: 'practical',
    name: '实用性',
    weight: 20,
    maxScore: 100,
    description: '实际应用价值和可落地性',
  },
  {
    id: 'presentation',
    name: '展示效果',
    weight: 20,
    maxScore: 100,
    description: '文档完整性、演示效果和用户体验',
  },
])

const scoreForm = reactive({
  scores: {} as Record<string, number>,
  calculationMethod: 'weighted',
  rating: 0,
  strengths: '',
  weaknesses: '',
  suggestions: '',
  overallComment: '',
  reviewAttachments: [] as unknown[],
})

const quickPhrases = [
  '技术实现优秀',
  '创新点突出',
  '文档完整',
  '需要改进',
  '建议优化',
  '值得推广',
]

// 作品预览
const previewDrawerVisible = ref(false)
const previewWork = ref<typeof pendingWorks.value[0] | null>(null)

// 辅助函数
const getStatusColor = (status: string) => {
  const colors = {
    pending: 'orange',
    ongoing: 'blue',
    completed: 'green',
  }
  return colors[status as keyof typeof colors] || 'default'
}

const getStatusLabel = (status: string) => {
  const labels = {
    pending: '待评审',
    ongoing: '进行中',
    completed: '已完成',
  }
  return labels[status as keyof typeof labels] || status
}

const getRoundColor = (round: string) => {
  const colors = {
    preliminary: 'blue',
    semifinal: 'orange',
    final: 'red',
  }
  return colors[round as keyof typeof colors] || 'default'
}

const getRoundLabel = (round: string) => {
  const labels = {
    preliminary: '初审',
    semifinal: '复审',
    final: '终审',
  }
  return labels[round as keyof typeof labels] || round
}

const getRatingLabel = (rating: number) => {
  if (rating >= 4.5) return '优秀'
  if (rating >= 3.5) return '良好'
  if (rating >= 2.5) return '中等'
  if (rating >= 1.5) return '及格'
  return '不及格'
}

const generateMarks = (maxScore: number) => {
  const marks: Record<number, string> = {}
  const step = maxScore / 4
  for (let i = 0; i <= 4; i++) {
    const value = Math.round(step * i)
    marks[value] = `${value}`
  }
  return marks
}

const calculateTotalScore = () => {
  if (scoreForm.calculationMethod === 'weighted') {
    let total = 0
    let weightSum = 0
    scoringItems.value.forEach((item) => {
      const score = scoreForm.scores[item.id] || 0
      total += (score * item.weight) / 100
      weightSum += item.weight
    })
    return Math.round((total / weightSum) * 100)
  } else {
    const scores = Object.values(scoreForm.scores)
    if (scores.length === 0) return 0
    const sum = scores.reduce((a, b) => a + b, 0)
    return Math.round(sum / scores.length)
  }
}

// 事件处理
const handleFilterChange = (status: string) => {
  if (status === 'pending') {
    activeTab.value = 'pending'
  } else if (status === 'ongoing') {
    activeTab.value = 'tasks'
    taskQueryParams.status = 'ongoing'
  } else if (status === 'completed') {
    activeTab.value = 'completed'
  } else if (status === 'draft') {
    activeTab.value = 'draft'
  }
}

const handleTaskSearch = () => {
  message.info('搜索功能待实现')
}

const handleViewTaskDetail = (task: typeof myTasks.value[0]) => {
  message.info(`查看任务详情: ${task.taskName}`)
}

const handleStartReview = (task: typeof myTasks.value[0]) => {
  activeTab.value = 'pending'
  workQueryParams.taskId = task.id
}

const handleWorkSearch = () => {
  message.info('搜索功能待实现')
}

const handleTableChange = (pag: typeof pagination) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}

const handlePreviewWork = (work: typeof pendingWorks.value[0]) => {
  previewWork.value = work
  previewDrawerVisible.value = true
}

const handleReviewWork = (work: typeof pendingWorks.value[0] | null) => {
  if (!work) return
  
  currentWork.value = work
  reviewTab.value = 'detail'
  
  // 初始化评分表单
  scoreForm.scores = {}
  scoringItems.value.forEach((item) => {
    scoreForm.scores[item.id] = 0
  })
  scoreForm.calculationMethod = 'weighted'
  scoreForm.rating = 0
  scoreForm.strengths = ''
  scoreForm.weaknesses = ''
  scoreForm.suggestions = ''
  scoreForm.overallComment = ''
  scoreForm.reviewAttachments = []
  
  reviewDrawerVisible.value = true
  previewDrawerVisible.value = false
}

const handleBatchReview = () => {
  message.info('批量评审功能待实现')
}

const handleCompletedSearch = () => {
  message.info('搜索功能待实现')
}

const handleCompletedTableChange = (pag: typeof completedPagination) => {
  completedPagination.current = pag.current
  completedPagination.pageSize = pag.pageSize
}

const handleExportCompleted = () => {
  message.success('导出功能待实现')
}

const handleViewReview = (work: typeof completedWorks.value[0]) => {
  message.info(`查看评审记录: ${work.workTitle}`)
}

const handleEditReview = (work: typeof completedWorks.value[0]) => {
  message.info(`修改评审记录: ${work.workTitle}`)
}

const handleContinueReview = (work: typeof draftWorks.value[0]) => {
  message.info(`继续编辑草稿: ${work.workTitle}`)
}

const handleDeleteDraft = (work: typeof draftWorks.value[0]) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除草稿「${work.workTitle}」吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      const index = draftWorks.value.findIndex((w) => w.id === work.id)
      if (index > -1) {
        draftWorks.value.splice(index, 1)
        reviewStats.draft--
        message.success('删除成功')
      }
    },
  })
}

const handlePreviewAttachment = (file: { name: string }) => {
  message.info(`预览附件: ${file.name}`)
}

const handleDownloadAttachment = (file: { name: string }) => {
  message.success(`下载附件: ${file.name}`)
}

const handleInsertPhrase = (phrase: string) => {
  if (reviewTab.value === 'comment') {
    scoreForm.overallComment += (scoreForm.overallComment ? '\n' : '') + phrase
    message.success('已插入快捷短语')
  }
}

const handleCancelReview = () => {
  Modal.confirm({
    title: '确认取消',
    content: '当前评审尚未提交，确定要取消吗？未保存的内容将丢失。',
    okText: '确定',
    okType: 'danger',
    cancelText: '继续评审',
    onOk: () => {
      reviewDrawerVisible.value = false
      currentWork.value = null
    },
  })
}

const handleSaveDraft = () => {
  if (!currentWork.value) return
  
  const draft = {
    id: String(Date.now()),
    workTitle: currentWork.value.workTitle,
    taskName: currentWork.value.taskName,
    savedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
  }
  
  draftWorks.value.push(draft)
  reviewStats.draft++
  
  message.success('草稿已保存')
  reviewDrawerVisible.value = false
}

const handleSubmitReview = async () => {
  try {
    await scoreFormRef.value?.validate()
    
    if (!currentWork.value) return
    
    // 检查是否所有评分项都已打分
    const allScored = scoringItems.value.every((item) => 
      scoreForm.scores[item.id] !== undefined && scoreForm.scores[item.id] > 0
    )
    
    if (!allScored) {
      message.warning('请为所有评分项打分')
      return
    }
    
    if (!scoreForm.overallComment.trim()) {
      message.warning('请填写综合评价')
      return
    }
    
    Modal.confirm({
      title: '确认提交',
      content: '评审提交后不可修改，确定要提交吗？',
      okText: '确定提交',
      cancelText: '继续编辑',
      onOk: () => {
        // 从待评审中移除
        const index = pendingWorks.value.findIndex((w) => w.id === currentWork.value?.id)
        if (index > -1) {
          pendingWorks.value.splice(index, 1)
        }
        
        // 添加到已评审
        if (currentWork.value) {
          completedWorks.value.unshift({
            id: currentWork.value.id,
            workTitle: currentWork.value.workTitle,
            participantName: currentWork.value.participantName,
            taskName: currentWork.value.taskName,
            round: currentWork.value.round,
            score: calculateTotalScore(),
            reviewedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
          })
        }
        
        // 更新统计
        reviewStats.pending--
        reviewStats.completed++
        statistics.totalCount++
        statistics.monthlyCount++
        
        message.success('评审提交成功')
        reviewDrawerVisible.value = false
        currentWork.value = null
        
        // 切换到已评审标签
        activeTab.value = 'completed'
      },
    })
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style scoped>
.my-review-page {
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
