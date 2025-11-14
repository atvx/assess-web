import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { theme } from 'ant-design-vue'

export type ThemeMode = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  // 从 localStorage 读取保存的主题，默认为 light
  const mode = ref<ThemeMode>((localStorage.getItem('theme-mode') as ThemeMode) || 'light')
  
  // 初始化时设置 HTML class
  if (mode.value === 'dark') {
    document.documentElement.classList.add('dark')
  }
  
  // 计算属性
  const isDark = computed(() => mode.value === 'dark')
  
  // Ant Design Vue 主题配置
  const antdThemeConfig = computed(() => ({
    algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
  }))

  // 切换主题
  function toggleTheme() {
    mode.value = mode.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme-mode', mode.value)
    document.documentElement.classList.toggle('dark')
  }

  return {
    mode,
    isDark,
    antdThemeConfig,
    toggleTheme,
  }
})

