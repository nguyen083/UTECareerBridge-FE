import { useState } from "react";
import "./ForgotPassword.scss";
import { Button, Card, Form, Input } from 'antd';
import { userForgotPassword } from "../../services/apiService";
import IconLoading from "./IconLoading";
import COLOR from "../../components/styles/_variables";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
    const { t } = useTranslation();
    const [isSend, setIsSend] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onSubmit = async (values) => {
        setLoading(true);
        const res = await userForgotPassword(values);
        console.log(res);
        if (res.status === 'OK') {
            setMessage(res.message);
            setIsSend(true);
        }
        else {
            setMessage(t('auth.forgotPassword.userNotFound'));
            setIsSend(true);
        };
    }
    return (

        <div className="form-forgot-password">
            <Card style={{ backgroundColor: COLOR.cardColor }} className="shadow-md">
                <div className="title" style={{ color: COLOR.textColor }}>
                    {t('auth.forgotPassword.title')}
                </div>
                <div className={`notification text-center ${!isSend && "hidden"}`}>
                    {message}
                </div>
                <div className={`${isSend && "hidden"}`}>
                    <div className="description form-text">
                        {t('auth.forgotPassword.description')}
                    </div>
                    <Form
                        requiredMark={false}
                        form={form}
                        layout="vertical"
                        onFinish={onSubmit}
                        size="large"
                        autoComplete="off">
                        <Form.Item
                            label={<span>{t('auth.forgotPassword.emailAddress')} <span className='text-red-500'> *</span></span>}
                            required
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: t('auth.forgotPassword.emailRequired'),
                                },
                                {
                                    type: 'email',
                                    message: t('auth.forgotPassword.invalidEmail'),
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
                                <IconLoading time={7} loading={loading} setLoading={setLoading} /> {t('auth.forgotPassword.confirm')}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Card>
        </div >
    );
};
export default ForgotPassword;