# MonoCode 中文版

基于 [hardbeat920/monocode](https://github.com/hardbeat920/monocode) 0.12.0 的简体中文修改版。
这是实际应用源码，不是网页仿制界面。保留原项目 MIT 许可证及版权声明。

## 已完成

- 默认显示简体中文；设置 → 通用 → 界面语言可切换 English。
- 汉化项目侧栏、会话输入、模型选项、设置、文件、Git、收件箱、远程连接、技能、常驻助手及自动化的主要界面。
- 集中的翻译字典位于 `src/shared/i18n/zh-CN.json`，支持带变量的句子；英文缺失词条保留原文。
- 日期选择器跟随界面语言；加入中文字体回退。
- macOS 应用菜单、托盘菜单及常驻助手快捷菜单使用相同词典。
- 原始命令 ID、快捷键、模型 ID、路径、代理回复和文件内容不做翻译。服务商返回的提示、更新说明及少量第三方编辑器文字可能仍为英文。
- 切换语言需要结束任务后手动重启；不会自动重载窗口或中断代理。

## 在 Apple 芯片 Mac 上构建

需要 Node.js 20+、Rust（含 rustup）及 Apple Command Line Tools。

1. 安装 [Node.js](https://nodejs.org/) 和 [Rust](https://rustup.rs/)。
2. 如未安装 Apple 命令行工具，在终端执行 `xcode-select --install`。
3. 双击 `scripts/build-mac-zh.command`，或在项目目录执行：

```bash
npm ci
rustup target add aarch64-apple-darwin
npm run build:mac:zh
```

输出位于 `target/aarch64-apple-darwin/release/bundle/dmg/`。

构建配置：`src-tauri/tauri.zh-cn.conf.json`。应用名为“MonoCode 中文版”，使用独立应用标识 `dev.daniel.monocode.zhcn`，可与原版并存，数据不会自动从原版迁移。命令行代理仍需要自行安装、登录或配置你现有的 API。

此个人构建使用本地临时签名，没有 Apple 公证。首次打开如被 macOS 阻止，请在系统设置 → 隐私与安全性中确认打开。

## 在 GitHub Fork 中构建

此源码包不会自动创建你账号下的远程 Fork。可以 Fork 原项目，将这些文件提交到自己的 `feat/zh-cn` 分支；或应用包内的 `MonoCode_Chinese.patch`。

已加入 `.github/workflows/build-zh-macos.yml`：推送到 `feat/zh-cn` 或手动启动工作流后，在 GitHub 的 Actions 页面下载 DMG 构建产物。不需要原作者的 Apple 签名和更新服务密钥。

中文版构建模式禁用上游更新检查，避免被原版覆盖。“检查更新”会提示使用自己的构建产物。

## 开发与验证

```bash
npm ci
npm run dev:zh
npm run build
npm test
```

前端开发预览 `npm run dev` 无法提供原生 IPC、文件系统和代理进程功能；实际使用应运行 Tauri 应用。

本次在 Linux 环境完成源码修改、TypeScript/前端构建及单元测试。macOS 原生运行、原生菜单与 DMG 构建尚未在 Mac 上验证。浏览器视觉检查因 Chromium 下载不可用未完成。
