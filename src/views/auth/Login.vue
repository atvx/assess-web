<template>
  <div
    class="login-page min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
  >
    <div class="login-container bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">智审云</h1>
        <p class="text-gray-500">后台管理系统登录</p>
      </div>

      <!-- 登录表单 -->
      <a-form :model="formState" :rules="rules" @finish="handleLogin">
        <a-form-item name="username">
          <a-input v-model:value="formState.username" size="large" placeholder="用户名">
            <template #prefix>
              <UserOutlined class="text-gray-400" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item name="password">
          <a-input-password v-model:value="formState.password" size="large" placeholder="密码">
            <template #prefix>
              <LockOutlined class="text-gray-400" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <div class="flex items-center justify-between">
            <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
            <a href="#" class="text-blue-600 hover:text-blue-700">忘记密码?</a>
          </div>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="loading"
            class="w-full"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>

      <!-- 返回首页 -->
      <div class="text-center mt-6">
        <router-link to="/" class="text-gray-500 hover:text-blue-600"> 返回首页 </router-link>
      </div>

      <!-- 演示提示 -->
      <a-alert
        message="演示账号"
        description="用户名: admin / 密码: 任意密码"
        type="info"
        show-icon
        class="mt-4"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)
const formState = reactive({
  username: '',
  password: '',
  remember: true,
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

// 登录处理（演示版本，实际应该调用后端接口）
const handleLogin = async () => {
  loading.value = true

  try {
    // 模拟登录请求延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 演示：直接通过，实际应该调用 API
    if (formState.username) {
      // 生成模拟 token
      const mockToken = 'mock_token_' + Date.now()

      // 模拟用户信息
      const mockUser = {
        id: 1,
        username: formState.username,
        email: `${formState.username}@example.com`,
        role: 'admin',
      }

      // 保存登录状态
      userStore.login(mockToken, mockUser)

      message.success('登录成功')

      // 跳转到目标页面或后台首页
      const redirect = (route.query.redirect as string) || '/admin/dashboard'
      router.push(redirect)
    } else {
      message.error('登录失败')
    }
  } catch (error) {
    console.error('Login error:', error)
    message.error('登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  background-image: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(99,102,241,0.05)" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)" /></svg>');
}
</style>
