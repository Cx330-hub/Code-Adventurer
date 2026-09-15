# CodeAdventurer 代码冒险者 — 技术架构文档

## 1. 架构设计

当前已实现**首页 + 语言选择器**；关卡页面（`#levelPage`）尚未接入 `index.html`，`js/levels.js` 已编写但未引入。

```mermaid
flowchart TB
    subgraph "前端应用 (纯浏览器运行)"
        "预加载 Preloader"
        "首页 HomePage" --> "品牌屏 Hero"
        "首页 HomePage" --> "语言选择器 LanguagePicker"
        "动态背景 ParticleBackground"
    end

    subgraph "数据层 (localStorage)"
        "语言配置 languages.js"
        "关卡数据 levels.js (已编写, 未接入)"
        "用户进度 progress_{langId}"
    end

    subgraph "关卡运行时 (levels.js, 尚未接入页面)"
        "iframe srcdoc 渲染" --> "HTML/CSS/JS (真实执行)"
        "正则解析 + 场景动画" --> "Python/Java/C/C++/C# (模拟执行)"
    end

    "前端应用" --> "数据层"
```

## 2. 技术说明

- **前端框架**：原生 HTML5 + CSS3 + JavaScript（零框架、零构建）
- **构建工具**：无，直接浏览器打开（或通过 `server.ps1` 本地静态服务）
- **编辑器**：计划使用 textarea（纯原生、新手可直接看懂）；**未引入 CodeMirror**
- **图标**：emoji + 内联 SVG；**未引入 Font Awesome**
- **字体**：Google Fonts — Orbitron（标题）+ JetBrains Mono（代码），通过 `css/style.css` 顶部 `@import` 引入，离线时回退系统字体
- **背景特效**：原生 Canvas API（粒子连线 + 渐变光斑）
- **数据持久化**：localStorage（保存用户进度与代码草稿）

## 3. 路由定义

| 路由 | 用途 | 实现方式 | 当前状态 |
|------|------|----------|----------|
| / 或 index.html | 首页（品牌屏 + 语言选择器） | 单页应用，JS 切换 | 已实现 |
| #levels/:lang | 关卡页（点击"开始之旅"跳转） | hash 路由 | 未实现（`handleRoute()` 仅处理首页） |

> 说明：`js/app.js` 的 `handleRoute()` 目前只处理空 hash（显示首页），点击"开始 XX 之旅"会跳转 `#levels/{langId}` 但无路由响应。

## 4. 数据模型

### 4.1 关卡数据结构（js/levels.js）

```javascript
{
  id: 'html-1',          // 唯一标识
  langId: 'html',        // 所属语言
  index: 1,              // 关卡序号（从 1 开始）
  title: '黑暗房间',      // 关卡标题
  subtitle: 'Dark Room', // 英文副标题
  narrative: '...',      // 游戏化任务叙述
  knowledge: ['...'],    // 知识点数组
  starterCode: '...',    // 初始代码脚手架
  solution: '...',       // 参考答案
  hint: '...',           // 解题提示
  buildPreview: (code) => '...',       // 生成 iframe 内容的函数
  check: (code, doc, win) => ({ passed, message }), // 判题函数（doc=iframe 文档）
  asyncRecheck: false    // 可选：异步二次复检（如 JS 弹幕类）
}
```

### 4.2 用户进度数据结构（localStorage）

```javascript
// key: progress_{langId}，如 progress_html
{
  completed: 1,      // 已通关到第几关
  levels: [1]        // 已通关的关卡序号列表
}

// key: code_{langId}_{index}，代码草稿（字符串）
```

## 5. 执行引擎说明

### 5.1 浏览器原生语言（HTML/CSS/JS）

- **执行方式**：iframe `srcdoc` + `sandbox` 沙箱渲染，真实执行
- **优势**：完全隔离、零延迟、离线可用

### 5.2 其他语言（Python/Java/C/C++/C#/Vue/Uni-app）

- **执行方式**：模拟执行（非真实运行环境）
- **实现原理**：用正则表达式解析用户代码片段，驱动预置的 JS 游戏场景动画（如 Python 匹配 `for...range(5)` 触发忍者移动）
- **说明**：**未引入 Brython、Piston API、Vue CDN 等任何第三方执行引擎**，全程离线、纯前端模拟

## 6. 项目文件结构

```
CodeAdventurer/
├── index.html              # 应用入口（预加载 + 首页两屏）
├── server.ps1              # PowerShell 本地静态服务
├── css/
│   ├── style.css           # 全局样式（含 @import Google Fonts）
│   └── animations.css      # 关键帧动画
├── js/
│   ├── app.js              # 应用主逻辑（路由、选择器、预加载）
│   ├── background.js       # 粒子背景动画
│   ├── levels.js           # 9 个首关数据 + 运行时（未接入）
│   └── languages.js        # 9 语言配置
├── pages/                  # 空目录（预留）
├── img/                    # 空目录（预留）
└── .trae/documents/        # 项目文档
```

> 注：原文档提到的 `glass.css`、`validator.js`、`storage.js`、`pages/home.html`、`pages/levels.html`、`pages/challenge.html` 均**不存在**；当前样式为单文件 `style.css`（内嵌玻璃态），判题逻辑在 `levels.js`，存储直接使用 localStorage。
