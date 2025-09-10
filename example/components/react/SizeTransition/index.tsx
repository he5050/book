import React, {
	useState,
	useEffect,
	useRef,
	ReactNode,
	useImperativeHandle,
	forwardRef
} from 'react';
import './size-transition.scss';

interface SizeTransitionProps {
	children: ReactNode;
	minHeight?: number;
	initState?: boolean;
}

export interface SizeTransitionHandles {
	expand: () => void;
	contract: () => void;
	toggle: () => void;
}

const SizeTransition = forwardRef<SizeTransitionHandles, SizeTransitionProps>(
	({ children, minHeight = 0, initState = true }, ref) => {
		const id = `size-transition-${Math.random().toString(36).substr(2, 9)}`;
		const contentRef = useRef<HTMLDivElement>(null);
		const [state, setState] = useState<boolean>(initState);
		const [height, setHeight] = useState<string | undefined>(undefined);
		const observerRef = useRef<ResizeObserver | null>(null);

		// 初始化尺寸观察
		const initResizeObserver = (): void => {
			if (!contentRef.current) return;

			observerRef.current = new ResizeObserver(entries => {
				for (const entry of entries) {
					const newHeight = entry.contentRect.height;
					// 当处于展开状态时同步高度
					if (state) {
						setHeight(`${newHeight + 3}px`);
					}
				}
			});

			observerRef.current.observe(contentRef.current);
		};

		// 折叠方法
		const contract = (): void => {
			if (!contentRef.current) return;
			setHeight(`${contentRef.current.offsetHeight}px`);
			requestAnimationFrame(() => {
				setHeight(`${minHeight}px`);
				setState(false);
			});
		};

		// 展开方法
		const expand = (): void => {
			if (!contentRef.current) return;
			setHeight('0px');
			requestAnimationFrame(() => {
				setHeight(`${contentRef.current!.offsetHeight + 3}px`);
				setState(true);
			});
		};

		// 切换方法
		const toggle = (): void => {
			state ? contract() : expand();
		};

		// 通过 ref 暴露方法
		useImperativeHandle(ref, () => ({
			expand,
			contract,
			toggle
		}));

		// 生命周期
		useEffect(() => {
			initState ? expand() : contract();
			initResizeObserver();

			return () => {
				observerRef.current?.disconnect();
			};
		}, []);

		return (
			<div className="size-transition" style={{ height }}>
				<div id={id} ref={contentRef}>
					{children}
				</div>
			</div>
		);
	}
);

export default SizeTransition;
