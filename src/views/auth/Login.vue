<template>
  <div
    class="login-page min-h-screen flex items-center justify-center px-4 theme-transition"
    style="background: var(--bg-secondary)"
  >
    <div class="login-container rounded-lg p-10 w-full max-w-md card-shadow theme-transition" style="background: var(--bg-primary)">
      <!-- Logo -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold mb-2 theme-transition" style="color: var(--text-primary)">
          智审云
        </h1>
        <p class="text-base theme-transition" style="color: var(--text-secondary)">
          后台管理系统登录
        </p>
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
      <div class="text-center mt-8">
        <router-link
          to="/"
          class="theme-transition hover:opacity-70 inline-flex items-center gap-2"
          style="color: var(--text-secondary)"
        >
          <span>←</span>
          <span>返回首页</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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

// 简单的编码/解码函数（Base64）
const encode = (str: string): string => {
  try {
    return btoa(encodeURIComponent(str))
  } catch {
    return ''
  }
}

const decode = (str: string): string => {
  try {
    return decodeURIComponent(atob(str))
  } catch {
    return ''
  }
}

// 保存登录信息
const saveLoginInfo = () => {
  if (formState.remember) {
    localStorage.setItem('remembered_username', formState.username)
    localStorage.setItem('remembered_password', encode(formState.password))
    localStorage.setItem('remember_me', 'true')
  } else {
    // 清除保存的信息
    localStorage.removeItem('remembered_username')
    localStorage.removeItem('remembered_password')
    localStorage.removeItem('remember_me')
  }
}

// 加载保存的登录信息
const loadLoginInfo = () => {
  const rememberMe = localStorage.getItem('remember_me') === 'true'
  if (rememberMe) {
    const username = localStorage.getItem('remembered_username')
    const password = localStorage.getItem('remembered_password')
    
    if (username) {
      formState.username = username
    }
    if (password) {
      formState.password = decode(password)
    }
    formState.remember = true
  }
}

// 登录处理
const handleLogin = async () => {
  loading.value = true

  try {
    // 调用登录接口
    const result = await userStore.login({
      username: formState.username,
      password: formState.password,
    })

    if (result.success) {
      // 保存或清除登录信息
      saveLoginInfo()
      
      // 登录成功，跳转到目标页面或后台首页
      const redirect = (route.query.redirect as string) || '/admin/dashboard'
      await router.push(redirect)
    }
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

// 页面加载时读取保存的登录信息
onMounted(() => {
  loadLoginInfo()
})
</script>

<style scoped></style>
