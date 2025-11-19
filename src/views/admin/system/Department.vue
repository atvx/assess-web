<!-- eslint-disable vue/multi-word-component-names -->
<!-- 部门管理页面 -->
<template>
  <div class="department-page h-full">
    <a-row :gutter="16" class="h-full">
      <!-- 左侧：部门树 -->
      <a-col :xs="24" :sm="24" :md="8" :lg="7" :xl="6">
        <a-card class="h-full rounded-lg shadow" :bordered="false">
          <div class="flex items-center gap-2 mb-4">
            <!-- 搜索框 -->
            <a-input-search
              v-model:value="treeSearchKeyword"
              placeholder="搜索部门"
              allow-clear
              style="flex: 1"
              @search="handleTreeSearch"
            />
            <a-button @click="handleRefreshTree" :loading="refreshLoading">
              <template #icon>
                <SyncOutlined />
              </template>
            </a-button>
          </div>

          <!-- 部门树 -->
          <div class="department-tree-wrapper">
            <a-spin :spinning="treeLoading">
              <a-empty
                v-if="!treeData.length && !treeLoading"
                description="暂无部门数据"
              />
              <a-tree
                v-else
                v-model:expanded-keys="expandedKeys"
                v-model:selected-keys="selectedKeys"
                :tree-data="filteredTreeData"
                :show-line="{ showLeafIcon: false }"
                :field-names="{ title: 'name', key: 'id', children: 'children' }"
                draggable
                block-node
                @select="handleTreeSelect"
                @drop="handleTreeDrop"
              >
                <template #title="node">
                  <div class="tree-node-title">
                    <span class="node-name">{{ node.name }}</span>
                    <a-dropdown
                      :trigger="['click']"
                      placement="bottomRight"
                    >
                      <a-button
                        type="text"
                        size="small"
                        class="node-action-btn"
                        @click.stop
                      >
                        <MoreOutlined />
                      </a-button>
                      <template #overlay>
                        <a-menu @click="handleTreeAction">
                          <a-menu-item
                            :key="`add-${node.id}`"
                            :data-action="'add'"
                            :data-node-id="node.id"
                          >
                            <PlusOutlined />
                            添加子部门
                          </a-menu-item>
                          <a-menu-item
                            v-if="!isRootNode(node)"
                            :key="`edit-${node.id}`"
                            :data-action="'edit'"
                            :data-node-id="node.id"
                          >
                            <EditOutlined />
                            编辑
                          </a-menu-item>
                          <a-menu-item
                            v-if="canMoveUp(node)"
                            :key="`up-${node.id}`"
                            :data-action="'up'"
                            :data-node-id="node.id"
                          >
                            <ArrowUpOutlined />
                            上移
                          </a-menu-item>
                          <a-menu-item
                            v-if="canMoveDown(node)"
                            :key="`down-${node.id}`"
                            :data-action="'down'"
                            :data-node-id="node.id"
                          >
                            <ArrowDownOutlined />
                            下移
                          </a-menu-item>
                          <a-menu-divider v-if="!isRootNode(node)" />
                          <a-menu-item
                            v-if="!isRootNode(node)"
                            :key="`delete-${node.id}`"
                            :data-action="'delete'"
                            :data-node-id="node.id"
                            danger
                          >
                            <DeleteOutlined />
                            删除
                          </a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </div>
                </template>
              </a-tree>
            </a-spin>
          </div>
        </a-card>
      </a-col>

      <!-- 右侧：部门列表 -->
      <a-col :xs="24" :sm="24" :md="16" :lg="17" :xl="18">
        <div class="department-list-section">
          <!-- 搜索表单 -->
          <a-card class="mb-4 rounded-lg shadow" :bordered="false">
            <a-form layout="inline" :model="queryParams" @submit.prevent="handleSearch">
              <a-form-item label="关键词">
                <a-input
                  v-model:value="queryParams.keyword"
                  placeholder="搜索部门名称或编码"
                  allow-clear
                  style="width: 220px"
                  @pressEnter="handleSearch"
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
                  <a-button type="primary" html-type="submit" :loading="tableLoading">
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

          <!-- 部门列表 -->
          <a-card class="rounded-lg shadow" :bordered="false">
            <template #title>
              <div class="flex items-center justify-between">
                <span class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ selectedDepartment?.name || '全部部门' }}
                </span>
                <a-space>
                  <a-button @click="handleDownloadTemplate">
                    <template #icon>
                      <DownloadOutlined />
                    </template>
                    下载模板
                  </a-button>
                  <a-upload
                    :show-upload-list="false"
                    :before-upload="handleImport"
                    accept=".xlsx,.xls"
                  >
                    <a-button>
                      <template #icon>
                        <UploadOutlined />
                      </template>
                      导入
                    </a-button>
                  </a-upload>
                  <a-button @click="handleExport">
                    <template #icon>
                      <ExportOutlined />
                    </template>
                    导出
                  </a-button>
                </a-space>
              </div>
            </template>

            <a-table
              :columns="columns"
              :data-source="departmentList"
              :loading="tableLoading"
              :pagination="false"
              :scroll="{ x: 1200 }"
              row-key="id"
            >
              <template #bodyCell="{ column, record }">
                <!-- 部门信息 -->
                <template v-if="column.key === 'department'">
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white">
                      {{ record.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ record.code }}
                    </div>
                  </div>
                </template>

                <!-- 上级部门 -->
                <template v-else-if="column.key === 'parent'">
                  <span class="text-sm">
                    {{ record.parentName || '-' }}
                  </span>
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
                    <a-button type="link" size="small" @click="handleEdit(record)">
                      编辑
                    </a-button>
                    <a-button
                      type="link"
                      size="small"
                      danger
                      @click="handleDelete(record)"
                    >
                      删除
                    </a-button>
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
                :show-total="(total: number) => `共 ${total} 个部门`"
                :page-size-options="['10', '20', '50', '100']"
                show-size-changer
                show-quick-jumper
                @change="handlePageChange"
              />
            </div>
          </a-card>
        </div>
      </a-col>
    </a-row>

    <!-- 新增/编辑部门弹窗 -->
    <a-modal
      v-model:open="formModalVisible"
      :title="formData.id ? '编辑部门' : '新增部门'"
      :width="700"
      :confirm-loading="formLoading"
      @ok="handleSubmit"
      @cancel="handleFormClose"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="部门名称" name="name">
          <a-input v-model:value="formData.name" placeholder="请输入部门名称" />
        </a-form-item>
        <a-form-item label="部门编码" name="code">
          <a-input v-model:value="formData.code" placeholder="请输入部门编码（可选）" />
        </a-form-item>
        <a-form-item label="上级部门" name="parentId">
          <a-tree-select
            v-model:value="formData.parentId"
            :tree-data="parentTreeData"
            :field-names="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="请选择上级部门（不选则为根部门）"
            allow-clear
            tree-default-expand-all
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
            placeholder="请输入部门描述（可选）"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DownloadOutlined,
  UploadOutlined,
  ExportOutlined,
  SyncOutlined,
} from '@ant-design/icons-vue'
import {
  departmentApi,
  type Department,
  type DepartmentFormDTO,
} from '@/api/department'
import { useUserStore } from '@/stores/user'
import dayjs from 'dayjs'

