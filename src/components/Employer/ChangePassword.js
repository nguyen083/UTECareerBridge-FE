import React, { useState } from "react";
import { Button, Form, Input, Space } from 'antd';
import "./ChangePassword.scss";
import { FaLongArrowAltLeft } from "react-icons/fa";


const ChangePassword = () => {
    const [email, setEmail] = useState("");
    const [submit, setSubmit] = useState(false);
    const [form] = Form.useForm();
    const CallAPI = () => {
        // Gọi API để lấy thông tin của người dùng abc@gmail
    };
    const onFinish = (values) => {
        console.log(values);
        // Gọi API để cập nhật mật khẩu mới cho người dùng abc@gmail
        // Nhận Response từ API nếu thành công thì hiển thị thông báo và đổi trạng thái submit thành true
        setSubmit(true);
    };
    //CallAPI();
    return (
        <div className="form-change-password">
            <div className="title">
                Đặt lại mật khẩu
            </div>
            <div className={`${submit && "d-none"}`}>

                <div className="description form-text">
                    Hãy nhập mật khẩu mới cho người dùng: <span style={{ color: "blue" }}>{email}</span>
                </div>
                <Form
                    name="change-password"
                    requiredMark={false}
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    autoComplete="off">
                    <Form.Item
                        label={<span>Mật khẩu mới <span style={{ color: "red" }}> *</span></span>}
                        required
                        name="password"
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
                        ]} validateFirst>
                        <Input.Password className="form-control d-flex" />
                    </Form.Item>


                    <Form.Item
                        label={<span>Nhập lại mật khẩu <span style={{ color: "red" }}> *</span></span>}
                        required
                        name="repassword"
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
                        ]} validateFirst>
                        <Input.Password className="form-control d-flex" />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">Tiếp tục</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
            <div className={`btn-back ${!submit && "d-none"}`}>
                     <a href="/login" className="text-decoration-none"><FaLongArrowAltLeft /> Quay lại trang đăng nhập để tiếp tục  </a>
            </div>
        </div>
    );
};
export default ChangePassword;