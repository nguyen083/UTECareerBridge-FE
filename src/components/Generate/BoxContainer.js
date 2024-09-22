import { theme } from 'antd';
import './BoxContainer.scss';
const BoxContainer = ({ children }) => {

    const { token: { colorBgContainer } } = theme.useToken();
    return (
        <div className='box-container'>
            {children}
        </div>
    );
}
export default BoxContainer;