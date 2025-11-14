# assess-web

一个基于 Vue 3 + Vite 构建的现代化前端项目。

## 📦 技术栈

### 核心框架
- **Vue 3** (^3.5.22) - 渐进式 JavaScript 框架
- **Vue Router** (^4.6.3) - 官方路由管理器
- **Pinia** (^3.0.3) - 状态管理库
- **TypeScript** (~5.9.0) - 类型支持

### UI 框架
- **Ant Design Vue** (^4.2.6) - 企业级 UI 组件库
- **TailwindCSS** (^4.1.0) - 实用优先的 CSS 框架
- **@tailwindcss/vite** (^4.1.0) - Tailwind CSS Vite 插件

### 工具库
- **Axios** (^1.13.2) - HTTP 客户端

### 构建工具
- **Vite** (^7.1.11) - 下一代前端构建工具

### 代码规范
- **ESLint** (^9.37.0) - 代码检查
- **Prettier** (3.6.2) - 代码格式化

## 🚀 快速开始

### 环境要求
- **Node.js**: ^20.19.0 或 >=22.12.0

### 安装依赖
```sh
npm install
```

### 开发环境
```sh
npm run dev
```

### 生产构建
```sh
npm run build
```

### 预览构建结果
```sh
npm run preview
```

### 代码检查与格式化
```sh
# 运行 ESLint 检查并自动修复
npm run lint

# 使用 Prettier 格式化代码
npm run format
```

### 运行测试
```sh
npm run test:unit
```

## 📁 项目结构

```
assess-web/
├── src/
│   ├── assets/          # 静态资源
│   │   └── main.css     # TailwindCSS 入口
│   ├── router/          # 路由配置
│   │   └── index.ts
│   ├── stores/          # Pinia 状态管理
│   │   └── counter.ts
│   ├── utils/           # 工具函数
│   │   └── request.ts   # Axios 配置
│   ├── views/           # 页面组件
│   │   └── Example.vue  # 示例页面
│   ├── App.vue          # 根组件
│   └── main.ts          # 应用入口
├── public/              # 公共静态资源
├── vite.config.ts       # Vite 配置（含 Tailwind CSS 插件）
├── eslint.config.ts     # ESLint 配置
├── .prettierrc.json     # Prettier 配置
├── tsconfig.json        # TypeScript 配置
└── vitest.config.ts     # Vitest 测试配置
```

## ⚙️ 配置说明

### Vite 配置
位于 `vite.config.ts`，包含以下插件：
- `@vitejs/plugin-vue` - Vue 3 单文件组件支持
- `@vitejs/plugin-vue-jsx` - JSX 支持
- `vite-plugin-vue-devtools` - Vue DevTools 集成
- `@tailwindcss/vite` - Tailwind CSS v4 集成

### Axios 配置
项目已封装 Axios 实例，位于 `src/utils/request.ts`，包含：
- 基础 URL 配置（通过环境变量）
- 请求/响应拦截器
- Token 自动注入
- 统一错误处理

### 环境变量
创建 `.env` 文件配置环境变量：
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### TailwindCSS
已配置 TailwindCSS v4，采用全新架构：
- **配置方式**：通过 `@tailwindcss/vite` 插件集成到 Vite
- **样式入口**：`src/assets/main.css` 中使用 `@import "tailwindcss";`
- **无需配置文件**：不再需要 `tailwind.config.js` 和 `postcss.config.js`
- **更快的构建速度**：原生 Vite 插件集成
- **向后兼容**：所有现有的 Tailwind 类名仍然有效

### Ant Design Vue
已全局注册，可在任何组件中直接使用所有 Ant Design Vue 组件。

## 🎯 项目特性

- ✅ **Vue 3 Composition API** - 现代化的组件开发方式
- ✅ **TypeScript** - 完整的类型支持和类型检查
- ✅ **Ant Design Vue** - 企业级 UI 组件库
- ✅ **TailwindCSS v4** - 最新版本，通过 Vite 插件集成
- ✅ **主题切换** - 一键切换浅色/深色主题
- ✅ **Pinia** - 轻量级状态管理
- ✅ **Vue Router** - 路由管理和导航守卫
- ✅ **Axios** - HTTP 请求封装和拦截器
- ✅ **ESLint + Prettier** - 代码质量和格式化
- ✅ **Vitest** - 快速的单元测试框架
- ✅ **Vue DevTools** - 开发调试工具集成
- ✅ **Node.js 20+/22+** - 支持最新的 Node.js 版本

## 📚 示例页面

访问 `src/views/Example.vue` 查看技术栈集成示例，包括：
- Ant Design Vue 组件使用
- TailwindCSS 样式应用
- Pinia 状态管理
- Axios HTTP 请求

## 🛠️ IDE 配置

### 推荐 IDE
[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 

**注意**：请禁用 Vetur 扩展以避免冲突。

### 推荐浏览器扩展

**Chromium 内核浏览器（Chrome、Edge、Brave 等）：**
- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [开启自定义对象格式化](http://bit.ly/object-formatters)

**Firefox：**
- [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [开启自定义对象格式化](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## 📖 项目文档

- [开发指南](./DEVELOPMENT_GUIDE.md) - 开发流程和最佳实践
- [项目结构](./PROJECT_STRUCTURE.md) - 目录结构说明
- [主题系统](./THEME.md) - 主题设计文档
- [用户管理](./USER_MANAGEMENT.md) - 用户管理功能说明

## 📚 技术文档

- [Vue 3](https://cn.vuejs.org/)
- [Vite](https://cn.vitejs.dev/)
- [Ant Design Vue](https://antdv.com/components/overview-cn)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Pinia](https://pinia.vuejs.org/zh/)
- [Axios](https://axios-http.com/zh/)
- [Vue Router](https://router.vuejs.org/zh/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## 💡 类型支持

TypeScript 默认无法处理 `.vue` 文件的类型信息，因此我们使用 `vue-tsc` 进行类型检查。在编辑器中，需要安装 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 插件以支持 `.vue` 文件的类型识别。

## 📝 更多配置

更多配置选项请参考 [Vite 配置文档](https://vite.dev/config/)。
