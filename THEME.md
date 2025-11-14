# 主题系统设计文档

## 📋 目录

- [概述](#概述)
- [设计原则](#设计原则)
- [技术架构](#技术架构)
- [使用指南](#使用指南)
- [最佳实践](#最佳实践)

---

## 概述

智审云项目采用**简洁高效**的主题系统，充分利用 **Tailwind CSS v4** 和 **Ant Design Vue** 的原生特性，实现浅色/深色主题无缝切换。

### 核心特性

- ✅ **原生优先** - 充分发挥 Tailwind 和 Ant Design 的内置能力
- ✅ **代码简洁** - 最小化自定义代码，易于维护
- ✅ **自动响应** - 主题切换无需刷新，自动持久化
- ✅ **性能优越** - 利用框架优化，无多余开销

---

## 设计原则

### 1. 框架优先（Framework First）

**优先使用框架原生特性，而不是自定义实现。**

- **Tailwind CSS**: 使用 `dark:` 前缀自动处理深色模式
- **Ant Design Vue**: 使用 `ConfigProvider` + `theme.darkAlgorithm`
- **最小化**: 只在必要时才添加自定义样式

### 2. 简洁实用（Simple & Practical）

**保持代码简单，避免过度工程。**

- 不使用复杂的 CSS 变量系统
- 不创建过多的抽象层
- 不添加不必要的过渡动画

### 3. 可维护性（Maintainability）

**代码清晰，易于理解和修改。**

- 使用 Tailwind 标准类名
- 遵循 Ant Design 最佳实践
- 最小化自定义样式

---

## 技术架构

### 架构图

```
主题系统
├── Tailwind CSS v4
│   ├── dark: 前缀自动处理深色模式
│   └── 标准 gray 色阶（50-950）
│
├── Ant Design Vue
│   ├── ConfigProvider（全局主题提供者）
│   └── theme.darkAlgorithm（深色算法）
│
└── Pinia Store
    ├── 管理主题模式状态（light/dark）
    └── 持久化到 localStorage
```

### 技术栈

| 技术 | 作用 | 配置位置 |
|------|------|----------|
| **Tailwind CSS v4** | 样式框架 | `src/assets/main.css` |
| **Ant Design Vue** | UI 组件库 | `src/App.vue` (ConfigProvider) |
| **Pinia** | 状态管理 | `src/stores/theme.ts` |
| **localStorage** | 持久化 | 浏览器本地存储 |

---

## 使用指南

### 1. 主题切换

#### 在组件中使用主题切换按钮

```vue
<script setup lang="ts">
import ThemeToggle from '@/components/common/ThemeToggle.vue'
</script>

<template>
  <header>
    <ThemeToggle />
  </header>
</template>
```

#### 编程方式切换主题

```typescript
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// 切换主题
themeStore.toggleTheme()

// 获取当前主题状态
const isDark = themeStore.isDark
const currentMode = themeStore.mode // 'light' | 'dark'
```

### 2. 使用 Tailwind CSS 样式

#### 推荐：使用 Tailwind 原生类

```vue
<template>
  <!-- 背景和文字 -->
  <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    内容
  </div>

  <!-- 卡片 -->
  <div class="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
    <h2 class="text-gray-900 dark:text-white font-bold">标题</h2>
    <p class="text-gray-600 dark:text-gray-400">描述文字</p>
  </div>

  <!-- 边框 -->
  <div class="border border-gray-200 dark:border-gray-800">
    内容
  </div>

  <!-- 链接/按钮 -->
  <a class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
    链接
  </a>
</template>
```

#### 常用颜色映射

| 用途 | 浅色模式 | 深色模式 |
|------|----------|----------|
| 页面背景 | `bg-gray-50` | `bg-gray-950` |
| 卡片背景 | `bg-white` | `bg-gray-900` |
| 主文字 | `text-gray-900` | `text-white` |
| 次级文字 | `text-gray-600` | `text-gray-400` |
| 辅助文字 | `text-gray-500` | `text-gray-500` |
| 边框 | `border-gray-200` | `border-gray-800` |

### 3. Ant Design Vue 组件

Ant Design Vue 组件通过 `ConfigProvider` 自动适配主题，无需额外配置。

```vue
<template>
  <!-- 所有 Ant Design 组件自动适配主题 -->
  <a-card>
    <a-statistic title="统计" :value="123" />
  </a-card>

  <a-button type="primary">按钮</a-button>

  <a-input placeholder="输入框" />
</template>
```

### 4. 自定义样式（谨慎使用）

只在必要时使用自定义样式：

```vue
<style scoped>
/* 使用 @apply 指令 */
.custom-card {
  @apply bg-white dark:bg-gray-900 rounded-lg shadow p-6;
}

/* 或使用 Tailwind 类，推荐 */
</style>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
    <!-- 推荐：直接使用 Tailwind 类 -->
  </div>
</template>
```

---

## 最佳实践

### ✅ 推荐做法

#### 1. 使用 Tailwind 标准类

```vue
<!-- ✅ 好：使用 Tailwind 标准类 -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  内容
</div>
```

#### 2. 使用 Ant Design 原生组件

```vue
<!-- ✅ 好：直接使用 Ant Design 组件 -->
<a-card>
  <a-statistic title="统计" :value="123" />
</a-card>
```

#### 3. 使用适当的过渡效果

```vue
<!-- ✅ 好：必要时添加过渡 -->
<a class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
  链接
</a>
```

#### 4. 语义化 HTML

```vue
<!-- ✅ 好：语义化标签 -->
<header class="bg-white dark:bg-gray-900">
  <nav>...</nav>
</header>

<main>...</main>

<footer class="bg-white dark:bg-gray-900">...</footer>
```

### ❌ 不推荐做法

#### 1. 不要使用自定义 CSS 变量

```vue
<!-- ❌ 不好：自定义 CSS 变量 -->
<div style="background: var(--custom-bg); color: var(--custom-text)">
  内容
</div>

<!-- ✅ 应该：使用 Tailwind 类 -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  内容
</div>
```

#### 2. 不要过度使用 !important

```vue
<!-- ❌ 不好：滥用 !important -->
<div class="!bg-white !text-black">内容</div>

<!-- ✅ 应该：使用适当的优先级 -->
<div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
  内容
</div>
```

#### 3. 不要添加不必要的过渡

```vue
<!-- ❌ 不好：所有元素都加过渡 -->
<div class="transition-all duration-300 ease-in-out">内容</div>

<!-- ✅ 应该：只在交互元素上添加 -->
<button class="hover:opacity-80 transition-opacity">按钮</button>
```

#### 4. 不要硬编码颜色

```vue
<!-- ❌ 不好：硬编码颜色值 -->
<div style="background: #ffffff; color: #000000">内容</div>

<!-- ✅ 应该：使用 Tailwind 色阶 -->
<div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
  内容
</div>
```

---

## 核心文件说明

### 1. `src/assets/main.css`

```css
@import "tailwindcss";

/* Tailwind CSS v4 主题配置 */
@theme {
  /* 深色模式使用 selector 策略 */
  --color-scheme: light dark;
  
  /* 自定义颜色 - 极简风格 */
  --color-bg-base: #ffffff;
  --color-bg-secondary: #fafafa;
  --color-text-base: #000000;
  --color-text-secondary: #666666;
  --color-border: #e5e5e5;
}

/* 全局样式 */
body {
  @apply bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-50;
}

/* 简洁滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-900;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-400 dark:bg-gray-600 rounded;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500 dark:bg-gray-500;
}
```

**特点**：
- 使用 Tailwind v4 的 `@theme` 配置
- 使用 `@apply` 指令应用 Tailwind 类
- 只定义必要的全局样式

### 2. `src/stores/theme.ts`

```typescript
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { theme } from 'ant-design-vue'

export type ThemeMode = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  // 从 localStorage 读取保存的主题，默认为 light
  const mode = ref<ThemeMode>(
    (localStorage.getItem('theme-mode') as ThemeMode) || 'light'
  )
  
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
```

**特点**：
- 简洁的状态管理
- 使用 `computed` 自动响应变化
- 只管理必要的状态和方法

### 3. `src/App.vue`

```vue
<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <ConfigProvider :theme="themeStore.antdThemeConfig">
    <router-view />
  </ConfigProvider>
</template>
```

**特点**：
- 使用 Ant Design 的 `ConfigProvider` 包裹整个应用
- 传递主题配置给所有子组件
- 简洁明了，无额外逻辑

### 4. `src/components/common/ThemeToggle.vue`

```vue
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
```

**特点**：
- 使用 Emoji 作为图标，避免图标库依赖
- 简单的切换逻辑
- 提供友好的 Tooltip 提示

---

## 调试与测试

### 检查当前主题模式

```javascript
// 在浏览器控制台运行
console.log('当前主题:', localStorage.getItem('theme-mode'))
console.log('HTML dark class:', document.documentElement.classList.contains('dark'))
```

### 清除主题缓存

```javascript
// 清除保存的主题，刷新页面后恢复默认
localStorage.removeItem('theme-mode')
```

### 手动切换主题

```javascript
// 手动切换 dark class
document.documentElement.classList.toggle('dark')
```

---

## 常见问题

### 1. 为什么不使用复杂的 CSS 变量系统？

**答：** Tailwind CSS 和 Ant Design Vue 已经提供了完善的主题系统，使用它们的原生能力可以：
- 减少自定义代码
- 提高可维护性
- 获得更好的性能
- 保持与框架的兼容性

### 2. 如何添加自定义颜色？

**答：** 优先使用 Tailwind 的标准色阶（gray-50 到 gray-950）。如果确实需要自定义，在 `@theme` 中添加：

```css
@theme {
  --color-brand: #1890ff;
}
```

然后在组件中使用：

```vue
<div class="text-[--color-brand]">内容</div>
```

### 3. Ant Design 组件样式不正确？

**答：** 确保 `src/App.vue` 中正确使用了 `ConfigProvider`，并且传递了 `antdThemeConfig`。

### 4. 主题切换不生效？

**答：** 检查以下几点：
1. `document.documentElement` 是否有 `dark` class
2. Tailwind 类是否使用了 `dark:` 前缀
3. localStorage 中是否正确保存了主题模式

---

## 总结

### 核心优势

1. **简洁** - 最小化自定义代码，充分利用框架特性
2. **高效** - 无多余抽象，性能优异
3. **易维护** - 代码清晰，遵循框架最佳实践
4. **可扩展** - 基于成熟框架，易于扩展

### 技术亮点

- ✨ **Tailwind CSS v4** - 使用 `dark:` 前缀和 `@theme` 配置
- ✨ **Ant Design Vue** - 使用 `ConfigProvider` 和 `theme.darkAlgorithm`
- ✨ **Pinia** - 简洁的状态管理
- ✨ **localStorage** - 自动持久化

---

**文档版本**：v2.0.0  
**最后更新**：2025-01-14  
**维护者**：智审云开发团队
