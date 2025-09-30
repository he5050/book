/**
 * 主录音器实现，接口尽量贴近 web-audio-recorder-js
 */

import { Encoder, EncodeResult, EncodingType, RecorderEvents, RecorderOptions, StartOptions } from "./types";
import { WavEncoder } from "./encoders/WavEncoder";

type WorkerHandle = {
  worker: Worker;
  inited: boolean;
  resolveInit?: () => void;
};

export class AudioRecorder {
  private encoding: EncodingType = "wav";
  private options: RecorderOptions;
  private events: RecorderEvents;

  private audioContext?: AudioContext;
  private mediaStream?: MediaStream;
  private sourceNode?: MediaStreamAudioSourceNode;
  private processorNode?: ScriptProcessorNode;
  private workletNode?: AudioWorkletNode;

  private startTime = 0;
  private lastProgress = 0;
  private stopped = true;

  private wavEncoder?: WavEncoder;
  private workerHandle?: WorkerHandle;

  constructor(options: RecorderOptions = {}, events: RecorderEvents = {}) {
    this.options = options;
    this.events = events;
  }

  setOptions(options: RecorderOptions) {
    this.options = { ...this.options, ...options };
  }

  setEncoding(type: EncodingType) {
    this.encoding = type;
  }

  async startRecording(startOptions?: StartOptions): Promise<void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("当前环境不支持麦克风录制");
    }
    if (!this.stopped) {
      throw new Error("录制已在进行中");
    }

    this.stopped = false;
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaStream = stream;
    this.sourceNode = this.audioContext.createMediaStreamSource(stream);

    const sampleRate = this.options.sampleRate || this.audioContext.sampleRate;
    const numChannels = Math.min(Math.max(this.options.numChannels || 1, 1), 2);

    // 初始化编码器
    await this.initEncoder({ sampleRate, numChannels });
    this.events.onEncoderLoaded?.(this.encoding);

    // 建立拉流
    const useWorklet = !!this.options.useAudioWorklet && !!this.audioContext.audioWorklet;
    if (useWorklet) {
      await this.ensureWorkletLoaded();
      this.workletNode = new AudioWorkletNode(this.audioContext, "pcm-processor", { numberOfInputs: 1, numberOfOutputs: 1 });
      this.workletNode.port.onmessage = (e) => {
        const { cmd, buffers } = e.data || {};
        if (cmd === "audio") this.onAudioFrame(buffers);
      };
      this.sourceNode.connect(this.workletNode).connect(this.audioContext.destination);
    } else {
      const bufferSize = this.options.bufferSize || 4096;
      this.processorNode = this.audioContext.createScriptProcessor(bufferSize, numChannels, numChannels);
      this.processorNode.onaudioprocess = (ev) => {
        const input = ev.inputBuffer;
        const buffers: Float32Array[] = [];
        for (let ch = 0; ch < numChannels; ch++) {
          buffers.push(input.getChannelData(ch));
        }
        this.onAudioFrame(buffers);
      };
      this.sourceNode.connect(this.processorNode);
      this.processorNode.connect(this.audioContext.destination);
    }

    this.startTime = performance.now();
    this.lastProgress = 0;
  }

  async finishRecording(): Promise<void> {
    if (this.stopped) return;
    this.stopped = true;

    try {
      const result = await this.finishEncoder();
      this.cleanupGraph();
      this.events.onComplete?.(result);
    } catch (err) {
      this.cleanupGraph();
      this.events.onError?.(err);
    }
  }

  async cancelRecording(): Promise<void> {
    if (this.stopped) return;
    this.stopped = true;
    try {
      await this.cancelEncoder();
    } finally {
      this.cleanupGraph();
    }
  }

  private async initEncoder(config: { sampleRate: number; numChannels: number }): Promise<void> {
    if (this.encoding === "wav") {
      this.wavEncoder = new WavEncoder();
      await this.wavEncoder.init(config);
    } else if (this.encoding === "mp3" || this.encoding === "ogg") {
      const workerUrl = this.resolveWorkerUrl(this.encoding);
      const worker = new Worker(workerUrl);
      this.workerHandle = { worker, inited: false };
      const initedPromise = new Promise<void>((resolve) => {
        this.workerHandle!.resolveInit = resolve;
      });
      worker.onmessage = (e) => {
        const { cmd } = e.data || {};
        if (cmd === "inited") {
          this.workerHandle!.inited = true;
          this.workerHandle!.resolveInit?.();
        } else if (cmd === "error") {
          this.events.onError?.(e.data.error);
        } else if (cmd === "done") {
          // 完成阶段处理在 finishEncoder
        }
      };
      worker.postMessage({ cmd: "init", config: { ...config, workerUrls: this.options.workerUrls } });
      await initedPromise;
    } else {
      throw new Error("不支持的编码类型: " + this.encoding);
    }
  }

  private resolveWorkerUrl(type: EncodingType): string {
    const base = (this.options.workerUrls && (type === "mp3" ? this.options.workerUrls.mp3 : this.options.workerUrls.ogg)) || "";
    if (base) return base;
    // 默认指向 public/workers 下的静态文件路径（Vite/webpack 等通常以 / 作为 public 根）
    return type === "mp3" ? "/workers/mp3.worker.js" : "/workers/ogg.worker.js";
  }

  private async ensureWorkletLoaded(): Promise<void> {
    try {
      await this.audioContext!.audioWorklet.addModule("/example/lib/Audio/worklet/pcm-processor.js");
    } catch (err) {
      // 回退
      console.warn("AudioWorklet 加载失败，回退到 ScriptProcessorNode：", err);
    }
  }

  private async onAudioFrame(buffers: Float32Array[]): Promise<void> {
    if (this.stopped) return;

    const now = performance.now();
    const elapsed = now - this.startTime;
    if (this.options.timeLimit && elapsed >= this.options.timeLimit) {
      await this.finishRecording();
      return;
    }
    if (this.options.progressInterval) {
      if (now - this.lastProgress >= this.options.progressInterval) {
        this.lastProgress = now;
        this.events.onProgress?.(elapsed);
      }
    }

    if (this.encoding === "wav") {
      await this.wavEncoder!.encode(buffers);
    } else if (this.encoding === "mp3" || this.encoding === "ogg") {
      this.workerHandle!.worker.postMessage({ cmd: "encode", buffers }, buffers.map(b => b.buffer));
    }
  }

  private async finishEncoder(): Promise<EncodeResult> {
    if (this.encoding === "wav") {
      return await this.wavEncoder!.finish();
    } else if (this.encoding === "mp3") {
      const result = await this.finishWorker("audio/mpeg", "mp3");
      return result;
    } else if (this.encoding === "ogg") {
      const result = await this.finishWorker("audio/ogg", "ogg");
      return result;
    }
    throw new Error("未知编码类型");
  }

  private async finishWorker(mimeType: string, extension: string): Promise<EncodeResult> {
    const worker = this.workerHandle!.worker;
    const donePromise = new Promise<EncodeResult>((resolve, reject) => {
      const onMsg = (e: MessageEvent) => {
        const { cmd, blob, error } = e.data || {};
        if (cmd === "done") {
          worker.removeEventListener("message", onMsg);
          resolve({ blob, mimeType, extension });
        } else if (cmd === "error") {
          worker.removeEventListener("message", onMsg);
          reject(error);
        }
      };
      worker.addEventListener("message", onMsg);
    });
    worker.postMessage({ cmd: "finish" });
    const res = await donePromise;
    return res;
  }

  private async cancelEncoder(): Promise<void> {
    if (this.encoding === "wav") {
      await this.wavEncoder?.cancel();
    } else if (this.workerHandle) {
      this.workerHandle.worker.postMessage({ cmd: "cancel" });
    }
  }

  private cleanupGraph() {
    try {
      this.processorNode?.disconnect();
    } catch {}
    try {
      this.workletNode?.disconnect();
    } catch {}
    try {
      this.sourceNode?.disconnect();
    } catch {}
    try {
      this.mediaStream?.getTracks().forEach(t => t.stop());
    } catch {}
    try {
      this.audioContext?.close();
    } catch {}
    this.processorNode = undefined;
    this.workletNode = undefined;
    this.sourceNode = undefined;
    this.mediaStream = undefined;
    this.audioContext = undefined;
  }
}