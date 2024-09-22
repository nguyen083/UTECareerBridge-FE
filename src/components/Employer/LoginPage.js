import './LoginPage.scss';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { employerLogin, getToken, setToken } from '../../services/apiService';
import { UserOutlined, UnlockOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

const LoginPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10,11}$/;
    var inputType = '';

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (emailRegex.test(value)) {
            inputType = 'email';
        } else if (phoneRegex.test(value)) {
            inputType = 'phone_number';
        } else {
            inputType = '';
        }
    };

    const handleLogin = async (values) => {
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
            navigate('/employer');
        } else {
            toast.error(res.message);
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
                                <Input className="form-control d-flex" size='large' onChange={handleInputChange} prefix={<UserOutlined />} />
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
                                <Input.Password className="form-control d-flex" prefix={<UnlockOutlined />} />
                            </Form.Item>


                            <Form.Item>
                                <div className='d-flex justify-content-between mb-4'>
                                    <span className='col-6'>Bạn chưa đăng ký? <a href='/employer/register'>Đăng ký ngay</a></span>
                                    <a className='col-6 d-flex justify-content-end' href='forgot-password' target='_blank'>Quên mật khẩu?</a>
                                </div>
                            </Form.Item>
                            <div className='d-flex justify-content-end'>
                                <Button className='size' type="primary" htmlType='submit'>
                                    Đăng nhập
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>

    );
}
export default LoginPage;