import { Tabs } from "antd";
import BoxContainer from "../../../Generate/BoxContainer";
import { useState } from "react";
import TablePost from "./TablePost";
import { useTranslation } from 'react-i18next';

const PostApproval = () => {
    const { TabPane } = Tabs;
    const [activeKey, setActiveKey] = useState('PENDING');
    const { t } = useTranslation();

    const handleTabChange = (key) => {
        setActiveKey(key);
    };
    return (
        <>
            <BoxContainer className="shadow-md">
                <div className="title1">{t('admin.postApproval.title')}</div>
            </BoxContainer>
            <BoxContainer className="shadow-md">
                <Tabs size='large' activeKey={activeKey} onChange={handleTabChange}>
                    <TabPane
                        tab={t('admin.postApproval.tabs.pending')}
                        key="PENDING"
                    />
                    <TabPane
                        tab={t('admin.postApproval.tabs.approved')}
                        key="ACTIVE"
                    />
                    <TabPane
                        tab={t('admin.postApproval.tabs.rejected')}
                        key="REJECTED"
                    />
                </Tabs>
                <TablePost status={activeKey} />
            </BoxContainer>
        </>
    )
}

export default PostApproval;    