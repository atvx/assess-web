<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="review-rule-page">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">评审规则管理</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        配置评审的规则模板、评分标准、流程规则和异常处理机制
      </p>
    </div>

    <!-- 标签页 -->
    <a-tabs v-model:activeKey="activeTab" type="card" size="large">
      <!-- 1. 规则模板管理 -->
      <a-tab-pane key="template" tab="规则模板">
        <RuleTemplate />
      </a-tab-pane>

      <!-- 2. 评分项设置 -->
      <a-tab-pane key="scoring" tab="评分项设置">
        <RuleScoring />
      </a-tab-pane>

      <!-- 3. 评分规则配置 -->
      <a-tab-pane key="rules" tab="评分规则">
        <RuleConfig />
      </a-tab-pane>

      <!-- 4. 评分说明 -->
      <a-tab-pane key="description" tab="评分说明">
        <RuleDescription />
      </a-tab-pane>

      <!-- 5. 评审流程配置 -->
      <a-tab-pane key="workflow" tab="评审流程">
        <RuleWorkflow />
      </a-tab-pane>

      <!-- 6. 异常处理规则 -->
      <a-tab-pane key="exception" tab="异常处理">
        <RuleException />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RuleTemplate from './components/RuleTemplate.vue'
import RuleScoring from './components/RuleScoring.vue'
import RuleConfig from './components/RuleConfig.vue'
import RuleDescription from './components/RuleDescription.vue'
import RuleWorkflow from './components/RuleWorkflow.vue'
import RuleException from './components/RuleException.vue'

// 当前激活的标签页
const activeTab = ref('template')
</script>

<style scoped>
.review-rule-page {
  padding: 0;
}
</style>
