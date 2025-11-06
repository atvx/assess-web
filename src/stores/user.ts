import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface UserInfo {
  id: string | number
  username: string
  email?: string
  avatar?: string
  role?: string
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => userInfo.value?.username || '')
  const isAdmin = computed(() => userInfo.value?.role === 'admin')

  // 登录
  const login = (loginToken: string, user: UserInfo) => {
    token.value = loginToken
    userInfo.value = user
    localStorage.setItem('token', loginToken)
    localStorage.setItem('userInfo', JSON.stringify(user))
  }

  // 退出登录
  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
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
    isLoggedIn,
    username,
    isAdmin,
    login,
    logout,
    setUserInfo,
    initUserInfo,
  }
})
