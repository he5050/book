---
title: 音频录制库（WAV/MP3/OGG）
date: 2025-09-30 23:00:00
permalink: /methods/audio-recorder
description: 基于 Web Audio API 的浏览器端音频录制库，支持 WAV/MP3/OGG 编码，提供 React 可配置演示
categories:
  - 方法库
tags:
  - 音频
  - 录制
  - WebAudio
  - Worker
---

# 音频录制库（WAV/MP3/OGG）

## 简介

这是一个基于 Web Audio API 的浏览器端音频录制库，功能与 web-audio-recorder-js 基本一致。内置 WAV 编码，并通过 Web Worker 集成第三方编码器实现 MP3 与 OGG（Vorbis）编码。提供完整的 TypeScript API 与 React 可配置示例，支持静态资源路径与 CDN 可配置。

## 效果特点

### 视觉特性

- 统一结构：文档与示例遵循项目模板规范
- 清晰层级：分区块组织，便于检索与阅读
- 直观演示：提供 React 示例组件可直接交互体验
- 完整覆盖：从原理到使用、优化与故障排除

### 技术特性

- 编码支持：WAV（16-bit PCM），MP3（lamejs），OGG（ogg-vorbis-encoder）
- 工作线程：编码过程在 Worker 中进行，主线程响应流畅
- 数据拉取：优先 AudioWorklet，失败回退 ScriptProcessorNode
- 可插拔：Worker/CDN 地址可通过 options 配置，支持本地部署

## 工作原理

```mermaid
graph TD
    A[MediaDevices.getUserMedia] --> B[AudioContext]
    B --> C{PCM采集}
    C -->|Worklet| D[AudioWorkletProcessor]
    C -->|Fallback| E[ScriptProcessorNode]

    D --> F[PCM Float32Array]
    E --> F[PCM Float32Array]

    F --> G{编码类型}
    G -->|WAV| H[WavEncoder(主线程)]
    G -->|MP3| I[mp3.worker.js + lamejs]
    G -->|OGG| J[ogg.worker.js + ogg-vorbis-encoder]

    H --> K[Blob(audio/wav)]
    I --> K[Blob(audio/mpeg)]
    J --> K[Blob(audio/ogg)]

    K --> L[onComplete 返回结果]
    B --> M[onProgress 录制进度]
    G --> N[onEncoderLoaded 编码器就绪]
    G --> O[onError 错误处理]
```

## 效果演示

<demo react="react/AudioRecorder/index.tsx"
:reactFiles="['react/AudioRecorder/index.tsx']"
/>

提示：示例使用的 `Worker` 已复制到 `public/workers` 下，请确保站点静态服务可访问 `/workers/mp3.worker.js` 与 `/workers/ogg.worker.js`。默认第三方编码器从 `unpkg` 加载，建议生产环境改为自托管。

## 核心实现原理

### 接口与类型

- EncodingType: "wav" | "mp3" | "ogg"
- RecorderOptions:
  - sampleRate?: number
  - numChannels?: number（1 或 2）
  - bufferSize?: number（ScriptProcessor 缓冲大小，如 4096）
  - timeLimit?: number（毫秒，达到自动结束）
  - progressInterval?: number（毫秒，进度回调间隔）
  - encodeAfterRecord?: boolean（是否录制后统一编码；默认边录边编码适合 MP3/OGG）
  - useAudioWorklet?: boolean（优先使用 Worklet）
  - workerUrls?: {
    mp3?: string; ogg?: string; lamejs?: string; oggVorbis?: string;
  }
- RecorderEvents:
  - onEncoderLoaded?: (type) => void
  - onComplete?: (result) => void
  - onError?: (error) => void
  - onProgress?: (elapsedMs) => void

### 录制流程

1. 获取麦克风权限与 MediaStream
2. 通过 AudioContext 连接 Worklet 或 ScriptProcessor 采集 PCM
3. 将帧数据交给对应编码器（WAV 主线程，MP3/OGG 走 Worker）
4. 完成录制时触发编码器 flush，返回 Blob 给 onComplete

## 使用示例

```typescript
import { AudioRecorder } from "/example/lib/Audio";

const recorder = new AudioRecorder(
  {
    numChannels: 1,
    useAudioWorklet: true,
    progressInterval: 500,
    workerUrls: {
      mp3: "/workers/mp3.worker.js",
      ogg: "/workers/ogg.worker.js",
      lamejs: "https://unpkg.com/lamejs@1.2.0/lame.min.js",
      oggVorbis: "https://unpkg.com/ogg-vorbis-encoder@1.3.0/build/ogg-vorbis-encoder.min.js"
    }
  },
  {
    onEncoderLoaded: (enc) => console.log("编码器就绪：", enc),
    onProgress: (ms) => console.log("进度(ms)：", ms),
    onComplete: (res) => {
      const url = URL.createObjectURL(res.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `record.${res.extension}`;
      a.click();
      URL.revokeObjectURL(url);
    },
    onError: (err) => console.error("录制错误：", err)
  }
);

// 录制 MP3
recorder.setEncoding("mp3");
await recorder.startRecording();
// ...交互或定时
await recorder.finishRecording();

// 切换到 OGG
recorder.setEncoding("ogg");
await recorder.startRecording();
await recorder.finishRecording();

// 取消录制
await recorder.cancelRecording();
```

