<template>
  <div class="front-layout min-h-screen bg-gray-50">
    <!-- 前台头部 -->
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link to="/" class="text-xl font-bold text-blue-600"> 智审云 </router-link>
          </div>

          <!-- 导航菜单 -->
          <nav class="hidden md:flex space-x-8">
            <router-link
              to="/"
              class="text-gray-700 hover:text-blue-600 transition"
              active-class="text-blue-600 font-semibold"
            >
              首页
            </router-link>
            <router-link
              to="/about"
              class="text-gray-700 hover:text-blue-600 transition"
              active-class="text-blue-600 font-semibold"
            >
              关于
            </router-link>
          </nav>

          <!-- 登录按钮 -->
          <div>
            <router-link to="/login">
              <a-button type="primary">登录后台</a-button>
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- 主体内容区 -->
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>

    <!-- 前台底部 -->
    <footer class="bg-white border-t mt-auto">
      <div class="container mx-auto px-4 py-6 text-center text-gray-600">
        <p>&copy; 2025 智审云. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.front-layout {
  display: flex;
  flex-direction: column;
}
</style>
