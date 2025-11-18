# 文档目录结构

本文档展示项目文档的完整结构和组织方式。

## 📁 目录树

```
doc/
│
├── README.md                          # 📚 文档索引（入口文件）
│
├── guide/                             # 🚀 快速入门
│   ├── DEVELOPMENT_GUIDE.md           # 开发指南
│   └── PROJECT_STRUCTURE.md           # 项目结构说明
│
├── design/                            # 🎨 界面与交互
│   ├── THEME.md                       # 主题系统
│   ├── DASHBOARD_DESIGN.md            # 仪表盘设计
│   ├── MENU_STRUCTURE.md              # 菜单结构
│   └── PROFILE_CENTER.md              # 个人中心
│
├── feature/                           # 🔧 功能模块
│   ├── USER_MANAGEMENT.md             # 用户管理
│   ├── ORGANIZATION_DEPT.md           # 组织/部门管理
│   └── REVIEW_MANAGEMENT.md           # 评审管理
│
└── technical/                         # 📖 技术参考
    ├── COMPONENTS.md                  # 组件文档
    ├── API.md                         # API 接口
    ├── DICTIONARY.md                  # 数据字典
    └── UTILS.md                       # 工具函数
```

## 📊 文档统计

| 分类 | 文档数量 | 说明 |
|------|----------|------|
| 快速入门 | 2 | 开发环境、项目结构 |
| 界面与交互 | 4 | 主题、仪表盘、菜单、个人中心 |
| 功能模块 | 3 | 用户、组织、评审管理 |
| 技术参考 | 4 | 组件、API、字典、工具 |
| **总计** | **13** | **不含索引文件** |

## 🗂️ 分类说明

### 🚀 guide/ - 快速入门

**用途**: 帮助新成员快速了解项目和开始开发

**适用对象**: 
- 新加入的开发人员
- 需要了解项目结构的团队成员

**包含内容**:
- 开发环境搭建
- 代码规范和最佳实践
- 项目目录结构详解
- 模块划分说明

### 🎨 design/ - 界面与交互

**用途**: 说明系统的 UI/UX 设计和交互逻辑

**适用对象**:
- 前端开发人员
- UI/UX 设计师
- 产品经理

**包含内容**:
- 主题系统设计和实现
- 数据可视化方案
- 菜单和导航设计
- 用户交互流程

### 🔧 feature/ - 功能模块

**用途**: 详细说明系统的核心功能模块

**适用对象**:
- 开发人员（实现功能）
- 产品经理（了解功能）
- 系统管理员（配置系统）

**包含内容**:
- 用户和权限管理
- 组织架构管理（多租户）
- 评审流程管理
- 业务逻辑说明

### 📖 technical/ - 技术参考

**用途**: 提供技术实现的详细参考资料

**适用对象**:
- 开发人员
- 技术架构师

**包含内容**:
- 可复用组件库
- API 接口规范
- 数据字典配置
- 工具函数库

## 🔄 文档关联关系

```
开发指南 (guide/DEVELOPMENT_GUIDE.md)
    ↓ 引用
项目结构 (guide/PROJECT_STRUCTURE.md)
    ↓ 引用
组件文档 (technical/COMPONENTS.md)
    ↓ 引用
工具函数 (technical/UTILS.md)

用户管理 (feature/USER_MANAGEMENT.md)
    ← 引用 →
组织管理 (feature/ORGANIZATION_DEPT.md)
    ← 引用 →
API 接口 (technical/API.md)

主题系统 (design/THEME.md)
    ← 引用 →
组件文档 (technical/COMPONENTS.md)
```

## 📝 文档维护规则

### 新增文档

1. 确定文档类型，选择对应目录：
   - 开发指南类 → `guide/`
   - UI/交互设计类 → `design/`
   - 功能说明类 → `feature/`
   - 技术实现类 → `technical/`

2. 创建文档文件（使用大写+下划线命名）

3. 在 `doc/README.md` 中添加文档链接

4. 更新相关文档的交叉引用

### 文档命名规范

- 使用英文大写 + 下划线
- 名称简洁明了
- 体现文档主题

**示例**:
- ✅ `USER_MANAGEMENT.md`
- ✅ `API.md`
- ✅ `COMPONENTS.md`
- ❌ `user-management.md`
- ❌ `api-document.md`

### 目录选择规则

| 文档类型 | 目录 | 示例 |
|----------|------|------|
| 开发环境、规范 | `guide/` | 开发指南、编码规范 |
| UI/UX 设计 | `design/` | 主题、布局、交互 |
| 业务功能 | `feature/` | 用户管理、订单管理 |
| 技术实现 | `technical/` | 组件、API、工具 |

## 🔍 快速查找

### 我想了解...

- **如何开始开发？** → `guide/DEVELOPMENT_GUIDE.md`
- **项目目录是怎么组织的？** → `guide/PROJECT_STRUCTURE.md`
- **如何定制主题？** → `design/THEME.md`
- **仪表盘有哪些图表？** → `design/DASHBOARD_DESIGN.md`
- **如何管理用户权限？** → `feature/USER_MANAGEMENT.md`
- **如何配置组织结构？** → `feature/ORGANIZATION_DEPT.md`
- **有哪些可复用组件？** → `technical/COMPONENTS.md`
- **后端接口怎么调用？** → `technical/API.md`
- **如何配置字典数据？** → `technical/DICTIONARY.md`
- **有哪些工具函数可用？** → `technical/UTILS.md`

## 📊 文档更新记录

### v1.1.0 (2024-11-18)

- ✅ 按类型分类重组文档结构
- ✅ 创建 4 个分类目录
- ✅ 更新所有文档链接
- ✅ 新增文档结构说明

### v1.0.0 (2024-11-18)

- ✅ 初始文档创建
- ✅ 完成 13 个核心文档
- ✅ 建立文档索引

---

**返回**: [文档索引](./README.md) | [项目主页](../README.md)

**维护者**: 开发团队  
**最后更新**: 2024-11-18

