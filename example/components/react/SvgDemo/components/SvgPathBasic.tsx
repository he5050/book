 const SvgPathBasic = () => {
    return (
        <div className="svg-warp">
            <svg width="250" height="250" xmlns="http://www.w3.org/2000/svg">
                <path stroke="green" fill="transparent" strokeWidth="1" d="M10,10 H 90 V 90 H 10 L10,9" />
                <path stroke="red" fill="transparent" strokeWidth="1" d="M100,100 H 190 V 190 H 100 Z" />
            </svg>
        </div>
    );
};

export default SvgPathBasic