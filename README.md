<pre align="center">
<a href="docs/zh_CN.md">简体中文</a> | <a href="docs/en_US.md">English</a> | <a href="docs/ja_JP.md">日本語</a>
</pre>

# EasyConverter

##### 基于 Electron & React 开发，由 FFmpeg 驱动的现代化轻量级媒体转换器

### 简介

<img src="docs/screenshot.png" alt="screenshot" width="100%">

#### 功能特性

-    **视频处理**：支持 MP4, MKV, MOV, AVI 等格式互转。支持自定义帧率 (FPS)、码率 (Bitrate) 和压缩强度 (CRF)。
-    **音频工具**：支持从视频提取音频、视频静音，或进行音频格式转换 (MP3, FLAC, WAV)。
-    **图像转换**：批量转换图片为 WebP, PNG, JPG, ICO。支持调整尺寸和控制宽高比。
-    **现代 UI**：基于 Tailwind CSS 构建，拥有流畅的动画效果和亮色/暗色主题支持。
-    **隐私安全**：所有处理均通过 FFmpeg 在本地完成，无需上传文件。

### 下载

您可以从 [Releases](https://github.com/yourname/easy-converter/releases) 页面下载最新版本。

### 开发指南

请确保您的 Node.js 版本 >= 18.0

> [!NOTE]
> 本项目使用 `fluent-ffmpeg`。在构建之前，请确保静态二进制文件 (`ffmpeg.exe`) 已正确放置在 `resources/` 文件夹中。（默认已经配置好了desuwww）

#### 安装依赖

```bash
npm install