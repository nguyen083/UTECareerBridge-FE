import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  List,
  Typography,
  Divider,
  Pagination,
  Tag,
  Empty,
  Spin,
  Badge,
} from "antd";
import { getAllCoupon } from "../../../services/apiService";
import "./voucherModal.scss";
import {
  CalendarOutlined,
  CheckOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { RiDiscountPercentLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;

const VoucherModal = ({ visible, onClose, onSelectVoucher }) => {
  const { t } = useTranslation();
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (visible) {
      fetchCoupons(currentPage, pageSize);
    }
  }, [visible, currentPage, pageSize]);

  const fetchCoupons = async (page = 0, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllCoupon({ page, limit });
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
        setFilteredCoupons(transformedCoupons);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setFilteredCoupons([]);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setError(t("employer.voucher.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const handleUseCoupon = (coupon) => {
    onSelectVoucher(coupon);
    onClose();
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page - 1);
    setPageSize(pageSize);
  };

  const getExpiryStatus = (expiredAt) => {
    const now = new Date();
    const expiryDate = new Date(expiredAt);
    const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 3 && daysRemaining > 0) {
      return { color: "orange", message: t("employer.voucher.expiringSoon") };
    } else if (daysRemaining <= 0) {
      return { color: "red", message: t("employer.voucher.expired") };
    }
    return {
      color: "green",
      message: `${daysRemaining} ${t("employer.voucher.daysRemaining")}`,
    };
  };

  const renderVoucherItem = (coupon) => {
    const expiryStatus = getExpiryStatus(coupon.expiredAt);
    const isExpired = expiryStatus.color === "red";
    const isLimited = coupon.amount < 5;

    return (
      <div className="voucher-card">
        <div className="voucher-card-left">
          <div className="voucher-percentage">
            <span className="discount-label">
              {t("admin.coupon.discount", {
                discount: coupon.discount + "%",
              })}
            </span>
          </div>
          <div className="voucher-ribbon">
            <RiDiscountPercentLine className="ribbon-icon" />
          </div>
        </div>

        <div className="voucher-card-content">
          <div className="voucher-header">
            <Title level={5} className="voucher-title">
              {coupon.description}
            </Title>
            <Tag color="gold" className="voucher-code">
              {coupon.code}
            </Tag>
          </div>

          <div className="voucher-details">
            <div className="voucher-info-item">
              <CalendarOutlined className="info-icon" />
              <Text className="info-text">
                {t("admin.coupon.expireDate")}:{" "}
                {new Date(coupon.expiredAt).toLocaleDateString("vi-VN")}
              </Text>
              <Tag color={expiryStatus.color} className="expiry-tag">
                {expiryStatus.message}
              </Tag>
            </div>

            <div className="voucher-info-item">
              <TagOutlined className="info-icon" />
              <Text className="info-text">
                {t("admin.coupon.remaining")}:{" "}
                <Badge
                  count={coupon.amount}
                  color={isLimited ? "red" : "blue"}
                  overflowCount={999}
                />
              </Text>
            </div>
          </div>
        </div>

        <div className="voucher-card-action">
          <Button
            type="primary"
            onClick={() => handleUseCoupon(coupon)}
            disabled={!coupon.active || isExpired || coupon.amount <= 0}
            className="use-button"
            icon={<CheckOutlined />}
          >
            {t("employer.voucher.useNow")}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title={
        <div className="modal-title">
          <TagOutlined /> {t("employer.voucher.selectTitle")}
        </div>
      }
      width={800}
      className="voucher-modal"
      centered
    >
      <Divider className="search-divider" />

      {loading && (
        <div className="loading-container">
          <Spin size="large" />
          <Text className="loading-text">{t("common.loading")}</Text>
        </div>
      )}

      {error && (
        <div className="error-container">
          <Text type="danger">{error}</Text>
          <Button onClick={() => fetchCoupons(currentPage, pageSize)}>
            {t("common.retry")}
          </Button>
        </div>
      )}

      {!loading && !error && (
        <div className="vouchers-container">
          {filteredCoupons.length > 0 ? (
            <>
              <List
                dataSource={filteredCoupons}
                renderItem={renderVoucherItem}
                className="voucher-list"
              />

              <div className="pagination-container">
                <Pagination
                  current={currentPage + 1}
                  pageSize={pageSize}
                  total={totalPages * pageSize}
                  onChange={handlePageChange}
                  showSizeChanger
                  pageSizeOptions={["5", "10", "20"]}
                />
              </div>
            </>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t("employer.voucher.noCoupons")}
              className="empty-vouchers"
            />
          )}
        </div>
      )}
    </Modal>
  );
};

export default VoucherModal;
