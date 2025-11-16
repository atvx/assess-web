<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="activity-template-page">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">活动模板管理</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        创建和管理活动模板，快速生成标准化活动
      </p>
    </div>

    <!-- 工具栏 -->
    <a-card :bordered="false" class="mb-4">
      <div class="flex justify-between items-center">
        <a-space>
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="搜索模板名称"
            style="width: 250px"
            @search="handleSearch"
          />
          <a-select
            v-model:value="typeFilter"
            placeholder="类型筛选"
            style="width: 150px"
            allow-clear
            @change="handleSearch"
          >
            <a-select-option value="competition">竞赛</a-select-option>
            <a-select-option value="evaluation">评审</a-select-option>
            <a-select-option value="exhibition">展览</a-select-option>
          </a-select>
          <a-select
            v-model:value="statusFilter"
            placeholder="状态筛选"
            style="width: 120px"
            allow-clear
            @change="handleSearch"
          >
            <a-select-option value="enabled">启用</a-select-option>
            <a-select-option value="disabled">禁用</a-select-option>
          </a-select>
        </a-space>
        <a-space>
          <a-radio-group v-model:value="viewMode" button-style="solid">
            <a-radio-button value="card">
              <AppstoreOutlined />
              卡片
            </a-radio-button>
            <a-radio-button value="list">
              <UnorderedListOutlined />
              列表
            </a-radio-button>
          </a-radio-group>
          <a-button type="primary" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            新增模板
          </a-button>
        </a-space>
      </div>
    </a-card>

    <!-- 卡片视图 -->
    <div v-if="viewMode === 'card'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <a-card
        v-for="template in dataSource"
        :key="template.id"
        :bordered="false"
        hoverable
        class="template-card"
      >
        <template #cover>
          <div
            class="h-40 bg-gradient-to-br flex items-center justify-center relative"
            :style="{
              backgroundImage: template.cover
                ? `url(${template.cover})`
                : `linear-gradient(135deg, ${template.color} 0%, ${template.color}dd 100%)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }"
          >
            <div v-if="!template.cover" class="text-white text-4xl font-bold opacity-20">
              {{ template.name.substring(0, 2) }}
            </div>
            <div class="absolute top-2 right-2">
              <a-tag :color="template.status === 'enabled' ? 'success' : 'default'">
                {{ template.status === 'enabled' ? '启用' : '禁用' }}
              </a-tag>
            </div>
            <div v-if="template.isDefault" class="absolute top-2 left-2">
              <a-tag color="blue">默认模板</a-tag>
            </div>
          </div>
        </template>

        <a-card-meta :title="template.name">
          <template #description>
            <div class="space-y-2">
              <div class="text-xs text-gray-500">
                {{ template.description }}
              </div>
              <div class="flex items-center gap-2 text-xs">
                <a-tag :color="getTypeColor(template.type)">
                  {{ getTypeLabel(template.type) }}
                </a-tag>
                <span class="text-gray-500">使用 {{ template.usageCount }} 次</span>
              </div>
            </div>
          </template>
        </a-card-meta>

        <template #actions>
          <a-tooltip title="预览">
            <EyeOutlined @click="handleView(template)" />
          </a-tooltip>
          <a-tooltip title="快速创建">
            <ThunderboltOutlined @click="handleQuickCreate(template)" />
          </a-tooltip>
          <a-tooltip title="编辑">
            <EditOutlined @click="handleEdit(template)" />
          </a-tooltip>
          <a-dropdown>
            <template #overlay>
              <a-menu @click="({ key }: { key: string }) => handleMenuClick(key, template)">
                <a-menu-item key="copy">
                  <CopyOutlined />
                  复制模板
                </a-menu-item>
                <a-menu-item key="config">
                  <SettingOutlined />
                  详情配置
                </a-menu-item>
                <a-menu-item
                  key="setDefault"
                  v-if="!template.isDefault"
                >
                  <StarOutlined />
                  设为默认
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="delete" danger>
                  <DeleteOutlined />
                  删除模板
                </a-menu-item>
              </a-menu>
            </template>
            <MoreOutlined />
          </a-dropdown>
        </template>
      </a-card>
    </div>

    <!-- 列表视图 -->
    <a-card v-else :bordered="false">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- 模板信息 -->
          <template v-if="column.key === 'name'">
            <div class="flex items-center">
              <div
                class="w-12 h-12 rounded mr-3 flex items-center justify-center text-white font-bold"
                :style="{ backgroundColor: record.color }"
              >
                {{ record.name.substring(0, 2) }}
              </div>
              <div>
                <div class="font-medium text-gray-900 dark:text-gray-100">
                  {{ record.name }}
                  <a-tag v-if="record.isDefault" color="blue" class="ml-2">默认</a-tag>
                </div>
                <div class="text-xs text-gray-500">
                  {{ record.description }}
                </div>
              </div>
            </div>
          </template>

          <!-- 类型 -->
          <template v-else-if="column.key === 'type'">
            <a-tag :color="getTypeColor(record.type)">
              {{ getTypeLabel(record.type) }}
            </a-tag>
          </template>

          <!-- 状态 -->
          <template v-else-if="column.key === 'status'">
            <a-switch
              :checked="record.status === 'enabled'"
              @change="(checked: boolean) => handleStatusChange(record, checked)"
            >
              <template #checkedChildren>启用</template>
              <template #unCheckedChildren>禁用</template>
            </a-switch>
          </template>

          <!-- 使用次数 -->
          <template v-else-if="column.key === 'usage'">
            <div class="text-center">
              <div class="font-medium">{{ record.usageCount }}</div>
              <div class="text-xs text-gray-500">次</div>
            </div>
          </template>

          <!-- 操作 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">
                <EyeOutlined />
                预览
              </a-button>
              <a-button type="primary" size="small" @click="handleQuickCreate(record)">
                <ThunderboltOutlined />
                快速创建
              </a-button>
              <a-dropdown>
                <template #overlay>
                  <a-menu @click="({ key }: { key: string }) => handleMenuClick(key, record)">
                    <a-menu-item key="edit">
                      <EditOutlined />
                      编辑模板
                    </a-menu-item>
                    <a-menu-item key="copy">
                      <CopyOutlined />
                      复制模板
                    </a-menu-item>
                    <a-menu-item key="config">
                      <SettingOutlined />
                      详情配置
                    </a-menu-item>
                    <a-menu-item
                      key="setDefault"
                      v-if="!record.isDefault"
                    >
                      <StarOutlined />
                      设为默认
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="delete" danger>
                      <DeleteOutlined />
                      删除模板
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

    <!-- 新增/编辑模板弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑模板' : '新增模板'"
      width="800px"
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
        <a-form-item label="模板名称" name="name">
          <a-input v-model:value="formData.name" placeholder="请输入模板名称" />
        </a-form-item>

        <a-form-item label="模板描述" name="description">
          <a-textarea
            v-model:value="formData.description"
            :rows="3"
            placeholder="请输入模板描述"
          />
        </a-form-item>

        <a-form-item label="活动类型" name="type">
          <a-select v-model:value="formData.type" placeholder="请选择活动类型">
            <a-select-option value="competition">竞赛</a-select-option>
            <a-select-option value="evaluation">评审</a-select-option>
            <a-select-option value="exhibition">展览</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="主题色" name="color">
          <div class="flex items-center gap-3">
            <a-radio-group v-model:value="formData.color">
              <a-radio-button
                v-for="color in colorOptions"
                :key="color"
                :value="color"
              >
                <div
                  class="w-6 h-6 rounded"
                  :style="{ backgroundColor: color }"
                />
              </a-radio-button>
            </a-radio-group>
            <a-input
              v-model:value="formData.color"
              style="width: 120px"
              placeholder="#1890ff"
            />
          </div>
        </a-form-item>

        <a-form-item label="封面图片">
          <a-upload
            list-type="picture-card"
            :max-count="1"
            :before-upload="() => false"
          >
            <div>
              <PlusOutlined />
              <div class="mt-2">上传封面</div>
            </div>
          </a-upload>
          <div class="text-xs text-gray-500 mt-1">
            建议尺寸：1200x400，支持 JPG、PNG 格式
          </div>
        </a-form-item>

        <a-form-item label="设为默认">
          <a-switch v-model:checked="formData.isDefault" />
          <div class="text-xs text-gray-500 mt-1">
            默认模板会在创建活动时优先推荐
          </div>
        </a-form-item>

        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="formData.status">
            <a-radio value="enabled">启用</a-radio>
            <a-radio value="disabled">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 模板详情配置弹窗 -->
    <a-modal
      v-model:open="configModalVisible"
      title="模板详情配置"
      width="900px"
      @ok="handleSaveConfig"
      @cancel="configModalVisible = false"
    >
      <a-tabs v-model:activeKey="configTab">
        <!-- 基础信息 -->
        <a-tab-pane key="basic" tab="基础信息">
          <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="活动名称模板">
              <a-input
                v-model:value="configForm.nameTemplate"
                placeholder="例如：{年份}年度{类型}活动"
              />
              <div class="text-xs text-gray-500 mt-1">
                支持变量：{年份}、{月份}、{类型}、{序号}
              </div>
            </a-form-item>

            <a-form-item label="活动描述">
              <a-textarea
                v-model:value="configForm.description"
                :rows="4"
                placeholder="请输入活动描述模板"
              />
            </a-form-item>

            <a-form-item label="活动周期">
              <a-input-number
                v-model:value="configForm.duration"
                :min="1"
                addon-after="天"
              />
            </a-form-item>

            <a-form-item label="主办方">
              <a-input v-model:value="configForm.organizer" placeholder="请输入主办方" />
            </a-form-item>

            <a-form-item label="联系方式">
              <a-input v-model:value="configForm.contact" placeholder="请输入联系方式" />
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 报名设置 -->
        <a-tab-pane key="registration" tab="报名设置">
          <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="开放报名">
              <a-switch v-model:checked="configForm.enableRegistration" />
            </a-form-item>

            <a-form-item label="报名方式" v-if="configForm.enableRegistration">
              <a-radio-group v-model:value="configForm.registrationMethod">
                <a-space direction="vertical">
                  <a-radio value="individual">个人报名</a-radio>
                  <a-radio value="team">团队报名</a-radio>
                  <a-radio value="both">个人或团队</a-radio>
                </a-space>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="人数限制" v-if="configForm.enableRegistration">
              <a-input-number
                v-model:value="configForm.participantLimit"
                :min="0"
                placeholder="0表示不限制"
              />
            </a-form-item>

            <a-form-item label="需要审核" v-if="configForm.enableRegistration">
              <a-switch v-model:checked="configForm.requireAudit" />
            </a-form-item>

            <a-form-item label="报名表单字段" v-if="configForm.enableRegistration">
              <a-checkbox-group v-model:value="configForm.registrationFields">
                <a-space direction="vertical">
                  <a-checkbox value="name">姓名</a-checkbox>
                  <a-checkbox value="phone">手机号</a-checkbox>
                  <a-checkbox value="email">邮箱</a-checkbox>
                  <a-checkbox value="organization">所属机构</a-checkbox>
                  <a-checkbox value="idCard">身份证号</a-checkbox>
                  <a-checkbox value="work">作品上传</a-checkbox>
                </a-space>
              </a-checkbox-group>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 评审设置 -->
        <a-tab-pane key="review" tab="评审设置">
          <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="启用评审">
              <a-switch v-model:checked="configForm.enableReview" />
            </a-form-item>

            <a-form-item label="评审模式" v-if="configForm.enableReview">
              <a-select v-model:value="configForm.reviewMode" placeholder="选择评审模式">
                <a-select-option value="single">单轮评审</a-select-option>
                <a-select-option value="double">初复审（两轮）</a-select-option>
                <a-select-option value="triple">初复终审（三轮）</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="评审人数" v-if="configForm.enableReview">
              <a-input-number
                v-model:value="configForm.minReviewers"
                :min="1"
                placeholder="每个作品的最少评审人数"
              />
            </a-form-item>

            <a-form-item label="评分标准" v-if="configForm.enableReview">
              <a-select
                v-model:value="configForm.scoringCriteria"
                mode="multiple"
                placeholder="选择评分标准"
              >
                <a-select-option value="innovation">创新性</a-select-option>
                <a-select-option value="practicality">实用性</a-select-option>
                <a-select-option value="completeness">完整性</a-select-option>
                <a-select-option value="presentation">表现力</a-select-option>
                <a-select-option value="technical">技术水平</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 奖项设置 -->
        <a-tab-pane key="awards" tab="奖项设置">
          <div class="mb-4">
            <a-button type="dashed" block @click="handleAddAward">
              <PlusOutlined />
              添加奖项
            </a-button>
          </div>

          <a-list :data-source="configForm.awards" bordered>
            <template #renderItem="{ item, index }">
              <a-list-item>
                <template #actions>
                  <a-button type="link" size="small" @click="handleEditAward(item, index)">
                    编辑
                  </a-button>
                  <a-button
                    type="link"
                    size="small"
                    danger
                    @click="handleDeleteAward(index)"
                  >
                    删除
                  </a-button>
                </template>
                <a-list-item-meta>
                  <template #title>
                    {{ item.name }}
                    <a-tag color="orange" class="ml-2">{{ item.count }} 个名额</a-tag>
                  </template>
                  <template #description>
                    奖金: {{ item.prize || '无' }} | 证书: {{ item.certificate ? '有' : '无' }}
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-tab-pane>
      </a-tabs>
    </a-modal>

    <!-- 模板预览弹窗 -->
    <a-modal
      v-model:open="previewModalVisible"
      title="模板预览"
      width="800px"
      :footer="null"
    >
      <a-descriptions bordered :column="2">
        <a-descriptions-item label="模板名称" :span="2">
          {{ currentTemplate?.name }}
        </a-descriptions-item>
        <a-descriptions-item label="活动类型">
          <a-tag :color="getTypeColor(currentTemplate?.type)">
            {{ getTypeLabel(currentTemplate?.type) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="currentTemplate?.status === 'enabled' ? 'success' : 'default'">
            {{ currentTemplate?.status === 'enabled' ? '启用' : '禁用' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="使用次数" :span="2">
          {{ currentTemplate?.usageCount }} 次
        </a-descriptions-item>
        <a-descriptions-item label="模板描述" :span="2">
          {{ currentTemplate?.description }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" :span="2">
          {{ currentTemplate?.createdAt }}
        </a-descriptions-item>
      </a-descriptions>

      <a-divider>配置详情</a-divider>
      <div class="space-y-4">
        <div>
          <div class="font-medium mb-2">报名设置</div>
          <a-tag v-if="configForm.enableRegistration" color="green">开放报名</a-tag>
          <a-tag v-else color="default">不开放报名</a-tag>
          <span v-if="configForm.enableRegistration" class="ml-2 text-sm text-gray-600">
            限制人数: {{ configForm.participantLimit || '不限制' }}
          </span>
        </div>
        <div>
          <div class="font-medium mb-2">评审设置</div>
          <a-tag v-if="configForm.enableReview" color="blue">启用评审</a-tag>
          <a-tag v-else color="default">不启用评审</a-tag>
          <span v-if="configForm.enableReview" class="ml-2 text-sm text-gray-600">
            模式: {{ getReviewModeLabel(configForm.reviewMode) }}
          </span>
        </div>
      </div>
    </a-modal>

    <!-- 快速创建活动弹窗 -->
    <a-modal
      v-model:open="quickCreateModalVisible"
      title="快速创建活动"
      width="600px"
      @ok="handleConfirmCreate"
      @cancel="quickCreateModalVisible = false"
    >
      <a-alert
        message="基于模板创建"
        :description="`您将基于「${currentTemplate?.name}」模板创建新活动，模板的配置将自动应用到新活动中。`"
        type="info"
        show-icon
        class="mb-4"
      />

      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item label="活动名称" required>
          <a-input v-model:value="quickCreateForm.name" placeholder="请输入活动名称" />
        </a-form-item>

        <a-form-item label="活动时间" required>
          <a-range-picker
            v-model:value="quickCreateForm.dateRange"
            show-time
            class="w-full"
          />
        </a-form-item>

        <a-form-item label="应用配置">
          <a-checkbox-group v-model:value="quickCreateForm.applyConfigs">
            <a-space direction="vertical">
              <a-checkbox value="basic">基础信息</a-checkbox>
              <a-checkbox value="registration">报名设置</a-checkbox>
              <a-checkbox value="review">评审设置</a-checkbox>
              <a-checkbox value="awards">奖项设置</a-checkbox>
            </a-space>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
  CopyOutlined,
  ThunderboltOutlined,
  MoreOutlined,
  DownOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  StarOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()

// 视图模式
const viewMode = ref<'card' | 'list'>('card')

// 搜索筛选
const searchKeyword = ref('')
const typeFilter = ref<string | undefined>(undefined)
const statusFilter = ref<string | undefined>(undefined)
const loading = ref(false)

// 表格数据
const dataSource = ref([
  {
    id: '1',
    name: '创新创业大赛标准模板',
    description: '适用于各类创新创业竞赛，包含完整的报名、评审流程',
    type: 'competition',
    color: '#1890ff',
    cover: '',
    status: 'enabled',
    isDefault: true,
    usageCount: 28,
    createdAt: '2025-01-01 10:00:00',
  },
  {
    id: '2',
    name: '学术论文评审模板',
    description: '专业的学术论文评审流程，支持多轮评审和专家打分',
    type: 'evaluation',
    color: '#52c41a',
    cover: '',
    status: 'enabled',
    isDefault: false,
    usageCount: 15,
    createdAt: '2025-01-05 14:30:00',
  },
  {
    id: '3',
    name: '作品展览活动模板',
    description: '适用于各类作品展示、成果展览活动',
    type: 'exhibition',
    color: '#faad14',
    cover: '',
    status: 'enabled',
    isDefault: false,
    usageCount: 12,
    createdAt: '2025-01-10 09:15:00',
  },
  {
    id: '4',
    name: '技能竞赛模板',
    description: '职业技能竞赛活动模板',
    type: 'competition',
    color: '#722ed1',
    cover: '',
    status: 'disabled',
    isDefault: false,
    usageCount: 0,
    createdAt: '2025-01-15 16:00:00',
  },
])

// 表格列
const columns = [
  { title: '模板信息', key: 'name', width: 350 },
  { title: '类型', key: 'type', width: 120, align: 'center' as const },
  { title: '使用次数', key: 'usage', width: 100, align: 'center' as const },
  { title: '状态', key: 'status', width: 120, align: 'center' as const },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
  { title: '操作', key: 'action', width: 280, fixed: 'right' as const },
]

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 4,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

// 新增/编辑弹窗
const modalVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const formData = reactive({
  id: '',
  name: '',
  description: '',
  type: 'competition',
  color: '#1890ff',
  cover: '',
  isDefault: false,
  status: 'enabled',
})

const formRules = {
  name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入模板描述', trigger: 'blur' }],
  type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
}

const colorOptions = [
  '#1890ff',
  '#52c41a',
  '#faad14',
  '#f5222d',
  '#722ed1',
  '#13c2c2',
  '#eb2f96',
  '#fa8c16',
]

// 配置弹窗
const configModalVisible = ref(false)
const configTab = ref('basic')
const configForm = reactive({
  nameTemplate: '{年份}年度{类型}活动',
  description: '',
  duration: 30,
  organizer: '',
  contact: '',
  enableRegistration: true,
  registrationMethod: 'individual',
  participantLimit: 0,
  requireAudit: false,
  registrationFields: ['name', 'phone', 'email'],
  enableReview: true,
  reviewMode: 'double',
  minReviewers: 3,
  scoringCriteria: ['innovation', 'practicality'],
  awards: [
    { name: '一等奖', count: 1, prize: '5000元', certificate: true },
    { name: '二等奖', count: 2, prize: '3000元', certificate: true },
    { name: '三等奖', count: 3, prize: '1000元', certificate: true },
  ] as Array<{ name: string; count: number; prize: string; certificate: boolean }>,
})

// 预览弹窗
const previewModalVisible = ref(false)
const currentTemplate = ref<typeof dataSource.value[0] | null>(null)

// 快速创建弹窗
const quickCreateModalVisible = ref(false)
const quickCreateForm = reactive({
  name: '',
  dateRange: undefined as [string, string] | undefined,
  applyConfigs: ['basic', 'registration', 'review', 'awards'],
})

// 辅助函数
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

const getReviewModeLabel = (mode?: string) => {
  const labels = {
    single: '单轮评审',
    double: '初复审',
    triple: '初复终审',
  }
  return labels[mode as keyof typeof labels] || mode
}

// 事件处理
const handleSearch = () => {
  pagination.current = 1
  message.info('搜索功能待实现')
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
    description: '',
    type: 'competition',
    color: '#1890ff',
    cover: '',
    isDefault: false,
    status: 'enabled',
  })
  modalVisible.value = true
}

const handleEdit = (record: typeof dataSource.value[0]) => {
  isEdit.value = true
  if (record) {
    Object.assign(formData, { ...record })
  }
  modalVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()

    if (isEdit.value) {
      const index = dataSource.value.findIndex((item) => item.id === formData.id)
      if (index > -1 && dataSource.value[index]) {
        Object.assign(dataSource.value[index], formData)
      }
      message.success('编辑成功')
    } else {
      const newTemplate = {
        ...formData,
        id: String(Date.now()),
        usageCount: 0,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }
      dataSource.value.push(newTemplate)
      pagination.total++
      message.success('新增成功')
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
  currentTemplate.value = record
  previewModalVisible.value = true
}

const handleQuickCreate = (record: typeof dataSource.value[0]) => {
  currentTemplate.value = record
  quickCreateForm.name = `基于${record.name}的新活动`
  quickCreateForm.applyConfigs = ['basic', 'registration', 'review', 'awards']
  quickCreateModalVisible.value = true
}

const handleConfirmCreate = () => {
  if (!quickCreateForm.name) {
    message.error('请输入活动名称')
    return
  }
  if (!quickCreateForm.dateRange) {
    message.error('请选择活动时间')
    return
  }

  message.success('活动创建成功')
  quickCreateModalVisible.value = false

  // 跳转到活动编辑页面
  setTimeout(() => {
    router.push('/admin/activity/list')
  }, 500)
}

const handleMenuClick = (key: string, record: typeof dataSource.value[0]) => {
  currentTemplate.value = record

  switch (key) {
    case 'edit':
      handleEdit(record)
      break
    case 'copy':
      handleCopy(record)
      break
    case 'config':
      handleConfig(record)
      break
    case 'setDefault':
      handleSetDefault(record)
      break
    case 'delete':
      handleDelete(record)
      break
  }
}

const handleCopy = (record: typeof dataSource.value[0]) => {
  const newTemplate = {
    ...record,
    id: String(Date.now()),
    name: `${record.name}（副本）`,
    isDefault: false,
    usageCount: 0,
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
  }
  dataSource.value.unshift(newTemplate)
  pagination.total++
  message.success('复制成功')
}

const handleConfig = (record: typeof dataSource.value[0]) => {
  currentTemplate.value = record
  configTab.value = 'basic'
  configModalVisible.value = true
}

const handleSaveConfig = () => {
  message.success('配置保存成功')
  configModalVisible.value = false
}

const handleSetDefault = (record: typeof dataSource.value[0]) => {
  dataSource.value.forEach((item) => {
    item.isDefault = item.id === record.id
  })
  message.success('已设为默认模板')
}

const handleDelete = (record: typeof dataSource.value[0]) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除模板「${record.name}」吗？此操作不可恢复！`,
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

const handleStatusChange = (record: typeof dataSource.value[0], checked: boolean) => {
  record.status = checked ? 'enabled' : 'disabled'
  message.success(`已${checked ? '启用' : '禁用'}`)
}

const handleAddAward = () => {
  configForm.awards.push({
    name: '新奖项',
    count: 1,
    prize: '',
    certificate: false,
  })
}

const handleEditAward = (item: typeof configForm.awards[0], index: number) => {
  message.info(`编辑奖项: ${item.name}, index: ${index}`)
}

const handleDeleteAward = (index: number) => {
  configForm.awards.splice(index, 1)
  message.success('删除成功')
}
</script>

<style scoped>
.activity-template-page {
  padding: 0;
}

.template-card :deep(.ant-card-actions) {
  background: transparent;
}

.template-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
