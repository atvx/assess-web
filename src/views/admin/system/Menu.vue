<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="menu-management">
    <!-- 搜索和操作区 -->
    <a-card class="mb-4" :bordered="false">
      <a-form layout="inline" :model="queryParams">
        <a-form-item label="菜单名称">
          <a-input
            v-model:value="queryParams.keyword"
            placeholder="搜索菜单名称"
            allow-clear
            style="width: 200px"
            @pressEnter="handleSearch"
          >
            <template #prefix><SearchOutlined /></template>
          </a-input>
        </a-form-item>

        <a-form-item label="菜单类型">
          <a-select
            v-model:value="queryParams.type"
            placeholder="全部"
            allow-clear
            style="width: 120px"
            @change="handleSearch"
          >
            <a-select-option value="menu">菜单</a-select-option>
            <a-select-option value="button">按钮</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="状态">
          <a-select
            v-model:value="queryParams.visible"
            placeholder="全部"
            allow-clear
            style="width: 100px"
            @change="handleSearch"
          >
            <a-select-option :value="true">显示</a-select-option>
            <a-select-option :value="false">隐藏</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button type="primary" :loading="loading" @click="handleSearch">
              <template #icon><SearchOutlined /></template>
              查询
            </a-button>
            <a-button @click="handleReset">
              <template #icon><ReloadOutlined /></template>
              重置
            </a-button>
            <a-button @click="handleExpandAll">
              <template #icon><ExpandOutlined /></template>
              {{ expandAll ? '收起' : '展开' }}
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 菜单列表 -->
    <a-card :bordered="false">
      <template #title>
        <span class="text-lg font-semibold">菜单列表</span>
      </template>
      <template #extra>
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          新增菜单
        </a-button>
      </template>

      <a-table
        :columns="columns"
        :data-source="menuData"
        :loading="loading"
        :pagination="false"
        :expanded-row-keys="expandedKeys"
        :scroll="{ x: 1400 }"
        row-key="id"
        @expand="handleExpand"
      >
        <template #bodyCell="{ column, record }">
          <!-- 菜单名称 -->
          <template v-if="column.key === 'title'">
            <div class="flex items-center">
              <component
                :is="record.icon || 'MenuOutlined'"
                class="mr-2 text-base"
                :style="{ color: getIconColor(record.type) }"
              />
              <span>{{ record.title }}</span>
            </div>
          </template>

          <!-- 图标 -->
          <template v-else-if="column.key === 'icon'">
            <component v-if="record.icon" :is="record.icon" class="text-base" />
            <span v-else class="text-gray-400">-</span>
          </template>

          <!-- 类型 -->
          <template v-else-if="column.key === 'type'">
            <a-tag :color="getTypeColor(record.type)">
              {{ getTypeLabel(record.type) }}
            </a-tag>
          </template>

          <!-- 权限标识 -->
          <template v-else-if="column.key === 'permission'">
            <a-typography-text
              v-if="record.permission"
              :copyable="{ text: record.permission }"
              code
            >
              {{ record.permission }}
            </a-typography-text>
            <span v-else class="text-gray-400">-</span>
          </template>

          <!-- 路由路径 -->
          <template v-else-if="column.key === 'path'">
            <a-typography-text
              v-if="record.path"
              :copyable="{ text: record.path }"
              code
            >
              {{ record.path }}
            </a-typography-text>
            <span v-else class="text-gray-400">-</span>
          </template>

          <!-- 状态 -->
          <template v-else-if="column.key === 'visible'">
            <a-switch
              :checked="record.visible"
              checked-children="显示"
              un-checked-children="隐藏"
              @change="handleToggleVisible(record)"
            />
          </template>

          <!-- 排序 -->
          <template v-else-if="column.key === 'sort'">
            <div class="flex items-center space-x-2">
              <span>{{ record.sort }}</span>
              <div class="flex flex-col">
                <UpOutlined
                  class="text-xs cursor-pointer text-gray-400 hover:text-blue-500"
                  @click="handleMoveUp(record)"
                />
                <DownOutlined
                  class="text-xs cursor-pointer text-gray-400 hover:text-blue-500"
                  @click="handleMoveDown(record)"
                />
              </div>
            </div>
          </template>

          <!-- 操作 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record)">
                编辑
              </a-button>
              <a-button
                v-if="record.type !== 'button'"
                type="link"
                size="small"
                @click="handleAddSub(record)"
              >
                新增
              </a-button>
              <a-popconfirm
                title="确定要删除吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" size="small" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑抽屉 -->
    <a-drawer
      v-model:open="drawerVisible"
      :title="form.id ? '编辑菜单' : '新增菜单'"
      width="600"
      @close="handleClose"
    >
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
      >
        <a-form-item label="菜单类型" name="type">
          <a-radio-group v-model:value="form.type">
            <a-radio-button value="menu">菜单</a-radio-button>
            <a-radio-button value="button">按钮</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="上级菜单" name="parentId">
          <a-tree-select
            v-model:value="form.parentId"
            :tree-data="menuTree"
            :field-names="{ children: 'children', label: 'title', value: 'id' }"
            placeholder="不选则为根菜单"
            allow-clear
            tree-default-expand-all
          />
        </a-form-item>

        <a-form-item label="菜单名称" name="title">
          <a-input
            v-model:value="form.title"
            placeholder="请输入菜单名称"
            :maxlength="50"
          />
        </a-form-item>

        <a-form-item
          v-if="form.type !== 'button'"
          label="菜单图标"
          name="icon"
        >
          <a-input
            v-model:value="form.icon"
            placeholder="请输入图标名称"
            @click="iconSelectVisible = true"
          >
            <template #prefix>
              <component v-if="form.icon" :is="form.icon" />
            </template>
            <template #suffix>
              <SelectOutlined class="cursor-pointer" @click="iconSelectVisible = true" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          v-if="form.type !== 'button'"
          label="路由路径"
          name="path"
        >
          <a-input v-model:value="form.path" placeholder="如：/system/user" />
        </a-form-item>

        <a-form-item
          v-if="form.type === 'menu'"
          label="组件路径"
          name="component"
        >
          <a-input
            v-model:value="form.component"
            placeholder="如：system/User.vue"
          />
        </a-form-item>

        <a-form-item label="权限标识" name="permission">
          <a-input
            v-model:value="form.permission"
            placeholder="如：system:user:list"
          />
        </a-form-item>

        <a-form-item label="排序" name="sort">
          <a-input-number
            v-model:value="form.sort"
            :min="0"
            placeholder="数字越小越靠前"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item
          v-if="form.type !== 'button'"
          label="是否可见"
          name="visible"
        >
          <a-switch
            v-model:checked="form.visible"
            checked-children="显示"
            un-checked-children="隐藏"
          />
        </a-form-item>

        <a-form-item
          v-if="form.type === 'menu'"
          label="是否缓存"
          name="keepAlive"
        >
          <a-switch
            v-model:checked="form.keepAlive"
            checked-children="缓存"
            un-checked-children="不缓存"
          />
        </a-form-item>

        <a-form-item label="备注" name="remark">
          <a-textarea
            v-model:value="form.remark"
            placeholder="请输入备注"
            :rows="3"
            :maxlength="200"
            show-count
          />
        </a-form-item>
      </a-form>

      <template #footer>
        <a-space>
          <a-button @click="handleClose">取消</a-button>
          <a-button type="primary" :loading="submitting" @click="handleSubmit">
            确定
          </a-button>
        </a-space>
      </template>
    </a-drawer>

    <!-- 图标选择 -->
    <a-modal
      v-model:open="iconSelectVisible"
      title="选择图标"
      width="800"
      @ok="handleIconSelect"
    >
      <a-input
        v-model:value="iconSearchKeyword"
        placeholder="搜索图标"
        allow-clear
        class="mb-4"
      >
        <template #prefix><SearchOutlined /></template>
      </a-input>

      <div class="icon-grid">
        <div
          v-for="icon in filteredIcons"
          :key="icon"
          :class="['icon-item', { active: selectedIcon === icon }]"
          @click="selectedIcon = icon"
        >
          <component :is="icon" class="text-2xl" />
          <div class="icon-name">{{ icon.replace('Outlined', '') }}</div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance, TableColumnsType } from 'ant-design-vue'
