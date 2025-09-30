import * as React from 'react';
import './index.scss';

interface MaskEffectProps {
	width?: number;
	height?: number;
	backgroundImage?: string;
	maskImage?: string;
	maskMode?: 'alpha' | 'luminance' | 'match-source';
	maskSize?: string;
	maskPosition?: string;
	maskRepeat?: string;
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

const MaskEffect: React.FC<MaskEffectProps> = ({
	width = 500,
	height = 300,
	backgroundImage,
	maskImage,
	maskMode = 'alpha',
	maskSize = '100%',
	maskPosition = 'center',
	maskRepeat = 'no-repeat',
	children,
	className = '',
	style = {}
}) => {
	return (
		<div
			className={`mask-effect ${className}`}
			style={{
				width,
				height,
				backgroundImage: backgroundImage
					? `url(${backgroundImage})`
					: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				maskImage:
					maskImage &&
					!maskImage.startsWith('linear-gradient') &&
					!maskImage.startsWith('radial-gradient')
						? `url(${maskImage})`
						: maskImage || 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)',
				maskMode,
				maskSize,
				maskPosition,
				maskRepeat,
				...style
			}}
		>
			{children}
		</div>
	);
};

export default MaskEffect;
