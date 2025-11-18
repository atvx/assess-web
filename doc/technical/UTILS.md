# 工具函数文档

本文档说明系统中的工具函数库，提供可复用的通用功能。

## 📋 目录

- [Request - HTTP 请求](#request---http-请求)
- [Region - 地区工具](#region---地区工具)

---

## Request - HTTP 请求

**文件**: `src/utils/request.ts`

### 功能说明

基于 Axios 封装的 HTTP 请求工具，提供统一的请求和响应处理。

### 特性

- ✅ 自动注入 Token
- ✅ 统一错误处理
- ✅ 请求/响应拦截
- ✅ TypeScript 类型支持
- ✅ 超时控制

### 配置

```typescript
import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 请求拦截器

```typescript
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
```

### 响应拦截器

```typescript
request.interceptors.response.use(
  (response) => {
    // 直接返回 data
    return response.data
  },
  (error) => {
    // 统一错误处理
    if (error.response?.status === 401) {
      // 跳转登录
      router.push('/login')
    } else if (error.response?.status === 403) {
      message.error('无权限访问')
    } else {
      message.error(error.response?.data?.message || '请求失败')
    }
    return Promise.reject(error)
  }
)
```

### 使用示例

```typescript
import request from '@/utils/request'

// GET 请求
const data = await request.get('/api/users', {
  params: { page: 1, size: 20 }
})

// POST 请求
const result = await request.post('/api/users', {
  username: 'admin',
  name: '管理员'
})

// PUT 请求
await request.put('/api/users/123', {
  name: '新名称'
})

// DELETE 请求
await request.delete('/api/users/123')
```

### 在 API 文件中使用

```typescript
// src/api/user.ts
import request from '@/utils/request'

export interface User {
  id: string
  username: string
  name: string
}

export function getUserList(params: any) {
  return request.get<User[]>('/users', { params })
}

export function createUser(data: any) {
  return request.post<User>('/users', data)
}
```

---

## Region - 地区工具

**文件**: `src/utils/region.ts`

### 功能说明

处理省市区数据的工具函数，支持级联选择器和地区名称转换。

### 数据源

地区数据来自 `src/assets/data/pcd.json`

### 数据结构

```typescript
interface RegionItem {
  id: string              // 地区代码（6位数字）
  name: string           // 地区名称
  parent_id: string | null  // 父级ID
}

interface CascaderOption {
  value: string
  label: string
  children?: CascaderOption[]
}
```

### 工具函数

#### getRegionOptions()

获取完整的地区树形数据，供级联选择器使用。

**签名**:
```typescript
function getRegionOptions(): CascaderOption[]
```

**返回值**:
```typescript
[
  {
    value: '110000',
    label: '北京市',
    children: [
      { value: '110101', label: '东城区' },
      { value: '110102', label: '西城区' },
      // ...
    ]
  },
  {
    value: '130000',
    label: '河北省',
    children: [
      {
        value: '130100',
        label: '石家庄市',
        children: [
          { value: '130102', label: '长安区' },
          // ...
        ]
      }
    ]
  }
]
```

**使用示例**:
```typescript
import { getRegionOptions } from '@/utils/region'

const regionOptions = getRegionOptions()
```

#### regionToCascaderValue()

将省市区名称转换为级联选择器的值数组。

**签名**:
```typescript
function regionToCascaderValue(
  province?: string,
  city?: string,
  district?: string
): string[]
```

**参数**:
- `province`: 省份名称（如"北京市"、"河北省"）
- `city`: 城市名称（如"石家庄市"）
- `district`: 区县名称（如"长安区"）

**返回值**:
- 直辖市: `[provinceId, districtId]` （两级）
- 普通省份: `[provinceId, cityId, districtId]` （三级）

**使用示例**:
```typescript
import { regionToCascaderValue } from '@/utils/region'

// 直辖市（只传省和区）
const value1 = regionToCascaderValue('北京市', undefined, '东城区')
// 返回: ['110000', '110101']

// 直辖市（city 传空字符串）
const value2 = regionToCascaderValue('北京市', '', '东城区')
// 返回: ['110000', '110101']

// 普通省份（传省市区）
const value3 = regionToCascaderValue('河北省', '石家庄市', '长安区')
// 返回: ['130000', '130100', '130102']

// 只传省份
const value4 = regionToCascaderValue('河北省')
// 返回: ['130000']
```

#### cascaderValueToRegion()

将级联选择器的值数组转换为省市区名称对象。

**签名**:
```typescript
function cascaderValueToRegion(cascaderValue: string[]): {
  province?: string
  city?: string
  district?: string
}
```

**参数**:
- `cascaderValue`: 级联选择器的值数组

**返回值**:
```typescript
{
  province?: string  // 省份名称
  city?: string     // 城市名称（直辖市为空字符串 ""）
  district?: string  // 区县名称
}
```

**使用示例**:
```typescript
import { cascaderValueToRegion } from '@/utils/region'

// 直辖市（两级）
const region1 = cascaderValueToRegion(['110000', '110101'])
// 返回: { province: '北京市', city: '', district: '东城区' }
// 注意：city 为空字符串

// 普通省份（三级）
const region2 = cascaderValueToRegion(['130000', '130100', '130102'])
// 返回: { province: '河北省', city: '石家庄市', district: '长安区' }

// 只选了省份
const region3 = cascaderValueToRegion(['130000'])
// 返回: { province: '河北省', city: undefined, district: undefined }

// 只选了省和市
const region4 = cascaderValueToRegion(['130000', '130100'])
// 返回: { province: '河北省', city: '石家庄市', district: undefined }
```

#### isMunicipality()

判断是否为直辖市或特别行政区。

**签名**:
```typescript
function isMunicipality(provinceId: string): boolean
```

**参数**:
- `provinceId`: 省份ID

**返回值**:
- `true`: 是直辖市/特别行政区
- `false`: 普通省份

**直辖市/特别行政区列表**:
- 北京市: `110000`
- 天津市: `120000`
- 上海市: `310000`
- 重庆市: `500000`
- 香港: `810000`
- 澳门: `820000`

**使用示例**:
```typescript
import { isMunicipality } from '@/utils/region'

isMunicipality('110000')  // true (北京)
isMunicipality('120000')  // true (天津)
isMunicipality('310000')  // true (上海)
isMunicipality('500000')  // true (重庆)
isMunicipality('810000')  // true (香港)
isMunicipality('820000')  // true (澳门)
isMunicipality('130000')  // false (河北)
```

#### getRegionNames()

根据省市区ID获取名称。

**签名**:
```typescript
function getRegionNames(
  provinceId?: string,
  cityId?: string,
  districtId?: string
): {
  province?: string
  city?: string
  district?: string
}
```

**使用示例**:
```typescript
import { getRegionNames } from '@/utils/region'

const names = getRegionNames('110000', undefined, '110101')
// 返回: { province: '北京市', city: '', district: '东城区' }
```

#### getRegionIds()

根据省市区名称获取ID。

**签名**:
```typescript
function getRegionIds(
  provinceName?: string,
  cityName?: string,
  districtName?: string
): {
  provinceId?: string
  cityId?: string
  districtId?: string
}
```

**使用示例**:
```typescript
import { getRegionIds } from '@/utils/region'

const ids = getRegionIds('北京市', undefined, '东城区')
// 返回: { provinceId: '110000', cityId: '', districtId: '110101' }
```

### 业务场景示例

#### 场景1: 表单提交

```typescript
import { cascaderValueToRegion } from '@/utils/region'

const submitForm = async () => {
  // 从级联选择器获取的值
  const cascaderValue = ['110000', '110101']
  
  // 转换为省市区名称
  const region = cascaderValueToRegion(cascaderValue)
  
  // 提交到后端
  await createOrganization({
    name: formData.name,
    province: region.province,
    city: region.city,        // 直辖市为空字符串 ""
    district: region.district,
  })
}
```

#### 场景2: 编辑回显

```typescript
import { regionToCascaderValue } from '@/utils/region'

const handleEdit = (record: Organization) => {
  // 从后端获取的数据
  const { province, city, district } = record
  
  // 转换为级联选择器的值
  const cascaderValue = regionToCascaderValue(province, city, district)
  
  // 设置表单值
  formData.regionIds = cascaderValue
  
  // 或者直接设置省市区（使用 RegionCascaderForm）
  formData.province = province
  formData.city = city
  formData.district = district
}
```

#### 场景3: 显示完整地址

```typescript
import { cascaderValueToRegion } from '@/utils/region'

const getFullAddress = (province?: string, city?: string, district?: string, address?: string) => {
  // 过滤空值并拼接
  const parts = [province, city, district, address].filter(Boolean)
  return parts.join(' ')
}

// 使用
const fullAddress = getFullAddress(
  record.province,
  record.city,
  record.district,
  record.address
)
// 直辖市: "北京市 东城区 xx街道xx号"
// 普通省份: "河北省 石家庄市 长安区 xx街道xx号"
```

### 注意事项

1. **直辖市处理**
   - 直辖市的 `city` 为空字符串 `""`
   - 不是 `null` 或 `undefined`
   - 级联选择器只显示两级

2. **数据格式**
   - 地区名称包含后缀（如"北京市"、"河北省"）
   - 与数据库存储格式保持一致

3. **性能优化**
   - 地区数据在首次调用时加载
   - 使用 Map 缓存，查询效率高
   - 无需重复加载

4. **错误处理**
   - 找不到地区时返回 undefined
   - 不抛出异常，保证程序稳定性

---

## 扩展工具函数

### 日期时间

推荐使用 Day.js：

```typescript
import dayjs from 'dayjs'

// 格式化日期
const formatted = dayjs(date).format('YYYY-MM-DD HH:mm:ss')

// 相对时间
const relative = dayjs(date).fromNow()

// 日期计算
const tomorrow = dayjs().add(1, 'day')
```

### 数据处理

```typescript
// 深拷贝
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// 防抖
export function debounce(fn: Function, delay: number = 300) {
  let timer: any
  return function (...args: any[]) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// 节流
export function throttle(fn: Function, delay: number = 300) {
  let lastTime = 0
  return function (...args: any[]) {
    const now = Date.now()
    if (now - lastTime > delay) {
      fn(...args)
      lastTime = now
    }
  }
}
```

### 表单验证

```typescript
// 手机号验证
export function validatePhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone)
}

// 邮箱验证
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// 身份证验证
export function validateIdCard(idCard: string): boolean {
  return /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(idCard)
}
```

---

## 相关文档

- [组件文档](./COMPONENTS.md) - RegionCascader 组件
- [API 接口](./API.md) - HTTP 请求封装
- [开发指南](./DEVELOPMENT_GUIDE.md) - 开发规范

---

**维护者**: 开发团队  
**最后更新**: 2024-11-18

