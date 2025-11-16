<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="participant-audit-page">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">报名审核</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        审核参赛者报名申请，管理审核记录
      </p>
    </div>

    <!-- 统计卡片 -->
    <a-row :gutter="16" class="mb-4">
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic
            title="待审核"
            :value="statistics.pending"
            suffix="个"
            :value-style="{ color: '#faad14' }"
          >
            <template #prefix>
              <ClockCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic
            title="已通过"
            :value="statistics.approved"
            suffix="个"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix>
              <CheckCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic
            title="已拒绝"
            :value="statistics.rejected"
            suffix="个"
            :value-style="{ color: '#ff4d4f' }"
          >
            <template #prefix>
              <CloseCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic
            title="今日审核"
            :value="statistics.today"
            suffix="个"
          >
            <template #prefix>
              <CheckOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- 筛选区域 -->
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
        <a-form-item label="审核状态">
          <a-select
            v-model:value="queryParams.status"
            placeholder="请选择状态"
            style="width: 150px"
            @change="handleSearch"
          >
            <a-select-option value="pending">待审核</a-select-option>
            <a-select-option value="approved">已通过</a-select-option>
            <a-select-option value="rejected">已拒绝</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="关键词">
          <a-input
            v-model:value="queryParams.keyword"
            placeholder="姓名/手机号"
            allow-clear
            style="width: 200px"
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
            批量通过 ({{ selectedRowKeys.length }})
          </a-button>
          <a-button
            danger
            :disabled="!hasSelected"
            @click="handleBatchReject"
          >
            <template #icon><CloseOutlined /></template>
            批量拒绝 ({{ selectedRowKeys.length }})
          </a-button>
          <a-button @click="handleViewAuditHistory">
            <template #icon><HistoryOutlined /></template>
            审核记录
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

      <!-- 审核列表表格 -->
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
                {{ record.phone }}
              </div>
              <div class="text-xs text-gray-500">
                {{ record.email }}
              </div>
            </div>
          </template>

          <!-- 报名信息 -->
          <template v-else-if="column.key === 'info'">
            <div class="text-sm space-y-1">
              <div>
                <span class="text-gray-600">活动: </span>
                {{ record.activityName }}
              </div>
              <div v-if="record.organization">
                <span class="text-gray-600">机构: </span>
                {{ record.organization }}
              </div>
              <div>
                <span class="text-gray-600">报名时间: </span>
                {{ record.createdAt }}
              </div>
            </div>
          </template>

          <!-- 审核状态 -->
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusLabel(record.status) }}
            </a-tag>
            <div v-if="record.status !== 'pending'" class="text-xs text-gray-500 mt-1">
              {{ record.auditedAt }}
            </div>
          </template>

          <!-- 材料完整性 -->
          <template v-else-if="column.key === 'materials'">
            <a-space direction="vertical" :size="4">
              <div>
                <CheckCircleOutlined
                  v-if="record.hasBasicInfo"
                  class="text-green-500 mr-1"
                />
                <CloseCircleOutlined v-else class="text-red-500 mr-1" />
                基本信息
              </div>
              <div>
                <CheckCircleOutlined
                  v-if="record.hasWork"
                  class="text-green-500 mr-1"
                />
                <CloseCircleOutlined v-else class="text-red-500 mr-1" />
                作品材料
              </div>
              <div>
                <CheckCircleOutlined
                  v-if="record.hasIdCard"
                  class="text-green-500 mr-1"
                />
                <CloseCircleOutlined v-else class="text-red-500 mr-1" />
                身份证明
              </div>
            </a-space>
          </template>

          <!-- 操作 -->
          <template v-else-if="column.key === 'action'">
            <a-space direction="vertical" :size="4">
              <a-button
                type="primary"
                size="small"
                block
                v-if="record.status === 'pending'"
                @click="handleQuickApprove(record)"
              >
                <CheckOutlined />
                快速通过
              </a-button>
              <a-button
                size="small"
                block
                @click="handleViewDetail(record)"
              >
                <FileSearchOutlined />
                查看详情
              </a-button>
              <a-button
                size="small"
                block
                danger
                v-if="record.status === 'pending'"
                @click="handleShowRejectModal(record)"
              >
                <CloseOutlined />
                拒绝
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 审核详情抽屉 -->
    <a-drawer
      v-model:open="detailDrawerVisible"
      title="审核详情"
      width="800"
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
            <a-descriptions-item label="身份证号" :span="2">
              {{ currentRecord?.idCard || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="报名时间" :span="2">
              {{ currentRecord?.createdAt }}
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
            </a-descriptions>

            <a-divider>作品附件</a-divider>
            <a-list :data-source="currentRecord?.workFiles || []" bordered>
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
                    <template #title>
                      <FileOutlined class="mr-2" />
                      {{ item.name }}
                    </template>
                    <template #description>
                      {{ item.size }}
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </div>
          <a-empty v-else description="未提交作品" />
        </a-tab-pane>

        <!-- 审核记录 -->
        <a-tab-pane key="audit" tab="审核记录">
          <a-timeline v-if="currentRecord?.auditHistory && currentRecord.auditHistory.length > 0">
            <a-timeline-item
              v-for="item in currentRecord?.auditHistory"
              :key="item.time"
              :color="item.action === 'approved' ? 'green' : 'red'"
            >
              <template #dot>
                <CheckCircleOutlined v-if="item.action === 'approved'" />
                <CloseCircleOutlined v-else />
              </template>
              <div class="space-y-1">
                <div class="font-medium">
                  {{ item.action === 'approved' ? '审核通过' : '审核拒绝' }}
                </div>
                <div class="text-sm text-gray-600">
                  审核人: {{ item.auditor }}
                </div>
                <div class="text-sm text-gray-600">
                  时间: {{ item.time }}
                </div>
                <div v-if="item.comment" class="text-sm text-gray-700 mt-2">
                  {{ item.comment }}
                </div>
              </div>
            </a-timeline-item>
          </a-timeline>
          <a-empty v-else description="暂无审核记录" />
        </a-tab-pane>
      </a-tabs>

      <template #footer>
        <a-space>
          <a-button @click="detailDrawerVisible = false">关闭</a-button>
          <a-button
            v-if="currentRecord?.status === 'pending'"
            type="primary"
            @click="handleApproveFromDrawer"
          >
            <CheckOutlined />
            通过审核
          </a-button>
          <a-button
            v-if="currentRecord?.status === 'pending'"
            danger
            @click="handleShowRejectModal(currentRecord)"
          >
            <CloseOutlined />
            拒绝审核
          </a-button>
        </a-space>
      </template>
    </a-drawer>

    <!-- 拒绝审核弹窗 -->
    <a-modal
      v-model:open="rejectModalVisible"
      title="拒绝审核"
      @ok="handleConfirmReject"
      @cancel="rejectModalVisible = false"
    >
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item label="拒绝原因" required>
          <a-select
            v-model:value="rejectForm.reason"
            placeholder="请选择拒绝原因"
          >
            <a-select-option value="材料不全">材料不全</a-select-option>
            <a-select-option value="不符合条件">不符合报名条件</a-select-option>
            <a-select-option value="信息有误">信息有误</a-select-option>
            <a-select-option value="其他">其他</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="详细说明">
          <a-textarea
            v-model:value="rejectForm.comment"
            :rows="4"
            placeholder="请输入详细说明（选填）"
          />
        </a-form-item>
        <a-form-item label="发送通知">
          <a-checkbox v-model:checked="rejectForm.sendNotification">
            向参赛者发送拒绝通知
          </a-checkbox>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 审核记录弹窗 -->
    <a-modal
      v-model:open="historyModalVisible"
      title="审核记录"
      width="900px"
      :footer="null"
    >
      <a-table
        :columns="historyColumns"
        :data-source="auditHistory"
        :pagination="false"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-tag :color="record.action === 'approved' ? 'green' : 'red'">
              {{ record.action === 'approved' ? '通过' : '拒绝' }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </a-modal>
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
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileSearchOutlined,
  HistoryOutlined,
  EyeOutlined,
  DownloadOutlined,
  FileOutlined,
} from '@ant-design/icons-vue'

// 统计数据
const statistics = reactive({
  pending: 15,
  approved: 138,
  rejected: 6,
  today: 23,
})

// 查询参数
const queryParams = reactive({
  activityId: undefined as string | undefined,
  status: 'pending',
  keyword: '',
})

// 表格数据
const loading = ref(false)
const dataSource = ref([
  {
    id: '1',
    name: '李四',
    phone: '13900139002',
    email: 'lisi@example.com',
    organization: '北京大学',
    activityName: '2025年度创新设计大赛',
    method: 'team',
    teamSize: 3,
    status: 'pending',
    hasBasicInfo: true,
    hasWork: false,
    hasIdCard: true,
    workTitle: null,
    workDescription: null,
    workFiles: [],
    idCard: '110101199001011234',
    createdAt: '2025-01-12 16:20:00',
    auditedAt: null,
    auditor: null,
    auditComment: null,
    auditHistory: [],
  },
  {
    id: '2',
    name: '赵六',
    phone: '13600136004',
    email: 'zhaoliu@example.com',
    organization: '浙江大学',
    activityName: '2025年度创新设计大赛',
    method: 'individual',
    teamSize: null,
    status: 'pending',
    hasBasicInfo: true,
    hasWork: true,
    hasIdCard: true,
    workTitle: '智能医疗诊断系统',
    workDescription: '基于AI的辅助诊断系统',
    workFiles: [
      { name: '项目说明.pdf', size: '3.2MB' },
      { name: '技术文档.docx', size: '1.5MB' },
    ],
    idCard: '330106199102021234',
    createdAt: '2025-01-13 09:45:00',
    auditedAt: null,
    auditor: null,
    auditComment: null,
    auditHistory: [],
  },
  {
    id: '3',
    name: '孙七',
    phone: '13500135005',
    email: 'sunqi@example.com',
    organization: '上海交通大学',
    activityName: '优秀项目评审活动',
    method: 'individual',
    teamSize: null,
    status: 'approved',
    hasBasicInfo: true,
    hasWork: true,
    hasIdCard: true,
    workTitle: '绿色能源管理平台',
    workDescription: '智能能源调度与管理',
    workFiles: [
      { name: '项目计划书.pdf', size: '2.8MB' },
    ],
    idCard: '310104199203031234',
    createdAt: '2025-01-11 14:30:00',
    auditedAt: '2025-01-12 10:15:00',
    auditor: '管理员',
    auditComment: '材料齐全，符合要求',
    auditHistory: [
      {
        action: 'approved',
        auditor: '管理员',
        time: '2025-01-12 10:15:00',
        comment: '材料齐全，符合要求',
      },
    ],
  },
])

// 表格列
const columns = [
  { title: '参赛者信息', key: 'participant', width: 180 },
  { title: '报名信息', key: 'info', width: 250 },
  { title: '审核状态', key: 'status', width: 120, align: 'center' as const },
  { title: '材料完整性', key: 'materials', width: 150 },
  { title: '操作', key: 'action', width: 180, align: 'center' as const },
]

// 审核记录表格列
const historyColumns = [
  { title: '参赛者', dataIndex: 'name', key: 'name', width: 120 },
  { title: '活动', dataIndex: 'activityName', key: 'activityName', width: 180 },
  { title: '审核动作', key: 'action', width: 100, align: 'center' as const },
  { title: '审核人', dataIndex: 'auditor', key: 'auditor', width: 100 },
  { title: '审核时间', dataIndex: 'auditedAt', key: 'auditedAt', width: 180 },
  { title: '审核意见', dataIndex: 'auditComment', key: 'auditComment', ellipsis: true },
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
  getCheckboxProps: (record: typeof dataSource.value[0]) => ({
    disabled: record.status !== 'pending',
  }),
}))

