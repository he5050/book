# Audio Recording Library

A comprehensive TypeScript audio recording library that provides recording, playback, and audio format conversion capabilities for web applications.

## Features

- 🎙️ **Audio Recording**: Record audio from microphone with customizable settings
- ▶️ **Audio Playback**: Play recorded audio with full control (play, pause, resume, stop)
- 🔄 **Format Conversion**: Convert between PCM and WAV formats
- 📊 **Real-time Analysis**: Get audio waveform data during recording and playback
- ⚙️ **Configurable**: Customizable sample rate, bit depth, and channel count
- 💾 **Download Support**: Download recorded audio as PCM or WAV files
- 🎚️ **Volume Monitoring**: Real-time volume level detection
- ⏱️ **Duration Tracking**: Track recording and playback duration

## Installation

```bash
npm install your-audio-library
```

## Quick Start

```typescript
import AudioRecorder from './Audio';

// Create recorder instance
const recorder = new AudioRecorder({
  sampleRate: 44100,
  sampleBits: 16,
  numChannels: 1
});

// Start recording
recorder.start().then(() => {
  console.log('Recording started');
}).catch(err => {
  console.error('Failed to start recording:', err);
});

// Stop recording
recorder.stop();

// Play recorded audio
recorder.play();

// Download as WAV
recorder.downloadWAV('my-recording');
```

## Configuration Options

```typescript
interface RecorderConfig {
  sampleBits?: number;    // Sample bit depth: 8 or 16 (default: 16)
  sampleRate?: number;    // Sample rate in Hz (default: browser's native rate)
  numChannels?: number;   // Number of channels: 1 or 2 (default: 1)
  compiling?: boolean;    // Real-time processing (experimental)
}
```

### Supported Sample Rates
- 8000 Hz
- 11025 Hz  
- 16000 Hz
- 22050 Hz
- 24000 Hz
- 44100 Hz
- 48000 Hz

## API Reference

### Recording Methods

#### `start(): Promise<void>`
Start audio recording. Returns a promise that resolves when recording begins.

#### `pause(): void`
Pause the current recording session.

#### `resume(): void`
Resume a paused recording session.

#### `stop(): void`
Stop the current recording session.

### Playback Methods

#### `play(): void`
Play the recorded audio.

#### `pausePlay(): void`
Pause audio playback.

#### `resumePlay(): void`
Resume paused audio playback.

#### `stopPlay(): void`
Stop audio playback.

#### `getPlayTime(): number`
Get the current playback time in seconds.

### Data Export Methods

#### `getPCM(): DataView`
Get recorded audio as PCM data.

#### `getPCMBlob(): Blob`
Get recorded audio as PCM Blob.

#### `getWAV(): DataView`
Get recorded audio as WAV data with proper headers.

#### `getWAVBlob(): Blob`
Get recorded audio as WAV Blob.

#### `getChannelData(): { left: DataView, right?: DataView }`
Get separate left and right channel data.

### Download Methods

#### `downloadPCM(name?: string): void`
Download recorded audio as PCM file.

#### `downloadWAV(name?: string): void`
Download recorded audio as WAV file.

#### `download(blob: Blob, name: string, type: string): void`
Generic download method for custom formats.

### Analysis Methods

#### `getRecordAnalyseData(): Uint8Array`
Get real-time waveform data during recording.

#### `getPlayAnalyseData(): Uint8Array`
Get real-time waveform data during playback.

### Utility Methods

#### `setOption(options: RecorderConfig): void`
Update recorder configuration.

#### `destroy(): Promise<void>`
Clean up resources and destroy the recorder instance.

## Event Callbacks

```typescript
// Recording progress
recorder.onprogress = (data) => {
  console.log(`Duration: ${data.duration}s, Size: ${data.fileSize} bytes, Volume: ${data.vol}%`);
};

// Legacy progress callback
recorder.onprocess = (duration) => {
  console.log(`Recording duration: ${duration}s`);
};

// Playback events
recorder.onPlay = () => console.log('Playback started');
recorder.onPausePlay = () => console.log('Playback paused');
recorder.onResumePlay = () => console.log('Playback resumed');
recorder.onStopPlay = () => console.log('Playback stopped');
recorder.onPlayEnd = () => console.log('Playback finished');
```

## Browser Compatibility

- Chrome 47+
- Firefox 44+
- Safari 11+
- Edge 79+

Requires `getUserMedia` API support for microphone access.

## Error Handling

```typescript
recorder.start().catch(error => {
  if (error.name === 'NotAllowedError') {
    console.error('Microphone access denied');
  } else if (error.name === 'NotFoundError') {
    console.error('No microphone found');
  } else {
    console.error('Recording error:', error);
  }
});
```

## Examples

### Basic Recording
```typescript
const recorder = new AudioRecorder();

// Start recording
await recorder.start();

// Record for 5 seconds
setTimeout(() => {
  recorder.stop();
  recorder.downloadWAV('recording');
}, 5000);
```

### High Quality Stereo Recording
```typescript
const recorder = new AudioRecorder({
  sampleRate: 48000,
  sampleBits: 16,
  numChannels: 2
});

recorder.onprogress = (data) => {
  updateUI(data.duration, data.vol);
};

await recorder.start();
```

### Real-time Audio Visualization
```typescript
const recorder = new AudioRecorder();
await recorder.start();

function visualize() {
  const data = recorder.getRecordAnalyseData();
  drawWaveform(data);
  requestAnimationFrame(visualize);
}
visualize();
```

## License

MIT License