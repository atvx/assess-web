<!-- eslint-disable vue/multi-word-component-names -->
<!-- 组织管理主页面 -->
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
                {{ record.code }}
              </div>
            </div>
          </template>

          <!-- 组织类型 -->
          <template v-else-if="column.key === 'type'">
            <a-tag :color="getOrgTypeColor(record.dictType || record.type)">
              {{ record.dictTypeName || getOrgTypeText(record.type) }}
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
    <OrgView
      v-model:visible="detailModalVisible"
      :organization="currentOrg"
      :dict-cache="dictCache"
    />

    <!-- 新增/编辑组织弹窗 -->
    <OrgEdit
      v-model:visible="formModalVisible"
      :organization="editOrg"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  DownOutlined,
  StopOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
} from '@ant-design/icons-vue'
import {
  organizationApi,
  type Organization,
  type OrganizationQueryDTO,
} from '@/api/organization'
import { getDictItemByCategoryCode, type DictItem } from '@/api/dict'
import DictSelect from '@/components/common/DictSelect.vue'
import OrgView from './View.vue'
import OrgEdit from './Edit.vue'
import dayjs from 'dayjs'

// 查询参数
const queryParams = reactive<OrganizationQueryDTO>({
  keyword: '',
  type: undefined,
  status: undefined,
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
const editOrg = ref<Organization | null>(null)

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
const getOrgTypeColor = (type?: string) => getDictColor('org_type', type)
const getOrgTypeText = (type?: string) => getDictLabel('org_type', type)

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 获取组织列表
const fetchOrganizationList = async () => {
  loading.value = true
  try {
    const response = await organizationApi.getOrganizationList({
      keyword: queryParams.keyword,
      type: queryParams.type,
      status: queryParams.status,
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
  editOrg.value = null
  formModalVisible.value = true
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
  editOrg.value = record
  formModalVisible.value = true
}

// 编辑成功回调
const handleEditSuccess = () => {
  fetchOrganizationList()
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

// 初始化
onMounted(async () => {
  await loadDictData()
  fetchOrganizationList()
})
</script>

<style scoped>
/* 使用 Tailwind 类，无需自定义样式 */
</style>

