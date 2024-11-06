import './LoginPage.scss';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { employerLogin, getToken, setToken } from '../../services/apiService';
import { UserOutlined, UnlockOutlined } from '@ant-design/icons';
import { IoIosArrowRoundBack } from "react-icons/io";
import { Button, Flex, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { loading, setloading, stop } from '../../redux/action/webSlice';


const LoginPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10,11}$/;
    const dispatch = useDispatch();
    var inputType = '';

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (emailRegex.test(value)) {
            inputType = 'email';
        } else if (phoneRegex.test(value)) {
            inputType = 'phoneNumber';
        } else {
            inputType = '';
        }
    };

    const handleLogin = async (values) => {
        dispatch(loading());
        //Validate email
        const { username, ...rest } = values;
        const updatedValues = {
            ...rest,
            [inputType]: username,
        };
        //Call API
        const res = await employerLogin(updatedValues);
        if (res.status === 'OK') {
            toast.success(res.message);
            setToken(res.data.token, res.data.refreshToken);
            getToken();
            dispatch(stop());
            navigate('/employer');
        } else {
            toast.error(res.message);
            dispatch(stop());
        }

    }
    return (
        <div className="login-page d-flex">
            <div className="image col-lg-5 d-none d-lg-block"></div>
            <div className="col-12 p-sm-5 p-0 col-lg-7">
                <div className="login-form mt-4 p-5 shadow">
                    <span className="d-flex justify-content-center title">Đăng Nhập</span>
                    <div className="col-md-12 form-group mt-5 mb-4">
                        <Form
                            size='large'
                            requiredMark={false}
                            form={form}
                            onFinish={handleLogin}
                            autoComplete="on"
                            layout='vertical'>
                            <Form.Item name="username" label={<span>Email/ Số điện thoại <span style={{ color: "red" }}> *</span></span>}
                                rules={[
                                    {
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
                                    }),

                                ]} validateTrigger={['onBlur']} validateFirst>
                                <Input onChange={handleInputChange} prefix={<UserOutlined />} />
                            </Form.Item>
                            <Form.Item
                                className='mb-4'
                                label={<span>Mật khẩu <span style={{ color: "red" }}> *</span></span>}
                                required
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mật khẩu của bạn',
                                    },
                                ]} validateTrigger={['onBlur', 'onChange']}>
                                <Input.Password prefix={<UnlockOutlined />} />
                            </Form.Item>


                            <Form.Item>
                                <Flex justify='space-between' className=' mb-2'>
                                    <span className='col-6'>Bạn chưa đăng ký? <Link to='/employer/register'>Đăng ký ngay</Link></span>
                                    <Link className='col-6 d-flex justify-content-end' to='/forgot-password' target='_blank'>Quên mật khẩu?</Link>
                                </Flex>
                            </Form.Item>
                            <Flex align='center' justify='space-between'>
                                <Link to='/home' className='text-decoration-none align-middle'>
                                    <IoIosArrowRoundBack className='fs-4' />Quay lại trang chủ
                                </Link>
                                <Button className='size' type="primary" htmlType='submit'>
                                    Đăng nhập
                                </Button>
                            </Flex>
                        </Form>
                    </div>
                </div>
            </div>
        </div>

    );
}
export default LoginPage;