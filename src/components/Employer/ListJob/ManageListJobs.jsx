import { useState } from 'react';
import { Tabs } from 'antd';
import TableListJobs from './TableListJobs';
import BoxContainer from '../../Generate/BoxContainer';
import { useTranslation } from 'react-i18next';

const { TabPane } = Tabs;

const ManageListJobs = () => {
    const { t } = useTranslation();
    const [activeKey, setActiveKey] = useState('ACTIVE');

    const handleTabChange = (key) => {
        setActiveKey(key);
    };

    return (
        <>
            <BoxContainer className='shadow-md'>
                <div className="title1">{t('employer.manageJobs.listJobs')}</div>
            </BoxContainer>
            <BoxContainer className='shadow-md'>
                <Tabs size='large' activeKey={activeKey} onChange={handleTabChange}>
                    <TabPane
                        tab={t('employer.manageJobs.tabs.active')}
                        key="ACTIVE"
                    />
                    <TabPane
                        tab={t('employer.manageJobs.tabs.inactive')}
                        key="INACTIVE"
                    />
                    <TabPane
                        tab={t('employer.manageJobs.tabs.pending')}
                        key="PENDING"
                    />
                    <TabPane
                        tab={t('employer.manageJobs.tabs.rejected')}
                        key="REJECTED"
                    />
                </Tabs>
                <TableListJobs status={activeKey} />
            </BoxContainer>
        </>
    );
};

export default ManageListJobs;
