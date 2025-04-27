import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
  AppstoreOutlined,
  DollarOutlined,
  FieldTimeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import BoxContainer from "../../Generate/BoxContainer";
import {
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  List,
  Menu,
  message,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import "./ServicePackage.scss";
import {
  createServicePackage,
  deleteServicePackage,
  getAllPackages,
  updateServicePackage,
} from "../../../services/apiService";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

const ModalCreateServicePackage = ({
  open,
  setOpen,
  setFetch,
  item = null,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [service, setService] = useState(null);

  const handleCancel = () => {
    form.setFieldValue(null);
    setService(null);
    setOpen(false);
  };

  useEffect(() => {
    if (item) {
      setService(item);
      form.setFieldsValue(item);
    }
  }, [item]);

  const handleFinish = (values) => {
    values.packageName = values.packageName.toUpperCase();

    if (service) {
      updateServicePackage(service.packageId, values)
        .then((res) => {
          if (res.status === "OK") {
            message.success(t("admin.servicePackage.messages.updateSuccess"));
          } else {
            message.error(t("admin.servicePackage.messages.updateError"));
          }
        })
        .catch((err) => {
          console.error(err);
          message.error(t("admin.servicePackage.messages.updateError"));
        })
        .finally(() => {
          handleCancel();
          setFetch(true);
        });
    } else {
      createServicePackage(values)
        .then((res) => {
          if (res.status === "OK") {
            message.success(t("admin.servicePackage.messages.createSuccess"));
          } else {
            message.error(t("admin.servicePackage.messages.createError"));
          }
        })
        .catch((err) => {
          console.error(err);
          message.error(t("admin.servicePackage.messages.createError"));
        })
        .finally(() => {
          handleCancel();
          setFetch(true);
        });
    }
  };

  return (
    <Modal
      width={800}
      title={
        service
          ? t("admin.servicePackage.modal.editTitle")
          : t("admin.servicePackage.modal.createTitle")
      }
      open={open}
      onCancel={handleCancel}
      okText={
        service
          ? t("admin.servicePackage.modal.update")
          : t("admin.servicePackage.modal.create")
      }
      cancelText={t("admin.servicePackage.modal.cancel")}
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
          label={t("admin.servicePackage.modal.form.packageName.label")}
          rules={[
            {
              required: true,
              message: t(
                "admin.servicePackage.modal.form.packageName.required"
              ),
            },
          ]}
        >
          <Input style={{ textTransform: "uppercase" }} />
        </Form.Item>
        <Row gutter={[16]}>
          <Col span={12}>
            <Form.Item
              name="price"
              label={t("admin.servicePackage.modal.form.price.label")}
              rules={[
                {
                  required: true,
                  message: t("admin.servicePackage.modal.form.price.required"),
                },
              ]}
            >
              <InputNumber
                min={0}
                className="w-full"
                suffix="₫"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="duration"
              label={t("admin.servicePackage.modal.form.duration.label")}
              rules={[
                {
                  required: true,
                  message: t(
                    "admin.servicePackage.modal.form.duration.required"
                  ),
                },
              ]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label={t("admin.servicePackage.modal.form.description.label")}
          rules={[
            {
              required: true,
              message: t(
                "admin.servicePackage.modal.form.description.required"
              ),
            },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="amount"
          label={t("admin.servicePackage.modal.form.amount.label")}
          rules={[
            {
              required: true,
              message: t("admin.servicePackage.modal.form.amount.required"),
            },
          ]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>

        <Form.Item
          name="featureId"
          label={t("admin.servicePackage.modal.form.feature.label")}
          rules={[
            {
              required: true,
              message: t("admin.servicePackage.modal.form.feature.required"),
            },
          ]}
        >
          <Select
            placeholder={t(
              "admin.servicePackage.modal.form.feature.placeholder"
            )}
            allowClear
          >
            <Select.Option value={1}>
              {t("admin.servicePackage.modal.form.feature.options.unlimited")}
            </Select.Option>
            <Select.Option value={2}>
              {t("admin.servicePackage.modal.form.feature.options.priority")}
            </Select.Option>
            <Select.Option value={3}>
              {t(
                "admin.servicePackage.modal.form.feature.options.notification"
              )}
            </Select.Option>
            <Select.Option value={4}>
              {t("admin.servicePackage.modal.form.feature.options.hotLabel")}
            </Select.Option>
            <Select.Option value={5}>
              {t("admin.servicePackage.modal.form.feature.options.cvBank")}
            </Select.Option>
            <Select.Option value={6}>
              {t("admin.servicePackage.modal.form.feature.options.urgent")}
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const ListServicePackage = ({ fetch, setFetch }) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    getAllPackages()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
        setFetch(false);
      });
  };

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
  };

  const handleDeleteServicePackage = (item) => {
    Modal.confirm({
      centered: true,
      title: t("admin.servicePackage.list.deleteConfirm.title"),
      content: t("admin.servicePackage.list.deleteConfirm.content"),
      okType: "danger",
      okText: t("admin.servicePackage.list.deleteConfirm.okText"),
      onOk: () => {
        deleteServicePackage(item.packageId)
          .then((res) => {
            if (res.status === "OK") {
              message.success(t("admin.servicePackage.messages.deleteSuccess"));
              setFetch(true);
            } else {
              message.error(t("admin.servicePackage.messages.deleteError"));
            }
          })
          .catch((err) => {
            console.error(err);
            message.error(t("admin.servicePackage.messages.deleteError"));
          });
      },
    });
  };

  return (
    <>
      <List
        className="service-package-list"
        loading={loading}
        style={{ marginTop: 20 }}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 3,
          xl: 3,
          xxl: 4,
        }}
        locale={{
          emptyText: (
            <Empty description={t("admin.servicePackage.list.empty")} />
          ),
        }}
        dataSource={data}
        pagination={{
          pageSize: 6,
          total: data.length,
          showSizeChanger: false,
        }}
        renderItem={(item) => (
          <List.Item>
            <Card 
              size="small" 
              className="package-card"
              title={
                <div className="package-card-header">
                  <Text className="package-name">{item.packageName}</Text>
                </div>
              }
              actions={[
                <Button
                  icon={<EditOutlined />}
                  type="link"
                  onClick={() => handleEditServicePackage(item)}
                >
                  {t("admin.servicePackage.list.actions.edit")}
                </Button>,
                <Button
                  icon={<DeleteOutlined />}
                  type="link"
                  danger
                  onClick={() => handleDeleteServicePackage(item)}
                >
                  {t("admin.servicePackage.list.actions.delete")}
                </Button>
              ]}
            >
              <div className="package-price">
                <Text className="price-label">{t("admin.servicePackage.list.price")}:</Text>
                <Text className="price-value">
                  {item.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Text>
              </div>
              
              <div className="package-info">
                <div className="info-item">
                  <DollarOutlined className="info-icon" />
                  <div className="info-content">
                    <Text className="info-label">{t("admin.servicePackage.list.feature")}:</Text>
                    <Text className="info-value">{item.featureName}</Text>
                  </div>
                </div>
                
                <div className="info-item">
                  <InfoCircleOutlined className="info-icon" />
                  <div className="info-content">
                    <Text className="info-label">{t("admin.servicePackage.list.description")}:</Text>
                    <Text className="info-value description-text">{item.description}</Text>
                  </div>
                </div>
                
                <Divider style={{ margin: "8px 0" }} />
                
                <Flex align="center" justify="space-between">
                  <div className="info-item">
                    <FieldTimeOutlined className="info-icon" />
                    <div className="info-content">
                      <Text className="info-label">{t("admin.servicePackage.list.duration")}:</Text>
                      <Text className="info-value">{item.duration} {t("admin.servicePackage.list.months")}</Text>
                    </div>
                  </div>
                  <div className="info-item">
                    <AppstoreOutlined className="info-icon" />
                    <div className="info-content">
                      <Text className="info-label">{t("admin.servicePackage.list.postAmount")}:</Text>
                      <Text className="info-value">{item.amount}</Text>
                    </div>
                  </div>
                </Flex>
              </div>
            </Card>
          </List.Item>
        )}
      />
      <ModalCreateServicePackage
        open={open}
        setOpen={setOpen}
        setFetch={setFetch}
        item={item}
      />
    </>
  );
};

const ServicePackage = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [fetch, setFetch] = useState(false);

  return (
    <>
      <BoxContainer className="shadow-md admin-header">
        <Flex align="center" justify="space-between">
          <Text className="title1">{t("admin.servicePackage.title")}</Text>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpen(true);
            }}
          >
            {t("admin.servicePackage.createNew")}
          </Button>
        </Flex>
      </BoxContainer>
      <BoxContainer className="shadow-md">
        <ListServicePackage fetch={fetch} setFetch={setFetch} />
      </BoxContainer>
      <ModalCreateServicePackage
        open={open}
        setOpen={setOpen}
        setFetch={setFetch}
      />
    </>
  );
};

export default ServicePackage;
