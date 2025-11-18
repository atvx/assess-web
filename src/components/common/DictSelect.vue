<!-- 字典选择器组件 -->
<template>
  <a-select
    v-model:value="localValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :allow-clear="allowClear"
    :mode="mode"
    :show-search="showSearch"
    :filter-option="filterOption"
    :loading="loading"
    :style="style"
    @change="handleChange"
  >
    <a-select-option
      v-for="item in dictItems"
      :key="item.value"
      :value="item.value"
      :disabled="item.status === 'disabled'"
    >
      {{ item.label }}
    </a-select-option>
  </a-select>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { getDictItemByCategoryCode, type DictItem } from '@/api/dict'
import { message } from 'ant-design-vue'

interface Props {
  /**
   * 字典分类编码（必填）
   */
  dictCode: string
  /**
   * 绑定值
   */
  modelValue?: string | string[]
  /**
   * 占位符
   */
  placeholder?: string
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否允许清空
   */
  allowClear?: boolean
  /**
   * 选择模式：单选/多选
   */
  mode?: 'multiple' | 'tags'
  /**
   * 是否支持搜索
   */
  showSearch?: boolean
  /**
   * 样式
   */
  style?: string | Record<string, any>
  /**
   * 是否只加载启用状态的字典项
   */
  onlyEnabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value?: string | string[]): void
  (e: 'change', value?: string | string[], option?: DictItem | DictItem[]): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  placeholder: '请选择',
  disabled: false,
  allowClear: true,
  mode: undefined,
  showSearch: false,
  style: 'width: 100%',
  onlyEnabled: true,
})

const emit = defineEmits<Emits>()

// 字典项列表
const dictItems = ref<DictItem[]>([])
const loading = ref(false)
const localValue = ref<string | string[] | undefined>()

// 加载字典数据
const loadDictItems = async () => {
  if (!props.dictCode) {
    console.warn('DictSelect: dictCode is required')
    return
  }

  loading.value = true
  try {
    const response = await getDictItemByCategoryCode(props.dictCode, {
      status: props.onlyEnabled ? 'enabled' : undefined,
    })

    if (response.code === 200) {
      // 按 sort 排序
      dictItems.value = response.data.sort((a, b) => a.sort - b.sort)
    } else {
      message.error(response.message || '加载字典数据失败')
    }
  } catch (error) {
    console.error('加载字典数据失败:', error)
    message.error('加载字典数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索过滤
const filterOption = (input: string, option: any) => {
  const label = option.children?.[0]?.children || option.children
  return label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

// 处理变化
const handleChange = (value: string | string[]) => {
  emit('update:modelValue', value)
  
  // 查找对应的字典项
  if (props.mode === 'multiple' || props.mode === 'tags') {
    const items = dictItems.value.filter(item => (value as string[]).includes(item.value))
    emit('change', value, items)
  } else {
    const item = dictItems.value.find(item => item.value === value)
    emit('change', value, item)
  }
}

// 监听外部值变化
watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue
  },
  { immediate: true },
)

// 监听字典编码变化，重新加载数据
watch(
  () => props.dictCode,
  () => {
    loadDictItems()
  },
)

// 初始化
onMounted(() => {
  loadDictItems()
})
</script>

