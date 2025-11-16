<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="participant-list-page">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">报名列表</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        查看和管理所有参赛者报名信息
      </p>
    </div>

    <!-- 搜索筛选区域 -->
    <a-card :bordered="false" class="mb-4">
      <a-form layout="inline" :model="queryParams">
        <a-form-item label="活动">
          <a-select
            v-model:value="queryParams.activityId"
            placeholder="请选择活动"
            allow-clear
            style="width: 200px"
            @change="handleSearch"
          >
            <a-select-option value="1">2025年度创新设计大赛</a-select-option>
            <a-select-option value="2">优秀项目评审活动</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="关键词">
          <a-input
            v-model:value="queryParams.keyword"
            placeholder="姓名/手机号/邮箱"
            allow-clear
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item label="报名状态">
          <a-select
            v-model:value="queryParams.status"
            placeholder="请选择状态"
            allow-clear
            style="width: 150px"
          >
            <a-select-option value="pending">待审核</a-select-option>
            <a-select-option value="approved">已通过</a-select-option>
            <a-select-option value="rejected">已拒绝</a-select-option>
            <a-select-option value="cancelled">已取消</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="报名方式">
          <a-select
            v-model:value="queryParams.method"
            placeholder="请选择方式"
            allow-clear
            style="width: 120px"
          >
            <a-select-option value="individual">个人</a-select-option>
            <a-select-option value="team">团队</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="报名时间">
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
          <a-button
            type="primary"
            :disabled="!hasSelected"
            @click="handleBatchApprove"
          >
            <template #icon><CheckOutlined /></template>
            批量通过
          </a-button>
          <a-button
            danger
            :disabled="!hasSelected"
            @click="handleBatchReject"
          >
            <template #icon><CloseOutlined /></template>
            批量拒绝
          </a-button>
          <a-button @click="handleExport">
            <template #icon><ExportOutlined /></template>
            导出数据
          </a-button>
          <a-button @click="handleDownloadWorks">
            <template #icon><DownloadOutlined /></template>
            下载作品
          </a-button>
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

      <!-- 报名列表表格 -->
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
          <!-- 参赛者信息 -->
          <template v-if="column.key === 'participant'">
            <div>
              <div class="font-medium text-gray-900 dark:text-gray-100">
                {{ record.name }}
                <a-tag v-if="record.method === 'team'" color="blue" class="ml-2">
                  团队 ({{ record.teamSize }}人)
                </a-tag>
              </div>
              <div class="text-xs text-gray-500">
                {{ record.phone }} | {{ record.email }}
              </div>
              <div v-if="record.organization" class="text-xs text-gray-500">
                {{ record.organization }}
              </div>
            </div>
          </template>

          <!-- 活动 -->
          <template v-else-if="column.key === 'activity'">
            <div class="text-sm">{{ record.activityName }}</div>
          </template>

          <!-- 报名状态 -->
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusLabel(record.status) }}
            </a-tag>
          </template>

          <!-- 作品信息 -->
          <template v-else-if="column.key === 'work'">
            <div v-if="record.workTitle">
              <div class="text-sm font-medium">{{ record.workTitle }}</div>
              <a-space class="mt-1">
                <a-button
                  type="link"
                  size="small"
                  @click="handleViewWork(record)"
                >
                  <EyeOutlined />
                  查看
                </a-button>
                <a-button
                  type="link"
                  size="small"
                  @click="handleDownloadWork(record)"
                >
                  <DownloadOutlined />
                  下载
                </a-button>
              </a-space>
            </div>
            <span v-else class="text-gray-400">未提交</span>
          </template>

          <!-- 评审状态 -->
          <template v-else-if="column.key === 'review'">
            <div v-if="record.reviewStatus">
              <a-progress
                :percent="record.reviewProgress"
                :size="'small'"
                :stroke-color="{ '0%': '#108ee9', '100%': '#87d068' }"
              />
              <div class="text-xs text-gray-500 mt-1">
                {{ record.reviewedCount }}/{{ record.totalReviewers }} 已评审
              </div>
              <div v-if="record.avgScore" class="text-xs text-gray-600 mt-1">
                平均分: {{ record.avgScore }}
              </div>
            </div>
            <span v-else class="text-gray-400">未开始</span>
          </template>

          <!-- 操作 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">
                <FileSearchOutlined />
                详情
              </a-button>
              <a-dropdown>
                <template #overlay>
                  <a-menu @click="({ key }: { key: string }) => handleMenuClick(key, record)">
                    <a-menu-item
                      key="approve"
                      v-if="record.status === 'pending'"
                    >
                      <CheckOutlined />
                      通过审核
                    </a-menu-item>
                    <a-menu-item
                      key="reject"
                      v-if="record.status === 'pending'"
                    >
                      <CloseOutlined />
                      拒绝审核
                    </a-menu-item>
                    <a-menu-divider v-if="record.status === 'pending'" />
                    <a-menu-item key="work">
                      <FileTextOutlined />
                      查看作品
                    </a-menu-item>
                    <a-menu-item key="review">
                      <SolutionOutlined />
                      评审记录
                    </a-menu-item>
                    <a-menu-item key="contact">
                      <PhoneOutlined />
                      联系参赛者
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="cancel" danger>
                      <StopOutlined />
                      取消报名
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

    <!-- 详情抽屉 -->
    <a-drawer
      v-model:open="detailDrawerVisible"
      title="报名详情"
      width="720"
      :body-style="{ paddingBottom: '80px' }"
    >
      <a-tabs v-model:activeKey="detailTab">
        <!-- 基本信息 -->
        <a-tab-pane key="basic" tab="基本信息">
          <a-descriptions bordered :column="2">
            <a-descriptions-item label="姓名">
              {{ currentRecord?.name }}
            </a-descriptions-item>
            <a-descriptions-item label="报名方式">
              <a-tag :color="currentRecord?.method === 'team' ? 'blue' : 'green'">
                {{ currentRecord?.method === 'team' ? '团队' : '个人' }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="手机号">
              {{ currentRecord?.phone }}
            </a-descriptions-item>
            <a-descriptions-item label="邮箱">
              {{ currentRecord?.email }}
            </a-descriptions-item>
            <a-descriptions-item label="所属机构" :span="2">
              {{ currentRecord?.organization || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="报名状态" :span="2">
              <a-tag :color="getStatusColor(currentRecord?.status)">
                {{ getStatusLabel(currentRecord?.status) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="报名时间" :span="2">
              {{ currentRecord?.createdAt }}
            </a-descriptions-item>
            <a-descriptions-item label="审核时间" :span="2" v-if="currentRecord?.auditedAt">
              {{ currentRecord?.auditedAt }}
            </a-descriptions-item>
            <a-descriptions-item label="审核人" :span="2" v-if="currentRecord?.auditor">
              {{ currentRecord?.auditor }}
            </a-descriptions-item>
            <a-descriptions-item label="审核意见" :span="2" v-if="currentRecord?.auditComment">
              {{ currentRecord?.auditComment }}
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>

        <!-- 作品信息 -->
        <a-tab-pane key="work" tab="作品信息">
          <div v-if="currentRecord?.workTitle">
            <a-descriptions bordered :column="1">
              <a-descriptions-item label="作品标题">
                {{ currentRecord?.workTitle }}
              </a-descriptions-item>
              <a-descriptions-item label="作品描述">
                {{ currentRecord?.workDescription || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="提交时间">
                {{ currentRecord?.workSubmittedAt }}
              </a-descriptions-item>
            </a-descriptions>

            <a-divider>作品附件</a-divider>
            <a-list :data-source="currentRecord?.workFiles || []" bordered>
              <template #renderItem="{ item }">
                <a-list-item>
                  <template #actions>
                    <a-button type="link" size="small" @click="handleDownloadFile(item)">
                      <DownloadOutlined />
                      下载
                    </a-button>
                  </template>
                  <a-list-item-meta>
                    <template #title>
                      <FileOutlined class="mr-2" />
                      {{ item.name }}
                    </template>
                    <template #description>
                      {{ item.size }} | 上传于 {{ item.uploadedAt }}
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </div>
          <a-empty v-else description="未提交作品" />
        </a-tab-pane>

        <!-- 评审记录 -->
        <a-tab-pane key="review" tab="评审记录">
          <a-list
            v-if="currentRecord?.reviewRecords && currentRecord.reviewRecords.length > 0"
            :data-source="currentRecord?.reviewRecords"
            item-layout="vertical"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    <a-space>
                      <span>{{ item.reviewerName }}</span>
                      <a-tag color="blue">{{ item.round }}轮</a-tag>
                      <span class="text-orange-500 font-bold">{{ item.score }}分</span>
                    </a-space>
                  </template>
                  <template #description>
                    <div class="space-y-2">
                      <div v-for="criterion in item.criteria" :key="criterion.name">
                        <span class="text-gray-600">{{ criterion.name }}: </span>
                        <span class="font-medium">{{ criterion.score }}分</span>
                      </div>
                      <div v-if="item.comment" class="mt-2 text-gray-700">
                        评审意见: {{ item.comment }}
                      </div>
                      <div class="text-xs text-gray-500">
                        评审时间: {{ item.reviewedAt }}
                      </div>
                    </div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
          <a-empty v-else description="暂无评审记录" />
        </a-tab-pane>
      </a-tabs>

      <template #footer>
        <a-space>
          <a-button @click="detailDrawerVisible = false">关闭</a-button>
          <a-button
            v-if="currentRecord?.status === 'pending'"
            type="primary"
            @click="handleApprove(currentRecord)"
          >
            通过审核
          </a-button>
          <a-button
            v-if="currentRecord?.status === 'pending'"
            danger
            @click="handleReject(currentRecord)"
          >
            拒绝审核
          </a-button>
        </a-space>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { TableProps } from 'ant-design-vue'
import {
  SearchOutlined,
  ReloadOutlined,
  CheckOutlined,
  CloseOutlined,
  ExportOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileSearchOutlined,
  DownOutlined,
  FileTextOutlined,
  SolutionOutlined,
  PhoneOutlined,
  StopOutlined,
  FileOutlined,
} from '@ant-design/icons-vue'

// 查询参数
const queryParams = reactive({
  activityId: undefined as string | undefined,
  keyword: '',
  status: undefined as string | undefined,
  method: undefined as string | undefined,
  dateRange: undefined as [string, string] | undefined,
})

// 表格数据
const loading = ref(false)
const dataSource = ref([
  {
    id: '1',
    name: '张三',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    organization: '清华大学',
    activityName: '2025年度创新设计大赛',
    method: 'individual',
    teamSize: null,
    status: 'approved',
    workTitle: '智能家居控制系统',
    workDescription: '基于物联网技术的智能家居解决方案',
    workSubmittedAt: '2025-01-10 15:30:00',
    workFiles: [
      { name: '项目说明书.pdf', size: '2.3MB', uploadedAt: '2025-01-10 15:30:00' },
      { name: '演示视频.mp4', size: '45.8MB', uploadedAt: '2025-01-10 15:32:00' },
    ],
    reviewStatus: 'ongoing',
    reviewProgress: 67,
    reviewedCount: 2,
    totalReviewers: 3,
    avgScore: 85.5,
    reviewRecords: [
      {
        reviewerName: '李教授',
        round: '初审',
        score: 88,
        criteria: [
          { name: '创新性', score: 90 },
          { name: '实用性', score: 85 },
          { name: '完整性', score: 89 },
        ],
        comment: '项目创新性强，实用价值高',
        reviewedAt: '2025-01-15 10:20:00',
      },
      {
        reviewerName: '王专家',
        round: '初审',
        score: 83,
        criteria: [
          { name: '创新性', score: 85 },
          { name: '实用性', score: 82 },
          { name: '完整性', score: 82 },
        ],
        comment: '技术实现较好，建议加强市场分析',
        reviewedAt: '2025-01-15 14:45:00',
      },
    ],
    createdAt: '2025-01-05 09:15:00',
    auditedAt: '2025-01-06 10:30:00',
    auditor: '管理员',
    auditComment: '材料齐全，符合要求',
  },
  {
    id: '2',
    name: '李四（队长）',
    phone: '13900139002',
    email: 'lisi@example.com',
    organization: '北京大学',
    activityName: '2025年度创新设计大赛',
    method: 'team',
    teamSize: 3,
    status: 'pending',
    workTitle: null,
    workDescription: null,
    workSubmittedAt: null,
    workFiles: [],
    reviewStatus: null,
    reviewProgress: 0,
    reviewedCount: 0,
    totalReviewers: 0,
    avgScore: null,
    reviewRecords: [],
    createdAt: '2025-01-12 16:20:00',
    auditedAt: null,
    auditor: null,
    auditComment: null,
  },
  {
    id: '3',
    name: '王五',
    phone: '13700137003',
    email: 'wangwu@example.com',
    organization: '复旦大学',
    activityName: '优秀项目评审活动',
    method: 'individual',
    teamSize: null,
    status: 'rejected',
    workTitle: null,
    workDescription: null,
    workSubmittedAt: null,
    workFiles: [],
    reviewStatus: null,
    reviewProgress: 0,
    reviewedCount: 0,
    totalReviewers: 0,
    avgScore: null,
    reviewRecords: [],
    createdAt: '2025-01-08 11:30:00',
    auditedAt: '2025-01-09 09:15:00',
    auditor: '管理员',
    auditComment: '提交材料不完整',
  },
])

// 表格列
const columns = [
  { title: '参赛者信息', key: 'participant', width: 240 },
  { title: '活动', key: 'activity', width: 180 },
  { title: '报名状态', key: 'status', width: 100, align: 'center' as const },
  { title: '作品信息', key: 'work', width: 200 },
  { title: '评审进度', key: 'review', width: 150 },
  { title: '报名时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
  { title: '操作', key: 'action', width: 180, fixed: 'right' as const },
]

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 3,
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
}))

const clearSelection = () => {
  selectedRowKeys.value = []
}

// 详情抽屉
const detailDrawerVisible = ref(false)
const detailTab = ref('basic')
const currentRecord = ref<typeof dataSource.value[0] | null>(null)

// 状态辅助函数
const getStatusColor = (status?: string) => {
  const colors = {
    pending: 'orange',
    approved: 'green',
    rejected: 'red',
    cancelled: 'default',
  }
  return colors[status as keyof typeof colors] || 'default'
}

const getStatusLabel = (status?: string) => {
  const labels = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
    cancelled: '已取消',
  }
  return labels[status as keyof typeof labels] || status
}

// 事件处理
const handleSearch = () => {
  pagination.current = 1
  message.info('搜索功能待实现')
}

const handleReset = () => {
  queryParams.activityId = undefined
  queryParams.keyword = ''
  queryParams.status = undefined
  queryParams.method = undefined
  queryParams.dateRange = undefined
  handleSearch()
}

const handleTableChange = (pag: typeof pagination) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}

const handleView = (record: typeof dataSource.value[0]) => {
  currentRecord.value = record
  detailTab.value = 'basic'
  detailDrawerVisible.value = true
}

const handleViewWork = (record: typeof dataSource.value[0]) => {
  currentRecord.value = record
  detailTab.value = 'work'
  detailDrawerVisible.value = true
}

const handleDownloadWork = (record: typeof dataSource.value[0]) => {
  message.info(`下载作品: ${record.workTitle}`)
}

const handleDownloadFile = (file: { name: string }) => {
  message.info(`下载文件: ${file.name}`)
}

const handleMenuClick = (key: string, record: typeof dataSource.value[0]) => {
  currentRecord.value = record
  
  switch (key) {
    case 'approve':
      handleApprove(record)
      break
    case 'reject':
      handleReject(record)
      break
    case 'work':
      handleViewWork(record)
      break
    case 'review':
      detailTab.value = 'review'
      detailDrawerVisible.value = true
      break
    case 'contact':
      message.info(`联系: ${record.phone}`)
      break
    case 'cancel':
      handleCancel(record)
      break
  }
}

const handleApprove = (record: typeof dataSource.value[0] | null) => {
  if (!record) return
  
  Modal.confirm({
    title: '通过审核',
    content: `确定要通过「${record.name}」的报名申请吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      record.status = 'approved'
      record.auditedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
      record.auditor = '当前用户'
      message.success('审核通过')
      detailDrawerVisible.value = false
    },
  })
}

const handleReject = (record: typeof dataSource.value[0] | null) => {
  if (!record) return
  
  Modal.confirm({
    title: '拒绝审核',
    content: `确定要拒绝「${record.name}」的报名申请吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      record.status = 'rejected'
      record.auditedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
      record.auditor = '当前用户'
      record.auditComment = '审核拒绝'
      message.success('已拒绝')
      detailDrawerVisible.value = false
    },
  })
}

const handleCancel = (record: typeof dataSource.value[0]) => {
  Modal.confirm({
    title: '取消报名',
    content: `确定要取消「${record.name}」的报名吗？此操作不可恢复！`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      record.status = 'cancelled'
      message.success('已取消报名')
    },
  })
}

const handleBatchApprove = () => {
  Modal.confirm({
    title: '批量通过',
    content: `确定要通过选中的 ${selectedRowKeys.value.length} 个报名申请吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      dataSource.value.forEach((item) => {
        if (selectedRowKeys.value.includes(item.id)) {
          item.status = 'approved'
          item.auditedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
          item.auditor = '当前用户'
        }
      })
      message.success(`已通过 ${selectedRowKeys.value.length} 个申请`)
      clearSelection()
    },
  })
}

const handleBatchReject = () => {
  Modal.confirm({
    title: '批量拒绝',
    content: `确定要拒绝选中的 ${selectedRowKeys.value.length} 个报名申请吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      dataSource.value.forEach((item) => {
        if (selectedRowKeys.value.includes(item.id)) {
          item.status = 'rejected'
          item.auditedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
          item.auditor = '当前用户'
        }
      })
      message.success(`已拒绝 ${selectedRowKeys.value.length} 个申请`)
      clearSelection()
    },
  })
}

const handleExport = () => {
  message.success('导出数据功能待实现')
}

const handleDownloadWorks = () => {
  message.success('批量下载作品功能待实现')
}
</script>

<style scoped>
.participant-list-page {
  padding: 0;
}
</style>
