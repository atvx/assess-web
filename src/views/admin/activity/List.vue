<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="activity-list-page">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">活动列表</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        管理所有评审活动，包括创建、编辑、发布和状态管理
      </p>
    </div>

    <!-- 搜索筛选区域 -->
    <a-card :bordered="false" class="mb-4">
      <a-form layout="inline" :model="queryParams">
        <a-form-item label="活动名称">
          <a-input
            v-model:value="queryParams.keyword"
            placeholder="请输入活动名称"
            allow-clear
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item label="活动状态">
          <a-select
            v-model:value="queryParams.status"
            placeholder="请选择状态"
            allow-clear
            style="width: 150px"
          >
            <a-select-option value="draft">草稿</a-select-option>
            <a-select-option value="published">已发布</a-select-option>
            <a-select-option value="ongoing">进行中</a-select-option>
            <a-select-option value="ended">已结束</a-select-option>
            <a-select-option value="archived">已归档</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="活动类型">
          <a-select
            v-model:value="queryParams.type"
            placeholder="请选择类型"
            allow-clear
            style="width: 150px"
          >
            <a-select-option value="competition">竞赛</a-select-option>
            <a-select-option value="evaluation">评审</a-select-option>
            <a-select-option value="exhibition">展览</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="创建时间">
          <a-range-picker
            v-model:value="queryParams.dateRange"
            :placeholder="['开始日期', '结束日期']"
            style="width: 240px"
          />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">
              <template #icon><SearchOutlined /></template>
              搜索
            </a-button>
            <a-button @click="handleReset">
              <template #icon><ReloadOutlined /></template>
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 工具栏 -->
    <a-card :bordered="false">
      <div class="flex justify-between items-center mb-4">
        <a-space>
          <a-button type="primary" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            新建活动
          </a-button>
          <a-button
            :disabled="!hasSelected"
            @click="handleBatchPublish"
          >
            <template #icon><SendOutlined /></template>
            批量发布
          </a-button>
          <a-button
            danger
            :disabled="!hasSelected"
            @click="handleBatchDelete"
          >
            <template #icon><DeleteOutlined /></template>
            批量删除
          </a-button>
          <a-dropdown v-if="hasSelected">
            <template #overlay>
              <a-menu @click="handleBatchStatusChange">
                <a-menu-item key="draft">
                  <FileTextOutlined />
                  设为草稿
                </a-menu-item>
                <a-menu-item key="published">
                  <CheckCircleOutlined />
                  设为已发布
                </a-menu-item>
                <a-menu-item key="ongoing">
                  <PlayCircleOutlined />
                  设为进行中
                </a-menu-item>
                <a-menu-item key="ended">
                  <StopOutlined />
                  设为已结束
                </a-menu-item>
                <a-menu-item key="archived">
                  <InboxOutlined />
                  归档
                </a-menu-item>
              </a-menu>
            </template>
            <a-button>
              批量状态变更
              <DownOutlined />
            </a-button>
          </a-dropdown>
        </a-space>
        <div class="text-sm text-gray-500">
          <span v-if="hasSelected">已选择 {{ selectedRowKeys.length }} 项</span>
          <a-button
            v-if="hasSelected"
            type="link"
            size="small"
            @click="clearSelection"
          >
            清空
          </a-button>
        </div>
      </div>

      <!-- 活动列表表格 -->
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :row-selection="rowSelection"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- 活动名称 -->
          <template v-if="column.key === 'name'">
            <div class="flex items-center">
              <a-avatar
                v-if="record.cover"
                :src="record.cover"
                shape="square"
                :size="40"
                class="mr-3"
              />
              <div>
                <div class="font-medium text-gray-900 dark:text-gray-100">
                  {{ record.name }}
                </div>
                <div class="text-xs text-gray-500">
                  编号: {{ record.code }}
                </div>
              </div>
            </div>
          </template>

          <!-- 活动类型 -->
          <template v-else-if="column.key === 'type'">
            <a-tag :color="getTypeColor(record.type)">
              {{ getTypeLabel(record.type) }}
            </a-tag>
          </template>

          <!-- 活动状态 -->
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusLabel(record.status) }}
            </a-tag>
          </template>

          <!-- 报名人数 -->
          <template v-else-if="column.key === 'participants'">
            <div class="text-center">
              <div class="font-medium">{{ record.participantCount }}</div>
              <div class="text-xs text-gray-500">
                上限: {{ record.participantLimit || '无限制' }}
              </div>
            </div>
          </template>

          <!-- 评审进度 -->
          <template v-else-if="column.key === 'progress'">
            <div>
              <a-progress
                :percent="record.reviewProgress"
                :size="'small'"
                :stroke-color="{ '0%': '#108ee9', '100%': '#87d068' }"
              />
              <div class="text-xs text-gray-500 mt-1">
                {{ record.reviewedCount }}/{{ record.totalCount }} 已评审
              </div>
            </div>
          </template>

          <!-- 时间 -->
          <template v-else-if="column.key === 'time'">
            <div class="text-sm">
              <div>开始: {{ record.startTime }}</div>
              <div class="text-gray-500">结束: {{ record.endTime }}</div>
            </div>
          </template>

          <!-- 操作 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">
                <EyeOutlined />
                查看
              </a-button>
              <a-button type="link" size="small" @click="handleEdit(record)">
                <EditOutlined />
                编辑
              </a-button>
              <a-dropdown>
                <template #overlay>
                  <a-menu @click="({ key }: { key: string }) => handleMenuClick(key, record)">
                    <a-menu-item key="copy">
                      <CopyOutlined />
                      复制活动
                    </a-menu-item>
                    <a-menu-item key="config">
                      <SettingOutlined />
                      详情配置
                    </a-menu-item>
                    <a-menu-item key="registration">
                      <FormOutlined />
                      报名设置
                    </a-menu-item>
                    <a-menu-item key="participants">
                      <TeamOutlined />
                      报名管理
                    </a-menu-item>
                    <a-menu-item key="review">
                      <FileSearchOutlined />
                      评审管理
                    </a-menu-item>
                    <a-menu-item key="statistics">
                      <BarChartOutlined />
                      活动统计
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="publish" v-if="record.status === 'draft'">
                      <SendOutlined />
                      发布活动
                    </a-menu-item>
                    <a-menu-item key="archive" v-if="record.status === 'ended'">
                      <InboxOutlined />
                      归档活动
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="delete" danger>
                      <DeleteOutlined />
                      删除活动
                    </a-menu-item>
                  </a-menu>
                </template>
                <a-button type="link" size="small">
                  更多
                  <DownOutlined />
                </a-button>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 活动详情抽屉 -->
    <a-drawer
      v-model:open="drawerVisible"
      title="活动详情"
      width="720"
      :body-style="{ paddingBottom: '80px' }"
    >
      <a-descriptions bordered :column="2">
        <a-descriptions-item label="活动名称" :span="2">
          {{ currentActivity?.name }}
        </a-descriptions-item>
        <a-descriptions-item label="活动编号">
          {{ currentActivity?.code }}
        </a-descriptions-item>
        <a-descriptions-item label="活动类型">
          <a-tag :color="getTypeColor(currentActivity?.type)">
            {{ getTypeLabel(currentActivity?.type) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="活动状态">
          <a-tag :color="getStatusColor(currentActivity?.status)">
            {{ getStatusLabel(currentActivity?.status) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          {{ currentActivity?.createdAt }}
        </a-descriptions-item>
        <a-descriptions-item label="开始时间">
          {{ currentActivity?.startTime }}
        </a-descriptions-item>
        <a-descriptions-item label="结束时间">
          {{ currentActivity?.endTime }}
        </a-descriptions-item>
        <a-descriptions-item label="报名人数">
          {{ currentActivity?.participantCount }} /
          {{ currentActivity?.participantLimit || '无限制' }}
        </a-descriptions-item>
        <a-descriptions-item label="评审进度">
          {{ currentActivity?.reviewedCount }} / {{ currentActivity?.totalCount }}
          ({{ currentActivity?.reviewProgress }}%)
        </a-descriptions-item>
        <a-descriptions-item label="活动描述" :span="2">
          {{ currentActivity?.description || '暂无描述' }}
        </a-descriptions-item>
      </a-descriptions>

      <template #footer>
        <a-space>
          <a-button @click="drawerVisible = false">关闭</a-button>
          <a-button type="primary" @click="handleEdit(currentActivity)">
            编辑活动
          </a-button>
        </a-space>
      </template>
    </a-drawer>

    <!-- 报名设置弹窗 -->
    <a-modal
      v-model:open="registrationModalVisible"
      title="报名设置"
      width="800px"
      :footer="null"
    >
      <a-tabs v-model:activeKey="registrationTab">
        <!-- 基础设置 -->
        <a-tab-pane key="basic" tab="基础设置">
          <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="报名开关">
              <a-switch v-model:checked="registrationForm.enabled" />
              <div class="text-xs text-gray-500 mt-1">
                关闭后用户将无法报名此活动
              </div>
            </a-form-item>

            <a-form-item label="报名时间">
              <a-range-picker
                v-model:value="registrationForm.dateRange"
                show-time
                :placeholder="['开始时间', '结束时间']"
                class="w-full"
              />
            </a-form-item>

            <a-form-item label="报名人数限制">
              <a-radio-group v-model:value="registrationForm.limitType">
                <a-radio value="unlimited">不限制</a-radio>
                <a-radio value="limited">限制人数</a-radio>
              </a-radio-group>
              <a-input-number
                v-if="registrationForm.limitType === 'limited'"
                v-model:value="registrationForm.maxParticipants"
                :min="1"
                placeholder="请输入最大人数"
                class="mt-2 w-full"
              />
            </a-form-item>

            <a-form-item label="报名提示">
              <a-textarea
                v-model:value="registrationForm.tips"
                :rows="3"
                placeholder="报名须知或注意事项"
              />
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 报名规则 -->
        <a-tab-pane key="rules" tab="报名规则">
          <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="报名方式">
              <a-radio-group v-model:value="registrationForm.method">
                <a-space direction="vertical">
                  <a-radio value="individual">个人报名</a-radio>
                  <a-radio value="team">团队报名</a-radio>
                  <a-radio value="both">个人或团队</a-radio>
                </a-space>
              </a-radio-group>
            </a-form-item>

            <a-form-item
              v-if="registrationForm.method !== 'individual'"
              label="团队人数限制"
            >
              <a-space>
                <a-input-number
                  v-model:value="registrationForm.teamMinSize"
                  :min="1"
                  placeholder="最少"
                />
                <span>至</span>
                <a-input-number
                  v-model:value="registrationForm.teamMaxSize"
                  :min="1"
                  placeholder="最多"
                />
                <span>人</span>
              </a-space>
            </a-form-item>

            <a-form-item label="重复报名">
              <a-radio-group v-model:value="registrationForm.allowDuplicate">
                <a-radio :value="false">不允许重复报名</a-radio>
                <a-radio :value="true">允许重复报名</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="报名条件">
              <a-checkbox-group v-model:value="registrationForm.requirements">
                <a-space direction="vertical">
                  <a-checkbox value="realname">需要实名认证</a-checkbox>
                  <a-checkbox value="phone">需要手机验证</a-checkbox>
                  <a-checkbox value="email">需要邮箱验证</a-checkbox>
                  <a-checkbox value="organization">需要所属机构</a-checkbox>
                </a-space>
              </a-checkbox-group>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 表单字段 -->
        <a-tab-pane key="fields" tab="表单字段">
          <div class="mb-4">
            <a-button type="dashed" block @click="handleAddField">
              <PlusOutlined />
              添加自定义字段
            </a-button>
          </div>

          <a-list :data-source="registrationForm.fields" bordered>
            <template #renderItem="{ item, index }">
              <a-list-item>
                <template #actions>
                  <a-button
                    type="link"
                    size="small"
                    @click="handleMoveFieldUp(index)"
                    :disabled="index === 0"
                  >
                    <UpOutlined />
                  </a-button>
                  <a-button
                    type="link"
                    size="small"
                    @click="handleMoveFieldDown(index)"
                    :disabled="index === registrationForm.fields.length - 1"
                  >
                    <DownOutlined />
                  </a-button>
                  <a-button
                    type="link"
                    size="small"
                    @click="handleEditField(item)"
                  >
                    编辑
                  </a-button>
                  <a-button
                    type="link"
                    size="small"
                    danger
                    @click="handleDeleteField(index)"
                    :disabled="item.system"
                  >
                    删除
                  </a-button>
                </template>
                <a-list-item-meta>
                  <template #title>
                    {{ item.label }}
                    <a-tag v-if="item.required" color="red" class="ml-2">必填</a-tag>
                    <a-tag v-if="item.system" color="blue" class="ml-2">系统字段</a-tag>
                  </template>
                  <template #description>
                    类型: {{ getFieldTypeLabel(item.type) }} |
                    {{ item.placeholder || '无占位符' }}
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-tab-pane>

        <!-- 审核设置 -->
        <a-tab-pane key="audit" tab="审核设置">
          <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="审核模式">
              <a-radio-group v-model:value="registrationForm.auditMode">
                <a-space direction="vertical">
                  <a-radio value="auto">自动通过</a-radio>
                  <a-radio value="manual">人工审核</a-radio>
                  <a-radio value="condition">条件审核</a-radio>
                </a-space>
              </a-radio-group>
            </a-form-item>

            <a-form-item
              v-if="registrationForm.auditMode === 'condition'"
              label="自动通过条件"
            >
              <a-textarea
                v-model:value="registrationForm.autoPassCondition"
                :rows="3"
                placeholder="例如: 所属机构为指定机构且已实名认证"
              />
            </a-form-item>

            <a-form-item label="审核通知">
              <a-checkbox-group v-model:value="registrationForm.auditNotify">
                <a-space direction="vertical">
                  <a-checkbox value="pass">审核通过时通知</a-checkbox>
                  <a-checkbox value="reject">审核拒绝时通知</a-checkbox>
                  <a-checkbox value="pending">待审核时通知</a-checkbox>
                </a-space>
              </a-checkbox-group>
            </a-form-item>

            <a-form-item label="拒绝原因">
              <a-select
                v-model:value="registrationForm.rejectReasons"
                mode="tags"
                placeholder="添加常用拒绝原因（可自定义）"
                class="w-full"
              >
                <a-select-option value="资料不全">资料不全</a-select-option>
                <a-select-option value="不符合报名条件">不符合报名条件</a-select-option>
                <a-select-option value="人数已满">人数已满</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>

      <div class="mt-4 flex justify-end">
        <a-space>
          <a-button @click="registrationModalVisible = false">取消</a-button>
          <a-button type="primary" @click="handleSaveRegistration">
            保存设置
          </a-button>
        </a-space>
      </div>
    </a-modal>

    <!-- 活动统计弹窗 -->
    <a-modal
      v-model:open="statisticsModalVisible"
      title="活动统计"
      width="900px"
      :footer="null"
    >
      <a-row :gutter="16" class="mb-6">
        <a-col :span="6">
          <a-statistic
            title="报名总数"
            :value="currentStatistics.totalParticipants"
            suffix="人"
          >
            <template #prefix>
              <TeamOutlined />
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="6">
          <a-statistic
            title="待审核"
            :value="currentStatistics.pendingAudit"
            suffix="人"
            :value-style="{ color: '#faad14' }"
          >
            <template #prefix>
              <ClockCircleOutlined />
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="6">
          <a-statistic
            title="已通过"
            :value="currentStatistics.approved"
            suffix="人"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix>
              <CheckCircleOutlined />
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="6">
          <a-statistic
            title="已拒绝"
            :value="currentStatistics.rejected"
            suffix="人"
            :value-style="{ color: '#ff4d4f' }"
          >
            <template #prefix>
              <CloseCircleOutlined />
            </template>
          </a-statistic>
        </a-col>
      </a-row>

      <a-row :gutter="16" class="mb-6">
        <a-col :span="8">
          <a-statistic
            title="作品提交数"
            :value="currentStatistics.worksSubmitted"
            suffix="份"
          />
        </a-col>
        <a-col :span="8">
          <a-statistic
            title="评审完成率"
            :value="currentStatistics.reviewRate"
            suffix="%"
            :precision="1"
          />
        </a-col>
        <a-col :span="8">
          <a-statistic
            title="平均评分"
            :value="currentStatistics.avgScore"
            :precision="2"
          />
        </a-col>
      </a-row>

      <a-divider>报名趋势</a-divider>
      <div class="h-64 bg-gray-50 dark:bg-gray-800 rounded flex items-center justify-center">
        <div class="text-gray-500">图表占位 - 可集成 ECharts</div>
      </div>

      <a-divider>参赛类型分布</a-divider>
      <a-row :gutter="16">
        <a-col :span="12">
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded">
            <div class="font-medium mb-2">报名方式</div>
            <a-list size="small" :data-source="currentStatistics.methodDistribution">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta :title="item.name">
                    <template #description>
                      <a-progress
                        :percent="item.percent"
                        :show-info="false"
                        size="small"
                      />
                      {{ item.count }} 人 ({{ item.percent }}%)
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded">
            <div class="font-medium mb-2">所属机构分布</div>
            <a-list size="small" :data-source="currentStatistics.orgDistribution">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta :title="item.name">
                    <template #description>
                      <a-progress
                        :percent="item.percent"
                        :show-info="false"
                        size="small"
                      />
                      {{ item.count }} 人 ({{ item.percent }}%)
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </div>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import type { TableProps } from 'ant-design-vue'
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SendOutlined,
  DownOutlined,
  CopyOutlined,
  SettingOutlined,
  TeamOutlined,
  FileSearchOutlined,
  InboxOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  StopOutlined,
  FormOutlined,
  BarChartOutlined,
  UpOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()

// 查询参数
const queryParams = reactive({
  keyword: '',
  status: undefined as string | undefined,
  type: undefined as string | undefined,
  dateRange: undefined as [string, string] | undefined,
})

// 表格数据
const loading = ref(false)
const dataSource = ref([
  {
    id: '1',
    code: 'ACT20250001',
    name: '2025年度创新设计大赛',
    type: 'competition',
    status: 'ongoing',
    cover: 'https://via.placeholder.com/100',
    participantCount: 156,
    participantLimit: 200,
    reviewProgress: 68,
    reviewedCount: 106,
    totalCount: 156,
    startTime: '2025-01-15',
    endTime: '2025-06-30',
    createdAt: '2025-01-01 10:00:00',
    description: '面向全国高校学生的创新设计大赛',
  },
  {
    id: '2',
    code: 'ACT20250002',
    name: '优秀项目评审活动',
    type: 'evaluation',
    status: 'published',
    cover: '',
    participantCount: 45,
    participantLimit: 100,
    reviewProgress: 0,
    reviewedCount: 0,
    totalCount: 45,
    startTime: '2025-02-01',
    endTime: '2025-05-31',
    createdAt: '2025-01-10 14:30:00',
    description: '年度优秀项目评审',
  },
  {
    id: '3',
    code: 'ACT20240015',
    name: '2024年度作品展览',
    type: 'exhibition',
    status: 'ended',
    cover: '',
    participantCount: 89,
    participantLimit: null,
    reviewProgress: 100,
    reviewedCount: 89,
    totalCount: 89,
    startTime: '2024-09-01',
    endTime: '2024-12-31',
    createdAt: '2024-08-20 09:00:00',
    description: '年度优秀作品展览活动',
  },
  {
    id: '4',
    code: 'ACT20250003',
    name: '春季创新评审',
    type: 'evaluation',
    status: 'draft',
    cover: '',
    participantCount: 0,
    participantLimit: 50,
    reviewProgress: 0,
    reviewedCount: 0,
    totalCount: 0,
    startTime: '2025-03-01',
    endTime: '2025-04-30',
    createdAt: '2025-01-18 16:00:00',
    description: '',
  },
])

// 表格列定义
const columns = [
  {
    title: '活动名称',
    key: 'name',
    width: 280,
  },
  {
    title: '活动类型',
    key: 'type',
    width: 100,
  },
  {
    title: '活动状态',
    key: 'status',
    width: 100,
  },
  {
    title: '报名人数',
    key: 'participants',
    width: 120,
    align: 'center' as const,
  },
  {
    title: '评审进度',
    key: 'progress',
    width: 150,
  },
  {
    title: '活动时间',
    key: 'time',
    width: 200,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right' as const,
  },
]

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 4,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

// 选择行
const selectedRowKeys = ref<string[]>([])
const hasSelected = computed(() => selectedRowKeys.value.length > 0)

const rowSelection = computed<TableProps['rowSelection']>(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: (string | number)[]) => {
    selectedRowKeys.value = keys as string[]
  },
  getCheckboxProps: (record: typeof dataSource.value[0]) => ({
    disabled: record.status === 'archived',
    name: record.name,
  }),
}))

const clearSelection = () => {
  selectedRowKeys.value = []
}

// 抽屉
const drawerVisible = ref(false)
const currentActivity = ref<typeof dataSource.value[0] | null>(null)

// 报名设置弹窗
const registrationModalVisible = ref(false)
const registrationTab = ref('basic')
const registrationForm = reactive({
  enabled: true,
  dateRange: undefined as [string, string] | undefined,
  limitType: 'limited' as 'unlimited' | 'limited',
  maxParticipants: 200,
  tips: '',
  method: 'individual' as 'individual' | 'team' | 'both',
  teamMinSize: 2,
  teamMaxSize: 5,
  allowDuplicate: false,
  requirements: [] as string[],
  fields: [
    { id: '1', label: '姓名', type: 'text', required: true, system: true, placeholder: '请输入姓名' },
    { id: '2', label: '手机号', type: 'phone', required: true, system: true, placeholder: '请输入手机号' },
    { id: '3', label: '邮箱', type: 'email', required: true, system: true, placeholder: '请输入邮箱' },
    { id: '4', label: '所属机构', type: 'text', required: false, system: false, placeholder: '请输入所属机构' },
  ] as Array<{
    id: string
    label: string
    type: string
    required: boolean
    system: boolean
    placeholder?: string
  }>,
  auditMode: 'manual' as 'auto' | 'manual' | 'condition',
  autoPassCondition: '',
  auditNotify: ['pass'] as string[],
  rejectReasons: ['资料不全', '不符合报名条件'] as string[],
})

// 活动统计弹窗
const statisticsModalVisible = ref(false)
const currentStatistics = reactive({
  totalParticipants: 156,
  pendingAudit: 12,
  approved: 138,
  rejected: 6,
  worksSubmitted: 142,
  reviewRate: 68.3,
  avgScore: 82.5,
  methodDistribution: [
    { name: '个人报名', count: 120, percent: 77 },
    { name: '团队报名', count: 36, percent: 23 },
  ],
  orgDistribution: [
    { name: '清华大学', count: 45, percent: 29 },
    { name: '北京大学', count: 38, percent: 24 },
    { name: '复旦大学', count: 32, percent: 21 },
    { name: '其他', count: 41, percent: 26 },
  ],
})

// 状态辅助函数
const getStatusColor = (status?: string) => {
  const colors = {
    draft: 'default',
    published: 'blue',
    ongoing: 'green',
    ended: 'orange',
    archived: 'gray',
  }
  return colors[status as keyof typeof colors] || 'default'
}

const getStatusLabel = (status?: string) => {
  const labels = {
    draft: '草稿',
    published: '已发布',
    ongoing: '进行中',
    ended: '已结束',
    archived: '已归档',
  }
  return labels[status as keyof typeof labels] || status
}

const getTypeColor = (type?: string) => {
  const colors = {
    competition: 'purple',
    evaluation: 'cyan',
    exhibition: 'magenta',
  }
  return colors[type as keyof typeof colors] || 'default'
}

const getTypeLabel = (type?: string) => {
  const labels = {
    competition: '竞赛',
    evaluation: '评审',
    exhibition: '展览',
  }
  return labels[type as keyof typeof labels] || type
}

// 事件处理
const handleSearch = () => {
  pagination.current = 1
  message.info('搜索功能待实现')
}

const handleReset = () => {
  queryParams.keyword = ''
  queryParams.status = undefined
  queryParams.type = undefined
  queryParams.dateRange = undefined
  handleSearch()
}

const handleTableChange = (pag: typeof pagination) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  // 这里调用API加载数据
}

