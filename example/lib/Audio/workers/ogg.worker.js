/**
 * OGG(Vorbis) 编码 Worker
 * 通过 importScripts 加载 ogg-vorbis-encoder（建议配置为本地或稳定 CDN）
 *
 * 默认 CDN：
 *   https://unpkg.com/ogg-vorbis-encoder@1.3.0/build/ogg-vorbis-encoder.min.js
 *
 * 你可以通过主线程创建 Worker 时的查询参数覆盖：
 *   new Worker("ogg.worker.js?vorbis=your-url")
 */

let encoder;
let vorbisReady = false;
let sampleRate = 44100;
let numChannels = 1;

function loadVorbis(url) {
  return new Promise((resolve, reject) => {
    try {
      importScripts(url);
      if (typeof OggVorbisEncoder === "undefined") {
        reject(new Error("ogg-vorbis-encoder 未加载"));
        return;
      }
      vorbisReady = true;
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
      const vorbisUrl = params.get("vorbis") || (config.workerUrls && config.workerUrls.oggVorbis) || "https://unpkg.com/ogg-vorbis-encoder@1.3.0/build/ogg-vorbis-encoder.min.js";
      await loadVorbis(vorbisUrl);

      // eslint-disable-next-line no-undef
      const ogg = new OggVorbisEncoder(sampleRate, numChannels, 0.5); // quality 0.0-1.0
      encoder = {
        ogg,
        buffers: [],
      };
      postMessage({ cmd: "inited" });
    } else if (cmd === "encode") {
      if (!vorbisReady || !encoder) throw new Error("OGG 编码器未就绪");
      // ogg-vorbis-encoder 支持直接接收 Float32Array（交错或逐通道）
      // 这里选择交错后 push
      const interleaved = interleave(buffers);
      encoder.ogg.encode([interleaved]);
    } else if (cmd === "finish") {
      if (!encoder) throw new Error("OGG 编码器未就绪");
      const blob = encoder.ogg.finish();
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