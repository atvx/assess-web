<!-- 组织详情查看组件 -->
<template>
  <a-modal
    :open="visible"
    title="组织详情"
    :width="900"
    :footer="null"
    @cancel="handleClose"
  >
    <div v-if="organization">
      <!-- 基础信息 -->
      <a-descriptions title="基本信息" bordered :column="2" class="mb-6">
        <a-descriptions-item label="组织名称" :span="2">
          {{ organization.name }}
        </a-descriptions-item>
        <a-descriptions-item label="组织编码/信用代码" :span="2">
          {{ organization.code }}
        </a-descriptions-item>
        <a-descriptions-item label="组织类型">
          <a-tag :color="getOrgTypeColor(organization.dictType || organization.type)">
            {{ organization.dictTypeName || getOrgTypeText(organization.type) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="组织规模">
          {{ organization.dictScaleName || getOrgScaleText(organization.dictScale || organization.scale) }}
        </a-descriptions-item>
        <a-descriptions-item label="所属行业" :span="2">
          {{ organization.dictIndustryName || organization.industry || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="organization.status === 'enabled' ? 'green' : 'red'">
            {{ organization.status === 'enabled' ? '启用' : '禁用' }}
          </a-tag>
        </a-descriptions-item>
      </a-descriptions>

      <!-- 联系信息 -->
      <a-descriptions title="联系信息" bordered :column="2" class="mb-6">
        <a-descriptions-item label="负责人">
          {{ organization.leader || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="负责人电话">
          {{ organization.leaderPhone || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="联系邮箱" :span="2">
          {{ organization.email || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="联系电话" :span="2">
          {{ organization.phone || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="所在地区" :span="2">
          {{ [organization.province, organization.city, organization.district].filter(Boolean).join(' ') || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="详细地址" :span="2">
          {{ organization.address || '-' }}
        </a-descriptions-item>
      </a-descriptions>

      <!-- 其他信息 -->
      <a-descriptions title="其他信息" bordered :column="2">
        <a-descriptions-item label="描述" :span="2">
          {{ organization.description || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" :span="2">
          {{ formatDate(organization.createdAt) }}
        </a-descriptions-item>
        <a-descriptions-item label="更新时间" :span="2">
          {{ formatDate(organization.updatedAt) }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import type { Organization } from '@/api/organization'
import type { DictItem } from '@/api/dict'
import dayjs from 'dayjs'

interface Props {
  visible: boolean
  organization: Organization | null
  dictCache: {
    orgType: DictItem[]
    orgScale: DictItem[]
    orgIndustry: DictItem[]
  }
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

// 获取字典项标签
const getDictLabel = (dictCode: string, value?: string) => {
  if (!value) return '-'
  let items: DictItem[] = []
  
  switch (dictCode) {
    case 'org_type':
      items = props.dictCache.orgType
      break
    case 'org_scale':
      items = props.dictCache.orgScale
      break
    case 'org_industry':
      items = props.dictCache.orgIndustry
      break
  }
  
  const item = items.find(item => item.value === value)
  return item?.label || value
}

// 获取字典项颜色
const getDictColor = (dictCode: string, value?: string) => {
  if (!value) return 'default'
  let items: DictItem[] = []
  
  switch (dictCode) {
    case 'org_type':
      items = props.dictCache.orgType
      break
  }
  
  const item = items.find(item => item.value === value)
  return item?.tagType || 'default'
}

// 获取组织类型相关信息
const getOrgTypeColor = (type?: string) => getDictColor('org_type', type)
const getOrgTypeText = (type?: string) => getDictLabel('org_type', type)
const getOrgScaleText = (scale?: string) => getDictLabel('org_scale', scale)

// 格式化日期
const formatDate = (date?: string) => {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '-'
}
</script>

