import React from 'react';
import './index.scss';

interface Cube3DAlbumProps {
	images?: string[];
}

const Cube3DAlbum: React.FC<Cube3DAlbumProps> = ({
	images = [
		'https://picsum.photos/200/200?random=1',
		'https://picsum.photos/200/200?random=2',
		'https://picsum.photos/200/200?random=3',
		'https://picsum.photos/200/200?random=4',
		'https://picsum.photos/200/200?random=5',
		'https://picsum.photos/200/200?random=6'
	]
}) => {
	return (
		<div className="cube-3d-album">
			<div className="loader3d">
				<div className="cube">
					{images.map((image, index) => (
						<div className="face" key={index}>
							<img src={image} alt={`Face ${index + 1}`} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Cube3DAlbum;
