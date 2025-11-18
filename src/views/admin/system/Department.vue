<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="department-page flex flex-col gap-4">
    <!-- 顶部操作栏 -->
    <a-card class="rounded-lg shadow" :bordered="false">
      <div class="flex items-center justify-between">
        <a-space>
          <a-select
            v-model:value="searchOrgId"
            placeholder="选择组织"
            allow-clear
            style="width: 200px"
            @change="handleSearch"
          >
            <a-select-option
              v-for="org in orgList"
              :key="org.id"
              :value="org.id"
            >
              {{ org.name }}
            </a-select-option>
          </a-select>
          <a-input
            v-model:value="searchKeyword"
            placeholder="搜索部门名称或编码"
            allow-clear
            style="width: 240px"
            @pressEnter="handleSearch"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
          <a-select
            v-model:value="searchStatus"
            placeholder="状态"
            allow-clear
            style="width: 120px"
            @change="handleSearch"
          >
            <a-select-option value="enabled">启用</a-select-option>
            <a-select-option value="disabled">禁用</a-select-option>
          </a-select>
          <a-button type="primary" @click="handleSearch">
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
        <a-button type="primary" @click="handleAdd()">
          <template #icon>
            <PlusOutlined />
          </template>
          新增部门
        </a-button>
      </div>
    </a-card>

    <!-- 主体内容 -->
    <div class="flex-1 flex gap-4">
      <!-- 左侧：部门树 -->
      <a-card class="flex-shrink-0 rounded-lg shadow" :bordered="false" style="width: 360px">
        <template #title>
          <span class="text-base font-semibold">部门结构</span>
        </template>
        <a-spin :spinning="treeLoading">
          <div class="dept-tree-container" style="max-height: calc(100vh - 280px); overflow-y: auto">
            <a-tree
              v-if="treeData.length > 0"
              :tree-data="treeData"
              :field-names="{ title: 'name', key: 'id', children: 'children' }"
              :selected-keys="selectedKeys"
              :expanded-keys="expandedKeys"
              show-icon
              @select="handleNodeSelect"
              @expand="handleNodeExpand"
            >
              <template #icon>
                <ClusterOutlined class="text-blue-500" />
              </template>
              <template #title="{ dataRef }">
                <div class="flex items-center justify-between group">
                  <div class="flex-1">
                    <span>{{ dataRef.name }}</span>
                    <span v-if="dataRef.orgName" class="text-xs text-gray-400 ml-2">
                      ({{ dataRef.orgName }})
                    </span>
                  </div>
                  <a-badge
                    :count="dataRef.userCount || 0"
                    :number-style="{ backgroundColor: '#52c41a' }"
                    class="ml-2"
                  />
                </div>
              </template>
            </a-tree>
            <a-empty v-else description="暂无部门数据" />
          </div>
        </a-spin>
      </a-card>

      <!-- 右侧：详情面板 -->
      <a-card class="flex-1 rounded-lg shadow" :bordered="false">
        <template #title>
          <div class="flex items-center justify-between">
            <span class="text-base font-semibold">
              {{ currentDept ? '部门详情' : '请选择部门' }}
            </span>
            <a-space v-if="currentDept">
              <a-button type="primary" size="small" @click="handleAdd(currentDept.id)">
                <template #icon>
                  <PlusOutlined />
                </template>
                添加子部门
              </a-button>
              <a-button size="small" @click="handleEdit">
                <template #icon>
                  <EditOutlined />
                </template>
                编辑
              </a-button>
              <a-button danger size="small" @click="handleDelete">
                <template #icon>
                  <DeleteOutlined />
                </template>
                删除
              </a-button>
            </a-space>
          </div>
        </template>

        <a-spin :spinning="detailLoading">
          <div v-if="currentDept" class="detail-content">
            <!-- 基础信息 -->
            <a-descriptions
              title="基本信息"
              bordered
              :column="2"
              size="small"
              class="mb-6"
            >
              <a-descriptions-item label="部门名称" :span="2">
                {{ currentDept.name }}
              </a-descriptions-item>
              <a-descriptions-item label="部门编码">
                {{ currentDept.code }}
              </a-descriptions-item>
              <a-descriptions-item label="所属组织">
                {{ currentDept.orgName }}
              </a-descriptions-item>
              <a-descriptions-item label="上级部门" :span="2">
                {{ currentDept.parentName || '无' }}
              </a-descriptions-item>
              <a-descriptions-item label="状态">
                <a-tag :color="currentDept.status === 'enabled' ? 'green' : 'red'">
                  {{ currentDept.status === 'enabled' ? '启用' : '禁用' }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="层级">
                {{ currentDept.level }}
              </a-descriptions-item>
              <a-descriptions-item label="负责人">
                {{ currentDept.leader || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="负责人电话">
                {{ currentDept.leaderPhone || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="邮箱" :span="2">
                {{ currentDept.email || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="联系电话" :span="2">
                {{ currentDept.phone || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="描述" :span="2">
                {{ currentDept.description || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="创建时间" :span="2">
                {{ formatDate(currentDept.createdAt) }}
              </a-descriptions-item>
            </a-descriptions>

            <!-- 统计信息 -->
            <div class="mb-6">
              <h3 class="text-base font-semibold mb-4">统计信息</h3>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-statistic
                    title="部门人数"
                    :value="currentDept.userCount || 0"
                    :value-style="{ color: '#3f8600' }"
                  >
                    <template #prefix>
                      <UserOutlined />
                    </template>
                  </a-statistic>
                </a-col>
                <a-col :span="12">
                  <a-statistic
                    title="子部门数量"
                    :value="currentDept.children?.length || 0"
                    :value-style="{ color: '#1890ff' }"
                  >
                    <template #prefix>
                      <ClusterOutlined />
                    </template>
                  </a-statistic>
                </a-col>
              </a-row>
            </div>

            <!-- 部门成员 -->
            <div>
              <h3 class="text-base font-semibold mb-4">部门成员</h3>
              <a-table
                :columns="userColumns"
                :data-source="deptUsers"
                :pagination="userPagination"
                :loading="userLoading"
                size="small"
                @change="handleUserTableChange"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'user'">
                    <div class="flex items-center">
                      <a-avatar :src="record.avatar" :size="32" class="mr-2">
                        <template #icon>
                          <UserOutlined />
                        </template>
                      </a-avatar>
                      <div>
                        <div class="font-medium">{{ record.realName || record.username }}</div>
                        <div class="text-xs text-gray-500">@{{ record.username }}</div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="column.key === 'status'">
                    <a-tag :color="record.status === 'enabled' ? 'green' : 'red'">
                      {{ record.status === 'enabled' ? '启用' : '禁用' }}
                    </a-tag>
                  </template>
                </template>
              </a-table>
            </div>
          </div>
          <a-empty v-else description="请从左侧选择部门查看详情" />
        </a-spin>
      </a-card>
    </div>

    <!-- 新增/编辑部门弹窗 -->
    <a-modal
      v-model:open="formModalVisible"
      :title="formData.id ? '编辑部门' : '新增部门'"
      :width="680"
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
        <a-form-item label="所属组织" name="orgId">
          <a-select
            v-model:value="formData.orgId"
            placeholder="请选择所属组织"
            @change="handleOrgChange"
          >
            <a-select-option
              v-for="org in orgList"
              :key="org.id"
              :value="org.id"
            >
              {{ org.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="上级部门" name="parentId">
          <a-tree-select
            v-model:value="formData.parentId"
            :tree-data="currentOrgDeptTree"
            :field-names="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="请选择上级部门（不选则为顶级部门）"
            allow-clear
            tree-default-expand-all
          />
        </a-form-item>
        <a-form-item label="部门名称" name="name">
          <a-input v-model:value="formData.name" placeholder="请输入部门名称" />
        </a-form-item>
        <a-form-item label="部门编码" name="code">
          <a-input v-model:value="formData.code" placeholder="请输入部门编码" />
        </a-form-item>
        <a-form-item label="负责人" name="leader">
          <a-input v-model:value="formData.leader" placeholder="请输入负责人" />
        </a-form-item>
        <a-form-item label="负责人电话" name="leaderPhone">
          <a-input v-model:value="formData.leaderPhone" placeholder="请输入负责人电话" />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formData.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="联系电话" name="phone">
          <a-input v-model:value="formData.phone" placeholder="请输入联系电话" />
        </a-form-item>
        <a-form-item label="排序" name="sort">
          <a-input-number
            v-model:value="formData.sort"
            :min="0"
            placeholder="请输入排序"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="formData.status">
            <a-radio value="enabled">启用</a-radio>
            <a-radio value="disabled">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea
            v-model:value="formData.description"
            placeholder="请输入描述"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ClusterOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import { departmentApi, type Department, type DepartmentFormDTO } from '@/api/department'
import { organizationApi, type Organization } from '@/api/organization'
import dayjs from 'dayjs'

// 搜索条件
const searchOrgId = ref<string | undefined>(undefined)
const searchKeyword = ref('')
const searchStatus = ref<string | undefined>(undefined)

// 组织列表
const orgList = ref<Organization[]>([])

// 树形数据
const treeData = ref<Department[]>([])
const treeLoading = ref(false)
const selectedKeys = ref<string[]>([])
const expandedKeys = ref<string[]>([])

// 当前选中的部门
const currentDept = ref<Department | null>(null)
const detailLoading = ref(false)

// 部门成员
const deptUsers = ref<any[]>([])
const userLoading = ref(false)
const userPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
})

// 表单
const formModalVisible = ref(false)
const formRef = ref<FormInstance>()
const formData = reactive<DepartmentFormDTO>({
  name: '',
  code: '',
  orgId: '',
  parentId: undefined,
  sort: 0,
  leader: '',
  leaderPhone: '',
  email: '',
  phone: '',
  description: '',
  status: 'enabled',
})

const formRules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入部门编码', trigger: 'blur' }],
  orgId: [{ required: true, message: '请选择所属组织', trigger: 'change' }],
}

// 当前组织的部门树（用于表单中的上级部门选择）
const currentOrgDeptTree = computed(() => {
  if (!formData.orgId) return []
  return treeData.value.filter((dept) => dept.orgId === formData.orgId)
})

// 用户列表表格列
const userColumns = [
  { title: '用户信息', key: 'user', width: 200 },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '手机号', dataIndex: 'phone', key: 'phone' },
  { title: '状态', key: 'status', width: 100 },
]

// 获取组织列表
const fetchOrganizationList = async () => {
  try {
    const response = await organizationApi.getOrganizationList({ status: 'enabled' })
    if (response.code === 200) {
      orgList.value = response.data
    }
  } catch (error) {
    console.error('获取组织列表失败:', error)
  }
}

// 获取部门树
const fetchDepartmentTree = async () => {
  treeLoading.value = true
  try {
    const response = await departmentApi.getDepartmentTree({
      keyword: searchKeyword.value,
      orgId: searchOrgId.value,
      status: searchStatus.value as 'enabled' | 'disabled' | undefined,
    })

    if (response.code === 200) {
      treeData.value = response.data
      // 自动展开第一层
      if (treeData.value.length > 0) {
        expandedKeys.value = treeData.value.map((item) => item.id)
      }
    } else {
      message.error(response.message || '获取部门树失败')
    }
  } catch (error) {
    console.error('获取部门树失败:', error)
    message.error('获取部门树失败')
  } finally {
    treeLoading.value = false
  }
}

// 加载部门详情
const loadDepartmentDetail = async (id: string) => {
  detailLoading.value = true
  try {
    const response = await departmentApi.getDepartmentById(id)
    if (response.code === 200) {
      currentDept.value = response.data
      // 加载部门成员
      await loadDepartmentUsers(id)
    } else {
      message.error(response.message || '获取部门详情失败')
    }
  } catch (error) {
    console.error('获取部门详情失败:', error)
    message.error('获取部门详情失败')
  } finally {
    detailLoading.value = false
  }
}

// 加载部门成员
const loadDepartmentUsers = async (deptId: string) => {
  userLoading.value = true
  try {
    const response = await departmentApi.getDepartmentUsers(deptId, {
      current: userPagination.current,
      size: userPagination.pageSize,
    })

    if (response.code === 200) {
      deptUsers.value = response.data.records
      userPagination.total = response.data.total
    }
  } catch (error) {
    console.error('获取部门成员失败:', error)
  } finally {
    userLoading.value = false
  }
}

// 树节点选择
const handleNodeSelect = (keys: string[]) => {
  if (keys.length > 0) {
    selectedKeys.value = keys
    loadDepartmentDetail(keys[0])
  }
}

// 树节点展开
const handleNodeExpand = (keys: string[]) => {
  expandedKeys.value = keys
}

// 搜索
const handleSearch = () => {
  fetchDepartmentTree()
}

// 重置
const handleReset = () => {
  searchOrgId.value = undefined
  searchKeyword.value = ''
  searchStatus.value = undefined
  fetchDepartmentTree()
}

// 新增部门
const handleAdd = (parentId?: string) => {
  formModalVisible.value = true
  Object.assign(formData, {
    id: undefined,
    name: '',
    code: '',
    orgId: searchOrgId.value || (orgList.value.length > 0 ? orgList.value[0].id : ''),
    parentId: parentId,
    sort: 0,
    leader: '',
    leaderPhone: '',
    email: '',
    phone: '',
    description: '',
    status: 'enabled',
  })
}

// 编辑部门
const handleEdit = () => {
  if (!currentDept.value) return

  formModalVisible.value = true
  Object.assign(formData, {
    id: currentDept.value.id,
    name: currentDept.value.name,
    code: currentDept.value.code,
    orgId: currentDept.value.orgId,
    parentId: currentDept.value.parentId,
    sort: currentDept.value.sort,
    leader: currentDept.value.leader,
    leaderPhone: currentDept.value.leaderPhone,
    email: currentDept.value.email,
    phone: currentDept.value.phone,
    description: currentDept.value.description,
    status: currentDept.value.status,
  })
}

// 删除部门
const handleDelete = () => {
  if (!currentDept.value) return

  Modal.confirm({
    title: '删除部门',
    content: `确定要删除部门 "${currentDept.value.name}" 吗？删除后该部门下的所有子部门和数据将一并删除，此操作不可恢复！`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        const response = await departmentApi.deleteDepartment(currentDept.value!.id)
        if (response.code === 200) {
          message.success('删除成功')
          currentDept.value = null
          selectedKeys.value = []
          fetchDepartmentTree()
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

// 组织变更时，清空上级部门选择
const handleOrgChange = () => {
  formData.parentId = undefined
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()

    const api = formData.id ? departmentApi.updateDepartment : departmentApi.createDepartment

    const response = await api(formData)

    if (response.code === 200) {
      message.success(formData.id ? '更新成功' : '创建成功')
      formModalVisible.value = false
      fetchDepartmentTree()

      // 如果是编辑，刷新详情
      if (formData.id && currentDept.value) {
        await loadDepartmentDetail(formData.id)
      }
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

// 用户表格分页变化
const handleUserTableChange = (pagination: any) => {
  userPagination.current = pagination.current
  userPagination.pageSize = pagination.pageSize
  if (currentDept.value) {
    loadDepartmentUsers(currentDept.value.id)
  }
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 初始化
onMounted(async () => {
  await fetchOrganizationList()
  await fetchDepartmentTree()
})
</script>

<style scoped>
.department-page {
  height: calc(100vh - 120px);
}

.dept-tree-container :deep(.ant-tree-node-content-wrapper) {
  width: 100%;
}

.detail-content {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}
</style>