import {
  SearchOutlined,
  ReloadOutlined,
  ExpandOutlined,
  PlusOutlined,
  UpOutlined,
  DownOutlined,
  SelectOutlined,
  MenuOutlined,
  HomeOutlined,
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  AppstoreOutlined,
  FileOutlined,
  FolderOutlined,
  TableOutlined,
  FormOutlined,
  CalendarOutlined,
  BarChartOutlined,
  PieChartOutlined,
  MailOutlined,
  BellOutlined,
  SafetyOutlined,
  ApiOutlined,
  DatabaseOutlined,
  CloudOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  StarOutlined,
  CodeOutlined,
  BugOutlined,
  ToolOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  FireOutlined,
  CrownOutlined,
  TrophyOutlined,
  GiftOutlined,
  HeartOutlined,
  CameraOutlined,
  PictureOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons-vue'

// 表格列定义
const columns: TableColumnsType = [
  {
    title: '菜单名称',
    key: 'title',
    width: 200,
  },
  {
    title: '图标',
    key: 'icon',
    width: 80,
  },
  {
    title: '类型',
    key: 'type',
    width: 100,
  },
  {
    title: '权限标识',
    key: 'permission',
    width: 180,
  },
  {
    title: '路由路径',
    key: 'path',
    width: 180,
  },
  {
    title: '排序',
    key: 'sort',
    width: 100,
  },
  {
    title: '状态',
    key: 'visible',
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
  },
]

// 查询参数
const queryParams = reactive({
  keyword: '',
  type: undefined as string | undefined,
  visible: undefined as boolean | undefined,
})

// 数据
const loading = ref(false)
const menuData = ref<any[]>([])
const menuTree = ref<any[]>([])
const expandedKeys = ref<string[]>([])
const expandAll = ref(true)

// 表单
const drawerVisible = ref(false)
const formRef = ref<FormInstance>()
const form = reactive({
  id: '',
  parentId: '',
  type: 'menu' as 'menu' | 'button',
  title: '',
  icon: '',
  path: '',
  component: '',
  permission: '',
  sort: 0,
  visible: true,
  keepAlive: false,
  remark: '',
})
const submitting = ref(false)

const rules = {
  type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
}

// 图标选择
const iconSelectVisible = ref(false)
const iconSearchKeyword = ref('')
const selectedIcon = ref('')

const iconList = [
  'HomeOutlined',
  'DashboardOutlined',
  'AppstoreOutlined',
  'MenuOutlined',
  'UserOutlined',
  'TeamOutlined',
  'SettingOutlined',
  'SafetyOutlined',
  'FileOutlined',
  'FolderOutlined',
  'TableOutlined',
  'FormOutlined',
  'BarChartOutlined',
  'PieChartOutlined',
  'CalendarOutlined',
  'DatabaseOutlined',
  'MailOutlined',
  'BellOutlined',
  'ApiOutlined',
  'CloudOutlined',
  'ShoppingCartOutlined',
  'TagOutlined',
  'StarOutlined',
  'CodeOutlined',
  'BugOutlined',
  'ToolOutlined',
  'RocketOutlined',
  'ThunderboltOutlined',
  'FireOutlined',
  'CrownOutlined',
  'TrophyOutlined',
  'GiftOutlined',
  'HeartOutlined',
  'CameraOutlined',
  'PictureOutlined',
  'VideoCameraOutlined',
]

const filteredIcons = computed(() => {
  if (!iconSearchKeyword.value) return iconList
  return iconList.filter((icon) =>
    icon.toLowerCase().includes(iconSearchKeyword.value.toLowerCase())
  )
})

// 方法
const getIconColor = (type: string) => {
  const colors: Record<string, string> = {
    menu: '#1890ff',
    button: '#fa8c16',
  }
  return colors[type] || '#666'
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    menu: 'blue',
    button: 'orange',
  }
  return colors[type] || 'default'
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    menu: '菜单',
    button: '按钮',
  }
  return labels[type] || type
}

