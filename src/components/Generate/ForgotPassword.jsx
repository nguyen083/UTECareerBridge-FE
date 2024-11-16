import { useState } from "react";
import "./ForgotPassword.scss";
import { Button, Form, Input } from 'antd';
import { userForgotPassword } from "../../services/apiService";
import IconLoading from "./IconLoading";
const ForgotPassword = () => {

    const [isSend, setIsSend] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const onSubmit = async (values) => {
        console.log('Success:', values);
        setLoading(true);
        const res = await userForgotPassword(values);
        console.log(res);
        if (res.status === 'OK') {
            setMessage(res.message);
            setIsSend(true);
        }
        else {
            setMessage("Không tìm thấy thông tin người dùng");
            setIsSend(true);
        };
    }
    return (
        <div className="form-forgot-password">
            <div className="title">
                Quên mật khẩu
            </div>
            <div className={`notification text-center ${!isSend && "d-none"}`}>
                {message}
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
                        <Button className="p-3 font-size" type="primary" htmlType="submit" disabled={loading}><IconLoading time={7} loading={loading} setLoading={setLoading} /> Xác nhận</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};
export default ForgotPassword;