// ==================== 用户信息 ====================
const userStore = useUserStore()
const currentOrgId = computed(() => userStore.userInfo?.orgId || '')

// ==================== 树形结构相关 ====================
const treeData = ref<Department[]>([])
const filteredTreeData = ref<Department[]>([])
const expandedKeys = ref<string[]>([])
const selectedKeys = ref<string[]>([])
const treeSearchKeyword = ref('')
const treeLoading = ref(false)
const refreshLoading = ref(false)
const isMoving = ref(false) // 防止并发移动操作
const selectedDepartment = ref<Department | null>(null)

// ==================== 表格列表相关 ====================
const departmentList = ref<Department[]>([])
const tableLoading = ref(false)

// 查询参数
const queryParams = reactive<{
  keyword: string
  status: 'enabled' | 'disabled' | undefined
  orgId: string
  parentId: string | undefined
  sortBy: string
  sortOrder: string
}>({
  keyword: '',
  status: undefined,
  orgId: currentOrgId.value,
  parentId: undefined,
  sortBy: 'sort',
  sortOrder: 'desc',
})

// 分页信息
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
})

// 表格列定义
const columns = [
  {
    title: '部门信息',
    key: 'department',
    width: 220,
    fixed: 'left',
  },
  {
    title: '上级部门',
    key: 'parent',
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
    width: 150,
    fixed: 'right',
  },
]

