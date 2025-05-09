import BoxContainer from "../../Generate/BoxContainer";
import { Button, Flex, Form, Input, message } from "antd";
import { useTranslation } from "react-i18next";
import CustomizeQuill from "../../Generate/CustomizeQuill";
import { useState } from "react";
import notification from "../../../services/api/notification";
const CreateNotification = () => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [description, setDescription] = useState("");
    
    const onFinish = (values) => {
        notification.createNotification(values).then(() => {
            message.success(t('admin.notification.messages.createSuccess'));
            form.resetFields();
            setDescription("");
        }).catch((error) => {
            console.log(error);
            message.error(t('admin.notification.messages.createError'));
        });
    };

    return (
        <>
            <BoxContainer width='100%' className="shadow-md">
                <div className='title1'>{t('admin.notification.create')}</div>
            </BoxContainer>
            <BoxContainer width='100%' className="shadow-md">
                <Flex vertical gap={20}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        style={{ width: '100%' }}
                    >
                        <Form.Item
                            name="title"
                            label={t('admin.notification.form.title')}
                            rules={[{ required: true, message: t('admin.notification.form.titleRequired') }]}
                        >
                            <Input placeholder={t('admin.notification.form.title')} size="large" />
                        </Form.Item>

                        <Form.Item
                            name="message"
                            label={t('admin.notification.form.description')}
                            rules={[{ required: true, message: t('admin.notification.form.descriptionRequired') }]}
                        >
                            <CustomizeQuill value={description} onChange={setDescription} />
                        </Form.Item>

                        <Flex justify='end' align='center' gap={10}>
                            <Button size="large" type='default' onClick={() => form.resetFields()}>
                                {t('common.cancel')}
                            </Button>
                            <Button size="large" type='primary' htmlType="submit">
                                {t('common.complete')}
                            </Button>
                        </Flex>
                    </Form>
                </Flex>
            </BoxContainer>
        </>
    )
}

export default CreateNotification;
