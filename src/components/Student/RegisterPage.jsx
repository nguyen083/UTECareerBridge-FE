// import { useEffect, useState } from "react";
import "./RegisterPage.scss";
import { useState } from 'react';
import { Form, Input, Space, Button, DatePicker, Checkbox, Radio, Typography, Row, Col, message, Image, Flex } from 'antd';
import { studentRegister } from "../../services/apiService";
import { Link, useNavigate } from "react-router-dom";
import path from "../../constant/path";

const { Title } = Typography;

const RegisterPage = () => {
    const [form] = Form.useForm();
    const gender = 0;
    const [isChecked, setIsChecked] = useState(false);
    const [DoB, setDoB] = useState('');
    const navigate = useNavigate();


    const onChange = (date, dateString) => {
        setDoB(dateString);
    };

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };
    const handleLogin = async (values) => {
       
        console.log(values);
        let res = await studentRegister({ ...values, dob: DoB });
        if (res.status === "CREATED") {
            message.success(res.message);
            navigate('/login');
        } else {
            message.error(res.message);
        }
    }

    return (
        <div className="flex">
            <div className="hidden image lg:w-5/12 lg:block">
            </div>
            <div className="flex w-full min-h-screen my-auto lg:w-7/12 parent-register-form">
                <Flex gap={18} vertical justify="center" align="center" className="my-auto">
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
                    <div className="block p-2 mx-auto shadow-lg md:p-5 register-form">
                        <div className="block title">
                            <Title level={3} className="block mb-4 text-center title">Đăng Ký Tài Khoản</Title>
                        </div>
                        <div>
                            <Form requiredMark={false} size="large" form={form} name="validateOnlyform2" layout="vertical" autoComplete="off" onFinish={handleLogin} initialValues={{ gender: gender }}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item name="first_name" label={<span>Tên <span className='text-red-500'> *</span></span>}
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
                                        <Form.Item name="last_name" label={<span >Họ <span className='text-red-500'> *</span></span>}
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
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="gender" layout='vertical' label={<span>Giới tính <span className='text-red-500'> *</span></span>}>
                                            <Radio.Group value={gender} className='mb-0'>
                                                <Space direction="horizontal">
                                                    <Radio value={0}>Nam</Radio>
                                                    <Radio value={1}>Nữ</Radio>
                                                </Space>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="dob" label={<span>Ngày sinh <span className='text-red-500'> *</span></span>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập ngày sinh của bạn',
                                                },
                                            ]} validateTrigger={['onChange']}>
                                            <DatePicker onChange={onChange} className='w-full' format={"DD/MM/YYYY"} placeholder="Chọn ngày sinh" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="phone_number" label={<span>Số điện thoại <span className='text-red-500'> *</span></span>}
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
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="email" label={<span>Email <span className='text-red-500'> *</span></span>}
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
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item name="password" label={<span>Mật khẩu <span className='text-red-500'> *</span></span>}
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
                                            <Input.Password className="flex form-control" placeholder="Nhập mật khẩu của bạn" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item name="retype_password" label={<span>Xác nhận mật khẩu <span className='text-red-500'> *</span></span>}
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
                                            <Input.Password className="flex form-control" placeholder="Nhập mật khẩu xác nhận" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item
                                    className="w-full"
                                    valuePropName="checked"
                                    wrapperCol={{
                                        offset: 1,
                                    }}

                                >
                                    <Checkbox onChange={handleCheckboxChange} className="italic">Bạn đã đọc và đồng ý với các <a href="/#" className="text-blue-500">điều khoản và điều kiện</a> của chúng tôi
                                    </Checkbox>
                                </Form.Item>
                                <Form.Item>
                                    <Button className="flex py-3 " disabled={!isChecked} style={{ width: "100%", fontSize: "1rem" }} type="primary" htmlType="submit">Đăng ký</Button>
                                </Form.Item>
                            </Form>
                        </div>

                    </div>
                </Flex>

            </div>
        </div >
    );
}
export default RegisterPage;