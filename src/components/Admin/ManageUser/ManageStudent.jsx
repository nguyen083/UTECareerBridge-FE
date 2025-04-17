import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, message } from 'antd';
import TableListUser from './TableListUser';
import BoxContainer from '../../Generate/BoxContainer';
import { getUserByUserId, updateUser } from '../../../services/apiService';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const ManageListUser = () => {
    const { t } = useTranslation();
    const [activeStatus, setActiveStatus] = useState('active');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [res, setRes] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [form] = Form.useForm();
   
    const getAdditionalColumns = (status) => {
        const columns = [];

        if (status === 'pending') {
            columns.push({
                title: t('admin.student.table.columns.registrationDate'),
                dataIndex: 'registrationDate',
                key: 'registrationDate',
            });
        }

        if (status === 'blocked') {
            columns.push({
                title: t('admin.student.table.columns.blockReason'),
                dataIndex: 'blockReason',
                key: 'blockReason',
            });
        }

        if (status === 'inactive') {
            columns.push({
                title: t('admin.student.table.columns.lastLoginDate'),
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
            setLoading(true);
            const response = await getUserByUserId(record.key);
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
            message.error(t('admin.student.messages.loadError'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        Modal.confirm({
            title: t('admin.student.modal.deleteConfirm.title'),
            content: t('admin.student.modal.deleteConfirm.content'),
            okText: t('admin.student.modal.deleteConfirm.okText'),
            okType: 'danger',
            centered: true,
            cancelText: t('admin.student.modal.deleteConfirm.cancelText'),
            onOk: async () => {
                try {
                    setLoading(true);
                    await deleteUserById(userId);
                    message.success(t('admin.student.messages.deleteSuccess'));
                } catch (error) {
                    message.error(t('admin.student.messages.deleteError'));
                } finally {
                    setLoading(false);
                }
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
            dayjs.extend(customParseFormat);
            values.dob = dayjs(values.dob, 'YYYY-MM-DD').format('DD/MM/YYYY');
            updateUser(selectedUser.userId, values).then((res) => {
                if (res.status === 'OK') {
                    setRes(res.data);
                    message.success(t('admin.student.messages.updateSuccess'));
                } else {
                    message.error(t('admin.student.messages.updateError'));
                }
            });
            handleModalCancel();
        } catch (error) {
            message.error(t('admin.student.messages.validateError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <BoxContainer className='shadow-md'>
                <div className="title1">{t('admin.student.title')}</div>
            </BoxContainer>
            <BoxContainer className='shadow-md'>
                <TableListUser
                    fetch={res}
                    userType="student"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </BoxContainer>
            <Modal
                title={t('admin.student.modal.title')}
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="back" onClick={handleModalCancel}>
                        {t('admin.student.modal.buttons.cancel')}
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={loading}
                        onClick={form.submit}
                    >
                        {t('admin.student.modal.buttons.save')}
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
                            label={t('admin.student.modal.form.lastName.label')}
                            style={{ flex: 1 }}
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            name="firstName"
                            label={t('admin.student.modal.form.firstName.label')}
                            style={{ flex: 1 }}
                        >
                            <Input disabled />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="email"
                        label={t('admin.student.modal.form.email.label')}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label={t('admin.student.modal.form.phone.label')}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label={t('admin.student.modal.form.address.label')}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        name="dob"
                        label={t('admin.student.modal.form.dob.label')}
                    >
                        <DatePicker format={'DD/MM/YYYY'} style={{ width: '100%' }} disabled />
                    </Form.Item>

                    <Form.Item
                        name="active"
                        label={t('admin.student.modal.form.status.label')}
                    >
                        <Select>
                            <Option value={true}>{t('admin.student.modal.form.status.options.active')}</Option>
                            <Option value={false}>{t('admin.student.modal.form.status.options.blocked')}</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ManageListUser;