import React from 'react';
import { Form, Input, Button, Typography, Row, Col, Flex, Image, Divider, Card } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getToken, setToken, studentLogin } from '../../services/apiService';
import { toast } from 'react-toastify';
import { loading, stop } from '../../redux/action/webSlice';


const { Title } = Typography;

const LoginPage = () => {
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

        dispatch(loading());
        const { username, ...rest } = values;
        const updatedValues = {
            ...rest,
            ...checkUserName(username)
        };
        console.log(updatedValues);

        let res = await studentLogin(updatedValues);

        if (res.status === 'OK') {
            form.resetFields();
            const userRoleFromAPI = res.data.roles.roleName;
            toast.success(res.message);
            await setToken(res.data.token, res.data.refresh_token);
            await getToken();

            if (userRoleFromAPI === 'student') {
                navigate('');
            } else if (userRoleFromAPI === 'admin') {
                navigate('/admin');
            }
        } else {
            toast.error(res.message);
        }
        dispatch(stop());

    };

    return (
        <Row style={{ minHeight: '100vh' }}>
            {/* Left Column - Login Form */}
            <Col
                xs={24}
                lg={12}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#F5FAFF'
                }}
            >
                <Flex vertical gap={20} justify='center' align='center' className='w-100'>
                    <Image
                        src="https://res.cloudinary.com/utejobhub/image/upload/v1723888103/rg2do6iommv6wp840ixr.png"
                        alt="Website Logo"
                        preview={false}
                        width={200}
                    />
                    <Card
                        title={<Title level={3} className='my-auto text-center' style={{ color: "#1E4F94" }}>Đăng nhập</Title>}
                        style={{ backgroundColor: "#E1EDFC" }}>
                        <Flex >
                            <Form
                                form={form}
                                className='w-100'
                                name="login"
                                onFinish={handleLogin}
                                layout="vertical"
                                requiredMark={false}
                                size='large'
                                initialValues={{ remember: true }}
                            >
                                <Form.Item
                                    name="username"
                                    label={<div style={{ color: "#1E4F94" }}>Email/ SĐT</div>}
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
                                >
                                    <Input style={{ color: "#1E4F94" }} placeholder="Nhập email/SĐT" />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    label={<div style={{ color: "#1E4F94" }}>Mật khẩu</div>}
                                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                                >
                                    <Input.Password placeholder="Nhập mật khẩu" style={{ color: "#1E4F94" }} />
                                </Form.Item>
                                <Form.Item>
                                    <Button className='mt-3 w-100' type="primary" style={{ backgroundColor: "#1E4F94" }} htmlType="submit">
                                        Đăng nhập
                                    </Button>
                                </Form.Item>
                                <Divider className='mb-0' />
                                <Form.Item>
                                    <Flex justify='space-between' gap={20}>
                                        <Link className='text-decoration-none' style={{ color: "#1E4F94" }} to="/home" target='_blank'>Trở về trang chủ</Link>
                                        <Link className='text-decoration-none' style={{ color: "#1E4F94" }} to="/forgot-password" target='_blank'>Quên mật khẩu?</Link>
                                    </Flex>
                                </Form.Item>
                            </Form>
                        </Flex>
                    </Card>
                </Flex>
            </Col>

            {/* Right Column - Promotional Content */}
            <Col
                xs={0}
                lg={12}
                style={{
                    backgroundColor: '#F5FAFF',
                    backgroundImage: 'url(https://res.cloudinary.com/utejobhub/image/upload/v1731489660/background-website_zmcplv.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: '2rem',
                    textAlign: 'end',
                    position: 'relative'
                }}
            >
                {/* <Title level={2} style={{ color: '#333' }}>
                    Start your free trial. No credit card required, no software to install.
                </Title>
                <Text style={{ fontSize: '1rem', color: '#666' }}>
                    With your trial, you get:
                </Text>
                <ul style={{ textAlign: 'left', maxWidth: '300px', margin: '1rem auto', color: '#666' }}>
                    <li>Preloaded data or upload your own</li>
                    <li>Preconfigured processes, reports, and dashboards</li>
                    <li>Guided experiences for sales reps, leads, and administrators</li>
                    <li>Online training and live onboarding webinars</li>
                </ul>
                <Button type="primary" size="large">
                    Start My Free Trial
                </Button> */}
                <Image preview={false} width={65} src='https://res.cloudinary.com/utejobhub/image/upload/v1731551121/student/ua3ccjvawfxkb1yqqirb.png'></Image>
            </Col>

        </Row >
    );
};

export default LoginPage;
