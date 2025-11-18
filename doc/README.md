# 项目文档索引

欢迎查阅活动评审管理系统的技术文档。本目录包含了项目的完整文档，按照类型分类，帮助您快速了解和使用本系统。

## 📁 文档目录结构

```
doc/
├── guide/          # 🚀 快速入门
├── design/         # 🎨 界面与交互
├── feature/        # 🔧 功能模块
└── technical/      # 📖 技术参考
```

## 📚 文档导航

### 🚀 快速入门 (`guide/`)

| 文档 | 描述 | 适用对象 |
|------|------|----------|
| [开发指南](./guide/DEVELOPMENT_GUIDE.md) | 开发流程、规范和最佳实践 | 开发人员 |
| [项目结构](./guide/PROJECT_STRUCTURE.md) | 详细的目录结构和模块说明 | 开发人员、新成员 |

### 🎨 界面与交互 (`design/`)

| 文档 | 描述 | 适用对象 |
|------|------|----------|
| [主题系统](./design/THEME.md) | 主题设计、切换机制和定制方法 | 开发人员、设计师 |
| [仪表盘设计](./design/DASHBOARD_DESIGN.md) | 数据可视化和仪表盘布局 | 开发人员、产品经理 |
| [菜单结构](./design/MENU_STRUCTURE.md) | 菜单配置和权限控制 | 开发人员 |
| [个人中心](./design/PROFILE_CENTER.md) | 用户个人信息管理功能 | 开发人员 |

### 🔧 功能模块 (`feature/`)

| 文档 | 描述 | 适用对象 |
|------|------|----------|
| [用户管理](./feature/USER_MANAGEMENT.md) | 用户、角色、权限管理 | 开发人员、管理员 |
| [组织管理](./feature/ORGANIZATION_DEPT.md) | 组织、部门管理（多租户） | 开发人员、管理员 |
| [评审管理](./feature/REVIEW_MANAGEMENT.md) | 活动评审流程和规则 | 开发人员、产品经理 |

### 📖 技术参考 (`technical/`)

| 文档 | 描述 | 适用对象 |
|------|------|----------|
| [组件文档](./technical/COMPONENTS.md) | 通用组件使用说明和示例 | 开发人员 |
| [API 接口](./technical/API.md) | 后端接口文档和数据结构 | 前端/后端开发人员 |
| [数据字典](./technical/DICTIONARY.md) | 系统字典配置和使用 | 开发人员、管理员 |
| [工具函数](./technical/UTILS.md) | 常用工具函数库 | 开发人员 |

## 📂 按角色分类

### 👨‍💻 开发人员必读

1. [开发指南](./guide/DEVELOPMENT_GUIDE.md) - 开发环境、流程和规范
2. [项目结构](./guide/PROJECT_STRUCTURE.md) - 理解项目架构
3. [组件文档](./technical/COMPONENTS.md) - 学习使用通用组件
4. [API 接口](./technical/API.md) - 了解后端接口

### 🎨 UI/UX 设计师必读

1. [主题系统](./design/THEME.md) - 主题设计和定制
2. [仪表盘设计](./design/DASHBOARD_DESIGN.md) - 数据可视化设计
3. [组件文档](./technical/COMPONENTS.md) - 了解可用组件

### 📋 产品经理必读

1. [功能模块文档](./feature/) - 了解系统功能
2. [仪表盘设计](./design/DASHBOARD_DESIGN.md) - 数据统计方案
3. [用户管理](./feature/USER_MANAGEMENT.md) - 权限体系

### 🔧 系统管理员必读

1. [用户管理](./feature/USER_MANAGEMENT.md) - 用户和权限配置
2. [组织管理](./feature/ORGANIZATION_DEPT.md) - 组织架构管理
3. [数据字典](./technical/DICTIONARY.md) - 字典数据维护

## 🔍 快速查找

### 常见问题