const handleAdd = () => {
  router.push('/admin/activity/create')
}

const handleView = (record: typeof dataSource.value[0]) => {
  currentActivity.value = record
  drawerVisible.value = true
}

const handleEdit = (record?: typeof dataSource.value[0] | null) => {
  const id = record?.id || currentActivity.value?.id
  if (id) {
    router.push(`/admin/activity/edit/${id}`)
  }
}

const handleMenuClick = (key: string, record: typeof dataSource.value[0]) => {
  currentActivity.value = record
  switch (key) {
    case 'copy':
      handleCopy(record)
      break
    case 'config':
      message.info(`配置活动详情: ${record.name}`)
      break
    case 'registration':
      handleRegistrationSettings(record)
      break
    case 'participants':
      router.push(`/admin/participant/list?activityId=${record.id}`)
      break
    case 'review':
      router.push(`/admin/review/list?activityId=${record.id}`)
      break
    case 'statistics':
      handleStatistics(record)
      break
    case 'publish':
      handlePublish(record)
      break
    case 'archive':
      handleArchive(record)
      break
    case 'delete':
      handleDelete(record)
      break
  }
}

const handlePublish = (record: typeof dataSource.value[0]) => {
  Modal.confirm({
    title: '确认发布',
    content: `确定要发布活动「${record.name}」吗？发布后报名者将可见此活动。`,
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      record.status = 'published'
      message.success('发布成功')
    },
  })
}

