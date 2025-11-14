<template>
  <div class="front-layout min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
    <!-- 前台头部 -->
    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div class="container mx-auto px-6">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link to="/" class="text-xl font-semibold text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
              智审云
            </router-link>
          </div>

          <!-- 导航菜单 -->
          <nav class="hidden md:flex items-center space-x-8">
            <router-link
              to="/"
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              active-class="!text-gray-900 dark:!text-white font-medium"
            >
              首页
            </router-link>
            <router-link
              to="/about"
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              active-class="!text-gray-900 dark:!text-white font-medium"
            >
              关于
            </router-link>
          </nav>

          <!-- 主题切换和登录按钮 -->
          <div class="flex items-center gap-4">
            <ThemeToggle />
            <router-link to="/login">
              <a-button type="primary" size="middle">登录后台</a-button>
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- 主体内容区 -->
    <main class="container mx-auto px-6 py-12 flex-1">
      <router-view />
    </main>

    <!-- 前台底部 -->
    <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div class="container mx-auto px-6 py-8 text-center text-gray-500 dark:text-gray-400">
        <p>&copy; 2025 智审云. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from '@/components/common/ThemeToggle.vue'
</script>

<style scoped>
/* 无需自定义样式，全部使用 Tailwind 类 */
</style>