**Q: 如何开始开发？**  
A: 请阅读 [开发指南](./guide/DEVELOPMENT_GUIDE.md)

**Q: 如何使用通用组件？**  
A: 请查看 [组件文档](./technical/COMPONENTS.md)

**Q: 如何配置主题？**  
A: 请参考 [主题系统](./design/THEME.md)

**Q: 如何调用后端接口？**  
A: 请查阅 [API 接口](./technical/API.md)

**Q: 如何管理用户权限？**  
A: 请参考 [用户管理](./feature/USER_MANAGEMENT.md)

**Q: 如何配置组织结构？**  
A: 请查看 [组织管理](./feature/ORGANIZATION_DEPT.md)

### 关键字索引

- **组件**: [组件文档](./technical/COMPONENTS.md)
  - DictSelect（字典选择器）
  - RegionCascader（地区选择器）
  - ThemeToggle（主题切换）

- **API**: [API 接口](./technical/API.md)
  - 用户接口
  - 组织接口
  - 字典接口

- **权限**: [用户管理](./feature/USER_MANAGEMENT.md)
  - RBAC 模型
  - 角色配置
  - 权限控制

- **主题**: [主题系统](./design/THEME.md)
  - 浅色主题
  - 深色主题
  - 主题定制

- **数据**: [数据字典](./technical/DICTIONARY.md)
  - 字典配置
  - 字典管理
  - 字典使用

## 📝 文档规范

### 文档命名

- 使用英文大写 + 下划线命名：`USER_MANAGEMENT.md`
- 文件名简洁明了，能反映文档内容
- 特殊文档使用常见约定：`README.md`, `API.md`

### 文档分类

| 目录 | 说明 | 适用文档类型 |
|------|------|-------------|
| `guide/` | 快速入门 | 开发指南、项目结构等 |
| `design/` | 界面与交互 | 主题、仪表盘、菜单、个人中心等 |
| `feature/` | 功能模块 | 用户管理、组织管理、评审管理等 |
| `technical/` | 技术参考 | 组件、API、工具函数、字典等 |

### 文档结构

每个文档应包含以下部分（根据需要）：

1. **标题和简介** - 说明文档用途
2. **目录** - 复杂文档需要目录
3. **核心内容** - 详细说明和示例
4. **注意事项** - 重要提示
5. **相关链接** - 相关文档链接
6. **维护信息** - 维护者和更新时间

### 文档维护

- 每次修改需更新文档底部的"最后更新"时间
- 重大变更需在文档顶部添加更新说明
- 保持文档与代码同步更新

## 🔗 外部资源

### 官方文档

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Vite 官方文档](https://cn.vitejs.dev/)
- [Ant Design Vue](https://antdv.com/components/overview-cn)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Pinia](https://pinia.vuejs.org/zh/)
- [Vue Router](https://router.vuejs.org/zh/)

### 技术社区

- [Vue.js 中文社区](https://cn.vuejs.org/community/)
- [Vite 中文社区](https://cn.vitejs.dev/guide/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/vue.js)

## 🤝 贡献文档

欢迎贡献文档！如果您发现文档有错误或需要改进，请：

1. 创建 Issue 说明问题
2. 提交 Pull Request 修改文档
3. 确保文档格式规范
4. 更新"最后更新"时间
5. 将文档放入正确的分类目录

### 文档编写建议

- ✅ 使用清晰的标题层级
- ✅ 提供代码示例
- ✅ 添加截图说明（如需要）
- ✅ 保持语言简洁明了
- ✅ 使用 Markdown 格式
- ✅ 添加必要的链接
- ✅ 放入正确的分类目录

## 📧 联系我们

如有文档相关问题，请通过以下方式联系：

- 提交 Issue
- 发送邮件给维护团队
- 在开发群组中讨论

---

**文档维护**: 开发团队  
**最后更新**: 2024-11-18

**返回**: [项目主页](../README.md)
