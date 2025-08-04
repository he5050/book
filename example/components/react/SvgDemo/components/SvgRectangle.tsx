 const SvgRectangle = () => {
    // 矩形
    return (
        <div className="svg-warp">
            <svg width="200" height="250" xmlns="http://www.w3.org/2000/svg">
                <title>矩形</title>
                <desc>我是矩形</desc>
                <rect x="10" y="10" width="80" height="80" stroke="black" fill="transparent" strokeWidth="5" />
                <rect
                    x="100"
                    y="90"
                    rx="10"
                    ry="10"
                    width="50"
                    height="50"
                    stroke="black"
                    fill="transparent"
                    strokeWidth="5"
                />
            </svg>
        </div>
    );
};

export default SvgRectangle;