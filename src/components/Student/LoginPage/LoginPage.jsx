import { Form, Input, Button, Typography, Row, Col, Flex, Image, Divider, Card, message, Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, studentLogin } from '../../../services/apiService';
import { loading, stop } from '../../../redux/action/webSlice';
import './LoginPage.scss';
import { useRedux } from '../../../utils/useRedux';
import { FcGoogle } from "react-icons/fc";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import path from '../../../constant/path';
import auth from '../../../services/api/auth';
import { useTranslation } from 'react-i18next';

const { Title, Text, Paragraph } = Typography;

const LoginPage = () => {
    const { login } = useRedux();
    const dispatch = useDispatch();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10,11}$/;
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const checkUserName = (value) => {
        if (emailRegex.test(value)) {
            return { "email": value };
        } else if (phoneRegex.test(value)) {
            return { "phone_number": value };
        } else {
            return { "": value };
        }
    };

    const handleLogin = async (values) => {
        const { username, ...rest } = values;
        const updatedValues = {
            ...rest,
            ...checkUserName(username)
        };
        try {
            dispatch(loading());
            let res = await studentLogin(updatedValues);
            if (res.status === 'OK') {
                form.resetFields();
                message.success(res.message);
                await setToken(res.data.token, res.data.refresh_token);
                login(res);
                if (res.data.roles.roleName === 'student') {
                    navigate('/home');
                } else if (res.data.roles.roleName === 'admin') {
                    navigate('/admin');
                }
            } else {
                message.error(res.message);
            }
        } catch (err) {
            console.error(err)
            message.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
        }
        finally {
            dispatch(stop());
        }
    };
    
    const handleLoginWithGoogle = () => {
        auth.loginGoogle('student').then(res => {
            window.open(res);
        }).catch(() => {
            message.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
        });
        return;
    }
    
    return (
        <div className="login-container">
            <Row className="login-row">
                <Col xs={24} md={24} lg={12} className="login-form-column">
                    <div className="login-form-wrapper">
                        <div className="login-logo">
                            <Image
                                src={path.logo}
                                alt="UTECareerBridge"
                                preview={false}
                                width={180}
                                onClick={() => navigate('/home')}
                            />
                        </div>

                        <Card className="login-card" bordered={false}>
                            <div className="login-header">
                                <Title level={2}>{t('auth.login.title')}</Title>
                                <Paragraph className="welcome-text">
                                    {t('auth.login.welcome')}
                                </Paragraph>
                            </div>

                            <Form
                                form={form}
                                className="login-form"
                                name="login"
                                onFinish={handleLogin}
                                layout="vertical"
                                requiredMark={false}
                                size="large"
                                validateTrigger="onBlur"
                            >
                                <Form.Item
                                    name="username"
                                    label={<div className="form-label">{t('auth.login.email/phone')}</div>}
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email hoặc số điện thoại của bạn' },
                                        () => ({
                                            validator(_, value) {
                                                if (!value) {
                                                    return Promise.reject('Vui lòng nhập email hoặc số điện thoại của bạn');
                                                }
                                                if (emailRegex.test(value) || phoneRegex.test(value)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('Vui lòng nhập đúng định dạng email hoặc số điện thoại');
                                            },
                                        })
                                    ]}
                                    validateFirst
                                >
                                    <Input 
                                        prefix={<UserOutlined className="input-icon" />} 
                                        placeholder={t('auth.login.emailPlaceholder')} 
                                        className="custom-input"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    label={<div className="form-label">{t('auth.login.password')}</div>}
                                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                                    validateFirst
                                >
                                    <Input.Password 
                                        prefix={<LockOutlined className="input-icon" />}
                                        placeholder={t('auth.login.passwordPlaceholder')} 
                                        className="custom-input" 
                                    />
                                </Form.Item>

                                <Flex justify="space-between" align="center" className="login-options">
                                    <Checkbox>Nhớ tài khoản</Checkbox>
                                    <Link className="forgot-password" to="/forgot-password">
                                        {t('auth.login.forgotPassword')}
                                    </Link>
                                </Flex>

                                <Form.Item>
                                    <Button 
                                        className="login-button" 
                                        type="primary" 
                                        htmlType="submit"
                                        block
                                    >
                                        {t('auth.login.title')}
                                    </Button>
                                </Form.Item>

                                <Divider className="login-divider">
                                    <span>{t('common.or')}</span>
                                </Divider>

                                <Button 
                                    className="google-button" 
                                    onClick={handleLoginWithGoogle}
                                    block
                                >
                                    <FcGoogle size={20} className="google-icon" />
                                    {t('common.googleLogin')}
                                </Button>

                                <div className="register-link">
                                    <Text>{t('auth.login.dont_have_an_account')}</Text>
                                    <Button type="link" onClick={() => navigate('/register')}>
                                        {t('auth.register.title')}
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </div>
                </Col>

                <Col xs={0} lg={12} className="image-column">
                    <div className="image-content">
                        <div className="image-overlay">
                            <Title level={2} className="image-title">UTECareerBridge</Title>
                            <Paragraph className="image-description">
                                Kết nối sinh viên với cơ hội việc làm và phát triển sự nghiệp
                            </Paragraph>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default LoginPage;
