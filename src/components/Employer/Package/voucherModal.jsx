import { useState, useEffect } from 'react';
import { Modal, Button, List, Typography, Divider, Pagination, Tag, Flex } from 'antd';
import { getAllCoupon } from '../../../services/apiService';
import './voucherModal.scss';
import { CalendarOutlined } from '@ant-design/icons';
import { RiDiscountPercentLine } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const VoucherModal = ({ visible, onClose, onSelectVoucher }) => {
  const { t } = useTranslation();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (visible) {
      fetchCoupons(currentPage, 10);
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
      setError(t('employer.voucher.fetchError'));
    } finally {
      setLoading(false);
    }
  };
  
  const handleUseCoupon = (coupon) => {
    onSelectVoucher(coupon);
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
      title={t('employer.voucher.selectTitle')}
      width={800}
      className="voucher-modal"
    >
      {loading && <div>{t('common.loading')}</div>}
      {error && <div>{error}</div>}
      {!loading && !error && coupons.length > 0 && (
        <div>
          <List
            dataSource={coupons}
            renderItem={(coupon) => (
              <List.Item
                key={coupon.key}
                actions={[
                  <Button
                    key={coupon.key}
                    type="primary"
                    onClick={() => handleUseCoupon(coupon)}
                    disabled={!coupon.active}
                    className='use-button'
                  >
                    {t('employer.voucher.useNow')}
                  </Button>,
                ]}
                className="my-3 border rounded coupon-list-item border-warning"
              >
                <List.Item.Meta
                  className='flex !items-stretch'
                  avatar={
                    <div className="voucher-left rounded-l !bottom-0">
                      <div className="voucher-label"><Flex align="center" gap={5}><RiDiscountPercentLine size={20} /> {t('admin.coupon.voucher')}</Flex></div>
                    </div>}
                  title={
                    <>
                      <Text strong>{t('admin.coupon.discount', { discount: coupon.discount })}</Text>
                    </>
                  }
                  description={
                    <div className='ps-1'>
                      <p className='flex gap-3'>{t('admin.coupon.code')} <Tag className="text-sm font-normal w-fit" color="orange">{coupon.code}</Tag></p>
                      <p>{coupon.description}</p>
                      <Flex align="center">
                        <p>{t('admin.coupon.remaining')} {coupon.amount}</p> <Divider type="vertical" />
                        <p> <CalendarOutlined /> {t('admin.coupon.expireDate')} {new Date(coupon.expiredAt).toLocaleDateString('vi-VN').split(' ')[0]}</p>
                      </Flex>
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
