import React, { useState } from 'react';
import { Tabs } from 'antd';
import { UserOutlined, LockOutlined, StopOutlined } from '@ant-design/icons';
import TableListUser from './TableListUser';
import BoxContainer from '../../Generate/BoxContainer';

const { TabPane } = Tabs;

const ManageListEmployer = () => {
    const [activeStatus, setActiveStatus] = useState('active');

    // Handle additional columns based on status
    const getAdditionalColumns = (status) => {
        const columns = [];
        
        if (status === 'pending') {
            columns.push({
                title: 'Ngày đăng ký',
                dataIndex: 'registrationDate',
                key: 'registrationDate',
            });
        }
        
        if (status === 'blocked') {
            columns.push({
                title: 'Lý do khóa',
                dataIndex: 'blockReason',
                key: 'blockReason',
            });
        }

        if (status === 'inactive') {
            columns.push({
                title: 'Lần đăng nhập cuối',
                dataIndex: 'lastLoginDate',
                key: 'lastLoginDate',
            });
        }

        return columns;
    };


    const handleStatusChange = (newStatus) => {
        setActiveStatus(newStatus);
    };

    const handleEdit = (record) => {
        // Handle edit logic
        console.log('Editing user:', record);
    };

    const handleDelete = async (userId) => {
        // Handle delete logic
        console.log('Deleting user:', userId);
    };

    return (
        <>
            <BoxContainer>
                <div className="title1">Quản lý doanh nghiệp</div>
            </BoxContainer>
            <BoxContainer>
                <TableListUser
                    userType="employer"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </BoxContainer>
        </>
    );
};

export default ManageListEmployer;