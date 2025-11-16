<!-- 评分项设置 -->
<template>
  <a-card :bordered="false">
    <template #title>
      <span class="text-base font-semibold">评分项配置</span>
    </template>
    <template #extra>
      <a-button type="primary" @click="handleAdd">
        <template #icon><PlusOutlined /></template>
        新增评分项
      </a-button>
    </template>

    <!-- 评分项列表 -->
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="false"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'type'">
          <a-tag :color="record.type === 'required' ? 'red' : 'blue'">
            {{ record.type === 'required' ? '必评项' : '可选项' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'weight'">
          {{ record.weight }}%
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleMoveUp(record)">
              <UpOutlined />
            </a-button>
            <a-button type="link" size="small" @click="handleMoveDown(record)">
              <DownOutlined />
            </a-button>
            <a-button type="link" size="small" @click="handleEdit(record)">
              编辑
            </a-button>
            <a-popconfirm
              title="确定要删除此评分项吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(record.id)"
            >
              <a-button type="link" size="small" danger>
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 权重总和提示 -->
    <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded">
      <a-statistic
        title="权重总和"
        :value="totalWeight"
        suffix="%"
        :value-style="{ color: totalWeight === 100 ? '#3f8600' : '#cf1322' }"
      >
        <template #prefix>
          <CheckCircleOutlined v-if="totalWeight === 100" />
          <WarningOutlined v-else />
        </template>
      </a-statistic>
      <div class="text-xs mt-2 text-gray-600 dark:text-gray-400">
        权重总和必须等于100%
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  UpOutlined,
  DownOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons-vue'

const loading = ref(false)
const dataSource = ref([
  { id: '1', name: '创新性', type: 'required', weight: 30, maxScore: 100, sort: 1 },
  { id: '2', name: '实用性', type: 'required', weight: 30, maxScore: 100, sort: 2 },
  { id: '3', name: '完整性', type: 'required', weight: 25, maxScore: 100, sort: 3 },
  { id: '4', name: '表现力', type: 'optional', weight: 15, maxScore: 100, sort: 4 },
])

const columns = [
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
  { title: '评分项名称', dataIndex: 'name', key: 'name' },
  { title: '类型', key: 'type', width: 100 },
  { title: '权重', key: 'weight', width: 100 },
  { title: '满分值', dataIndex: 'maxScore', key: 'maxScore', width: 100 },
  { title: '操作', key: 'action', width: 250, fixed: 'right' },
]

const totalWeight = computed(() => {
  return dataSource.value.reduce((sum, item) => sum + item.weight, 0)
})

const handleAdd = () => {
  message.info('打开新增评分项弹窗')
}

const handleEdit = (record: unknown) => {
  message.info('编辑评分项：' + JSON.stringify(record))
}

const handleDelete = (id: string) => {
  message.success('删除评分项：' + id)
}

const handleMoveUp = (record: unknown) => {
  message.info('上移：' + JSON.stringify(record))
}

const handleMoveDown = (record: unknown) => {
  message.info('下移：' + JSON.stringify(record))
}
</script>

