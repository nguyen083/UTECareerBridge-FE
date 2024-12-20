import { Button, Divider, Empty, Flex, Form, List, Tag, Typography } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import { useState, useEffect } from "react";
import './Coupon.scss'
import { getAllCoupon } from "../../../services/apiService";
import { CalendarOutlined, PlusOutlined } from "@ant-design/icons";
import { RiDiscountPercentLine } from "react-icons/ri";
const { Text } = Typography;
const CouponList = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
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
        }
    }
    useEffect(() => {
        fetchCoupons();
    }, [pageSize, currentPage]);
    const handleChangePage = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
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
                        actions={[]}
                        className="coupon-list-item border rounded border-warning my-3 py-0"
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
        </>
    )
}
const ModalCreateCoupon = ({ open, setOpen, setFetch, item = null }) => {
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
const Coupon = () => {
    return (
        <>
            <BoxContainer>
                <div className="title1">Mã giảm giá</div>
            </BoxContainer>
            <BoxContainer>
                <Flex align="center" justify="end" gap={20}>
                    <Button icon={<PlusOutlined />} onClick={() => { setOpen(true) }}>Tạo mã giảm giá mới</Button>
                </Flex>
                <CouponList />
            </BoxContainer>
        </>
    )
}
export default Coupon;