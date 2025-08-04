 const SvgTextSpan = () => {
    // 文本片段
    return (
        <div className="svg-warp t">
            <svg width="250" height="250" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="30" className="small">
                    这里的 <tspan>文字</tspan> 是不一样的。
                </text>
            </svg>
        </div>
    );
};
export default SvgTextSpan;