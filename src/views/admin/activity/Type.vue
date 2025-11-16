<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="activity-type-page">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">活动类型管理</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        配置活动类型，管理不同类型活动的属性和权限
      </p>
    </div>

    <!-- 工具栏 -->
    <a-card :bordered="false" class="mb-4">
      <div class="flex justify-between items-center">
        <a-space>
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="搜索类型名称或编码"
            style="width: 250px"
            @search="handleSearch"
          />
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
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          新增类型
        </a-button>
      </div>
    </a-card>

    <!-- 类型列表 -->
    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- 类型信息 -->
          <template v-if="column.key === 'name'">
            <div class="flex items-center">
              <a-avatar
                v-if="record.icon"
                :style="{ backgroundColor: record.color }"
                class="mr-3"
              >
                <template #icon>
                  <component :is="getIcon(record.icon)" />
                </template>
              </a-avatar>
              <div>
                <div class="font-medium text-gray-900 dark:text-gray-100">
                  {{ record.name }}
                </div>
                <div class="text-xs text-gray-500">
                  编码: {{ record.code }}
                </div>
              </div>
            </div>
          </template>

          <!-- 状态 -->
          <template v-else-if="column.key === 'status'">
            <a-switch
              :checked="record.status === 'enabled'"
              @change="(checked) => handleStatusChange(record, checked)"
            >
              <template #checkedChildren>启用</template>
              <template #unCheckedChildren>禁用</template>
            </a-switch>
          </template>

          <!-- 使用统计 -->
          <template v-else-if="column.key === 'usage'">
            <div class="text-center">
              <div class="font-medium text-lg">{{ record.activityCount }}</div>
              <div class="text-xs text-gray-500">个活动</div>
            </div>
          </template>

          <!-- 排序 -->
          <template v-else-if="column.key === 'sort'">
            <div class="flex items-center gap-2">
              <span>{{ record.sort }}</span>
              <a-space direction="vertical" :size="0">
                <a-button
                  type="text"
                  size="small"
                  @click="handleMoveUp(record)"
                  :disabled="record.sort === 1"
                >
                  <UpOutlined class="text-xs" />
                </a-button>
                <a-button
                  type="text"
                  size="small"
                  @click="handleMoveDown(record)"
                  :disabled="record.sort === dataSource.length"
                >
                  <DownOutlined class="text-xs" />
                </a-button>
              </a-space>
            </div>
          </template>

          <!-- 操作 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleConfig(record)">
                <SettingOutlined />
                配置
              </a-button>
              <a-button type="link" size="small" @click="handlePermission(record)">
                <SafetyOutlined />
                权限
              </a-button>
              <a-button type="link" size="small" @click="handleEdit(record)">
                <EditOutlined />
                编辑
              </a-button>
              <a-popconfirm
                title="确定要删除此类型吗？"
                :ok-text="record.activityCount > 0 ? '强制删除' : '确定'"
                cancel-text="取消"
                @confirm="handleDelete(record)"
              >
                <template v-if="record.activityCount > 0" #description>
                  <div class="text-orange-600">
                    该类型下有 {{ record.activityCount }} 个活动，删除后这些活动将变为"未分类"状态。
                  </div>
                </template>
                <a-button type="link" size="small" danger>
                  <DeleteOutlined />
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑类型' : '新增类型'"
      width="600px"
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
        <a-form-item label="类型名称" name="name">
          <a-input v-model:value="formData.name" placeholder="请输入类型名称" />
        </a-form-item>

        <a-form-item label="类型编码" name="code">
          <a-input
            v-model:value="formData.code"
            placeholder="请输入类型编码（唯一标识）"
            :disabled="isEdit"
          />
          <div class="text-xs text-gray-500 mt-1">
            编码创建后不可修改，建议使用英文小写+下划线
          </div>
        </a-form-item>

        <a-form-item label="类型描述" name="description">
          <a-textarea
            v-model:value="formData.description"
            :rows="3"
            placeholder="请输入类型描述"
          />
        </a-form-item>

        <a-form-item label="图标" name="icon">
          <a-select
            v-model:value="formData.icon"
            placeholder="请选择图标"
            show-search
          >
            <a-select-option
              v-for="icon in iconOptions"
              :key="icon.value"
              :value="icon.value"
            >
              <component :is="getIcon(icon.value)" class="mr-2" />
              {{ icon.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="颜色" name="color">
          <div class="flex items-center gap-3">
            <a-radio-group v-model:value="formData.color">
              <a-radio-button
                v-for="color in colorOptions"
                :key="color.value"
                :value="color.value"
              >
                <div
                  class="w-6 h-6 rounded"
                  :style="{ backgroundColor: color.value }"
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

        <a-form-item label="排序" name="sort">
          <a-input-number
            v-model:value="formData.sort"
            :min="1"
            placeholder="数字越小越靠前"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="formData.status">
            <a-radio value="enabled">启用</a-radio>
            <a-radio value="disabled">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 类型配置弹窗 -->
    <a-modal
      v-model:open="configModalVisible"
      title="类型配置"
      width="700px"
      @ok="handleSaveConfig"
      @cancel="configModalVisible = false"
    >
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-divider orientation="left">基础配置</a-divider>

        <a-form-item label="允许报名">
          <a-switch v-model:checked="configForm.allowRegistration" />
          <div class="text-xs text-gray-500 mt-1">
            关闭后此类型活动不能开放报名
          </div>
        </a-form-item>

        <a-form-item label="需要审核">
          <a-switch v-model:checked="configForm.requireAudit" />
          <div class="text-xs text-gray-500 mt-1">
            开启后报名需要人工审核
          </div>
        </a-form-item>

        <a-form-item label="允许团队">
          <a-switch v-model:checked="configForm.allowTeam" />
          <div class="text-xs text-gray-500 mt-1">
            允许以团队形式报名
          </div>
        </a-form-item>

        <a-form-item label="需要作品">
          <a-switch v-model:checked="configForm.requireWork" />
          <div class="text-xs text-gray-500 mt-1">
            报名时需要上传作品
          </div>
        </a-form-item>

        <a-divider orientation="left">评审配置</a-divider>

        <a-form-item label="启用评审">
          <a-switch v-model:checked="configForm.enableReview" />
          <div class="text-xs text-gray-500 mt-1">
            此类型活动是否需要评审环节
          </div>
        </a-form-item>

        <a-form-item label="默认评审模式" v-if="configForm.enableReview">
          <a-select v-model:value="configForm.reviewMode" placeholder="选择评审模式">
            <a-select-option value="single">单轮评审</a-select-option>
            <a-select-option value="double">初复审</a-select-option>
            <a-select-option value="triple">初复终审</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="最少评审人数" v-if="configForm.enableReview">
          <a-input-number v-model:value="configForm.minReviewers" :min="1" />
        </a-form-item>

        <a-divider orientation="left">其他配置</a-divider>

        <a-form-item label="默认时长">
          <a-input-number
            v-model:value="configForm.defaultDuration"
            :min="1"
            addon-after="天"
          />
          <div class="text-xs text-gray-500 mt-1">
            创建此类型活动时的默认活动周期
          </div>
        </a-form-item>

        <a-form-item label="模板字段">
          <a-select
            v-model:value="configForm.templateFields"
            mode="multiple"
            placeholder="选择此类型活动的必填字段"
          >
            <a-select-option value="description">活动描述</a-select-option>
            <a-select-option value="banner">活动横幅</a-select-option>
            <a-select-option value="organizer">主办方</a-select-option>
            <a-select-option value="location">活动地点</a-select-option>
            <a-select-option value="contact">联系方式</a-select-option>
            <a-select-option value="rules">活动规则</a-select-option>
            <a-select-option value="awards">奖项设置</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 权限设置弹窗 -->
    <a-modal
      v-model:open="permissionModalVisible"
      title="权限设置"
      width="600px"
      @ok="handleSavePermission"
      @cancel="permissionModalVisible = false"
    >
      <a-alert
        message="权限说明"
        description="设置哪些角色可以创建此类型的活动。未勾选的角色将无法创建该类型活动。"
        type="info"
        show-icon
        class="mb-4"
      />

      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="创建权限">
          <a-checkbox-group v-model:value="permissionForm.createRoles">
            <a-space direction="vertical">
              <a-checkbox value="admin">系统管理员</a-checkbox>
              <a-checkbox value="organizer">活动组织者</a-checkbox>
              <a-checkbox value="teacher">教师</a-checkbox>
              <a-checkbox value="manager">部门管理员</a-checkbox>
            </a-space>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item label="管理权限">
          <a-checkbox-group v-model:value="permissionForm.manageRoles">
            <a-space direction="vertical">
              <a-checkbox value="admin">系统管理员</a-checkbox>
              <a-checkbox value="organizer">活动组织者</a-checkbox>
              <a-checkbox value="teacher">教师</a-checkbox>
              <a-checkbox value="manager">部门管理员</a-checkbox>
            </a-space>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item label="评审权限">
          <a-checkbox-group v-model:value="permissionForm.reviewRoles">
            <a-space direction="vertical">
              <a-checkbox value="admin">系统管理员</a-checkbox>
              <a-checkbox value="expert">评审专家</a-checkbox>
              <a-checkbox value="teacher">教师</a-checkbox>
              <a-checkbox value="organizer">活动组织者</a-checkbox>
            </a-space>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item label="可见范围">
          <a-radio-group v-model:value="permissionForm.visibility">
            <a-space direction="vertical">
              <a-radio value="public">公开（所有人可见）</a-radio>
              <a-radio value="login">登录后可见</a-radio>
              <a-radio value="role">指定角色可见</a-radio>
            </a-space>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          v-if="permissionForm.visibility === 'role'"
          label="可见角色"
        >
          <a-checkbox-group v-model:value="permissionForm.visibleRoles">
            <a-space direction="vertical">
              <a-checkbox value="admin">系统管理员</a-checkbox>
              <a-checkbox value="teacher">教师</a-checkbox>
              <a-checkbox value="student">学生</a-checkbox>
              <a-checkbox value="organizer">活动组织者</a-checkbox>
            </a-space>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
  SettingOutlined,
  SafetyOutlined,
  TrophyOutlined,
  FileTextOutlined,
  PictureOutlined,
  TeamOutlined,
  CalendarOutlined,
  ExperimentOutlined,
} from '@ant-design/icons-vue'

// 图标映射
const iconMap = {
  trophy: TrophyOutlined,
  'file-text': FileTextOutlined,
  picture: PictureOutlined,
  team: TeamOutlined,
  calendar: CalendarOutlined,
  experiment: ExperimentOutlined,
}

const getIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || FileTextOutlined
}