// ==================== 表单相关 ====================
const formModalVisible = ref(false)
const formLoading = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive<DepartmentFormDTO>({
  name: '',
  code: '',
  parentId: undefined,
  orgId: currentOrgId.value,
  description: '',
  status: 'enabled',
})

const formRules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
}

// 上级部门树数据（排除自己和子孙节点）
const parentTreeData = computed(() => {
  if (!formData.id) {
    return treeData.value
  }
  // 编辑时需要排除自己和子孙节点
  return filterSelfAndDescendants(treeData.value, formData.id)
})

// 过滤自己和子孙节点
const filterSelfAndDescendants = (nodes: Department[], excludeId: string): Department[] => {
  return nodes
    .filter(node => node.id !== excludeId)
    .map(node => ({
      ...node,
      children: node.children ? filterSelfAndDescendants(node.children, excludeId) : undefined,
    }))
}

// ==================== 工具函数 ====================
// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 判断是否为根节点
const isRootNode = (node: Department) => {
  return node.id === currentOrgId.value || !node.parentId
}

// 判断是否可以上移
const canMoveUp = (node: Department) => {
  if (isRootNode(node)) return false

  // 查找父节点
  const parent = findParentNode(treeData.value, node.id)
  if (!parent || !parent.children) return false

  // 判断是否为第一个子节点
  const index = parent.children.findIndex(child => child.id === node.id)
  return index > 0
}

// 判断是否可以下移
const canMoveDown = (node: Department) => {
  if (isRootNode(node)) return false

  // 查找父节点
  const parent = findParentNode(treeData.value, node.id)
  if (!parent || !parent.children) return false

  // 判断是否为最后一个子节点
  const index = parent.children.findIndex(child => child.id === node.id)
  return index < parent.children.length - 1
}

// 查找父节点
const findParentNode = (nodes: Department[], childId: string): Department | null => {
  for (const node of nodes) {
    if (node.children) {
      if (node.children.some(child => child.id === childId)) {
        return node
      }
      const found = findParentNode(node.children, childId)
      if (found) return found
    }
  }
  return null
}

// 查找节点
const findNode = (nodes: Department[], nodeId: string): Department | null => {
  for (const node of nodes) {
    if (node.id === nodeId) return node
    if (node.children) {
      const found = findNode(node.children, nodeId)
      if (found) return found
    }
  }
  return null
}

// 树形搜索过滤
const filterTree = (nodes: Department[], keyword: string): Department[] => {
  if (!keyword) return nodes

  return nodes
    .map(node => {
      const match = node.name.toLowerCase().includes(keyword.toLowerCase()) ||
                   (node.code?.toLowerCase().includes(keyword.toLowerCase()) ?? false)

      const children = node.children ? filterTree(node.children, keyword) : []

      if (match || children.length > 0) {
        return {
          ...node,
          children: children.length > 0 ? children : node.children,
        }
      }
      return null
    })
    .filter(Boolean) as Department[]
}

// 展开所有匹配的节点
const expandMatchedNodes = (nodes: Department[], keyword: string, keys: string[] = []): string[] => {
  nodes.forEach(node => {
    if (node.name.toLowerCase().includes(keyword.toLowerCase()) ||
        (node.code?.toLowerCase().includes(keyword.toLowerCase()) ?? false)) {
      keys.push(node.id)
    }
    if (node.children) {
      expandMatchedNodes(node.children, keyword, keys)
      // 如果子节点匹配，展开父节点
      if (node.children.some(child =>
        child.name.toLowerCase().includes(keyword.toLowerCase()) ||
        (child.code?.toLowerCase().includes(keyword.toLowerCase()) ?? false)
      )) {
        keys.push(node.id)
      }
    }
  })
  return keys
}

// ==================== 数据加载 ====================
// 加载部门树（使用无缓存的刷新接口）
const fetchDepartmentTree = async () => {
  treeLoading.value = true
  try {
    console.log('🔄 [fetchDepartmentTree] 初始加载部门树（无缓存）')
    const response = await departmentApi.refreshDepartmentTree(currentOrgId.value)
    if (response.code === 200) {
      treeData.value = response.data
      filteredTreeData.value = response.data
      // 默认展开第一层
      expandedKeys.value = response.data.map(node => node.id)
      console.log('✅ [fetchDepartmentTree] 部门树加载成功')
    } else {
      console.error('❌ [fetchDepartmentTree] 获取部门树失败', response.message)
      message.error(response.message || '获取部门树失败')
    }
  } catch (error) {
    console.error('❌ [fetchDepartmentTree] 获取部门树异常:', error)
    message.error('获取部门树失败')
  } finally {
    treeLoading.value = false
  }
}

