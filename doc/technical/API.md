# API 接口文档

本文档说明前端与后端的接口规范和数据结构。

## 📋 目录

- [接口规范](#接口规范)
- [认证接口](#认证接口)
- [用户管理](#用户管理)
- [组织管理](#组织管理)
- [部门管理](#部门管理)
- [字典管理](#字典管理)
- [评审管理](#评审管理)

## 接口规范

### 基础配置

**Base URL**: 通过环境变量配置

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 请求格式

#### Headers

```
Content-Type: application/json
Authorization: Bearer {token}
```

#### 通用参数

分页查询参数：

```typescript
interface PageQuery {
  page?: number      // 页码，从 1 开始
  size?: number      // 每页数量，默认 20
  keyword?: string   // 搜索关键词
}
```

### 响应格式

#### 成功响应

```typescript
interface ApiResponse<T> {
  code: number      // 状态码，200 表示成功
  message: string   // 提示信息
  data: T          // 响应数据
}
```

#### 分页响应

```typescript
interface PageResponse<T> {
  code: number
  message: string
  data: {
    list: T[]         // 数据列表
    total: number     // 总数
    page: number      // 当前页码
    size: number      // 每页数量
    totalPages: number // 总页数
  }
}
```

#### 错误响应

```typescript
interface ErrorResponse {
  code: number      // 错误码
  message: string   // 错误信息
  details?: any    // 详细错误信息
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 认证接口

### 登录

**接口**: `POST /auth/login`

**请求**:
```typescript
{
  username: string   // 用户名
  password: string   // 密码
}
```

**响应**:
```typescript
{
  code: 200,
  message: "登录成功",
  data: {
    token: string      // JWT Token
    user: {
      id: string
      username: string
      name: string
      email?: string
      avatar?: string
      roles: string[]
    }
  }
}
```

### 登出

**接口**: `POST /auth/logout`

**响应**:
```typescript
{
  code: 200,
  message: "登出成功",
  data: null
}
```

### 获取用户信息

**接口**: `GET /auth/me`

**响应**:
```typescript
{
  code: 200,
  message: "成功",
  data: {
    id: string
    username: string
    name: string
    email?: string
    avatar?: string
    roles: string[]
    permissions: string[]
  }
}
```

---

## 用户管理

### 用户数据结构

```typescript
interface User {
  id: string
  username: string
  name: string
  email?: string
  phone?: string
  avatar?: string
  organizationId?: string
  organizationName?: string
  departmentId?: string
  departmentName?: string
  roles: Role[]
  status: 'enabled' | 'disabled'
  createdAt: string
  updatedAt: string
}
```

### 获取用户列表

**接口**: `GET /users`

**查询参数**:
```typescript
{
  page?: number
  size?: number
  keyword?: string
  status?: 'enabled' | 'disabled'
  organizationId?: string
  departmentId?: string
}
```

**响应**: 分页响应，`data` 为 `User[]`

### 创建用户

**接口**: `POST /users`

**请求**:
```typescript
{
  username: string
  password: string
  name: string
  email?: string
  phone?: string
  organizationId?: string
  departmentId?: string
  roleIds: string[]
  status: 'enabled' | 'disabled'
}
```

**响应**: 创建的用户信息

### 更新用户

**接口**: `PUT /users/:id`

**请求**: 同创建用户（password 可选）

**响应**: 更新后的用户信息

### 删除用户

**接口**: `DELETE /users/:id`

**响应**: 成功消息

---

## 组织管理

### 组织数据结构

```typescript
interface Organization {
  id: string
  name: string
  code: string
  type: string              // 组织类型（字典：org_type）
  typeText?: string         // 类型显示文本
  leader?: string
  leaderPhone?: string
  email?: string
  phone?: string
  province?: string
  city?: string            // 直辖市为空字符串 ""
  district?: string
  address?: string
  scale?: string           // 组织规模（字典：org_scale）
  scaleText?: string
  industry?: string        // 所属行业（字典：org_industry）
  industryText?: string
  description?: string
  status: 'enabled' | 'disabled'
  userCount?: number
  deptCount?: number
  activityCount?: number
  createdAt: string
  updatedAt: string
}
```

### 获取组织列表

**接口**: `GET /organizations`

**查询参数**:
```typescript
{
  page?: number
  size?: number
  keyword?: string
  type?: string
  status?: 'enabled' | 'disabled'
}
```

**响应**: 分页响应，`data` 为 `Organization[]`

### 创建组织

**接口**: `POST /organizations`

**请求**:
```typescript
{
  name: string
  code: string
  type: string
  leader?: string
  leaderPhone?: string
  email?: string
  phone?: string
  province?: string
  city?: string
  district?: string
  address?: string
  scale?: string
  industry?: string
  description?: string
  status: 'enabled' | 'disabled'
}
```

**响应**: 创建的组织信息

### 更新/删除组织

同用户管理接口模式

---

## 部门管理

### 部门数据结构

```typescript
interface Department {
  id: string
  name: string
  code?: string
  parentId?: string
  organizationId: string
  organizationName?: string
  leader?: string
  leaderPhone?: string
  sort?: number
  description?: string
  status: 'enabled' | 'disabled'
  children?: Department[]
  createdAt: string
  updatedAt: string
}
```

### 获取部门树

**接口**: `GET /departments/tree`

**查询参数**:
```typescript
{
  organizationId?: string
}
```

**响应**: 树形结构的部门列表

### 创建/更新/删除部门

接口模式同上

---

## 字典管理

### 字典数据结构

```typescript
interface DictType {
  id: string
  code: string
  name: string
  description?: string
  sort?: number
  status: 'enabled' | 'disabled'
  createdAt: string
  updatedAt: string
}

interface DictItem {
  id: string
  dictCode: string
  label: string
  value: string
  tagType?: string
  description?: string
  sort?: number
  status: 'enabled' | 'disabled'
  createdAt: string
  updatedAt: string
}
```

### 获取字典项

**接口**: `GET /dict/:code`

**响应**: 字典项列表

```typescript
{
  code: 200,
  message: "成功",
  data: DictItem[]
}
```

---

## 评审管理

### 活动数据结构

```typescript
interface Activity {
  id: string
  title: string
  type: string
  organizationId: string
  status: 'draft' | 'reviewing' | 'completed' | 'cancelled'
  startDate: string
  endDate: string
  description?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}
```

### 评审规则数据结构

```typescript
interface ReviewRule {
  id: string
  name: string
  activityId: string
  scoreConfig: {
    total: number
    items: Array<{
      name: string
      score: number
      weight?: number
    }>
  }
  createdAt: string
  updatedAt: string
}
```

### 接口列表

- `GET /activities` - 获取活动列表
- `POST /activities` - 创建活动
- `PUT /activities/:id` - 更新活动
- `DELETE /activities/:id` - 删除活动
- `GET /review-rules` - 获取评审规则
- `POST /review-rules` - 创建评审规则

---

## Axios 封装

### 请求拦截器

```typescript
// src/utils/request.ts
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

// 请求拦截
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 统一错误处理
    if (error.response?.status === 401) {
      // 跳转登录
    }
    return Promise.reject(error)
  }
)

export default request
```

### API 封装示例

```typescript
// src/api/user.ts
import request from '@/utils/request'

export interface User {
  id: string
  username: string
  name: string
  // ...
}

// 获取用户列表
export function getUserList(params: any) {
  return request.get<PageResponse<User>>('/users', { params })
}

// 创建用户
export function createUser(data: any) {
  return request.post<User>('/users', data)
}

// 更新用户
export function updateUser(id: string, data: any) {
  return request.put<User>(`/users/${id}`, data)
}

// 删除用户
export function deleteUser(id: string) {
  return request.delete(`/users/${id}`)
}
```

---

## 调用示例

### 在组件中使用

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserList, type User } from '@/api/user'
import { message } from 'ant-design-vue'

const users = ref<User[]>([])
const loading = ref(false)

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await getUserList({ page: 1, size: 20 })
    users.value = res.data.list
  } catch (error) {
    message.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
```

---

## 注意事项

1. **Token 管理**
   - Token 存储在 Pinia Store 中
   - 每次请求自动携带 Token
   - Token 过期自动跳转登录

2. **错误处理**
   - 统一在响应拦截器中处理
   - 业务错误在组件中处理

3. **类型定义**
   - 使用 TypeScript 定义接口类型
   - 类型定义放在 `api` 目录对应文件中

4. **加载状态**
   - 使用 `loading` 状态变量
   - 配合 `try-finally` 确保状态更新

---

## 相关文档

- [开发指南](./DEVELOPMENT_GUIDE.md) - 开发规范
- [用户管理](./USER_MANAGEMENT.md) - 用户功能详解
- [组织管理](./ORGANIZATION_DEPT.md) - 组织功能详解

---

**维护者**: 开发团队  
**最后更新**: 2024-11-18

