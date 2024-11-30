import { Button, Form, Input } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import { useSelector } from "react-redux";

const EmployerChangePassword = () => {
    const email = useSelector(state => state.employer.companyEmail);
    const infor = {
        email: email
    }
    const onFinish = (values) => {
        console.log(values);
    };
    return (
        <>
            <BoxContainer>
                <div className="title1">
                    Đổi mật khẩu
                </div>
            </BoxContainer>
            <BoxContainer>
                <Form onFinish={onFinish} layout="horizontal" initialValues={infor} size="large" requiredMark={false} autoComplete="false"
                    labelCol={{
                        md: { span: 4 },
                        span: 24
                    }}
                    wrapperCol={{
                        md: { span: 10 },
                        span: 24
                    }}>
                    <Form.Item label="Email đăng nhập" name="email">
                        <Input disabled />
                    </Form.Item>
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
                    <Form.Item label="Nhập lại mật khẩu mới" name="retypePassword"
                        rules={
                            [{
                                required: true,
                                message: 'Vui lòng nhập lại mật khẩu mới!'
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('new_password') === value) {
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
                        <Button htmlType="submit" type="primary">Lưu</Button>
                    </Form.Item>
                </Form>
            </BoxContainer>
        </>
    );
};
export default EmployerChangePassword;