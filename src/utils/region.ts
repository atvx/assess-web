import pcdData from '@/assets/data/pcd.json'

/**
 * 地区数据项
 */
export interface RegionItem {
  id: string
  name: string
  parent_id: string | null
}

/**
 * 级联选择器选项
 */
export interface CascaderOption {
  value: string
  label: string
  children?: CascaderOption[]
}

/**
 * 直辖市、特别行政区列表（这些地区没有市级）
 */
const MUNICIPALITIES = ['110000', '120000', '310000', '500000', '810000', '820000']

/**
 * 判断是否为直辖市/特别行政区
 */
export function isMunicipality(provinceId: string): boolean {
  return MUNICIPALITIES.includes(provinceId)
}

/**
 * 将平铺的地区数据转换为树形结构
 */
export function buildRegionTree(): CascaderOption[] {
  const data = pcdData as RegionItem[]
  const map = new Map<string, CascaderOption>()
  const tree: CascaderOption[] = []

  // 第一遍：创建所有节点
  data.forEach((item) => {
    map.set(item.id, {
      value: item.id,
      label: item.name,
      children: [],
    })
  })

  // 第二遍：建立父子关系
  data.forEach((item) => {
    const node = map.get(item.id)
    if (!node) return

    if (item.parent_id === '0' || item.parent_id === null || !item.parent_id) {
      // 顶级节点（省级）
      tree.push(node)
    } else {
      // 子节点
      const parent = map.get(item.parent_id)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(node)
      }
    }
  })

  // 第三遍：清理空的 children
  const cleanEmptyChildren = (nodes: CascaderOption[]) => {
    nodes.forEach((node) => {
      if (node.children && node.children.length === 0) {
        delete node.children
      } else if (node.children) {
        cleanEmptyChildren(node.children)
      }
    })
  }

  cleanEmptyChildren(tree)

  return tree
}

/**
 * 根据省市区ID获取名称
 */
export function getRegionNames(
  provinceId?: string,
  cityId?: string,
  districtId?: string,
): {
  province?: string
  city?: string
  district?: string
} {
  const data = pcdData as RegionItem[]
  const map = new Map<string, string>()

  data.forEach((item) => {
    map.set(item.id, item.name)
  })

  return {
    province: provinceId ? map.get(provinceId) : undefined,
    city: cityId ? map.get(cityId) : undefined,
    district: districtId ? map.get(districtId) : undefined,
  }
}

/**
 * 根据名称查找地区ID
 */
export function getRegionIds(
  provinceName?: string,
  cityName?: string,
  districtName?: string,
): {
  provinceId?: string
  cityId?: string
  districtId?: string
} {
  const data = pcdData as RegionItem[]

  let provinceId: string | undefined
  let cityId: string | undefined
  let districtId: string | undefined

  // 查找省份
  if (provinceName) {
    const province = data.find(
      (item) =>
        (item.parent_id === '0' || item.parent_id === null || !item.parent_id) &&
        item.name === provinceName,
    )
    if (province) {
      provinceId = province.id

      // 查找城市
      if (cityName) {
        const city = data.find(
          (item) => item.parent_id === provinceId && item.name === cityName,
        )
        if (city) {
          cityId = city.id

          // 查找区县
          if (districtName) {
            const district = data.find(
              (item) => item.parent_id === cityId && item.name === districtName,
            )
            if (district) {
              districtId = district.id
            }
          }
        }
      } else if (districtName && isMunicipality(provinceId)) {
        // 直辖市情况：没有市级，直接查区级
        const district = data.find(
          (item) => item.parent_id === provinceId && item.name === districtName,
        )
        if (district) {
          districtId = district.id
        }
      }
    }
  }

  return { provinceId, cityId, districtId }
}

/**
 * 将级联选择器的值转换为省市区字段
 * @param cascaderValue 级联选择器的值数组
 * @returns 省市区名称对象
 */
export function cascaderValueToRegion(cascaderValue: string[]): {
  province?: string
  city?: string
  district?: string
} {
  if (!cascaderValue || cascaderValue.length === 0) {
    return {}
  }

  const data = pcdData as RegionItem[]
  const map = new Map<string, string>()
  data.forEach((item) => {
    map.set(item.id, item.name)
  })

  const provinceId = cascaderValue[0]
  if (!provinceId) {
    return {}
  }

  const province = map.get(provinceId)

  // 判断是否为直辖市
  if (isMunicipality(provinceId)) {
    // 直辖市：只有省和区
    if (cascaderValue.length === 2) {
      const districtId = cascaderValue[1]
      return {
        province,
        city: '',
        district: districtId ? map.get(districtId) : undefined,
      }
    }
    return { province }
  } else {
    // 普通省份：省市区三级
    const cityId = cascaderValue[1]
    const districtId = cascaderValue[2]
    return {
      province,
      city: cityId ? map.get(cityId) : undefined,
      district: districtId ? map.get(districtId) : undefined,
    }
  }
}

/**
 * 将省市区字段转换为级联选择器的值
 * @param province 省份名称
 * @param city 城市名称
 * @param district 区县名称
 * @returns 级联选择器的值数组
 */
export function regionToCascaderValue(
  province?: string,
  city?: string,
  district?: string,
): string[] {
  if (!province) return []

  const { provinceId, cityId, districtId } = getRegionIds(province, city, district)

  if (!provinceId) return []

  // 判断是否为直辖市
  if (isMunicipality(provinceId)) {
    // 直辖市：只返回省和区
    if (districtId) {
      return [provinceId, districtId]
    }
    return [provinceId]
  } else {
    // 普通省份：返回省市区
    const result: string[] = [provinceId]
    if (cityId) result.push(cityId)
    if (districtId) result.push(districtId)
    return result
  }
}

/**
 * 获取完整的地区树形数据（供级联选择器使用）
 */
export function getRegionOptions(): CascaderOption[] {
  return buildRegionTree()
}

