<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">技术栈示例页面</h1>

    <!-- Ant Design Vue 组件示例 -->
    <a-card title="Ant Design Vue 示例" class="mb-6">
      <a-space direction="vertical" :style="{ width: '100%' }">
        <a-button type="primary" @click="handleClick">主要按钮</a-button>
        <a-input v-model:value="inputValue" placeholder="请输入内容" />
        <a-alert
          v-if="showAlert"
          message="成功提示"
          type="success"
          closable
          @close="showAlert = false"
        />
      </a-space>
    </a-card>

    <!-- TailwindCSS 示例 -->
    <div class="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-2xl font-semibold text-blue-600 mb-3">TailwindCSS 样式示例</h2>
      <p class="text-gray-700 mb-4">这个卡片使用了 TailwindCSS 的实用类来设置样式</p>
      <div class="flex gap-2">
        <span class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          标签 1
        </span>
        <span class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
          标签 2
        </span>
        <span class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition">
          标签 3
        </span>
      </div>
    </div>

    <!-- Pinia Store 示例 -->
    <a-card title="Pinia 状态管理示例" class="mb-6">
      <p class="mb-2">
        当前计数: <strong>{{ counterStore.count }}</strong>
      </p>
      <a-space>
        <a-button @click="counterStore.increment">增加</a-button>
        <a-button @click="counterStore.decrement">减少</a-button>
      </a-space>
    </a-card>

    <!-- Axios 请求示例 -->
    <a-card title="Axios 请求示例">
      <a-space direction="vertical" :style="{ width: '100%' }">
        <a-button type="primary" :loading="loading" @click="fetchData"> 发送 API 请求 </a-button>
        <div v-if="apiData" class="mt-4 p-4 bg-gray-100 rounded">
          <pre class="text-sm">{{ apiData }}</pre>
        </div>
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCounterStore } from '@/stores/counter'
import { request } from '@/utils/request'

// Pinia store
const counterStore = useCounterStore()

// 响应式数据
const inputValue = ref('')
const showAlert = ref(false)
const loading = ref(false)
const apiData = ref<any>(null)

// 方法
const handleClick = () => {
  showAlert.value = true
}

const fetchData = async () => {
  loading.value = true
  try {
    // 这是一个示例 API 调用
    // 请替换为实际的 API 端点
    const data = await request.get('https://jsonplaceholder.typicode.com/todos/1')
    apiData.value = data
  } catch (error) {
    console.error('请求失败:', error)
  } finally {
    loading.value = false
  }
}
</script>