// 刷新部门树（强制刷新，无缓存）
const refreshTree = async (keepExpandedKeys = false) => {
  try {
    console.log('🔄 [refreshTree] 开始刷新部门树', {
      keepExpandedKeys,
      currentOrgId: currentOrgId.value,
      timestamp: new Date().toISOString()
    })
    
    const oldExpandedKeys = keepExpandedKeys ? [...expandedKeys.value] : []
    const oldSelectedKeys = [...selectedKeys.value]
    const oldTreeDataLength = treeData.value.length
    
    console.log('📊 [refreshTree] 刷新前状态', {
      oldExpandedKeys,
      oldSelectedKeys,
      oldTreeDataLength
    })
    
    // 直接调用 refreshDepartmentTree API（后端强制刷新，无缓存）
    const response = await departmentApi.refreshDepartmentTree(currentOrgId.value)
    
    console.log('📥 [refreshTree] API响应', {
      code: response.code,
      dataLength: response.data?.length
    })
    
    // 单独打印完整的树结构
    console.log('📦 [refreshTree] API返回的完整树结构：')
    console.log(response.data)
    
    if (response.code === 200) {
      treeData.value = response.data
      filteredTreeData.value = response.data
      
      console.log('✅ [refreshTree] 树数据已更新', {
        newTreeDataLength: treeData.value.length
      })
      
      // 递归函数：打印树的层级结构
      const printTreeStructure = (nodes: Department[], level = 0) => {
        nodes.forEach(node => {
          const indent = '  '.repeat(level)
          console.log(`${indent}├─ ${node.name} (sort: ${node.sort || 0}, id: ${node.id})`)
          if (node.children && node.children.length > 0) {
            printTreeStructure(node.children, level + 1)
          }
        })
      }
      
      console.log('🌳 [refreshTree] 树结构层级：')
      printTreeStructure(treeData.value)
      
      // 如果需要保持展开状态，则使用旧的 expandedKeys，否则默认展开第一层
      if (keepExpandedKeys && oldExpandedKeys.length > 0) {
        expandedKeys.value = oldExpandedKeys
      } else {
        expandedKeys.value = response.data.map(node => node.id)
      }
      
      // 保持选中状态
      if (keepExpandedKeys && oldSelectedKeys.length > 0) {
        selectedKeys.value = oldSelectedKeys
      }
      
      console.log('✅ [refreshTree] 刷新成功')
      return true
    } else {
      console.error('❌ [refreshTree] 刷新失败', response.message)
      message.error(response.message || '刷新失败')
      return false
    }
  } catch (error) {
    console.error('❌ [refreshTree] 刷新异常:', error)
    message.error('刷新失败')
    return false
  }
}

// 刷新部门树按钮
const handleRefreshTree = async () => {
  refreshLoading.value = true
  try {
    await refreshTree(false)
    // 清空搜索关键词
    treeSearchKeyword.value = ''
    message.success('刷新成功')
  } finally {
    refreshLoading.value = false
  }
}

// 加载部门列表
const fetchDepartmentList = async () => {
  tableLoading.value = true
  try {
    const response = await departmentApi.getDepartmentList({
      ...queryParams,
      current: pagination.current,
      size: pagination.size,
    })

    if (response.code === 200) {
      departmentList.value = response.data.records
      pagination.total = response.data.total
    } else {
      message.error(response.message || '获取部门列表失败')
    }
  } catch (error) {
    console.error('获取部门列表失败:', error)
    message.error('获取部门列表失败')
  } finally {
    tableLoading.value = false
  }
}

// ==================== 树形操作 ====================
// 树形搜索
const handleTreeSearch = () => {
  if (treeSearchKeyword.value) {
    filteredTreeData.value = filterTree(treeData.value, treeSearchKeyword.value)
    expandedKeys.value = expandMatchedNodes(treeData.value, treeSearchKeyword.value)
  } else {
    filteredTreeData.value = treeData.value
    expandedKeys.value = treeData.value.map(node => node.id)
  }
}

