const SvgCircleEllipse = () => {
    // 圆形与椭圆
    return (
        <div className="svg-warp">
            <svg width="250" height="250" xmlns="http://www.w3.org/2000/svg">
                <title>圆形与椭圆 </title>
                <desc>我是圆形与椭圆</desc>
                <circle cx="50" cy="50" r="40" stroke="black" fill="transparent" strokeWidth="5" />
                <ellipse cx="150" cy="80" rx="60" ry="30" stroke="black" fill="transparent" strokeWidth="5" />
            </svg>
        </div>
    );
};
export default SvgCircleEllipse