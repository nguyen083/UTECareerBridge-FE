import  { useEffect } from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { stop } from '../../redux/action/webSlice';
import { useTranslation } from 'react-i18next';
const Page500 = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(stop());
    }, []);
    return (
        <Result
            status="500"
            title="500"
            subTitle={t('errors.500')}
            extra={<Button type="primary" onClick={() => navigate('/home')}>{t('errors.backToHome')}</Button>}
        />
    );
}
export default Page500;