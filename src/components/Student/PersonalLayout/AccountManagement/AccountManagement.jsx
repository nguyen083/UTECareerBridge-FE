import { Flex, Form, Input, Button, message } from "antd";
import BoxContainer from "../../../Generate/BoxContainer";
import { changePassword } from "../../../../services/apiService";
import { useState } from "react";

const AccountManagement = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const onFinish = (values) => {
        setLoading(true);
        changePassword(values).then(res => {
            if (res.status === 'OK') {
                form.resetFields();
                message.success(res.message);
            } else {
                message.error(res.message);
            }
        }).catch(err => {
            message.error(err);
        }).finally(() => {
            setLoading(false);
        })
    }
    return (
        <Flex vertical gap={8}>
            <BoxContainer className="box_shadow">
                <div className="title1">Đổi mật khẩu</div>
            </BoxContainer>
            <BoxContainer className="box_shadow">
                <Form form={form} onFinish={onFinish} layout="horizontal" size="large" requiredMark={false} autoComplete="false"
                    labelCol={{
                        md: { span: 4 },
                        span: 24
                    }}
                    wrapperCol={{
                        md: { span: 10 },
                        span: 24
                    }}>
                    <Form.Item label="Mật khẩu hiện tại" name="oldPassword"
                        rules={
                            [{
                                required: true,
                                message: 'Vui lòng nhập mật khẩu hiện tại!'
                            }]
                        } validateTrigger={['onBlur']}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="Mật khẩu mới" name="newPassword"
                        rules={
                            [{
                                required: true,
                                message: 'Vui lòng nhập mật khẩu mới!'
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
                            }]
                        } validateFirst validateTrigger={['onBlur']}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="Nhập lại mật khẩu mới" name="confirmPassword"
                        rules={
                            [{
                                required: true,
                                message: 'Vui lòng nhập lại mật khẩu mới!'
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('new_password') !== value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),]} validateFirst validateTrigger={['onBlur']
                            }>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item wrapperCol={{
                        offset: 21,
                    }}>
                        <Button htmlType="submit" type="primary" loading={loading}>Lưu</Button>
                    </Form.Item>
                </Form>
            </BoxContainer>
        </Flex>
    )
}

export default AccountManagement;