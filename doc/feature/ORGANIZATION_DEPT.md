# 组织与部门管理

本文档说明组织管理和部门管理功能的设计和使用方法。

## 📋 目录

- [概述](#概述)
- [组织管理](#组织管理)
- [部门管理](#部门管理)
- [数据库设计](#数据库设计)

## 概述

### 设计理念

系统采用**多租户架构**，每个组织相当于一个独立的租户，适用于：
- 🏫 学校 - 各类院校、培训机构
- 🏛️ 政府机关 - 政府部门、公共事业单位
- 🏢 企业公司 - 各类企业、集团
- 🏛️ 事业机构 - 事业单位、非营利组织

### 架构特点

- ✅ **扁平化组织** - 组织之间无层级关系
- ✅ **树形部门** - 组织内部部门支持多级树形结构
- ✅ **数据隔离** - 不同组织的数据完全隔离
- ✅ **统一管理** - 超级管理员可管理所有组织

---

## 组织管理

### 功能说明

组织管理用于管理系统中的各类组织（租户），每个组织独立运营，数据相互隔离。

### 数据结构

```typescript
interface Organization {
  id: string
  name: string                // 组织名称
  code: string                // 组织编码/统一社会信用代码
  type: string                // 组织类型（字典：org_type）
  
  // 负责人信息
  leader?: string             // 负责人姓名
  leaderPhone?: string        // 负责人电话
  
  // 联系信息
  email?: string              // 联系邮箱
  phone?: string              // 联系电话
  
  // 地区信息
  province?: string           // 省份
  city?: string              // 城市（直辖市为空字符串 ""）
  district?: string           // 区县
  address?: string            // 详细地址
  
  // 扩展信息（字典字段）
  scale?: string             // 组织规模（字典：org_scale）
  industry?: string          // 所属行业（字典：org_industry）
  description?: string       // 组织描述
  
  // 状态
  status: 'enabled' | 'disabled'
  
  // 审计字段
  createdBy?: string
  updatedBy?: string
  createdAt: string
  updatedAt: string
}
```

### 字典字段

组织表包含 **3 个字典字段**，通过字典管理系统配置：

| 字段 | 字典编码 | 说明 | 示例值 |
|------|----------|------|--------|
| `type` | `org_type` | 组织类型 | school, government, company, institution, other |
| `scale` | `org_scale` | 组织规模 | micro, small, medium, large, xlarge |
| `industry` | `org_industry` | 所属行业 | education, government, it, finance 等 |

详细配置请参考：[数据字典文档](./DICTIONARY.md)

### 地区字段处理

#### 直辖市

直辖市（北京、天津、上海、重庆）的 `city` 字段为**空字符串** `""`：

```typescript
// 正确的直辖市数据
{
  province: "北京市",
  city: "",              // 空字符串，不是 null 或 undefined
  district: "海淀区"
}
```

#### 普通省份

普通省份有完整的三级结构：

```typescript
{
  province: "河北省",
  city: "石家庄市",
  district: "长安区"
}
```

### 页面功能

#### 列表页面

**路径**: `/admin/system/organization`

**功能**:
- 查看组织列表（表格形式）
- 搜索组织（按名称、编码）
- 筛选组织（按类型、状态）
- 分页展示
- 新增组织
- 编辑组织
- 删除组织（软删除）
- 查看组织详情

**字段显示**:
- 名称、编码、类型（显示文本）
- 负责人、联系电话
- 地区（省市区）
- 规模、行业（显示文本）
- 状态、创建时间

#### 详情模态框

**显示信息**:
- 基本信息：名称、编码、类型
- 负责人信息：姓名、电话
- 联系方式：邮箱、电话
- 地区信息：省市区、详细地址
- 扩展信息：规模、行业、描述
- 审计信息：创建时间、更新时间

#### 新增/编辑表单

**必填字段**:
- 组织名称
- 组织编码
- 组织类型

**可选字段**:
- 负责人信息、联系方式
- 地区信息（使用 RegionCascaderForm 组件）
- 组织规模、所属行业
- 组织描述

**表单组件**:
- 组织类型：`DictSelect` (dict-code="org_type")
- 组织规模：`DictSelect` (dict-code="org_scale")
- 所属行业：`DictSelect` (dict-code="org_industry")
- 地区选择：`RegionCascaderForm`

### API 接口

```typescript
// 获取组织列表
GET /api/organizations
Query: { page, size, keyword, type, status }

// 获取组织详情
GET /api/organizations/:id

// 创建组织
POST /api/organizations
Body: OrganizationFormDTO

// 更新组织
PUT /api/organizations/:id
Body: OrganizationFormDTO

// 删除组织（软删除）
DELETE /api/organizations/:id
```

详细说明：[API 接口文档](./API.md#组织管理)

---

## 部门管理

### 功能说明

部门管理用于管理组织内部的部门结构，支持多级树形结构。

### 数据结构

```typescript
interface Department {
  id: string
  name: string              // 部门名称
  code?: string             // 部门编码
  parentId?: string         // 父部门ID
  organizationId: string    // 所属组织ID
  
  // 负责人信息
  leader?: string           // 部门负责人
  leaderPhone?: string      // 负责人电话
  
  // 其他信息
  sort?: number            // 排序
  description?: string     // 部门描述
  status: 'enabled' | 'disabled'
  
  // 树形结构
  children?: Department[]  // 子部门
  
  // 审计字段
  createdBy?: string
  updatedBy?: string
  createdAt: string
  updatedAt: string
}
```

### 树形结构

部门采用树形结构，支持无限层级：

```
根部门
├── 一级部门A
│   ├── 二级部门A1
│   │   └── 三级部门A1a
│   └── 二级部门A2
└── 一级部门B
    └── 二级部门B1
```

### 页面功能

#### 列表页面

**路径**: `/admin/system/department`

**功能**:
- 树形展示部门结构
- 展开/折叠部门节点
- 搜索部门（按名称）
- 新增部门
- 编辑部门
- 删除部门
- 拖拽调整顺序（可选）

#### 新增/编辑表单

**必填字段**:
- 部门名称
- 所属组织

**可选字段**:
- 父部门（不选则为根部门）
- 部门编码
- 负责人信息
- 排序、描述

### API 接口

```typescript
// 获取部门树
GET /api/departments/tree
Query: { organizationId }

// 获取部门列表
GET /api/departments
Query: { organizationId }

// 创建部门
POST /api/departments
Body: DepartmentFormDTO

// 更新部门
PUT /api/departments/:id
Body: DepartmentFormDTO

// 删除部门
DELETE /api/departments/:id
```

---

## 数据库设计

### 组织表（organizations）

```sql
CREATE TABLE organizations (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,              -- 字典字段
    
    leader VARCHAR(50),
    leader_phone VARCHAR(20),
    email VARCHAR(100),
    phone VARCHAR(20),
    
    province VARCHAR(50),
    city VARCHAR(50),                       -- 直辖市为空字符串
    district VARCHAR(50),
    address VARCHAR(200),
    
    scale VARCHAR(50),                      -- 字典字段
    industry VARCHAR(50),                   -- 字典字段
    description TEXT,
    
    status VARCHAR(20) NOT NULL DEFAULT 'enabled',
    
    created_by VARCHAR(32),
    updated_by VARCHAR(32),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 索引
CREATE INDEX idx_organizations_name ON organizations(name);
CREATE INDEX idx_organizations_code ON organizations(code);
CREATE INDEX idx_organizations_type ON organizations(type);
CREATE INDEX idx_organizations_status ON organizations(status);
```

### 部门表（departments）

```sql
CREATE TABLE departments (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50),
    parent_id VARCHAR(32),
    organization_id VARCHAR(32) NOT NULL,
    
    leader VARCHAR(50),
    leader_phone VARCHAR(20),
    
    sort INTEGER DEFAULT 0,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'enabled',
    
    created_by VARCHAR(32),
    updated_by VARCHAR(32),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (parent_id) REFERENCES departments(id)
);

-- 索引
CREATE INDEX idx_departments_org ON departments(organization_id);
CREATE INDEX idx_departments_parent ON departments(parent_id);
CREATE INDEX idx_departments_status ON departments(status);
```

### 关系说明

```
organizations (1) -----> (N) departments
organizations (1) -----> (N) users
departments (1) -----> (N) users
departments (1) -----> (N) departments (自关联)
```

---

## 使用示例

### 创建组织

```vue
<template>
  <a-form :model="formData" :rules="rules">
    <a-form-item label="组织名称" name="name" required>
      <a-input v-model:value="formData.name" />
    </a-form-item>
    
    <a-form-item label="组织类型" name="type" required>
      <DictSelect
        v-model="formData.type"
        dict-code="org_type"
        placeholder="请选择组织类型"
      />
    </a-form-item>
    
    <a-form-item label="地区">
      <RegionCascaderForm
        v-model:province="formData.province"
        v-model:city="formData.city"
        v-model:district="formData.district"
      />
    </a-form-item>
    
    <a-form-item label="组织规模">
      <DictSelect
        v-model="formData.scale"
        dict-code="org_scale"
      />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import DictSelect from '@/components/common/DictSelect.vue'
import RegionCascaderForm from '@/components/common/RegionCascaderForm.vue'

const formData = reactive({
  name: '',
  code: '',
  type: undefined,
  province: undefined,
  city: undefined,
  district: undefined,
  scale: undefined,
  industry: undefined,
})
</script>
```

---

## 权限控制

### 组织管理权限

- `organization:list` - 查看组织列表
- `organization:detail` - 查看组织详情
- `organization:create` - 创建组织
- `organization:update` - 更新组织
- `organization:delete` - 删除组织

### 部门管理权限

- `department:list` - 查看部门列表
- `department:detail` - 查看部门详情
- `department:create` - 创建部门
- `department:update` - 更新部门
- `department:delete` - 删除部门

---

## 注意事项

1. **数据隔离**
   - 不同组织的数据完全隔离
   - 用户只能访问所属组织的数据

2. **直辖市处理**
   - `city` 字段必须为空字符串 `""`
   - 显示时需要处理空字符串

3. **字典字段**
   - 存储字典的 `value`，不是 `id`
   - 显示时通过字典表查询 `label`

4. **部门删除**
   - 删除部门前需检查子部门
   - 删除部门前需检查关联用户

---

## 相关文档

- [数据字典](./DICTIONARY.md) - 字典配置
- [组件文档](./COMPONENTS.md) - DictSelect、RegionCascader
- [API 接口](./API.md) - 接口详细说明
- [用户管理](./USER_MANAGEMENT.md) - 用户与组织关系

---

**维护者**: 开发团队  
**最后更新**: 2024-11-18

