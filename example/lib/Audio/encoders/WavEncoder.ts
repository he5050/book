/**
 * 内置 WAV 编码器（无外部依赖）
 * 采用 16-bit PCM，封装到 WAV RIFF 容器
 */

import { Encoder, EncodeResult, EncodingType } from "../types";

export class WavEncoder implements Encoder {
  readonly type: EncodingType = "wav";
  readonly mimeType = "audio/wav";
  readonly extension = "wav";

  private sampleRate = 44100;
  private numChannels = 1;
  private buffers: Float32Array[] = [];
  private length = 0;

  async init(config: { sampleRate: number; numChannels: number }): Promise<void> {
    this.sampleRate = config.sampleRate;
    this.numChannels = Math.min(Math.max(config.numChannels, 1), 2);
    this.buffers = [];
    this.length = 0;
  }

  async encode(buffers: Float32Array[]): Promise<void> {
    // 合并多通道为交错或累加缓存，最终在 finish 阶段处理
    // 这里简单地将各通道按序追加到缓存，finish 时再交错处理
    this.buffers.push(...buffers);
    this.length += buffers[0]?.length || 0;
  }

  async finish(): Promise<EncodeResult> {
    // 将缓存的多通道数据交错为 16-bit PCM
    const frames = this.length;
    const numChannels = this.numChannels;

    // 将每个通道的数据对齐为相同长度
    const channelData: Float32Array[] = [];
    for (let ch = 0; ch < numChannels; ch++) {
      const chunks: Float32Array[] = [];
      for (let i = ch; i < this.buffers.length; i += numChannels) {
        chunks.push(this.buffers[i]);
      }
      const merged = mergeFloat32Arrays(chunks);
      channelData.push(merged);
    }

    const interleaved = interleave(channelData);
    const wavBuffer = encodeWAV(interleaved, this.sampleRate, numChannels);

    const blob = new Blob([wavBuffer], { type: this.mimeType });
    // 清理
    this.buffers = [];
    this.length = 0;

    return { blob, mimeType: this.mimeType, extension: this.extension };
  }

  async cancel(): Promise<void> {
    this.buffers = [];
    this.length = 0;
  }
}

function mergeFloat32Arrays(chunks: Float32Array[]): Float32Array {
  const total = chunks.reduce((sum, a) => sum + a.length, 0);
  const out = new Float32Array(total);
  let offset = 0;
  for (const a of chunks) {
    out.set(a, offset);
    offset += a.length;
  }
  return out;
}

function interleave(channelData: Float32Array[]): Int16Array {
  const numChannels = channelData.length;
  const frames = channelData[0].length;
  const out = new Int16Array(frames * numChannels);
  let idx = 0;
  for (let i = 0; i < frames; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      // clamp [-1,1] 转 16-bit
      let s = channelData[ch][i];
      s = Math.max(-1, Math.min(1, s));
      out[idx++] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
  }
  return out;
}

function encodeWAV(samples: Int16Array, sampleRate: number, numChannels: number): ArrayBuffer {
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  /* RIFF chunk descriptor */
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  /* fmt sub-chunk */
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true); // byte rate
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bytesPerSample * 8, true); // bits per sample
  /* data sub-chunk */
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // PCM samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    view.setInt16(offset, samples[i], true);
  }

  return buffer;
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}