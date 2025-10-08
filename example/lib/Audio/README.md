# AudioProcessor 使用文档

`AudioProcessor` 是一个功能强大的音频处理库，允许您轻松地在浏览器中进行录音、播放、暂停、恢复和停止等操作。它还提供了获取音频数据（PCM 和 WAV 格式）、下载音频文件以及分析音频波形（时域和频域）的功能。

## 快速上手

### 1. 引入

首先，您需要引入 `AudioProcessor` 类：

```typescript
import AudioProcessor from './index';
```

### 2. 请求麦克风权限

在开始录音之前，最好先显式请求用户的麦克风权限，以提供更好的用户体验。

```typescript
async function requestMicrophonePermission() {
  try {
    await AudioProcessor.getPermission();
    console.log('麦克风权限获取成功！');
  } catch (error) {
    console.error('获取麦克风权限失败:', error);
  }
}

// 在应用初始化时调用
requestMicrophonePermission();
```

### 3. 创建实例

创建一个 `AudioProcessor` 实例。您可以传入一个配置对象来自定义采样率、采样位数和声道数。

```typescript
const audioProcessor = new AudioProcessor({
  sampleBits: 16,      // 采样位数 (8 或 16，默认 16)
  sampleRate: 16000,   // 采样率 (Hz，默认使用浏览器输入采样率)
  numChannels: 1,      // 声道数 (1 或 2，默认 1)
});
```

## 主要功能

### 录音控制

- **开始录音**: `start()`
- **暂停录音**: `pause()`
- **恢复录音**: `resume()`
- **停止录音**: `stop()`

```typescript
// 开始录音
document.getElementById('start-btn').onclick = () => {
  audioProcessor.start().then(() => {
    console.log('录音开始');
  }).catch(error => {
    console.error('录音失败:', error);
  });
};

// 暂停录音
document.getElementById('pause-btn').onclick = () => {
  audioProcessor.pause();
  console.log('录音已暂停');
};

// 恢复录音
document.getElementById('resume-btn').onclick = () => {
  audioProcessor.resume();
  console.log('录音已恢复');
};

// 停止录音
document.getElementById('stop-btn').onclick = () => {
  audioProcessor.stop();
  console.log('录音已停止');
};
```

### 播放控制

- **播放录音**: `play()`
- **暂停播放**: `pausePlay()`
- **恢复播放**: `resumePlay()`
- **停止播放**: `stopPlay()`

**注意**: 调用 `play()` 会自动停止正在进行的录音。

```typescript
// 播放录音
document.getElementById('play-btn').onclick = () => {
  audioProcessor.play();
};

// 暂停播放
document.getElementById('pause-play-btn').onclick = () => {
  audioProcessor.pausePlay();
};

// 恢复播放
document.getElementById('resume-play-btn').onclick = () => {
  audioProcessor.resumePlay();
};

// 停止播放
document.getElementById('stop-play-btn').onclick = () => {
  audioProcessor.stopPlay();
};
```

### 事件监听

您可以为播放过程中的关键事件设置回调函数。

```typescript
audioProcessor.onPlay = () => console.log('播放开始');
audioProcessor.onPausePlay = () => console.log('播放暂停');
audioProcessor.onResumePlay = () => console.log('播放恢复');
audioProcessor.onStopPlay = () => console.log('播放停止');
audioProcessor.onPlayEnd = () => console.log('播放结束');
```

### 获取音频数据

您可以在录音结束后获取不同格式的音频数据。

**注意**: 获取数据前，建议先调用 `stop()` 方法以确保获取完整的录音数据。

- **获取 PCM (DataView)**: `getPCM()`
- **获取 PCM (Blob)**: `getPCMBlob()`
- **获取 WAV (DataView)**: `getWAV()`
- **获取 WAV (Blob)**: `getWAVBlob()`

```typescript
// 获取 WAV Blob
const wavBlob = audioProcessor.getWAVBlob();
console.log('WAV Blob:', wavBlob);

// 创建一个可播放的 URL
const audioUrl = URL.createObjectURL(wavBlob);
const audioElement = new Audio(audioUrl);
audioElement.play();
```

### 下载音频

您可以轻松地将录制的音频下载到本地。

- **下载 PCM 文件**: `downloadPCM('my-audio')`
- **下载 WAV 文件**: `downloadWAV('my-audio')`

```typescript
// 下载 WAV 文件
document.getElementById('download-wav-btn').onclick = () => {
  audioProcessor.downloadWAV('my-awesome-recording');
};
```

### 音频分析

`AudioProcessor` 允许您在录音或播放时获取音频的分析数据，用于可视化等场景。

- **获取录音时的分析数据**: `getRecordingAnalysisData()`
- **获取播放时的分析数据**: `getPlaybackAnalysisData()`

每个方法都会返回一个包含 `frequencyData` (频域) 和 `timeDomainData` (时域) 的对象。

```typescript
function draw() {
  // 在录音时
  const analysisData = audioProcessor.getRecordingAnalysisData();
  // 或在播放时
  // const analysisData = audioProcessor.getPlaybackAnalysisData();

  // 使用 analysisData.frequencyData 和 analysisData.timeDomainData 进行绘制
  requestAnimationFrame(draw);
}

draw();
```

## 销毁实例

当您不再需要 `AudioProcessor` 实例时，请调用 `destroy()` 方法以释放所有相关资源。

```typescript
audioProcessor.destroy().then(() => {
  console.log('实例已销毁');
});
```
