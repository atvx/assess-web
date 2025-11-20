import { request } from '@/utils/request'
import type { ApiResponse, PageResult } from './user'

/**
 * 角色信息
 */
export interface Role {
  id: string
  roleName: string
  roleCode: string
  description?: string
  isReviewer: boolean
  status: 'enabled' | 'disabled'
  orgId: string
  createdAt: string
  updatedAt: string
}

/**
 * 角色查询条件
 */
export interface RoleQueryDTO {
  roleName?: string // 角色名称(模糊查询)
  roleCode?: string // 角色编码(模糊查询)
  status?: 'enabled' | 'disabled' // 状态
  isReviewer?: boolean // 是否评审角色
  current?: number // 当前页码
  size?: number // 每页显示条数
}

/**
 * 角色创建 DTO
 */
export interface RoleCreateDTO {
  roleName: string
  roleCode: string
  description?: string
  isReviewer?: boolean
  status?: 'enabled' | 'disabled'
}

/**
 * 角色更新 DTO
 */
export interface RoleUpdateDTO {
  id: string
  roleName?: string
  roleCode?: string
  description?: string
  isReviewer?: boolean
  status?: 'enabled' | 'disabled'
}

/**
 * 角色 API
 */
export const roleApi = {
  /**
   * 分页查询角色列表
   */
  getRoleList(params: RoleQueryDTO): Promise<ApiResponse<PageResult<Role>>> {
    return request.get('/roles', { params })
  },

  /**
   * 根据ID查询角色
   */
  getRoleById(id: string): Promise<ApiResponse<Role>> {
    return request.get(`/roles/${id}`)
  },

  /**
   * 创建角色
   */
  createRole(data: RoleCreateDTO): Promise<ApiResponse<string>> {
    return request.post('/roles', data)
  },

  /**
   * 更新角色
   */
  updateRole(data: RoleUpdateDTO): Promise<ApiResponse<void>> {
    return request.put('/roles', data)
  },

  /**
   * 删除角色
   */
  deleteRole(id: string): Promise<ApiResponse<void>> {
    return request.delete(`/roles/${id}`)
  },
}
