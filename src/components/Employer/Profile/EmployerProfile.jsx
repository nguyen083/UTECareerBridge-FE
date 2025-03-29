import { Button, Divider, Flex, Form, Input, Radio, Space, DatePicker, message, Row, Col } from 'antd';
import BoxContainer from '../../Generate/BoxContainer';
// import './EmployerProfile.scss';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { updateEmployerProfile } from '../../../services/apiService';
import { setInfor } from '../../../redux/action/employerSlice';
import { useTranslation } from 'react-i18next';

const EmployerProfile = () => {
    const { t } = useTranslation();
    const regChar = new RegExp(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]*$/);
    const [enableEdit, setEnableEdit] = useState(true);
    const [form] = Form.useForm();
    dayjs.extend(customParseFormat);
    const dispatch = useDispatch();
    let infor = { ...useSelector(state => state.employer), dob: dayjs(useSelector(state => state.employer.dob), "DD/MM/YYYY") };
    const handleReset = () => {
        setEnableEdit(true);
        form.resetFields();
    }
    const handleSubmit = (values) => {
        values.dob = values.dob.format("DD/MM/YYYY");
        updateEmployerProfile(values).then(res => {
            if (res.status === 'OK') {
                message.success(res.message);
                dispatch(setInfor(res.data));
            }
            else {
                message.error(res.message);
            }
        });
    };



    return (
        <>
            <BoxContainer className="shadow-md">
                <div className="title1">
                    {t('employer.profile.title')}
                </div>
            </BoxContainer>
            <BoxContainer className='shadow-md'>
                <Flex align='center' justify='space-between'>
                    <span className='title2'>{t('employer.profile.generalInfo')}</span>
                    <Button disabled={!enableEdit} onClick={() => { setEnableEdit(false) }}>{t('common.edit')}</Button>
                </Flex>
                <Divider />
                <Form onFinish={handleSubmit} form={form} size='large' layout='vertical' requiredMark={false} autoComplete='false' disabled={enableEdit}
                    initialValues={infor}>
                    <Row className="div-form-profile" gutter={16}>
                        <Col span={12}>
                            <Form.Item name="firstName" label={<span>{t('auth.register.firstName')} <span className='text-red-500'> *</span></span>}
                                rules={[
                                    {
                                        required: true,
                                        message: t('auth.register.firstNameRequired'),
                                    },
                                    {
                                        pattern: regChar,
                                        message: t('employer.register.invalidFirstName'),
                                    }
                                ]} validateTrigger={['onChange']}>
                                <Input allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="lastName" label={<span>{t('auth.register.lastName')} <span className='text-red-500'> *</span></span>}
                                rules={[
                                    {
                                        required: true,
                                        message: t('auth.register.lastNameRequired'),
                                    },
                                    {
                                        pattern: regChar,
                                        message: t('employer.register.invalidLastName'),
                                    }
                                ]} validateTrigger={['onChange']}>
                                <Input allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item name="gender" label={t('auth.register.gender')} >
                                <Radio.Group className='mb-0'>
                                    <Space direction="horizontal">
                                        <Radio value={0}>{t('auth.register.male')}</Radio>
                                        <Radio value={1}>{t('auth.register.female')}</Radio>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={9}>
                            <Form.Item name="dob" label={<span>{t('auth.register.birthday')} <span className='text-red-500'> *</span></span>} rules={[
                                {
                                    required: true,
                                    message: t('auth.register.birthdayRequired'),
                                },
                            ]} validateTrigger={['onChange']}>
                                <DatePicker className='w-full' format={"DD/MM/YYYY"} placeholder={t('auth.register.birthdayPlaceholder')} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="phoneNumber" label={<span>{t('auth.register.phone')} <span className='text-red-500'> *</span></span>}
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
                                validateTrigger={['onBlur']}>
                                <Input allowClear />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Flex gap={"1rem"} align='center' justify='end' hidden={enableEdit}>
                        <Button size='middle' type='default' onClick={handleReset}>{t('common.cancel')}</Button>
                        <Button size='middle' type='primary' htmlType='submit'>{t('common.save')}</Button>
                    </Flex>
                </Form>
            </BoxContainer>
        </>
    );
}

export default EmployerProfile;