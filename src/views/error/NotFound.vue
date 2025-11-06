<template>
  <div class="not-found-page min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-300">404</h1>
      <h2 class="text-3xl font-semibold text-gray-700 mb-4">页面未找到</h2>
      <p class="text-gray-500 mb-8">抱歉，您访问的页面不存在</p>
      <a-space size="large">
        <a-button type="primary" size="large" @click="goHome"> 返回首页 </a-button>
        <a-button size="large" @click="goBack"> 返回上一页 </a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>
