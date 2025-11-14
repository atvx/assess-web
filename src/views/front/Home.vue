<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero py-20 mb-16 text-center">
      <h1 class="text-5xl md:text-6xl font-bold mb-6 theme-transition" style="color: var(--text-primary)">
        欢迎使用智审云
      </h1>
      <p class="text-xl md:text-2xl mb-10 theme-transition" style="color: var(--text-secondary)">
        专业的评审管理系统，让评审工作更高效
      </p>
      <div class="flex items-center justify-center gap-4">
        <a-button type="default" size="large">了解更多</a-button>
        <router-link to="/login">
          <a-button type="primary" size="large">登录系统</a-button>
        </router-link>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features mb-16">
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-12 theme-transition" style="color: var(--text-primary)">
        核心功能
      </h2>
      <a-row :gutter="[32, 32]">
        <a-col :xs="24" :sm="12" :md="8">
          <div class="text-center p-8 rounded-lg theme-transition card-shadow-sm h-full" style="background: var(--bg-primary)">
            <div class="mb-6">
              <FileTextOutlined class="text-5xl" style="color: var(--text-primary)" />
            </div>
            <h3 class="text-xl font-semibold mb-3 theme-transition" style="color: var(--text-primary)">
              评审管理
            </h3>
            <p class="theme-transition" style="color: var(--text-secondary)">
              高效的评审流程管理，支持多种评审类型
            </p>
          </div>
        </a-col>
        <a-col :xs="24" :sm="12" :md="8">
          <div class="text-center p-8 rounded-lg theme-transition card-shadow-sm h-full" style="background: var(--bg-primary)">
            <div class="mb-6">
              <TeamOutlined class="text-5xl" style="color: var(--text-primary)" />
            </div>
            <h3 class="text-xl font-semibold mb-3 theme-transition" style="color: var(--text-primary)">
              协作评审
            </h3>
            <p class="theme-transition" style="color: var(--text-secondary)">
              支持多人协作，实时评论和反馈
            </p>
          </div>
        </a-col>
        <a-col :xs="24" :sm="12" :md="8">
          <div class="text-center p-8 rounded-lg theme-transition card-shadow-sm h-full" style="background: var(--bg-primary)">
            <div class="mb-6">
              <BarChartOutlined class="text-5xl" style="color: var(--text-primary)" />
            </div>
            <h3 class="text-xl font-semibold mb-3 theme-transition" style="color: var(--text-primary)">
              数据分析
            </h3>
            <p class="theme-transition" style="color: var(--text-secondary)">
              全面的数据统计和分析报告
            </p>
          </div>
        </a-col>
      </a-row>
    </section>

    <!-- Stats Section -->
    <section class="stats mb-16 p-10 rounded-lg theme-transition card-shadow" style="background: var(--bg-primary)">
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-12 theme-transition" style="color: var(--text-primary)">
        平台数据
      </h2>
      <a-row :gutter="[32, 32]" class="text-center">
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="累计评审" :value="1234" suffix="个" />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="注册用户" :value="5678" suffix="人" />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="今日活跃" :value="234" suffix="人" />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="满意度" :value="98.5" suffix="%" />
        </a-col>
      </a-row>
    </section>

    <!-- CTA Section -->
    <section class="cta py-16 text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-4 theme-transition" style="color: var(--text-primary)">
        准备好开始了吗？
      </h2>
      <p class="text-xl mb-8 theme-transition" style="color: var(--text-secondary)">
        立即登录，体验高效的评审管理
      </p>
      <router-link to="/login">
        <a-button type="primary" size="large">立即开始</a-button>
      </router-link>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  FileTextOutlined,
  TeamOutlined,
  BarChartOutlined,
  UserOutlined,
  LikeOutlined,
} from '@ant-design/icons-vue'
</script>

<style scoped></style>
