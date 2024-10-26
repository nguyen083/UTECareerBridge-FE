import './BoxContainer.scss';
const BoxContainer = ({ padding = "1.875rem 1.5rem", background = "#ffffff", borderRadius = "0.625rem", children }) => {

    return (
        <div className='box-container' style={{ padding, background, borderRadius }}>
            {children}
        </div>
    );
}
export default BoxContainer;