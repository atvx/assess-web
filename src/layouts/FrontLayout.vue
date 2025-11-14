<template>
  <div class="front-layout min-h-screen theme-transition" style="background: var(--bg-secondary)">
    <!-- 前台头部 -->
    <header class="theme-transition" style="background: var(--bg-primary); border-bottom: 1px solid var(--border-color)">
      <div class="container mx-auto px-6">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link to="/" class="text-xl font-semibold theme-transition" style="color: var(--text-primary)">
              智审云
            </router-link>
          </div>

          <!-- 导航菜单 -->
          <nav class="hidden md:flex items-center space-x-8">
            <router-link
              to="/"
              class="theme-transition hover:opacity-70"
              style="color: var(--text-secondary)"
              active-class="font-medium"
              :style="$route.path === '/' ? { color: 'var(--text-primary)' } : {}"
            >
              首页
            </router-link>
            <router-link
              to="/about"
              class="theme-transition hover:opacity-70"
              style="color: var(--text-secondary)"
              active-class="font-medium"
              :style="$route.path === '/about' ? { color: 'var(--text-primary)' } : {}"
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
    <main class="container mx-auto px-6 py-12">
      <router-view />
    </main>

    <!-- 前台底部 -->
    <footer class="theme-transition mt-auto" style="background: var(--bg-primary); border-top: 1px solid var(--border-color)">
      <div class="container mx-auto px-6 py-8 text-center" style="color: var(--text-tertiary)">
        <p>&copy; 2025 智审云. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from '@/components/common/ThemeToggle.vue'
</script>

<style scoped>
.front-layout {
  display: flex;
  flex-direction: column;
}
</style>
