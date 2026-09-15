# CodeAdventurer 代码冒险者 - 完整项目说明文档

## 一、项目总览

**项目名称**：CodeAdventurer（代码冒险者）

**项目类型**：多语言编程闯关学习游戏（现覆盖 HTML / CSS / JavaScript / Vue / Python / Java / C/C++ / C# / Uni-app 共 9 种语言）

**开发工具**：HBuilderX（另附 `server.ps1` 本地静态服务脚本）

**开发技术**：HTML5 + CSS3 + JavaScript 原生（零框架、零构建；仅通过 CSS `@import` 加载 Google Fonts：Orbitron / JetBrains Mono）

**产品定位**：

面向编程零基础用户，以**闯关游戏化**方式学习编程。区别于枯燥文档学习，采用「看知识点 → 写代码 → 实时预览 → 自动判题通关」模式，大幅降低入门难度。

**发展路线（长期迭代）**：

网页版学习游戏 → 功能完善Web端平台 → Tauri/Electron桌面客户端 → Uni-app移动端APP

---

## 二、项目特点与优势

- **零门槛**：纯原生前端技术，无复杂框架，新手可直接看懂、可直接改代码

- **所见即所得**：写代码即看效果（关卡预览通过 iframe 渲染用户代码）

- **游戏化学习**：每门语言对应一种游戏玩法（建造师、变形记、魔法学院等）

- **可无限拓展**：`js/levels.js` 已内置 9 种语言各 1 个首关的数据与运行时，可批量扩展更多语言、更多关卡

- **全端适配**：后期可一键打包为电脑软件、手机APP，代码高度复用

---

## 三、当前功能清单（与代码一致）

> 说明：当前代码已实现**首页 + 语言选择器**，关卡页面尚未接入 `index.html`。

### 1. 已接入页面（index.html 实际加载）

- **预加载动画**：蜂巢六边形加载器 + 圆环进度，加载完成后凝聚为"进入"按钮

- **动态粒子背景**：`<canvas>` 粒子连线 + 渐变光斑（js/background.js）

- **首页（品牌屏）**：品牌标题打字动画 + 特性卡片

- **语言选择器（Picker 屏）**：9 种语言的抽屉式 3D 层叠选择器，支持滚轮 / 拖拽 / 键盘切换，切换时联动动态主题背景

- **本地进度统计**：localStorage 记录各语言通关数（`progress_{langId}`），语言卡片显示进度条与完成率

### 2. 已编写但尚未接入（js/levels.js）

- **关卡数据**：9 种语言各 1 个首关（HTML 黑暗房间、CSS 变太阳、JS 新手弹幕、Python 直线冲锋、Vue 全场加 Buff、Java 唤醒机器人、C/C++ 启动引擎、C# 装填弹药、Uni-app 你好世界）

- **关卡运行时**：showLevel / runPreview / checkAnswer / showHint / resetCode / markComplete / startPortalTransition 等

- **注意**：`levels.js` 尚未被 `index.html` 引入，页面中也没有 `#levelPage`（任务面板 / 编辑器 / 预览 iframe / 按钮栏），因此点击"开始 XX 之旅"后仅跳转 `#levels/{langId}` 哈希、暂无页面响应

---

## 四、项目文件目录结构

```Plain Text
CodeAdventurer/
├─ index.html              # 应用入口（预加载 + 首页两屏：品牌屏 + 语言选择器）
├─ CodeAdventurer.md       # 项目说明文档（本文件）
├─ GameplayDesign.md       # 游戏化玩法设计文档
├─ server.ps1              # PowerShell HttpListener 本地静态服务脚本
├─ css/
│  ├─ style.css            # 全局样式（含首页 / 预加载 / 语言选择器样式，顶部 @import Google Fonts）
│  └─ animations.css       # 关键帧动画（标题 / 卡片 / 按钮等）
├─ js/
│  ├─ background.js        # 粒子背景 + 渐变光斑
│  ├─ languages.js         # 9 种语言配置（名称 / 图标 / 配色 / 玩法 / 关卡数）
│  ├─ app.js               # 应用主逻辑（预加载 / 首页 / 选择器 / 路由）
│  └─ levels.js            # 9 个首关数据 + 关卡运行时（尚未接入 index.html）
├─ pages/                  # 空目录（预留）
├─ img/                    # 空目录（预留）
└─ .trae/documents/        # 项目文档（PRD / 技术架构 / 首关实现计划）
```

