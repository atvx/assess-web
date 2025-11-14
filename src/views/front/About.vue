<template>
  <div class="about-page">
    <a-card class="mb-6 rounded-lg shadow">
      <template #title>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          关于我们
        </h2>
      </template>
      <p class="text-lg leading-relaxed mb-4 text-gray-600 dark:text-gray-400">
        智审云是一个专业的评审管理系统，致力于为企业和团队提供高效、便捷的评审解决方案。
      </p>
      <p class="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
        我们的使命是通过技术创新，让评审工作变得更加简单高效。
      </p>
    </a-card>

    <a-card class="rounded-lg shadow">
      <template #title>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          联系我们
        </h2>
      </template>
      <a-descriptions bordered :column="{ xs: 1, sm: 1, md: 3 }">
        <a-descriptions-item label="邮箱">contact@example.com</a-descriptions-item>
        <a-descriptions-item label="电话">400-000-0000</a-descriptions-item>
        <a-descriptions-item label="地址">中国 · 北京</a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
