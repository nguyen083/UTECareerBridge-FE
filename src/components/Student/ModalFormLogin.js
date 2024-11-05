import { Button, Flex, Form, Input, Modal } from 'antd';
import React from 'react';
import './ModalFormLogin.scss';
import { getToken, setToken, studentLogin } from '../../services/apiService';
import { UserOutlined, UnlockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setloading } from '../../redux/action/webSlice';

const ModalFormLogin = (props) => {
    const { show, setShow } = props;
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const navigate = useNavigate();
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

    const handleClose = () => {
        form.resetFields();
        setShow(false);
    };

    const handleLogin = async (values) => {

        dispatch(setloading({ loading: true }));
        const { username, ...rest } = values;
        const updatedValues = {
            ...rest,
            [inputType]: username,
        };
        console.log(updatedValues);
        handleClose();
        let res = await studentLogin(updatedValues);

        if (res.status === 'OK') {
            const userRoleFromAPI = res.data.roles.roleName;
            toast.success(res.message);
            setToken(res.data.token, res.data.refresh_token);
            getToken();

            if (userRoleFromAPI === 'student') {
                navigate('');
            } else if (userRoleFromAPI === 'admin') {
                navigate('/admin');
            }
        } else {
            toast.error(res.message);
        }
        dispatch(setloading({ loading: false }));

    };

    return (
        <Modal
            width={'50%'}
            title="Đăng nhập"
            visible={show}
            onCancel={handleClose}
            footer={
                <Flex gap={"0.5rem"} justify='end'>
                    <Button size='large' onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button size='large' type="primary" onClick={form.submit}>
                        Đăng nhập
                    </Button>
                </Flex>
            }
            centered
            maskClosable={false}
        >
            <Form
                requiredMark={false}
                form={form}
                onFinish={handleLogin}
                autoComplete="on"
                layout="vertical"
            >

                <p className="title mx-auto">Đăng nhập bằng email hoặc số điện thoại</p>
                <Form.Item
                    name="username"
                    label={<span>Email/ Số điện thoại <span style={{ color: "red" }}> *</span></span>}
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
                    ]}
                    validateTrigger={['onBlur']}
                    validateFirst
                >
                    <Input
                        className="form-control d-flex"
                        onChange={handleInputChange}
                        prefix={<UserOutlined className='me-2' />}
                    />
                </Form.Item>

                <Form.Item
                    className='mb-3'
                    label={<span>Mật khẩu <span style={{ color: "red" }}> *</span></span>}
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn' }]}
                    validateTrigger={['onBlur', 'onChange']}
                >
                    <Input.Password
                        className="form-control d-flex"
                        prefix={<UnlockOutlined className='me-2' />}
                    />
                </Form.Item>

                <Form.Item>
                    <div className="d-flex justify-content-end">
                        <Link to="/forgot-password" target='_blank'>Quên mật khẩu?</Link>
                    </div>
                </Form.Item>
                <Form.Item>
                    <Input type="submit" hidden />
                </Form.Item>



            </Form>
        </Modal>

    );
}

export default ModalFormLogin;