// 树节点选择
const handleTreeSelect = (keys: string[]) => {
  if (keys.length > 0) {
    const nodeId = keys[0]
    if (nodeId) {
      const node = findNode(treeData.value, nodeId)
      selectedDepartment.value = node
      queryParams.parentId = nodeId
      pagination.current = 1
      fetchDepartmentList()
    }
  } else {
    selectedDepartment.value = null
    queryParams.parentId = undefined
    fetchDepartmentList()
  }
}

// 树节点操作
const handleTreeAction = ({ domEvent }: { key: string; domEvent: MouseEvent }) => {
  const target = (domEvent.target as HTMLElement).closest('.ant-dropdown-menu-item')
  if (!target) return

  const action = (target as HTMLElement).dataset.action
  const nodeId = (target as HTMLElement).dataset.nodeId

  if (!action || !nodeId) return

  const node = findNode(treeData.value, nodeId)
  if (!node) return

  switch (action) {
    case 'add':
      handleAddChild(node)
      break
    case 'edit':
      handleEdit(node)
      break
    case 'up':
      handleMoveUp(node)
      break
    case 'down':
      handleMoveDown(node)
      break
    case 'delete':
      handleDelete(node)
      break
  }
}

// 添加根部门
const handleAddRootDepartment = () => {
  Object.assign(formData, {
    id: undefined,
    name: '',
    code: '',
    parentId: currentOrgId.value as string | undefined,
    orgId: currentOrgId.value,
    description: '',
    status: 'enabled',
  })
  formModalVisible.value = true
}

// 添加子部门
const handleAddChild = (node: Department) => {
  Object.assign(formData, {
    id: undefined,
    name: '',
    code: '',
    parentId: node.id,
    orgId: currentOrgId.value,
    description: '',
    status: 'enabled',
  })
  formModalVisible.value = true
}

// 上移
const handleMoveUp = async (node: Department) => {
  console.log('⬆️ [handleMoveUp] 开始上移操作', {
    nodeName: node.name,
    nodeId: node.id,
    parentId: node.parentId,
    isMoving: isMoving.value
  })
  
  if (isMoving.value) {
    console.warn('⚠️ [handleMoveUp] 操作被拒绝：正在移动中')
    message.warning('正在移动中，请稍候...')
    return
  }
  
  isMoving.value = true
  try {
    // 找到父节点和兄弟节点
    const parent = findParentNode(treeData.value, node.id)
    console.log('📍 [handleMoveUp] 找到父节点', {
      hasParent: !!parent,
      hasChildren: !!parent?.children,
      childrenCount: parent?.children?.length
    })
    
    if (!parent || !parent.children) {
      console.warn('⚠️ [handleMoveUp] 没有父节点或子节点')
      return
    }

    const siblings = parent.children
    const currentIndex = siblings.findIndex(child => child.id === node.id)
    
    console.log('📊 [handleMoveUp] 兄弟节点信息', {
      currentIndex,
      totalSiblings: siblings.length,
      siblingNames: siblings.map(s => s.name)
    })
    
    if (currentIndex <= 0) {
      console.warn('⚠️ [handleMoveUp] 已经是第一个，无法上移')
      return
    }

    // 获取上一个兄弟节点
    const prevSibling = siblings[currentIndex - 1]
    if (!prevSibling) {
      console.warn('⚠️ [handleMoveUp] 没有找到上一个兄弟节点')
      return
    }

    const moveParams = {
      departToMove: node.id,
      destParentDepart: node.parentId,
      departBefore: prevSibling.id,
    }
    
    console.log('📤 [handleMoveUp] 发送移动请求', moveParams)
    
    const response = await departmentApi.moveDepartment(moveParams)
    
    console.log('📥 [handleMoveUp] 移动API响应', {
      code: response.code,
      message: response.message,
      data: response.data
    })
    
    if (response.code === 200) {
      message.success('上移成功')
      console.log('✅ [handleMoveUp] 移动成功，开始刷新树')
      
      // 打印移动前的树结构
      const printTree = (nodes: Department[], level = 0) => {
        nodes.forEach(n => {
          console.log(`${'  '.repeat(level)}├─ ${n.name} (sort: ${n.sort || 0})`)
          if (n.children?.length) printTree(n.children, level + 1)
        })
      }
      console.log('🌳 [handleMoveUp] 刷新前树结构：')
      printTree(treeData.value)
      
      const success = await refreshTree(true)
      console.log('🔄 [handleMoveUp] 刷新树结果', { success })
      
      console.log('🌳 [handleMoveUp] 刷新后树结构：')
      printTree(treeData.value)
      
      if (success) {
        fetchDepartmentList()
      }
    } else {
      console.error('❌ [handleMoveUp] 移动失败', response.message)
      message.error(response.message || '上移失败')
    }
  } catch (error) {
    console.error('❌ [handleMoveUp] 上移异常:', error)
    message.error('上移失败')
  } finally {
    isMoving.value = false
    console.log('🏁 [handleMoveUp] 上移操作结束')
  }
}

