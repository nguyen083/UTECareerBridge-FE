import { Flex } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import { useTranslation } from "react-i18next";
const NotificationList = () => {
    const { t } = useTranslation();
    return (
        <>
            <BoxContainer width='100%' className="shadow-md">
                <div className='title1'>{t('admin.notification.list')}</div>
            </BoxContainer>
            <BoxContainer width='100%' className="shadow-md">
                <Flex vertical gap={20}>
                    
                </Flex>
            </BoxContainer>
        </>
    )
}

export default NotificationList;