const handleArchive = (record: typeof dataSource.value[0]) => {
  Modal.confirm({
    title: '确认归档',
    content: `确定要归档活动「${record.name}」吗？归档后将无法再次编辑。`,
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      record.status = 'archived'
      message.success('归档成功')
    },
  })
}

const handleDelete = (record: typeof dataSource.value[0]) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除活动「${record.name}」吗？此操作不可恢复！`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      const index = dataSource.value.findIndex((item) => item.id === record.id)
      if (index > -1) {
        dataSource.value.splice(index, 1)
        pagination.total--
        message.success('删除成功')
      }
    },
  })
}

// 批量操作
const handleBatchPublish = () => {
  Modal.confirm({
    title: '批量发布',
    content: `确定要发布选中的 ${selectedRowKeys.value.length} 个活动吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      message.success(`已发布 ${selectedRowKeys.value.length} 个活动`)
      clearSelection()
    },
  })
}

const handleBatchDelete = () => {
  Modal.confirm({
    title: '批量删除',
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 个活动吗？此操作不可恢复！`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      dataSource.value = dataSource.value.filter(
        (item) => !selectedRowKeys.value.includes(item.id)
      )
      pagination.total -= selectedRowKeys.value.length
      message.success(`已删除 ${selectedRowKeys.value.length} 个活动`)
      clearSelection()
    },
  })
}

const handleBatchStatusChange = ({ key }: { key: string }) => {
  Modal.confirm({
    title: '批量状态变更',
    content: `确定要将选中的 ${selectedRowKeys.value.length} 个活动状态改为「${getStatusLabel(key)}」吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      dataSource.value.forEach((item) => {
        if (selectedRowKeys.value.includes(item.id)) {
          item.status = key
        }
      })
      message.success('状态变更成功')
      clearSelection()
    },
  })
}

