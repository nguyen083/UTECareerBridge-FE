import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, TimePicker, InputNumber, Button, Select, Row, Col, Modal, message } from "antd";
import { UploadImage } from "../../Student/Component/UploadAvatar";
import { DeleteOutlined } from "@ant-design/icons";
import { createEvent, getEventDetail, updateEvent } from "../../../services/apiService";
import dayjs from "dayjs";
import { deleteImageFromCloudinaryByLink } from "../../../services/uploadCloudary";
import CustomizeQuill from "../../Generate/CustomizeQuill";

const CreateEventPage = ({ open, setOpen, setIsFetching, item = null }) => {
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

                {
                    eventDetail.eventImage !== formattedValues.eventImage && deleteImageFromCloudinaryByLink(eventDetail.eventImage, 'image', 'admin/event').then((res) => {
                        console.log(res);
                    });
                }
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
            title={item ? "Chỉnh sửa Sự Kiện" : "Tạo Sự Kiện mới"} open={open} onCancel={handleCancel} okText={item ? "Cập nhật" : "Tạo"} cancelText="Hủy" onOk={() => form.submit()}>
            <Form
                initialValues={eventDetail}
                size="large"
                form={form}
                onFinish={handleFinish}
                layout="vertical"
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="Tên Sự Kiện" name="eventTitle"
                            rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Loại Sự Kiện" name="eventType" placeholder="Chọn loại sự kiện"
                            rules={[{ required: true, message: 'Vui lòng chọn loại sự kiện!' }]}
                        >
                            <Select>
                                <Select.Option value="SEMINAR">Hội thảo</Select.Option>
                                <Select.Option value="CONFERENCE">Hội nghị</Select.Option>
                                <Select.Option value="WORKSHOP">Hội thảo chuyên đề</Select.Option>
                                <Select.Option value="CAREER_FAIR">Hội chợ việc làm</Select.Option>
                                <Select.Option value="WEBINAR">Hội thảo trực tuyến</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col >
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="Thời gian tổ chức" name="eventDate" placeholder="Chọn thời gian tổ chức"
                            rules={[{ required: true, message: 'Vui lòng chọn thời gian tổ chức!' }]}
                        >
                            <DatePicker className="w-100" showTime />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Số lượng người tối đa" name="maxParticipants"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng người tối đa!' }]}
                        >
                            <InputNumber min={0} className="w-100" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item label="Địa Điểm tổ chức" name="eventLocation"
                            rules={[{ required: true, message: 'Vui lòng nhập địa điểm tổ chức!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row >
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item label="Mô Tả Sự Kiện" name="eventDescription"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả sự kiện!' }]}
                        >
                            <CustomizeQuill />
                        </Form.Item>
                    </Col>
                </Row>


                <Form.Item
                    label="Hình Ảnh Sự Kiện"
                    name="eventImage"
                    tooltip="Hình ảnh sự kiện sẽ được hiển thị trên trang chủ"
                    rules={[{ required: true, message: 'Vui lòng chọn hình ảnh sự kiện!' }]}
                >
                    <UploadImage />
                </Form.Item>
                <Form.Item label="Danh mục sự kiện" required>
                    <Form.List
                        name="timeline"
                        rules={[{ required: true, message: 'Vui lòng thêm danh mục sự kiện!' }]}

                    >
                        {(fields, { add, remove }) => (
                            <div className="border border-1 rounded-2 p-2">

                                {fields.map(({ key, fieldKey, name, field }) => (
                                    <Row gutter={24} key={key} align="top" justify="space-between" >
                                        <Col span={7}>

                                            <Form.Item
                                                label="Tiêu đề"
                                                name={[name, 'timelineTitle']}
                                                fieldKey={[fieldKey, 'timelineTitle']}
                                                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={10}>
                                            <Form.Item
                                                label="Mô tả"
                                                name={[name, 'timelineDescription']}
                                                fieldKey={[fieldKey, 'timelineDescription']}
                                                rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                                            >
                                                <Input.TextArea />
                                            </Form.Item>
                                        </Col>
                                        <Col span={5}>
                                            <Form.Item
                                                label="Thời gian"
                                                name={[name, 'timelineStart']}
                                                fieldKey={[fieldKey, 'timelineStart']}
                                                rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
                                            >
                                                <TimePicker format="HH:mm" className="w-100" />
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
                                        Thêm
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
