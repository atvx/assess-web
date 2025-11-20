<!-- 部门树组件 -->
<template>
  <a-card class="h-full rounded-lg shadow" :bordered="false">
    <div class="flex items-center gap-2 mb-4">
      <!-- 搜索框 -->
      <a-input-search
        v-model:value="searchKeyword"
        placeholder="搜索部门"
        allow-clear
        style="flex: 1"
        @search="handleSearch"
      />
      <a-button @click="handleRefresh" :loading="refreshLoading">
        <template #icon>
          <SyncOutlined />
        </template>
      </a-button>
    </div>

    <!-- 部门树 -->
    <div class="department-tree-wrapper">
      <a-spin :spinning="loading">
        <a-empty
          v-if="!treeData.length && !loading"
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
          @select="handleSelect"
          @drop="handleDrop"
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
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'
import {
  SyncOutlined,
  MoreOutlined,
  PlusOutlined,
  EditOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import {
  departmentApi,
  type Department,
} from '@/api/department'

interface Props {
  orgId: string
}

interface Emits {
  (e: 'select', department: Department | null): void
  (e: 'add', parentDepartment: Department): void
  (e: 'edit', department: Department): void
  (e: 'delete', department: Department): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 状态
const treeData = ref<Department[]>([])
const filteredTreeData = ref<Department[]>([])
const expandedKeys = ref<string[]>([])
const selectedKeys = ref<string[]>([])
const searchKeyword = ref('')
const loading = ref(false)
const refreshLoading = ref(false)
const isMoving = ref(false)

// ==================== 工具函数 ====================
// 判断是否为根节点
const isRootNode = (node: Department) => {
  return node.id === props.orgId || !node.parentId
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

// 判断是否可以上移
const canMoveUp = (node: Department) => {
  if (isRootNode(node)) return false
  const parent = findParentNode(treeData.value, node.id)
  if (!parent || !parent.children) return false
  const index = parent.children.findIndex(child => child.id === node.id)
  return index > 0
}

// 判断是否可以下移
const canMoveDown = (node: Department) => {
  if (isRootNode(node)) return false
  const parent = findParentNode(treeData.value, node.id)
  if (!parent || !parent.children) return false
  const index = parent.children.findIndex(child => child.id === node.id)
  return index < parent.children.length - 1
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
// 加载部门树
const loadTree = async () => {
  loading.value = true
  try {
    const response = await departmentApi.refreshDepartmentTree(props.orgId)
    if (response.code === 200) {
      treeData.value = response.data
      filteredTreeData.value = response.data
      // 默认展开第一层
      expandedKeys.value = response.data.map(node => node.id)
    } else {
      message.error(response.message || '获取部门树失败')
    }
  } catch (error) {
    message.error('获取部门树失败')
  } finally {
    loading.value = false
  }
}

// 刷新部门树
const refreshTree = async (keepExpandedKeys = false) => {
  try {
    const oldExpandedKeys = keepExpandedKeys ? [...expandedKeys.value] : []
    const oldSelectedKeys = [...selectedKeys.value]
    
    const response = await departmentApi.refreshDepartmentTree(props.orgId)
    
    if (response.code === 200) {
      treeData.value = response.data
      filteredTreeData.value = response.data
      
      if (keepExpandedKeys && oldExpandedKeys.length > 0) {
        expandedKeys.value = oldExpandedKeys
      } else {
        expandedKeys.value = response.data.map(node => node.id)
      }
      
      if (keepExpandedKeys && oldSelectedKeys.length > 0) {
        selectedKeys.value = oldSelectedKeys
      }
      
      return true
    } else {
      message.error(response.message || '刷新失败')
      return false
    }
  } catch (error) {
    message.error('刷新失败')
    return false
  }
}

// ==================== 事件处理 ====================
// 搜索
const handleSearch = () => {
  if (searchKeyword.value) {
    filteredTreeData.value = filterTree(treeData.value, searchKeyword.value)
    expandedKeys.value = expandMatchedNodes(treeData.value, searchKeyword.value)
  } else {
    filteredTreeData.value = treeData.value
    expandedKeys.value = treeData.value.map(node => node.id)
  }
}

// 刷新按钮
const handleRefresh = async () => {
  refreshLoading.value = true
  try {
    await refreshTree(false)
    searchKeyword.value = ''
    message.success('刷新成功')
    emit('refresh')
  } finally {
    refreshLoading.value = false
  }
}

// 选择节点
const handleSelect = (keys: string[]) => {
  if (keys.length > 0) {
    const nodeId = keys[0]
    if (nodeId) {
      const node = findNode(treeData.value, nodeId)
      emit('select', node)
    }
  } else {
    emit('select', null)
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
      emit('add', node)
      break
    case 'edit':
      emit('edit', node)
      break
    case 'up':
      handleMoveUp(node)
      break
    case 'down':
      handleMoveDown(node)
      break
    case 'delete':
      emit('delete', node)
      break
  }
}

// 上移
const handleMoveUp = async (node: Department) => {
  if (isMoving.value) {
    message.warning('正在移动中，请稍候...')
    return
  }
  
  isMoving.value = true
  try {
    const parent = findParentNode(treeData.value, node.id)
    if (!parent || !parent.children) return

    const siblings = parent.children
    const currentIndex = siblings.findIndex(child => child.id === node.id)
    if (currentIndex <= 0) return

    const prevSibling = siblings[currentIndex - 1]
    const prevPrevSibling = currentIndex >= 2 ? siblings[currentIndex - 2] : null
    
    if (!prevSibling) return

    const moveParams: {
      departToMove: string
      destParentDepart?: string
      departBefore?: string
      departAfter?: string
    } = {
      departToMove: node.id,
      destParentDepart: node.parentId,
      departAfter: prevSibling.id,
    }
    
    if (prevPrevSibling) {
      moveParams.departBefore = prevPrevSibling.id
    }
    
    const response = await departmentApi.moveDepartment(moveParams)
    
    if (response.code === 200) {
      message.success('上移成功')
      await refreshTree(true)
      emit('refresh')
    } else {
      message.error(response.message || '上移失败')
    }
  } catch (error) {
    message.error('上移失败')
  } finally {
    isMoving.value = false
  }
}

// 下移
const handleMoveDown = async (node: Department) => {
  if (isMoving.value) {
    message.warning('正在移动中，请稍候...')
    return
  }
  
  isMoving.value = true
  try {
    const parent = findParentNode(treeData.value, node.id)
    if (!parent || !parent.children) return

    const siblings = parent.children
    const currentIndex = siblings.findIndex(child => child.id === node.id)
    if (currentIndex >= siblings.length - 1) return

    const nextSibling = siblings[currentIndex + 1]
    const nextNextSibling = currentIndex + 2 < siblings.length ? siblings[currentIndex + 2] : null
    
    if (!nextSibling) return

    const moveParams: {
      departToMove: string
      destParentDepart?: string
      departBefore?: string
      departAfter?: string
    } = {
      departToMove: node.id,
      destParentDepart: node.parentId,
      departBefore: nextSibling.id,
    }
    
    if (nextNextSibling) {
      moveParams.departAfter = nextNextSibling.id
    }
    
    const response = await departmentApi.moveDepartment(moveParams)
    
    if (response.code === 200) {
      message.success('下移成功')
      await refreshTree(true)
      emit('refresh')
    } else {
      message.error(response.message || '下移失败')
    }
  } catch (error) {
    message.error('下移失败')
  } finally {
    isMoving.value = false
  }
}

// 拖拽排序
const handleDrop = async (info: {
  node: { key: string; pos: string }
  dragNode: { key: string }
  dropPosition: number
  dropToGap: boolean
}) => {
  if (isMoving.value) {
    message.warning('正在移动中，请稍候...')
    await refreshTree(true)
    return
  }
  
  isMoving.value = true
  const dropKey = info.node.key
  const dragKey = info.dragNode.key
  const dropPos = info.node.pos.split('-')
  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

  try {
    const dragNode = findNode(treeData.value, dragKey)
    const targetNode = findNode(treeData.value, dropKey)
    
    const moveData: {
      departToMove: string
      destParentDepart?: string
      departBefore?: string
      departAfter?: string
    } = {
      departToMove: dragKey,
    }

    if (!info.dropToGap) {
      // 放入目标节点内部
      moveData.destParentDepart = dropKey
      
      if (targetNode && targetNode.children && targetNode.children.length > 0) {
        const firstChild = targetNode.children[0]
        if (firstChild && firstChild.id !== dragKey) {
          moveData.departAfter = firstChild.id
        }
      }
    } else {
      // 放在目标节点的前面或后面
      if (targetNode) {
        moveData.destParentDepart = targetNode.parentId
        
        const parent = findParentNode(treeData.value, targetNode.id)
        const siblings = parent?.children || []
        const targetIndex = siblings.findIndex(s => s.id === targetNode.id)
        
        if (dropPosition === -1) {
          // 放在前面
          const prevSibling = targetIndex > 0 ? siblings[targetIndex - 1] : null
          
          moveData.departAfter = dropKey
          if (prevSibling && prevSibling.id !== dragKey) {
            moveData.departBefore = prevSibling.id
          }
        } else {
          // 放在后面
          const nextSibling = targetIndex < siblings.length - 1 ? siblings[targetIndex + 1] : null
          
          moveData.departBefore = dropKey
          if (nextSibling && nextSibling.id !== dragKey) {
            moveData.departAfter = nextSibling.id
          }
        }
      }
    }

    const response = await departmentApi.moveDepartment(moveData)
    
    if (response.code === 200) {
      message.success('移动成功')
      await refreshTree(true)
      emit('refresh')
    } else {
      message.error(response.message || '移动失败')
      await refreshTree(true)
    }
  } catch (error) {
    message.error('移动失败')
    await refreshTree(true)
  } finally {
    isMoving.value = false
  }
}

// ==================== 对外暴露 ====================
// 监听 orgId 变化，重新加载
watch(() => props.orgId, () => {
  if (props.orgId) {
    loadTree()
  }
}, { immediate: true })

// 对外暴露方法和数据
defineExpose({
  refreshTree,
  loadTree,
  treeData,
})
</script>

<style scoped>
.department-tree-wrapper {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
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
</style>