---

## 五、运行使用教程

### 1. 环境准备

纯原生前端项目，无需安装任何依赖。

### 2. 项目运行步骤

- 方式一：直接双击打开 `index.html`

- 方式二：使用本地静态服务（推荐，避免个别浏览器本地文件限制）：

```powershell
powershell -ExecutionPolicy Bypass -File server.ps1
```

- 方式三：使用 HBuilderX 打开项目，选择"运行 → 运行到浏览器"

### 3. 操作方法（当前已实现）

1. 打开页面，等待预加载动画完成，点击"进入"按钮
2. 在首页品牌屏向上滑动（滚轮 / 触摸 / 键盘方向键），切换到语言选择器
3. 上下滚动或拖拽选择一门语言，点击"开始 XX 之旅"
4. 当前关卡页面尚未接入，点击进入按钮仅会跳转 `#levels/{langId}` 哈希、暂无页面响应

---

## 六、开发修改手册（自定义拓展教程）

### 1. 如何新增/修改语言

- 编辑 `js/languages.js`：在 `LANGUAGES` 数组中增改语言的 `id / name / enName / icon / color1 / color2 / glow / gameplay / description / levels` 字段

### 2. 如何新增/修改关卡

- 编辑 `js/levels.js`：在 `LEVELS` 对象中为对应语言追加关卡数据（`title / narrative / knowledge / starterCode / solution / hint / buildPreview / check`）

### 3. 如何修改页面样式

- 页面样式集中在 `css/style.css`，动画关键帧在 `css/animations.css`，均通过 CSS 变量（`:root`）统一管理主题色、字体、玻璃态参数

### 4. 如何接入关卡页（待办）

- 在 `index.html` 中引入 `js/levels.js`、新增 `#levelPage`（任务面板 / 编辑器 / 预览 iframe / 按钮栏），并在 `js/app.js` 的 `handleRoute()` 中扩展 `#levels/{langId}` 路由

---

## 七、版本迭代规划 roadmap

### 已完成

- 预加载动画（蜂巢加载器 + 圆环进度 + 点击进入）
- 动态粒子背景（Canvas 粒子连线 + 渐变光斑）
- 首页两屏（品牌屏 + 语言选择器）
- 9 种语言配置（js/languages.js）
- 本地进度保存（localStorage，刷新不丢失）
- 关卡数据与运行时（js/levels.js：9 个首关 + 判题 / 提示 / 重置 / Portal 过渡）

### 待完成（近期迭代）

- 将 `levels.js` 接入 `index.html`：新增 `#levelPage`（左任务 / 中编辑器 / 右预览 / 底按钮）
- 扩展 `app.js` 路由，点击"开始之旅"触发 Portal 过渡进入关卡页
- 关卡页样式（复用玻璃态 + 主题色注入）

### 后续规划

- 每种语言扩展更多关卡
- 关卡列表页、进度树、错题复习
- 打包桌面客户端（Tauri/Electron）、移动端（Uni-app）

---

## 八、项目核心技术原理说明

- **布局技术**：Flex + CSS Grid，配合 CSS 变量（`:root`）统一主题色与玻璃态
- **背景特效**：原生 Canvas API 绘制粒子连线与渐变光斑（js/background.js）
- **预览原理**：关卡通过 iframe `srcdoc` + `sandbox` 渲染用户代码；HTML/CSS/JS 真实执行，Python/Java/C++/C# 等采用正则解析 + 预置场景动画模拟执行
- **判题原理**：JavaScript 正则表达式 + DOM 读取（`contentDocument` / `getComputedStyle`）双重校验
- **数据持久化**：localStorage 保存各语言通关进度（`progress_{langId}`）与代码草稿（`code_{langId}_{index}`）
- **交互原理**：原生 JS 事件绑定，无任何第三方框架依赖，轻量高效

---

## 九、项目优势与学习价值

1. **个人实战项目**：完整独立开发作品，可放入个人作品集

2. **循序渐进**：从 HTML → CSS → JS → 桌面软件 → APP，成长路线清晰

3. **学以致用**：边开发、边学习、边闯关，双向巩固编程知识

4. **可商业化/开源**：后期可做成免费编程教学工具、开源项目

---

## 十、备注说明

本项目为持续迭代型项目，所有代码均为轻量化原生代码，无框架依赖，可长期维护更新。

> （注：部分内容可能由 AI 生成）
