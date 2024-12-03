import { Outlet } from 'react-router-dom';
import BoxContainer from '../../Generate/BoxContainer';
// import { styles } from './Applicant.module.scss'
const Applicant = () => {
    return (
        <>
            <BoxContainer>
                <div className='title1'>Danh sách ứng viên</div>
            </BoxContainer>
            <BoxContainer>
                <Outlet />
            </BoxContainer>
        </>
    )
}
export default Applicant;