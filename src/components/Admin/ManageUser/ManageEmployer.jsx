import React, { useState } from 'react';
import { Button, DatePicker, Form, Input, Modal, Select, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined, StopOutlined } from '@ant-design/icons';
import TableListUser from './TableListUser';
import BoxContainer from '../../Generate/BoxContainer';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { updateUser } from '../../../services/apiService';

const { TabPane } = Tabs;
const { Option } = Select;

const ManageListEmployer = () => {
    const [activeStatus, setActiveStatus] = useState('active');
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [res, setRes] = useState(null);

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

    const handleEdit = async (record) => {
        form.setFieldsValue({
            lastName: record.lastName,
            firstName: record.firstName,
            email: record.email,
            phone: record.phone,
            address: record.address,
            dob: record.dob ? dayjs(record.dob, 'DD/MM/YYYY') : null,
            active: record.active,
        });
        setSelectedUser(record.userId);
        setIsModalVisible(true);
        // Handle edit logic
        console.log('Editing user:', record);
    }

    const handleDelete = async (userId) => {
        // Handle delete logic
        console.log('Deleting user:', userId);
    };
    const handleModalCancel = () => {
        form.resetFields();
        setIsModalVisible(false);
        setSelectedUser(null);
    };

    const handleModalOk = async (values) => {
        try {
            // định dạng dob thành string
            dayjs.extend(customParseFormat);
            values.dob = dayjs(values.dob, 'YYYY-MM-DD').format('DD/MM/YYYY');
            console.log('Form values:', values);
            updateUser(selectedUser, values).then((res) => {
                if (res.status === 'OK') {
                    setRes(res.data);
                    message.success(res.message);
                }
                else
                    message.error(res.message);
            });
            // message.success('Cập nhật thông tin người dùng thành công');
            handleModalCancel();
        } catch (error) {
            message.error('Vui lòng kiểm tra lại thông tin');
        }
    };

    return (
        <>
            <BoxContainer>
                <div className="title1">Quản lý doanh nghiệp</div>
            </BoxContainer>
            <BoxContainer>
                <TableListUser
                    fetch={res}
                    userType="employer"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </BoxContainer>
            <Modal
                title="Chỉnh sửa thông tin người dùng"
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="back" onClick={handleModalCancel}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={form.submit}
                    >
                        Lưu thay đổi
                    </Button>
                ]}
                width={720}
            >
                <Form
                    form={form}
                    onFinish={handleModalOk}
                    layout="vertical"
                >
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Form.Item
                            name="lastName"
                            label="Họ"
                            rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
                            style={{ flex: 1 }}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="firstName"
                            label="Tên"
                            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                            style={{ flex: 1 }}
                        >
                            <Input />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' }
                        ]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại' },
                            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="dob"
                        label="Ngày sinh"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                    >
                        <DatePicker format={'DD/MM/YYYY'} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="active"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select defaultValue={true}>
                            <Option value={true}>Hoạt động</Option>
                            <Option value={false}>Khóa</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ManageListEmployer;