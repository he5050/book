 const SvgQuadraticBezierSmooth = () => {
    //  平滑二次贝塞尔曲线
    return (
        <div className="svg-warp">
            <svg width="250" height="250" xmlns="http://www.w3.org/2000/svg">
                <path d="M10,80 Q52.5,10 95,80 T180,80" stroke="red" strokeWidth="5" fill="transparent" />
            </svg>
        </div>
    );
};
export default SvgQuadraticBezierSmooth;