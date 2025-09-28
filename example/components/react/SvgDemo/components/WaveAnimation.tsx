import * as React from 'react';
import './WaveAnimation.scss';

const WaveAnimation: React.FC = () => {
	const [waveCount, setWaveCount] = React.useState<number>(3);
	const [colors, setColors] = React.useState<string[]>(['#af40ff', '#5b42f3', '#00ddeb']);
	const [animationSpeed, setAnimationSpeed] = React.useState<number[]>([55, 50, 45]);
	const [borderRadius, setBorderRadius] = React.useState<number>(40);
	const [opacity, setOpacity] = React.useState<number>(60);
	const [cardWidth, setCardWidth] = React.useState<number>(200);
	const [cardHeight, setCardHeight] = React.useState<number>(200);

	// 更新颜色
	const updateColor = (index: number, value: string) => {
		const newColors = [...colors];
		newColors[index] = value;
		setColors(newColors);
	};

	// 更新动画速度
	const updateAnimationSpeed = (index: number, value: number) => {
		const newSpeeds = [...animationSpeed];
		newSpeeds[index] = value;
		setAnimationSpeed(newSpeeds);
	};

	// 生成波浪元素
	const renderWaves = () => {
		return Array.from({ length: waveCount }).map((_, index) =>
			React.createElement('div', {
				key: index,
				className: 'wave',
				style: {
					background: `linear-gradient(744deg, ${colors[0] || '#af40ff'}, ${
						colors[1] || '#5b42f3'
					} 60%, ${colors[2] || '#00ddeb'})`,
					borderRadius: `${borderRadius}%`,
					opacity: opacity / 100,
					width: `${cardWidth * 2.7}px`,
					height: `${cardHeight * 3.5}px`,
					marginLeft: '-50%',
					marginTop: '-70%',
					animationDuration: `${animationSpeed[index] || 55}s`
				}
			})
		);
	};

	return React.createElement(
		'div',
		{ className: 'wave-animation-container' },
		React.createElement('h3', null, '水波动画效果'),
		React.createElement(
			'div',
			{ className: 'demo-content' },
			React.createElement(
				'div',
				{
					className: 'e-card playing',
					style: {
						width: `${cardWidth}px`,
						height: `${cardHeight}px`
					}
				},
				[
					...renderWaves(),
					React.createElement(
						'div',
						{ key: 'info', className: 'info' },
						React.createElement('div', { className: 'text' }, '水波动画')
					)
				]
			)
		),
		React.createElement('div', { className: 'controls' }, [
			// 波浪数量控制
			React.createElement('div', { key: 'wave-count', className: 'control-group' }, [
				React.createElement('label', { key: 'label' }, `波浪数量: ${waveCount}`),
				React.createElement('input', {
					key: 'input',
					type: 'range',
					id: 'waveCount',
					min: '1',
					max: '5',
					value: waveCount.toString(),
					onChange: e => setWaveCount(parseInt((e.target as HTMLInputElement).value))
				})
			]),

			// 颜色和速度控制
			...Array.from({ length: 3 })
				.map((_, index) => [
					React.createElement(
						'div',
						{
							key: `color-group-${index}`,
							className: 'control-group'
						},
						[
							React.createElement('label', { key: 'label' }, `颜色 ${index + 1}:`),
							React.createElement(
								'div',
								{
									key: 'color-inputs',
									style: { display: 'flex', gap: '10px' }
								},
								[
									React.createElement('input', {
										key: 'color-picker',
										type: 'color',
										value: colors[index] || '#af40ff',
										onChange: e => updateColor(index, (e.target as HTMLInputElement).value)
									}),
									React.createElement('input', {
										key: 'color-text',
										type: 'text',
										value: colors[index] || '#af40ff',
										onChange: e => updateColor(index, (e.target as HTMLInputElement).value),
										className: 'color-input'
									})
								]
							)
						]
					),

					React.createElement(
						'div',
						{
							key: `speed-group-${index}`,
							className: 'control-group'
						},
						[
							React.createElement(
								'label',
								{ key: 'label' },
								`波浪 ${index + 1} 速度: ${animationSpeed[index] || 55}s`
							),
							React.createElement('input', {
								key: 'input',
								type: 'range',
								id: `speed${index}`,
								min: '5',
								max: '100',
								value: (animationSpeed[index] || 55).toString(),
								onChange: e =>
									updateAnimationSpeed(index, parseInt((e.target as HTMLInputElement).value))
							})
						]
					)
				])
				.flat(),

			// 其他控制
			React.createElement('div', { key: 'border-radius', className: 'control-group' }, [
				React.createElement('label', { key: 'label' }, `弧度: ${borderRadius}%`),
				React.createElement('input', {
					key: 'input',
					type: 'range',
					id: 'borderRadius',
					min: '0',
					max: '50',
					value: borderRadius.toString(),
					onChange: e => setBorderRadius(parseInt((e.target as HTMLInputElement).value))
				})
			]),

			React.createElement('div', { key: 'opacity', className: 'control-group' }, [
				React.createElement('label', { key: 'label' }, `透明度: ${opacity}%`),
				React.createElement('input', {
					key: 'input',
					type: 'range',
					id: 'opacity',
					min: '0',
					max: '100',
					value: opacity.toString(),
					onChange: e => setOpacity(parseInt((e.target as HTMLInputElement).value))
				})
			]),

			React.createElement('div', { key: 'card-width', className: 'control-group' }, [
				React.createElement('label', { key: 'label' }, `卡片宽度: ${cardWidth}px`),
				React.createElement('input', {
					key: 'input',
					type: 'range',
					id: 'cardWidth',
					min: '100',
					max: '400',
					value: cardWidth.toString(),
					onChange: e => setCardWidth(parseInt((e.target as HTMLInputElement).value))
				})
			]),

			React.createElement('div', { key: 'card-height', className: 'control-group' }, [
				React.createElement('label', { key: 'label' }, `卡片高度: ${cardHeight}px`),
				React.createElement('input', {
					key: 'input',
					type: 'range',
					id: 'cardHeight',
					min: '100',
					max: '400',
					value: cardHeight.toString(),
					onChange: e => setCardHeight(parseInt((e.target as HTMLInputElement).value))
				})
			])
		])
	);
};

export default WaveAnimation;