// 复制活动
const handleCopy = (record: typeof dataSource.value[0]) => {
  Modal.confirm({
    title: '复制活动',
    content: `确定要复制活动「${record.name}」吗？将创建一个新的草稿活动。`,
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      const newActivity = {
        ...record,
        id: String(Date.now()),
        code: `ACT${Date.now()}`,
        name: `${record.name}（副本）`,
        status: 'draft',
        participantCount: 0,
        reviewProgress: 0,
        reviewedCount: 0,
        totalCount: 0,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }
      dataSource.value.unshift(newActivity)
      pagination.total++
      message.success('复制成功')
    },
  })
}

// 报名设置
const handleRegistrationSettings = (record: typeof dataSource.value[0]) => {
  currentActivity.value = record
  registrationTab.value = 'basic'
  registrationModalVisible.value = true
}

const handleSaveRegistration = () => {
  message.success('报名设置保存成功')
  registrationModalVisible.value = false
}

const handleAddField = () => {
  const newField = {
    id: String(Date.now()),
    label: '自定义字段',
    type: 'text',
    required: false,
    system: false,
    placeholder: '请输入',
  }
  registrationForm.fields.push(newField)
}

const handleEditField = (item: typeof registrationForm.fields[0]) => {
  message.info(`编辑字段: ${item.label}`)
}

