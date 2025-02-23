import { useState } from "react";
import "./ForgotPassword.scss";
import { Button, Card, Form, Input } from 'antd';
import { userForgotPassword } from "../../services/apiService";
import IconLoading from "./IconLoading";
import COLOR from "../../components/styles/_variables";
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
            <Card style={{ backgroundColor: COLOR.cardColor }} className="shadow">
                <div className="title" style={{ color: COLOR.textColor }}>
                    Quên mật khẩu
                </div>
                <div className={`notification text-center ${!isSend && "hidden"}`}>
                    {message}
                </div>
                <div className={`${isSend && "hidden"}`}>
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
                            label={<span>Địa chỉ email <span className='text-red-500'> *</span></span>}
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
                            <Input className="w-full" />
                        </Form.Item>
                        {/* <Form.Item>
                            <div className="capcha">

                            </div>
                        </Form.Item> */}
                        <Form.Item className="flex justify-end">
                            <Button className="p-3 text-base" type="primary" htmlType="submit" disabled={loading}>
                                <IconLoading time={7} loading={loading} setLoading={setLoading} /> Xác nhận
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Card>
        </div >
    );
};
export default ForgotPassword;