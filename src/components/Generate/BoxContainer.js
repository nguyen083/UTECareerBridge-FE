import './BoxContainer.scss';
const BoxContainer = ({ padding = "1.875rem 1.5rem", background = "#ffffff", borderRadius = "0.625rem", children, hidden = false, width }) => {

    return (
        <div className='box-container' style={{ padding, background, borderRadius, width }} hidden={hidden}>
            {children}
        </div>
    );
}
export default BoxContainer;