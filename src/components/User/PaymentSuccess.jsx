import {
  Button,
  Result,
  Typography,
  Card,
  Flex,
  Divider,
  Row,
  Col,
  Avatar,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import Pride from "react-canvas-confetti/dist/presets/pride";
import { useEffect, useState } from "react";
import {
  CheckCircleFilled,
  ShoppingOutlined,
  HomeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { getOrderById, getDetailOrder } from "../../services/apiService";

import "./PaymentSuccess.scss";

const { Text, Title, Paragraph } = Typography;

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get order ID from URL params
    const params = new URLSearchParams(location.search);
    const orderId = params.get("orderId");

    if (orderId) {
      fetchOrderData(orderId);
    } else {
      setLoading(false);
    }
  }, [location]);

  const fetchOrderData = async (orderId) => {
    try {
      setLoading(true);
      const orderResponse = await getOrderById(orderId);
      const detailsResponse = await getDetailOrder(orderId);

      if (orderResponse.status === "OK") {
        setOrderData(orderResponse.data);
      }

      if (detailsResponse.status === "OK") {
        setOrderDetails(detailsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return (
      amount?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) ||
      ""
    );
  };

  return (
    <div className="payment-success-container">
      <Pride autorun={{ speed: 5 }} />

      <Card className="success-card">
        <Result
          status="success"
          icon={<CheckCircleFilled className="success-icon" />}
          title={
            <Title level={2} className="success-title">
              Thanh toán thành công!
            </Title>
          }
          subTitle={
            <Paragraph className="success-subtitle">
              Cảm ơn bạn đã sử dụng dịch vụ của UTECareerBridge. Đơn hàng của
              bạn đã được xác nhận và thanh toán thành công.
            </Paragraph>
          }
        />

        <Divider className="styled-divider" />

        {orderData && (
          <div className="order-info-section">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div className="info-block">
                  <Title level={4}>Thông tin đơn hàng</Title>
                  <div className="info-item">
                    <Text strong>Mã đơn hàng:</Text>
                    <Text copyable>{orderData.orderId}</Text>
                  </div>
                  <div className="info-item">
                    <Text strong>Ngày đặt hàng:</Text>
                    <Text>{orderData.orderDate}</Text>
                  </div>
                  <div className="info-item">
                    <Text strong>Ngày thanh toán:</Text>
                    <Text>{orderData.paymentDate}</Text>
                  </div>
                  {orderData.couponCode && (
                    <div className="info-item">
                      <Text strong>Mã giảm giá:</Text>
                      <Text>{orderData.couponCode}</Text>
                    </div>
                  )}
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className="info-block">
                  <Title level={4}>Chi tiết thanh toán</Title>
                  <div className="info-item">
                    <Text strong>Phương thức:</Text>
                    <Flex align="center" gap={8}>
                      <Avatar
                        size="small"
                        src="https://res.cloudinary.com/utejobhub/image/upload/v1733687883/vnpay_vgngax.png"
                      />
                      <Text>VNPAY</Text>
                    </Flex>
                  </div>
                  <div className="info-item">
                    <Text strong>Trạng thái:</Text>
                    <Text className="status-paid">Đã thanh toán</Text>
                  </div>
                  <div className="info-item total-row">
                    <Text strong className="total-label">
                      Tổng tiền:
                    </Text>
                    <Text className="total-value">
                      {formatCurrency(orderData.total)}
                    </Text>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {orderDetails && orderDetails.length > 0 && (
          <div className="order-details-section">
            <Title level={4}>Gói dịch vụ đã mua</Title>
            <div className="package-list">
              {orderDetails.map((item) => (
                <Card key={item.detailId} className="package-item">
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap={12}>
                      <div className="package-icon">
                        <ShoppingOutlined />
                      </div>
                      <div className="package-info">
                        <Text strong className="package-name">
                          {item.packageResponse.packageName}
                        </Text>
                        <Text type="secondary">
                          {item.packageResponse.description}
                        </Text>
                      </div>
                    </Flex>
                    <div className="package-details">
                      <Text type="secondary">Số lượng: {item.amount}</Text>
                      <Text strong>{formatCurrency(item.price)}</Text>
                    </div>
                  </Flex>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="action-buttons">
          <Button
            size="large"
            icon={<HomeOutlined />}
            onClick={() => navigate("/employer")}
            className="action-button home-button"
          >
            Trang chủ
          </Button>
          <Button
            size="large"
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => navigate("/employer/list-order")}
            className="action-button orders-button"
          >
            Xem đơn hàng
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
