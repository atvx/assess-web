import { request } from '@/utils/request'
import type { ApiResponse, PageResult } from './user'

/**
 * 组织信息
 */
export interface Organization {
  id: string
  name: string // 组织名称
  code: string // 组织编码/统一社会信用代码
  type: string // 组织类型（使用字典：org_type）
  leader?: string // 负责人
  leaderPhone?: string // 负责人电话
  email?: string // 邮箱
  phone?: string // 联系电话
  province?: string // 省份
  city?: string // 城市
  district?: string // 区县
  address?: string // 详细地址
  scale?: string // 组织规模（使用字典：org_scale）
  industry?: string // 所属行业（使用字典：org_industry）
  description?: string // 描述
  status: 'enabled' | 'disabled' // 状态
  createdAt: string
  updatedAt: string
}

/**
 * 组织查询条件
 */
export interface OrganizationQueryDTO {
  keyword?: string // 关键词（名称、编码）
  type?: string // 组织类型（字典值）
  status?: 'enabled' | 'disabled' // 状态
  province?: string // 省份
  city?: string // 城市
  current?: number // 当前页码
  size?: number // 每页显示条数
}

/**
 * 组织创建/更新 DTO
 */
export interface OrganizationFormDTO {
  id?: string
  name: string
  code: string
  type: string // 组织类型（字典值）
  leader?: string
  leaderPhone?: string
  email?: string
  phone?: string
  province?: string
  city?: string
  district?: string
  address?: string
  scale?: string // 组织规模（字典值）
  industry?: string // 所属行业（字典值）
  description?: string
  status?: 'enabled' | 'disabled'
}

/**
 * 组织API
 */
export const organizationApi = {
  /**
   * 分页查询组织列表
   */
  getOrganizationList(
    params: OrganizationQueryDTO,
  ): Promise<ApiResponse<PageResult<Organization>>> {
    return request.get('/orgs', { params })
  },

  /**
   * 获取组织详情
   */
  getOrganizationById(id: string): Promise<ApiResponse<Organization>> {
    return request.get(`/orgs/${id}`)
  },

  /**
   * 创建组织
   */
  createOrganization(data: OrganizationFormDTO): Promise<ApiResponse<Organization>> {
    return request.post('/orgs', data)
  },

  /**
   * 更新组织
   */
  updateOrganization(data: OrganizationFormDTO): Promise<ApiResponse<Organization>> {
    return request.put('/orgs', data)
  },

  /**
   * 删除组织
   */
  deleteOrganization(id: string): Promise<ApiResponse<void>> {
    return request.delete(`/orgs/${id}`)
  },

  /**
   * 启用/禁用组织
   */
  toggleOrganizationStatus(
    id: string,
    status: 'enabled' | 'disabled',
  ): Promise<ApiResponse<void>> {
    return request.patch(`/orgs/${id}/status`, { status })
  },

  /**
   * 获取组织下的部门列表
   */
  getOrganizationDepartments(id: string): Promise<ApiResponse<any[]>> {
    return request.get(`/orgs/${id}/departments`)
  },

  /**
   * 获取组织下的用户列表
   */
  getOrganizationUsers(id: string, params?: any): Promise<ApiResponse<PageResult<any>>> {
    return request.get(`/orgs/${id}/users`, { params })
  },

  /**
   * 切换组织（仅管理员）
   */
  switchOrganization(orgId: string): Promise<
    ApiResponse<{
      token: string
      tokenType: string
      userId: string
      username: string
      realName: string
      orgId: string
      isAdmin: boolean
      permissions: string[]
      roles: string[]
    }>
  > {
    return request.patch('/admin/switch-org', { orgId })
  },
}

