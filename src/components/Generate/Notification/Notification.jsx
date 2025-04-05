import { Flex, Tabs } from "antd";
import BoxContainer from "../BoxContainer";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import ListNotification from "./ListNotification";
import { useState, useEffect } from "react";

const Notification = () => {
    const {t} = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();   
    const activeTab = location.hash.replace('#', '') || 'system';
    const [currentTab, setCurrentTab] = useState(activeTab);

    useEffect(() => {
        setCurrentTab(activeTab);
    }, [activeTab]);

    const handleTabChange = (key) => {
        navigate(`#${key}`);
        setCurrentTab(key);
    };
    
    const renderTabContent = () => {
        return <ListNotification type={currentTab} key={currentTab} />;
    };
    
    const items = [
        {
            key: 'system',
            label: t('notification.system'),
            children: currentTab === 'system' ? renderTabContent() : null
        },
        {
            key: 'personal',
            label: t('notification.personal'),
            children: currentTab === 'personal' ? renderTabContent() : null
        }
    ];
    
    return (
        <Flex vertical gap={8}>
            <BoxContainer className="shadow">
                <div className="title1">{t('notification.title')}</div>
            </BoxContainer>
            <BoxContainer className="shadow">
                <Tabs 
                    defaultActiveKey="system" 
                    size="large" 
                    onChange={handleTabChange} 
                    activeKey={currentTab}
                    items={items}
                    destroyInactiveTabPane={true}
                />
            </BoxContainer>
        </Flex>
    )
}

export default Notification;
