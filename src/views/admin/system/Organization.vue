<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="organization-page">
    <!-- 搜索表单 -->
    <a-card class="mb-6 rounded-lg shadow" :bordered="false">
      <a-form layout="inline" :model="queryParams" @submit.prevent="handleSearch">
        <a-form-item label="关键词">
          <a-input
            v-model:value="queryParams.keyword"
            placeholder="搜索组织名称或编码"
            allow-clear
            style="width: 220px"
            @pressEnter="handleSearch"
          />
        </a-form-item>

        <a-form-item label="组织类型">
          <DictSelect
            v-model="queryParams.type"
            dict-code="org_type"
            placeholder="请选择类型"
            style="width: 140px"
          />
        </a-form-item>

        <a-form-item label="状态">
          <a-select
            v-model:value="queryParams.status"
            placeholder="请选择状态"
            allow-clear
            style="width: 120px"
          >
            <a-select-option value="enabled">启用</a-select-option>
            <a-select-option value="disabled">禁用</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="loading">
              <template #icon>
                <SearchOutlined />
              </template>
              查询
            </a-button>
            <a-button @click="handleReset">
              <template #icon>
                <ReloadOutlined />
              </template>
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 组织列表 -->
    <a-card class="rounded-lg shadow" :bordered="false">
      <template #title>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold text-gray-900 dark:text-white">组织列表</span>
          <a-button type="primary" @click="handleAdd">
            <template #icon>
              <PlusOutlined />
            </template>
            新增组织
          </a-button>
        </div>
      </template>

      <a-table
        :columns="columns"
        :data-source="organizationList"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 1400 }"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <!-- 组织信息 -->
          <template v-if="column.key === 'organization'">
            <div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ record.name }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                编码：{{ record.code }}
              </div>
            </div>
          </template>

          <!-- 组织类型 -->
          <template v-else-if="column.key === 'type'">
            <a-tag :color="getOrgTypeColor(record.type)">
              {{ getOrgTypeText(record.type) }}
            </a-tag>
          </template>

          <!-- 联系方式 -->
          <template v-else-if="column.key === 'contact'">
            <div>
              <div v-if="record.leader" class="text-sm">
                <UserOutlined class="mr-1" />
                {{ record.leader }}
              </div>
              <div v-if="record.phone" class="text-sm text-gray-500 dark:text-gray-400">
                <PhoneOutlined class="mr-1" />
                {{ record.phone }}
              </div>
            </div>
          </template>

          <!-- 地区 -->
          <template v-else-if="column.key === 'location'">
            <div class="text-sm">
              <template v-if="record.province || record.city">
                {{ record.province }}{{ record.city }}
              </template>
              <template v-else>-</template>
            </div>
          </template>

          <!-- 统计信息 -->
          <template v-else-if="column.key === 'stats'">
            <div class="text-sm">
              <div>
                <TeamOutlined class="mr-1 text-blue-500" />
                用户: {{ record.userCount || 0 }}
              </div>
              <div class="text-gray-500">
                <ClusterOutlined class="mr-1" />
                部门: {{ record.deptCount || 0 }}
              </div>
            </div>
          </template>

          <!-- 状态 -->
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === 'enabled' ? 'green' : 'red'">
              {{ record.status === 'enabled' ? '启用' : '禁用' }}
            </a-tag>
          </template>

          <!-- 创建时间 -->
          <template v-else-if="column.key === 'createdAt'">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(record.createdAt) }}
            </span>
          </template>

          <!-- 操作 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">
                查看
              </a-button>
              <a-button type="link" size="small" @click="handleEdit(record)">
                编辑
              </a-button>
              <a-dropdown>
                <a-button type="link" size="small">
                  更多
                  <DownOutlined />
                </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="handleToggleStatus(record)">
                      <template v-if="record.status === 'enabled'">
                        <StopOutlined />
                        禁用
                      </template>
                      <template v-else>
                        <CheckCircleOutlined />
                        启用
                      </template>
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item danger @click="handleDelete(record)">
                      <DeleteOutlined />
                      删除
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>

      <!-- 分页 -->
      <div class="mt-6 flex justify-end">
        <a-pagination
          v-model:current="pagination.current"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :show-total="(total: number) => `共 ${total} 个组织`"
          :page-size-options="['10', '20', '50', '100']"
          show-size-changer
          show-quick-jumper
          @change="handlePageChange"
        />
      </div>
    </a-card>

    <!-- 查看组织详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="组织详情"
      :width="900"
      :footer="null"
    >
      <div v-if="currentOrg">
        <!-- 基础信息 -->
        <a-descriptions title="基本信息" bordered :column="2" class="mb-6">
          <a-descriptions-item label="组织名称" :span="2">
            {{ currentOrg.name }}
          </a-descriptions-item>
          <a-descriptions-item label="组织编码/信用代码" :span="2">
            {{ currentOrg.code }}
          </a-descriptions-item>
          <a-descriptions-item label="组织类型">
            <a-tag :color="getOrgTypeColor(currentOrg.type)">
              {{ getOrgTypeText(currentOrg.type) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="组织规模">
            {{ getOrgScaleText(currentOrg.scale) }}
          </a-descriptions-item>
          <a-descriptions-item label="所属行业" :span="2">
            {{ currentOrg.industry || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="状态">
            <a-tag :color="currentOrg.status === 'enabled' ? 'green' : 'red'">
              {{ currentOrg.status === 'enabled' ? '启用' : '禁用' }}
            </a-tag>
          </a-descriptions-item>
        </a-descriptions>

        <!-- 联系信息 -->
        <a-descriptions title="联系信息" bordered :column="2" class="mb-6">
          <a-descriptions-item label="负责人">
            {{ currentOrg.leader || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="负责人电话">
            {{ currentOrg.leaderPhone || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="联系邮箱" :span="2">
            {{ currentOrg.email || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="联系电话" :span="2">
            {{ currentOrg.phone || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="所在地区" :span="2">
            {{ [currentOrg.province, currentOrg.city, currentOrg.district].filter(Boolean).join(' ') || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="详细地址" :span="2">
            {{ currentOrg.address || '-' }}
          </a-descriptions-item>
        </a-descriptions>

        <!-- 统计信息 -->
        <div class="mb-6">
          <h3 class="text-base font-semibold mb-4">数据统计</h3>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-card>
                <a-statistic
                  title="用户数量"
                  :value="currentOrg.userCount || 0"
                  :value-style="{ color: '#3f8600' }"
                >
                  <template #prefix>
                    <TeamOutlined />
                  </template>
                </a-statistic>
              </a-card>
            </a-col>
            <a-col :span="8">
              <a-card>
                <a-statistic
                  title="部门数量"
                  :value="currentOrg.deptCount || 0"
                  :value-style="{ color: '#1890ff' }"
                >
                  <template #prefix>
                    <ClusterOutlined />
                  </template>
                </a-statistic>
              </a-card>
            </a-col>
            <a-col :span="8">
              <a-card>
                <a-statistic
                  title="活动数量"
                  :value="currentOrg.activityCount || 0"
                  :value-style="{ color: '#cf1322' }"
                >
                  <template #prefix>
                    <FileTextOutlined />
                  </template>
                </a-statistic>
              </a-card>
            </a-col>
          </a-row>
        </div>

        <!-- 其他信息 -->
        <a-descriptions title="其他信息" bordered :column="2">
          <a-descriptions-item label="描述" :span="2">
            {{ currentOrg.description || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="创建时间" :span="2">
            {{ formatDate(currentOrg.createdAt) }}
          </a-descriptions-item>
          <a-descriptions-item label="更新时间" :span="2">
            {{ formatDate(currentOrg.updatedAt) }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>

    <!-- 新增/编辑组织弹窗 -->
    <a-modal
      v-model:open="formModalVisible"
      :title="formData.id ? '编辑组织' : '新增组织'"
      :width="800"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-divider orientation="left">基本信息</a-divider>
        <a-form-item label="组织名称" name="name">
          <a-input v-model:value="formData.name" placeholder="请输入组织名称" />
        </a-form-item>
        <a-form-item label="组织编码" name="code">
          <a-input v-model:value="formData.code" placeholder="统一社会信用代码或组织编码" />
        </a-form-item>
        <a-form-item label="组织类型" name="type">
          <DictSelect
            v-model="formData.type"
            dict-code="org_type"
            placeholder="请选择组织类型"
          />
        </a-form-item>
        <a-form-item label="组织规模" name="scale">
          <DictSelect
            v-model="formData.scale"
            dict-code="org_scale"
            placeholder="请选择组织规模"
          />
        </a-form-item>
        <a-form-item label="所属行业" name="industry">
          <DictSelect
            v-model="formData.industry"
            dict-code="org_industry"
            placeholder="请选择所属行业"
          />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="formData.status">
            <a-radio value="enabled">启用</a-radio>
            <a-radio value="disabled">禁用</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-divider orientation="left">联系信息</a-divider>
        <a-form-item label="负责人" name="leader">
          <a-input v-model:value="formData.leader" placeholder="请输入负责人姓名" />
        </a-form-item>
        <a-form-item label="负责人电话" name="leaderPhone">
          <a-input v-model:value="formData.leaderPhone" placeholder="请输入负责人电话" />
        </a-form-item>
        <a-form-item label="联系邮箱" name="email">
          <a-input v-model:value="formData.email" placeholder="请输入联系邮箱" />
        </a-form-item>
        <a-form-item label="联系电话" name="phone">
          <a-input v-model:value="formData.phone" placeholder="请输入联系电话" />
        </a-form-item>
        <a-form-item label="地区" name="region">
          <RegionCascaderForm
            v-model:province="formData.province"
            v-model:city="formData.city"
            v-model:district="formData.district"
            placeholder="请选择省/市/区"
          />
        </a-form-item>
        <a-form-item label="详细地址" name="address">
          <a-textarea v-model:value="formData.address" placeholder="请输入详细地址" :rows="2" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea
            v-model:value="formData.description"
            placeholder="请输入组织描述"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  DownOutlined,
  StopOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  BankOutlined,
  UserOutlined,
  PhoneOutlined,
  TeamOutlined,
  ClusterOutlined,
  FileTextOutlined,
} from '@ant-design/icons-vue'
import {
  organizationApi,
  type Organization,
  type OrganizationFormDTO,
} from '@/api/organization'
import RegionCascaderForm from '@/components/common/RegionCascaderForm.vue'
import DictSelect from '@/components/common/DictSelect.vue'
import { getDictItemByCategoryCode, type DictItem } from '@/api/dict'
import dayjs from 'dayjs'

// 查询参数
const queryParams = reactive({
  keyword: '',
  type: undefined as string | undefined,
  status: undefined as string | undefined,
})

// 分页信息
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
})

// 组织列表
const organizationList = ref<Organization[]>([])
const loading = ref(false)

// 详情弹窗
const detailModalVisible = ref(false)
const currentOrg = ref<Organization | null>(null)

// 表单弹窗
const formModalVisible = ref(false)
const formRef = ref<FormInstance>()
const formData = reactive<OrganizationFormDTO>({
  name: '',
  code: '',
  type: undefined,
  leader: '',
  leaderPhone: '',
  email: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  address: '',
  scale: undefined,
  industry: undefined,
  description: '',
  status: 'enabled',
})

const formRules = {
  name: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入组织编码', trigger: 'blur' }],
  type: [{ required: true, message: '请选择组织类型', trigger: 'change' }],
}

// 表格列定义
const columns = [
  {
    title: '组织信息',
    key: 'organization',
    width: 260,
    fixed: 'left',
  },
  {
    title: '类型',
    key: 'type',
    width: 120,
  },
  {
    title: '负责人',
    key: 'contact',
    width: 150,
  },
  {
    title: '地区',
    key: 'location',
    width: 150,
  },
  {
    title: '统计',
    key: 'stats',
    width: 120,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '创建时间',
    key: 'createdAt',
    width: 160,
  },
  {
    title: '操作',
    key: 'action',
    width: 180,
    fixed: 'right',
  },
]

// 获取组织列表
const fetchOrganizationList = async () => {
  loading.value = true
  try {
    const response = await organizationApi.getOrganizationList({
      keyword: queryParams.keyword,
      type: queryParams.type as any,
      status: queryParams.status as any,
      current: pagination.current,
      size: pagination.size,
    })

    if (response.code === 200) {
      organizationList.value = response.data.records
      pagination.total = response.data.total
    } else {
      message.error(response.message || '获取组织列表失败')
    }
  } catch (error) {
    console.error('获取组织列表失败:', error)
    message.error('获取组织列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchOrganizationList()
}

// 重置
const handleReset = () => {
  queryParams.keyword = ''
  queryParams.type = undefined
  queryParams.status = undefined
  pagination.current = 1
  fetchOrganizationList()
}

// 分页变化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.current = page
  pagination.size = pageSize
  fetchOrganizationList()
}

// 新增组织
const handleAdd = () => {
  formModalVisible.value = true
  Object.assign(formData, {
    id: undefined,
    name: '',
    code: '',
    type: undefined,
    leader: '',
    leaderPhone: '',
    email: '',
    phone: '',
    province: undefined,
    city: undefined,
    district: undefined,
    address: '',
    scale: undefined,
    industry: undefined,
    description: '',
    status: 'enabled',
  })
}

// 查看组织详情
const handleView = async (record: Organization) => {
  try {
    const response = await organizationApi.getOrganizationById(record.id)
    if (response.code === 200) {
      currentOrg.value = response.data
      detailModalVisible.value = true
    } else {
      message.error(response.message || '获取组织详情失败')
    }
  } catch (error) {
    console.error('获取组织详情失败:', error)
    message.error('获取组织详情失败')
  }
}

// 编辑组织
const handleEdit = (record: Organization) => {
  formModalVisible.value = true
  Object.assign(formData, {
    id: record.id,
    name: record.name,
    code: record.code,
    type: record.type,
    leader: record.leader,
    leaderPhone: record.leaderPhone,
    email: record.email,
    phone: record.phone,
    province: record.province,
    city: record.city,
    district: record.district,
    address: record.address,
    scale: record.scale,
    industry: record.industry,
    description: record.description,
    status: record.status,
  })
}

// 切换组织状态
const handleToggleStatus = async (record: Organization) => {
  const newStatus = record.status === 'enabled' ? 'disabled' : 'enabled'
  const actionText = newStatus === 'enabled' ? '启用' : '禁用'

  Modal.confirm({
    title: `${actionText}组织`,
    content: `确定要${actionText}组织 "${record.name}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const response = await organizationApi.toggleOrganizationStatus(record.id, newStatus)
        if (response.code === 200) {
          message.success(`${actionText}成功`)
          fetchOrganizationList()
        } else {
          message.error(response.message || `${actionText}失败`)
        }
      } catch (error) {
        console.error(`${actionText}失败:`, error)
        message.error(`${actionText}失败`)
      }
    },
  })
}

// 删除组织
const handleDelete = (record: Organization) => {
  Modal.confirm({
    title: '删除组织',
    content: `确定要删除组织 "${record.name}" 吗？删除后该组织下的所有部门、用户等数据将一并删除，此操作不可恢复！`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        const response = await organizationApi.deleteOrganization(record.id)
        if (response.code === 200) {
          message.success('删除成功')
          if (organizationList.value.length === 1 && pagination.current > 1) {
            pagination.current--
          }
          fetchOrganizationList()
        } else {
          message.error(response.message || '删除失败')
        }
      } catch (error) {
        console.error('删除失败:', error)
        message.error('删除失败')
      }
    },
  })
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()

    const api = formData.id
      ? organizationApi.updateOrganization
      : organizationApi.createOrganization

    const response = await api(formData)

    if (response.code === 200) {
      message.success(formData.id ? '更新成功' : '创建成功')
      formModalVisible.value = false
      fetchOrganizationList()
    } else {
      message.error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 取消表单
const handleCancel = () => {
  formModalVisible.value = false
  formRef.value?.resetFields()
}

// 字典数据缓存
const dictCache = reactive<{
  orgType: DictItem[]
  orgScale: DictItem[]
  orgIndustry: DictItem[]
}>({
  orgType: [],
  orgScale: [],
  orgIndustry: [],
})

// 加载字典数据
const loadDictData = async () => {
  try {
    const [typeRes, scaleRes, industryRes] = await Promise.all([
      getDictItemByCategoryCode('org_type', { status: 'enabled' }),
      getDictItemByCategoryCode('org_scale', { status: 'enabled' }),
      getDictItemByCategoryCode('org_industry', { status: 'enabled' }),
    ])

    if (typeRes.code === 200) dictCache.orgType = typeRes.data
    if (scaleRes.code === 200) dictCache.orgScale = scaleRes.data
    if (industryRes.code === 200) dictCache.orgIndustry = industryRes.data
  } catch (error) {
    console.error('加载字典数据失败:', error)
  }
}

// 获取字典项标签
const getDictLabel = (dictCode: string, value?: string) => {
  if (!value) return '-'
  let items: DictItem[] = []
  
  switch (dictCode) {
    case 'org_type':
      items = dictCache.orgType
      break
    case 'org_scale':
      items = dictCache.orgScale
      break
    case 'org_industry':
      items = dictCache.orgIndustry
      break
  }
  
  const item = items.find(item => item.value === value)
  return item?.label || value
}

// 获取字典项颜色
const getDictColor = (dictCode: string, value?: string) => {
  if (!value) return 'default'
  let items: DictItem[] = []
  
  switch (dictCode) {
    case 'org_type':
      items = dictCache.orgType
      break
    case 'org_scale':
      items = dictCache.orgScale
      break
    case 'org_industry':
      items = dictCache.orgIndustry
      break
  }
  
  const item = items.find(item => item.value === value)
  return item?.tagType || 'default'
}

// 获取组织类型颜色和文本（使用字典）
const getOrgTypeColor = (type: string) => getDictColor('org_type', type)
const getOrgTypeText = (type: string) => getDictLabel('org_type', type)
const getOrgScaleText = (scale?: string) => getDictLabel('org_scale', scale)

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 初始化
onMounted(async () => {
  await loadDictData()
  fetchOrganizationList()
})
</script>

<style scoped>
/* 使用 Tailwind 类，无需自定义样式 */
</style>
