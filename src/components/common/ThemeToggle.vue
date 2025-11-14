<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

const handleToggle = () => {
  themeStore.toggleTheme()
}

const currentLabel = computed(() => {
  return themeStore.isDark ? '🌙' : '☀️'
})

const currentTooltip = computed(() => {
  return themeStore.isDark ? '深色主题' : '浅色主题'
})
</script>

<template>
  <a-tooltip :title="currentTooltip">
    <a-button 
      type="text" 
      size="large" 
      class="theme-toggle-btn"
      @click="handleToggle"
    >
      {{ currentLabel }}
    </a-button>
  </a-tooltip>
</template>

<style scoped>
.theme-toggle-btn {
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