const clearSelection = () => {
  selectedRowKeys.value = []
}

// 详情抽屉
const detailDrawerVisible = ref(false)
const detailTab = ref('basic')
const currentRecord = ref<typeof dataSource.value[0] | null>(null)

// 拒绝弹窗
const rejectModalVisible = ref(false)
const rejectForm = reactive({
  reason: '',
  comment: '',
  sendNotification: true,
})

// 审核记录弹窗
const historyModalVisible = ref(false)
const auditHistory = ref([
  {
    id: '1',
    name: '张三',
    activityName: '2025年度创新设计大赛',
    action: 'approved',
    auditor: '管理员',
    auditedAt: '2025-01-15 10:30:00',
    auditComment: '材料齐全，符合要求',
  },
  {
    id: '2',
    name: '王五',
    activityName: '优秀项目评审活动',
    action: 'rejected',
    auditor: '管理员',
    auditedAt: '2025-01-14 14:20:00',
    auditComment: '提交材料不完整',
  },
])

// 状态辅助函数
const getStatusColor = (status?: string) => {
  const colors = {
    pending: 'orange',
    approved: 'green',
    rejected: 'red',
  }
  return colors[status as keyof typeof colors] || 'default'
}

const getStatusLabel = (status?: string) => {
  const labels = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
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
  queryParams.status = 'pending'
  queryParams.keyword = ''
  handleSearch()
}

