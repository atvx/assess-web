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
- **TailwindCSS** (^4.1.16) - 实用优先的 CSS 框架

### 工具库
- **Axios** (^1.13.2) - HTTP 客户端

### 构建工具
- **Vite** (^7.1.11) - 下一代前端构建工具

### 代码规范
- **ESLint** (^9.37.0) - 代码检查
- **Prettier** (3.6.2) - 代码格式化

## 🚀 快速开始

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
├── tailwind.config.js   # TailwindCSS 配置
├── postcss.config.js    # PostCSS 配置
├── vite.config.ts       # Vite 配置
├── eslint.config.ts     # ESLint 配置
├── .prettierrc.json     # Prettier 配置
└── tsconfig.json        # TypeScript 配置
```

## ⚙️ 配置说明

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
已配置 TailwindCSS，可直接在组件中使用实用类：
- 配置文件：`tailwind.config.js`
- 样式入口：`src/assets/main.css`
- PostCSS 配置：`postcss.config.js`

### Ant Design Vue
已全局注册，可在任何组件中直接使用所有 Ant Design Vue 组件。

## 🎯 项目特性

- ✅ Vue 3 Composition API
- ✅ TypeScript 支持
- ✅ Ant Design Vue 组件库
- ✅ TailwindCSS 实用类样式
- ✅ Pinia 状态管理
- ✅ Vue Router 路由管理
- ✅ Axios HTTP 请求封装
- ✅ ESLint + Prettier 代码规范
- ✅ Vitest 单元测试
- ✅ Vite 插件：Vue DevTools

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

## 📖 技术文档

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
