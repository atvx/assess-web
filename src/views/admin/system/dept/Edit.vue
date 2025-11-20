<!-- 部门新增/编辑组件 -->
<template>
  <a-modal
    :open="visible"
    :title="formData.id ? '编辑部门' : '新增部门'"
    :width="700"
    :confirm-loading="loading"
    @ok="handleSubmit"
    @cancel="handleClose"
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
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import {
  departmentApi,
  type Department,
  type DepartmentFormDTO,
} from '@/api/department'

interface Props {
  visible: boolean
  department?: Department | null
  treeData: Department[]
  orgId: string
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = reactive<DepartmentFormDTO>({
  name: '',
  code: '',
  parentId: undefined,
  orgId: props.orgId,
  description: '',
  status: 'enabled',
})

const formRules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
}

// 上级部门树数据（排除自己和子孙节点）
const parentTreeData = computed(() => {
  if (!formData.id) {
    return props.treeData
  }
  // 编辑时需要排除自己和子孙节点
  return filterSelfAndDescendants(props.treeData, formData.id)
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

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: undefined,
    name: '',
    code: '',
    parentId: undefined,
    orgId: props.orgId,
    description: '',
    status: 'enabled',
  })
  formRef.value?.clearValidate()
}

// 监听部门数据变化，填充表单
watch(
  () => props.department,
  (dept) => {
    if (dept) {
      // 编辑模式
      Object.assign(formData, {
        id: dept.id,
        name: dept.name,
        code: dept.code,
        parentId: dept.parentId || props.orgId,
        orgId: dept.orgId,
        description: dept.description,
        status: dept.status,
      })
    } else {
      // 新增模式
      resetForm()
    }
  },
  { immediate: true }
)

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    const api = formData.id
      ? departmentApi.updateDepartment
      : departmentApi.createDepartment

    const response = await api(formData)

    if (response.code === 200) {
      message.success(formData.id ? '更新成功' : '创建成功')
      emit('success')
      handleClose()
    } else {
      message.error(response.message || '操作失败')
    }
  } finally {
    loading.value = false
  }
}

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
  formRef.value?.resetFields()
}
</script>

