// 定义接口和类型
interface MousePosition {
	x: number;
	y: number;
}

interface DotsConfig {
	nb: number;
	distance: number;
	d_radius: number;
	array: Dot[];
}

interface CanvasConfig {
	zIndex: number;
	opacity: number;
	color: number;
	id: string;
}

class Color {
	r: number;
	g: number;
	b: number;
	style: string;

	constructor(min: number = 0) {
		this.r = this.colorValue(min);
		this.g = this.colorValue(min);
		this.b = this.colorValue(min);
		this.style = this.createColorStyle(this.r, this.g, this.b);
	}

	colorValue(min: number = 0): number {
		return Math.floor(Math.random() * 255 + min);
	}

	createColorStyle(r: number, g: number, b: number): string {
		return `rgba(${r},${g},${b}, 0.8)`;
	}
}

class Dot {
	x: number;
	y: number;
	vx: number;
	vy: number;
	radius: number;
	color: Color;

	constructor(canvasWidth: number, canvasHeight: number) {
		this.x = Math.random() * canvasWidth;
		this.y = Math.random() * canvasHeight;
		this.vx = -0.5 + Math.random();
		this.vy = -0.5 + Math.random();
		this.radius = Math.random() * 3;
		this.color = new Color();
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.fillStyle = this.color.style;
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fill();
	}
}


// 主初始化函数
export function setupInitBG(): void {
	initClickEffect();
	initBackgroundEffect();
}

// 点击效果初始化
function initClickEffect(): void {
	// 定义获取词语下标
	let a_idx = 0;

	// 点击body时触发事件
	document.body.addEventListener('click', e => {
		// 需要显示的词语
		const words = [
			'富强',
			'民主',
			'文明',
			'和谐',
			'自由',
			'平等',
			'公正',
			'法治',
			'爱国',
			'敬业',
			'诚信',
			'友善'
		];

		// 创建span元素
		const span = document.createElement('span');
		span.textContent = words[a_idx];

		// 下标等于原来下标+1 余 词语总数
		a_idx = (a_idx + 1) % words.length;

		// 获取鼠标指针的位置
		const x = e.pageX;
		const y = e.pageY;

		// 设置样式
		Object.assign(span.style, {
			zIndex: '999999',
			top: `${y - 20}px`,
			left: `${x}px`,
			position: 'absolute',
			fontWeight: 'bold',
			color: randomRGBColor()
		});

		// 添加到body
		document.body.appendChild(span);

		// 创建动画效果
		const animation = span.animate(
			[
				{ top: `${y - 20}px`, opacity: 1 },
				{ top: `${y - 180}px`, opacity: 0 }
			],
			{
				duration: 1500,
				easing: 'ease-out'
			}
		);

		// 动画结束后移除元素
		animation.onfinish = () => {
			span.remove();
		};
	});
}

// 生成随机RGB颜色
function randomRGBColor(): string {
	return `rgb(${~~(255 * Math.random())},${~~(255 * Math.random())},${~~(255 * Math.random())})`;
}

// 背景效果初始化
function initBackgroundEffect(): void {
	const config: CanvasConfig = {
		zindex: -1,
		opacity: 0.5,
		color: 0,
		id: 'canvas_id'
	};

	// 移除可能存在的旧canvas
	const existingCanvas = document.getElementById(config.id);
	if (existingCanvas) {
		existingCanvas.remove();
	}

	// 创建canvas元素
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	if (!ctx) {
		console.error('Canvas context not supported');
		return;
	}

	// 设置canvas尺寸
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// 设置canvas样式
	ctx.lineWidth = 0.3;
	ctx.strokeStyle = new Color(config.color).style;
	canvas.id = config.id;
	canvas.style.cssText = `position:fixed;top:0;left:0;z-index:${config.zindex};opacity:${config.opacity}`;

	// 添加到body
	document.body.appendChild(canvas);

	// 鼠标位置
	const mousePosition: MousePosition = {
		x: (30 * canvas.width) / 100,
		y: (30 * canvas.height) / 100
	};

	// 点配置
	const dots: DotsConfig = {
		nb: 200, // 数量
		distance: 50,
		d_radius: 100,
		array: []
	};

	// 混合颜色组件
	function mixComponents(comp1: number, weight1: number, comp2: number, weight2: number): number {
		return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
	}

	// 平均颜色样式
	function averageColorStyles(dot1: Dot, dot2: Dot): string {
		const color1 = dot1.color;
		const color2 = dot2.color;

		const r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius);
		const g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius);
		const b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);

		return `rgba(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)}, 0.8)`;
	}

	// 创建点
	function createDots(): void {
		for (let i = 0; i < dots.nb; i++) {
			dots.array.push(new Dot(canvas.width, canvas.height));
		}
	}

	// 移动点
	function moveDots(): void {
		for (let i = 0; i < dots.nb; i++) {
			const dot = dots.array[i];

			if (dot.y < 0 || dot.y > canvas.height) {
				dot.vx = dot.vx;
				dot.vy = -dot.vy;
			} else if (dot.x < 0 || dot.x > canvas.width) {
				dot.vx = -dot.vx;
				dot.vy = dot.vy;
			}

			dot.x += dot.vx;
			dot.y += dot.vy;
		}
	}

	// 连接点
	function connectDots(): void {
		for (let i = 0; i < dots.nb; i++) {
			for (let j = 0; j < dots.nb; j++) {
				const i_dot = dots.array[i];
				const j_dot = dots.array[j];

				if (
					i_dot.x - j_dot.x < dots.distance &&
					i_dot.y - j_dot.y < dots.distance &&
					i_dot.x - j_dot.x > -dots.distance &&
					i_dot.y - j_dot.y > -dots.distance
				) {
					if (
						i_dot.x - mousePosition.x < dots.d_radius &&
						i_dot.y - mousePosition.y < dots.d_radius &&
						i_dot.x - mousePosition.x > -dots.d_radius &&
						i_dot.y - mousePosition.y > -dots.d_radius
					) {
						ctx.beginPath();
						ctx.strokeStyle = averageColorStyles(i_dot, j_dot);
						ctx.moveTo(i_dot.x, i_dot.y);
						ctx.lineTo(j_dot.x, j_dot.y);
						ctx.stroke();
						ctx.closePath();
					}
				}
			}
		}
	}

	// 绘制点
	function drawDots(): void {
		for (let i = 0; i < dots.nb; i++) {
			const dot = dots.array[i];
			dot.draw(ctx);
		}
	}

	// 动画循环
	function animateDots(): void {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		moveDots();
		connectDots();
		drawDots();

		requestAnimationFrame(animateDots);
	}

	// 鼠标移动事件
	window.onmousemove = (e: MouseEvent) => {
		mousePosition.x = e.clientX;
		mousePosition.y = e.clientY;
	};

	// 鼠标离开事件
	window.onmouseout = () => {
		mousePosition.x = canvas.width / 2;
		mousePosition.y = canvas.height / 2;
	};

	// 初始化
	createDots();
	requestAnimationFrame(animateDots);
}
