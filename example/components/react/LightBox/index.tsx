// src/App.tsx
import React, { useState } from 'react';
import Gallery from './Gallery';
import Lightbox from './LightBox';

const initialPhotos = Array.from(
	{ length: 12 },
	(_, i) => `https://picsum.photos/id/${i + 10}/300/${150 + (i % 5) * 40}`
);

const LightBox: React.FC = () => {
	const [photos] = useState(initialPhotos);
	const [lightbox, setLightbox] = useState({ open: false, idx: 0 });

	return (
		<div className="w-[500px] h-[600px] overflow-auto">
			<Gallery photos={photos} onImageClick={i => setLightbox({ open: true, idx: i })} />
			<Lightbox
				photos={photos}
				state={lightbox}
				onClose={() => setLightbox({ ...lightbox, open: false })}
				onNavigate={newIdx => setLightbox({ ...lightbox, idx: newIdx })}
			/>
		</div>
	);
};

export default LightBox;
