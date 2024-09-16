import { useState } from "react";
import "./ForgotPassword.scss";
import { Button, Form, Input } from 'antd';
const ForgotPassword = () => {

    const [isSend, setIsSend] = useState(false);
    const [form] = Form.useForm();
    const onSubmit = (values) => {
        console.log('Success:', values);
        setIsSend(true);
    };
    return (
        <div className="form-forgot-password">
            <div className="title">
                Quên mật khẩu
            </div>
            <div className={`notification text-center ${!isSend && "d-none"}`}>
                Chúng tôi đã gửi đường dẫn đặt lại mật khẩu qua email. Kiểm tra hộp thư để tiếp tục.
            </div>
            <div className={`${isSend && "d-none"}`}>
            <div className="description form-text">
                Hãy tạo mật khẩu mới và tiếp tục sử dụng
            </div>
            <Form
                requiredMark={false}
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                autoComplete="off">
                <Form.Item
                    label={<span>Địa chỉ email <span style={{ color: "red" }}> *</span></span>}
                    required
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập địa chỉ email',
                        },
                        {
                            type: 'email',
                            message: 'Email không hợp lệ',
                        }
                    ]}>
                    <Input className="form-control" />
                </Form.Item>
                <Form.Item>
                    <div className="capcha">
                        
                    </div>
                </Form.Item>
                <Form.Item className="d-flex justify-content-end">
                    <Button className="p-3" type="primary" htmlType="submit">Xác nhận</Button>
                </Form.Item>
            </Form>
            </div>
        </div>
    );
};
export default ForgotPassword;