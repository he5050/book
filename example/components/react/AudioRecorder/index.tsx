import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AudioRecorder, EncodingType, EncodeResult } from "../../../lib/Audio";

/**
 * 可配置的录音示例组件（React）
 * - 支持选择编码类型："wav" | "mp3" | "ogg"
 * - 支持配置通道数、是否优先使用 AudioWorklet、进度回调间隔、worker/CDN 地址
 * - 提供开始/结束/取消操作，展示进度与最终音频预览和下载链接
 *
 * 说明：
 * - 该组件仅为示例，UI 简单直观，便于快速验证功能；
 * - 若你需要在实际页面中使用，请根据项目风格进一步美化；
 */

type WorkerUrlsConfig = {
  mp3: string;
  ogg: string;
  lamejs: string;
  oggVorbis: string;
};

export interface AudioRecorderDemoProps {
  /** 初始编码类型 */
  initialEncoding?: EncodingType;
  /** 初始通道数（1 或 2） */
  initialNumChannels?: number;
  /** 是否优先使用 AudioWorklet */
  initialUseAudioWorklet?: boolean;
  /** 进度回调间隔（毫秒） */
  initialProgressInterval?: number;
  /** 录制最长时长（毫秒），可选；达到后自动结束 */
  initialTimeLimit?: number;
  /** 初始 worker/CDN 地址 */
  initialWorkerUrls?: Partial<WorkerUrlsConfig>;
}

/**
 * 默认的 worker/CDN 地址（建议根据你的部署将其改为本地路径）
 * - mp3.worker.js / ogg.worker.js 使用我们在 example/lib/Audio/workers 下创建的文件
 * - lamejs / ogg-vorbis-encoder 使用 unpkg CDN（生产环境建议自托管）
 */
const DEFAULT_WORKER_URLS: WorkerUrlsConfig = {
  mp3: "/workers/mp3.worker.js",
  ogg: "/workers/ogg.worker.js",
  lamejs: "https://unpkg.com/lamejs@1.2.0/lame.min.js",
  oggVorbis: "https://unpkg.com/ogg-vorbis-encoder@1.3.0/build/ogg-vorbis-encoder.min.js",
};

