<template>
  <div class="department-management">
    <!-- 组织选择器 -->
    <a-card :bordered="false" style="margin-bottom: 16px">
      <a-space>
        <span style="font-weight: 500">所属组织：</span>
        <a-select
          v-model:value="selectedOrgId"
          placeholder="请选择组织"
          show-search
          :filter-option="filterOrgOption"
          style="width: 300px"
          @change="handleOrgChange"
        >
          <a-select-option v-for="org in organizations" :key="org.id" :value="org.id">
            <a-space>
              <span>{{ org.name }}</span>
              <a-tag v-if="org.dict_type" size="small">{{ org.dict_type }}</a-tag>
            </a-space>
          </a-select-option>
        </a-select>
        <a-button type="link" @click="handleManageOrg">
          <template #icon><SettingOutlined /></template>
          管理组织
        </a-button>
      </a-space>
    </a-card>

    <a-row :gutter="16" style="height: calc(100% - 80px)">
      <!-- 左侧：部门树 -->
      <a-col :span="6">
        <a-card title="部门结构" :bordered="false" style="height: 100%">
          <template #extra>
            <a-space>
              <a-button type="primary" size="small" @click="handleAddRootDept" :disabled="!selectedOrgId">
                <template #icon><PlusOutlined /></template>
                添加根部门
              </a-button>
              <a-button size="small" @click="loadDepartmentTree">
                <template #icon><ReloadOutlined /></template>
              </a-button>
            </a-space>
          </template>

          <!-- 搜索框 -->
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="搜索部门名称"
            style="margin-bottom: 12px"
            @search="handleSearch"
          />

          <!-- 部门树 -->
          <div v-if="!selectedOrgId">
            <a-empty description="请先选择一个组织" />
          </div>
          <a-tree
            v-else-if="departmentTree.length > 0"
            :tree-data="departmentTree"
            :field-names="{ children: 'children', title: 'name', key: 'id' }"
            :selected-keys="selectedKeys"
            :expanded-keys="expandedKeys"
            show-line
            @select="handleSelectDept"
            @expand="handleExpand"
          >
            <template #title="{ name, memberCount }">
              <span>{{ name }} <a-tag v-if="memberCount" size="small">{{ memberCount }}</a-tag></span>
            </template>
          </a-tree>
          <a-empty v-else description="暂无部门数据" />
        </a-card>
      </a-col>

      <!-- 右侧：部门详情和人员管理 -->
      <a-col :span="18">
        <a-card v-if="selectedDept" :bordered="false">
          <!-- 部门信息 -->
          <template #title>
            <a-space>
              <span>{{ selectedDept.name }}</span>
              <a-tag :color="selectedDept.enabled ? 'success' : 'default'">
                {{ selectedDept.enabled ? '启用' : '停用' }}
              </a-tag>
            </a-space>
          </template>
          <template #extra>
            <a-space>
              <a-button size="small" @click="handleAddSubDept">
                <template #icon><PlusOutlined /></template>
                添加子部门
              </a-button>
              <a-button size="small" @click="handleEditDept(selectedDept)">
                <template #icon><EditOutlined /></template>
                编辑
              </a-button>
              <a-popconfirm
                title="确定要删除该部门吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDeleteDept(selectedDept.id)"
              >
                <a-button size="small" danger>
                  <template #icon><DeleteOutlined /></template>
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>

          <!-- 基本信息 -->
          <a-descriptions bordered :column="2" style="margin-bottom: 24px">
            <a-descriptions-item label="所属组织" :span="2">
              {{ organizations.find(org => org.id === selectedOrgId)?.name || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="部门编码">{{ selectedDept.code }}</a-descriptions-item>
            <a-descriptions-item label="部门类型">{{ selectedDept.type }}</a-descriptions-item>
            <a-descriptions-item label="上级部门">{{ selectedDept.parentName || '无' }}</a-descriptions-item>
            <a-descriptions-item label="负责人">{{ selectedDept.leader || '未设置' }}</a-descriptions-item>
            <a-descriptions-item label="联系电话">{{ selectedDept.phone || '-' }}</a-descriptions-item>
            <a-descriptions-item label="邮箱">{{ selectedDept.email || '-' }}</a-descriptions-item>
            <a-descriptions-item label="排序">{{ selectedDept.sort }}</a-descriptions-item>
            <a-descriptions-item label="创建时间">{{ selectedDept.createdAt }}</a-descriptions-item>
            <a-descriptions-item label="部门描述" :span="2">
              {{ selectedDept.description || '暂无描述' }}
            </a-descriptions-item>
          </a-descriptions>

          <!-- 部门人员 -->
          <a-card title="部门人员" :bordered="false" size="small">
            <template #extra>
              <a-space>
                <a-button type="primary" size="small" @click="handleAddMember">
                  <template #icon><UserAddOutlined /></template>
                  添加成员
                </a-button>
                <a-button size="small" @click="handleImportMembers">
                  <template #icon><ImportOutlined /></template>
                  批量导入
                </a-button>
                <a-button size="small" @click="handleExportMembers">
                  <template #icon><ExportOutlined /></template>
                  导出成员
                </a-button>
              </a-space>
            </template>

            <!-- 搜索和筛选 -->
            <a-row :gutter="16" style="margin-bottom: 16px">
              <a-col :span="8">
                <a-input
                  v-model:value="memberFilters.keyword"
                  placeholder="搜索姓名/工号/手机号"
                  allow-clear
                  @pressEnter="loadMembers"
                >
                  <template #prefix><SearchOutlined /></template>
                </a-input>
              </a-col>
              <a-col :span="4">
                <a-select
                  v-model:value="memberFilters.status"
                  placeholder="状态"
                  allow-clear
                  style="width: 100%"
                  @change="loadMembers"
                >
                  <a-select-option value="active">在职</a-select-option>
                  <a-select-option value="inactive">离职</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="4">
                <a-select
                  v-model:value="memberFilters.role"
                  placeholder="角色"
                  allow-clear
                  style="width: 100%"
                  @change="loadMembers"
                >
                  <a-select-option value="leader">负责人</a-select-option>
                  <a-select-option value="member">成员</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="8">
                <a-space>
                  <a-button type="primary" @click="loadMembers">
                    <template #icon><SearchOutlined /></template>
                    查询
                  </a-button>
                  <a-button @click="handleResetMemberFilters">重置</a-button>
                </a-space>
              </a-col>
            </a-row>

            <!-- 成员表格 -->
            <a-table
              :columns="memberColumns"
              :data-source="members"
              :loading="memberLoading"
              :pagination="memberPagination"
              :row-selection="memberRowSelection"
              row-key="id"
              @change="handleMemberTableChange"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'user'">
                  <a-space>
                    <a-avatar :src="record.avatar" :size="32">{{ record.name?.charAt(0) }}</a-avatar>
                    <div>
                      <div>{{ record.name }}</div>
                      <div style="font-size: 12px; color: #999">{{ record.employeeNo }}</div>
                    </div>
                  </a-space>
                </template>
                <template v-else-if="column.key === 'role'">
                  <a-tag :color="record.isLeader ? 'blue' : 'default'">
                    {{ record.isLeader ? '负责人' : '成员' }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'status'">
                  <a-tag :color="record.status === 'active' ? 'success' : 'default'">
                    {{ record.status === 'active' ? '在职' : '离职' }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-space>
                    <a @click="handleSetLeader(record)">
                      {{ record.isLeader ? '取消负责人' : '设为负责人' }}
                    </a>
                    <a @click="handleTransferMember(record)">调动</a>
                    <a-popconfirm
                      title="确定要移除该成员吗？"
                      ok-text="确定"
                      cancel-text="取消"
                      @confirm="handleRemoveMember(record.id)"
                    >
                      <a style="color: #ff4d4f">移除</a>
                    </a-popconfirm>
                  </a-space>
                </template>
              </template>
            </a-table>
          </a-card>
        </a-card>

        <!-- 未选择部门时的提示 -->
        <a-card v-else :bordered="false" style="height: 100%">
          <a-empty description="请从左侧选择一个部门" />
        </a-card>
      </a-col>
    </a-row>

    <!-- 新增/编辑部门抽屉 -->
    <a-drawer
      v-model:open="deptDrawerVisible"
      :title="deptForm.id ? '编辑部门' : '新增部门'"
      width="600"
      @close="handleCloseDeptDrawer"
    >
      <a-form
        ref="deptFormRef"
        :model="deptForm"
        :rules="deptFormRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="所属组织" name="orgId">
          <a-select
            v-model:value="deptForm.orgId"
            placeholder="请选择所属组织"
            show-search
            :filter-option="filterOrgOption"
            disabled
          >
            <a-select-option v-for="org in organizations" :key="org.id" :value="org.id">
              {{ org.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="上级部门" name="parentId">
          <a-tree-select
            v-model:value="deptForm.parentId"
            :tree-data="departmentTree"
            :field-names="{ children: 'children', label: 'name', value: 'id' }"
            placeholder="请选择上级部门（不选则为根部门）"
            allow-clear
            tree-default-expand-all
          />
        </a-form-item>
        <a-form-item label="部门名称" name="name">
          <a-input v-model:value="deptForm.name" placeholder="请输入部门名称" />
        </a-form-item>
        <a-form-item label="部门编码" name="code">
          <a-input v-model:value="deptForm.code" placeholder="请输入部门编码" />
        </a-form-item>
        <a-form-item label="部门类型" name="type">
          <a-select v-model:value="deptForm.type" placeholder="请选择部门类型">
            <a-select-option value="company">公司</a-select-option>
            <a-select-option value="branch">分公司</a-select-option>
            <a-select-option value="department">部门</a-select-option>
            <a-select-option value="group">小组</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="负责人" name="leader">
          <a-select
            v-model:value="deptForm.leader"
            placeholder="请选择负责人"
            show-search
            :filter-option="filterUserOption"
            allow-clear
          >
            <a-select-option v-for="user in allUsers" :key="user.id" :value="user.id">
              {{ user.name }} ({{ user.employeeNo }})
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="联系电话" name="phone">
          <a-input v-model:value="deptForm.phone" placeholder="请输入联系电话" />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="deptForm.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="排序" name="sort">
          <a-input-number v-model:value="deptForm.sort" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item label="状态" name="enabled">
          <a-switch v-model:checked="deptForm.enabled" checked-children="启用" un-checked-children="停用" />
        </a-form-item>
        <a-form-item label="部门描述" name="description">
          <a-textarea
            v-model:value="deptForm.description"
            placeholder="请输入部门描述"
            :rows="4"
            :maxlength="200"
            show-count
          />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-space>
          <a-button @click="handleCloseDeptDrawer">取消</a-button>
          <a-button type="primary" :loading="deptSubmitting" @click="handleSubmitDept">
            确定
          </a-button>
        </a-space>
      </template>
    </a-drawer>

    <!-- 添加成员模态框 -->
    <a-modal
      v-model:open="addMemberVisible"
      title="添加部门成员"
      width="800"
      @ok="handleSubmitAddMember"
      @cancel="handleCancelAddMember"
    >
      <a-form layout="vertical">
        <a-form-item label="选择成员">
          <a-input
            v-model:value="userSearchKeyword"
            placeholder="搜索用户名/工号"
            style="margin-bottom: 12px"
            @pressEnter="searchUsers"
          >
            <template #prefix><SearchOutlined /></template>
          </a-input>
          <a-table
            :columns="userSelectColumns"
            :data-source="availableUsers"
            :row-selection="userRowSelection"
            :loading="userSearchLoading"
            :pagination="userPagination"
            row-key="id"
            size="small"
            @change="handleUserTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'user'">
                <a-space>
                  <a-avatar :src="record.avatar" :size="24">{{ record.name?.charAt(0) }}</a-avatar>
                  <div>
                    <div>{{ record.name }}</div>
                    <div style="font-size: 12px; color: #999">{{ record.employeeNo }}</div>
                  </div>
                </a-space>
              </template>
              <template v-else-if="column.key === 'department'">
                {{ record.departmentName || '未分配' }}
              </template>
            </template>
          </a-table>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 成员调动模态框 -->
    <a-modal
      v-model:open="transferVisible"
      title="成员调动"
      @ok="handleSubmitTransfer"
      @cancel="transferVisible = false"
    >
      <a-form layout="vertical">
        <a-form-item label="调动成员">
          <a-input :value="currentTransferMember?.name" disabled />
        </a-form-item>
        <a-form-item label="目标部门">
          <a-tree-select
            v-model:value="targetDeptId"
            :tree-data="departmentTree"
            :field-names="{ children: 'children', label: 'name', value: 'id' }"
            placeholder="请选择目标部门"
            tree-default-expand-all
          />
        </a-form-item>
        <a-form-item label="调动原因">
          <a-textarea v-model:value="transferReason" placeholder="请输入调动原因" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 批量导入模态框 -->
    <a-modal
      v-model:open="importVisible"
      title="批量导入成员"
      @ok="handleSubmitImport"
      @cancel="importVisible = false"
    >
      <a-space direction="vertical" style="width: 100%">
        <a-alert
          message="导入说明"
          description="请下载模板文件，按照模板格式填写成员信息后上传。支持 Excel (.xlsx, .xls) 格式。"
          type="info"
          show-icon
        />
        <a-button type="link" @click="handleDownloadTemplate">
          <template #icon><DownloadOutlined /></template>
          下载导入模板
        </a-button>
        <a-upload-dragger
          v-model:fileList="importFileList"
          name="file"
          :multiple="false"
          :before-upload="beforeUpload"
          @remove="handleRemoveFile"
        >
          <p class="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p class="ant-upload-hint">支持 Excel 文件格式（.xlsx, .xls）</p>
        </a-upload-dragger>
        <a-alert v-if="importResult" :message="importResult.message" :type="importResult.type" show-icon />
      </a-space>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance, TableColumnsType, TableProps } from 'ant-design-vue'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  UserAddOutlined,
  ImportOutlined,
  ExportOutlined,
  DownloadOutlined,
  InboxOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'

// 组织数据
const organizations = ref<any[]>([])
const selectedOrgId = ref<string>('')

// 部门树数据
const departmentTree = ref<any[]>([])
const selectedKeys = ref<string[]>([])
const expandedKeys = ref<string[]>([])
const searchKeyword = ref('')

// 选中的部门
const selectedDept = ref<any>(null)

// 部门表单
const deptDrawerVisible = ref(false)
const deptFormRef = ref<FormInstance>()
const deptForm = reactive({
  id: '',
  orgId: '',
  parentId: '',
  name: '',
  code: '',
  type: 'department',
  leader: '',
  phone: '',
  email: '',
  sort: 0,
  enabled: true,
  description: '',
})
const deptSubmitting = ref(false)

const deptFormRules = {
  orgId: [{ required: true, message: '请选择所属组织', trigger: 'change' }],
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入部门编码', trigger: 'blur' }],
  type: [{ required: true, message: '请选择部门类型', trigger: 'change' }],
}

// 全部用户列表（用于选择负责人）
const allUsers = ref<any[]>([])

// 成员管理
const members = ref<any[]>([])
const memberLoading = ref(false)
const memberFilters = reactive({
  keyword: '',
  status: undefined,
  role: undefined,
})
const memberPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

const memberColumns: TableColumnsType = [
  { title: '成员信息', key: 'user', width: 200 },
  { title: '职位', dataIndex: 'position', key: 'position' },
  { title: '角色', key: 'role', width: 100 },
  { title: '手机号', dataIndex: 'phone', key: 'phone' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '状态', key: 'status', width: 80 },
  { title: '加入时间', dataIndex: 'joinedAt', key: 'joinedAt', width: 180 },
  { title: '操作', key: 'action', width: 180, fixed: 'right' },
]

const selectedMemberIds = ref<string[]>([])
const memberRowSelection = {
  selectedRowKeys: selectedMemberIds,
  onChange: (selectedRowKeys: string[]) => {
    selectedMemberIds.value = selectedRowKeys
  },
}

// 添加成员
const addMemberVisible = ref(false)
const availableUsers = ref<any[]>([])
const userSearchKeyword = ref('')
const userSearchLoading = ref(false)
const selectedUserIds = ref<string[]>([])
const userPagination = reactive({
  current: 1,
  pageSize: 5,
  total: 0,
})

const userSelectColumns: TableColumnsType = [
  { title: '用户信息', key: 'user', width: 200 },
  { title: '职位', dataIndex: 'position', key: 'position' },
  { title: '当前部门', key: 'department' },
]

const userRowSelection = {
  selectedRowKeys: selectedUserIds,
  onChange: (selectedRowKeys: string[]) => {
    selectedUserIds.value = selectedRowKeys
  },
}

// 成员调动
const transferVisible = ref(false)
const currentTransferMember = ref<any>(null)
const targetDeptId = ref('')
const transferReason = ref('')

// 批量导入
const importVisible = ref(false)
const importFileList = ref<any[]>([])
const importResult = ref<any>(null)

// 加载组织列表
const loadOrganizations = async () => {
  try {
    // TODO: 调用 API
    // const res = await getOrganizationList()
    // organizations.value = res.data

    // 模拟数据
    organizations.value = [
      {
        id: '1',
        name: '华为技术有限公司',
        code: '91440300279320043W',
        dict_type: '企业',
        dict_scale: '大型',
        dict_industry: '信息技术',
        status: 'enabled',
      },
      {
        id: '2',
        name: '腾讯控股有限公司',
        code: '91440300708461136T',
        dict_type: '企业',
        dict_scale: '大型',
        dict_industry: '互联网',
        status: 'enabled',
      },
      {
        id: '3',
        name: '深圳大学',
        code: '12440000455820233C',
        dict_type: '高校',
        dict_scale: '中型',
        dict_industry: '教育',
        status: 'enabled',
      },
    ]

    // 默认选中第一个组织
    if (organizations.value.length > 0 && !selectedOrgId.value) {
      selectedOrgId.value = organizations.value[0].id
      await loadDepartmentTree()
    }
  } catch (error) {
    message.error('加载组织列表失败')
  }
}

// 组织切换
const handleOrgChange = async (orgId: string) => {
  selectedOrgId.value = orgId
  selectedDept.value = null
  selectedKeys.value = []
  await loadDepartmentTree()
}

// 过滤组织选项
const filterOrgOption = (input: string, option: any) => {
  const text = option.children?.find((child: any) => typeof child === 'string') || ''
  return text.toLowerCase().includes(input.toLowerCase())
}

// 管理组织
const handleManageOrg = () => {
  // TODO: 跳转到组织管理页面
  message.info('跳转到组织管理页面')
}

// 加载部门树
const loadDepartmentTree = async () => {
  if (!selectedOrgId.value) {
    departmentTree.value = []
    return
  }
  try {
    // TODO: 调用 API
    // const res = await getDepartmentTree()
    // departmentTree.value = res.data

    // 模拟数据
    departmentTree.value = [
      {
        id: '1',
        name: '总公司',
        code: 'ROOT',
        type: 'company',
        memberCount: 156,
        children: [
          {
            id: '2',
            name: '技术部',
            code: 'TECH',
            type: 'department',
            memberCount: 45,
            children: [
              { id: '3', name: '前端组', code: 'TECH-FE', type: 'group', memberCount: 15 },
              { id: '4', name: '后端组', code: 'TECH-BE', type: 'group', memberCount: 18 },
              { id: '5', name: '测试组', code: 'TECH-QA', type: 'group', memberCount: 12 },
            ],
          },
          {
            id: '6',
            name: '产品部',
            code: 'PROD',
            type: 'department',
            memberCount: 23,
          },
          {
            id: '7',
            name: '市场部',
            code: 'MKT',
            type: 'department',
            memberCount: 28,
          },
          {
            id: '8',
            name: '人事行政部',
            code: 'HR',
            type: 'department',
            memberCount: 15,
          },
        ],
      },
    ]

    // 默认展开所有节点
    expandedKeys.value = getAllKeys(departmentTree.value)
  } catch (error) {
    message.error('加载部门树失败')
  }
}

// 获取所有节点的 key
const getAllKeys = (tree: any[]): string[] => {
  const keys: string[] = []
  const traverse = (nodes: any[]) => {
    nodes.forEach((node) => {
      keys.push(node.id)
      if (node.children && node.children.length > 0) {
        traverse(node.children)
      }
    })
  }
  traverse(tree)
  return keys
}

// 搜索部门
const handleSearch = () => {
  if (!searchKeyword.value) {
    expandedKeys.value = getAllKeys(departmentTree.value)
    return
  }

  // 搜索匹配的节点并展开
  const matchedKeys: string[] = []
  const searchInTree = (nodes: any[]) => {
    nodes.forEach((node) => {
      if (node.name.includes(searchKeyword.value)) {
        matchedKeys.push(node.id)
      }
      if (node.children && node.children.length > 0) {
        searchInTree(node.children)
      }
    })
  }
  searchInTree(departmentTree.value)
  expandedKeys.value = matchedKeys
}

// 选择部门
const handleSelectDept = (keys: string[]) => {
  if (keys.length === 0) return
  selectedKeys.value = keys
  loadDepartmentDetail(keys[0])
}

// 展开/收起节点
const handleExpand = (keys: string[]) => {
  expandedKeys.value = keys
}

// 加载部门详情
const loadDepartmentDetail = async (deptId: string) => {
  try {
    // TODO: 调用 API
    // const res = await getDepartmentDetail(deptId)
    // selectedDept.value = res.data

    // 模拟数据
    selectedDept.value = {
      id: deptId,
      name: '技术部',
      code: 'TECH',
      type: '部门',
      parentName: '总公司',
      leader: '张三',
      phone: '010-12345678',
      email: 'tech@example.com',
      sort: 1,
      enabled: true,
      description: '负责公司技术研发工作',
      createdAt: '2024-01-01 10:00:00',
    }

    // 加载部门成员
    await loadMembers()
  } catch (error) {
    message.error('加载部门详情失败')
  }
}

// 添加根部门
const handleAddRootDept = () => {
  Object.assign(deptForm, {
    id: '',
    orgId: selectedOrgId.value,
    parentId: '',
    name: '',
    code: '',
    type: 'company',
    leader: '',
    phone: '',
    email: '',
    sort: 0,
    enabled: true,
    description: '',
  })
  deptDrawerVisible.value = true
}

// 添加子部门
const handleAddSubDept = () => {
  Object.assign(deptForm, {
    id: '',
    orgId: selectedOrgId.value,
    parentId: selectedDept.value?.id,
    name: '',
    code: '',
    type: 'department',
    leader: '',
    phone: '',
    email: '',
    sort: 0,
    enabled: true,
    description: '',
  })
  deptDrawerVisible.value = true
}

// 编辑部门
const handleEditDept = (dept: any) => {
  Object.assign(deptForm, {
    id: dept.id,
    orgId: dept.orgId || selectedOrgId.value,
    parentId: dept.parentId,
    name: dept.name,
    code: dept.code,
    type: dept.type,
    leader: dept.leaderId,
    phone: dept.phone,
    email: dept.email,
    sort: dept.sort,
    enabled: dept.enabled,
    description: dept.description,
  })
  deptDrawerVisible.value = true
}

// 关闭部门抽屉
const handleCloseDeptDrawer = () => {
  deptDrawerVisible.value = false
  deptFormRef.value?.resetFields()
}

// 提交部门表单
const handleSubmitDept = async () => {
  try {
    await deptFormRef.value?.validate()
    deptSubmitting.value = true

    // TODO: 调用 API
    // if (deptForm.id) {
    //   await updateDepartment(deptForm)
    // } else {
    //   await createDepartment(deptForm)
    // }

    message.success(deptForm.id ? '更新成功' : '创建成功')
    handleCloseDeptDrawer()
    await loadDepartmentTree()
  } catch (error) {
    message.error('操作失败')
  } finally {
    deptSubmitting.value = false
  }
}

// 删除部门
const handleDeleteDept = async (deptId: string) => {
  try {
    // TODO: 调用 API
    // await deleteDepartment(deptId)

    message.success('删除成功')
    selectedDept.value = null
    selectedKeys.value = []
    await loadDepartmentTree()
  } catch (error) {
    message.error('删除失败')
  }
}

// 加载部门成员
const loadMembers = async () => {
  if (!selectedDept.value) return

  try {
    memberLoading.value = true
    // TODO: 调用 API
    // const res = await getDepartmentMembers({
    //   deptId: selectedDept.value.id,
    //   ...memberFilters,
    //   page: memberPagination.current,
    //   pageSize: memberPagination.pageSize,
    // })
    // members.value = res.data.list
    // memberPagination.total = res.data.total

    // 模拟数据
    members.value = [
      {
        id: '1',
        name: '张三',
        employeeNo: 'E001',
        avatar: '',
        position: '技术总监',
        isLeader: true,
        phone: '13800138000',
        email: 'zhangsan@example.com',
        status: 'active',
        joinedAt: '2024-01-01',
      },
      {
        id: '2',
        name: '李四',
        employeeNo: 'E002',
        avatar: '',
        position: '前端工程师',
        isLeader: false,
        phone: '13800138001',
        email: 'lisi@example.com',
        status: 'active',
        joinedAt: '2024-02-01',
      },
    ]
    memberPagination.total = 2
  } catch (error) {
    message.error('加载成员列表失败')
  } finally {
    memberLoading.value = false
  }
}

// 重置成员筛选
const handleResetMemberFilters = () => {
  memberFilters.keyword = ''
  memberFilters.status = undefined
  memberFilters.role = undefined
  loadMembers()
}

// 成员表格变化
const handleMemberTableChange: TableProps['onChange'] = (pagination) => {
  memberPagination.current = pagination.current || 1
  memberPagination.pageSize = pagination.pageSize || 10
  loadMembers()
}

// 添加成员
const handleAddMember = () => {
  addMemberVisible.value = true
  searchUsers()
}

// 搜索用户
const searchUsers = async () => {
  try {
    userSearchLoading.value = true
    // TODO: 调用 API
    // const res = await searchAvailableUsers({
    //   keyword: userSearchKeyword.value,
    //   page: userPagination.current,
    //   pageSize: userPagination.pageSize,
    // })
    // availableUsers.value = res.data.list
    // userPagination.total = res.data.total

    // 模拟数据
    availableUsers.value = [
      {
        id: '3',
        name: '王五',
        employeeNo: 'E003',
        avatar: '',
        position: '后端工程师',
        departmentName: '产品部',
      },
      {
        id: '4',
        name: '赵六',
        employeeNo: 'E004',
        avatar: '',
        position: '测试工程师',
        departmentName: null,
      },
    ]
    userPagination.total = 2
  } catch (error) {
    message.error('搜索用户失败')
  } finally {
    userSearchLoading.value = false
  }
}

// 用户表格变化
const handleUserTableChange: TableProps['onChange'] = (pagination) => {
  userPagination.current = pagination.current || 1
  userPagination.pageSize = pagination.pageSize || 5
  searchUsers()
}

// 提交添加成员
const handleSubmitAddMember = async () => {
  if (selectedUserIds.value.length === 0) {
    message.warning('请选择要添加的成员')
    return
  }

  try {
    // TODO: 调用 API
    // await addDepartmentMembers({
    //   deptId: selectedDept.value.id,
    //   userIds: selectedUserIds.value,
    // })

    message.success('添加成功')
    addMemberVisible.value = false
    selectedUserIds.value = []
    await loadMembers()
  } catch (error) {
    message.error('添加失败')
  }
}

// 取消添加成员
const handleCancelAddMember = () => {
  addMemberVisible.value = false
  selectedUserIds.value = []
}

// 设为/取消负责人
const handleSetLeader = async (member: any) => {
  try {
    // TODO: 调用 API
    // await setDepartmentLeader({
    //   deptId: selectedDept.value.id,
    //   userId: member.id,
    //   isLeader: !member.isLeader,
    // })

    message.success(member.isLeader ? '已取消负责人' : '已设为负责人')
    await loadMembers()
  } catch (error) {
    message.error('操作失败')
  }
}

// 调动成员
const handleTransferMember = (member: any) => {
  currentTransferMember.value = member
  targetDeptId.value = ''
  transferReason.value = ''
  transferVisible.value = true
}

// 提交调动
const handleSubmitTransfer = async () => {
  if (!targetDeptId.value) {
    message.warning('请选择目标部门')
    return
  }

  try {
    // TODO: 调用 API
    // await transferMember({
    //   memberId: currentTransferMember.value.id,
    //   fromDeptId: selectedDept.value.id,
    //   toDeptId: targetDeptId.value,
    //   reason: transferReason.value,
    // })

    message.success('调动成功')
    transferVisible.value = false
    await loadMembers()
  } catch (error) {
    message.error('调动失败')
  }
}

// 移除成员
const handleRemoveMember = async (memberId: string) => {
  try {
    // TODO: 调用 API
    // await removeDepartmentMember({
    //   deptId: selectedDept.value.id,
    //   memberId: memberId,
    // })

    message.success('移除成功')
    await loadMembers()
  } catch (error) {
    message.error('移除失败')
  }
}

// 导入成员
const handleImportMembers = () => {
  importVisible.value = true
  importFileList.value = []
  importResult.value = null
}

// 导出成员
const handleExportMembers = async () => {
  try {
    // TODO: 调用 API
    // await exportDepartmentMembers({
    //   deptId: selectedDept.value.id,
    //   ...memberFilters,
    // })

    message.success('导出成功')
  } catch (error) {
    message.error('导出失败')
  }
}

// 下载导入模板
const handleDownloadTemplate = () => {
  // TODO: 下载模板文件
  message.info('正在下载模板...')
}

// 上传前检查
const beforeUpload = (file: any) => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.ms-excel'
  if (!isExcel) {
    message.error('只能上传 Excel 文件！')
  }
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('文件大小不能超过 10MB！')
  }
  return isExcel && isLt10M
}

// 移除文件
const handleRemoveFile = () => {
  importFileList.value = []
}

// 提交导入
const handleSubmitImport = async () => {
  if (importFileList.value.length === 0) {
    message.warning('请先上传文件')
    return
  }

  try {
    // TODO: 调用 API
    // const formData = new FormData()
    // formData.append('file', importFileList.value[0])
    // formData.append('deptId', selectedDept.value.id)
    // const res = await importDepartmentMembers(formData)

    // 模拟结果
    importResult.value = {
      type: 'success',
      message: '导入成功！共导入 10 条数据，成功 8 条，失败 2 条。',
    }

    await loadMembers()
  } catch (error) {
    importResult.value = {
      type: 'error',
      message: '导入失败，请检查文件格式',
    }
  }
}

// 设置权限
const handleSetPermissions = () => {
  permissionVisible.value = true
  loadPermissionData()
}

// 加载权限数据
const loadPermissionData = async () => {
  try {
    // TODO: 调用 API 加载菜单树和 API 列表
    menuTree.value = [
      {
        id: '1',
        title: '活动管理',
        children: [
          { id: '1-1', title: '活动列表' },
          { id: '1-2', title: '活动类型' },
        ],
      },
      {
        id: '2',
        title: '评审管理',
        children: [
          { id: '2-1', title: '评审规则' },
          { id: '2-2', title: '评审任务' },
        ],
      },
    ]

    apiList.value = [
      { id: 'api-1', name: '活动查询' },
      { id: 'api-2', name: '活动创建' },
      { id: 'api-3', name: '活动更新' },
      { id: 'api-4', name: '活动删除' },
    ]

    // TODO: 加载当前部门的权限配置
    permissionForm.dataScope = 'dept'
    permissionForm.customDepts = []
    permissionForm.menus = ['1-1', '2-1']
    permissionForm.apis = ['api-1', 'api-2']
  } catch (error) {
    message.error('加载权限数据失败')
  }
}

// 提交权限设置
const handleSubmitPermissions = async () => {
  try {
    // TODO: 调用 API
    // await updateDepartmentPermissions({
    //   deptId: selectedDept.value.id,
    //   ...permissionForm,
    // })

    message.success('权限设置成功')
    permissionVisible.value = false
  } catch (error) {
    message.error('权限设置失败')
  }
}

// 加载所有用户（用于选择负责人）
const loadAllUsers = async () => {
  try {
    // TODO: 调用 API
    // const res = await getAllUsers()
    // allUsers.value = res.data

    allUsers.value = [
      { id: '1', name: '张三', employeeNo: 'E001' },
      { id: '2', name: '李四', employeeNo: 'E002' },
    ]
  } catch (error) {
    message.error('加载用户列表失败')
  }
}

// 过滤用户选项
const filterUserOption = (input: string, option: any) => {
  return option.children[0].children.toLowerCase().includes(input.toLowerCase())
}

onMounted(() => {
  loadOrganizations()
  loadAllUsers()
})
</script>

<style scoped>
.department-management {
  height: calc(100vh - 120px);
}

.department-management :deep(.ant-card-body) {
  height: calc(100% - 57px);
  overflow-y: auto;
}

.department-management :deep(.ant-tree) {
  background: transparent;
}
</style>