// 下移
const handleMoveDown = async (node: Department) => {
  console.log('⬇️ [handleMoveDown] 开始下移操作', {
    nodeName: node.name,
    nodeId: node.id,
    parentId: node.parentId,
    isMoving: isMoving.value
  })
  
  if (isMoving.value) {
    console.warn('⚠️ [handleMoveDown] 操作被拒绝：正在移动中')
    message.warning('正在移动中，请稍候...')
    return
  }
  
  isMoving.value = true
  try {
    // 找到父节点和兄弟节点
    const parent = findParentNode(treeData.value, node.id)
    console.log('📍 [handleMoveDown] 找到父节点', {
      hasParent: !!parent,
      hasChildren: !!parent?.children,
      childrenCount: parent?.children?.length
    })
    
    if (!parent || !parent.children) {
      console.warn('⚠️ [handleMoveDown] 没有父节点或子节点')
      return
    }

    const siblings = parent.children
    const currentIndex = siblings.findIndex(child => child.id === node.id)
    
    console.log('📊 [handleMoveDown] 兄弟节点信息', {
      currentIndex,
      totalSiblings: siblings.length,
      siblingNames: siblings.map(s => s.name)
    })
    
    if (currentIndex >= siblings.length - 1) {
      console.warn('⚠️ [handleMoveDown] 已经是最后一个，无法下移')
      return
    }

    // 获取下一个兄弟节点
    const nextSibling = siblings[currentIndex + 1]
    if (!nextSibling) {
      console.warn('⚠️ [handleMoveDown] 没有找到下一个兄弟节点')
      return
    }

    const moveParams = {
      departToMove: node.id,
      destParentDepart: node.parentId,
      departAfter: nextSibling.id,
    }
    
    console.log('📤 [handleMoveDown] 发送移动请求', moveParams)
    
    const response = await departmentApi.moveDepartment(moveParams)
    
    console.log('📥 [handleMoveDown] 移动API响应', {
      code: response.code,
      message: response.message,
      data: response.data
    })
    
    if (response.code === 200) {
      message.success('下移成功')
      console.log('✅ [handleMoveDown] 移动成功，开始刷新树')
      
      // 打印移动前的树结构
      const printTree = (nodes: Department[], level = 0) => {
        nodes.forEach(n => {
          console.log(`${'  '.repeat(level)}├─ ${n.name} (sort: ${n.sort || 0})`)
          if (n.children?.length) printTree(n.children, level + 1)
        })
      }
      console.log('🌳 [handleMoveDown] 刷新前树结构：')
      printTree(treeData.value)
      
      const success = await refreshTree(true)
      console.log('🔄 [handleMoveDown] 刷新树结果', { success })
      
      console.log('🌳 [handleMoveDown] 刷新后树结构：')
      printTree(treeData.value)
      
      if (success) {
        fetchDepartmentList()
      }
    } else {
      console.error('❌ [handleMoveDown] 移动失败', response.message)
      message.error(response.message || '下移失败')
    }
  } catch (error) {
    console.error('❌ [handleMoveDown] 下移异常:', error)
    message.error('下移失败')
  } finally {
    isMoving.value = false
    console.log('🏁 [handleMoveDown] 下移操作结束')
  }
}

// 拖拽排序
const handleTreeDrop = async (info: {
  node: { key: string; pos: string }
  dragNode: { key: string }
  dropPosition: number
  dropToGap: boolean
}) => {
  console.log('🎯 [handleTreeDrop] 开始拖拽操作', {
    dragKey: info.dragNode.key,
    dropKey: info.node.key,
    dropPosition: info.dropPosition,
    dropToGap: info.dropToGap,
    isMoving: isMoving.value
  })
  
  // 打印拖拽前的树结构
  const printSimpleTree = (nodes: Department[], level = 0) => {
    nodes.forEach(node => {
      const indent = '  '.repeat(level)
      console.log(`${indent}├─ ${node.name} (sort: ${node.sort || 0})`)
      if (node.children && node.children.length > 0) {
        printSimpleTree(node.children, level + 1)
      }
    })
  }
  
  console.log('🌳 [handleTreeDrop] 拖拽前的树结构：')
  printSimpleTree(treeData.value)
  
  if (isMoving.value) {
    console.warn('⚠️ [handleTreeDrop] 操作被拒绝：正在移动中')
    message.warning('正在移动中，请稍候...')
    // 刷新一次树以恢复UI
    await refreshTree(true)
    return
  }
  
  isMoving.value = true
  const dropKey = info.node.key
  const dragKey = info.dragNode.key
  const dropPos = info.node.pos.split('-')
  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

  console.log('📊 [handleTreeDrop] 计算后的位置', {
    dropPosition,
    dropPos,
    dropToGap: info.dropToGap
  })

  try {
    const dragNode = findNode(treeData.value, dragKey)
    const targetNode = findNode(treeData.value, dropKey)
    
    console.log('🔍 [handleTreeDrop] 查找拖拽和目标节点', {
      dragNode: dragNode?.name,
      targetNode: targetNode?.name,
      targetParentId: targetNode?.parentId
    })
    
    const moveData: {
      departToMove: string
      destParentDepart?: string
      departBefore?: string
      departAfter?: string
    } = {
      departToMove: dragKey,
    }

    if (!info.dropToGap) {
      // 放入目标节点内部（成为子节点，插入到第一个位置）
      moveData.destParentDepart = dropKey
      
      // 根据Ant Design官方示例，dropToGap=false时应该插入到children的第一个位置
      // 所以我们需要找到目标节点的第一个子节点，插入到它前面
      if (targetNode && targetNode.children && targetNode.children.length > 0) {
        const firstChild = targetNode.children[0]
        if (firstChild && firstChild.id !== dragKey) {
          moveData.departBefore = firstChild.id
          console.log('📦 [handleTreeDrop] 放入目标节点内部（插入到第一个位置）', {
            destParentDepart: dropKey,
            departBefore: firstChild.id,
            firstChildName: firstChild.name
          })
        } else {
          console.log('📦 [handleTreeDrop] 放入目标节点内部（已是第一个子节点）', {
            destParentDepart: dropKey
          })
        }
      } else {
        console.log('📦 [handleTreeDrop] 放入目标节点内部（成为第一个子节点）', {
          destParentDepart: dropKey
        })
      }
    } else {
      // 放在目标节点的前面或后面（同级）
      if (targetNode) {
        moveData.destParentDepart = targetNode.parentId
        if (dropPosition === -1) {
          // 放在前面
          moveData.departBefore = dropKey
          console.log('⬅️ [handleTreeDrop] 放在目标节点前面', {
            destParentDepart: targetNode.parentId,
            departBefore: dropKey,
            targetNodeName: targetNode.name
          })
        } else {
          // 放在后面
          moveData.departAfter = dropKey
          console.log('➡️ [handleTreeDrop] 放在目标节点后面', {
            destParentDepart: targetNode.parentId,
            departAfter: dropKey,
            targetNodeName: targetNode.name
          })
        }
      }
    }

    console.log('📤 [handleTreeDrop] 发送拖拽移动请求', moveData)
    
    const response = await departmentApi.moveDepartment(moveData)
    
    console.log('📥 [handleTreeDrop] 拖拽API响应', {
      code: response.code,
      message: response.message,
      data: response.data
    })
    
    if (response.code === 200) {
      message.success('移动成功')
      console.log('✅ [handleTreeDrop] 移动成功，开始刷新树')
      
      console.log('🌳 [handleTreeDrop] 刷新前树结构：')
      printSimpleTree(treeData.value)
      
      const success = await refreshTree(true)
      console.log('🔄 [handleTreeDrop] 刷新树结果', { success })
      
      console.log('🌳 [handleTreeDrop] 刷新后树结构：')
      printSimpleTree(treeData.value)
      
      if (success) {
        fetchDepartmentList()
      }
    } else {
      console.error('❌ [handleTreeDrop] 移动失败', response.message)
      message.error(response.message || '移动失败')
      // 移动失败时刷新以恢复UI
      await refreshTree(true)
    }
  } catch (error) {
    console.error('❌ [handleTreeDrop] 拖拽异常:', error)
    message.error('移动失败')
    // 出错时刷新以恢复UI
    await refreshTree(true)
  } finally {
    isMoving.value = false
    console.log('🏁 [handleTreeDrop] 拖拽操作结束')
  }
}