const loadMenuData = async () => {
  loading.value = true
  try {
    // TODO: 调用 API
    // 模拟数据
    menuData.value = [
      {
        id: '1',
        title: '仪表盘',
        icon: 'DashboardOutlined',
        type: 'menu',
        path: '/admin/dashboard',
        component: 'Dashboard.vue',
        permission: 'dashboard:view',
        sort: 1,
        visible: true,
        keepAlive: true,
      },
      {
        id: '2',
        title: '系统管理',
        icon: 'SettingOutlined',
        type: 'menu',
        path: '/admin/system',
        sort: 2,
        visible: true,
        children: [
          {
            id: '2-1',
            title: '用户管理',
            icon: 'UserOutlined',
            type: 'menu',
            path: '/admin/system/user',
            component: 'system/User.vue',
            permission: 'system:user:view',
            sort: 1,
            visible: true,
            keepAlive: true,
            children: [
              {
                id: '2-1-1',
                title: '新增',
                type: 'button',
                permission: 'system:user:create',
                sort: 1,
                visible: true,
              },
              {
                id: '2-1-2',
                title: '编辑',
                type: 'button',
                permission: 'system:user:edit',
                sort: 2,
                visible: true,
              },
              {
                id: '2-1-3',
                title: '删除',
                type: 'button',
                permission: 'system:user:delete',
                sort: 3,
                visible: true,
              },
            ],
          },
          {
            id: '2-2',
            title: '角色管理',
            icon: 'TeamOutlined',
            type: 'menu',
            path: '/admin/system/role',
            component: 'system/Role.vue',
            permission: 'system:role:view',
            sort: 2,
            visible: true,
            keepAlive: true,
          },
          {
            id: '2-3',
            title: '菜单管理',
            icon: 'MenuOutlined',
            type: 'menu',
            path: '/admin/system/menu',
            component: 'system/Menu.vue',
            permission: 'system:menu:view',
            sort: 3,
            visible: true,
            keepAlive: true,
          },
        ],
      },
    ]

    menuTree.value = menuData.value
    expandedKeys.value = getAllKeys(menuData.value)
  } finally {
    loading.value = false
  }
}