const handleTableChange = (pag: typeof pagination) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}

const handleViewDetail = (record: typeof dataSource.value[0]) => {
  currentRecord.value = record
  detailTab.value = 'basic'
  detailDrawerVisible.value = true
}

const handleQuickApprove = (record: typeof dataSource.value[0]) => {
  Modal.confirm({
    title: '快速通过',
    content: `确定要通过「${record.name}」的报名申请吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      record.status = 'approved'
      record.auditedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
      record.auditor = '当前用户'
      record.auditComment = '审核通过'
      
      // 更新统计
      statistics.pending--
      statistics.approved++
      statistics.today++
      
      message.success('审核通过')
    },
  })
}

const handleApproveFromDrawer = () => {
  if (!currentRecord.value) return
  
  handleQuickApprove(currentRecord.value)
  detailDrawerVisible.value = false
}

const handleShowRejectModal = (record: typeof dataSource.value[0]) => {
  currentRecord.value = record
  rejectForm.reason = ''
  rejectForm.comment = ''
  rejectForm.sendNotification = true
  rejectModalVisible.value = true
  detailDrawerVisible.value = false
}

const handleConfirmReject = () => {
  if (!rejectForm.reason) {
    message.error('请选择拒绝原因')
    return
  }
  
  if (!currentRecord.value) return
  
  currentRecord.value.status = 'rejected'
  currentRecord.value.auditedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
  currentRecord.value.auditor = '当前用户'
  currentRecord.value.auditComment = `${rejectForm.reason}${rejectForm.comment ? ': ' + rejectForm.comment : ''}`
  
  // 更新统计
  statistics.pending--
  statistics.rejected++
  statistics.today++
  
  message.success('已拒绝')
  rejectModalVisible.value = false
}

const handleBatchApprove = () => {
  Modal.confirm({
    title: '批量通过',
    content: `确定要通过选中的 ${selectedRowKeys.value.length} 个报名申请吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      let count = 0
      dataSource.value.forEach((item) => {
        if (selectedRowKeys.value.includes(item.id) && item.status === 'pending') {
          item.status = 'approved'
          item.auditedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
          item.auditor = '当前用户'
          item.auditComment = '批量审核通过'
          count++
        }
      })
      
      // 更新统计
      statistics.pending -= count
      statistics.approved += count
      statistics.today += count
      
      message.success(`已通过 ${count} 个申请`)
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
      let count = 0
      dataSource.value.forEach((item) => {
        if (selectedRowKeys.value.includes(item.id) && item.status === 'pending') {
          item.status = 'rejected'
          item.auditedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
          item.auditor = '当前用户'
          item.auditComment = '批量审核拒绝'
          count++
        }
      })
      
      // 更新统计
      statistics.pending -= count
      statistics.rejected += count
      statistics.today += count
      
      message.success(`已拒绝 ${count} 个申请`)
      clearSelection()
    },
  })
}

const handleViewAuditHistory = () => {
  historyModalVisible.value = true
}
</script>

<style scoped>
.participant-audit-page {
  padding: 0;
}
</style>
