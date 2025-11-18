# 活动评审管理系统 (Assess Web)

一个基于 Vue 3 + TypeScript + Vite 构建的现代化活动评审管理系统，适用于学校、政府、企业等各类组织的活动评审场景。

## ✨ 项目特性

- 🎯 **多租户架构** - 支持学校、政府、企业、机构等多种组织类型
- 👥 **完整的用户体系** - 用户管理、角色权限、部门组织
- 📋 **活动评审流程** - 活动申报、专家评审、结果公示
- 🎨 **现代化 UI** - 基于 Ant Design Vue 的企业级界面
- 🌓 **主题切换** - 支持浅色/深色主题无缝切换
- 📱 **响应式设计** - 适配桌面端和移动端
- 🔒 **安全可靠** - 完整的权限控制和数据保护

## 🚀 快速开始

### 环境要求

- **Node.js**: ^20.19.0 或 >=22.12.0
- **npm**: 建议使用最新版本

### 安装依赖

```bash
npm install
```

### 开发环境

```bash
npm run dev
```

访问 http://localhost:5173 查看应用。

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

### 代码检查

```bash
# ESLint 检查并自动修复
npm run lint

# Prettier 格式化代码
npm run format
```

### 运行测试

```bash
npm run test:unit
```

## 📦 技术栈

### 核心框架

- **Vue 3** (^3.5.22) - Composition API + `<script setup>`
- **TypeScript** (~5.9.0) - 完整的类型支持
- **Vite** (^7.1.11) - 极速的开发体验
- **Pinia** (^3.0.3) - 轻量级状态管理
- **Vue Router** (^4.6.3) - 路由管理

### UI 框架

- **Ant Design Vue** (^4.2.6) - 企业级 UI 组件库
- **TailwindCSS** (^4.1.0) - 实用优先的 CSS 框架

### 工具库

- **Axios** (^1.13.2) - HTTP 客户端封装
- **Day.js** - 日期时间处理

### 开发工具

- **ESLint** (^9.37.0) - 代码检查
- **Prettier** (3.6.2) - 代码格式化
- **Vitest** - 单元测试框架
- **Vue DevTools** - 开发调试工具

## 📁 项目结构

```
assess-web/
├── doc/                          # 📚 项目文档
│   ├── README.md                 # 文档索引
│   ├── DEVELOPMENT_GUIDE.md      # 开发指南
│   ├── PROJECT_STRUCTURE.md      # 项目结构详解
│   ├── COMPONENTS.md             # 组件文档
│   ├── API.md                    # API 接口文档
│   ├── THEME.md                  # 主题系统
│   ├── USER_MANAGEMENT.md        # 用户管理
│   ├── ORGANIZATION_DEPT.md      # 组织/部门管理
│   ├── DASHBOARD_DESIGN.md       # 仪表盘设计
│   ├── MENU_STRUCTURE.md         # 菜单结构
│   └── PROFILE_CENTER.md         # 个人中心
│
├── src/
│   ├── api/                      # API 接口定义
│   │   ├── auth.ts               # 认证接口
│   │   ├── user.ts               # 用户接口
│   │   ├── organization.ts       # 组织接口
│   │   ├── department.ts         # 部门接口
│   │   └── dict.ts               # 字典接口
│   │
│   ├── assets/                   # 静态资源
│   │   ├── data/                 # 数据文件
│   │   │   └── pcd.json          # 省市区数据
│   │   └── main.css              # 全局样式
│   │
│   ├── components/               # 组件
│   │   ├── common/               # 通用组件
│   │   │   ├── DictSelect.vue    # 字典选择器
│   │   │   ├── RegionCascader.vue # 地区级联选择器
│   │   │   └── ThemeToggle.vue   # 主题切换
│   │   ├── admin/                # 后台组件
│   │   └── front/                # 前台组件
│   │
│   ├── layouts/                  # 布局组件
│   │   ├── AdminLayout.vue       # 后台布局
│   │   └── FrontLayout.vue       # 前台布局
│   │
│   ├── router/                   # 路由配置
│   │   ├── index.ts              # 路由主文件
│   │   ├── admin.ts              # 后台路由
│   │   ├── front.ts              # 前台路由
│   │   └── guards.ts             # 路由守卫
│   │
│   ├── stores/                   # 状态管理
│   │   ├── user.ts               # 用户状态
│   │   └── theme.ts              # 主题状态
│   │
│   ├── utils/                    # 工具函数
│   │   ├── request.ts            # Axios 封装
│   │   └── region.ts             # 地区工具
│   │
│   ├── views/                    # 页面组件
│   │   ├── admin/                # 后台页面
│   │   ├── front/                # 前台页面
│   │   ├── auth/                 # 认证页面
│   │   └── error/                # 错误页面
│   │
│   ├── App.vue                   # 根组件
│   └── main.ts                   # 应用入口
│
├── public/                       # 公共资源
├── vite.config.ts                # Vite 配置
├── tsconfig.json                 # TypeScript 配置
├── eslint.config.ts              # ESLint 配置
└── .prettierrc.json              # Prettier 配置
```

