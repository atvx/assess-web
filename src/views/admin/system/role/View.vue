<!-- eslint-disable vue/multi-word-component-names -->
<!-- 角色详情查看组件 -->
<template>
  <a-modal
    :open="visible"
    title="角色详情"
    :width="800"
    :footer="null"
    @cancel="handleClose"
  >
    <div v-if="role">
      <!-- 基础信息 -->
      <a-descriptions title="基本信息" bordered :column="2" class="mb-6">
        <a-descriptions-item label="角色名称" :span="2">
          {{ role.roleName }}
        </a-descriptions-item>
        <a-descriptions-item label="角色编码" :span="2">
          {{ role.roleCode }}
        </a-descriptions-item>
        <a-descriptions-item label="是否评审角色">
          <a-tag :color="role.isReviewer ? 'blue' : 'default'">
            {{ role.isReviewer ? '是' : '否' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="role.status === 'enabled' ? 'green' : 'red'">
            {{ role.status === 'enabled' ? '启用' : '禁用' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="角色描述" :span="2">
          {{ role.description || '-' }}
        </a-descriptions-item>
      </a-descriptions>

      <!-- 其他信息 -->
      <a-descriptions title="其他信息" bordered :column="2">
        <a-descriptions-item label="所属组织" :span="2">
          {{ role.orgId || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" :span="2">
          {{ formatDate(role.createdAt) }}
        </a-descriptions-item>
        <a-descriptions-item label="更新时间" :span="2">
          {{ formatDate(role.updatedAt) }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import type { Role } from '@/api/role'
import dayjs from 'dayjs'

interface Props {
  visible: boolean
  role: Role | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
}

// 格式化日期
const formatDate = (date?: string) => {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '-'
}
</script>
