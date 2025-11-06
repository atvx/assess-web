# 项目结构说明

## 📁 目录结构

```
assess-web/
├── src/
│   ├── layouts/              # 布局组件
│   │   ├── FrontLayout.vue      # 前台布局（公开访问）
│   │   └── AdminLayout.vue      # 后台布局（需登录）
│   │
│   ├── views/                # 页面组件
│   │   ├── front/               # 前台页面（公开）
│   │   │   ├── Home.vue            # 前台首页
│   │   │   ├── About.vue           # 关于页面
│   │   │   └── ReviewDetail.vue    # 评审详情
│   │   │
│   │   ├── admin/               # 后台页面（需登录）
│   │   │   ├── Dashboard.vue       # 后台仪表盘
│   │   │   ├── review/             # 评审管理模块
│   │   │   │   ├── List.vue           # 评审列表
│   │   │   │   ├── Create.vue         # 创建评审
│   │   │   │   └── Edit.vue           # 编辑评审
│   │   │   ├── user/               # 用户管理模块
│   │   │   │   └── List.vue           # 用户列表
│   │   │   └── settings/           # 系统设置模块
│   │   │       └── Basic.vue          # 基础设置
│   │   │
│   │   ├── auth/                # 认证页面
│   │   │   └── Login.vue           # 登录页
│   │   │
│   │   └── error/               # 错误页面
│   │       └── NotFound.vue        # 404页面
│   │
│   ├── components/           # 组件
│   │   ├── front/               # 前台专用组件
│   │   ├── admin/               # 后台专用组件
│   │   └── common/              # 通用组件
│   │
│   ├── router/               # 路由配置
│   │   ├── index.ts             # 路由主入口
│   │   ├── front.ts             # 前台路由
│   │   ├── admin.ts             # 后台路由
│   │   └── guards.ts            # 路由守卫（权限控制）
│   │
│   ├── stores/               # 状态管理（Pinia）
│   │   └── user.ts              # 用户状态（登录、权限）
│   │
│   ├── utils/                # 工具函数
│   │   └── request.ts           # Axios封装
│   │
│   ├── assets/               # 静态资源
│   │   └── main.css             # 全局样式（含TailwindCSS）
│   │
│   ├── App.vue               # 根组件
│   └── main.ts               # 应用入口
│
├── public/                   # 公共静态资源
├── tailwind.config.js        # TailwindCSS配置
├── postcss.config.js         # PostCSS配置
├── vite.config.ts            # Vite配置
├── eslint.config.ts          # ESLint配置
├── .prettierrc.json          # Prettier配置
├── tsconfig.json             # TypeScript配置
└── package.json              # 项目依赖
```

## 🎯 模块划分

### 前台模块（Front）
**访问权限：** 公开访问，无需登录

**功能：**
- 展示智审云的介绍和功能
- 公开的评审详情查看
- 引导用户登录后台管理

**路由前缀：** `/`

**布局：** `FrontLayout.vue`
- 顶部导航栏
- 内容区域
- 底部信息

### 后台模块（Admin）
**访问权限：** 需要登录认证

**功能：**
- 仪表盘：数据概览和快捷操作
- 评审管理：创建、编辑、查看、删除评审
- 用户管理：用户列表和权限管理
- 系统设置：系统配置

**路由前缀：** `/admin`

**布局：** `AdminLayout.vue`
- 左侧菜单栏（可折叠）
- 顶部面包屑和用户信息
- 内容区域
- 底部信息

## 🔐 权限控制

### 路由守卫
位置：`src/router/guards.ts`

**功能：**
1. 检查后台路由的登录状态
2. 未登录自动跳转到登录页
3. 已登录访问登录页自动跳转到后台首页
4. 保存目标路由，登录后自动跳转

### 用户状态管理
位置：`src/stores/user.ts`

**功能：**
- 登录/登出
- Token 管理
- 用户信息存储
- 权限判断

## 🚀 开发指南

### 添加新的前台页面
1. 在 `src/views/front/` 创建页面组件
2. 在 `src/router/front.ts` 添加路由配置
3. 在 `FrontLayout.vue` 中添加导航链接（如需要）

### 添加新的后台页面
1. 在 `src/views/admin/` 对应模块下创建页面组件
2. 在 `src/router/admin.ts` 添加路由配置
3. 在 `AdminLayout.vue` 的菜单中添加入口

### 添加新的功能模块
1. 在 `src/views/admin/` 创建模块目录
2. 创建该模块的页面组件
3. 配置路由
4. 更新侧边栏菜单

## 📝 注意事项

1. **路由命名规范**
   - 前台路由：使用 PascalCase，如 `Home`, `About`
   - 后台路由：使用 PascalCase + 模块前缀，如 `AdminDashboard`, `ReviewList`

2. **组件存放位置**
   - 前台专用组件：`src/components/front/`
   - 后台专用组件：`src/components/admin/`
   - 通用组件：`src/components/common/`

3. **状态管理**
   - 按功能模块创建独立的 store
   - 使用 Composition API 风格

4. **API 请求**
   - 统一使用 `src/utils/request.ts` 中封装的方法
   - 可按模块创建独立的 API 文件

## 🎨 样式规范

- 使用 TailwindCSS 实用类进行样式开发
- 使用 Ant Design Vue 组件库
- 组件内部样式使用 `<style scoped>`
- 全局样式放在 `src/assets/main.css`

## 🔧 后续扩展

可以考虑添加的目录：
- `src/api/` - API 接口管理
- `src/types/` - TypeScript 类型定义
- `src/hooks/` - 自定义 Composables
- `src/directives/` - 自定义指令
- `src/constants/` - 常量定义
- `src/composables/` - 组合式函数

