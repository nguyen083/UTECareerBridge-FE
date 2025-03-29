import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Input, Row, Space, message } from 'antd';
import { useLocation } from 'react-router-dom';
import "./ResetPassword.scss";
import { userResetPassword } from "../../services/apiService";
import COLOR from "../styles/_variables";
import { useTranslation } from "react-i18next";


const ResetPassword = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [submit, setSubmit] = useState(false);
    const [form] = Form.useForm();
    const location = useLocation();
    const [notice, setNotice] = useState("");
    let token = "";
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        token = queryParams.get('token');
        setEmail(queryParams.get('email'));
    }, [location]);

    const onFinish = async (values) => {
        const res = await userResetPassword(token, values.password);
        if (res.status === 'OK') {
            setNotice(res.message);
            message.success(t('auth.resetPassword.success'));
            setSubmit(true);
        }
        else {
            message.error(t('auth.resetPassword.error'));
        }
    };
    return (
        <div className="form-change-password">
            <Card style={{ backgroundColor: COLOR.cardColor }} className="shadow">
                <div className="title" style={{ color: COLOR.textColor }}>
                    {t('auth.resetPassword.title')}
                </div>
                <div className={`${submit && "hidden"}`}>

                    <div className="description form-text">
                        {t('auth.resetPassword.description')}: <span style={{ color: "blue" }}>{email}</span>
                    </div>
                    <Form
                        size="large"
                        name="change-password"
                        requiredMark={false}
                        form={form}
                        onFinish={onFinish}
                        layout="vertical"
                        autoComplete="off">
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label={<span>{t('profile.accountManagement.newPassword')} <span className='text-red-500'> *</span></span>}
                                    required
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: t('employer.changePassword.newPassword.required'),
                                        },
                                        {
                                            min: 8,
                                            message: t('employer.changePassword.newPassword.minLength')
                                        },
                                        {
                                            pattern: new RegExp(/^(?=.*[A-Z])/),
                                            message: t('employer.changePassword.newPassword.uppercase')
                                        },
                                        {
                                            pattern: new RegExp(/^(?=.*[0-9])/),
                                            message: t('employer.changePassword.newPassword.number')
                                        },
                                        {
                                            pattern: new RegExp(/^(?=.*[!@#$%^&*(),.?":{}|<>])/),
                                            message: t('employer.changePassword.newPassword.special')
                                        }
                                    ]} validateFirst>
                                    <Input.Password />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    label={<span>{t('profile.accountManagement.confirmNewPassword')} <span className='text-red-500'> *</span></span>}
                                    required
                                    name="repassword"
                                    rules={[
                                        {
                                            required: true,
                                            message: t('employer.changePassword.confirmPassword.required'),
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error(t('employer.changePassword.confirmPassword.mismatch')));
                                            },
                                        }),
                                    ]} validateFirst>
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item>
                            <Space className="flex justify-end mt-3">
                                <Button className="text-base" type="primary" htmlType="submit">{t('common.complete')}</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
                <div className={`message ${!submit && "hidden"}`}>
                    {notice}
                </div>
            </Card>
        </div>
    );
};
export default ResetPassword;