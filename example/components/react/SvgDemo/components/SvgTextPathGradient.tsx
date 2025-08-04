 const SvgTextPathGradient = () => {
    //  渐变路径文本
    return (
        <div className="svg-warp t">
            <svg width="250" height="250" xmlns="http://www.w3.org/2000/svg">
                <path
                    id="MyPath"
                    fill="none"
                    stroke="transparent"
                    d="m102.5,180.45313c-20,-73.88398 141.39227,-9 164,-74c22.60773,-65 189,-75.88398 164,74c-25,149.88398 -122.39227,-14 -164,74c-41.60773,88 -144,-0.11603 -164,-74z"
                />
                <linearGradient id="mylg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="red"></stop>
                    <stop offset="15%" stopColor="orange"></stop>
                    <stop offset="30%" stopColor="yellow"></stop>
                    <stop offset="45%" stopColor="green"></stop>
                    <stop offset="60%" stopColor="cyan"></stop>
                    <stop offset="80%" stopColor="blue"></stop>
                    <stop offset="100%" stopColor="purple"></stop>
                </linearGradient>
                <text fill="url(#mylg)">
                    <textPath href="#MyPath">a b c d e f g j h i j f k l m n o p q r s t u v w x y z</textPath>
                </text>
            </svg>
        </div>
    );
};

export default SvgTextPathGradient