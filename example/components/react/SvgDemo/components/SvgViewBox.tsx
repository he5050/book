export const SvgViewBox = () => {
    return (
        <div className="svg-warp t">
            <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <circle id="mycircle" cx="100" cy="100" r="100" />
            </svg>
        </div>
    );
};

export default SvgViewBox; 