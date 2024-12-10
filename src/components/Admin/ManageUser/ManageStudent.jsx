import React, { useState } from 'react';
import { Tabs, Modal, Form, Input, DatePicker, Select, Space, Button, message } from 'antd';
import { UserOutlined, LockOutlined, StopOutlined } from '@ant-design/icons';
import TableListUser from './TableListUser';
import BoxContainer from '../../Generate/BoxContainer';
import { getUserByUserId, updateUser } from '../../../services/apiService';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
const { TabPane } = Tabs;
const { Option } = Select;
const ManageListUser = () => {
    const [activeStatus, setActiveStatus] = useState('active');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [res, setRes] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [form] = Form.useForm();
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
        try {
            console.log('Record:', record);
            setLoading(true);
            const response = await getUserByUserId(record.key);
            console.log('User details:', response.data);
            if (response.data) {
                setSelectedUser(response.data);
                form.setFieldsValue({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    phone: response.data.phone,
                    address: response.data.address,
                    dob: dayjs(response.data.dob, 'dd/MM/yyyy'),
                    active: response.data.active
                });
                setIsModalVisible(true);
            }
        } catch (error) {
            message.error('Không thể tải thông tin người dùng');
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa người dùng này không?',
            okText: 'Xóa',
            okType: 'danger',
            centered: true,
            cancelText: 'Hủy',
            onOk: async () => {
                // try {
                //     setLoading(true);
                //     await deleteUserById(userId);
                //     message.success('Xóa người dùng thành công');
                //     // Reload the user list or update the state as needed here
                // } catch (error) {
                //     message.error('Không thể xóa người dùng');
                //     console.error('Error deleting user:', error);
                // } finally {
                //     setLoading(false);
                // }
            },
            onCancel() {
                console.log('Cancel delete');
            }
        });
    };

    const handleModalCancel = () => {
        form.resetFields();
        setIsModalVisible(false);
        setSelectedUser(null);
    };

    const handleModalOk = async (values) => {
        try {
            setLoading(true);
            // định dạng dob thành string
            dayjs.extend(customParseFormat);
            values.dob = dayjs(values.dob, 'YYYY-MM-DD').format('DD/MM/YYYY');
            console.log('Form values:', values);
            updateUser(selectedUser.userId, values).then((res) => {
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <BoxContainer>
                <div className="title1">Quản lý người tìm việc</div>
            </BoxContainer>
            <BoxContainer>
                <TableListUser
                    fetch={res}
                    userType="student"
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
                        loading={loading}
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
                        <Select>
                            <Option value={true}>Hoạt động</Option>
                            <Option value={false}>Khóa</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ManageListUser;