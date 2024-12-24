import { Button, Divider, Empty, Flex, Form, List, Tag, Typography, Modal, Input, Row, Col, InputNumber, Select, DatePicker, message, Dropdown, Menu, } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import { useState, useEffect } from "react";
import './Coupon.scss'
import { createCoupon, deleteCoupon, getAllCoupon, updateCoupon } from "../../../services/apiService";
import { CalendarOutlined, DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { RiDiscountPercentLine } from "react-icons/ri";
import dayjs from 'dayjs';
const { Text } = Typography;
const CouponList = ({ fetch, setFetch }) => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [couponSelected, setCouponSelected] = useState(null);
    const fetchCoupons = async () => {
        setLoading(true);
        try {
            getAllCoupon().then((response) => {
                if (response && response.data) {
                    const transformedCoupons = response.data.couponList.map((coupon) => ({
                        ...coupon,
                        key: coupon.couponId,
                        id: coupon.couponId,
                        code: coupon.couponCode,
                        discount: coupon.discount,
                        amount: coupon.amount,
                        description: coupon.description,
                        expiredAt: coupon.expiredAt,
                        maxUsage: coupon.maxUsage,
                        active: coupon.active
                    }));
                    setCoupons(transformedCoupons);
                } else {
                    setCoupons([]);
                }
            });
        } catch (error) {
            console.error("Error fetching coupons:", error);
        } finally {
            setLoading(false);
            setFetch(false);
        }
    }
    useEffect(() => {
        fetchCoupons();
    }, [fetch === true]);
    useEffect(() => {
        setCouponSelected(null);
    }, [open === false]);
    const handleEditServicePackage = (coupon) => {
        coupon.expiredAt = dayjs(coupon.expiredAt);
        setCouponSelected(coupon);
        setOpen(true);
    }
    const handleDeleteServicePackage = (coupon) => {
        deleteCoupon(coupon.id).then((res) => {
            if (res.status === 'OK') {
                message.success(res.message);
            }
            else {
                message.error('Xoá mã giảm giá không thành công');
            }
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setFetch(true);
        });
    }
    return (
        <>
            <List
                loading={loading}
                locale={{ emptyText: <Empty description="Không có mã giảm giá nào" /> }}
                dataSource={coupons}
                renderItem={(coupon) => (
                    <List.Item
                        key={coupon.key}
                        actions={[
                            <Dropdown
                                overlay={
                                    <Menu>
                                        <Menu.Item key="2" onClick={() => handleEditServicePackage(coupon)}>
                                            <Button icon={<EditOutlined />} type="link" color="primary" >Chỉnh sửa</Button>
                                        </Menu.Item>
                                        <Menu.Item key="3" onClick={() => { handleDeleteServicePackage(coupon) }}>
                                            <Button icon={<DeleteOutlined />} type="link" danger >Xóa</Button>
                                        </Menu.Item>
                                    </Menu >
                                }
                                trigger={['click']}
                            >
                                <MoreOutlined className="f-20 border-1" />
                            </Dropdown >
                        ]}
                        className="coupon-list-item box_shadow border rounded border-warning my-3 py-0"
                    >
                        <List.Item.Meta
                            className='d-flex align-items-stretch'
                            avatar={
                                <div className="voucher-left rounded-start">
                                    <div className="voucher-label"> <Flex align="center" gap={5}><RiDiscountPercentLine size={20} /> Voucher</Flex></div>
                                </div>}
                            title={
                                <>
                                    <Text strong>
                                        Giảm {coupon.discount}%</Text>
                                </>
                            }
                            description={
                                <div className='ps-1'>
                                    <p>Mã: <Tag color="orange">{coupon.code}</Tag></p>
                                    <p>{coupon.description}</p>
                                    <Flex align="center">
                                        <p>Còn lại: {coupon.amount}</p> <Divider type="vertical" />
                                        <p> <CalendarOutlined /> Ngày hết hạn: {new Date(coupon.expiredAt).toLocaleDateString('vi-VN').split(' ')[0]}</p>
                                    </Flex>
                                </div>
                            }
                        />
                    </List.Item >
                )}
            />
            < ModalCreateCoupon open={open} setOpen={setOpen} setFetch={setFetch} item={couponSelected} />
        </>
    )
}
const ModalCreateCoupon = ({ open, setOpen, setFetch, item = null }) => {
    const [form] = Form.useForm();
    const [coupon, setCoupon] = useState(null);
    const handleCancel = () => {
        form.resetFields();
        form.setFieldValue(null);
        setCoupon(null);
        setOpen(false);
    }

    const disablePastDates = (current) => {
        // Chỉ cho phép chọn các ngày từ hôm nay trở đi
        return current && current < dayjs().startOf('day');
    };
    useEffect(() => {
        if (item) {
            console.log(item);
            setCoupon(item);
            form.setFieldsValue(item);
        }
    }, [item]);
    const handleFinish = (values) => {
        values.couponCode = values.couponCode.toUpperCase();
        values.expiredAt = values.expiredAt.format('YYYY-MM-DDTHH:mm:ss');
        if (coupon) {
            updateCoupon(coupon.id, values).then((res) => {
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
            console.log(values);
            createCoupon(values).then((res) => {
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
                title={coupon ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá mới"}
                open={open}
                onCancel={handleCancel}
                okText={coupon ? "Cập nhật" : "Tạo"}
                cancelText="Hủy"
                onOk={() => form.submit()}
            >
                <Form
                    size="large"
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    initialValues={coupon}
                >
                    <Form.Item
                        name="couponCode"
                        label="Mã giảm giá"
                        rules={[{ required: true, message: "Vui lòng nhập mã giảm giá!" }]}
                    >
                        <Input
                            style={{ textTransform: 'uppercase' }}
                        />
                    </Form.Item>
                    <Row gutter={[16]}>
                        <Col span={12}>
                            <Form.Item
                                name="amount"
                                label="Số lượng"
                                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
                            >
                                <InputNumber
                                    min={0}
                                    className="w-100"
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="discount"
                                label="Mức giảm giá"
                                rules={[{ required: true, message: "Vui lòng nhập mức giảm giá!" }]}
                            >
                                <InputNumber min={1} className="w-100" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>

                        <Col span={12}><Form.Item
                            name="maxUsage"
                            label="Số lần sử dụng tối đa"
                            rules={[{ required: true, message: "Vui lòng nhập số lần sử dụng tối đa!" }]}>
                            <InputNumber min={1} className="w-100" />
                        </Form.Item></Col>
                        <Col span={12}><Form.Item
                            name="expiredAt"
                            label="Ngày hết hạn"
                            rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn!" }]}
                        >
                            <DatePicker className="w-100" allowClear disabledDate={disablePastDates} />
                        </Form.Item></Col>
                    </Row>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    {coupon && <Form.Item
                        name="active"
                        label="Trạng thái"
                    >
                        <Select
                            placeholder="Chọn trạng thái"
                            className="w-100">
                            <Select.Option value={true}>Hoạt động</Select.Option>
                            <Select.Option value={false}>Khóa</Select.Option>
                        </Select>
                    </Form.Item>}
                </Form>
            </Modal>
        </>
    );

}
const Coupon = () => {
    const [open, setOpen] = useState(false);
    const [fetch, setFetch] = useState(false);

    return (
        <>
            <BoxContainer>
                <div className="title1">Mã giảm giá</div>
            </BoxContainer>
            <BoxContainer>
                <Flex align="center" justify="end" gap={20}>
                    <Button icon={<PlusOutlined />} onClick={() => { setOpen(true) }}>Tạo mã giảm giá mới</Button>
                </Flex>
                <CouponList fetch={fetch} setFetch={setFetch} />
            </BoxContainer>
            <ModalCreateCoupon open={open} setOpen={setOpen} setFetch={setFetch} />
        </>
    )
}
export default Coupon;