const handleDeleteField = (index: number) => {
  registrationForm.fields.splice(index, 1)
  message.success('删除成功')
}

const handleMoveFieldUp = (index: number) => {
  if (index === 0) return
  const fields = registrationForm.fields
  const temp = fields[index]
  const prev = fields[index - 1]
  if (temp && prev) {
    fields[index] = prev
    fields[index - 1] = temp
  }
}

const handleMoveFieldDown = (index: number) => {
  if (index === registrationForm.fields.length - 1) return
  const fields = registrationForm.fields
  const temp = fields[index]
  const next = fields[index + 1]
  if (temp && next) {
    fields[index] = next
    fields[index + 1] = temp
  }
}

const getFieldTypeLabel = (type: string) => {
  const labels = {
    text: '文本',
    textarea: '多行文本',
    number: '数字',
    phone: '手机号',
    email: '邮箱',
    date: '日期',
    select: '下拉选择',
    radio: '单选',
    checkbox: '多选',
    file: '文件上传',
  }
  return labels[type as keyof typeof labels] || type
}

// 活动统计
const handleStatistics = (record: typeof dataSource.value[0]) => {
  currentActivity.value = record
  statisticsModalVisible.value = true
}
</script>

<style scoped>
.activity-list-page {
  padding: 0;
}
</style>
