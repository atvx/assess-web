import { request } from '@/utils/request'

/**
 * 用户查询条件
 */
export interface UserQueryDTO {
  keyword?: string // 关键词
  orgId?: string // 组织ID
  deptId?: string // 部门ID
  status?: 'enabled' | 'disabled' | 'locked' // 状态
  isAdmin?: boolean // 是否管理员
  current?: number // 当前页码
  size?: number // 每页显示条数
}

/**
 * 用户信息
 */
export interface User {
  id: string
  username: string
  realName?: string
  email?: string
  phone?: string
  avatar?: string
  orgId?: string
  orgName?: string
  deptId?: string
  deptName?: string
  status: 'enabled' | 'disabled' | 'locked'
  isAdmin: boolean
  createdAt: string
  updatedAt: string
}

/**
 * 分页响应
 */
export interface PageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

/**
 * API 响应
 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/**
 * 用户创建/更新 DTO
 */
export interface UserFormDTO {
  id?: string
  username: string
  realName?: string
  email?: string
  phone?: string
  password?: string
  orgId?: string
  deptId?: string
  status?: 'enabled' | 'disabled' | 'locked'
  isAdmin?: boolean
}

/**
 * 用户 API
 */
export const userApi = {
  /**
   * 分页查询用户列表
   */
  getUserList(params: UserQueryDTO): Promise<ApiResponse<PageResult<User>>> {
    return request.get('/users', { params })
  },

  /**
   * 获取用户详情
   */
  getUserById(id: string): Promise<ApiResponse<User>> {
    return request.get(`/users/${id}`)
  },

  /**
   * 创建用户
   */
  createUser(data: UserFormDTO): Promise<ApiResponse<User>> {
    return request.post('/users', data)
  },

  /**
   * 更新用户
   */
  updateUser(data: UserFormDTO): Promise<ApiResponse<User>> {
    return request.put('/users', data)
  },

  /**
   * 删除用户
   */
  deleteUser(id: string): Promise<ApiResponse<void>> {
    return request.delete(`/users/${id}`)
  },

  /**
   * 启用/禁用用户
   */
  toggleUserStatus(id: string, status: 'enabled' | 'disabled'): Promise<ApiResponse<void>> {
    return request.put(`/users/${id}/status`, { status })
  },

  /**
   * 重置用户密码
   */
  resetPassword(id: string): Promise<ApiResponse<{ password: string }>> {
    return request.post(`/users/${id}/reset-password`)
  },
}

