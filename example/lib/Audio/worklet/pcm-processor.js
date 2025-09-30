/**
 * AudioWorkletProcessor：拉取 PCM 帧并发送到主线程
 */
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.port.postMessage({ cmd: "worklet-ready" });
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;
    // 每通道一个 Float32Array
    const channelData = input.map(ch => ch[0]);
    // 复制以便传输
    const cloned = channelData.map(arr => new Float32Array(arr));
    this.port.postMessage({ cmd: "audio", buffers: cloned }, cloned.map(b => b.buffer));
    return true;
  }
}

registerProcessor("pcm-processor", PCMProcessor);