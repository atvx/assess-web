import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import router from '@/router'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // API 基础路径
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      // token 已经包含了 tokenType (如 "Bearer token")，直接使用
      config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.error('Request error:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做些什么
    const res = response.data

    // 根据后端返回的状态码做统一处理
    if (res.code !== undefined && res.code !== 200) {
      // 根据不同的 code 进行不同的处理
      // 例如：code 401 表示未授权
      if (res.code === 401) {
        message.error('登录已过期，请重新登录')
        // 清除本地存储
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        // 跳转到登录页
        router.push('/login')
        return Promise.reject(new Error(res.message || '未授权'))
      }
    }

    return res
  },
  (error) => {
    // 对响应错误做些什么
    console.error('Response error:', error)

    let errorMessage = '请求失败，请稍后重试'

    // 处理不同的 HTTP 状态码
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除登录状态并跳转到登录页
          errorMessage = '登录已过期，请重新登录'
          message.error(errorMessage)
          // 清除本地存储
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          // 跳转到登录页
          router.push('/login')
          break
        case 403:
          errorMessage = '没有权限访问该资源'
          message.error(errorMessage)
          break
        case 404:
          errorMessage = '请求的资源不存在'
          message.error(errorMessage)
          break
        case 500:
          errorMessage = '服务器错误，请稍后重试'
          message.error(errorMessage)
          break
        case 502:
        case 503:
        case 504:
          errorMessage = '服务暂时不可用，请稍后重试'
          message.error(errorMessage)
          break
        default:
          errorMessage = error.response.data?.message || `连接错误: ${error.response.status}`
          message.error(errorMessage)
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      errorMessage = '网络连接异常，请检查网络设置'
      message.error(errorMessage)
    } else {
      // 在设置请求时发生了错误
      errorMessage = error.message || '请求配置错误'
      message.error(errorMessage)
    }

    return Promise.reject(error)
  },
)

// 封装常用请求方法
export const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  },
}

export default service
