<!-- eslint-disable vue/multi-word-component-names -->
<!-- 角色新增/编辑组件 -->
<template>
  <a-modal
    :open="visible"
    :title="formData.id ? '编辑角色' : '新增角色'"
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
      <a-divider orientation="left">基本信息</a-divider>
      <a-form-item label="角色名称" name="roleName">
        <a-input v-model:value="formData.roleName" placeholder="请输入角色名称" />
      </a-form-item>
      <a-form-item label="角色编码" name="roleCode">
        <a-input v-model:value="formData.roleCode" placeholder="请输入角色编码" />
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-radio-group v-model:value="formData.status">
          <a-radio value="enabled">启用</a-radio>
          <a-radio value="disabled">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="是否评审角色" name="isReviewer">
        <a-switch v-model:checked="formData.isReviewer" />
      </a-form-item>
      <a-form-item label="角色描述" name="description">
        <a-textarea
          v-model:value="formData.description"
          placeholder="请输入角色描述"
          :rows="3"
          :maxlength="200"
          show-count
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { roleApi, type Role, type RoleCreateDTO, type RoleUpdateDTO } from '@/api/role'

interface Props {
  visible: boolean
  role?: Role | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = reactive<RoleCreateDTO & { id?: string }>({
  roleName: '',
  roleCode: '',
  description: '',
  isReviewer: false,
  status: 'enabled',
})

const formRules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: undefined,
    roleName: '',
    roleCode: '',
    description: '',
    isReviewer: false,
    status: 'enabled',
  })
  formRef.value?.clearValidate()
}

// 监听角色数据变化，填充表单
watch(
  () => props.role,
  (role) => {
    if (role) {
      // 编辑模式
      Object.assign(formData, {
        id: role.id,
        roleName: role.roleName,
        roleCode: role.roleCode,
        description: role.description,
        isReviewer: role.isReviewer,
        status: role.status,
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

    if (formData.id) {
      // 更新角色
      const updateData: RoleUpdateDTO = {
        id: formData.id,
        roleName: formData.roleName,
        roleCode: formData.roleCode,
        description: formData.description,
        isReviewer: formData.isReviewer,
        status: formData.status,
      }
      const response = await roleApi.updateRole(updateData)
      if (response.code === 200) {
        message.success('更新成功')
        emit('success')
        handleClose()
      } else {
        message.error(response.message || '更新失败')
      }
    } else {
      // 创建角色
      const createData: RoleCreateDTO = {
        roleName: formData.roleName,
        roleCode: formData.roleCode,
        description: formData.description,
        isReviewer: formData.isReviewer,
        status: formData.status,
      }
      const response = await roleApi.createRole(createData)
      if (response.code === 200) {
        message.success('创建成功')
        emit('success')
        handleClose()
      } else {
        message.error(response.message || '创建失败')
      }
    }
  } catch (error) {
    console.error('表单验证失败:', error)
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
