import { request } from '@/utils/request'
import type { ApiResponse, PageResult } from './user'

/**
 * 部门信息
 */
export interface Department {
  id: string
  name: string
  code: string
  orgId: string // 所属组织
  orgName?: string
  parentId?: string // 父级部门
  parentName?: string
  level: number // 层级
  sort: number // 排序
  leader?: string // 负责人
  leaderPhone?: string // 负责人电话
  email?: string // 邮箱
  phone?: string // 联系电话
  description?: string // 描述
  status: 'enabled' | 'disabled' // 状态
  userCount?: number // 用户数量
  children?: Department[] // 子部门
  createdAt: string
  updatedAt: string
}

/**
 * 部门查询条件
 */
export interface DepartmentQueryDTO {
  keyword?: string // 关键词
  orgId?: string // 组织ID
  status?: 'enabled' | 'disabled' // 状态
  parentId?: string // 父级ID
}

/**
 * 部门创建/更新 DTO
 */
export interface DepartmentFormDTO {
  id?: string
  name: string
  code: string
  orgId: string
  parentId?: string
  sort?: number
  leader?: string
  leaderPhone?: string
  email?: string
  phone?: string
  description?: string
  status?: 'enabled' | 'disabled'
}

/**
 * 部门 API
 */
export const departmentApi = {
  /**
   * 获取部门树
   */
  getDepartmentTree(params?: DepartmentQueryDTO): Promise<ApiResponse<Department[]>> {
    return request.get('/departments/tree', { params })
  },

  /**
   * 获取部门列表（平铺）
   */
  getDepartmentList(params?: DepartmentQueryDTO): Promise<ApiResponse<Department[]>> {
    return request.get('/departments', { params })
  },

  /**
   * 获取部门详情
   */
  getDepartmentById(id: string): Promise<ApiResponse<Department>> {
    return request.get(`/departments/${id}`)
  },

  /**
   * 创建部门
   */
  createDepartment(data: DepartmentFormDTO): Promise<ApiResponse<Department>> {
    return request.post('/departments', data)
  },

  /**
   * 更新部门
   */
  updateDepartment(data: DepartmentFormDTO): Promise<ApiResponse<Department>> {
    return request.put('/departments', data)
  },

  /**
   * 删除部门
   */
  deleteDepartment(id: string): Promise<ApiResponse<void>> {
    return request.delete(`/departments/${id}`)
  },

  /**
   * 启用/禁用部门
   */
  toggleDepartmentStatus(id: string, status: 'enabled' | 'disabled'): Promise<ApiResponse<void>> {
    return request.put(`/departments/${id}/status`, { status })
  },

  /**
   * 移动部门
   */
  moveDepartment(id: string, targetParentId?: string): Promise<ApiResponse<void>> {
    return request.put(`/departments/${id}/move`, { targetParentId })
  },

  /**
   * 获取部门下的用户列表
   */
  getDepartmentUsers(id: string, params?: any): Promise<ApiResponse<PageResult<any>>> {
    return request.get(`/departments/${id}/users`, { params })
  },
}

