import { Button, Divider, Empty, Flex, Form, List, Tag, Typography, Modal, Input, Row, Col, InputNumber, Select, DatePicker, message, Dropdown, Menu, } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import { useState, useEffect } from "react";
import './Coupon.scss'
import { createCoupon, deleteCoupon, getAllCoupon, updateCoupon } from "../../../services/apiService";
import { CalendarOutlined, DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { RiDiscountPercentLine } from "react-icons/ri";
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const CouponList = ({ fetch, setFetch }) => {
    const { t } = useTranslation();
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
                message.error(t('admin.coupon.deleteError'));
            }
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            setFetch(true);
        });
    }
    return (
        <>
            <List
                loading={loading}
                locale={{ emptyText: <Empty description={t('admin.coupon.empty')} /> }}
                dataSource={coupons}
                renderItem={(coupon) => (
                    <List.Item
                        key={coupon.key}
                        actions={[
                            <Dropdown
                                key={coupon.key}
                                overlay={
                                    <Menu>
                                        <Menu.Item key="2" onClick={() => handleEditServicePackage(coupon)}>
                                            <Button icon={<EditOutlined />} type="link" color="primary" >{t('admin.coupon.edit')}</Button>
                                        </Menu.Item>
                                        <Menu.Item key="3" onClick={() => { handleDeleteServicePackage(coupon) }}>
                                            <Button icon={<DeleteOutlined />} type="link" danger >{t('admin.coupon.delete')}</Button>
                                        </Menu.Item>
                                    </Menu >
                                }
                                trigger={['click']}
                            >
                                <MoreOutlined className="text-lg" />
                            </Dropdown >
                        ]}
                        className="coupon-list-item shadow border rounded border-warning my-4 !py-0"
                    >
                        <List.Item.Meta
                            className='flex !items-stretch'
                            avatar={
                                <div className="voucher-left rounded-start">
                                    <div className="voucher-label"> <Flex align="center" gap={5}><RiDiscountPercentLine size={20} /> Voucher</Flex></div>
                                </div>}
                            title={
                                <>
                                    <Text strong>
                                    {t('admin.coupon.discount', { discount: coupon.discount })}</Text>
                                </>
                            }
                            description={
                                <div className='ps-1'>
                                    <p>{t('admin.coupon.code')} <Tag className="text-sm font-normal w-fit" color="orange">{coupon.code}</Tag></p>
                                    <p>{coupon.description}</p>
                                    <Flex align="center">
                                        <p>{t('admin.coupon.remaining')} {coupon.amount}</p> <Divider type="vertical" />
                                        <p> <CalendarOutlined />{t('admin.coupon.expireDate')} {new Date(coupon.expiredAt).toLocaleDateString('vi-VN').split(' ')[0]}</p>
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
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [coupon, setCoupon] = useState(null);
    const handleCancel = () => {
        form.resetFields();
        form.setFieldValue(null);
        setCoupon(null);
        setOpen(false);
    }

    const disablePastDates = (current) => {
       
        return current && current < dayjs().startOf('day');
    };
    useEffect(() => {
        if (item) {
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
                console.error(err);
            }).finally(() => {
                handleCancel();
                setFetch(true);
            });

        } else {
            createCoupon(values).then((res) => {
                if (res.status === 'OK') {
                    message.success(res.message);
                }
                else {
                    message.error(res.message);
                }
            }).catch((err) => {
                console.error(err);
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
                title={coupon ? t('admin.coupon.editTitle') : t('admin.coupon.createTitle')}
                open={open}
                onCancel={handleCancel}
                okText={coupon ? t('admin.coupon.form.buttons.update') : t('admin.coupon.form.buttons.create')}
                cancelText={t('admin.coupon.form.buttons.cancel')}
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
                        label={t('admin.coupon.form.code.label')}
                        rules={[{ required: true, message: t('admin.coupon.form.code.required') }]}
                    >
                        <Input
                            style={{ textTransform: 'uppercase' }}
                        />
                    </Form.Item>
                    <Row gutter={[16]}>
                        <Col span={12}>
                            <Form.Item
                                name="amount"
                                label={t('admin.coupon.form.amount.label')}
                                rules={[{ required: true, message: t('admin.coupon.form.amount.required') }]}
                            >
                                <InputNumber
                                    min={0}
                                    className="w-full"
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="discount"
                                label={t('admin.coupon.form.discount.label')}
                                rules={[{ required: true, message: t('admin.coupon.form.discount.required')}]}
                            >
                                <InputNumber min={1} className="w-full" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>

                        <Col span={12}><Form.Item
                            name="maxUsage"
                            label={t('admin.coupon.form.maxUsage.label')}
                            rules={[{ required: true, message: t('admin.coupon.form.maxUsage.required') }]}>
                            <InputNumber min={1} className="w-full" />
                        </Form.Item></Col>
                        <Col span={12}><Form.Item
                            name="expiredAt"
                            label={t('admin.coupon.form.expiredAt.label')}
                            rules={[{ required: true, message: t('admin.coupon.form.expiredAt.required') }]}
                        >
                            <DatePicker className="w-full" allowClear disabledDate={disablePastDates} />
                        </Form.Item></Col>
                    </Row>
                    <Form.Item
                        name="description"
                        label={t('admin.coupon.form.description.label')}
                        rules={[{ required: true, message: t('admin.coupon.form.description.required') }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    {coupon && <Form.Item
                        name="active"
                        label={t('admin.coupon.form.status.label')}
                    >
                        <Select
                            placeholder={t('admin.coupon.form.status.placeholder')}
                            className="w-full">
                            <Select.Option value={true}>{t('admin.coupon.form.status.active')}</Select.Option>
                            <Select.Option value={false}>{t('admin.coupon.form.status.inactive')}</Select.Option>
                        </Select>
                    </Form.Item>}
                </Form>
            </Modal>
        </>
    );

}
const Coupon = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [fetch, setFetch] = useState(false);

    return (
        <>
            <BoxContainer className="shadow-md">
                <div className="title1">{t('admin.coupon.title')}</div>
            </BoxContainer>
            <BoxContainer className="shadow-md">
                <Flex align="center" justify="end" gap={20}>
                    <Button icon={<PlusOutlined />} onClick={() => { setOpen(true) }}>{t('admin.coupon.createNew')}</Button>
                </Flex>
                <CouponList fetch={fetch} setFetch={setFetch} />
            </BoxContainer>
            <ModalCreateCoupon open={open} setOpen={setOpen} setFetch={setFetch} />
        </>
    )
}
export default Coupon;