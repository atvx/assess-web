<!-- 省市区级联选择器（表单专用版本，自动同步 province/city/district 字段） -->
<template>
  <a-cascader
    v-model:value="localValue"
    :options="regionOptions"
    :placeholder="placeholder"
    :show-search="showSearch ? { filter: cascaderFilter } : false"
    :disabled="disabled"
    :allow-clear="allowClear"
    :style="style"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import {
  getRegionOptions,
  cascaderValueToRegion,
  regionToCascaderValue,
  type CascaderOption,
} from '@/utils/region'

interface Props {
  /**
   * 省份（v-model:province）
   */
  province?: string
  /**
   * 城市（v-model:city）
   */
  city?: string
  /**
   * 区县（v-model:district）
   */
  district?: string
  /**
   * 占位符
   */
  placeholder?: string
  /**
   * 是否支持搜索
   */
  showSearch?: boolean
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否允许清空
   */
  allowClear?: boolean
  /**
   * 样式
   */
  style?: string | Record<string, any>
}

interface Emits {
  (e: 'update:province', value?: string): void
  (e: 'update:city', value?: string): void
  (e: 'update:district', value?: string): void
  (e: 'change', value: { province?: string; city?: string; district?: string }): void
}

const props = withDefaults(defineProps<Props>(), {
  province: undefined,
  city: undefined,
  district: undefined,
  placeholder: '请选择省/市/区',
  showSearch: true,
  disabled: false,
  allowClear: true,
  style: 'width: 100%',
})

const emit = defineEmits<Emits>()

// 地区选项
const regionOptions = ref<CascaderOption[]>([])
const localValue = ref<string[]>([])

// 是否正在内部更新（避免循环）
let isInternalUpdate = false

// 级联选择器搜索过滤
const cascaderFilter = (inputValue: string, path: CascaderOption[]) => {
  return path.some(
    (option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
  )
}

// 处理变化：级联选择器 → 省市区字段
const handleChange = (value: string[]) => {
  isInternalUpdate = true

  if (!value || value.length === 0) {
    // 清空
    emit('update:province', undefined)
    emit('update:city', undefined)
    emit('update:district', undefined)
    emit('change', {})
  } else {
    // 转换为省市区名称
    const region = cascaderValueToRegion(value)
    emit('update:province', region.province)
    emit('update:city', region.city)
    emit('update:district', region.district)
    emit('change', region)
  }

  setTimeout(() => {
    isInternalUpdate = false
  }, 0)
}

// 监听外部省市区字段变化 → 级联选择器
watch(
  () => [props.province, props.city, props.district],
  ([province, city, district]) => {
    if (isInternalUpdate) return

    // 转换为级联选择器的值
    const cascaderValue = regionToCascaderValue(province, city, district)
    localValue.value = cascaderValue
  },
  { immediate: true },
)

// 初始化
onMounted(() => {
  regionOptions.value = getRegionOptions()
})
</script>

