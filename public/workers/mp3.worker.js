/**
 * MP3 编码 Worker
 * 通过 importScripts 加载 lamejs（建议配置为本地或稳定 CDN）
 *
 * 默认 CDN：
 *   https://unpkg.com/lamejs@1.2.0/lame.min.js
 *
 * 你可以通过主线程创建 Worker 时的查询参数覆盖：
 *   new Worker("mp3.worker.js?lamejs=your-url")
 */

let encoder;
let lameReady = false;
let sampleRate = 44100;
let numChannels = 1;

function loadLame(url) {
  return new Promise((resolve, reject) => {
    try {
      importScripts(url);
      // lamejs 暴露为 Lame
      if (typeof Lame === "undefined" && typeof lamejs === "undefined") {
        reject(new Error("lamejs 未加载"));
        return;
      }
      lameReady = true;
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

self.onmessage = async (e) => {
  const { cmd, config, buffers } = e.data || {};
  try {
    if (cmd === "init") {
      sampleRate = config.sampleRate;
      numChannels = config.numChannels;
      const params = new URLSearchParams(self.location.search);
      const lameUrl = params.get("lamejs") || (config.workerUrls && config.workerUrls.lamejs) || "https://unpkg.com/lamejs@1.2.0/lame.min.js";
      await loadLame(lameUrl);

      const channels = numChannels;
      // 初始化 lamejs 编码器
      // eslint-disable-next-line no-undef
      const mp3Encoder = new Lame.Mp3Encoder(channels, sampleRate, 128);
      encoder = {
        mp3Encoder,
        buffers: [],
      };
      postMessage({ cmd: "inited" });
    } else if (cmd === "encode") {
      // buffers: Float32Array per channel
      if (!lameReady || !encoder) throw new Error("MP3 编码器未就绪");

      const interleaved = interleave(buffers);
      // 转 Int16
      const pcm16 = floatTo16BitPCM(interleaved);

      // lamejs 需要 Int16Array 分块编码
      const mp3buf = encoder.mp3Encoder.encodeBuffer(pcm16);
      if (mp3buf && mp3buf.length > 0) {
        encoder.buffers.push(new Uint8Array(mp3buf));
      }
    } else if (cmd === "finish") {
      if (!encoder) throw new Error("MP3 编码器未就绪");
      const mp3buf = encoder.mp3Encoder.flush();
      if (mp3buf && mp3buf.length > 0) {
        encoder.buffers.push(new Uint8Array(mp3buf));
      }
      const blob = new Blob(encoder.buffers, { type: "audio/mpeg" });
      encoder = null;
      postMessage({ cmd: "done", blob });
    } else if (cmd === "cancel") {
      encoder = null;
      postMessage({ cmd: "canceled" });
    }
  } catch (err) {
    postMessage({ cmd: "error", error: String(err) });
  }
};

function interleave(channelData) {
  const numChannels = channelData.length;
  if (numChannels === 1) return channelData[0];
  const left = channelData[0];
  const right = channelData[1];
  const len = Math.min(left.length, right.length);
  const out = new Float32Array(len * 2);
  let i = 0;
  let j = 0;
  while (i < len) {
    out[j++] = left[i];
    out[j++] = right[i];
    i++;
  }
  return out;
}

function floatTo16BitPCM(input) {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    let s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return output;
}