// 搜索筛选
const searchKeyword = ref('')
const statusFilter = ref<string | undefined>(undefined)
const loading = ref(false)

// 表格数据
const dataSource = ref([
  {
    id: '1',
    name: '创新竞赛',
    code: 'innovation_competition',
    description: '面向创新创业项目的竞赛活动',
    icon: 'trophy',
    color: '#1890ff',
    sort: 1,
    status: 'enabled',
    activityCount: 15,
    createdAt: '2025-01-01 10:00:00',
  },
  {
    id: '2',
    name: '作品评审',
    code: 'work_review',
    description: '各类作品的评审活动',
    icon: 'file-text',
    color: '#52c41a',
    sort: 2,
    status: 'enabled',
    activityCount: 8,
    createdAt: '2025-01-05 14:30:00',
  },
  {
    id: '3',
    name: '成果展示',
    code: 'achievement_exhibition',
    description: '优秀成果的展示活动',
    icon: 'picture',
    color: '#faad14',
    sort: 3,
    status: 'enabled',
    activityCount: 12,
    createdAt: '2025-01-10 09:15:00',
  },
  {
    id: '4',
    name: '团队协作',
    code: 'team_collaboration',
    description: '团队协作类活动',
    icon: 'team',
    color: '#722ed1',
    sort: 4,
    status: 'disabled',
    activityCount: 0,
    createdAt: '2025-01-15 16:00:00',
  },
])

