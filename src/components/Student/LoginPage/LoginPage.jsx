import React from 'react';
import { Form, Input, Button, Typography, Row, Col, Flex, Image, Divider, Card, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, studentLogin } from '../../../services/apiService';
import { loading, stop } from '../../../redux/action/webSlice';
import './LoginPage.scss'; // Import file SCSS
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useRedux } from '../../../utils/useRedux';

const { Title, Text } = Typography;

const LoginPage = () => {
    const { login } = useRedux();
    const dispatch = useDispatch();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10,11}$/;
    const [form] = Form.useForm();
    const navigate = useNavigate();

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
                await setToken(res.data.token, res.data.refresh_token); // set token
                login(res); // set user info to redux
                if (res.data.roles.roleName === 'student') {
                    navigate('/home');
                } else if (res.data.roles.roleName === 'admin') {
                    navigate('/admin');
                }
            } else {
                message.error(res.message);
            }
        } catch (err) {
            message.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
        }
        finally {
            dispatch(stop());
        }
    };

    return (
        <Row className="full-height-row">
            <Col xs={24} lg={12} className="left-column">
                <Flex vertical gap={20} justify='center' align='center' className='w-100'>
                    <Image
                        className='logo'
                        src="https://res.cloudinary.com/utejobhub/image/upload/v1723888103/rg2do6iommv6wp840ixr.png"
                        alt=""
                        preview={false}
                        width={200}
                        onClick={() => navigate('/home')}
                    />
                    <Card
                        title={<Title level={3} className='my-auto text-center card-title'>Đăng nhập</Title>}
                        className="login-card shadow">
                        <Flex>
                            <Form
                                form={form}
                                className='w-100'
                                name="login"
                                onFinish={handleLogin}
                                layout="vertical"
                                requiredMark={false}
                                size='large'
                                initialValues={{ remember: true }}
                                validateTrigger='onBlur'
                            >
                                <Form.Item
                                    name="username"
                                    label={<div className="form-label">Email/ SĐT</div>}
                                    rules={[{ required: true, message: 'Vui lòng nhập email hoặc số điện thoại của bạn' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value) {
                                                return Promise.reject('Vui lòng nhập email hoặc số điện thoại của bạn');
                                            }
                                            if (emailRegex.test(value)) {
                                                return Promise.resolve();
                                            }
                                            if (phoneRegex.test(value)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('Vui lòng nhập đúng định dạng email hoặc số điện thoại');
                                        },
                                    })]}
                                    validateFirst
                                >
                                    <Input size='large' className="input-field" placeholder="Nhập email/SĐT" />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    label={<div className="form-label">Mật khẩu</div>}
                                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                                    validateFirst
                                >
                                    <Input.Password placeholder="Nhập mật khẩu" className="input-field" />
                                </Form.Item>

                                <Form.Item className='mb-1'>
                                    <Button className='w-100 login-button' type="primary" htmlType="submit">
                                        Đăng nhập
                                    </Button>
                                </Form.Item>
                                <Form.Item className='p-0 m-0'>
                                    <Flex justify='end' gap={20}>
                                        {/* <Link className='text-decoration-none link-text' to="/home"><IoIosArrowRoundBack className='fs-4' /> Trở về trang chủ</Link> */}
                                        <Link className='text-decoration-none link-text' to="/forgot-password" target='_blank'>Quên mật khẩu?</Link>
                                    </Flex>
                                </Form.Item>
                                <Text className='text-center'>Bạn chưa có tài khoản? <Button className='p-0 f-14' type='link' onClick={() => navigate('/register')}>Đăng ký ngay</Button></Text>
                                <Divider className='mb-0' />

                            </Form>
                        </Flex>
                    </Card>
                </Flex>
            </Col>
            <Col xs={0} lg={12} className="right-column">
                <Image preview={false} width={65} src='https://res.cloudinary.com/utejobhub/image/upload/v1731551121/student/ua3ccjvawfxkb1yqqirb.png'></Image>
            </Col>
        </Row >
    );
};

export default LoginPage;
