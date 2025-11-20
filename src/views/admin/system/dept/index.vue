<!-- eslint-disable vue/multi-word-component-names -->
<!-- 部门管理主页面 -->
<template>
  <div class="department-page h-full">
    <a-row :gutter="16" class="h-full">
      <!-- 左侧：部门树 -->
      <a-col :xs="24" :sm="24" :md="8" :lg="7" :xl="6">
        <DepartmentTree
          ref="treeRef"
          :org-id="currentOrgId"
          @select="handleTreeSelect"
          @add="handleAddChild"
          @edit="handleEdit"
          @delete="handleDelete"
          @refresh="handleTreeRefresh"
        />
      </a-col>

      <!-- 右侧：部门列表 -->
      <a-col :xs="24" :sm="24" :md="16" :lg="17" :xl="18">
        <DepartmentTable
          ref="tableRef"
          :org-id="currentOrgId"
          :selected-department-id="selectedDepartmentId"
          :selected-department-name="selectedDepartmentName"
          @edit="handleEdit"
          @delete="handleDelete"
          @refresh="handleTableRefresh"
        />
      </a-col>
    </a-row>

    <!-- 新增/编辑部门弹窗 -->
    <DepartmentEdit
      v-model:visible="formModalVisible"
      :department="editDepartment"
      :tree-data="treeData"
      :org-id="currentOrgId"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import type { Department } from '@/api/department'
import DepartmentTree from './Tree.vue'
import DepartmentTable from './Table.vue'
import DepartmentEdit from './Edit.vue'

// ==================== 用户信息 ====================
const userStore = useUserStore()
const currentOrgId = computed(() => userStore.userInfo?.orgId || '')

// ==================== 组件引用 ====================
const treeRef = ref<InstanceType<typeof DepartmentTree>>()
const tableRef = ref<InstanceType<typeof DepartmentTable>>()

// ==================== 状态 ====================
const selectedDepartmentId = ref<string | undefined>(undefined)
const selectedDepartmentName = ref<string | undefined>(undefined)
const formModalVisible = ref(false)
const editDepartment = ref<Department | null>(null)
const treeData = ref<Department[]>([])

// ==================== 事件处理 ====================
// 树节点选择
const handleTreeSelect = (department: Department | null) => {
  if (department) {
    selectedDepartmentId.value = department.id
    selectedDepartmentName.value = department.name
  } else {
    selectedDepartmentId.value = undefined
    selectedDepartmentName.value = undefined
  }
}

// 添加子部门
const handleAddChild = (parentDepartment: Department) => {
  editDepartment.value = {
    parentId: parentDepartment.id,
    orgId: currentOrgId.value,
    status: 'enabled',
  } as Department
  formModalVisible.value = true
}

// 编辑部门
const handleEdit = (department: Department) => {
  editDepartment.value = department
  formModalVisible.value = true
}

// 删除部门（由子组件处理）
const handleDelete = (department: Department) => {
  // 子组件已经处理了删除逻辑，这里不需要额外操作
}

// 树刷新回调
const handleTreeRefresh = () => {
  // 树刷新时，同步更新 treeData 供 Edit 组件使用
  if (treeRef.value && treeRef.value.treeData) {
    treeData.value = treeRef.value.treeData
  }
}

// 表格刷新回调
const handleTableRefresh = () => {
  // 表格刷新时，同时刷新树
  treeRef.value?.refreshTree(true)
}

// 编辑成功回调
const handleEditSuccess = () => {
  // 刷新树和表格
  treeRef.value?.refreshTree(true)
  tableRef.value?.loadList()
  
  // 同步更新 treeData
  handleTreeRefresh()
}
</script>

<style scoped>
.department-page {
  padding: 16px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .department-page {
    padding: 8px;
  }
}
</style>

