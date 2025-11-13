import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as loginApi, logout as logoutApi, type LoginRequest } from '@/api/auth'
import { message } from 'ant-design-vue'

export interface UserInfo {
  id: string              // 用户ID
  username: string        // 用户名
  realName: string        // 真实姓名
  orgId: string           // 组织ID
  isAdmin: boolean        // 是否管理员
  permissions: string[]   // 权限集合
  roles: string[]         // 角色集合
  email?: string          // 邮箱（扩展字段）
  avatar?: string         // 头像（扩展字段）
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)
  const loading = ref(false)

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => userInfo.value?.username || '')
  const realName = computed(() => userInfo.value?.realName || '')
  const isAdmin = computed(() => userInfo.value?.isAdmin || false)

  // 设置登录状态（内部使用）
  const setLoginState = (loginToken: string, user: UserInfo) => {
    token.value = loginToken
    userInfo.value = user
    localStorage.setItem('token', loginToken)
    localStorage.setItem('userInfo', JSON.stringify(user))
  }

  // 清除登录状态（内部使用）
  const clearLoginState = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  // 登录
  const login = async (loginData: LoginRequest) => {
    loading.value = true
    try {
      const response = await loginApi(loginData)

      if (response.code === 200) {
        const {
          token,
          tokenType,
          userId,
          username,
          realName,
          orgId,
          isAdmin,
          permissions,
          roles
        } = response.data

        // 构建用户信息
        const user: UserInfo = {
          id: userId,
          username: username,
          realName: realName,
          orgId: orgId,
          isAdmin: isAdmin,
          permissions: permissions || [],
          roles: roles || [],
        }

        // 保存登录状态（保存完整的token，包含tokenType）
        const fullToken = tokenType ? `${tokenType} ${token}` : token
        setLoginState(fullToken, user)

        message.success('登录成功')
        return { success: true, data: response.data }
      } else {
        message.error(response.message || '登录失败')
        return { success: false, message: response.message }
      }
    } catch (error: unknown) {
      console.error('Login error:', error)
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      const errorMsg = err.response?.data?.message || err.message || '登录失败，请稍后重试'
      message.error(errorMsg)
      return { success: false, message: errorMsg }
    } finally {
      loading.value = false
    }
  }

  // 退出登录
  const logout = async () => {
    loading.value = true
    try {
      const response = await logoutApi()
      if (response.code === 200) {
        message.success('退出成功')
      } else {
        message.warning('退出登录')
      }
    } catch (error: unknown) {
      console.error('Logout error:', error)
      message.warning('已退出登录')
    } finally {
      // 清除登录状态
      clearLoginState()
      loading.value = false
    }
  }

  // 设置用户信息
  const setUserInfo = (user: UserInfo) => {
    userInfo.value = user
    localStorage.setItem('userInfo', JSON.stringify(user))
  }

  // 初始化用户信息（从本地存储恢复）
  const initUserInfo = () => {
    const storedUserInfo = localStorage.getItem('userInfo')
    if (storedUserInfo) {
      try {
        userInfo.value = JSON.parse(storedUserInfo)
      } catch (error) {
        console.error('Failed to parse user info:', error)
        logout()
      }
    }
  }

  // 初始化
  if (token.value) {
    initUserInfo()
  }

  return {
    token,
    userInfo,
    loading,
    isLoggedIn,
    username,
    realName,
    isAdmin,
    login,
    logout,
    setUserInfo,
    initUserInfo,
    setLoginState,
    clearLoginState,
  }
})
