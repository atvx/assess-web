# 通用组件文档

本文档介绍系统中的通用组件，包括使用方法、Props、Events 和完整示例。

## 目录

- [DictSelect - 字典选择器](#dictselect---字典选择器)
- [RegionCascader - 省市区级联选择器](#regioncascader---省市区级联选择器)
- [ThemeToggle - 主题切换组件](#themetoggle---主题切换组件)

---

## DictSelect - 字典选择器

### 组件说明

可复用的字典选择器组件，自动从字典管理中加载选项数据。

### 特性

- ✅ 自动加载字典数据
- ✅ 支持单选/多选
- ✅ 支持搜索
- ✅ 按排序显示
- ✅ 自动过滤禁用项
- ✅ 简洁的 UI 样式

### Props

```typescript
{
  dictCode: string              // 字典分类编码（必填）
  modelValue?: string | string[] // 绑定值
  placeholder?: string          // 占位符，默认: "请选择"
  disabled?: boolean           // 是否禁用，默认: false
  allowClear?: boolean         // 是否允许清空，默认: true
  mode?: 'multiple' | 'tags'   // 选择模式（多选）
  showSearch?: boolean         // 是否支持搜索，默认: false
  style?: string | object      // 样式，默认: "width: 100%"
  onlyEnabled?: boolean        // 是否只加载启用项，默认: true
}
```

### Events

```typescript
update:modelValue(value?: string | string[])  // 值变化
change(value?: string | string[], option?: DictItem | DictItem[])  // 选择变化
```

### 使用示例

#### 单选模式

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

#### 多选模式

```vue
<template>
  <DictSelect
    v-model="selectedTags"
    dict-code="tag_type"
    mode="multiple"
    placeholder="请选择标签"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DictSelect from '@/components/common/DictSelect.vue'

const selectedTags = ref<string[]>([])
</script>
```

#### 监听变化

```vue
<template>
  <DictSelect
    v-model="formData.industry"
    dict-code="org_industry"
    @change="handleIndustryChange"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import DictSelect from '@/components/common/DictSelect.vue'
import type { DictItem } from '@/api/dict'

const formData = reactive({
  industry: undefined,
})

const handleIndustryChange = (value: string, option: DictItem) => {
  console.log('选择的行业:', value)
  console.log('字典项详情:', option)
}
</script>
```

### 字典配置

使用前需要在**字典管理**中配置对应的字典分类和字典项。

详细配置方法请参考：[数据字典文档](./DICTIONARY.md)

### 常用字典编码

| 字典编码 | 说明 | 用途 |
|---------|------|------|
| `org_type` | 组织类型 | 学校、政府、企业等 |
| `org_scale` | 组织规模 | 小型、中型、大型等 |
| `org_industry` | 所属行业 | 教育、IT、制造等 |

---

## RegionCascader - 省市区级联选择器

### 组件说明

可复用的省市区级联选择器组件，支持：
- ✅ 完整的省市区三级联动
- ✅ 自动处理直辖市（两级结构）
- ✅ 必须选择到最后一级
- ✅ 支持搜索功能
- ✅ 支持清空

### 两个版本

#### 1. `RegionCascader.vue` - 基础版本

返回省市区的 **ID 数组**，适合需要存储 ID 的场景。

**Props:**
```typescript
{
  modelValue?: string[]        // 绑定值：省市区ID数组
  placeholder?: string         // 占位符，默认: "请选择省/市/区"
  showSearch?: boolean        // 是否支持搜索，默认: true
  disabled?: boolean          // 是否禁用，默认: false
  allowClear?: boolean        // 是否允许清空，默认: true
  style?: string | object     // 样式，默认: "width: 100%"
}
```

**Events:**
```typescript
update:modelValue(value: string[])  // 值变化
change(value: string[])             // 选择变化
```

**使用示例:**
```vue
<template>
  <RegionCascader
    v-model="regionIds"
    placeholder="请选择省/市/区"
    @change="handleRegionChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RegionCascader from '@/components/common/RegionCascader.vue'

const regionIds = ref<string[]>([])

const handleRegionChange = (value: string[]) => {
  console.log('选择的地区ID:', value)
  // 直辖市: ['110000', '110101'] （省、区）
  // 普通省份: ['130000', '130100', '130102'] （省、市、区）
}
</script>
```

#### 2. `RegionCascaderForm.vue` - 表单版本 ⭐ 推荐

自动同步 **province/city/district** 三个字段，适合表单场景。

**Props:**
```typescript
{
  province?: string           // 省份名称（v-model:province）
  city?: string              // 城市名称（v-model:city）
  district?: string          // 区县名称（v-model:district）
  placeholder?: string       // 占位符，默认: "请选择省/市/区"
  showSearch?: boolean      // 是否支持搜索，默认: true
  disabled?: boolean        // 是否禁用，默认: false
  allowClear?: boolean      // 是否允许清空，默认: true
  style?: string | object   // 样式，默认: "width: 100%"
}
```

**Events:**
```typescript
update:province(value?: string)   // 省份变化
update:city(value?: string)       // 城市变化
update:district(value?: string)   // 区县变化
change(value: { province?: string; city?: string; district?: string })  // 变化事件
```

**使用示例:**
```vue
<template>
  <a-form :model="formData">
    <a-form-item label="地区">
      <RegionCascaderForm
        v-model:province="formData.province"
        v-model:city="formData.city"
        v-model:district="formData.district"
        placeholder="请选择省/市/区（必须选到最后一级）"
      />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import RegionCascaderForm from '@/components/common/RegionCascaderForm.vue'

const formData = reactive({
  province: undefined,
  city: undefined,
  district: undefined,
})

// 选择直辖市后：
// formData = { province: "北京市", city: "", district: "东城区" }

// 选择普通省份后：
// formData = { province: "河北省", city: "石家庄市", district: "长安区" }
</script>
```

### 特殊处理说明

#### 直辖市和特别行政区

以下地区没有市级，只有省级和区级：
- 北京市
- 天津市
- 上海市
- 重庆市
- 香港
- 澳门

**表现:**
- 级联选择器只显示两级
- `city` 字段为空字符串 `""`
- 显示格式: "北京市 → 东城区"

#### 普通省份

其他省份有完整的三级结构：
- 省级 → 市级 → 区级
- `province`、`city`、`district` 三个字段都有值
- 显示格式: "河北省 → 石家庄市 → 长安区"

### 数据说明

#### 数据文件位置

地区数据文件: `src/assets/data/pcd.json`

#### 数据格式

```json
[
  {
    "id": "110000",
    "name": "北京市",
    "parent_id": null
  },
  {
    "id": "110101",
    "name": "东城区",
    "parent_id": "110000"
  },
  {
    "id": "130000",
    "name": "河北省",
    "parent_id": null
  },
  {
    "id": "130100",
    "name": "石家庄市",
    "parent_id": "130000"
  },
  {
    "id": "130102",
    "name": "长安区",
    "parent_id": "130100"
  }
]
```

### 工具函数

组件内部使用了 `src/utils/region.ts` 提供的工具函数，详见 [工具函数文档](./UTILS.md#region---地区工具)。

### 注意事项

1. **必须选到最后一级**
   - 直辖市：必须选到区级
   - 普通省份：必须选到区级
   - 否则 `district` 字段为空

2. **数据格式**
   - 省市区名称包含后缀（如"北京市"、"河北省"）
   - 与数据库中的格式保持一致

3. **清空操作**
   - 清空后，province/city/district 都为 `undefined`

4. **性能**
   - 地区数据在组件初始化时加载一次
   - 后续操作无需重复加载

---

## ThemeToggle - 主题切换组件

### 组件说明

一键切换浅色/深色主题的组件。

### 特性

- ✅ 一键切换主题
- ✅ 主题偏好持久化
- ✅ 无闪烁切换
- ✅ 图标动画效果

### 使用示例

```vue
<template>
  <ThemeToggle />
</template>

<script setup lang="ts">
import ThemeToggle from '@/components/common/ThemeToggle.vue'
</script>
```

### Props

无需任何 Props，开箱即用。

### 主题系统

主题切换基于 Ant Design Vue 的 ConfigProvider 和 CSS 变量实现。

详细说明请参考：[主题系统文档](./THEME.md)

---

## 组件开发规范

### 命名规范

- 组件文件名使用 PascalCase：`DictSelect.vue`
- 组件名称与文件名一致
- Props 使用 camelCase
- Events 使用 kebab-case

### 组件结构

推荐使用 Composition API + `<script setup>`：

```vue
<template>
  <!-- 模板 -->
</template>

<script setup lang="ts">
// 导入
import { ref, computed } from 'vue'

// Props
interface Props {
  modelValue?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
})

// Emits
interface Emits {
  (e: 'update:modelValue', value?: string): void
  (e: 'change', value?: string): void
}

const emit = defineEmits<Emits>()

// 逻辑
const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

<style scoped>
/* 样式 */
</style>
```

### 文档要求

新增组件需要在本文档中补充：
- 组件说明
- Props 和 Events
- 使用示例
- 注意事项

### TypeScript 类型

- 使用 TypeScript 编写组件
- 定义清晰的 Props 和 Emits 类型
- 导出组件相关的类型定义

---

## 常见问题

### Q: 组件样式被覆盖？

A: 检查样式作用域：
- 使用 `<style scoped>` 限制样式作用域
- 需要全局样式时使用 `:deep()` 选择器

### Q: 组件数据不更新？

A: 检查响应式：
- 确保使用 `ref` 或 `reactive` 包装数据
- 使用 `computed` 处理派生数据
- Props 变化时使用 `watch` 监听

### Q: 如何全局注册组件？

A: 在 `main.ts` 中注册：

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import DictSelect from '@/components/common/DictSelect.vue'

const app = createApp(App)
app.component('DictSelect', DictSelect)
app.mount('#app')
```

### Q: 组件如何支持 v-model？

A: 定义 `modelValue` prop 和 `update:modelValue` event：

```typescript
interface Props {
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', value?: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
```

---

## 相关文档

- [工具函数文档](./UTILS.md) - 通用工具函数
- [数据字典文档](./DICTIONARY.md) - 字典配置和使用
- [主题系统](./THEME.md) - 主题定制
- [开发指南](./DEVELOPMENT_GUIDE.md) - 开发规范

---

**维护者**: 开发团队  
**最后更新**: 2024-11-18

