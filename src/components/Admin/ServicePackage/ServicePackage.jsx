import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import BoxContainer from "../../Generate/BoxContainer";
import { Button, Card, Col, Divider, Dropdown, Empty, Flex, Form, Input, InputNumber, List, Menu, message, Modal, Row, Select, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import './ServicePackage.scss';
import { createServicePackage, deleteServicePackage, getAllPackages, updateServicePackage } from "../../../services/apiService";
import { use } from "react";

const { Text } = Typography;
const ModalCreateServicePackage = ({ open, setOpen, setFetch, item = null }) => {
    const [form] = Form.useForm();
    const [service, setService] = useState(null);
    const handleCancel = () => {
        form.setFieldValue(null);
        setService(null);
        setOpen(false);
    }


    useEffect(() => {
        if (item) {
            setService(item);
            form.setFieldsValue(item);
        }
    }, [item]);
    const handleFinish = (values) => {
        values.packageName = values.packageName.toUpperCase();

        if (service) {
            updateServicePackage(service.packageId, values).then((res) => {
                if (res.status === 'OK') {
                    message.success(res.message);
                }
                else {
                    message.error(res.message);
                }
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                handleCancel();
                setFetch(true);
            });

        } else {
            createServicePackage(values).then((res) => {
                if (res.status === 'OK') {
                    message.success(res.message);
                }
                else {
                    message.error(res.message);
                }
            }).catch((err) => {
                console.log(err);
            }
            ).finally(() => {
                handleCancel();
                setFetch(true);
            });
        }





    }
    return (
        <>

            <Modal
                width={800}
                title={item ? "Chỉnh sửa gói dịch vụ" : "Tạo gói dịch vụ mới"}
                open={open}
                onCancel={handleCancel}
                okText={item ? "Cập nhật" : "Tạo"}
                cancelText="Hủy"
                onOk={() => form.submit()}
            >
                <Form
                    size="large"
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    initialValues={service}
                >
                    <Form.Item
                        name="packageName"
                        label="Tên gói dịch vụ"
                        rules={[{ required: true, message: "Vui lòng nhập tên gói dịch vụ!" }]}
                    >
                        <Input
                            style={{ textTransform: 'uppercase' }}
                        />
                    </Form.Item>
                    <Row gutter={[16]}>
                        <Col span={12}>
                            <Form.Item
                                name="price"
                                label="Giá"
                                rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                            >
                                <InputNumber
                                    min={0}
                                    className="w-100"
                                    suffix="₫"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="duration"
                                label="Thời hạn (tháng)"
                                rules={[{ required: true, message: "Vui lòng nhập thời gian!" }]}
                            >
                                <InputNumber min={1} className="w-100" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="amount"
                        label="Số lượng"
                        rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
                    >
                        <InputNumber min={1} className="w-100" />
                    </Form.Item>
                    <Form.Item
                        name="featureId"
                        label="Tính năng"
                        rules={[{ required: true, message: "Vui lòng chọn tính năng!" }]}
                    >
                        <Select placeholder="Vui lòng chọn tính năng" allowClear>
                            <Select.Option value={1}>Đăng tin tuyển dụng không giới hạn</Select.Option>
                            <Select.Option value={2}>Ưu tiên hiển thị tin tuyển dụng</Select.Option>
                            <Select.Option value={3}>Gửi thông báo ứng viên phù hợp</Select.Option>
                            <Select.Option value={4}>Đăng tin tuyển dụng với nhãn hot</Select.Option>
                            <Select.Option value={5}>Truy cập vào ngân hàng CV</Select.Option>
                            <Select.Option value={6}>Đăng tin tuyển dụng gấp</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
const ListServicePackage = ({ fetch, setFetch }) => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = () => {
        setLoading(true);
        getAllPackages().then((res) => {
            setData(res.data);
            setLoading(false);
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setLoading(false);
            setFetch(false);
        });
    }
    useEffect(() => {
        fetchData();
    }, [fetch === true]);
    useEffect(() => {
        setItem(null);
    }, [open === false]);
    useEffect(() => {
        if (item !== null) {
            setOpen(true);
        }
    }, [item]);
    const handleEditServicePackage = (item) => {
        setItem(item);
    }
    const handleDeleteServicePackage = (item) => {
        Modal.confirm({
            centered: true,
            title: "Xác nhận xóa",
            content: "Bạn có chắc chắn muốn xóa gói dịch vụ này?",
            okType: 'danger',
            okText: 'Xóa',
            onOk: () => {
                deleteServicePackage(item.packageId).then((res) => {
                    if (res.status === 'OK') {
                        message.success(res.message);
                        setFetch(true);
                    }
                    else {
                        message.error(res.message);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
        });
    }
    return (
        <>
            <List
                className="service-package-list"
                loading={loading}
                style={{ marginTop: 20 }}
                split={false}
                locale={{ emptyText: <Empty description="Không tìm thấy gói dịch vụ" /> }}
                itemLayout="horizontal"
                dataSource={data}
                pagination={{
                    pageSize: 10, // Số lượng mục trên mỗi trang
                    total: data.length, // Tổng số mục
                }}
                renderItem={(item) => (
                    <Card
                        size="small"
                        className="voucher-card-admin box_shadow">
                        <List.Item actions={[
                            <Dropdown
                                overlay={
                                    <Menu>
                                        <Menu.Item key="2">
                                            <Button icon={<EditOutlined />} type="link" color="primary" onClick={() => handleEditServicePackage(item)}>Chỉnh sửa</Button>
                                        </Menu.Item>
                                        <Menu.Item key="3" onClick={() => { handleDeleteServicePackage(item) }}>
                                            <Button icon={<DeleteOutlined />} type="link" danger >Xóa</Button>
                                        </Menu.Item>
                                    </Menu>
                                }
                                trigger={['click']}
                            >
                                <MoreOutlined className="f-20 border-1" />
                            </Dropdown>
                        ]}>
                            <List.Item.Meta
                                className="voucher-meta"
                                avatar={<Flex className="h-100 voucher-flex" align="center" justify="center">
                                    <Text className="voucher-avatar">{item.packageName}</Text>
                                </Flex>}
                                description={
                                    <>
                                        <Text className="fw-bold voucher-title">Giá:&nbsp;</Text> <Text className="salary f-16">{item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
                                        <br />
                                        <Text className="fw-bold voucher-title">Tính năng:&nbsp;</Text> <Text>{item.featureName}</Text>
                                        <br />
                                        <Text className="fw-bold voucher-title">Mô tả:&nbsp;</Text> <Text>{item.description}</Text>
                                        <br />
                                        <Flex align="center">
                                            <Text className="fw-bold voucher-title">Thời hạn:&nbsp;</Text> <Text>{item.duration} tháng </Text>
                                            <Divider type="vertical" />
                                            <Text className="fw-bold voucher-title">Số lượng bài đăng:&nbsp;</Text> <Text>{item.amount}</Text>
                                        </Flex>
                                    </>
                                }
                            />
                        </List.Item >
                    </Card>

                )}
            />
            <ModalCreateServicePackage open={open} setOpen={setOpen} setFetch={setFetch} item={item} />
        </>
    );
}
const ServicePackage = () => {
    const [open, setOpen] = useState(false);
    const [fetch, setFetch] = useState(false);

    return (
        <>
            <BoxContainer>
                <Text className="title1">Gói dịch vụ</Text>
            </BoxContainer>
            <BoxContainer>
                <Flex align="center" justify="end" gap={20}>
                    <Button icon={<PlusOutlined />} onClick={() => { setOpen(true) }}>Tạo gói dịch vụ mới</Button>
                </Flex>
                <ListServicePackage fetch={fetch} setFetch={setFetch} />
            </BoxContainer>
            <ModalCreateServicePackage open={open} setOpen={setOpen} setFetch={setFetch} />
        </>

    );
}
export default ServicePackage;