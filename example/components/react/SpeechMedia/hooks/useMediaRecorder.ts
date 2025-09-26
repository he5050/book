import { useState, useRef } from 'react';

// 定义媒体类型
export type MediaType = 'audio' | 'video';

// 定义Hook返回类型
export interface UseMediaRecorderReturn {
	isRecording: boolean;
	mediaBlob: Blob | null;
	mediaStream: MediaStream | null;
	startRecording: () => Promise<void>;
	stopRecording: () => void;
	resetRecording: () => void;
	error: string | null;
	isSupported: boolean;
}

const useMediaRecorder = (mediaType: MediaType = 'audio'): UseMediaRecorderReturn => {
	const [isRecording, setIsRecording] = useState(false);
	const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isSupported, setIsSupported] = useState(true);
	const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const mediaStreamRef = useRef<MediaStream | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	// 检查浏览器支持
	const checkSupport = () => {
		if (!navigator.mediaDevices || !window.MediaRecorder) {
			setIsSupported(false);
			setError('浏览器不支持媒体录制功能');
			return false;
		}
		return true;
	};

	// 开始录制
	const startRecording = async () => {
		if (!checkSupport()) return;

		try {
			// 获取媒体流
			const constraints = mediaType === 'audio' ? { audio: true } : { video: true, audio: true };

			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			mediaStreamRef.current = stream;
			setMediaStream(stream);

			// 创建MediaRecorder实例
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			chunksRef.current = [];

			// 设置事件监听
			mediaRecorder.ondataavailable = event => {
				if (event.data.size > 0) {
					chunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				const blob = new Blob(chunksRef.current, {
					type: mediaType === 'audio' ? 'audio/webm' : 'video/webm'
				});
				setMediaBlob(blob);
				setIsRecording(false);

				// 停止所有轨道
				stream.getTracks().forEach(track => track.stop());
				setMediaStream(null);
			};

			mediaRecorder.onerror = event => {
				setError('录制过程中发生错误');
				setIsRecording(false);
			};

			// 开始录制
			mediaRecorder.start(1000); // 每秒触发一次dataavailable事件，实现实时预览
			setIsRecording(true);
			setError(null);
		} catch (err) {
			setError('获取媒体设备权限失败: ' + (err as Error).message);
			setIsRecording(false);
		}
	};

	// 停止录制
	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
		}
	};

	// 重置录制
	const resetRecording = () => {
		setMediaBlob(null);
		setError(null);
		chunksRef.current = [];

		// 如果还在录制中，先停止
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
		}

		// 停止媒体流
		if (mediaStreamRef.current) {
			mediaStreamRef.current.getTracks().forEach(track => track.stop());
			mediaStreamRef.current = null;
			setMediaStream(null);
		}
	};

	return {
		isRecording,
		mediaBlob,
		mediaStream,
		startRecording,
		stopRecording,
		resetRecording,
		error,
		isSupported
	};
};

export default useMediaRecorder;
