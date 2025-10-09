/**
 * 备用 MP3 编码方案
 * 如果 lamejs 有问题，可以使用这个简化版本
 */

/**
 * 使用 Web Audio API 进行 MP3 编码的备用方案
 * 注意：这个方案需要浏览器支持 MediaRecorder API
 */
export async function encodeMP3Alternative(
    pcmData: DataView,
    sampleRate: number,
    numChannels: number,
    bitrateKbps: number = 128
): Promise<Uint8Array[]> {
    return new Promise((resolve, reject) => {
        try {
            // 创建 AudioContext
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
                sampleRate: sampleRate
            });
            
            // 将 PCM 数据转换为 AudioBuffer
            const samples = pcmData.byteLength / 2; // 16位
            const audioBuffer = audioContext.createBuffer(numChannels, samples / numChannels, sampleRate);
            
            // 填充音频数据
            for (let channel = 0; channel < numChannels; channel++) {
                const channelData = audioBuffer.getChannelData(channel);
                for (let i = 0; i < channelData.length; i++) {
                    const sampleIndex = numChannels === 1 ? i : i * numChannels + channel;
                    const sample = pcmData.getInt16(sampleIndex * 2, true) / 32768;
                    channelData[i] = sample;
                }
            }
            
            // 使用 OfflineAudioContext 渲染音频
            const offlineContext = new OfflineAudioContext(numChannels, audioBuffer.length, sampleRate);
            const source = offlineContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(offlineContext.destination);
            source.start();
            
            offlineContext.startRendering().then(renderedBuffer => {
                // 这里需要进一步处理，将 AudioBuffer 转换为 MP3
                // 由于浏览器限制，这个方案可能需要额外的库支持
                reject(new Error('备用方案需要进一步实现'));
            });
            
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * 使用 MediaRecorder API 的备用方案
 * 这个方案可以直接录制为 MP3（如果浏览器支持）
 */
export function createMP3RecorderAlternative(sampleRate: number, numChannels: number): MediaRecorder | null {
    try {
        // 创建一个虚拟的音频流
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
            sampleRate: sampleRate
        });
        
        const oscillator = audioContext.createOscillator();
        const destination = audioContext.createMediaStreamDestination();
        oscillator.connect(destination);
        
        // 尝试创建 MP3 MediaRecorder
        const mimeTypes = [
            'audio/mpeg',
            'audio/mp3',
            'audio/webm;codecs=opus',
            'audio/ogg;codecs=opus'
        ];
        
        for (const mimeType of mimeTypes) {
            if (MediaRecorder.isTypeSupported(mimeType)) {
                console.log(`支持的音频格式: ${mimeType}`);
                return new MediaRecorder(destination.stream, {
                    mimeType: mimeType,
                    audioBitsPerSecond: 128000
                });
            }
        }
        
        return null;
    } catch (error) {
        console.error('创建备用录音器失败:', error);
        return null;
    }
}