// 表格列
const columns = [
  { title: '类型信息', key: 'name', width: 280 },
  { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: '使用统计', key: 'usage', width: 100, align: 'center' as const },
  { title: '排序', key: 'sort', width: 100, align: 'center' as const },
  { title: '状态', key: 'status', width: 100, align: 'center' as const },
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
  code: '',
  description: '',
  icon: 'file-text',
  color: '#1890ff',
  sort: 1,
  status: 'enabled',
})

const formRules = {
  name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
  code: [
    { required: true, message: '请输入类型编码', trigger: 'blur' },
    { pattern: /^[a-z_]+$/, message: '编码只能包含小写字母和下划线', trigger: 'blur' },
  ],
}

// 图标选项
const iconOptions = [
  { label: '奖杯', value: 'trophy' },
  { label: '文档', value: 'file-text' },
  { label: '图片', value: 'picture' },
  { label: '团队', value: 'team' },
  { label: '日历', value: 'calendar' },
  { label: '实验', value: 'experiment' },
]

// 颜色选项
const colorOptions = [
  { value: '#1890ff' },
  { value: '#52c41a' },
  { value: '#faad14' },
  { value: '#f5222d' },
  { value: '#722ed1' },
  { value: '#13c2c2' },
  { value: '#eb2f96' },
  { value: '#fa8c16' },
]

