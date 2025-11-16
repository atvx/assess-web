<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="expert-page">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">专家管理</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        管理评审专家信息、资质认证和评审历史
      </p>
    </div>

    <!-- 搜索筛选区域 -->
    <a-card :bordered="false" class="mb-4">
      <a-form layout="inline" :model="queryParams">
        <a-form-item label="关键词">
          <a-input
            v-model:value="queryParams.keyword"
            placeholder="姓名/工号/专业领域"
            allow-clear
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item label="专家级别">
          <a-select
            v-model:value="queryParams.level"
            placeholder="请选择级别"
            allow-clear
            style="width: 150px"
          >
            <a-select-option value="senior">高级专家</a-select-option>
            <a-select-option value="intermediate">中级专家</a-select-option>
            <a-select-option value="junior">初级专家</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="认证状态">
          <a-select
            v-model:value="queryParams.certStatus"
            placeholder="请选择状态"
            allow-clear
            style="width: 150px"
          >
            <a-select-option value="certified">已认证</a-select-option>
            <a-select-option value="pending">待认证</a-select-option>
            <a-select-option value="expired">已过期</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-model:value="queryParams.status"
            placeholder="请选择状态"
            allow-clear
            style="width: 120px"
          >
            <a-select-option value="active">在职</a-select-option>
            <a-select-option value="inactive">离职</a-select-option>
          </a-select>
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
            添加专家
          </a-button>
          <a-button @click="handleImport">
            <template #icon><ImportOutlined /></template>
            批量导入
          </a-button>
          <a-button @click="handleExport">
            <template #icon><ExportOutlined /></template>
            导出数据
          </a-button>
        </a-space>
      </div>

      <!-- 专家列表表格 -->
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- 专家信息 -->
          <template v-if="column.key === 'expert'">
            <div class="flex items-center">
              <a-avatar :src="record.avatar" :size="48" class="mr-3">
                {{ record.name.substring(0, 1) }}
              </a-avatar>
              <div>
                <div class="font-medium text-gray-900 dark:text-gray-100">
                  {{ record.name }}
                  <a-tag
                    :color="getLevelColor(record.level)"
                    class="ml-2"
                  >
                    {{ getLevelLabel(record.level) }}
                  </a-tag>
                </div>
                <div class="text-xs text-gray-500">
                  工号: {{ record.workId }} | {{ record.phone }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ record.organization }}
                </div>
              </div>
            </div>
          </template>

          <!-- 专业领域 -->
          <template v-else-if="column.key === 'expertise'">
            <div class="space-y-1">
              <a-tag
                v-for="field in record.expertiseFields"
                :key="field"
                color="blue"
              >
                {{ field }}
              </a-tag>
            </div>
          </template>

          <!-- 认证状态 -->
          <template v-else-if="column.key === 'certification'">
            <div>
              <a-tag :color="getCertStatusColor(record.certStatus)">
                {{ getCertStatusLabel(record.certStatus) }}
              </a-tag>
              <div v-if="record.certExpireDate" class="text-xs text-gray-500 mt-1">
                到期: {{ record.certExpireDate }}
              </div>
            </div>
          </template>

          <!-- 评审统计 -->
          <template v-else-if="column.key === 'stats'">
            <div class="text-center">
              <div class="font-medium text-lg">{{ record.reviewCount }}</div>
              <div class="text-xs text-gray-500">已评审</div>
              <a-progress
                :percent="record.completionRate"
                :size="'small'"
                :show-info="false"
                class="mt-1"
              />
              <div class="text-xs text-gray-500">
                完成率 {{ record.completionRate }}%
              </div>
            </div>
          </template>

          <!-- 状态 -->
          <template v-else-if="column.key === 'status'">
            <a-switch
              :checked="record.status === 'active'"
              @change="(checked: boolean) => handleStatusChange(record, checked)"
            >
              <template #checkedChildren>在职</template>
              <template #unCheckedChildren>离职</template>
            </a-switch>
          </template>

          <!-- 操作 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">
                <EyeOutlined />
                查看
              </a-button>
              <a-dropdown>
                <template #overlay>
                  <a-menu @click="({ key }: { key: string }) => handleMenuClick(key, record)">
                    <a-menu-item key="edit">
                      <EditOutlined />
                      编辑信息
                    </a-menu-item>
                    <a-menu-item key="cert">
                      <SafetyOutlined />
                      资质认证
                    </a-menu-item>
                    <a-menu-item key="history">
                      <HistoryOutlined />
                      评审历史
                    </a-menu-item>
                    <a-menu-item key="assign">
                      <UsergroupAddOutlined />
                      分配任务
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="delete" danger>
                      <DeleteOutlined />
                      删除专家
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
      title="专家详情"
      width="800"
      :body-style="{ paddingBottom: '80px' }"
    >
      <a-tabs v-model:activeKey="detailTab">
        <!-- 基本信息 -->
        <a-tab-pane key="basic" tab="基本信息">
          <div class="text-center mb-6">
            <a-avatar :src="currentExpert?.avatar" :size="100">
              {{ currentExpert?.name.substring(0, 1) }}
            </a-avatar>
            <div class="mt-3 text-xl font-bold">{{ currentExpert?.name }}</div>
            <a-tag :color="getLevelColor(currentExpert?.level)" class="mt-2">
              {{ getLevelLabel(currentExpert?.level) }}
            </a-tag>
          </div>

          <a-descriptions bordered :column="2">
            <a-descriptions-item label="工号">
              {{ currentExpert?.workId }}
            </a-descriptions-item>
            <a-descriptions-item label="手机号">
              {{ currentExpert?.phone }}
            </a-descriptions-item>
            <a-descriptions-item label="邮箱">
              {{ currentExpert?.email }}
            </a-descriptions-item>
            <a-descriptions-item label="性别">
              {{ currentExpert?.gender === 'male' ? '男' : '女' }}
            </a-descriptions-item>
            <a-descriptions-item label="所属机构" :span="2">
              {{ currentExpert?.organization }}
            </a-descriptions-item>
            <a-descriptions-item label="职称">
              {{ currentExpert?.title }}
            </a-descriptions-item>
            <a-descriptions-item label="学历">
              {{ currentExpert?.education }}
            </a-descriptions-item>
            <a-descriptions-item label="专业领域" :span="2">
              <a-space>
                <a-tag
                  v-for="field in currentExpert?.expertiseFields"
                  :key="field"
                  color="blue"
                >
                  {{ field }}
                </a-tag>
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="工作经验" :span="2">
              {{ currentExpert?.experience }}
            </a-descriptions-item>
            <a-descriptions-item label="个人简介" :span="2">
              {{ currentExpert?.bio || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="状态">
              <a-tag :color="currentExpert?.status === 'active' ? 'green' : 'default'">
                {{ currentExpert?.status === 'active' ? '在职' : '离职' }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="入职时间">
              {{ currentExpert?.joinedAt }}
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>

        <!-- 资质认证 -->
        <a-tab-pane key="certification" tab="资质认证">
          <a-descriptions bordered :column="2">
            <a-descriptions-item label="认证状态" :span="2">
              <a-tag :color="getCertStatusColor(currentExpert?.certStatus)">
                {{ getCertStatusLabel(currentExpert?.certStatus) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="认证编号">
              {{ currentExpert?.certNumber || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="认证日期">
              {{ currentExpert?.certDate || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="有效期至">
              {{ currentExpert?.certExpireDate || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="认证机构">
              {{ currentExpert?.certOrganization || '-' }}
            </a-descriptions-item>
          </a-descriptions>

          <a-divider>认证材料</a-divider>
          <a-list
            v-if="currentExpert?.certDocuments && currentExpert.certDocuments.length > 0"
            :data-source="currentExpert?.certDocuments"
            bordered
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <a-button type="link" size="small">
                    <EyeOutlined />
                    查看
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
                    {{ item.type }} | 上传于 {{ item.uploadedAt }}
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
          <a-empty v-else description="暂无认证材料" />

          <div class="mt-4">
            <a-button
              type="primary"
              @click="handleCertification(currentExpert)"
              v-if="currentExpert?.certStatus !== 'certified'"
            >
              <SafetyOutlined />
              提交认证
            </a-button>
            <a-button
              @click="handleRenewCertification(currentExpert)"
              v-if="currentExpert?.certStatus === 'expired'"
            >
              <ReloadOutlined />
              续期认证
            </a-button>
          </div>
        </a-tab-pane>

        <!-- 评审历史 -->
        <a-tab-pane key="history" tab="评审历史">
          <a-row :gutter="16" class="mb-4">
            <a-col :span="8">
              <a-statistic title="总评审数" :value="currentExpert?.reviewCount || 0" suffix="次" />
            </a-col>
            <a-col :span="8">
              <a-statistic
                title="完成率"
                :value="currentExpert?.completionRate || 0"
                suffix="%"
              />
            </a-col>
            <a-col :span="8">
              <a-statistic
                title="平均评分"
                :value="currentExpert?.avgRating || 0"
                :precision="1"
                suffix="分"
              />
            </a-col>
          </a-row>

          <a-divider>评审记录</a-divider>
          <a-table
            :columns="historyColumns"
            :data-source="currentExpert?.reviewHistory || []"
            :pagination="false"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <a-tag :color="record.status === 'completed' ? 'green' : 'orange'">
                  {{ record.status === 'completed' ? '已完成' : '进行中' }}
                </a-tag>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>

      <template #footer>
        <a-space>
          <a-button @click="detailDrawerVisible = false">关闭</a-button>
          <a-button type="primary" @click="handleEdit(currentExpert)">
            <EditOutlined />
            编辑信息
          </a-button>
        </a-space>
      </template>
    </a-drawer>

    <!-- 新增/编辑专家弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑专家' : '添加专家'"
      width="700px"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
      >
        <a-form-item label="姓名" name="name">
          <a-input v-model:value="formData.name" placeholder="请输入姓名" />
        </a-form-item>

        <a-form-item label="工号" name="workId">
          <a-input v-model:value="formData.workId" placeholder="请输入工号" />
        </a-form-item>

        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="formData.phone" placeholder="请输入手机号" />
        </a-form-item>

        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formData.email" placeholder="请输入邮箱" />
        </a-form-item>

        <a-form-item label="性别" name="gender">
          <a-radio-group v-model:value="formData.gender">
            <a-radio value="male">男</a-radio>
            <a-radio value="female">女</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="专家级别" name="level">
          <a-select v-model:value="formData.level" placeholder="请选择级别">
            <a-select-option value="senior">高级专家</a-select-option>
            <a-select-option value="intermediate">中级专家</a-select-option>
            <a-select-option value="junior">初级专家</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="所属机构" name="organization">
          <a-input v-model:value="formData.organization" placeholder="请输入所属机构" />
        </a-form-item>

        <a-form-item label="职称" name="title">
          <a-input v-model:value="formData.title" placeholder="请输入职称" />
        </a-form-item>

        <a-form-item label="学历" name="education">
          <a-select v-model:value="formData.education" placeholder="请选择学历">
            <a-select-option value="博士">博士</a-select-option>
            <a-select-option value="硕士">硕士</a-select-option>
            <a-select-option value="本科">本科</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="专业领域" name="expertiseFields">
          <a-select
            v-model:value="formData.expertiseFields"
            mode="multiple"
            placeholder="请选择专业领域"
          >
            <a-select-option value="计算机">计算机</a-select-option>
            <a-select-option value="人工智能">人工智能</a-select-option>
            <a-select-option value="大数据">大数据</a-select-option>
            <a-select-option value="物联网">物联网</a-select-option>
            <a-select-option value="云计算">云计算</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="工作经验" name="experience">
          <a-input v-model:value="formData.experience" placeholder="例如：10年" />
        </a-form-item>

        <a-form-item label="个人简介">
          <a-textarea
            v-model:value="formData.bio"
            :rows="3"
            placeholder="请输入个人简介"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 资质认证弹窗 -->
    <a-modal
      v-model:open="certModalVisible"
      title="资质认证"
      width="600px"
      @ok="handleSubmitCertification"
      @cancel="certModalVisible = false"
    >
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="认证编号">
          <a-input v-model:value="certForm.certNumber" placeholder="请输入认证编号" />
        </a-form-item>

        <a-form-item label="认证日期">
          <a-date-picker
            v-model:value="certForm.certDate"
            class="w-full"
            placeholder="选择认证日期"
          />
        </a-form-item>

        <a-form-item label="有效期">
          <a-date-picker
            v-model:value="certForm.certExpireDate"
            class="w-full"
            placeholder="选择到期日期"
          />
        </a-form-item>

        <a-form-item label="认证机构">
          <a-input v-model:value="certForm.certOrganization" placeholder="请输入认证机构" />
        </a-form-item>

        <a-form-item label="认证材料">
          <a-upload
            :file-list="certForm.documents"
            :before-upload="() => false"
            @change="handleUploadChange"
          >
            <a-button>
              <UploadOutlined />
              上传材料
            </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  ImportOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  SafetyOutlined,
  HistoryOutlined,
  UsergroupAddOutlined,
  DownloadOutlined,
  FileOutlined,
  UploadOutlined,
} from '@ant-design/icons-vue'

// 查询参数
const queryParams = reactive({
  keyword: '',
  level: undefined as string | undefined,
  certStatus: undefined as string | undefined,
  status: undefined as string | undefined,
})

// 表格数据
const loading = ref(false)
const dataSource = ref([
  {
    id: '1',
    name: '李教授',
    workId: 'EXP001',
    phone: '13800138001',
    email: 'liprof@university.edu',
    gender: 'male',
    avatar: '',
    level: 'senior',
    organization: '清华大学计算机学院',
    title: '教授',
    education: '博士',
    expertiseFields: ['人工智能', '大数据'],
    experience: '15年',
    bio: '计算机视觉领域专家，发表论文100余篇',
    status: 'active',
    certStatus: 'certified',
    certNumber: 'CERT2024001',
    certDate: '2024-01-01',
    certExpireDate: '2026-12-31',
    certOrganization: '中国计算机学会',
    certDocuments: [
      { name: '专家证书.pdf', type: '证书', uploadedAt: '2024-01-01' },
      { name: '职称证明.pdf', type: '职称', uploadedAt: '2024-01-01' },
    ],
    reviewCount: 56,
    completionRate: 95,
    avgRating: 4.8,
    joinedAt: '2020-03-15',
    reviewHistory: [
      {
        activityName: '2025年度创新设计大赛',
        round: '初审',
        reviewCount: 15,
        completedAt: '2025-01-20',
        status: 'completed',
      },
      {
        activityName: '优秀项目评审活动',
        round: '复审',
        reviewCount: 8,
        completedAt: '2025-01-15',
        status: 'completed',
      },
    ],
  },
  {
    id: '2',
    name: '王专家',
    workId: 'EXP002',
    phone: '13900139002',
    email: 'wangexpert@company.com',
    gender: 'female',
    avatar: '',
    level: 'intermediate',
    organization: '北京大学信息学院',
    title: '副教授',
    education: '博士',
    expertiseFields: ['云计算', '物联网'],
    experience: '10年',
    bio: '云计算架构专家',
    status: 'active',
    certStatus: 'pending',
    certNumber: null,
    certDate: null,
    certExpireDate: null,
    certOrganization: null,
    certDocuments: [],
    reviewCount: 32,
    completionRate: 88,
    avgRating: 4.5,
    joinedAt: '2021-06-20',
    reviewHistory: [
      {
        activityName: '2025年度创新设计大赛',
        round: '初审',
        reviewCount: 12,
        completedAt: null,
        status: 'ongoing',
      },
    ],
  },
  {
    id: '3',
    name: '张工程师',
    workId: 'EXP003',
    phone: '13700137003',
    email: 'zhangengineer@corp.com',
    gender: 'male',
    avatar: '',
    level: 'junior',
    organization: '阿里巴巴集团',
    title: '高级工程师',
    education: '硕士',
    expertiseFields: ['大数据', '人工智能'],
    experience: '5年',
    bio: '大数据分析专家',
    status: 'active',
    certStatus: 'expired',
    certNumber: 'CERT2022005',
    certDate: '2022-01-01',
    certExpireDate: '2024-12-31',
    certOrganization: '工信部',
    certDocuments: [
      { name: '工程师证书.pdf', type: '证书', uploadedAt: '2022-01-01' },
    ],
    reviewCount: 18,
    completionRate: 92,
    avgRating: 4.3,
    joinedAt: '2023-01-10',
    reviewHistory: [],
  },
])

// 表格列
const columns = [
  { title: '专家信息', key: 'expert', width: 300 },
  { title: '专业领域', key: 'expertise', width: 180 },
  { title: '资质认证', key: 'certification', width: 150, align: 'center' as const },
  { title: '评审统计', key: 'stats', width: 150, align: 'center' as const },
  { title: '状态', key: 'status', width: 120, align: 'center' as const },
  { title: '操作', key: 'action', width: 180, fixed: 'right' as const },
]

// 评审历史表格列
const historyColumns = [
  { title: '活动名称', dataIndex: 'activityName', key: 'activityName' },
  { title: '评审轮次', dataIndex: 'round', key: 'round', width: 100 },
  { title: '评审数量', dataIndex: 'reviewCount', key: 'reviewCount', width: 100 },
  { title: '完成时间', dataIndex: 'completedAt', key: 'completedAt', width: 180 },
  { title: '状态', key: 'status', width: 100 },
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

// 详情抽屉
const detailDrawerVisible = ref(false)
const detailTab = ref('basic')
const currentExpert = ref<typeof dataSource.value[0] | null>(null)

// 新增/编辑弹窗
const modalVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const formData = reactive({
  id: '',
  name: '',
  workId: '',
  phone: '',
  email: '',
  gender: 'male',
  level: 'intermediate',
  organization: '',
  title: '',
  education: '',
  expertiseFields: [] as string[],
  experience: '',
  bio: '',
})

const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  workId: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
}

// 资质认证弹窗
const certModalVisible = ref(false)
const certForm = reactive({
  certNumber: '',
  certDate: undefined as string | undefined,
  certExpireDate: undefined as string | undefined,
  certOrganization: '',
  documents: [] as unknown[],
})

// 辅助函数
const getLevelColor = (level?: string) => {
  const colors = {
    senior: 'red',
    intermediate: 'blue',
    junior: 'green',
  }
  return colors[level as keyof typeof colors] || 'default'
}

const getLevelLabel = (level?: string) => {
  const labels = {
    senior: '高级专家',
    intermediate: '中级专家',
    junior: '初级专家',
  }
  return labels[level as keyof typeof labels] || level
}

const getCertStatusColor = (status?: string) => {
  const colors = {
    certified: 'green',
    pending: 'orange',
    expired: 'red',
  }
  return colors[status as keyof typeof colors] || 'default'
}

const getCertStatusLabel = (status?: string) => {
  const labels = {
    certified: '已认证',
    pending: '待认证',
    expired: '已过期',
  }
  return labels[status as keyof typeof labels] || status
}

// 事件处理
const handleSearch = () => {
  pagination.current = 1
  message.info('搜索功能待实现')
}

const handleReset = () => {
  queryParams.keyword = ''
  queryParams.level = undefined
  queryParams.certStatus = undefined
  queryParams.status = undefined
  handleSearch()
}

const handleTableChange = (pag: typeof pagination) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, {
    id: '',
    name: '',
    workId: '',
    phone: '',
    email: '',
    gender: 'male',
    level: 'intermediate',
    organization: '',
    title: '',
    education: '',
    expertiseFields: [],
    experience: '',
    bio: '',
  })
  modalVisible.value = true
}

const handleEdit = (record: typeof dataSource.value[0] | null) => {
  if (!record) return
  
  isEdit.value = true
  Object.assign(formData, {
    id: record.id,
    name: record.name,
    workId: record.workId,
    phone: record.phone,
    email: record.email,
    gender: record.gender,
    level: record.level,
    organization: record.organization,
    title: record.title,
    education: record.education,
    expertiseFields: [...record.expertiseFields],
    experience: record.experience,
    bio: record.bio,
  })
  modalVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    
    if (isEdit.value) {
      const index = dataSource.value.findIndex((item) => item.id === formData.id)
      if (index > -1) {
        Object.assign(dataSource.value[index], formData)
      }
      message.success('编辑成功')
    } else {
      const newExpert = {
        ...formData,
        id: String(Date.now()),
        avatar: '',
        status: 'active',
        certStatus: 'pending',
        certNumber: null,
        certDate: null,
        certExpireDate: null,
        certOrganization: null,
        certDocuments: [],
        reviewCount: 0,
        completionRate: 0,
        avgRating: 0,
        joinedAt: new Date().toISOString().slice(0, 10),
        reviewHistory: [],
      }
      dataSource.value.push(newExpert)
      pagination.total++
      message.success('添加成功')
    }
    
    modalVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleCancel = () => {
  modalVisible.value = false
  formRef.value?.resetFields()
}

const handleView = (record: typeof dataSource.value[0]) => {
  currentExpert.value = record
  detailTab.value = 'basic'
  detailDrawerVisible.value = true
}

const handleMenuClick = (key: string, record: typeof dataSource.value[0]) => {
  currentExpert.value = record
  
  switch (key) {
    case 'edit':
      handleEdit(record)
      break
    case 'cert':
      handleCertification(record)
      break
    case 'history':
      detailTab.value = 'history'
      detailDrawerVisible.value = true
      break
    case 'assign':
      message.info('分配任务功能待实现')
      break
    case 'delete':
      handleDelete(record)
      break
  }
}

const handleCertification = (record: typeof dataSource.value[0] | null) => {
  if (!record) return
  
  currentExpert.value = record
  certForm.certNumber = record.certNumber || ''
  certForm.certDate = record.certDate || undefined
  certForm.certExpireDate = record.certExpireDate || undefined
  certForm.certOrganization = record.certOrganization || ''
  certForm.documents = []
  certModalVisible.value = true
}

const handleRenewCertification = (record: typeof dataSource.value[0] | null) => {
  if (!record) return
  handleCertification(record)
}

const handleSubmitCertification = () => {
  if (!currentExpert.value) return
  
  currentExpert.value.certStatus = 'certified'
  currentExpert.value.certNumber = certForm.certNumber
  currentExpert.value.certDate = certForm.certDate || null
  currentExpert.value.certExpireDate = certForm.certExpireDate || null
  currentExpert.value.certOrganization = certForm.certOrganization
  
  message.success('认证成功')
  certModalVisible.value = false
}

const handleUploadChange = () => {
  // 处理文件上传
}

const handleStatusChange = (record: typeof dataSource.value[0], checked: boolean) => {
  record.status = checked ? 'active' : 'inactive'
  message.success(`已${checked ? '激活' : '停用'}`)
}

const handleDelete = (record: typeof dataSource.value[0]) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除专家「${record.name}」吗？此操作不可恢复！`,
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

const handleImport = () => {
  message.info('批量导入功能待实现')
}

const handleExport = () => {
  message.success('导出数据功能待实现')
}
</script>

<style scoped>
.expert-page {
  padding: 0;
}
</style>
