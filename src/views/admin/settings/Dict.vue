<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="dict-management">
    <a-row :gutter="16" class="h-full">
      <!-- 左侧：字典分类列表 -->
      <a-col :span="6">
        <a-card title="字典分类" :bordered="false" class="h-full">
          <template #extra>
            <a-button type="primary" size="small" @click="handleAddCategory">
              <template #icon><PlusOutlined /></template>
              新增分类
            </a-button>
          </template>

          <!-- 分类搜索 -->
          <a-input-search
            v-model:value="categorySearchKeyword"
            placeholder="搜索分类名称或编码"
            allow-clear
            class="mb-3"
          />

          <div class="category-list">
            <div
              v-for="category in filteredCategories"
              :key="category.id"
              :class="[
                'category-item',
                { 'active': selectedCategoryId === category.id }
              ]"
              @click="handleSelectCategory(category)"
            >
              <div class="category-info">
                <div class="category-name">{{ category.name }}</div>
                <div class="category-code">{{ category.code }}</div>
              </div>
              <div class="category-actions" @click.stop>
                <a-button
                  type="link"
                  size="small"
                  @click="handleEditCategory(category)"
                >
                  <EditOutlined />
                </a-button>
                <a-popconfirm
                  title="确定要删除此字典分类吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleDeleteCategory(category.id)"
                >
                  <a-button type="link" size="small" danger>
                    <DeleteOutlined />
                  </a-button>
                </a-popconfirm>
              </div>
            </div>

            <a-empty
              v-if="filteredCategories.length === 0"
              description="暂无数据"
              :image="Empty.PRESENTED_IMAGE_SIMPLE"
            />
          </div>
        </a-card>
      </a-col>

      <!-- 右侧：字典项列表 -->
      <a-col :span="18">
        <a-card :bordered="false" class="h-full">
          <template #title>
            <span v-if="selectedCategory">{{ selectedCategory.name }} - 字典项管理</span>
            <span v-else>请选择字典分类</span>
          </template>
          <template #extra>
            <a-button
              type="primary"
              :disabled="!selectedCategory"
              @click="handleAddItem"
            >
              <template #icon><PlusOutlined /></template>
              新增字典项
            </a-button>
          </template>

          <!-- 筛选区域 -->
          <div v-if="selectedCategory" class="mb-4">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-input
                  v-model:value="itemQueryParams.keyword"
                  placeholder="搜索标签或值"
                  allow-clear
                  @change="handleItemSearch"
                >
                  <template #prefix>
                    <SearchOutlined />
                  </template>
                </a-input>
              </a-col>
              <a-col :span="6">
                <a-select
                  v-model:value="itemQueryParams.status"
                  placeholder="状态筛选"
                  allow-clear
                  class="w-full"
                  @change="handleItemSearch"
                >
                  <a-select-option value="enabled">启用</a-select-option>
                  <a-select-option value="disabled">禁用</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="6">
                <a-select
                  v-model:value="itemQueryParams.tagType"
                  placeholder="标签样式筛选"
                  allow-clear
                  class="w-full"
                  @change="handleItemSearch"
                >
                  <a-select-option value="default">默认</a-select-option>
                  <a-select-option value="success">成功</a-select-option>
                  <a-select-option value="processing">处理中</a-select-option>
                  <a-select-option value="error">错误</a-select-option>
                  <a-select-option value="warning">警告</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="4">
                <a-button @click="handleResetItemQuery">重置</a-button>
              </a-col>
            </a-row>
          </div>

          <!-- 字典项表格 -->
          <a-table
            v-if="selectedCategory"
            :columns="itemColumns"
            :data-source="filteredDictItems"
            :loading="itemLoading"
            :pagination="itemPagination"
            row-key="id"
            :scroll="{ y: 450 }"
            @change="handleItemTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <a-switch
                  :checked="record.status === 'enabled'"
                  checked-children="启用"
                  un-checked-children="禁用"
                  @change="(checked: boolean) => handleToggleItemStatus(record, checked)"
                />
              </template>
              <template v-else-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" size="small" @click="handleEditItem(record)">
                    编辑
                  </a-button>
                  <a-popconfirm
                    title="确定要删除此字典项吗？"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="handleDeleteItem(record.id)"
                  >
                    <a-button type="link" size="small" danger>
                      删除
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </a-table>

          <a-empty
            v-else
            description="请先选择左侧字典分类"
            :image="Empty.PRESENTED_IMAGE_SIMPLE"
            class="mt-20"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- 字典分类编辑弹窗 -->
    <a-modal
      v-model:open="categoryModalVisible"
      :title="categoryModalTitle"
      @ok="handleSaveCategory"
      @cancel="handleCancelCategory"
      width="600px"
    >
      <a-form
        ref="categoryFormRef"
        :model="categoryForm"
        :rules="categoryRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="分类名称" name="name">
          <a-input v-model:value="categoryForm.name" placeholder="请输入分类名称，如：活动状态" />
        </a-form-item>
        <a-form-item label="分类编码" name="code">
          <a-input
            v-model:value="categoryForm.code"
            placeholder="请输入分类编码，如：activity_status"
            :disabled="isEditCategoryMode"
          />
          <div class="text-gray-400 text-xs mt-1">编码唯一且创建后不可修改，建议使用英文下划线命名</div>
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea
            v-model:value="categoryForm.description"
            placeholder="请输入分类描述"
            :rows="3"
          />
        </a-form-item>
        <a-form-item label="排序" name="sort">
          <a-input-number
            v-model:value="categoryForm.sort"
            :min="0"
            placeholder="数字越小越靠前"
            class="w-full"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 字典项编辑弹窗 -->
    <a-modal
      v-model:open="itemModalVisible"
      :title="itemModalTitle"
      @ok="handleSaveItem"
      @cancel="handleCancelItem"
      width="600px"
    >
      <a-form
        ref="itemFormRef"
        :model="itemForm"
        :rules="itemRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="字典标签" name="label">
          <a-input v-model:value="itemForm.label" placeholder="请输入字典标签，如：草稿" />
          <div class="text-gray-400 text-xs mt-1">用于页面显示的文本</div>
        </a-form-item>
        <a-form-item label="字典值" name="value">
          <a-input
            v-model:value="itemForm.value"
            placeholder="请输入字典值，如：draft"
            :disabled="isEditItemMode"
          />
          <div class="text-gray-400 text-xs mt-1">用于程序处理的值，创建后不可修改</div>
        </a-form-item>
        <a-form-item label="标签样式" name="tagType">
          <a-select v-model:value="itemForm.tagType" placeholder="请选择标签样式">
            <a-select-option value="default">默认</a-select-option>
            <a-select-option value="success">成功</a-select-option>
            <a-select-option value="processing">处理中</a-select-option>
            <a-select-option value="error">错误</a-select-option>
            <a-select-option value="warning">警告</a-select-option>
          </a-select>
          <div class="mt-2">
            <span class="text-gray-500 text-xs mr-2">预览：</span>
            <a-tag :color="getTagColor(itemForm.tagType)">{{ itemForm.label || '示例' }}</a-tag>
          </div>
        </a-form-item>
        <a-form-item label="排序" name="sort">
          <a-input-number
            v-model:value="itemForm.sort"
            :min="0"
            placeholder="数字越小越靠前"
            class="w-full"
          />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="itemForm.status">
            <a-radio value="enabled">启用</a-radio>
            <a-radio value="disabled">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea
            v-model:value="itemForm.remark"
            placeholder="请输入备注信息"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message, Empty } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons-vue'
