import { useEffect, useState } from "react";
import { Form, Input, DatePicker, TimePicker, InputNumber, Button, Select, Row, Col, Modal, message } from "antd";
import { UploadImage } from "../../Student/Component/UploadAvatar";
import { DeleteOutlined } from "@ant-design/icons";
import { createEvent, getEventDetail, updateEvent } from "../../../services/apiService";
import dayjs from "dayjs";
import { deleteImageFromCloudinaryByLink } from "../../../services/uploadCloudary";
import CustomizeQuill from "../../Generate/CustomizeQuill";
import { useTranslation } from 'react-i18next';

const CreateEventPage = ({ open, setOpen, setIsFetching, item = null }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [eventDetail, setEventDetail] = useState({});
    const fetchEventDetail = async () => {
        getEventDetail(item.eventId).then((res) => {
            setEventDetail(
                {
                    ...res.data,
                    eventDate: dayjs(res.data.eventDate, 'DD/MM/YYYY HH:mm:ss'),
                    timeline: res.data.timeline.map(t => ({
                        ...t,
                        timelineStart: dayjs(t.timelineStart, 'HH:mm')
                    }))
                });
        }).catch((err) => {
            message.error(err.message);
        });
    }
    useEffect(() => {
        if (item) {
            fetchEventDetail();
        }
    }, [item]);

    useEffect(() => {
        if (eventDetail && Object.keys(eventDetail).length > 0) {
            form.setFieldsValue(eventDetail);
        }
    }, [eventDetail]);

    const handleFinish = (values) => {
        const formattedValues = {
            ...values,
            eventDate: values.eventDate.format('YYYY-MM-DDTHH:mm:ss'),
            timeline: values.timeline.map(item => ({
                ...item,
                timelineStart: item.timelineStart.format('HH:mm')
            }))
        };
        !item ? createEvent(formattedValues).then((res) => {
            if (res.status === 'CREATED') {
                setOpen(false);
                form.resetFields();
                message.success(res.message);
                setIsFetching(true);
            } else {
                message.error(res.message);
            }
        }).catch((err) => {
            message.error(err.message);
        }) : updateEvent(eventDetail.eventId, formattedValues).then((res) => {
            if (res.status === 'OK') {
                eventDetail.eventImage !== formattedValues.eventImage && deleteImageFromCloudinaryByLink(eventDetail.eventImage, 'image', 'admin/event')
                form.resetFields();
                message.success(res.message);
                setOpen(false);
                setIsFetching(true);

            } else {
                message.error(res.message);
            }
        }).catch((err) => {
            message.error(err.message);
        });
    }
    const handleCancel = () => {
        setOpen(false);
        form.resetFields();
    }
    return (
        <Modal
            width={1500}
            title={item ? t('admin.event.title.edit') : t('admin.event.title.create')} 
            open={open} 
            onCancel={handleCancel} 
            okText={item ? t('admin.event.form.buttons.update') : t('admin.event.form.buttons.create')} 
            cancelText={t('admin.event.form.buttons.cancel')} 
            onOk={() => form.submit()}
        >
            <Form
                initialValues={eventDetail}
                size="large"
                form={form}
                onFinish={handleFinish}
                layout="vertical"
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item 
                            label={t('admin.event.form.fields.eventTitle.label')} 
                            name="eventTitle"
                            rules={[{ required: true, message: t('admin.event.form.fields.eventTitle.required') }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item 
                            label={t('admin.event.form.fields.eventType.label')} 
                            name="eventType" 
                            placeholder={t('admin.event.form.fields.eventType.placeholder')}
                            rules={[{ required: true, message: t('admin.event.form.fields.eventType.required') }]}
                        >
                            <Select>
                                <Select.Option value="SEMINAR">{t('admin.event.form.fields.eventType.options.seminar')}</Select.Option>
                                <Select.Option value="CONFERENCE">{t('admin.event.form.fields.eventType.options.conference')}</Select.Option>
                                <Select.Option value="WORKSHOP">{t('admin.event.form.fields.eventType.options.workshop')}</Select.Option>
                                <Select.Option value="CAREER_FAIR">{t('admin.event.form.fields.eventType.options.careerFair')}</Select.Option>
                                <Select.Option value="WEBINAR">{t('admin.event.form.fields.eventType.options.webinar')}</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item 
                            label={t('admin.event.form.fields.eventDate.label')} 
                            name="eventDate" 
                            placeholder={t('admin.event.form.fields.eventDate.placeholder')}
                            rules={[{ required: true, message: t('admin.event.form.fields.eventDate.required') }]}
                        >
                            <DatePicker className="w-full" showTime />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item 
                            label={t('admin.event.form.fields.maxParticipants.label')} 
                            name="maxParticipants"
                            rules={[{ required: true, message: t('admin.event.form.fields.maxParticipants.required') }]}
                        >
                            <InputNumber min={0} className="w-full" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item 
                            label={t('admin.event.form.fields.eventLocation.label')} 
                            name="eventLocation"
                            rules={[{ required: true, message: t('admin.event.form.fields.eventLocation.required') }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item 
                            label={t('admin.event.form.fields.eventDescription.label')} 
                            name="eventDescription"
                            rules={[{ required: true, message: t('admin.event.form.fields.eventDescription.required') }]}
                        >
                            <CustomizeQuill />
                        </Form.Item>
                    </Col>
                </Row>


                <Form.Item
                    label={t('admin.event.form.fields.eventImage.label')}
                    name="eventImage"
                    tooltip={t('admin.event.form.fields.eventImage.tooltip')}
                    rules={[{ required: true, message: t('admin.event.form.fields.eventImage.required') }]}
                >
                    <UploadImage />
                </Form.Item>
                <Form.Item 
                    label={t('admin.event.form.fields.timeline.label')} 
                    required
                >
                    <Form.List
                        name="timeline"
                        rules={[{ required: true, message: t('admin.event.form.fields.timeline.required') }]}
                    >
                        {(fields, { add, remove }) => (
                            <div className="p-2 border rounded-2">
                                {fields.map(({ key, fieldKey, name }) => (
                                    <Row gutter={24} key={key} align="top" justify="space-between">
                                        <Col span={7}>
                                            <Form.Item
                                                label={t('admin.event.form.fields.timeline.fields.title.label')}
                                                name={[name, 'timelineTitle']}
                                                fieldKey={[fieldKey, 'timelineTitle']}
                                                rules={[{ required: true, message: t('admin.event.form.fields.timeline.fields.title.required') }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={10}>
                                            <Form.Item
                                                label={t('admin.event.form.fields.timeline.fields.description.label')}
                                                name={[name, 'timelineDescription']}
                                                fieldKey={[fieldKey, 'timelineDescription']}
                                                rules={[{ required: true, message: t('admin.event.form.fields.timeline.fields.description.required') }]}
                                            >
                                                <Input.TextArea />
                                            </Form.Item>
                                        </Col>
                                        <Col span={5}>
                                            <Form.Item
                                                label={t('admin.event.form.fields.timeline.fields.time.label')}
                                                name={[name, 'timelineStart']}
                                                fieldKey={[fieldKey, 'timelineStart']}
                                                rules={[{ required: true, message: t('admin.event.form.fields.timeline.fields.time.required') }]}
                                            >
                                                <TimePicker format="HH:mm" className="w-full" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={1}>
                                            <Form.Item label=" ">
                                                <Button size="small" danger onClick={() => remove(name)} icon={<DeleteOutlined />} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item className="my-0">
                                    <Button size="middle" onClick={() => add()}>
                                        {t('admin.event.form.buttons.add')}
                                    </Button>
                                </Form.Item>
                            </div>
                        )}
                    </Form.List>
                </Form.Item>
            </Form >
        </Modal>
    );
};

export default CreateEventPage;
