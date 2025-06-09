import {
  Descriptions,
  Flex,
  Modal,
  Radio,
  message,
  Typography,
  Table,
  Button,
  Avatar,
} from "antd";
import { useEffect, useState } from "react";
import {
  getDetailOrder,
  getOrderById,
  createPayment,
} from "../../../services/apiService";
import "./ModalDetailOrder.scss";
import { useTranslation } from "react-i18next";
const { Title, Text } = Typography;

const OrderDetailTable = ({ data }) => {
  const { t } = useTranslation();

  console.log(data);
  const columns = [
    {
      title: t("employer.orders.packageName"),
      dataIndex: "packageName",
      key: "packageName",
    },
    {
      title: t("employer.orders.amount"),
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: t("employer.orders.price"),
      dataIndex: "price",
      key: "price",
      render: (text) =>
        text.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
  ];

  const tableData = data?.map((item) => ({
    key: item.detailId,
    packageName: item.packageResponse.packageName,
    amount: item.amount,
    price: item.price,
  }));

  return (
    <>
      <Title className="pt-2" strong level={5}>
        {t("employer.orders.packageList")}
      </Title>
      <Table columns={columns} dataSource={tableData} pagination={false} />
    </>
  );
};

const ModalDetailOrder = ({
  openOrderModal,
  setOpenOrderModal,
  id,
  status = "PENDING",
}) => {
  const { t } = useTranslation();
  const [order, setOrder] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);

  useEffect(() => {
    if (id) {
      getDetailOrder(id).then((res) => {
        setDetailOrder(res.data);
      });
      getOrderById(id).then((res) => {
        setOrder(res.data);
      });
    }
  }, [id]);

  const handlePayment = () => {
    createPayment(order?.orderId).then((res) => {
      if (res.status === "OK") {
        setOpenOrderModal(false);
        console.log(res.data);
        // window.open(res.data, '_blank');
      } else {
        message.error(res.message);
      }
    });
  };
  return (
    <>
      <Modal
        className="modal-detail-order"
        width={800}
        onCancel={() => setOpenOrderModal(false)}
        centered
        title={
          <Title strong level={4}>
            {t("employer.orders.orderDetail")}
          </Title>
        }
        open={openOrderModal}
        footer={
          status === "PENDING" ? (
            <>
              <Button
                size="large"
                type="default"
                onClick={() => setOpenOrderModal(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button size="large" type="primary" onClick={handlePayment}>
                {t("employer.orders.pay")}
              </Button>
            </>
          ) : null
        }
      >
        <Flex vertical gap={16} className="modal-detail-order-content">
          <Descriptions
            title={
              <Title strong level={5}>
                {t("employer.orders.orderInfo")}
              </Title>
            }
            column={1}
            bordered
          >
            <Descriptions.Item label={t("employer.orders.orderId")}>
              {order?.orderId}
            </Descriptions.Item>
            <Descriptions.Item label={t("employer.orders.company")}>
              {order?.employer.companyName}
            </Descriptions.Item>
            {order?.couponCode && (
              <>
                <Descriptions.Item label={t("employer.orders.couponCode")}>
                  {order?.couponCode}
                </Descriptions.Item>
                <Descriptions.Item label={t("employer.orders.discount")}>
                  {order?.discount}%
                </Descriptions.Item>
              </>
            )}
            <Descriptions.Item label={t("employer.orders.orderDate")}>
              {order?.orderDate}
            </Descriptions.Item>
            <Descriptions.Item label={t("employer.orders.status")}>
              {status === "PENDING"
                ? t("employer.orders.pending")
                : t("employer.orders.paid")}
            </Descriptions.Item>
            {order?.paymentDate && (
              <Descriptions.Item label={t("employer.orders.paymentDate")}>
                {order?.paymentDate}
              </Descriptions.Item>
            )}
            <Descriptions.Item label={t("employer.orders.total")}>
              {order?.total.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Descriptions.Item>
          </Descriptions>
          <OrderDetailTable data={detailOrder} />
          {status === "PENDING" && (
            <>
              {" "}
              <Title strong level={5}>
                {t("employer.orders.paymentMethod")}
              </Title>
              <Radio.Group value={1}>
                <Flex vertical gap={16}>
                  <Flex
                    className="p-2 border rounded-2"
                    align="center"
                    gap={16}
                  >
                    <Radio value={1} />
                    <Avatar
                      shape="square"
                      size={64}
                      src={
                        "https://res.cloudinary.com/utejobhub/image/upload/v1733687883/vnpay_vgngax.png"
                      }
                    />
                    <Text strong>{t("employer.orders.vnpay")}</Text>
                  </Flex>
                  {/* <Flex className="p-2 border rounded-2" align="center" gap={16}>
                                    <Radio value={2} />
                                    <Avatar shape="square" size={64} src={"https://res.cloudinary.com/utejobhub/image/upload/v1733688330/ATMCard_r2pfq0.png"} />
                                    <Text strong>Thẻ ATM và Tài khoản ngân hàng</Text>
                                </Flex>
                                <Flex className="p-2 border rounded-2" align="center" gap={16}>
                                    <Radio value={3} />
                                    <Avatar shape="square" size={64} src={"https://res.cloudinary.com/utejobhub/image/upload/v1733688425/phan-loai-the-thanh-toan-quoc-te_rjgejr.jpg"} />
                                    <Text strong>Thẻ thanh toán quốc tế</Text>
                                </Flex> */}
                </Flex>
              </Radio.Group>
            </>
          )}
        </Flex>
      </Modal>
    </>
  );
};
export default ModalDetailOrder;