import {
  getDictCategoryList,
  createDictCategory,
  updateDictCategory,
  deleteDictCategory,
  getDictItemList,
  createDictItem,
  updateDictItem,
  deleteDictItem,
  type DictCategory,
  type DictItem,
  type DictCategoryForm,
  type DictItemForm,
} from '@/api/dict'

// ============ 字典分类相关 ============
const categories = ref<DictCategory[]>([])
const categorySearchKeyword = ref('')
const selectedCategoryId = ref<string>()
const selectedCategory = computed(() =>
  categories.value.find(c => c.id === selectedCategoryId.value)
)

// 过滤后的分类列表
const filteredCategories = computed(() => {
  if (!categorySearchKeyword.value) {
    return categories.value
  }
  const keyword = categorySearchKeyword.value.toLowerCase()
  return categories.value.filter(c =>
    c.name.toLowerCase().includes(keyword) ||
    c.code.toLowerCase().includes(keyword)
  )
})

const categoryModalVisible = ref(false)
const categoryFormRef = ref<FormInstance>()
const isEditCategoryMode = ref(false)
const categoryForm = reactive<DictCategoryForm>({
  name: '',
  code: '',
  description: '',
  sort: 0,
  status: 'enabled',
})

const categoryModalTitle = computed(() =>
  isEditCategoryMode.value ? '编辑字典分类' : '新增字典分类'
)

const categoryRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  code: [
    { required: true, message: '请输入分类编码', trigger: 'blur' },
    { pattern: /^[a-z_]+$/, message: '编码只能包含小写字母和下划线', trigger: 'blur' }
  ],
}

// ============ 字典项相关 ============
const dictItems = ref<DictItem[]>([])
const itemLoading = ref(false)

// 字典项查询参数
const itemQueryParams = reactive({
  keyword: '',
  status: undefined as 'enabled' | 'disabled' | undefined,
  tagType: undefined as string | undefined,
})

// 分页配置
const itemPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条`,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
})

// 过滤后的字典项列表
const filteredDictItems = computed(() => {
  let result = [...dictItems.value]

  // 关键词搜索
  if (itemQueryParams.keyword) {
    const keyword = itemQueryParams.keyword.toLowerCase()
    result = result.filter(item =>
      item.label.toLowerCase().includes(keyword) ||
      item.value.toLowerCase().includes(keyword)
    )
  }

  // 状态筛选
  if (itemQueryParams.status) {
    result = result.filter(item => item.status === itemQueryParams.status)
  }

  // 标签样式筛选
  if (itemQueryParams.tagType) {
    result = result.filter(item => item.tagType === itemQueryParams.tagType)
  }

  return result
})

// 监听筛选结果变化，更新总数
const updatePaginationTotal = () => {
  itemPagination.total = filteredDictItems.value.length
}

const itemModalVisible = ref(false)
const itemFormRef = ref<FormInstance>()
const isEditItemMode = ref(false)
const itemForm = reactive<DictItemForm>({
  categoryId: '',
  label: '',
  value: '',
  tagType: 'default',
  sort: 0,
  status: 'enabled',
  remark: '',
})

const itemModalTitle = computed(() =>
  isEditItemMode.value ? '编辑字典项' : '新增字典项'
)

const itemRules = {
  label: [{ required: true, message: '请输入字典标签', trigger: 'blur' }],
  value: [
    { required: true, message: '请输入字典值', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '字典值只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

// 字典项表格列
const itemColumns = [
  {
    title: '字典标签',
    dataIndex: 'label',
    key: 'label',
    width: 150,
  },
  {
    title: '字典值',
    dataIndex: 'value',
    key: 'value',
    width: 150,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: 80,
  },
  {
    title: '状态',
    key: 'status',
    width: 120,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
  },
]

// ============ 字典分类操作 ============
const handleSelectCategory = (category: DictCategory) => {
  selectedCategoryId.value = category.id
  // 重置筛选条件和分页
  handleResetItemQuery()
  loadDictItems(category.id)
}

const handleAddCategory = () => {
  isEditCategoryMode.value = false
  Object.assign(categoryForm, {
    id: undefined,
    name: '',
    code: '',
    description: '',
    sort: 0,
    status: 'enabled',
  })
  categoryModalVisible.value = true
}

const handleEditCategory = (category: DictCategory) => {
  isEditCategoryMode.value = true
  Object.assign(categoryForm, {
    id: category.id,
    name: category.name,
    code: category.code,
    description: category.description || '',
    sort: category.sort,
    status: category.status || 'enabled',
  })
  categoryModalVisible.value = true
}

const handleSaveCategory = async () => {
  try {
    await categoryFormRef.value?.validate()

    let response
    if (isEditCategoryMode.value) {
      // 编辑
      response = await updateDictCategory(categoryForm)
    } else {
      // 新增
      const createData = {
        name: categoryForm.name,
        code: categoryForm.code,
        description: categoryForm.description,
        sort: categoryForm.sort,
        status: categoryForm.status,
        remark: categoryForm.remark,
      }
      response = await createDictCategory(createData)
    }

    // 检查响应状态
    if (response.code === 200) {
      message.success(isEditCategoryMode.value ? '编辑成功' : '新增成功')
      categoryModalVisible.value = false
      await loadCategories()
    } else {
      // 显示后端返回的错误信息
      message.error(response.message || '保存失败')
    }
  } catch (error) {
    console.error('保存字典分类失败:', error)
    // 尝试从错误中提取消息
    const err = error as { response?: { data?: { message?: string } }; message?: string }
    const errorMessage = err.response?.data?.message || err.message || '保存失败'
    message.error(errorMessage)
  }
}

const handleCancelCategory = () => {
  categoryModalVisible.value = false
  categoryFormRef.value?.resetFields()
}

const handleDeleteCategory = async (id: string) => {
  try {
    const response = await deleteDictCategory(id)

    if (response.code === 200) {
      message.success('删除成功')

      // 如果删除的是当前选中的分类，清空字典项列表
      if (selectedCategoryId.value === id) {
        selectedCategoryId.value = undefined
        dictItems.value = []
      }

      await loadCategories()
    } else {
      message.error(response.message || '删除失败')
    }
  } catch (error) {
    console.error('删除字典分类失败:', error)
    const err = error as { response?: { data?: { message?: string } }; message?: string }
    const errorMessage = err.response?.data?.message || err.message || '删除失败'
    message.error(errorMessage)
  }
}

// ============ 字典项筛选操作 ============
const handleItemSearch = () => {
  // 重置到第一页
  itemPagination.current = 1
  updatePaginationTotal()
}

const handleResetItemQuery = () => {
  itemQueryParams.keyword = ''
  itemQueryParams.status = undefined
  itemQueryParams.tagType = undefined
  itemPagination.current = 1
  updatePaginationTotal()
}

const handleItemTableChange = (pagination: { current: number; pageSize: number }) => {
  itemPagination.current = pagination.current
  itemPagination.pageSize = pagination.pageSize
}

// ============ 字典项操作 ============
const handleAddItem = () => {
  if (!selectedCategory.value) {
    message.warning('请先选择字典分类')
    return
  }

  isEditItemMode.value = false
  Object.assign(itemForm, {
    id: undefined,
    categoryId: selectedCategory.value.id,
    label: '',
    value: '',
    tagType: 'default',
    sort: 0,
    status: 'enabled',
    remark: '',
  })
  itemModalVisible.value = true
}

const handleEditItem = (item: DictItem) => {
  isEditItemMode.value = true
  Object.assign(itemForm, {
    id: item.id,
    categoryId: item.categoryId,
    label: item.label,
    value: item.value,
    tagType: item.tagType || 'default',
    sort: item.sort,
    status: item.status,
    remark: item.remark || '',
  })
  itemModalVisible.value = true
}

const handleSaveItem = async () => {
  try {
    await itemFormRef.value?.validate()

    let response
    if (isEditItemMode.value) {
      // 编辑
      response = await updateDictItem(itemForm)
    } else {
      // 新增
      const createData = {
        categoryId: itemForm.categoryId,
        label: itemForm.label,
        value: itemForm.value,
        tagType: itemForm.tagType,
        sort: itemForm.sort,
        status: itemForm.status,
        remark: itemForm.remark,
      }
      response = await createDictItem(createData)
    }

    if (response.code === 200) {
      message.success(isEditItemMode.value ? '编辑成功' : '新增成功')
      itemModalVisible.value = false

      // 重新加载当前分类的字典项
      if (selectedCategory.value) {
        await loadDictItems(selectedCategory.value.id)
      }
    } else {
      message.error(response.message || '保存失败')
    }
  } catch (error) {
    console.error('保存字典项失败:', error)
    const err = error as { response?: { data?: { message?: string } }; message?: string }
    const errorMessage = err.response?.data?.message || err.message || '保存失败'
    message.error(errorMessage)
  }
}

const handleCancelItem = () => {
  itemModalVisible.value = false
  itemFormRef.value?.resetFields()
}

const handleDeleteItem = async (id: string) => {
  try {
    const response = await deleteDictItem(id)

    if (response.code === 200) {
      message.success('删除成功')

      // 重新加载当前分类的字典项
      if (selectedCategory.value) {
        await loadDictItems(selectedCategory.value.id)
      }
    } else {
      message.error(response.message || '删除失败')
    }
  } catch (error) {
    console.error('删除字典项失败:', error)
    const err = error as { response?: { data?: { message?: string } }; message?: string }
    const errorMessage = err.response?.data?.message || err.message || '删除失败'
    message.error(errorMessage)
  }
}

const handleToggleItemStatus = async (item: DictItem, checked: boolean) => {
  try {
    const newStatus = checked ? 'enabled' : 'disabled'
    const response = await updateDictItem({
      id: item.id,
      categoryId: item.categoryId,
      label: item.label,
      value: item.value,
      tagType: item.tagType,
      sort: item.sort,
      status: newStatus,
      remark: item.remark,
    })

    if (response.code === 200) {
      // 更新本地状态
      item.status = newStatus
      message.success('状态更新成功')
    } else {
      message.error(response.message || '状态更新失败')
    }
  } catch (error) {
    console.error('状态更新失败:', error)
    const err = error as { response?: { data?: { message?: string } }; message?: string }
    const errorMessage = err.response?.data?.message || err.message || '状态更新失败'
    message.error(errorMessage)
  }
}

// ============ 工具函数 ============
const getTagColor = (type?: string) => {
  const colorMap: Record<string, string> = {
    default: 'default',
    success: 'success',
    processing: 'processing',
    error: 'error',
    warning: 'warning',
  }
  return colorMap[type || 'default']
}

// ============ 数据加载 ============
const loadCategories = async () => {
  try {
    const response = await getDictCategoryList({
      keyword: categorySearchKeyword.value,
    })
    categories.value = response.data.sort((a: DictCategory, b: DictCategory) => a.sort - b.sort)
  } catch (error) {
    console.error('加载字典分类失败:', error)
    message.error('加载字典分类失败')
  }
}

const loadDictItems = async (categoryId: string) => {
  try {
    itemLoading.value = true
    const response = await getDictItemList({
      categoryId,
    })
    dictItems.value = response.data.sort((a: DictItem, b: DictItem) => a.sort - b.sort)
    // 更新分页总数
    updatePaginationTotal()
  } catch (error) {
    console.error('加载字典项失败:', error)
    message.error('加载字典项失败')
  } finally {
    itemLoading.value = false
  }
}

// ============ 生命周期 ============
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.dict-management {
  height: calc(100vh - 200px);
}

.category-list {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:hover {
  border-color: #1890ff;
  background-color: #f0f7ff;
}

.category-item.active {
  border-color: #1890ff;
  background-color: #e6f7ff;
}

.category-info {
  flex: 1;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 4px;
}

.category-code {
  font-size: 12px;
  color: #8c8c8c;
  font-family: 'Courier New', monospace;
}

.category-actions {
  display: flex;
  gap: 4px;
}

.category-actions .ant-btn {
  padding: 0 4px;
}
</style>
