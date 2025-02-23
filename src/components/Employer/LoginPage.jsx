import './LoginPage.scss';
import { Link, useNavigate } from 'react-router-dom';
import { employerLogin, setToken } from '../../services/apiService';
import { UserOutlined, UnlockOutlined } from '@ant-design/icons';
import { IoIosArrowRoundBack } from "react-icons/io";
import { Button, Divider, Flex, Form, Image, Input, Typography, message } from 'antd';
import { useDispatch } from 'react-redux';
import { loading, stop } from '../../redux/action/webSlice';
import { setInfor } from '../../redux/action/userSlice';
import { FcGoogle } from 'react-icons/fc';
import path from '../../constant/path';


const { Text } = Typography;
const LoginPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10,11}$/;
    const dispatch = useDispatch();

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
        console.log(values);
        const { username, ...rest } = values;
        const updatedValues = {
            ...rest,
            ...checkUserName(username)
        };
        console.log(updatedValues);
        dispatch(loading());
        try {
            const res = await employerLogin(updatedValues);
            if (res.status === 'OK') {
                message.success(res.message);
                setToken(res.data.token, res.data.refreshToken);
                dispatch(setInfor({ userId: res.data.id, role: res.data.roles.roleName, email: res.data.username }));
                navigate('/employer');

            } else {
                message.error(res.message);
            }


        } catch (error) {
            console.log(error);
        } finally {
            dispatch(stop());
        }
    }
    const handleLoginWithGoogle = () => {
        return;
    }
    return (
        <div className="login-page flex">
            <div className="image lg:w-5/12 hidden lg:block"></div>
            <div className="w-full sm:p-5 p-0 lg:w-7/12 h-screen flex flex-col items-center justify-center">
                <Link to='/home' className='flex items-center'>
                    <Image
                        className='logo'
                        src={path.logo}
                        alt=""
                        preview={false}
                        width={200}
                        onClick={() => navigate('/home')}
                    />
                </Link>
                <div className="login-form p-5 h-fit mt-10 shadow-2xl lg:w-7/12 ">
                    <span className="flex justify-center title">Đăng Nhập</span>
                    <div className="md:w-full form-group mt-5 mb-4">
                        <Form
                            size='large'
                            requiredMark={false}
                            form={form}
                            onFinish={handleLogin}
                            autoComplete="on"
                            layout='vertical'
                            validateTrigger={['onBlur']}>
                            <Form.Item
                                name="username"
                                label="Email/ SĐT"
                                rules={[{
                                    required: true,
                                    message: 'Vui lòng nhập email hoặc số điện thoại của bạn',
                                },
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
                                })
                                ]} validateFirst >
                                <Input prefix={<UserOutlined />} />
                            </Form.Item>
                            <Form.Item
                                label={<span className='lable-text'>Mật khẩu</span>}
                                required
                                name="password"
                                rules={[{
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu của bạn',
                                }]}>
                                <Input.Password prefix={<UnlockOutlined />} />
                            </Form.Item>

                            <Form.Item>
                                <Flex justify='space-between'>
                                    <Flex gap={7} align='center' justify='center'> <Text>Bạn chưa đăng ký?</Text> <Link to='/employer/register'>Đăng ký ngay</Link></Flex>

                                    <Link to='/forgot-password' target='_blank'>Quên mật khẩu?</Link>
                                </Flex>
                            </Form.Item>
                            <Flex align='center' justify='space-between'>

                                <Button size='large' className='w-full' type="primary" htmlType='submit'>
                                    Đăng nhập
                                </Button>

                            </Flex>
                            <Divider className='mb-3'><div className='text-gray-500'>Hoặc</div></Divider>

                            <Form.Item className='mb-1'>
                                <Button className='w-full' type="default" onClick={handleLoginWithGoogle}>
                                    <FcGoogle size={24} className='mr-1' />Đăng nhập với Google
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div >
    );
}
export default LoginPage;
