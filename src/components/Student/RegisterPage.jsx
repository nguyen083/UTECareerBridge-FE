// import { useEffect, useState } from "react";
import "./RegisterPage.scss";
import React, { useState } from 'react';
import { Form, Input, Space, Button, DatePicker, Checkbox, Radio, Typography, Row, Col, message } from 'antd';
import { studentRegister } from "../../services/apiService";
import { Link } from "react-router-dom";

const { Title } = Typography;

const RegisterPage = () => {
    const [form] = Form.useForm();
    const gender = 0; // giới tính mặc định
    const [isChecked, setIsChecked] = useState(false);
    const [DoB, setDoB] = useState('');



    const onChange = (date, dateString) => {
        setDoB(dateString);
    };

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };
    const handleLogin = async (values) => {
        // Call API
        console.log(values);
        let res = await studentRegister({ ...values, dob: DoB });
        if (res.status === "CREATED") {
            message.success(res.message);
        } else {
            message.error(res.message);
        }
    }

    return (
        <div className="d-flex">
            <div className="image col-lg-5 d-none d-lg-block">
            </div>
            <div className="col-lg-7 col-12 parent-register-form">
                <div className="d-block mx-auto p-md-5 p-2 shadow register-form">
                    <div className="title d-block">
                        <Title level={3} className="title d-block text-center mb-4">Đăng Ký Tài Khoản</Title>
                    </div>
                    <div>
                        <Form size="large" form={form} name="validateOnlyform2" layout="vertical" autoComplete="off" onFinish={handleLogin} initialValues={{ gender: gender }}>
                            <Row gutter={[8, 8]}>
                                <Col span={12}>
                                    <Form.Item name="first_name" label="Tên"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập tên của bạn',
                                            },
                                            {
                                                pattern: new RegExp(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]*$/),
                                                message: 'Tên không hợp lệ'
                                            }
                                        ]} validateTrigger={['onBlur']}>
                                        <Input placeholder="Nhập tên của bạn" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="last_name" label="Họ"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập họ của bạn',
                                            },
                                            {
                                                pattern: new RegExp(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]*$/),
                                                message: 'Họ không hợp lệ'
                                            }
                                        ]} validateTrigger={['onBlur']}>
                                        <Input placeholder="Nhập họ của bạn" />
                                    </Form.Item></Col>
                                <Form.Item name="gender" layout='vertical' className="col-12 col-md-6 mt-0 mb-0" label="Giới tính" >
                                    <Radio.Group value={gender} className='mb-0'>
                                        <Space direction="horizontal">
                                            <Radio value={0}>Nam</Radio>
                                            <Radio value={1}>Nữ</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item name="dob" className="col-12 col-md-6 mt-0" label="Ngày sinh" rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập ngày sinh của bạn',
                                    },
                                ]} validateTrigger={['onChange']}>
                                    <DatePicker onChange={onChange} className='form-control' format={"DD/MM/YYYY"} placeholder="Chọn ngày sinh" />
                                </Form.Item>
                                <Form.Item name="phone_number" className="col-12 mt-0" label="Số điện thoại"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập số điện thoại của bạn',
                                        },
                                        {
                                            pattern: new RegExp(/^(0[3|5|7|8|9])[0-9]{8}$/),
                                            message: 'Số điện thoại không hợp lệ'
                                        }
                                    ]}
                                    validateTrigger={['onBlur']}>
                                    <Input placeholder="Nhập số điện thoại của bạn" />
                                </Form.Item>
                                <Form.Item name="email" className="col-12 mt-0" label="Email"
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
                                    <Input placeholder="Nhập email của bạn" />
                                </Form.Item>
                                <Form.Item name="password" className="col-12 mt-0" label="Mật khẩu"
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
                                    <Input.Password className="form-control d-flex" placeholder="Nhập mật khẩu của bạn" />
                                </Form.Item>
                                <Form.Item name="retype_password" className="col-12 mt-0" label="Xác nhận mật khẩu"
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
                                    <Input.Password className="form-control d-flex" placeholder="Nhập mật khẩu xác nhận" />
                                </Form.Item>
                            </Row>
                            <Form.Item
                                className="col-12"
                                valuePropName="checked"
                                wrapperCol={{
                                    offset: 1,
                                }}

                            >
                                <Checkbox onChange={handleCheckboxChange}>Bạn đã đọc và đồng ý với các <a href="/#">điều khoản và điều kiện</a> của chúng tôi
                                </Checkbox>
                            </Form.Item>
                            <Form.Item>
                                <Button className=" py-3 d-flex" disabled={!isChecked} style={{ width: "100%", fontSize: "1rem" }} type="primary" htmlType="submit">Đăng ký</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className="text-center mt-3 mb-3"><p className="fst-italic text-decoration-underline">Hoặc</p></div>
                    <div className="google-btn">
                        <Link className="text-decoration-none" to="/home">Trở về trang chủ</Link>
                    </div>
                </div>
            </div>
        </div >
    );
}
export default RegisterPage;