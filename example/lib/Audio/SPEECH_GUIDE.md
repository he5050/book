# 语音功能使用指南

AudioProcessor 现在集成了完整的语音识别和语音合成功能，基于浏览器原生的 Web Speech API。

## 功能特性

### 🎤 语音识别 (Speech Recognition)
- 实时语音转文字
- 支持连续识别和一次性识别
- 支持多种语言（中文、英文等）
- 返回置信度和中间结果

### 🔊 语音合成 (Text-to-Speech)
- 文字转语音播放
- 支持多种语音和语言
- 可调节语速、音调、音量
- 支持播放控制（暂停、恢复、停止）

## 基本使用

### 1. 检查浏览器支持

```javascript
const support = AudioProcessor.getSpeechSupport();
console.log('语音识别支持:', support.recognition);
console.log('语音合成支持:', support.synthesis);
```

### 2. 语音识别

```javascript
const audioProcessor = new AudioProcessor();

// 方法一：一次性识别
try {
    const text = await audioProcessor.recognizeOnce('zh-CN');
    console.log('识别结果:', text);
} catch (error) {
    console.error('识别失败:', error);
}

// 方法二：连续识别
const recognizer = audioProcessor.getSpeechRecognizer();
if (recognizer) {
    recognizer.onResult = (result) => {
        console.log('识别文本:', result.transcript);
        console.log('置信度:', result.confidence);
        console.log('是否最终结果:', result.isFinal);
    };
    
    recognizer.onError = (error) => {
        console.error('识别错误:', error);
    };
    
    recognizer.start(); // 开始识别
    // recognizer.stop(); // 停止识别
}
```

### 3. 语音合成

```javascript
// 方法一：简单合成
try {
    await audioProcessor.speakText('你好，世界！');
    console.log('语音播放完成');
} catch (error) {
    console.error('合成失败:', error);
}

// 方法二：自定义参数
await audioProcessor.speakText('Hello World', {
    lang: 'en-US',
    rate: 1.2,    // 语速
    pitch: 1.1,   // 音调
    volume: 0.8   // 音量
});

// 播放控制
audioProcessor.pauseSpeech();  // 暂停
audioProcessor.resumeSpeech(); // 恢复
audioProcessor.stopSpeech();   // 停止
```

### 4. 高级功能

```javascript
// 获取可用语音列表
const voices = audioProcessor.getAvailableVoices();
console.log('可用语音:', voices);

// 获取中文语音
const chineseVoices = audioProcessor.getVoicesByLanguage('zh');
console.log('中文语音:', chineseVoices);

// 直接使用语音合成器
const synthesizer = audioProcessor.getSpeechSynthesizer();
if (synthesizer) {
    synthesizer.onStart = () => console.log('开始播放');
    synthesizer.onEnd = () => console.log('播放结束');
    synthesizer.speak('自定义语音合成');
}
```

## 在 React 组件中使用

```jsx
import React, { useState, useRef } from 'react';
import AudioProcessor from './lib/Audio';

const SpeechDemo = () => {
    const audioProcessorRef = useRef(new AudioProcessor());
    const [text, setText] = useState('');
    const [isListening, setIsListening] = useState(false);

    const handleRecognition = async () => {
        try {
            setIsListening(true);
            const result = await audioProcessorRef.current.recognizeOnce();
            setText(result);
        } catch (error) {
            alert('识别失败: ' + error.message);
        } finally {
            setIsListening(false);
        }
    };

    const handleSpeak = async () => {
        if (text.trim()) {
            try {
                await audioProcessorRef.current.speakText(text);
            } catch (error) {
                alert('合成失败: ' + error.message);
            }
        }
    };

    return (
        <div>
            <button onClick={handleRecognition} disabled={isListening}>
                {isListening ? '正在识别...' : '开始语音识别'}
            </button>
            
            <textarea 
                value={text} 
                onChange={(e) => setText(e.target.value)}
                placeholder="识别结果或输入文本"
            />
            
            <button onClick={handleSpeak}>
                语音播放
            </button>
        </div>
    );
};
```

## 浏览器兼容性

| 功能 | Chrome | Edge | Safari | Firefox |
|------|--------|------|--------|---------|
| 语音识别 | ✅ | ✅ | ✅ | ❌ |
| 语音合成 | ✅ | ✅ | ✅ | ✅ |

## 注意事项

1. **权限要求**：语音识别需要麦克风权限
2. **HTTPS 要求**：在生产环境中需要 HTTPS
3. **语言支持**：不同浏览器支持的语言可能不同
4. **网络要求**：某些浏览器的语音识别需要网络连接
5. **用户交互**：语音合成通常需要用户交互后才能播放

## 错误处理

```javascript
// 语音识别错误处理
const recognizer = audioProcessor.getSpeechRecognizer();
if (recognizer) {
    recognizer.onError = (error) => {
        switch (error) {
            case 'no-speech':
                console.log('没有检测到语音');
                break;
            case 'audio-capture':
                console.log('麦克风访问被拒绝');
                break;
            case 'not-allowed':
                console.log('语音识别权限被拒绝');
                break;
            default:
                console.log('识别错误:', error);
        }
    };
}

// 语音合成错误处理
try {
    await audioProcessor.speakText('测试文本');
} catch (error) {
    if (error.message.includes('not supported')) {
        console.log('浏览器不支持语音合成');
    } else {
        console.log('合成错误:', error.message);
    }
}
```

## 完整示例

查看 `speech-usage-example.tsx` 文件获取完整的 React 组件示例。