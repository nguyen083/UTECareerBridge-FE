import { useState } from 'react';
import { Button, DatePicker, Form, Input, Modal, Select, message } from 'antd';
import TableListUser from './TableListUser';
import BoxContainer from '../../Generate/BoxContainer';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { updateUser } from '../../../services/apiService';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const ManageListEmployer = () => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [res, setRes] = useState(null);

    // const getAdditionalColumns = (status) => {
    //     const columns = [];

    //     if (status === 'pending') {
    //         columns.push({
    //             title: t('admin.employer.table.columns.registrationDate'),
    //             dataIndex: 'registrationDate',
    //             key: 'registrationDate',
    //         });
    //     }

    //     if (status === 'blocked') {
    //         columns.push({
    //             title: t('admin.employer.table.columns.blockReason'),
    //             dataIndex: 'blockReason',
    //             key: 'blockReason',
    //         });
    //     }

    //     if (status === 'inactive') {
    //         columns.push({
    //             title: t('admin.employer.table.columns.lastLoginDate'),
    //             dataIndex: 'lastLoginDate',
    //             key: 'lastLoginDate',
    //         });
    //     }

    //     return columns;
    // };



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
    }


    const handleModalCancel = () => {
        form.resetFields();
        setIsModalVisible(false);
        setSelectedUser(null);
    };

    const handleModalOk = async (values) => {
        try {
            dayjs.extend(customParseFormat);
            values.dob = dayjs(values.dob, 'YYYY-MM-DD').format('DD/MM/YYYY');
            updateUser(selectedUser, values).then((res) => {
                if (res.status === 'OK') {
                    setRes(res.data);
                    message.success(t('admin.employer.messages.updateSuccess'));
                }
                else
                    message.error(t('admin.employer.messages.updateError'));
            });
            handleModalCancel();
        } catch (error) {
            console.log(error);
            message.error(t('admin.employer.messages.validateError'));
        }
    };

    return (
        <>
            <BoxContainer className='shadow-md'>
                <div className="title1">{t('admin.employer.title')}</div>
            </BoxContainer>
            <BoxContainer className='shadow-md'>
                <TableListUser
                    fetch={res}
                    userType="employer"
                    onEdit={handleEdit}
                />
            </BoxContainer>
            <Modal
                title={t('admin.employer.modal.title')}
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="back" onClick={handleModalCancel}>
                        {t('admin.employer.modal.buttons.cancel')}
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={form.submit}
                    >
                        {t('admin.employer.modal.buttons.save')}
                    </Button>
                ]}
                width={720}
            >
                <Form
                    form={form}
                    onFinish={handleModalOk}
                    layout="vertical"
                >
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Form.Item
                            name="lastName"
                            label={t('admin.employer.modal.form.lastName.label')}
                            style={{ flex: 1 }}
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item
                            name="firstName"
                            label={t('admin.employer.modal.form.firstName.label')}
                            style={{ flex: 1 }}
                        >
                            <Input disabled />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="email"
                        label={t('admin.employer.modal.form.email.label')}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label={t('admin.employer.modal.form.phone.label')}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        name="dob"
                        label={t('admin.employer.modal.form.dob.label')}
                    >
                        <DatePicker format={'DD/MM/YYYY'} style={{ width: '100%' }} disabled />
                    </Form.Item>

                    <Form.Item
                        name="active"
                        label={t('admin.employer.modal.form.status.label')}
                    >
                        <Select defaultValue={true}>
                            <Option value={true}>{t('admin.employer.modal.form.status.options.active')}</Option>
                            <Option value={false}>{t('admin.employer.modal.form.status.options.blocked')}</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ManageListEmployer;