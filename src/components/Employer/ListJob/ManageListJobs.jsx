import React, { useState } from 'react';
import { Tabs } from 'antd';
import TableListJobs from './TableListJobs';
import BoxContainer from '../../Generate/BoxContainer';

const { TabPane } = Tabs;

const ManageListJobs = () => {
    const [activeKey, setActiveKey] = useState('ACTIVE');

    const handleTabChange = (key) => {
        setActiveKey(key);
    };

    return (
        <>
            <BoxContainer>
                <div className="title1">Danh sách bài đăng</div>
            </BoxContainer>
            <BoxContainer>
                <Tabs size='large' activeKey={activeKey} onChange={handleTabChange}>
                    <TabPane
                        tab="Đang hiển thị"
                        key="ACTIVE"
                    />
                    <TabPane
                        tab="Đang ẩn"
                        key="INACTIVE"
                    />
                    <TabPane
                        tab="Chờ duyệt"
                        key="PENDING"
                    />
                    <TabPane
                        tab="Bị từ chối"
                        key="REJECTED"
                    />
                </Tabs>
                <TableListJobs status={activeKey} />
            </BoxContainer>
        </>
    );
};

export default ManageListJobs;
