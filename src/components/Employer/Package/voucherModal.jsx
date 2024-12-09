import React, { useState, useEffect } from 'react';
import { Modal, Button, List, Typography, Divider, Pagination, Tag } from 'antd';
import { getAllCoupon } from '../../../services/apiService';
import './voucherModal.scss';
const { Text } = Typography;

const VoucherModal = ({ visible, onClose, onSelectVoucher }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (visible) {
      fetchCoupons(currentPage, 10); // Fetch with initial page and limit
    }
  }, [visible, currentPage]);

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
          active: coupon.active
        }));
        setCoupons(transformedCoupons);
      } else {
        setCoupons([]);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setError("Error fetching coupons");
    } finally {
      setLoading(false);
    }
  };
  const handleUseCoupon = (coupon) => {
    onSelectVoucher(coupon.code); // Call the function passed from props
    onClose();

  };
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="voucher-modal"
    >
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!loading && !error && coupons.length === 0 && (
        <div>Không có mã ưu đãi nào.</div>
      )}
      {!loading && !error && coupons.length > 0 && (
        <div>
          <List
            dataSource={coupons}
            renderItem={(coupon) => (
              <List.Item
                key={coupon.key}
                actions={[
                  <Button
                    type="primary"
                    onClick={() => handleUseCoupon(coupon)}
                    disabled={!coupon.active}
                    className='use-button'
                  >
                    Dùng ngay
                  </Button>,
                ]}
                className="coupon-list-item border rounded border-warning my-3"
              >
                <List.Item.Meta
                  className='d-flex align-items-stretch'
                  avatar={
                    <div className="voucher-left rounded-start">
                      <div className="voucher-label">Voucher</div>
                    </div>}
                  title={
                    <>
                      <Text strong>{coupon.discount}% giảm</Text>
                      {coupon.amount > 0 && (
                        <>
                          <Divider type="vertical" />
                          <Text>Giảm {coupon.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
                        </>
                      )}
                    </>
                  }
                  description={
                    <div className='ps-1'>
                      <p>Mã: <Tag color="orange">{coupon.code}</Tag></p>
                      <p>{coupon.description}</p>
                      <p>Còn lại: {coupon.expiredAt}</p>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
          <Divider />
          <div className="pagination-container">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalPages * pageSize}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={[10, 20, 30]}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default VoucherModal;