## 高级功能

- 本地化依赖：将 lamejs 与 ogg-vorbis-encoder 下载到 public/vendors，并在 workerUrls 中指定本地路径，提升稳定与离线能力。
- 录制时长限制：timeLimit 到达自动结束，配合 progressInterval 提示用户。
- 通道与采样率：默认取 AudioContext.sampleRate；支持 1/2 通道；WAV 输出为 16-bit PCM。
- 回退机制：AudioWorklet 加载失败自动回退到 ScriptProcessorNode，提升兼容性。

## 性能优化

- Worker 编码：将 MP3/OGG 编码放到 Worker，降低主线程阻塞。
- 合理 bufferSize：在兼容性与实时性之间折中（常用 2048/4096）。
- 资源释放：finish/cancel 后及时关闭 AudioContext，停止 MediaStream tracks，并清理 URL。

## 故障排除

- 麦克风权限：需 HTTPS 或 localhost，浏览器弹窗允许录音。
- 路径问题：确保 /workers/*.js 可访问；若使用非根部署，请调整为相对路径。
- CDN 访问：受网络影响时使用本地 vendors 路径；或者自建 CDN。
- TypeScript 报错：如 tsconfig 中无关类型缺失（vue 等），可移除 compilerOptions.types 或安装对应 @types 包。

## 最佳实践

- 配置可控：通过 workerUrls 自定义依赖与 Worker 路径，避免硬编码。
- 事件友好：onProgress 结合 UI 反馈；onError 捕获并提示用户。
- 用户体验：在录制中禁用表单变更；结束后提供预览与下载。
- 安全遵循：不记录或上传音频，避免隐私泄露；必要时提示隐私政策。

## 相关资源

- Web Audio API（MDN）
- lamejs（MP3 编码器）
- ogg-vorbis-encoder（OGG 编码器）
- AudioWorklet 指南

---

_本方法库文档遵循项目模板规范，提供完整的实现原理与使用指南，并附带 React 演示组件，便于快速集成与验证。_

## 部署与路径配置

- Worker 静态路径：
  - 已将 MP3 与 OGG 的 Worker 复制到 public/workers 下，请确保可访问：
    - /workers/mp3.worker.js
    - /workers/ogg.worker.js
  - 建议将第三方编码库也本地化（生产环境更稳定）：
    - lamejs（MP3）：例如 /vendors/lame.min.js
    - ogg-vorbis-encoder（OGG）：例如 /vendors/ogg-vorbis-encoder.min.js
  - 在示例或业务代码中通过 options.workerUrls 指向本地路径，避免依赖公共 CDN。

- AudioWorklet 路径（如启用 useAudioWorklet）：
  - 默认加载路径为 /example/lib/Audio/worklet/pcm-processor.js；
  - 如需统一到 public，可将其复制为 /workers/pcm-processor.js，并在 AudioRecorder.ts 中将 addModule 的路径改为 /workers/pcm-processor.js。

- 非根路径部署：
  - 如果站点部署在子路径下（例如 /subapp/），请将所有路径改为相对或包含子路径前缀（如 /subapp/workers/...）。

## 接口速览
```
- 核心类：AudioRecorder(options?: RecorderOptions, events?: RecorderEvents)
- 主要方法：
  - setEncoding(type: "wav" | "mp3" | "ogg")
  - startRecording()
  - finishRecording()
  - cancelRecording()
- RecorderOptions（关键项）：
  - numChannels: 1 | 2
  - useAudioWorklet: boolean
  - progressInterval: number（毫秒）
  - timeLimit?: number（毫秒）
  - workerUrls?: { mp3?: string; ogg?: string; lamejs?: string; oggVorbis?: string }
- 事件回调：
  - onEncoderLoaded(type)
  - onProgress(elapsedMs)
  - onComplete({ blob, mimeType, extension })
  - onError(error)
```
## 浏览器兼容性

- 需要 HTTPS 或 localhost 才能请求麦克风权限（getUserMedia）。
- 优先使用 AudioWorklet（现代 Chrome/Edge/Firefox），在不支持时自动回退 ScriptProcessorNode（旧浏览器）。
- iOS Safari 对采样率与自动播放策略较严格，首次交互后再开始录制更稳定。

## 常见问题与解决

- Worker 无法加载：
  - 检查 /workers 路径是否正确、是否被打包或拷贝到产物目录。
  - 在相对路径或子目录部署场景中，确保前缀一致（例如 /subapp/workers/...）。

- CDN 访问失败：
  - 将 lamejs 和 ogg-vorbis-encoder 改为本地 vendors 路径，并在 workerUrls 中覆盖。

- 录制没有声音或权限被拒：
  - 确认站点协议与用户授权；在移动端需用户主动交互触发。

## 隐私与安全建议

- 明确提示用户录音用途与保存方式，不默认上传。
- 完成后及时释放 URL（URL.revokeObjectURL），避免内存泄漏。
- 对用户生成音频的保存、分享需要用户明确同意，遵守当地法规与政策。