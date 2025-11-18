import { request } from '@/utils/request'
import type { ApiResponse, PageResult } from './user'

/**
 * 部门信息
 */
export interface Department {
  id: string
  orgId: string // 所属组织ID
  code?: string // 部门编码
  name: string // 部门名称
  parentId?: string // 父部门ID
  description?: string // 部门描述
  status: 'enabled' | 'disabled' // 状态
  sort: number // 排序
  isDeleted?: boolean // 是否删除
  createdAt: string // 创建时间
  updatedAt: string // 更新时间
  createdBy?: string // 创建人
  updatedBy?: string // 更新人
  // 树形结构需要的字段
  children?: Department[]
  parentName?: string // 父部门名称
  orgName?: string // 所属组织名称
  level?: number // 层级
}

/**
 * 部门查询条件
 */
export interface DepartmentQueryDTO {
  keyword?: string // 关键词（名称、编码）
  orgId?: string // 组织ID
  parentId?: string // 父部门ID
  status?: 'enabled' | 'disabled' // 状态
  current?: number // 当前页码
  size?: number // 每页显示条数
}

/**
 * 部门创建/更新 DTO
 */
export interface DepartmentFormDTO {
  id?: string
  orgId: string
  code?: string
  name: string
  parentId?: string
  description?: string
  status?: 'enabled' | 'disabled'
  sort?: number
}

/**
 * 部门移动 DTO
 */
export interface DepartmentMoveDTO {
  departToMove: string // 要移动的部门ID
  destParentDepart?: string // 目标父部门ID
  departBefore?: string // 移动到此部门之前
  departAfter?: string // 移动到此部门之后
}

/**
 * 部门导入数据
 */
export interface DepartmentImportDTO {
  name: string
  code?: string
  parentCode?: string
  description?: string
  status?: string
  sort?: number
}

/**
 * 部门API
 */
export const departmentApi = {
  /**
   * 获取部门树形列表
   */
  getDepartmentTree(orgId?: string): Promise<ApiResponse<Department[]>> {
    return request.get('/depts/tree', { params: { orgId } })
  },

  /**
   * 刷新部门树形列表
   */
  refreshDepartmentTree(orgId?: string): Promise<ApiResponse<Department[]>> {
    return request.post('/depts/tree/refresh', { orgId })
  },

  /**
   * 分页查询部门列表
   */
  getDepartmentList(
    params: DepartmentQueryDTO,
  ): Promise<ApiResponse<PageResult<Department>>> {
    return request.get('/depts', { params })
  },

  /**
   * 获取部门详情
   */
  getDepartmentById(id: string): Promise<ApiResponse<Department>> {
    return request.get(`/depts/${id}`)
  },

  /**
   * 创建部门
   */
  createDepartment(data: DepartmentFormDTO): Promise<ApiResponse<Department>> {
    return request.post('/depts', data)
  },

  /**
   * 更新部门
   */
  updateDepartment(data: DepartmentFormDTO): Promise<ApiResponse<Department>> {
    return request.put('/depts', data)
  },

  /**
   * 删除部门
   */
  deleteDepartment(id: string): Promise<ApiResponse<void>> {
    return request.delete(`/depts/${id}`)
  },

  /**
   * 启用/禁用部门
   */
  toggleDepartmentStatus(
    id: string,
    status: 'enabled' | 'disabled',
  ): Promise<ApiResponse<void>> {
    return request.patch(`/depts/${id}/status`, { status })
  },

  /**
   * 移动部门（排序）
   * @param data.departToMove 要移动的部门ID
   * @param data.destParentDepart 目标父部门ID（可选）
   * @param data.departBefore 移动到此部门之前（可选）
   * @param data.departAfter 移动到此部门之后（可选）
   */
  moveDepartment(data: DepartmentMoveDTO): Promise<ApiResponse<void>> {
    return request.post('/depts/move', data)
  },

  /**
   * 导出部门列表
   */
  exportDepartments(params?: DepartmentQueryDTO): Promise<Blob> {
    return request.get('/depts/export', {
      params,
      responseType: 'blob',
    })
  },

  /**
   * 下载导入模板
   */
  downloadTemplate(): Promise<Blob> {
    return request.get('/depts/template', {
      responseType: 'blob',
    })
  },

  /**
   * 导入部门
   */
  importDepartments(file: File): Promise<ApiResponse<{ success: number; fail: number }>> {
    const formData = new FormData()
    formData.append('file', file)
    return request.post('/depts/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

