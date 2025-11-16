import { request } from '@/utils/request'

/**
 * 字典管理 API
 */

// ============ 类型定义 ============

/** API 响应包装类型 */
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

/** 字典分类 */
export interface DictCategory {
  id: string
  name: string
  code: string
  description?: string
  sort: number
  status?: 'enabled' | 'disabled'
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
  remark?: string
}

/** 字典分类表单 */
export interface DictCategoryForm {
  id?: string
  name: string
  code: string
  description?: string
  sort: number
  status?: 'enabled' | 'disabled'
  remark?: string
}

/** 字典项 */
export interface DictItem {
  id: string
  categoryId: string
  label: string
  value: string
  tagType?: string
  sort: number
  status: 'enabled' | 'disabled'
  isDefault?: boolean
  extraData?: Record<string, unknown>
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
  remark?: string
}

/** 字典项表单 */
export interface DictItemForm {
  id?: string
  categoryId: string
  label: string
  value: string
  tagType?: string
  sort: number
  status: 'enabled' | 'disabled'
  isDefault?: boolean
  extraData?: Record<string, unknown>
  remark?: string
}

/** 分页查询参数 */
export interface PageParams {
  page: number
  pageSize: number
  keyword?: string
  status?: string
  [key: string]: unknown
}

/** 分页响应 */
export interface PageResponse<T> {
  records: T[]
  total: number
  page: number
  pageSize: number
}

// ============ 字典分类接口 ============

/**
 * 分页查询字典分类
 */
export function getDictCategoryPage(params: PageParams): Promise<ApiResponse<PageResponse<DictCategory>>> {
  return request.get('/dict/category/page', { params })
}

/**
 * 列表查询字典分类
 */
export function getDictCategoryList(params?: {
  keyword?: string
  status?: string
}): Promise<ApiResponse<DictCategory[]>> {
  return request.get('/dict/category/list', { params })
}

/**
 * 根据 ID 查询字典分类
 */
export function getDictCategoryById(id: string): Promise<ApiResponse<DictCategory>> {
  return request.get(`/dict/category/${id}`)
}

/**
 * 根据编码查询字典分类
 */
export function getDictCategoryByCode(code: string): Promise<ApiResponse<DictCategory>> {
  return request.get(`/dict/category/code/${code}`)
}

/**
 * 创建字典分类
 */
export function createDictCategory(data: DictCategoryForm): Promise<ApiResponse<DictCategory>> {
  return request.post('/dict/category', data)
}

/**
 * 更新字典分类
 */
export function updateDictCategory(data: DictCategoryForm): Promise<ApiResponse<DictCategory>> {
  return request.put('/dict/category', data)
}

/**
 * 删除字典分类
 */
export function deleteDictCategory(id: string): Promise<ApiResponse<void>> {
  return request.delete(`/dict/category/${id}`)
}

/**
 * 批量删除字典分类
 */
export function batchDeleteDictCategory(ids: string[]): Promise<ApiResponse<void>> {
  return request.delete('/dict/category/batch', { data: ids })
}

// ============ 字典项接口 ============

/**
 * 分页查询字典项
 */
export function getDictItemPage(params: PageParams & { categoryId?: string }): Promise<ApiResponse<PageResponse<DictItem>>> {
  return request.get('/dict/item/page', { params })
}

/**
 * 列表查询字典项
 */
export function getDictItemList(params?: {
  categoryId?: string
  keyword?: string
  status?: string
}): Promise<ApiResponse<DictItem[]>> {
  return request.get('/dict/item/list', { params })
}

/**
 * 根据分类编码查询字典项
 */
export function getDictItemByCategoryCode(categoryCode: string, params?: {
  status?: string
}): Promise<ApiResponse<DictItem[]>> {
  return request.get(`/dict/item/category/${categoryCode}`, { params })
}

/**
 * 根据 ID 查询字典项
 */
export function getDictItemById(id: string): Promise<ApiResponse<DictItem>> {
  return request.get(`/dict/item/${id}`)
}

/**
 * 创建字典项
 */
export function createDictItem(data: DictItemForm): Promise<ApiResponse<DictItem>> {
  return request.post('/dict/item', data)
}

/**
 * 更新字典项
 */
export function updateDictItem(data: DictItemForm): Promise<ApiResponse<DictItem>> {
  return request.put('/dict/item', data)
}

/**
 * 删除字典项
 */
export function deleteDictItem(id: string): Promise<ApiResponse<void>> {
  return request.delete(`/dict/item/${id}`)
}

/**
 * 批量删除字典项
 */
export function batchDeleteDictItem(ids: string[]): Promise<ApiResponse<void>> {
  return request.delete('/dict/item/batch', { data: ids })
}