const getAllKeys = (tree: any[]): string[] => {
  const keys: string[] = []
  const traverse = (nodes: any[]) => {
    nodes.forEach((node) => {
      keys.push(node.id)
      if (node.children?.length) {
        traverse(node.children)
      }
    })
  }
  traverse(tree)
  return keys
}

const handleSearch = () => {
  loadMenuData()
}

const handleReset = () => {
  queryParams.keyword = ''
  queryParams.type = undefined
  queryParams.visible = undefined
  loadMenuData()
}

const handleExpandAll = () => {
  if (expandAll.value) {
    expandedKeys.value = []
  } else {
    expandedKeys.value = getAllKeys(menuData.value)
  }
  expandAll.value = !expandAll.value
}

const handleExpand = (expanded: boolean, record: any) => {
  if (expanded) {
    expandedKeys.value.push(record.id)
  } else {
    expandedKeys.value = expandedKeys.value.filter((key) => key !== record.id)
  }
}

const handleAdd = () => {
  Object.assign(form, {
    id: '',
    parentId: '',
    type: 'menu',
    title: '',
    icon: '',
    path: '',
    component: '',
    permission: '',
    sort: 0,
    visible: true,
    keepAlive: false,
    remark: '',
  })
  drawerVisible.value = true
}

const handleAddSub = (record: any) => {
  Object.assign(form, {
    id: '',
    parentId: record.id,
    type: 'menu',
    title: '',
    icon: '',
    path: '',
    component: '',
    permission: '',
    sort: 0,
    visible: true,
    keepAlive: false,
    remark: '',
  })
  drawerVisible.value = true
}

const handleEdit = (record: any) => {
  Object.assign(form, {
    id: record.id,
    parentId: record.parentId,
    type: record.type,
    title: record.title,
    icon: record.icon,
    path: record.path,
    component: record.component,
    permission: record.permission,
    sort: record.sort,
    visible: record.visible,
    keepAlive: record.keepAlive,
    remark: record.remark,
  })
  drawerVisible.value = true
}

const handleDelete = async (id: string) => {
  try {
    // TODO: 调用 API
    message.success('删除成功')
    await loadMenuData()
  } catch {
    message.error('删除失败')
  }
}

const handleToggleVisible = async (record: any) => {
  try {
    // TODO: 调用 API
    record.visible = !record.visible
    message.success('状态更新成功')
  } catch {
    message.error('操作失败')
  }
}

const handleMoveUp = async (record: any) => {
  try {
    // TODO: 调用 API
    message.success('上移成功')
    await loadMenuData()
  } catch {
    message.error('上移失败')
  }
}

const handleMoveDown = async (record: any) => {
  try {
    // TODO: 调用 API
    message.success('下移成功')
    await loadMenuData()
  } catch {
    message.error('下移失败')
  }
}

const handleClose = () => {
  drawerVisible.value = false
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitting.value = true

    // TODO: 调用 API
    message.success(form.id ? '更新成功' : '创建成功')
    handleClose()
    await loadMenuData()
  } catch {
    // 验证失败
  } finally {
    submitting.value = false
  }
}

const handleIconSelect = () => {
  if (selectedIcon.value) {
    form.icon = selectedIcon.value
  }
  iconSelectVisible.value = false
}

onMounted(() => {
  loadMenuData()
})
</script>

<style scoped>
.menu-management {
  padding: 16px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-item:hover {
  border-color: #1890ff;
  background: #e6f7ff;
}

.icon-item.active {
  border-color: #1890ff;
  background: #e6f7ff;
}

.icon-name {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  text-align: center;
}
</style>