// 类型配置弹窗
const configModalVisible = ref(false)
const configForm = reactive({
  allowRegistration: true,
  requireAudit: false,
  allowTeam: true,
  requireWork: true,
  enableReview: true,
  reviewMode: 'double',
  minReviewers: 3,
  defaultDuration: 30,
  templateFields: ['description', 'organizer'],
})

// 权限设置弹窗
const permissionModalVisible = ref(false)
const permissionForm = reactive({
  createRoles: ['admin', 'organizer'],
  manageRoles: ['admin', 'organizer'],
  reviewRoles: ['admin', 'expert'],
  visibility: 'public',
  visibleRoles: [] as string[],
})

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
    code: '',
    description: '',
    icon: 'file-text',
    color: '#1890ff',
    sort: dataSource.value.length + 1,
    status: 'enabled',
  })
  modalVisible.value = true
}

const handleEdit = (record: typeof dataSource.value[0]) => {
  isEdit.value = true
  Object.assign(formData, { ...record })
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
      const newType = {
        ...formData,
        id: String(Date.now()),
        activityCount: 0,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }
      dataSource.value.push(newType)
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

const handleDelete = (record: typeof dataSource.value[0]) => {
  const index = dataSource.value.findIndex((item) => item.id === record.id)
  if (index > -1) {
    dataSource.value.splice(index, 1)
    pagination.total--
    message.success('删除成功')
  }
}

const handleStatusChange = (record: typeof dataSource.value[0], checked: boolean) => {
  record.status = checked ? 'enabled' : 'disabled'
  message.success(`已${checked ? '启用' : '禁用'}`)
}

const handleMoveUp = (record: typeof dataSource.value[0]) => {
  const index = dataSource.value.findIndex((item) => item.id === record.id)
  if (index > 0) {
    const temp = dataSource.value[index].sort
    dataSource.value[index].sort = dataSource.value[index - 1].sort
    dataSource.value[index - 1].sort = temp
    dataSource.value.sort((a, b) => a.sort - b.sort)
    message.success('上移成功')
  }
}

const handleMoveDown = (record: typeof dataSource.value[0]) => {
  const index = dataSource.value.findIndex((item) => item.id === record.id)
  if (index < dataSource.value.length - 1) {
    const temp = dataSource.value[index].sort
    dataSource.value[index].sort = dataSource.value[index + 1].sort
    dataSource.value[index + 1].sort = temp
    dataSource.value.sort((a, b) => a.sort - b.sort)
    message.success('下移成功')
  }
}

const handleConfig = (record: typeof dataSource.value[0]) => {
  message.info(`配置类型: ${record.name}`)
  configModalVisible.value = true
}

const handleSaveConfig = () => {
  message.success('配置保存成功')
  configModalVisible.value = false
}

const handlePermission = (record: typeof dataSource.value[0]) => {
  message.info(`设置权限: ${record.name}`)
  permissionModalVisible.value = true
}

const handleSavePermission = () => {
  message.success('权限设置保存成功')
  permissionModalVisible.value = false
}
</script>

<style scoped>
.activity-type-page {
  padding: 0;
}
</style>
