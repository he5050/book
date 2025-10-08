# Audio Recorder & Player Library

一个功能完整的音频录制和播放库，支持录音、播放、PCM/WAV格式转换和下载功能。

## 功能特性

- 音频录制（支持多种采样率和声道设置）
- 音频播放（支持暂停、恢复、停止）
- PCM 和 WAV 格式编码
- 音频数据压缩和转换
- 音频文件下载
- 音频波形数据获取
- 双声道支持

## 安装

将整个 `Audio` 文件夹复制到你的项目中。

## 使用方法

### 基本用法

```typescript
import AudioRecorder from './Audio';

// 创建录音实例
const recorder = new AudioRecorder({
  sampleBits: 16,      // 采样位数 (8 或 16)
  sampleRate: 44100,   // 采样率 (Hz)
  numChannels: 1       // 声道数 (1 或 2)
});

// 开始录音
recorder.start().then(() => {
  console.log('开始录音');
}).catch((error) => {
  console.error('录音启动失败:', error);
});

// 停止录音
recorder.stop();

// 播放录音
recorder.play();

// 下载WAV文件
recorder.downloadWAV('my-recording');
```

### 详细API

#### 构造函数

```typescript
const recorder = new AudioRecorder(options);
```

**options 参数:**

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| sampleBits | number | 16 | 采样位数 (8 或 16) |
| sampleRate | number | 浏览器默认采样率 | 采样率 (8000, 11025, 16000, 22050, 24000, 44100, 48000) |
| numChannels | number | 1 | 声道数 (1 或 2) |

#### 录音控制方法

- `start(): Promise<void>` - 开始录音
- `pause(): void` - 暂停录音
- `resume(): void` - 恢复录音
- `stop(): void` - 停止录音

#### 播放控制方法

- `play(): void` - 播放录音
- `pausePlay(): void` - 暂停播放
- `resumePlay(): void` - 恢复播放
- `stopPlay(): void` - 停止播放

#### 数据获取方法

- `getPCM(): DataView` - 获取PCM格式的音频数据
- `getPCMBlob(): Blob` - 获取PCM格式的Blob数据
- `getWAV(): DataView` - 获取WAV格式的音频数据
- `getWAVBlob(): Blob` - 获取WAV格式的Blob数据
- `getChannelData(): ChannelData` - 获取左右声道的数据

#### 下载方法

- `downloadPCM(name?: string): void` - 下载PCM格式文件
- `downloadWAV(name?: string): void` - 下载WAV格式文件
- `download(blob: Blob, name: string, type: string): void` - 通用下载方法

#### 其他方法

- `getRecordAnalyseData(): AnalyseData` - 获取当前录音的波形数据
- `getPlayAnalyseData(): AnalyseData` - 获取录音播放时的波形数据
- `getPlayTime(): number` - 获取已经播放的时间
- `setOption(options: RecorderConfig): void` - 重新设置配置
- `destroy(): Promise<void>` - 销毁录音器实例，释放资源

### 事件回调

```typescript
// 录音播放回调
recorder.onPlay = () => {
  console.log('开始播放');
};

// 录音暂停播放回调
recorder.onPausePlay = () => {
  console.log('暂停播放');
};

// 录音恢复播放回调
recorder.onResumePlay = () => {
  console.log('恢复播放');
};

// 录音停止播放回调
recorder.onStopPlay = () => {
  console.log('停止播放');
};

// 录音正常播放结束回调
recorder.onPlayEnd = () => {
  console.log('播放结束');
};
```

### 权限获取

在开始录音前，你可能需要获取用户的音频录制权限：

```typescript
import { Recorder } from './Audio';

Recorder.getPermission().then(() => {
  console.log('音频录制权限已获取');
}).catch((error) => {
  console.error('获取音频录制权限失败:', error);
});
```

## 浏览器兼容性

- Chrome 49+
- Firefox 42+
- Safari 11+
- Edge 13+

## 注意事项

1. 在某些浏览器中，录音功能需要在HTTPS环境下才能正常工作
2. 需要用户授权访问麦克风
3. 录音功能在移动设备上可能需要用户交互（如点击按钮）才能启动
4. WAV文件包含完整的音频头信息，而PCM文件只包含原始音频数据

## 许可证

MIT