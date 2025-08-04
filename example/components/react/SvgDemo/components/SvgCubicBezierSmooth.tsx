 const SvgCubicBezierSmooth = () => {
    //  平滑三次贝塞尔曲线
    return (
        <div className="svg-warp">
            <svg width="250" height="250" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80"
                    stroke="red"
                    strokeWidth="5"
                    fill="transparent"
                />
            </svg>
        </div>
    );
};
export default SvgCubicBezierSmooth