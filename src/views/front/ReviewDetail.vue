<template>
  <div class="review-detail-page">
    <a-card title="评审详情">
      <a-descriptions bordered>
        <a-descriptions-item label="评审ID">{{ route.params.id }}</a-descriptions-item>
        <a-descriptions-item label="评审标题">示例评审</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag color="green">进行中</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">2025-01-01</a-descriptions-item>
      </a-descriptions>

      <a-divider />

      <a-empty description="评审内容待开发" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
