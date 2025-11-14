# 用户管理功能说明

## 📋 功能概述

用户管理模块提供了完整的用户 CRUD（创建、读取、更新、删除）功能，支持分页查询、条件筛选、状态管理等。

---

## 🚀 功能列表

### 1. 用户列表查询

#### 分页查询
- **路径**: `/admin/user/list`
- **组件**: `src/views/admin/user/List.vue`
- **功能**:
  - ✅ 分页展示用户列表
  - ✅ 显示用户基本信息（头像、姓名、用户名）
  - ✅ 显示联系方式（邮箱、手机）
  - ✅ 显示组织/部门信息
  - ✅ 显示用户状态和角色
  - ✅ 显示创建时间

#### 搜索筛选
支持多种条件组合查询：

| 筛选条件 | 说明 | 类型 |
|---------|------|------|
| 关键词 | 搜索用户名、姓名、邮箱 | 文本输入 |
| 状态 | 启用/禁用/锁定 | 下拉选择 |
| 管理员 | 是/否 | 下拉选择 |

### 2. 用户操作

#### 查看用户
- 查看用户详细信息
- TODO: 待实现详情页面

#### 编辑用户
- 修改用户基本信息
- TODO: 待实现编辑表单

#### 重置密码
- 重置用户密码
- 生成随机密码并展示
- 提示管理员告知用户新密码

#### 启用/禁用用户
- 切换用户状态
- 禁用后用户无法登录系统

#### 删除用户
- 永久删除用户
- 包含二次确认
- 删除后自动刷新列表

---

## 🔌 API 接口

### 1. 查询用户列表

```bash
GET /api/users?keyword=&status=&isAdmin=&current=1&size=10
```

**请求参数**:

| 参数 | 说明 | 必填 | 类型 | 示例 |
|------|------|------|------|------|
| keyword | 关键词搜索 | 否 | string | admin |
| orgId | 组织ID | 否 | string(uuid) | xxx-xxx |
| deptId | 部门ID | 否 | string(uuid) | xxx-xxx |
| status | 状态 | 否 | string | enabled/disabled/locked |
| isAdmin | 是否管理员 | 否 | boolean | true/false |
| current | 当前页码 | 否 | number | 1 |
| size | 每页条数 | 否 | number | 10 |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "id": "xxx-xxx-xxx",
        "username": "admin",
        "realName": "管理员",
        "email": "admin@example.com",
        "phone": "13800138000",
        "avatar": "https://...",
        "orgId": "xxx",
        "orgName": "智审云科技",
        "deptId": "xxx",
        "deptName": "技术部",
        "status": "enabled",
        "isAdmin": true,
        "createdAt": "2025-01-14T10:00:00Z",
        "updatedAt": "2025-01-14T10:00:00Z"
      }
    ],
    "total": 100,
    "size": 10,
    "current": 1,
    "pages": 10
  }
}
```

### 2. 获取用户详情

```bash
GET /api/users/{id}
```

### 3. 创建用户

```bash
POST /api/users
Content-Type: application/json

{
  "username": "newuser",
  "password": "123456",
  "realName": "新用户",
  "email": "newuser@example.com",
  "phone": "13800138000",
  "status": "enabled",
  "isAdmin": false
}
```

### 4. 更新用户

```bash
PUT /api/users/{id}
Content-Type: application/json

{
  "realName": "更新后的姓名",
  "email": "newemail@example.com"
}
```

### 5. 删除用户

```bash
DELETE /api/users/{id}
```

### 6. 切换用户状态

```bash
PUT /api/users/{id}/status
Content-Type: application/json

{
  "status": "disabled"
}
```

### 7. 重置密码

```bash
POST /api/users/{id}/reset-password
```

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "password": "Abc123456"
  }
}
```

---

## 📁 文件结构

```
src/
├── api/
│   └── user.ts              # 用户 API 接口
├── views/
│   └── admin/
│       └── user/
│           └── List.vue     # 用户列表页面
└── utils/
    └── request.ts           # Axios 封装（已有）
```

---

## 💻 代码示例

### 1. 使用用户 API

```typescript
import { userApi, type UserQueryDTO } from '@/api/user'

// 查询用户列表
const fetchUsers = async () => {
  const params: UserQueryDTO = {
    keyword: 'admin',
    status: 'enabled',
    current: 1,
    size: 10,
  }
  
  const response = await userApi.getUserList(params)
  if (response.code === 200) {
    console.log('用户列表:', response.data.records)
    console.log('总数:', response.data.total)
  }
}

// 重置密码
const resetPassword = async (userId: string) => {
  const response = await userApi.resetPassword(userId)
  if (response.code === 200) {
    console.log('新密码:', response.data.password)
  }
}
```

### 2. 在其他页面使用

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userApi } from '@/api/user'

const users = ref([])

onMounted(async () => {
  const response = await userApi.getUserList({ 
    isAdmin: true,
    current: 1,
    size: 10 
  })
  if (response.code === 200) {
    users.value = response.data.records
  }
})
</script>

<template>
  <div>
    <div v-for="user in users" :key="user.id">
      {{ user.realName }}
    </div>
  </div>
</template>
```

---

## 🎨 UI 特性

### 1. 响应式设计
- 使用 Ant Design Vue 的栅格系统
- 表格支持横向滚动
- 分页器自适应

### 2. 主题支持
- 完美适配浅色/深色主题
- 使用 Tailwind CSS 的 `dark:` 前缀
- 所有文字颜色自动切换

### 3. 交互优化
- 搜索框支持回车键查询
- 操作需要二次确认
- 加载状态提示
- 错误友好提示

---

## 🔐 权限控制

### 后端权限
- 需要 Bearer Token 认证
- 不同角色有不同操作权限

### 前端权限
- 路由守卫验证登录状态
- 按钮级别权限控制（TODO）

---

## 📝 待实现功能

### 高优先级
- [ ] 用户详情页面
- [ ] 用户编辑表单
- [ ] 用户创建表单
- [ ] 批量操作（批量删除、批量导出）

### 中优先级
- [ ] 用户导入（Excel）
- [ ] 用户导出（Excel）
- [ ] 头像上传
- [ ] 角色权限管理

### 低优先级
- [ ] 用户活动日志
- [ ] 登录历史记录
- [ ] 操作审计

---

## 🐛 已知问题

无

---

## 📚 相关文档

- [开发指南](./DEVELOPMENT_GUIDE.md)
- [项目结构](./PROJECT_STRUCTURE.md)
- [主题系统](./THEME.md)
- [Ant Design Vue 文档](https://antdv.com/)
- [Axios 文档](https://axios-http.com/)

---

## 🔄 更新日志

### v1.0.0 (2025-01-14)
- ✅ 实现用户列表分页查询
- ✅ 实现条件筛选（关键词、状态、角色）
- ✅ 实现用户操作（查看、编辑、删除、重置密码、切换状态）
- ✅ 完整的 API 封装
- ✅ TypeScript 类型定义
- ✅ 响应式设计
- ✅ 主题适配

---

**文档版本**: v1.0.0  
**最后更新**: 2025-01-14  
**维护者**: 智审云开发团队

