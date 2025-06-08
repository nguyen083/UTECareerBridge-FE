import {
  Button,
  Divider,
  Empty,
  Flex,
  Form,
  List,
  Tag,
  Typography,
  Modal,
  Input,
  Row,
  Col,
  InputNumber,
  Select,
  DatePicker,
  message,
  Card,
} from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import { useState, useEffect } from "react";
import "./Coupon.scss";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupon,
  updateCoupon,
} from "../../../services/apiService";
import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  TagOutlined,
  PercentageOutlined,
  NumberOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

const CouponList = ({ fetch, setFetch }) => {
  const { t } = useTranslation();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [couponSelected, setCouponSelected] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
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
            active: coupon.active,
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
  };
  useEffect(() => {
    fetchCoupons();
  }, [fetch === true]);
  useEffect(() => {
    setCouponSelected(null);
  }, [open === false]);
  const handleEditCoupon = (coupon) => {
    coupon.expiredAt = dayjs(coupon.expiredAt);
    setCouponSelected(coupon);
    setOpen(true);
  };
  const handleDeleteCoupon = (coupon) => {
    Modal.confirm({
      centered: true,
      title: t("admin.coupon.deleteConfirm.title"),
      content: t("admin.coupon.deleteConfirm.content"),
      okType: "danger",
      okText: t("admin.coupon.deleteConfirm.okText"),
      onOk: () => {
        setDeleteLoading(true);
        deleteCoupon(coupon.id)
          .then((res) => {
            if (res.status === "OK") {
              message.success(res.message);
            } else {
              message.error(t("admin.coupon.deleteError"));
            }
          })
          .catch((err) => {
            console.error(err);
            message.error(t("admin.coupon.deleteError"));
          })
          .finally(() => {
            setFetch(true);
            setDeleteLoading(false);
          });
      },
    });
  };
  return (
    <>
      <List
        loading={loading}
        className="coupon-list"
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 3,
          xl: 3,
          xxl: 4,
        }}
        locale={{ emptyText: <Empty description={t("admin.coupon.empty")} /> }}
        dataSource={coupons}
        pagination={{
          pageSize: 8,
          total: coupons.length,
          showSizeChanger: false,
        }}
        renderItem={(coupon) => (
          <List.Item>
            <Card
              className="coupon-card"
              title={
                <div className="coupon-card-header">
                  <Tag className="discount-tag">
                    <PercentageOutlined />{" "}
                    {t("admin.coupon.discount", {
                      discount: coupon.discount,
                    })}
                  </Tag>
                  <Tag className="code-tag" color="orange">
                    <TagOutlined /> {coupon.code}
                  </Tag>
                </div>
              }
              actions={[
                <Button
                  key={coupon.id}
                  icon={<EditOutlined />}
                  type="link"
                  onClick={() => handleEditCoupon(coupon)}
                >
                  {t("admin.coupon.edit")}
                </Button>,
                <Button
                  key={coupon.id}
                  icon={<DeleteOutlined />}
                  type="link"
                  danger
                  loading={deleteLoading}
                  onClick={() => handleDeleteCoupon(coupon)}
                >
                  {t("admin.coupon.delete")}
                </Button>,
              ]}
            >
              <div className="coupon-status">
                {coupon.active ? (
                  <Tag color="success">{t("admin.coupon.active")}</Tag>
                ) : (
                  <Tag color="error">{t("admin.coupon.inactive")}</Tag>
                )}
              </div>

              <div className="coupon-info">
                <div className="info-item">
                  <InfoCircleOutlined className="info-icon" />
                  <div className="info-content">
                    <Text className="info-value description-text !min-h-11">
                      {coupon.description}
                    </Text>
                  </div>
                </div>

                <Divider style={{ margin: "8px 0" }} />

                <Flex align="center" justify="space-between">
                  <div className="info-item">
                    <NumberOutlined className="info-icon" />
                    <div className="info-content">
                      <Text className="info-label">
                        {t("admin.coupon.remaining")}:
                      </Text>
                      <Text className="info-value amount-value">
                        {coupon.amount}
                      </Text>
                    </div>
                  </div>
                  <div className="info-item">
                    <NumberOutlined className="info-icon" />
                    <div className="info-content">
                      <Text className="info-label">
                        {t("admin.coupon.maxUsage")}:
                      </Text>
                      <Text className="info-value">{coupon.maxUsage}</Text>
                    </div>
                  </div>
                </Flex>

                <div className="info-item expire-item">
                  <CalendarOutlined className="info-icon" />
                  <div className="info-content">
                    <Text className="info-label">
                      {t("admin.coupon.expireDate")}:
                    </Text>
                    <Text className="info-value expire-date">
                      {
                        new Date(coupon.expiredAt)
                          .toLocaleDateString("vi-VN")
                          .split(" ")[0]
                      }
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
      <ModalCreateCoupon
        open={open}
        setOpen={setOpen}
        setFetch={setFetch}
        item={couponSelected}
      />
    </>
  );
};
const ModalCreateCoupon = ({ open, setOpen, setFetch, item = null }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [coupon, setCoupon] = useState(null);
  const handleCancel = () => {
    form.resetFields();
    form.setFieldValue(null);
    setCoupon(null);
    setOpen(false);
  };

  const disablePastDates = (current) => {
    return current && current < dayjs().startOf("day");
  };
  useEffect(() => {
    if (item) {
      setCoupon(item);
      form.setFieldsValue(item);
    }
  }, [item]);
  const handleFinish = (values) => {
    setLoading(true);
    values.couponCode = values.couponCode.toUpperCase();
    values.expiredAt = values.expiredAt.format("YYYY-MM-DDTHH:mm:ss");
    if (coupon) {
      updateCoupon(coupon.id, values)
        .then((res) => {
          if (res.status === "OK") {
            message.success(res.message);
          } else {
            message.error(res.message);
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          handleCancel();
          setFetch(true);
          setLoading(false);
        });
    } else {
      createCoupon(values)
        .then((res) => {
          if (res.status === "OK") {
            message.success(res.message);
          } else {
            message.error(res.message);
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          handleCancel();
          setFetch(true);
        });
    }
  };
  return (
    <>
      <Modal
        width={800}
        title={
          coupon ? t("admin.coupon.editTitle") : t("admin.coupon.createTitle")
        }
        open={open}
        onCancel={handleCancel}
        okText={
          coupon
            ? t("admin.coupon.form.buttons.update")
            : t("admin.coupon.form.buttons.create")
        }
        cancelText={t("admin.coupon.form.buttons.cancel")}
        onOk={() => form.submit()}
        confirmLoading={loading}
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
            label={t("admin.coupon.form.code.label")}
            rules={[
              { required: true, message: t("admin.coupon.form.code.required") },
            ]}
          >
            <Input style={{ textTransform: "uppercase" }} />
          </Form.Item>
          <Row gutter={[16]}>
            <Col span={12}>
              <Form.Item
                name="amount"
                label={t("admin.coupon.form.amount.label")}
                rules={[
                  {
                    required: true,
                    message: t("admin.coupon.form.amount.required"),
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  className="w-full"
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="discount"
                label={t("admin.coupon.form.discount.label")}
                rules={[
                  {
                    required: true,
                    message: t("admin.coupon.form.discount.required"),
                  },
                ]}
              >
                <InputNumber min={1} className="w-full" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="maxUsage"
                label={t("admin.coupon.form.maxUsage.label")}
                rules={[
                  {
                    required: true,
                    message: t("admin.coupon.form.maxUsage.required"),
                  },
                ]}
              >
                <InputNumber min={1} className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="expiredAt"
                label={t("admin.coupon.form.expiredAt.label")}
                rules={[
                  {
                    required: true,
                    message: t("admin.coupon.form.expiredAt.required"),
                  },
                ]}
              >
                <DatePicker
                  className="w-full"
                  allowClear
                  disabledDate={disablePastDates}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label={t("admin.coupon.form.description.label")}
            rules={[
              {
                required: true,
                message: t("admin.coupon.form.description.required"),
              },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          {coupon && (
            <Form.Item
              name="active"
              label={t("admin.coupon.form.status.label")}
            >
              <Select
                placeholder={t("admin.coupon.form.status.placeholder")}
                className="w-full"
              >
                <Select.Option value={true}>
                  {t("admin.coupon.form.status.active")}
                </Select.Option>
                <Select.Option value={false}>
                  {t("admin.coupon.form.status.inactive")}
                </Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};
const Coupon = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [fetch, setFetch] = useState(false);

  return (
    <>
      <BoxContainer className="shadow-md">
        <Flex align="center" justify="space-between">
          <Text className="title1">{t("admin.coupon.title")}</Text>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpen(true);
            }}
          >
            {t("admin.coupon.createNew")}
          </Button>
        </Flex>
        <Divider />
        <CouponList fetch={fetch} setFetch={setFetch} />
      </BoxContainer>
      <ModalCreateCoupon open={open} setOpen={setOpen} setFetch={setFetch} />
    </>
  );
};
export default Coupon;
