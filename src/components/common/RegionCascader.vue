<!-- 省市区级联选择器 -->
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
import { getRegionOptions, type CascaderOption } from '@/utils/region'

interface Props {
  /**
   * 绑定值：省市区ID数组
   * 直辖市: [provinceId, districtId]
   * 普通省份: [provinceId, cityId, districtId]
   */
  modelValue?: string[]
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
  (e: 'update:modelValue', value: string[]): void
  (e: 'change', value: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
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

// 级联选择器搜索过滤
const cascaderFilter = (inputValue: string, path: CascaderOption[]) => {
  return path.some(
    (option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
  )
}

// 处理变化
const handleChange = (value: string[]) => {
  emit('update:modelValue', value || [])
  emit('change', value || [])
}

// 监听外部值变化
watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue || []
  },
  { immediate: true },
)

// 初始化
onMounted(() => {
  regionOptions.value = getRegionOptions()
})
</script>

