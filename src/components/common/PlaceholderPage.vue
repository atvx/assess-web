<template>
  <div class="placeholder-page">
    <a-card class="rounded-lg shadow" :bordered="false">
      <template #title>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</span>
        </div>
      </template>

      <a-empty :description="description">
        <template #image>
          <inbox-outlined :style="{ fontSize: '80px', color: '#1890ff' }" />
        </template>
      </a-empty>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { InboxOutlined } from '@ant-design/icons-vue'

interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: '功能页面',
  description: '功能开发中，敬请期待...',
})
</script>

<style scoped>
/* 使用 Tailwind 类，无需自定义样式 */
</style>

