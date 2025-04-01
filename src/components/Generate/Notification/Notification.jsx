import { Flex, Tabs } from "antd";
import BoxContainer from "../BoxContainer";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import ListNotification from "./ListNotification";
const Notification = () => {
    const {t} = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();   
    const activeTab = location.hash.replace('#', '') || 'system';

   
    const handleTabChange = (key) => {
        navigate(`#${key}`);
    };
    return (
        <Flex vertical gap={8}>
            <BoxContainer className="shadow">
                <div className="title1">{t('notification.title')}</div>
            </BoxContainer>
            <BoxContainer className="shadow">
                <Tabs defaultActiveKey="1" size="large" onChange={handleTabChange} activeKey={activeTab}>
                    <Tabs.TabPane tab={t('notification.system')} key="system">
                        <ListNotification type="system" />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={t('notification.personal')} key="personal">
                        <ListNotification type="personal" />
                    </Tabs.TabPane>
                </Tabs>
            </BoxContainer>

        </Flex>
    )
}

export default Notification;
