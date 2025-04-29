import { Button, Flex, Form, Input, Radio, Space, DatePicker, message, Row, Col, Card, Typography, Tooltip, Avatar } from 'antd';
import BoxContainer from '../../Generate/BoxContainer';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { updateEmployerProfile } from '../../../services/apiService';
import { setInfor } from '../../../redux/action/employerSlice';
import { useTranslation } from 'react-i18next';
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import './EmployerProfile.scss';

const { Text, Title } = Typography;

const EmployerProfile = () => {
    const { t } = useTranslation();
    const [enableEdit, setEnableEdit] = useState(true);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    dayjs.extend(customParseFormat);
    const dispatch = useDispatch();
    let infor = { ...useSelector(state => state.employer), dob: dayjs(useSelector(state => state.employer.dob), "DD/MM/YYYY") };
    const regChar = /^[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;

    const handleReset = () => {
        setEnableEdit(true);
        form.resetFields();
    }
    
    const handleSubmit = (values) => {
        setLoading(true);
        values.dob = values.dob.format("DD/MM/YYYY");
        updateEmployerProfile(values).then(res => {
            if (res.status === 'OK') {
                message.success(res.message);
                dispatch(setInfor(res.data));
                setEnableEdit(true);
            }
            else {
                message.error(res.message);
            }
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <>
            <BoxContainer className="shadow-md profile-header">
                <div className="title1">
                    {t('employer.profile.title')}
                </div>
            </BoxContainer>
            
            <BoxContainer className='shadow-md profile-content'>
                <Card 
                    className="profile-card"
                    title={
                        <Flex align='center' justify='space-between'>
                            <Title level={4} className="profile-section-title">{t('employer.profile.generalInfo')}</Title>
                            <Tooltip title={enableEdit ? t('common.edit') : t('common.cancel')}>
                                <Button 
                                    type={enableEdit ? "primary" : "default"} 
                                    icon={enableEdit ? <EditOutlined /> : <CloseOutlined />} 
                                    onClick={() => { 
                                        if (!enableEdit) handleReset();
                                        else setEnableEdit(false);
                                    }}
                                    shape="round"
                                >
                                    {enableEdit ? t('common.edit') : t('common.cancel')}
                                </Button>
                            </Tooltip>
                        </Flex>
                    }
                    bordered={false}
                >
                    <div className="profile-overview">
                        <div className="avatar-section">
                            <Avatar 
                                size={120} 
                                icon={<UserOutlined />} 
                                src={infor?.companyLogo}
                                className="profile-avatar"
                            />
                            <Text strong className="user-fullname">{`${infor?.firstName || ''} ${infor?.lastName || ''}`}</Text>
                            <Text type="secondary" className="user-email">{infor?.email || ''}</Text>
                        </div>
                        
                        <Form 
                            onFinish={handleSubmit} 
                            form={form} 
                            size='large' 
                            layout='vertical' 
                            requiredMark={false} 
                            autoComplete='false' 
                            disabled={enableEdit}
                            initialValues={infor}
                            className="profile-form"
                        >
                            <Row gutter={[24, 16]}>
                                <Col xs={24} sm={12}>
                                    <Form.Item 
                                        name="firstName" 
                                        label={<span>{t('auth.register.firstName')} <span className='text-red-500'> *</span></span>}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('auth.register.firstNameRequired'),
                                            },
                                            {
                                                pattern: regChar,
                                                message: t('employer.register.invalidFirstName'),
                                            }
                                        ]} 
                                        validateTrigger={['onChange']}
                                    >
                                        <Input allowClear />
                                    </Form.Item>
                                </Col>
                                
                                <Col xs={24} sm={12}>
                                    <Form.Item 
                                        name="lastName" 
                                        label={<span>{t('auth.register.lastName')} <span className='text-red-500'> *</span></span>}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('auth.register.lastNameRequired'),
                                            },
                                            {
                                                pattern: regChar,
                                                message: t('employer.register.invalidLastName'),
                                            }
                                        ]} 
                                        validateTrigger={['onChange']}
                                    >
                                        <Input allowClear />
                                    </Form.Item>
                                </Col>
                                
                                <Col xs={24} md={6}>
                                    <Form.Item 
                                        name="gender" 
                                        label={t('auth.register.gender')} 
                                        className="gender-field"
                                    >
                                        <Radio.Group className='mb-0'>
                                            <Space direction="horizontal">
                                                <Radio value={0}>{t('auth.register.male')}</Radio>
                                                <Radio value={1}>{t('auth.register.female')}</Radio>
                                            </Space>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                
                                <Col xs={24} md={8}>
                                    <Form.Item 
                                        name="dob" 
                                        label={<span>{t('auth.register.birthday')} <span className='text-red-500'> *</span></span>} 
                                        rules={[
                                            {
                                                required: true,
                                                message: t('auth.register.birthdayRequired'),
                                            },
                                        ]} 
                                        validateTrigger={['onChange']}
                                    >
                                        <DatePicker 
                                            className='w-full' 
                                            format={"DD/MM/YYYY"} 
                                            placeholder={t('auth.register.birthdayPlaceholder')} 
                                        />
                                    </Form.Item>
                                </Col>
                                
                                <Col xs={24} md={10}>
                                    <Form.Item 
                                        name="phoneNumber" 
                                        label={<span>{t('auth.register.phone')} <span className='text-red-500'> *</span></span>}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('auth.register.phoneRequired'),
                                            },
                                            {
                                                pattern: new RegExp(/^(0[3|5|7|8|9])[0-9]{8}$/),
                                                message: t('employer.register.invalidPhone')
                                            }
                                        ]}
                                        validateTrigger={['onBlur']}
                                    >
                                        <Input allowClear />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item 
                                        name="email" 
                                        label="Email"
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                
                                <Col xs={24}>
                                    <Form.Item 
                                        name="address" 
                                        label={t('auth.register.address')}
                                    >
                                        <Input allowClear />
                                    </Form.Item>
                                </Col>
                            </Row>
                            
                            {!enableEdit && (
                                <Flex gap="1rem" align='center' justify='end' className="form-actions">
                                    <Button 
                                        size='middle' 
                                        type='default' 
                                        onClick={handleReset}
                                        icon={<CloseOutlined />}
                                    >
                                        {t('common.cancel')}
                                    </Button>
                                    <Button 
                                        size='middle' 
                                        type='primary' 
                                        htmlType='submit'
                                        loading={loading}
                                        icon={<SaveOutlined />}
                                    >
                                        {t('common.save')}
                                    </Button>
                                </Flex>
                            )}
                        </Form>
                    </div>
                </Card>
            </BoxContainer>
        </>
    );
}

export default EmployerProfile;