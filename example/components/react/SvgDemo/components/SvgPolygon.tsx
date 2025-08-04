 const SvgPolygon = () => {
    // 多边形
    return (
        <div className="svg-warp">
            <svg width="250" height="250" viewBox="-10 -10 220 120" xmlns="http://www.w3.org/2000/svg">
                <title>多边形 </title>
                <desc>我是多边形</desc>
                <polygon fillRule="nonzero" stroke="#ccc" fill="#cccccc" points="50,0 21,90 98,35 2,35 79,90" />
                <polygon fillRule="evenodd" stroke="#ccc" fill="#cccccc" points="150,0 121,90 198,35 102,35 179,90" />
            </svg>
        </div>
    );
};
export default SvgPolygon