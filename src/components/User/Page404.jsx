import { Button, Result } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { stop } from "../../redux/action/webSlice";
import { useTranslation } from "react-i18next";
const Page404 = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(stop());
    }, []);
    return (
        <Result
            status="404"
            title="404"
            subTitle={t('errors.404')}
            extra={<Button onClick={() => navigate('/home')} size="large" type="primary">{t('errors.backToHome')}</Button>}
        />
    );
}
export default Page404;