// ==================== 表格操作 ====================
// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchDepartmentList()
}

// 重置
const handleReset = () => {
  queryParams.keyword = ''
  queryParams.status = undefined
  queryParams.parentId = undefined
  selectedKeys.value = []
  selectedDepartment.value = null
  pagination.current = 1
  fetchDepartmentList()
}

// 分页变化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.current = page
  pagination.size = pageSize
  fetchDepartmentList()
}

// 编辑
const handleEdit = (record: Department) => {
  Object.assign(formData, {
    id: record.id,
    name: record.name,
    code: record.code,
    parentId: record.parentId || currentOrgId.value,
    orgId: record.orgId,
    description: record.description,
    status: record.status,
  })
  formModalVisible.value = true
}

// 删除
const handleDelete = (record: Department) => {
  Modal.confirm({
    title: '删除部门',
    content: `确定要删除部门 "${record.name}" 吗？删除后该部门下的所有子部门将一并删除，此操作不可恢复！`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        const response = await departmentApi.deleteDepartment(record.id)
        if (response.code === 200) {
          message.success('删除成功')
          await refreshTree(true)
          if (departmentList.value.length === 1 && pagination.current > 1) {
            pagination.current--
          }
          fetchDepartmentList()
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

// ==================== 表单操作 ====================
// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    formLoading.value = true

    const api = formData.id
      ? departmentApi.updateDepartment
      : departmentApi.createDepartment

    const response = await api(formData)

    if (response.code === 200) {
      message.success(formData.id ? '更新成功' : '创建成功')
      formModalVisible.value = false
      await refreshTree(true)
      fetchDepartmentList()
    } else {
      message.error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    formLoading.value = false
  }
}

// 关闭表单
const handleFormClose = () => {
  formRef.value?.resetFields()
}

// ==================== 导入导出 ====================
// 下载模板
const handleDownloadTemplate = async () => {
  try {
    const blob = await departmentApi.downloadTemplate()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `部门导入模板_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    message.success('下载成功')
  } catch (error) {
    console.error('下载模板失败:', error)
    message.error('下载模板失败')
  }
}

// 导入
const handleImport = async (file: File) => {
  try {
    const response = await departmentApi.importDepartments(file)
    if (response.code === 200) {
      message.success(`导入完成：成功 ${response.data.success} 条，失败 ${response.data.fail} 条`)
      await refreshTree(true)
      fetchDepartmentList()
    } else {
      message.error(response.message || '导入失败')
    }
  } catch (error) {
    console.error('导入失败:', error)
    message.error('导入失败')
  }
  return false // 阻止默认上传行为
}

// 导出
const handleExport = async () => {
  try {
    const blob = await departmentApi.exportDepartments(queryParams)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `部门列表_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    message.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    message.error('导出失败')
  }
}

// ==================== 初始化 ====================
onMounted(() => {
  fetchDepartmentTree()
  fetchDepartmentList()
})
</script>

<style scoped>
.department-page {
  padding: 16px;
}

.department-tree-wrapper {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  /* 隐藏滚动条但保持滚动功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.department-tree-wrapper::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.tree-node-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 4px;
  line-height: 1.5;
}

.tree-node-title:hover .node-action-btn {
  opacity: 1;
}

.node-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.5;
}

.node-action-btn {
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-action-btn:hover,
.node-action-btn:focus {
  opacity: 1 !important;
}

.department-list-section {
  display: flex;
  flex-direction: column;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .department-page {
    padding: 8px;
  }

  .department-tree-wrapper {
    max-height: 400px;
  }
}
</style>
