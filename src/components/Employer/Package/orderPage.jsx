import { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Typography,
  Table,
  message,
  Flex,
  Card,
  Row,
  Col,
  Empty,
  Tooltip,
  Badge,
} from "antd";
import "./orderPage.scss";
import BoxContainer from "../../Generate/BoxContainer";
import {
  CloseOutlined,
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  getCartByEmployer,
  removePackageFromCart,
  updateQuantityPackage,
  createOrder,
} from "../../../services/apiService";
import VoucherModal from "./voucherModal";
import ModalDetailOrder from "../Order/ModalDetailOrder";
import { RiDiscountPercentLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";
const { Text, Title } = Typography;

const OrderPage = () => {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const getItemsInCart = async () => {
    setLoading(true);
    try {
      const response = await getCartByEmployer();
      const formattedItems = response.data.map((item) => ({
        ...item,
        packageName: item.jobPackage.packageName,
        price: item.jobPackage.price,
        description: item.jobPackage.description,
        quantity: item.quantity,
        total: item.jobPackage.price * item.quantity,
        packageId: item.jobPackage.packageId,
      }));
      setCartItems(formattedItems);
    } catch (error) {
      console.error("Error getting cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItemsInCart();
  }, []);

  useEffect(() => {
    if (orderId) {
      setOpenOrderModal(true);
    }
  }, [orderId]);

  const handleQuantityChange = (packageId, newQuantity, quantityChange) => {
    if (newQuantity === 0) {
      handleDeleteItem(packageId);
    } else {
      // Cập nhật UI trước khi gọi API để tránh hiệu ứng skeleton
      const updatedItems = cartItems.map((item) => {
        if (item.packageId === packageId) {
          const newQty = item.quantity + quantityChange;
          return {
            ...item,
            quantity: newQty,
            total: item.price * newQty,
          };
        }
        return item;
      });
      setCartItems(updatedItems);

      // Gửi yêu cầu cập nhật lên server mà không gây loading state
      updateQuantityPackage({ packageId, quantity: quantityChange })
        .then((res) => {
          if (res.status !== "OK") {
            // Nếu lỗi, khôi phục lại dữ liệu cũ
            getItemsInCart();
            message.error(res.message || "Đã xảy ra lỗi khi cập nhật số lượng");
          }
        })
        .catch(() => {
          // Nếu có lỗi, tải lại giỏ hàng
          getItemsInCart();
          message.error("Đã xảy ra lỗi khi cập nhật số lượng");
        });
    }
  };

  const handleDeleteItem = (packageId) => {
    removePackageFromCart(packageId).then((res) => {
      if (res.status === "OK") {
        getItemsInCart();
        message.success(res.message);
      }
    });
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotalWithTax = () => {
    if (selectedVoucher) {
      return (
        getTotalPrice() - (getTotalPrice() * selectedVoucher.discount) / 100
      );
    }
    return getTotalPrice();
  };

  const handleVoucherSelect = (couponCode) => {
    setSelectedVoucher(couponCode);
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: t("employer.orders.packageName"),
      dataIndex: "packageName",
      key: "packageName",
      render: (text, record) => (
        <div className="package-info">
          <Text className="package-name">{text}</Text>
          <Text type="secondary" className="description">
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: t("employer.orders.price"),
      dataIndex: "price",
      key: "price",
      render: (text) => (
        <span className="package-price">
          {text.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
        </span>
      ),
    },
    {
      title: t("employer.orders.amount"),
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <div className="quantity-control">
          <Button
            type="primary"
            ghost
            icon={<MinusOutlined />}
            onClick={() =>
              handleQuantityChange(record.packageId, quantity - 1, -1)
            }
            size="small"
            disabled={quantity <= 1}
            className="quantity-btn"
          />
          <span className="quantity-display">{quantity}</span>
          <Button
            type="primary"
            ghost
            icon={<PlusOutlined />}
            onClick={() =>
              handleQuantityChange(record.packageId, quantity + 1, 1)
            }
            size="small"
            className="quantity-btn"
          />
        </div>
      ),
    },
    {
      title: t("employer.orders.total"),
      dataIndex: "total",
      key: "total",
      render: (_, record) => (
        <span className="item-total">
          {(record.price * record.quantity).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </span>
      ),
    },
    {
      title: t("common.edit"),
      dataIndex: "",
      key: "x",
      width: "12%",
      align: "center",
      render: (_, record) => (
        <Tooltip destroyTooltipOnHide={true} title={t("common.delete")}>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteItem(record.packageId)}
            className="delete-btn"
          />
        </Tooltip>
      ),
    },
  ];

  const handleCreateOrder = () => {
    if (cartItems.length === 0) {
      message.warning(t("employer.orders.emptyCart"));
      return;
    }

    createOrder(selectedVoucher?.couponCode).then((res) => {
      if (res.status === "CREATED") {
        message.success(res.message);
        setOrderId(res.data.orderId);
      } else {
        message.error(res.message);
      }
    });
  };

  return (
    <>
      <BoxContainer>
        <div className="cart-page-header">
          <Title level={4}>
            <ShoppingCartOutlined /> {t("employer.orders.shoppingCart")}
          </Title>
        </div>

        {cartItems.length === 0 && !loading ? (
          <Card className="empty-cart-card">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t("employer.orders.emptyCart")}
            >
              <Button type="primary" href="/employer/buy-service">
                {t("employer.orders.continueShopping")}
              </Button>
            </Empty>
          </Card>
        ) : (
          <Row gutter={24} justify="space-between">
            <Col xs={24} md={14}>
              <Card
                title={
                  <Flex align="center" gap={8}>
                    <ShoppingCartOutlined className="cart-icon" />
                    <Text className="card-title">
                      {t("employer.orders.packageList")}
                    </Text>
                    <Badge
                      count={cartItems.length}
                      showZero
                      className="cart-badge"
                    />
                  </Flex>
                }
                className="shadow-lg detail-cart-card"
                loading={loading}
              >
                <Table
                  columns={columns}
                  dataSource={cartItems}
                  rowKey="cartItemId"
                  pagination={false}
                  className="cart-table"
                />
              </Card>
            </Col>

            <Col xs={24} md={10}>
              <Card
                title={
                  <Flex align="center" gap={8}>
                    <TagOutlined />
                    <Text className="card-title">
                      {t("employer.orders.orderInfo")}
                    </Text>
                  </Flex>
                }
                className="shadow-lg order-summary-card"
                loading={loading}
              >
                <div className="info-item">
                  <Text className="text-base">
                    {t("employer.orders.subtotal")}
                  </Text>
                  <Text className="text-base font-bold">
                    {getTotalPrice().toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </Text>
                </div>

                {selectedVoucher && (
                  <div className="info-item discount-row">
                    <Text className="flex items-center text-base discount-label">
                      <RiDiscountPercentLine className="discount-icon" />
                      {t("employer.orders.discount")}
                    </Text>
                    <Text className="text-base font-bold discount-value">
                      - {selectedVoucher?.discount}%
                    </Text>
                  </div>
                )}

                <Divider className="summary-divider" />

                <div className="voucher-section">
                  <Button
                    type="primary"
                    onClick={() => setIsModalVisible(true)}
                    className="voucher-button"
                    icon={<TagOutlined />}
                  >
                    {t("employer.orders.couponCode")}
                  </Button>

                  {selectedVoucher && (
                    <div className="selected-voucher-container">
                      <Button
                        danger
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => setSelectedVoucher(null)}
                        className="remove-voucher-btn"
                      />
                      <Text className="selected-voucher">
                        {selectedVoucher.code}
                      </Text>
                    </div>
                  )}
                </div>

                <div className="total-section">
                  <Text className="total-label">
                    {t("employer.orders.total")}
                  </Text>
                  <div className="total-value-container">
                    {selectedVoucher && (
                      <Text type="danger" className="original-price" delete>
                        {getTotalPrice().toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Text>
                    )}
                    <Text className="final-price">
                      {getTotalWithTax().toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Text>
                  </div>
                </div>

                <div className="actions">
                  <Button
                    className="btn-checkout"
                    type="primary"
                    onClick={handleCreateOrder}
                    disabled={cartItems.length === 0}
                    size="large"
                    block
                  >
                    {t("employer.orders.checkout")}
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        )}

        <VoucherModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSelectVoucher={handleVoucherSelect}
        />
      </BoxContainer>
      <ModalDetailOrder
        openOrderModal={openOrderModal}
        setOpenOrderModal={setOpenOrderModal}
        id={orderId}
      />
    </>
  );
};

export default OrderPage;
