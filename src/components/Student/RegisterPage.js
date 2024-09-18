// import { useEffect, useState } from "react";
import "./RegisterPage.scss";
import React, { useState } from 'react';
import { Form, Input, Space, Button, DatePicker, Checkbox, Radio } from 'antd';
// import PhoneInputGfg from "../Generate/PhoneInputGfg";
import { studentRegister } from "../../services/apiService";
// import Form from 'react-bootstrap/Form';
// import { DatePicker } from 'antd';
import { toast } from "react-toastify";

const RegisterPage = () => {
    const [form] = Form.useForm();
    const gender = 0; // giới tính mặc định
    const [isChecked, setIsChecked] = useState(false);


    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };
    const handleLogin = async (values) => {
        // Call API
        let res = await studentRegister(values);
        // if (res.status === "CREATED") {
        //     toast.success(res.message);
        // } else {
        //     toast.error(res.message);
        // }
    }

    return (
        <div className="d-flex">
            <div className="image col-lg-5 d-none d-lg-block">
            </div>
            <div className="col-lg-7 col-12 parent-register-form">
                <div className="d-block mx-auto p-md-5 p-2 shadow register-form">
                    <div className="title d-block">
                        <span className="d-block text-center mb-4" style={{ height: "auto", fontSize: "2rem", fontFamily: "Segoe UI", color: "#555555" }}>Đăng Ký Tài Khoản</span>
                    </div>
                    <div className="form-group row g-3">
                        <Form form={form} name="validateOnlyform2" requiredMark={false} layout="vertical" autoComplete="off" onFinish={handleLogin}>
                            <div className="form-group row g-3">
                                <Form.Item name="fist_name" className=" col-12 col-md-6 mt-0" label={<span>Tên <span style={{ color: "red" }}> *</span></span>}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tên của bạn',
                                        },
                                    ]} validateTrigger={['onBlur']}>
                                    <Input className="form-control" />
                                </Form.Item>


                                <Form.Item name="last_name" className="col-12 col-md-6 mt-0" label={<span>Họ <span style={{ color: "red" }}> *</span></span>}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập họ của bạn',
                                        },
                                    ]} validateTrigger={['onBlur']}>
                                    <Input className="form-control" />
                                </Form.Item>
                                <Form.Item name="phone_number" className="col-12 mt-0" label={<span>Số điện thoại <span style={{ color: "red" }}> *</span></span>}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập số điện thoại của bạn',
                                        },
                                        {
                                            pattern: new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/),
                                            message: 'Số điện thoại không hợp lệ'
                                        }
                                    ]}
                                    validateTrigger={['onBlur']}>
                                    <Input className="form-control" />
                                </Form.Item>
                                <Form.Item name="email" className="col-12 mt-0" label={<span>Email <span style={{ color: "red" }}> *</span></span>}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập email của bạn',
                                        },
                                        {
                                            type: 'email',
                                            message: 'Email không hợp lệ',
                                        }
                                    ]}
                                    validateTrigger={['onBlur']}>
                                    <Input className="form-control" />
                                </Form.Item>
                                <Form.Item name="password" className="col-12 mt-0" label={<span>Mật khẩu <span style={{ color: "red" }}> *</span></span>}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập mật khẩu của bạn',
                                        },
                                        {
                                            min: 8,
                                            message: 'Mật khẩu phải có ít nhất 8 ký tự'
                                        },
                                        {
                                            pattern: new RegExp(/^(?=.*[A-Z])/),
                                            message: 'Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa'
                                        },
                                        {
                                            pattern: new RegExp(/^(?=.*[0-9])/),
                                            message: 'Mật khẩu phải chứa ít nhất 1 chữ số'
                                        },
                                        {
                                            pattern: new RegExp(/^(?=.*[!@#$%^&*(),.?":{}|<>])/),
                                            message: 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt'
                                        }
                                    ]} validateFirst
                                    validateTrigger={['onBlur']}>
                                    <Input.Password className="form-control d-flex" />
                                </Form.Item>
                                <Form.Item name="retype_password" className="col-12 mt-0" label={<span>Xác nhận mật khẩu <span style={{ color: "red" }}> *</span></span>}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng xác nhận lại mật khẩu của bạn',
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                            },
                                        }),
                                    ]} validateTrigger={['onBlur']}>
                                    <Input.Password className="form-control d-flex" />
                                </Form.Item>
                            </div>
                            <Form.Item
                                className="col-12 mt-2 mb-5"
                                valuePropName="checked"
                                wrapperCol={{
                                    offset: 1,
                                }}

                            >
                                <Checkbox onChange={handleCheckboxChange} style={{ fontSize: "1rem" }}>Bạn đã đọc và đồng ý với các <a href="/#">điều khoản và điều kiện</a> của chúng tôi
                                </Checkbox>
                            </Form.Item>

                            <Form.Item className="mb-3">
                                <Button className="btn btn-primary py-3 d-flex" disabled={!isChecked} style={{ width: "100%", fontSize: "1rem"}} type="primary" htmlType="submit">Đăng ký</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className="text-center mt-3 mb-3"><p className="fst-italic text-decoration-underline">Hoặc</p></div>
                    <div className="google-btn">
                        <a href="/#" className="sc-faUjhM vsUcT Header_LoginGG">
                            <svg fill="currentColor" stroke="unset" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                                <path d="M 43.609375 20.082031 L 42 20.082031 L 42 20 L 24 20 L 24 28 L 35.304688 28 C 33.652344 32.65625 29.222656 36 24 36 C 17.371094 36 12 30.628906 12 24 C 12 17.371094 17.371094 12 24 12 C 27.058594 12 29.84375 13.152344 31.960938 15.039063 L 37.617188 9.382813 C 34.046875 6.054688 29.269531 4 24 4 C 12.953125 4 4 12.953125 4 24 C 4 35.046875 12.953125 44 24 44 C 35.046875 44 44 35.046875 44 24 C 44 22.660156 43.863281 21.351563 43.609375 20.082031 Z " style={{ fill: "rgb(255, 193, 7)" }}></path>
                                <path d="M 6.304688 14.691406 L 12.878906 19.511719 C 14.65625 15.109375 18.960938 12 24 12 C 27.058594 12 29.84375 13.152344 31.960938 15.039063 L 37.617188 9.382813 C 34.046875 6.054688 29.269531 4 24 4 C 16.316406 4 9.65625 8.335938 6.304688 14.691406 Z " style={{ fill: "rgb(255, 61, 0)" }}></path>
                                <path d="M 24 44 C 29.164063 44 33.859375 42.023438 37.410156 38.808594 L 31.21875 33.570313 C 29.210938 35.089844 26.714844 36 24 36 C 18.796875 36 14.382813 32.683594 12.71875 28.054688 L 6.195313 33.078125 C 9.503906 39.554688 16.226563 44 24 44 Z " style={{ fill: "rgb(76, 175, 80)" }}></path>
                                <path d="M 43.609375 20.082031 L 42 20.082031 L 42 20 L 24 20 L 24 28 L 35.304688 28 C 34.511719 30.238281 33.070313 32.164063 31.214844 33.570313 C 31.21875 33.570313 31.21875 33.570313 31.21875 33.570313 L 37.410156 38.808594 C 36.972656 39.203125 44 34 44 24 C 44 22.660156 43.863281 21.351563 43.609375 20.082031 Z " style={{ fill: "rgb(25, 118, 210)" }}></path>
                            </svg>
                            <span>Tiếp tục với Google</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default RegisterPage;