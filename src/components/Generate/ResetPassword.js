import React, { useEffect, useState } from "react";
import { Button, Form, Input, Space } from 'antd';
import { useLocation } from 'react-router-dom';
import "./ResetPassword.scss";
import { userResetPassword } from "../../services/apiService";
import { toast } from "react-toastify";


const ResetPassword = () => {

    const [email, setEmail] = useState("");
    const [submit, setSubmit] = useState(false);
    const [form] = Form.useForm();
    const location = useLocation();
    const [message, setMessage] = useState("");
    let token = "";
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        token = queryParams.get('token');
        setEmail(queryParams.get('email'));
    }, []);

    const onFinish = async (values) => {
        const res = await userResetPassword(token, values.password);
        // Gọi API để cập nhật mật khẩu mới cho người dùng abc@gmail
        if (res.status === 'OK') {
            setMessage(res.message);
            toast.success("Đặt lại mật khẩu thành công");
            setSubmit(true);
        }
        else {
            toast.error("Đặt lại mật khẩu thất bại. Vui long thử lại sau");
        }

    };
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
                    <div className="form-group row g-3">
                        <Form.Item className="col-12"
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


                        <Form.Item className="col-12"
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
                    </div>
                    <Form.Item>
                        <Space className="d-flex justify-content-end mt-3">
                            <Button className="font-size" type="primary" htmlType="submit">Tiếp tục</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
            <div className={`message ${!submit && "d-none"}`}>
                {message}
            </div>
        </div>
    );
};
export default ResetPassword;