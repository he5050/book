 const SvgLinePolyline = () => {
    // 线条与折线
    return (
        <div className="svg-warp">
            <svg width="250" height="250" xmlns="http://www.w3.org/2000/svg">
                <title>直线与折线 </title>
                <desc>我是直线与折线</desc>
                {/* 直线 */}
                <line x1="26" x2="90" y1="10" y2="45" stroke="black" fill="transparent" strokeWidth="5" />
                {/* 折线 */}
                <polyline
                    points="10,25 20,25 30,55 50,45 60, 65 70,75 80,65 90,80"
                    stroke="black"
                    fill="transparent"
                    strokeWidth="5"
                />
            </svg>
        </div>
    );
};

export default SvgLinePolyline