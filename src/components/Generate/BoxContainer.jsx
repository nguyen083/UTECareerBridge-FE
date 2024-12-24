import './BoxContainer.scss';
const BoxContainer = ({ className = "", padding = "1.875rem 1.5rem", background = "#ffffff", borderRadius = "0.625rem", children, hidden = false, width, style = null }) => {

    return (
        <div className={`box-container ${className}`} style={{ padding, background, borderRadius, width, style }} hidden={hidden}>
            {children}
        </div>
    );
}
export default BoxContainer;