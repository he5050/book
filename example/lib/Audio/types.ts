/**
 * 音频录制与编码类型定义
 * 所有注释与交互输出为中文
 */

export type EncodingType = "wav" | "mp3" | "ogg";

export interface RecorderOptions {
  sampleRate?: number; // 目标采样率（默认使用 AudioContext.sampleRate）
  numChannels?: number; // 通道数（1 或 2）
  bufferSize?: number; // ScriptProcessorNode 缓冲大小（如 4096）
  timeLimit?: number; // 录制时长上限（毫秒）
  progressInterval?: number; // 进度回调间隔（毫秒）
  encodeAfterRecord?: boolean; // 是否录制后统一编码（true）或边录边编码（false）
  useAudioWorklet?: boolean; // 优先使用 AudioWorklet
  workerUrls?: {
    mp3?: string; // mp3.worker.js 的路径
    ogg?: string; // ogg.worker.js 的路径
    lamejs?: string; // lamejs CDN 或本地路径
    oggVorbis?: string; // ogg-vorbis-encoder CDN 或本地路径
  };
}

export interface EncodeResult {
  blob: Blob;
  mimeType: string;
  extension: string;
}

export interface Encoder {
  readonly type: EncodingType;
  readonly mimeType: string;
  readonly extension: string;
  /**
   * 初始化编码器
   */
  init(config: { sampleRate: number; numChannels: number }): Promise<void>;
  /**
   * 送入一帧 PCM 数据（每通道一个 Float32Array）
   */
  encode(buffers: Float32Array[]): Promise<void>;
  /**
   * 完成编码并返回结果
   */
  finish(): Promise<EncodeResult>;
  /**
   * 取消编码（清理资源）
   */
  cancel(): Promise<void>;
}

export interface RecorderEvents {
  onEncoderLoaded?: (type: EncodingType) => void;
  onComplete?: (result: EncodeResult) => void;
  onError?: (error: unknown) => void;
  onProgress?: (elapsedMs: number) => void;
}

export interface StartOptions {
  // 预留，用于后续扩展
}