## 📖 文档导航

完整的项目文档请访问 [doc](./doc) 目录，文档已按类型分类：

### 🚀 快速入门 (`doc/guide/`)

- [开发指南](./doc/guide/DEVELOPMENT_GUIDE.md) - 开发流程、规范和最佳实践
- [项目结构](./doc/guide/PROJECT_STRUCTURE.md) - 详细的目录结构和模块说明

### 🎨 界面与交互 (`doc/design/`)

- [主题系统](./doc/design/THEME.md) - 主题设计和定制
- [仪表盘设计](./doc/design/DASHBOARD_DESIGN.md) - 数据统计和可视化
- [菜单结构](./doc/design/MENU_STRUCTURE.md) - 菜单配置和权限
- [个人中心](./doc/design/PROFILE_CENTER.md) - 用户个人信息管理

### 🔧 功能模块 (`doc/feature/`)

- [用户管理](./doc/feature/USER_MANAGEMENT.md) - 用户、角色、权限管理
- [组织管理](./doc/feature/ORGANIZATION_DEPT.md) - 组织、部门管理（多租户）
- [评审管理](./doc/feature/REVIEW_MANAGEMENT.md) - 活动评审流程和规则

### 📖 技术参考 (`doc/technical/`)

- [组件文档](./doc/technical/COMPONENTS.md) - 通用组件使用说明
- [API 接口](./doc/technical/API.md) - 后端接口文档
- [数据字典](./doc/technical/DICTIONARY.md) - 系统字典配置和使用
- [工具函数](./doc/technical/UTILS.md) - 常用工具函数库

## 🛠️ 开发工具

### 推荐 IDE

- [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### 推荐扩展

- **Vue.js devtools** - Vue 调试工具
  - [Chrome](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

### VS Code 扩展

- **Vue - Official** (Vue.volar) - Vue 3 语言支持
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Tailwind CSS IntelliSense** - Tailwind 智能提示

## ⚙️ 配置说明

### 环境变量

创建 `.env` 文件：

```env
# API 基础地址
VITE_API_BASE_URL=http://localhost:3000/api

# 应用标题
VITE_APP_TITLE=活动评审管理系统
```

### 后端 API

本项目需要配合后端 API 使用，请确保后端服务已启动并配置正确的 API 地址。

API 接口文档：[doc/API.md](./doc/API.md)

## 🎯 核心功能

### 前台功能

- 🏠 首页展示
- 📋 活动浏览
- 📝 活动申报
- 👀 评审结果查看

### 后台功能

#### 系统管理

- 👥 用户管理 - 用户增删改查、状态管理
- 🏢 组织管理 - 多租户组织管理
- 🏛️ 部门管理 - 树形部门结构
- 🎭 角色管理 - 角色权限配置
- 🔐 权限管理 - 细粒度权限控制
- 📚 菜单管理 - 动态菜单配置
- 📖 字典管理 - 系统字典维护

#### 评审管理

- 🎯 活动管理 - 活动创建、编辑、审核
- 📋 评审规则 - 评分规则配置
- 👨‍🏫 专家管理 - 评审专家维护
- 📊 评审任务 - 任务分配和进度
- 🔄 复审管理 - 二次评审流程

#### 数据管理

- 📈 数据统计 - 多维度数据分析
- 📊 数据报表 - 可视化报表
- 📝 操作日志 - 完整的审计日志

#### 个人中心

- 👤 个人信息 - 资料编辑
- 🔑 密码修改 - 安全设置
- 📬 我的消息 - 站内消息

## 🔒 权限系统

系统采用 **RBAC（基于角色的访问控制）** 模型：

- **用户（User）** - 系统使用者
- **角色（Role）** - 权限集合
- **权限（Permission）** - 具体操作权限
- **菜单（Menu）** - 页面访问权限

支持：
- ✅ 角色多选
- ✅ 权限继承
- ✅ 动态菜单
- ✅ 按钮级权限控制

详细说明：[用户管理文档](./doc/USER_MANAGEMENT.md)

## 🌈 主题系统

支持浅色/深色主题无缝切换，主题配置完全基于 Ant Design Vue 的 Design Token 系统。

- 🎨 主题切换组件
- 💾 主题偏好持久化
- 🔄 实时切换无闪烁
- 🎯 完整的主题定制

详细说明：[主题系统文档](./doc/THEME.md)

## 📱 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 代码规范

- 遵循 ESLint 和 Prettier 配置
- 使用 TypeScript 编写代码
- 组件使用 Composition API + `<script setup>`
- 提交信息遵循 [约定式提交](https://www.conventionalcommits.org/)

## 📄 许可证

MIT License
