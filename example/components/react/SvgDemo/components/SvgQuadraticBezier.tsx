 const SvgQuadraticBezier = () => {
    //  二次贝塞尔曲线
    return (
        <div className="svg-warp">
            <svg width="250" height="250" xmlns="http://www.w3.org/2000/svg">
                <path d="M20,160 Q180,20 80,80" stroke="red" strokeWidth="5" fill="transparent" />
                <svg width="190px" height="160px" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 80 Q 95 10 180 80" stroke="black" fill="transparent" />
                    <circle cx="10" cy="80" r="2" fill="red" />
                    <circle cx="95" cy="10" r="2" fill="red" />
                    <circle cx="180" cy="80" r="2" fill="red" />
                    <line x1="10" y1="80" x2="95" y2="10" stroke="rgb(255,0,0)" strokeWidth="1" />
                    <line x1="95" y1="10" x2="180" y2="80" stroke="rgb(255,0,0)" strokeWidth="1" />
                </svg>
            </svg>
        </div>
    );
};
export default SvgQuadraticBezier;