<template>
  <div class="user-edit-page">
    <a-card class="rounded-lg shadow" :bordered="false">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <a-button type="text" @click="handleBack" class="mr-2">
              <template #icon>
                <ArrowLeftOutlined />
              </template>
            </a-button>
            <span class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ isEditMode ? '编辑用户' : '新增用户' }}
            </span>
          </div>
        </div>
      </template>

      <div class="max-w-3xl mx-auto">
        <a-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-form-item label="用户名" name="username">
            <a-input
              v-model:value="formData.username"
              placeholder="请输入用户名"
              :disabled="isEditMode"
            />
            <template v-if="isEditMode" #extra>
              <span class="text-gray-500">编辑模式下用户名不可修改</span>
            </template>
          </a-form-item>

          <a-form-item label="真实姓名" name="realName">
            <a-input v-model:value="formData.realName" placeholder="请输入真实姓名" />
          </a-form-item>

          <a-form-item label="邮箱" name="email">
            <a-input v-model:value="formData.email" placeholder="请输入邮箱" />
          </a-form-item>

          <a-form-item label="手机号" name="phone">
            <a-input v-model:value="formData.phone" placeholder="请输入手机号" />
          </a-form-item>

          <a-form-item v-if="!isEditMode" label="密码" name="password">
            <a-input-password
              v-model:value="formData.password"
              placeholder="请输入密码（6-20位）"
            />
          </a-form-item>

          <a-form-item label="状态" name="status">
            <a-radio-group v-model:value="formData.status">
              <a-radio value="enabled">
                <a-tag color="green">启用</a-tag>
              </a-radio>
              <a-radio value="disabled">
                <a-tag color="red">禁用</a-tag>
              </a-radio>
              <a-radio value="locked">
                <a-tag color="orange">锁定</a-tag>
              </a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item label="是否管理员" name="isAdmin">
            <a-switch v-model:checked="formData.isAdmin">
              <template #checkedChildren>是</template>
              <template #unCheckedChildren>否</template>
            </a-switch>
            <span class="ml-3 text-gray-500">
              {{ formData.isAdmin ? '管理员拥有系统管理权限' : '普通用户' }}
            </span>
          </a-form-item>

          <a-divider>组织信息</a-divider>

          <a-form-item label="组织ID" name="orgId">
            <a-input v-model:value="formData.orgId" placeholder="请输入组织ID" />
          </a-form-item>

          <a-form-item label="部门ID" name="deptId">
            <a-input v-model:value="formData.deptId" placeholder="请输入部门ID" />
          </a-form-item>

          <a-form-item :wrapper-col="{ span: 16, offset: 5 }">
            <a-space>
              <a-button type="primary" :loading="submitting" @click="handleSubmit">
                <template #icon>
                  <SaveOutlined />
                </template>
                {{ isEditMode ? '保存' : '创建' }}
              </a-button>
              <a-button @click="handleBack">
                取消
              </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  ArrowLeftOutlined,
  SaveOutlined,
} from '@ant-design/icons-vue'
import { userApi, type UserFormDTO } from '@/api/user'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'

const router = useRouter()
const route = useRoute()

// 表单相关
const formRef = ref<FormInstance>()
const submitting = ref(false)
const loading = ref(false)

// 判断是否为编辑模式
const isEditMode = computed(() => !!route.params.id)
const userId = computed(() => route.params.id as string)

// 表单数据
const formData = reactive<UserFormDTO>({
  username: '',
  realName: '',
  email: '',
  phone: '',
  password: '',
  orgId: '',
  deptId: '',
  status: 'enabled',
  isAdmin: false,
})

// 表单验证规则
const formRules: Record<string, Rule[]> = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' },
  ],
  realName: [
    { max: 50, message: '真实姓名长度不能超过 50 个字符', trigger: 'blur' },
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' },
  ],
}

// 加载用户数据（编辑模式）
const loadUserData = async () => {
  if (!isEditMode.value) return

  loading.value = true
  try {
    const response = await userApi.getUserById(userId.value)
    if (response.code === 200) {
      const userData = response.data
      Object.assign(formData, {
        id: userData.id,
        username: userData.username,
        realName: userData.realName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        orgId: userData.orgId || '',
        deptId: userData.deptId || '',
        status: userData.status,
        isAdmin: userData.isAdmin,
      })
    } else {
      message.error(response.message || '获取用户信息失败')
      handleBack()
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    message.error('获取用户信息失败')
    handleBack()
  } finally {
    loading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    
    const submitData: UserFormDTO = {
      username: formData.username,
      realName: formData.realName || undefined,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      orgId: formData.orgId || undefined,
      deptId: formData.deptId || undefined,
      status: formData.status,
      isAdmin: formData.isAdmin,
    }

    submitting.value = true

    if (isEditMode.value) {
      // 编辑模式
      submitData.id = formData.id
      const response = await userApi.updateUser(submitData)
      if (response.code === 200) {
        message.success('更新用户成功')
        handleBack()
      } else {
        message.error(response.message || '更新用户失败')
      }
    } else {
      // 新增模式
      submitData.password = formData.password
      const response = await userApi.createUser(submitData)
      if (response.code === 200) {
        message.success('创建用户成功')
        handleBack()
      } else {
        message.error(response.message || '创建用户失败')
      }
    }
  } catch (error: any) {
    console.error('表单验证失败或提交失败:', error)
    if (error?.errorFields) {
      // 表单验证失败
      message.error('请检查表单输入')
    } else {
      // 接口调用失败
      message.error(isEditMode.value ? '更新用户失败' : '创建用户失败')
    }
  } finally {
    submitting.value = false
  }
}

// 返回列表页
const handleBack = () => {
  router.push('/admin/system/user')
}

// 初始化
onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
/* 使用 Tailwind 类，无需自定义样式 */
</style>


