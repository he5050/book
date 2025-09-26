import React, { useEffect, useRef } from 'react';
import './index.scss';

interface Char {
	value: string;
	x: number;
	y: number;
	speed: number;
}

interface Stream {
	chars: Char[];
}

const TextStream: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const streamsRef = useRef<Stream[]>([]);
	const animationFrameIdRef = useRef<number>(0);

	// 定义文案数组
	const copywriting = [
		'梦想的路上，有你相伴，便是最美的风景',
		'你的微笑，是我一天中最温暖的阳光',
		'مرحبا بالعالم',
		'与你相遇，是命运最温柔的安排',
		'你眼中有春与秋，胜过我见过的所有山川河流',
		'愿岁月温柔以待，愿你笑靥如花',
		'你是我心中的诗，读你千遍也不厌倦',
		'你若安好，便是晴天',
		'愿做你生命中的暖阳，温暖你的每一个冬日',
		'你的名字，是我读过最短的情诗',
		'你是我漫漫人生路上，最美的意外',
		'Helo Byd',
		'Hej Verden',
		'Hallo Welt',
		'Γειά σου Κόσμε',
		'Hello World',
		'Hola Mundo',
		'Tere, Maailm',
		'Kaixo Mundua',
		'سلام دنیا',
		'Hei maailma',
		'Bonjour le monde',
		'Dia duit an Domhan',
		'Ola mundo',
		'હેલો વર્લ્ડ',
		'Sannu Duniya',
		'नमस्ते दुनिया',
		'Pozdrav svijete',
		'Bonjou Mondyal la',
		'Helló Világ',
		'Բարեւ աշխարհ',
		'Halo Dunia',
		'Ndewo Ụwa',
		'Halló heimur',
		'你的存在，让整个世界都变得温柔起来',
		'你是我心中的星辰，照亮我前行的夜空',
		'こんにちは世界',
		'Გამარჯობა მსოფლიო',
		'Сәлем Әлем',
		'សួស្តី​ពិភពលោក',
		'ಹಲೋ ವರ್ಲ್ಡ್',
		'안녕하세요 월드',
		'你的笑容，是我一天中最甜美的糖果',
		'ສະ​ບາຍ​ດີ​ຊາວ​ໂລກ',
		'你是我平凡生活中的一抹亮色，让我的世界不再单调',
		'Sveika pasaule',
		'愿为你守候，直到时间的尽头',
		'你是我心中那片不灭的灯火，温暖而明亮',
		'Здраво свету',
		'ഹലോ വേൾഡ്',
		'Сайн уу',
		'हॅलो वर्ल्ड',
		'你的每一个小动作，都是我眼中最美的风景',
		'Hello dinja',
		'မင်္ဂလာပါကမ္ဘာလောက',
		'नमस्कार संसार',
		'Hallo Wereld',
		'Hei Verden',
		'Moni Dziko Lapansi',
		'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਦੁਨਿਆ',
		'你是我不期而遇的温暖，和生生不息的希望',
		'Olá Mundo',
		'你的眼睛里有星辰大海，让我沉溺其中',
		'愿为你遮风挡雨，陪你走过四季',
		'හෙලෝ වර්ල්ඩ්',
		'Kamusta Mundo',
		'Mo ki O Ile Aiye',
		'你好，世界',
		'Sawubona Mhlaba'
	];

	const charSize = 18;
	const fallRate = charSize / 2;

	// 反转字符串数组
	const langs = copywriting.map(str => str.split('').reverse().join(''));

	// 创建字符对象
	const createChar = (value: string, x: number, y: number, speed: number): Char => {
		return { value, x, y, speed };
	};

	// 创建文本流
	const createStream = (text: string, x: number): Stream => {
		const y = Math.random() * (text.length * 4);
		const speed = Math.random() * 2 + 1;
		const chars: Char[] = [];

		for (let i = text.length - 1; i >= 0; i--) {
			chars.push(createChar(text[i], x, (y + text.length - i) * charSize, speed));
		}

		return { chars };
	};

	// 创建所有文本流
	const createStreams = (width: number) => {
		const streams: Stream[] = [];
		for (let i = 0; i < width; i += charSize) {
			streams.push(createStream(langs[Math.floor(Math.random() * langs.length)], i));
		}
		return streams;
	};

	// 重置文本流
	const reset = (width: number) => {
		streamsRef.current = createStreams(width);
	};

	// 绘制字符
	const drawChar = (ctx: CanvasRenderingContext2D, char: Char, isLast: boolean) => {
		const flick = Math.random() * 100;

		if (flick < 10) {
			ctx.fillStyle = 'hsl(120, 30%, 100%)';
			ctx.fillText(Math.floor(Math.random() * 10).toString(), char.x, char.y);
		} else {
			ctx.fillStyle = 'hsl(120, 100%, 100%)';
			ctx.fillText(char.value, char.x, char.y);
		}

		// 更新字符位置
		char.y = char.y > ctx.canvas.height ? 0 : char.y + char.speed;
	};

	// 绘制文本流
	const drawStream = (ctx: CanvasRenderingContext2D, stream: Stream) => {
		stream.chars.forEach((char, i) => {
			const lit = Math.random() * 100;
			if (lit < 30) {
				if (i === stream.chars.length - 1) {
					ctx.fillStyle = 'hsl(120, 30%, 100%)';
				} else {
					ctx.fillStyle = 'hsl(120, 100%, 90%)';
				}
			}
			drawChar(ctx, char, i === stream.chars.length - 1);
		});
	};

	// 绘制所有文本流
	const draw = (ctx: CanvasRenderingContext2D) => {
		// 绘制半透明背景以创建拖尾效果
		ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		// 绘制所有文本流
		streamsRef.current.forEach(stream => drawStream(ctx, stream));
	};

	// 动画循环
	const animate = (ctx: CanvasRenderingContext2D) => {
		draw(ctx);
		animationFrameIdRef.current = requestAnimationFrame(() => animate(ctx));
	};

	// 初始化画布
	const initCanvas = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// 设置画布大小
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// 初始化设置
		ctx.font = `${charSize}px monospace`;
		ctx.textBaseline = 'top';

		// 重置文本流
		reset(canvas.width);

		// 开始动画
		animate(ctx);
	};

	// 处理窗口大小变化
	const handleResize = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		reset(canvas.width);
	};

	useEffect(() => {
		initCanvas();

		const resizeHandler = () => handleResize();
		window.addEventListener('resize', resizeHandler);

		return () => {
			window.removeEventListener('resize', resizeHandler);
			cancelAnimationFrame(animationFrameIdRef.current);
		};
	}, []);

	return (
		<div className="text-stream-container">
			<canvas ref={canvasRef} className="text-stream-canvas" />
		</div>
	);
};

export default TextStream;
