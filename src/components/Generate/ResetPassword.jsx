import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Input, Row, Space, message } from 'antd';
import { useLocation } from 'react-router-dom';
import "./ResetPassword.scss";
import { userResetPassword } from "../../services/apiService";
import COLOR from "../styles/_variables";


const ResetPassword = () => {

    const [email, setEmail] = useState("");
    const [submit, setSubmit] = useState(false);
    const [form] = Form.useForm();
    const location = useLocation();
    const [notice, setNotice] = useState("");
    let token = "";
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        token = queryParams.get('token');
        setEmail(queryParams.get('email'));
    }, []);

    const onFinish = async (values) => {
        const res = await userResetPassword(token, values.password);
        if (res.status === 'OK') {
            setNotice(res.message);
            message.success("Đặt lại mật khẩu thành công");
            setSubmit(true);
        }
        else {
            message.error("Đặt lại mật khẩu thất bại. Vui long thử lại sau");
        }
    };
    return (
        <div className="form-change-password">
            <Card style={{ backgroundColor: COLOR.cardColor }} className="shadow">
                <div className="title" style={{ color: COLOR.textColor }}>
                    Đặt lại mật khẩu
                </div>
                <div className={`${submit && "hidden"}`}>

                    <div className="description form-text">
                        Hãy nhập mật khẩu mới cho người dùng: <span style={{ color: "blue" }}>{email}</span>
                    </div>
                    <Form
                        size="large"
                        name="change-password"
                        requiredMark={false}
                        form={form}
                        onFinish={onFinish}
                        layout="vertical"
                        autoComplete="off">
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label={<span>Mật khẩu mới <span className='text-red-500'> *</span></span>}
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
                                    <Input.Password />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    label={<span>Nhập lại mật khẩu <span className='text-red-500'> *</span></span>}
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
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item>
                            <Space className="flex justify-end mt-3">
                                <Button className="text-base" type="primary" htmlType="submit">Tiếp tục</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
                <div className={`message ${!submit && "hidden"}`}>
                    {notice}
                </div>
            </Card>
        </div>
    );
};
export default ResetPassword;