# 数据字典管理

本文档说明系统数据字典的配置和使用方法。

## 📋 目录

- [概述](#概述)
- [字典结构](#字典结构)
- [组织相关字典](#组织相关字典)
- [字典配置](#字典配置)
- [使用方法](#使用方法)

## 概述

### 什么是数据字典

数据字典是系统中用于管理各类枚举值、分类码表的功能模块。通过字典管理，可以灵活配置系统中的下拉选项、标签等数据，无需修改代码。

### 优势

- ✅ **灵活配置** - 无需修改代码即可调整选项
- ✅ **集中管理** - 统一管理所有字典数据
- ✅ **多场景复用** - 同一字典可用于多个页面
- ✅ **支持禁用** - 可临时禁用某些选项
- ✅ **自定义排序** - 控制选项显示顺序

---

## 字典结构

### 两级结构

系统采用**字典分类 + 字典项**的两级结构：

```
字典分类（dict_types）
├── 字典项1（dict_items）
├── 字典项2
└── 字典项3
```

### 字典分类（dict_types）

```typescript
interface DictType {
  id: string
  code: string              // 字典编码（唯一标识）
  name: string             // 字典名称
  description?: string     // 描述
  sort?: number           // 排序
  status: 'enabled' | 'disabled'
  createdAt: string
  updatedAt: string
}
```

### 字典项（dict_items）

```typescript
interface DictItem {
  id: string
  dictCode: string         // 所属字典编码
  label: string           // 显示标签
  value: string           // 实际值（存储在数据库）
  tagType?: string        // 标签颜色（可选）
  description?: string    // 描述
  sort?: number          // 排序
  status: 'enabled' | 'disabled'
  createdAt: string
  updatedAt: string
}
```

---

## 组织相关字典

### 1. 组织类型（org_type）

**字典编码**: `org_type`  
**字典名称**: 组织类型  
**说明**: 组织的类型分类

| label | value | tagType | 说明 |
|-------|-------|---------|------|
| 学校 | school | blue | 各类院校、培训机构 |
| 政府机关 | government | red | 政府部门、公共事业 |
| 企业公司 | company | green | 各类企业、集团 |
| 事业机构 | institution | orange | 事业单位、非营利组织 |
| 其他 | other | default | 其他类型组织 |

### 2. 组织规模（org_scale）

**字典编码**: `org_scale`  
**字典名称**: 组织规模  
**说明**: 组织的规模等级

| label | value | tagType | 说明 |
|-------|-------|---------|------|
| 微型（<50人） | micro | default | 50人以下 |
| 小型（50-200人） | small | blue | 50-200人 |
| 中型（200-1000人） | medium | cyan | 200-1000人 |
| 大型（1000-5000人） | large | green | 1000-5000人 |
| 超大型（>5000人） | xlarge | purple | 5000人以上 |

### 3. 所属行业（org_industry）

**字典编码**: `org_industry`  
**字典名称**: 所属行业  
**说明**: 组织所属的行业分类

| label | value | tagType |
|-------|-------|---------|
| 教育 | education | blue |
| 政府/公共管理 | government | red |
| 信息技术 | it | cyan |
| 制造业 | manufacturing | orange |
| 金融业 | finance | gold |
| 医疗卫生 | healthcare | green |
| 文化/体育/娱乐 | culture | purple |
| 建筑业 | construction | brown |
| 交通运输 | transportation | geekblue |
| 批发零售 | retail | magenta |
| 住宿餐饮 | hospitality | volcano |
| 房地产 | realestate | lime |
| 农林牧渔 | agriculture | green |
| 科学研究 | research | cyan |
| 社会服务 | social_service | blue |
| 其他 | other | default |

---

## 字典配置

### 添加字典分类

1. 进入系统管理 → 字典管理
2. 点击"新增字典分类"
3. 填写字典信息：
   - **字典编码**: 唯一标识，建议使用英文小写+下划线（如 `org_type`）
   - **字典名称**: 中文名称
   - **描述**: 说明字典用途
   - **排序**: 控制显示顺序
   - **状态**: 启用/禁用

### 添加字典项

1. 选择字典分类
2. 点击"新增字典项"
3. 填写字典项信息：
   - **显示标签**: 用户看到的文字
   - **实际值**: 存储在数据库的值（建议使用英文）
   - **标签颜色**: 可选，用于显示不同颜色的标签
   - **描述**: 说明该选项的含义
   - **排序**: 控制选项显示顺序
   - **状态**: 启用/禁用

### 标签颜色选项

Ant Design Vue 支持的标签颜色：

| tagType | 效果 |
|---------|------|
| default | 默认灰色 |
| primary | 主色蓝 |
| success | 成功绿 |
| warning | 警告橙 |
| danger | 危险红 |
| info | 信息蓝 |
| blue | 蓝色 |
| green | 绿色 |
| orange | 橙色 |
| red | 红色 |
| purple | 紫色 |
| cyan | 青色 |
| gold | 金色 |

---

## 使用方法

### 在组件中使用

#### 1. 使用 DictSelect 组件

```vue
<template>
  <a-form-item label="组织类型">
    <DictSelect
      v-model="formData.type"
      dict-code="org_type"
      placeholder="请选择组织类型"
    />
  </a-form-item>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import DictSelect from '@/components/common/DictSelect.vue'

const formData = reactive({
  type: undefined,
})
</script>
```

#### 2. 手动调用 API

```typescript
import { getDictItemByCategoryCode } from '@/api/dict'

// 获取字典项列表
const dictItems = await getDictItemByCategoryCode('org_type')

// 过滤启用的字典项
const enabledItems = dictItems.filter(item => item.status === 'enabled')

// 按排序显示
const sortedItems = enabledItems.sort((a, b) => (a.sort || 0) - (b.sort || 0))
```

#### 3. 在页面中缓存字典

```typescript
import { ref, onMounted } from 'vue'
import { getDictItemByCategoryCode, type DictItem } from '@/api/dict'

const dictCache = ref<{
  orgType: DictItem[]
  orgScale: DictItem[]
  orgIndustry: DictItem[]
}>({
  orgType: [],
  orgScale: [],
  orgIndustry: [],
})

const loadDictData = async () => {
  try {
    const [orgType, orgScale, orgIndustry] = await Promise.all([
      getDictItemByCategoryCode('org_type'),
      getDictItemByCategoryCode('org_scale'),
      getDictItemByCategoryCode('org_industry'),
    ])
    
    dictCache.value = {
      orgType,
      orgScale,
      orgIndustry,
    }
  } catch (error) {
    console.error('加载字典数据失败:', error)
  }
}

onMounted(() => {
  loadDictData()
})
```

### 显示字典文本

#### 获取 label

```typescript
const getDictLabel = (dictCode: string, value?: string) => {
  if (!value) return '-'
  
  const items = dictCache.value[dictCode] || []
  const item = items.find(item => item.value === value)
  return item?.label || value
}

// 使用
const typeText = getDictLabel('orgType', 'school')  // 返回 "学校"
```

#### 获取颜色

```typescript
const getDictColor = (dictCode: string, value?: string) => {
  if (!value) return 'default'
  
  const items = dictCache.value[dictCode] || []
  const item = items.find(item => item.value === value)
  return item?.tagType || 'default'
}

// 使用
const typeColor = getDictColor('orgType', 'school')  // 返回 "blue"
```

#### 在模板中显示

```vue
<template>
  <a-tag :color="getOrgTypeColor(record.type)">
    {{ getOrgTypeText(record.type) }}
  </a-tag>
</template>

<script setup lang="ts">
const getOrgTypeText = (type: string) => getDictLabel('orgType', type)
const getOrgTypeColor = (type: string) => getDictColor('orgType', type)
</script>
```

### 数据存储

#### 存储方式

字典字段在数据库中存储字典项的 **value**（不是 id）：

```typescript
// ✅ 正确：存储 value
organization.type = 'school'

// ❌ 错误：存储 id
organization.type = 'dict_item_id_12345'
```

#### 原因

- 修改字典 `label` 不影响已存储数据
- 字典项删除或禁用时，历史数据仍可显示（显示为原始 value）
- 跨系统数据交换更方便

---

## API 接口

### 获取字典项列表

```typescript
GET /api/dict/:code

// 示例
GET /api/dict/org_type

// 响应
{
  code: 200,
  message: "成功",
  data: [
    {
      id: "1",
      dictCode: "org_type",
      label: "学校",
      value: "school",
      tagType: "blue",
      sort: 1,
      status: "enabled",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    // ...
  ]
}
```

### 管理字典

```typescript
// 获取字典分类列表
GET /api/dict-types

// 创建字典分类
POST /api/dict-types

// 更新字典分类
PUT /api/dict-types/:id

// 删除字典分类
DELETE /api/dict-types/:id

// 创建字典项
POST /api/dict-items

// 更新字典项
PUT /api/dict-items/:id

// 删除字典项
DELETE /api/dict-items/:id
```

---

## 最佳实践

### 1. 命名规范

**字典编码**:
- 使用英文小写 + 下划线
- 建议格式：`{模块}_{字段}` 或 `{业务}_{类型}`
- 示例：`org_type`、`user_status`、`review_result`

**字典项 value**:
- 使用英文小写
- 多个单词用下划线连接
- 简洁明了，见名知意
- 示例：`school`、`government`、`social_service`

### 2. 字典设计

**合理拆分**:
- 避免一个字典包含过多选项（建议不超过20个）
- 相似概念可拆分为多个字典
- 考虑是否需要层级结构

**预留扩展**:
- 添加"其他"选项作为兜底
- 预留足够的排序空间（如间隔10）

### 3. 使用建议

**性能优化**:
- 页面级缓存字典数据
- 避免在循环中重复调用 API
- 使用 `Promise.all` 并行加载多个字典

**错误处理**:
- 字典加载失败时的降级方案
- 找不到字典项时显示原始 value

**维护便利**:
- 及时清理无用的字典
- 定期review字典配置
- 字典修改需评估影响范围

---

## 注意事项

1. **不要修改 value**
   - 字典项的 `value` 一旦使用，不应修改
   - 需要修改时，应新增字典项并迁移数据

2. **谨慎删除**
   - 删除字典项前，检查是否有数据使用
   - 建议使用"禁用"而非删除

3. **label 可随时修改**
   - 修改 `label` 不影响已存储数据
   - 所有使用该字典的地方会自动更新显示

4. **状态控制**
   - 禁用字典项后，新增时无法选择
   - 历史数据仍可正常显示

5. **权限控制**
   - 字典管理需要特定权限
   - 普通用户不应修改字典

---

## 相关文档

- [组件文档](./COMPONENTS.md) - DictSelect 组件使用
- [组织管理](./ORGANIZATION_DEPT.md) - 组织字典应用
- [API 接口](./API.md) - 字典接口详情

---

**维护者**: 开发团队  
**最后更新**: 2024-11-18