export const AudioRecorderDemo: React.FC<AudioRecorderDemoProps> = ({
  initialEncoding = "mp3",
  initialNumChannels = 1,
  initialUseAudioWorklet = true,
  initialProgressInterval = 500,
  initialTimeLimit,
  initialWorkerUrls = {},
}) => {
  // 配置状态
  const [encoding, setEncoding] = useState<EncodingType>(initialEncoding);
  const [numChannels, setNumChannels] = useState<number>(initialNumChannels);
  const [useAudioWorklet, setUseAudioWorklet] = useState<boolean>(initialUseAudioWorklet);
  const [progressInterval, setProgressInterval] = useState<number>(initialProgressInterval);
  const [timeLimit, setTimeLimit] = useState<number | undefined>(initialTimeLimit);

  const [workerUrls, setWorkerUrls] = useState<WorkerUrlsConfig>({
    ...DEFAULT_WORKER_URLS,
    ...initialWorkerUrls,
  });

  // 运行时状态
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [result, setResult] = useState<EncodeResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // 初始化录音器（在开始录制时才真正创建）
  const buildRecorder = useCallback(() => {
    const recorder = new AudioRecorder(
      {
        numChannels,
        useAudioWorklet,
        progressInterval,
        timeLimit,
        workerUrls,
      },
      {
        onEncoderLoaded: (type) => {
          // 编码器就绪事件
          console.log("编码器已就绪：", type);
        },
        onProgress: (ms) => {
          setElapsedMs(ms);
        },
        onComplete: (res) => {
          setIsRecording(false);
          setResult(res);
          // 管理生成的 URL，避免泄漏
          if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current);
            audioUrlRef.current = null;
          }
          const url = URL.createObjectURL(res.blob);
          audioUrlRef.current = url;
        },
        onError: (err) => {
          setIsRecording(false);
          setErrorMsg(String(err));
        },
      }
    );
    recorder.setEncoding(encoding);
    return recorder;
  }, [encoding, numChannels, useAudioWorklet, progressInterval, timeLimit, workerUrls]);

  const startRecording = useCallback(async () => {
    setErrorMsg(null);
    setResult(null);
    setElapsedMs(0);

    const recorder = buildRecorder();
    recorderRef.current = recorder;

    try {
      await recorder.startRecording();
      setIsRecording(true);
    } catch (err) {
      setErrorMsg(String(err));
      recorderRef.current = null;
      setIsRecording(false);
    }
  }, [buildRecorder]);

  const finishRecording = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder) return;
    try {
      await recorder.finishRecording();
      // onComplete 回调会处理 result 与 URL
    } catch (err) {
      setErrorMsg(String(err));
    } finally {
      recorderRef.current = null;
      setIsRecording(false);
    }
  }, []);

  const cancelRecording = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder) return;
    try {
      await recorder.cancelRecording();
    } catch (err) {
      setErrorMsg(String(err));
    } finally {
      recorderRef.current = null;
      setIsRecording(false);
    }
  }, []);

  // 组件卸载时清理 URL
  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  const canStart = useMemo(() => !isRecording, [isRecording]);
  const canFinish = useMemo(() => isRecording, [isRecording]);
  const canCancel = useMemo(() => isRecording, [isRecording]);

  return (
    <div style={{ maxWidth: 720, margin: "24px auto", padding: 16, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>录音示例（可配置）</h2>

      <fieldset style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 16 }}>
        <legend>基础配置</legend>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            编码类型
            <select
              value={encoding}
              onChange={(e) => setEncoding(e.target.value as EncodingType)}
              style={{ width: "100%", marginTop: 4 }}
              disabled={isRecording}
            >
              <option value="wav">WAV</option>
              <option value="mp3">MP3</option>
              <option value="ogg">OGG (Vorbis)</option>
            </select>
          </label>

          <label>
            通道数
            <select
              value={numChannels}
              onChange={(e) => setNumChannels(Number(e.target.value))}
              style={{ width: "100%", marginTop: 4 }}
              disabled={isRecording}
            >
              <option value={1}>单声道 (1)</option>
              <option value={2}>双声道 (2)</option>
            </select>
          </label>

          <label>
            优先使用 AudioWorklet
            <select
              value={useAudioWorklet ? "yes" : "no"}
              onChange={(e) => setUseAudioWorklet(e.target.value === "yes")}
              style={{ width: "100%", marginTop: 4 }}
              disabled={isRecording}
            >
              <option value="yes">是</option>
              <option value="no">否</option>
            </select>
          </label>

          <label>
            进度间隔 (ms)
            <input
              type="number"
              value={progressInterval}
              onChange={(e) => setProgressInterval(Math.max(0, Number(e.target.value)))}
              style={{ width: "100%", marginTop: 4 }}
              disabled={isRecording}
            />
          </label>

          <label>
            最长录制时长 (ms，可选)
            <input
              type="number"
              value={typeof timeLimit === "number" ? timeLimit : ""}
              placeholder="例如 10000"
              onChange={(e) => {
                const v = e.target.value;
                setTimeLimit(v === "" ? undefined : Math.max(0, Number(v)));
              }}
              style={{ width: "100%", marginTop: 4 }}
              disabled={isRecording}
            />
          </label>
        </div>
      </fieldset>

      <fieldset style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 16 }}>
        <legend>Worker/CDN 地址配置</legend>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
          <label>
            mp3.worker.js
            <input
              type="text"
              value={workerUrls.mp3}
              onChange={(e) => setWorkerUrls((prev) => ({ ...prev, mp3: e.target.value }))}
              style={{ width: "100%", marginTop: 4 }}
              disabled={isRecording}
            />
          </label>
          <label>
            ogg.worker.js
            <input
              type="text"
              value={workerUrls.ogg}
              onChange={(e) => setWorkerUrls((prev) => ({ ...prev, ogg: e.target.value }))}
              style={{ width: "100%", marginTop: 4 }}
              disabled={isRecording}
            />
          </label>
          <label>
            lamejs（MP3 编码库）
            <input
              type="text"
              value={workerUrls.lamejs}
              onChange={(e) => setWorkerUrls((prev) => ({ ...prev, lamejs: e.target.value }))}
              style={{ width: "100%", marginTop: 4 }}
              disabled={isRecording}
            />
          </label>
          <label>
            ogg-vorbis-encoder（OGG 编码库）
            <input
              type="text"
              value={workerUrls.oggVorbis}
              onChange={(e) => setWorkerUrls((prev) => ({ ...prev, oggVorbis: e.target.value }))}
              style={{ width: "100%", marginTop: 4 }}
              disabled={isRecording}
            />
          </label>
          <p style={{ color: "#666", marginTop: 8 }}>
            提示：生产环境建议将上述依赖改为你的本地/私有 CDN 路径以获得更好的稳定性与离线能力。
          </p>
        </div>
      </fieldset>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={startRecording} disabled={!canStart} style={{ padding: "8px 12px" }}>开始录制</button>
        <button onClick={finishRecording} disabled={!canFinish} style={{ padding: "8px 12px" }}>结束录制</button>
        <button onClick={cancelRecording} disabled={!canCancel} style={{ padding: "8px 12px" }}>取消录制</button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>录制状态：</strong> {isRecording ? "进行中..." : "空闲"}
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>进度(ms)：</strong> {elapsedMs}
      </div>

      {errorMsg && (
        <div style={{ color: "red", marginBottom: 12 }}>
          错误：{errorMsg}
        </div>
      )}

      {result && (
        <div style={{ borderTop: "1px dashed #ddd", paddingTop: 12 }}>
          <div style={{ marginBottom: 8 }}>
            <strong>结果：</strong> {result.mimeType}（.{result.extension}）
          </div>
          <audio
            controls
            src={audioUrlRef.current || undefined}
            style={{ width: "100%", marginBottom: 8 }}
          />
          <div>
            <a
              href={audioUrlRef.current || "#"}
              download={`record.${result.extension}`}
              style={{ color: "#1677ff" }}
            >
              下载音频
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorderDemo;