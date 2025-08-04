 const SvgTextPath = () => {
    //  路径文本
    return (
        <div className="svg-warp">
            <svg width="250" height="250" xmlns="http://www.w3.org/2000/svg">
                <path
                    id="MyPath"
                    fill="none"
                    stroke="transparent"
                    d="M10,90 Q90,90 90,45 Q90,10 50,10 Q10,10 10,40 Q10,70 45,70 Q70,70 75,50"
                />
                <text>
                    <textPath href="#MyPath">a b c d e f g j h i j f k l m n o p q r s t u v w x y z</textPath>
                </text>
            </svg>
        </div>
    );
};

export default SvgTextPath;