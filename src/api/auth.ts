import { request } from '@/utils/request'

/**
 * 登录请求参数
 */
export interface LoginRequest {
  username: string
  password: string
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  token: string            // 访问令牌
  tokenType: string        // 令牌类型
  userId: string           // 用户ID (UUID)
  username: string         // 用户名
  realName: string         // 真实姓名
  orgId: string            // 组织ID (UUID)
  isAdmin: boolean         // 是否管理员
  permissions: string[]    // 权限集合
  roles: string[]          // 角色集合
}

/**
 * 通用响应格式
 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/**
 * 用户登录
 * @param data 登录信息
 * @returns Promise<LoginResponse>
 */
export function login(data: LoginRequest) {
  return request.post<ApiResponse<LoginResponse>>('/auth/login', data)
}

/**
 * 用户退出
 * @returns Promise<ApiResponse>
 */
export function logout() {
  return request.post<ApiResponse<Record<string, never>>>('/auth/logout')
}

/**
 * 获取当前用户信息
 * @returns Promise<LoginResponse>
 */
export function getCurrentUser() {
  return request.get<ApiResponse<LoginResponse>>('/auth/user')
}

/**
 * 修改密码请求参数
 */
export interface ChangePasswordRequest {
  userId: string       // 用户ID
  oldPassword: string  // 旧密码
  newPassword: string  // 新密码
}

/**
 * 修改密码
 * @param data 修改密码信息
 * @returns Promise<ApiResponse>
 */
export function changePassword(data: ChangePasswordRequest) {
  return request.post<ApiResponse<Record<string, never>>>('/auth/change-password', data)
}
