import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import './ModalFormLogin.scss';
import { getToken, setToken, studentLogin } from '../../services/apiService';
import { UserOutlined, UnlockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ModalFormLogin = (props) => {
    const { show, setShow } = props;
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
        //Validate dữ liệu
        const { username, ...rest } = values;
        const updatedValues = {
            ...rest,
            [inputType]: username,
        };
        console.log(updatedValues);
        //Call API
        let res = await studentLogin(updatedValues);
        
        if (res.status === 'OK') {
            // Check if the logged in user's role matches the selected role
            const userRoleFromAPI = res.data.roles.roleName; // Assuming API returns user role
            toast.success(res.message);
            setToken(res.data.token, res.data.refresh_token);
            getToken();

            // Route based on role from API response
            if (userRoleFromAPI === 'student') {
                navigate('');
            } else if (userRoleFromAPI === 'admin') {
                navigate('/admin');
            }
        } else {
            toast.error(res.message);
        }

        // clear states
        handleClose();
    };
    return (
        <form >
            <Modal style={{ backgroundColor: "gray" }} show={show} onHide={() => setShow(false)} size='lg' backdrop="static" centered>
                <Modal.Header >
                    <Modal.Title style={{ fontSize: "18px", fontWeight: "600", color: "rgb(51, 51, 51)", lineHeight: "22px" }}>Đăng nhập</Modal.Title>
                </Modal.Header>
                <Form
                    requiredMark={false}
                    form={form}
                    onFinish={handleLogin}
                    autoComplete="on"
                    layout='vertical'>
                    <Modal.Body className="modal-login">
                        <p className="title">Đăng nhập bằng email</p>
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
                            <Input className="form-control d-flex" onChange={handleInputChange} prefix={<UserOutlined />} />
                        </Form.Item>
                        <Form.Item
                            className='mb-3'
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
                            <div className="d-flex justify-content-end">
                                <a href="/forgot-password" target='_blank'>Quên mật khẩu?</a>
                            </div>
                        </Form.Item>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='size' variant="secondary" onClick={handleClose}>
                            Hủy
                        </Button>
                        <Button className='size' type="primary" htmlType='submit'>
                            Đăng nhập
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </form>
    );
}

export default ModalFormLogin;