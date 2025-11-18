# 开发指南

## 🎯 项目概述

这是一个评审系统，分为**前台展示**和**后台管理**两部分。

- **前台**：公开访问，展示智审云的介绍和功能
- **后台**：需要登录，用于管理评审、用户和系统设置

## 🚀 快速开始

### 环境要求
- **Node.js**: ^20.19.0 或 >=22.12.0
- **包管理器**: npm

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 访问应用
- 前台首页：http://localhost:5173/
- 登录页面：http://localhost:5173/login
- 后台管理：http://localhost:5173/admin （需要先登录）

### 4. 演示账号
```
用户名：admin
密码：任意密码（演示模式）
```

## 📁 项目结构

详细的项目结构说明请查看 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

### 核心目录
```
src/
├── layouts/          # 前台/后台布局
├── views/           # 页面组件
│   ├── front/          # 前台页面
│   ├── admin/          # 后台页面
│   ├── auth/           # 登录页面
│   └── error/          # 错误页面
├── components/      # 组件
│   ├── front/          # 前台组件
│   ├── admin/          # 后台组件
│   └── common/         # 通用组件
├── router/          # 路由配置
├── stores/          # 状态管理
└── utils/           # 工具函数
```

## 🔐 认证流程

### 登录
1. 访问 `/login` 页面
2. 输入用户名和密码（演示模式接受任意密码）
3. 登录成功后跳转到后台首页 `/admin/dashboard`
4. Token 和用户信息保存在 localStorage

### 路由守卫
- 访问 `/admin/*` 路由需要登录
- 未登录自动跳转到登录页
- 已登录访问登录页自动跳转到后台首页

### 退出登录
- 点击后台右上角用户头像
- 选择"退出登录"
- 清除本地存储，跳转到登录页

## 🛠️ 开发流程

### 添加新页面

#### 前台页面
1. 在 `src/views/front/` 创建页面组件
2. 在 `src/router/front.ts` 添加路由
```typescript
{
  path: 'new-page',
  name: 'NewPage',
  component: () => import('@/views/front/NewPage.vue'),
  meta: {
    title: '新页面',
  },
}
```

#### 后台页面
1. 在 `src/views/admin/` 创建页面组件
2. 在 `src/router/admin.ts` 添加路由
3. 在 `src/layouts/AdminLayout.vue` 的菜单中添加入口

### 添加新组件
- 前台专用：`src/components/front/`
- 后台专用：`src/components/admin/`
- 通用组件：`src/components/common/`

### 状态管理
使用 Pinia，按功能模块创建 store：
```typescript
// src/stores/example.ts
import { defineStore } from 'pinia'

export const useExampleStore = defineStore('example', () => {
  // 状态、计算属性、方法
  return { /* ... */ }
})
```

### API 请求
使用封装好的 request 工具：
```typescript
import { request } from '@/utils/request'

// GET 请求
const data = await request.get('/api/endpoint')

// POST 请求
const result = await request.post('/api/endpoint', { data })
```

## 🎨 UI 开发

### 使用 Ant Design Vue
```vue
<template>
  <a-button type="primary">按钮</a-button>
  <a-table :columns="columns" :data-source="data" />
</template>
```

### 使用 TailwindCSS
```vue
<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-4">标题</h1>
  </div>
</template>
```

**注意**：项目使用 TailwindCSS v4，通过 `@tailwindcss/vite` 插件集成，无需额外配置文件。

## 📝 代码规范

### 运行 ESLint
```bash
npm run lint
```

### 运行 Prettier
```bash
npm run format
```

### 提交前检查
建议在提交代码前运行：
```bash
npm run lint && npm run format
```

## 🧪 测试

运行单元测试：
```bash
npm run test:unit
```

## 📦 构建部署

### 生产构建
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 🔧 配置

### 环境变量
创建 `.env` 文件：
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Vite 配置
编辑 `vite.config.ts`，当前包含的插件：
- `@vitejs/plugin-vue` - Vue 3 SFC 支持
- `@vitejs/plugin-vue-jsx` - JSX 支持
- `vite-plugin-vue-devtools` - DevTools 集成
- `@tailwindcss/vite` - Tailwind CSS v4 集成

### 路由配置
- `src/router/front.ts` - 前台路由
- `src/router/admin.ts` - 后台路由
- `src/router/guards.ts` - 路由守卫

## 📚 技术栈

- **Vue 3** (^3.5.22) + **TypeScript** (~5.9.0)
- **Vite** (^7.1.11)
- **Ant Design Vue** (^4.2.6)
- **TailwindCSS** v4 (^4.1.0) + **@tailwindcss/vite** (^4.1.0)
- **Pinia** (^3.0.3)
- **Vue Router** (^4.6.3)
- **Axios** (^1.13.2)
- **Vitest** (^3.2.4) + **ESLint** (^9.37.0) + **Prettier** (3.6.2)

详细说明请查看 [README.md](./README.md)

## 🐛 常见问题

### 1. 登录后无法访问后台
检查 localStorage 中是否有 token：
```javascript
localStorage.getItem('token')
```

### 2. 样式不生效
确保已正确配置：
- 检查 `vite.config.ts` 中是否包含 `tailwindcss()` 插件
- 确保在 `main.ts` 中导入了 `./assets/main.css`
- 检查 `src/assets/main.css` 中是否有 `@import "tailwindcss";`

### 3. 路由跳转失败
检查路由配置和路由守卫逻辑

## 📖 相关文档

- [项目结构说明](./PROJECT_STRUCTURE.md)
- [技术栈说明](./README.md)
- [Vue 3 文档](https://cn.vuejs.org/)
- [Ant Design Vue 文档](https://antdv.com/)
- [TailwindCSS 文档](https://tailwindcss.com/)

