import { ref } from 'vue'
import { defineStore } from 'pinia'
import { theme as antdTheme } from 'ant-design-vue'

export type ThemeMode = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  // 从 localStorage 读取保存的主题，默认为 light
  const mode = ref<ThemeMode>((localStorage.getItem('theme-mode') as ThemeMode) || 'light')
  
  // 实际应用的主题
  const isDark = ref(mode.value === 'dark')
  
  // Ant Design Vue 主题配置
  const antdThemeConfig = ref({
    algorithm: isDark.value ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  })

  function updateTheme() {
    isDark.value = mode.value === 'dark'
    
    // 更新 HTML 类名用于 Tailwind CSS
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // 更新 Ant Design Vue 主题
    antdThemeConfig.value = {
      algorithm: isDark.value ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    }
  }

  function setMode(newMode: ThemeMode) {
    mode.value = newMode
    localStorage.setItem('theme-mode', newMode)
    updateTheme()
  }

  function toggleTheme() {
    setMode(mode.value === 'light' ? 'dark' : 'light')
  }

  // 初始化主题
  updateTheme()

  return {
    mode,
    isDark,
    antdThemeConfig,
    setMode,
    toggleTheme,
  }
})

