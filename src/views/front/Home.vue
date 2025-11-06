<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section
      class="hero bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 rounded-lg mb-8"
    >
      <div class="text-center">
        <h1 class="text-5xl font-bold mb-4">欢迎使用智审云</h1>
        <p class="text-xl mb-8 text-blue-100">专业的评审管理系统，让评审工作更高效</p>
        <a-space size="large">
          <a-button type="primary" size="large" ghost> 了解更多 </a-button>
          <router-link to="/login">
            <a-button size="large" class="bg-white text-blue-600"> 登录系统 </a-button>
          </router-link>
        </a-space>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features mb-12">
      <h2 class="text-3xl font-bold text-center mb-8 text-gray-800">核心功能</h2>
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :md="8">
          <a-card hoverable class="text-center h-full">
            <template #cover>
              <div class="p-8 bg-blue-50">
                <FileTextOutlined class="text-6xl text-blue-500" />
              </div>
            </template>
            <a-card-meta title="评审管理" description="高效的评审流程管理，支持多种评审类型" />
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :md="8">
          <a-card hoverable class="text-center h-full">
            <template #cover>
              <div class="p-8 bg-green-50">
                <TeamOutlined class="text-6xl text-green-500" />
              </div>
            </template>
            <a-card-meta title="协作评审" description="支持多人协作，实时评论和反馈" />
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :md="8">
          <a-card hoverable class="text-center h-full">
            <template #cover>
              <div class="p-8 bg-purple-50">
                <BarChartOutlined class="text-6xl text-purple-500" />
              </div>
            </template>
            <a-card-meta title="数据分析" description="全面的数据统计和分析报告" />
          </a-card>
        </a-col>
      </a-row>
    </section>

    <!-- Stats Section -->
    <section class="stats bg-white rounded-lg shadow-md p-8 mb-12">
      <h2 class="text-3xl font-bold text-center mb-8 text-gray-800">平台数据</h2>
      <a-row :gutter="[24, 24]" class="text-center">
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="累计评审" :value="1234" suffix="个">
            <template #prefix>
              <FileTextOutlined />
            </template>
          </a-statistic>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="注册用户" :value="5678" suffix="人">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-statistic>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="今日活跃" :value="234" suffix="人">
            <template #prefix>
              <TeamOutlined />
            </template>
          </a-statistic>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="满意度" :value="98.5" suffix="%">
            <template #prefix>
              <LikeOutlined />
            </template>
          </a-statistic>
        </a-col>
      </a-row>
    </section>

    <!-- CTA Section -->
    <section
      class="cta bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-12 text-center"
    >
      <h2 class="text-3xl font-bold mb-4">准备好开始了吗？</h2>
      <p class="text-xl mb-6 text-indigo-100">立即登录，体验高效的评审管理</p>
      <router-link to="/login">
        <a-button type="primary" size="large" ghost> 立即开始 </a-button>
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

<style scoped>
.hero {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}
</style>
