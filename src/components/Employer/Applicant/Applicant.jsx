import { Outlet } from 'react-router-dom';
import BoxContainer from '../../Generate/BoxContainer';
import { useTranslation } from 'react-i18next';
// import { styles } from './Applicant.module.scss'
const Applicant = () => {
    const {t} = useTranslation();
    return (
        <>
            <BoxContainer className='shadow-md'>
                <div className='title1'>{t('list_applicant')}</div>
            </BoxContainer>
            <BoxContainer className='shadow-md'>
                <Outlet />
            </BoxContainer>
        </>
    )
}
export default Applicant;