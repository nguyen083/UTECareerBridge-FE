import React, { useEffect, useState } from 'react';
import { Button, Divider, Typography, Table, Modal } from 'antd';
import './orderPage.scss';
import BoxContainer from '../../Generate/BoxContainer';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { getCartByEmployer, getAllCoupon } from '../../../services/apiService';
import VoucherModal from './voucherModal';
import VoucherCard from '../../Generate/VoucherCard';
const { Title, Text } = Typography;

const OrderPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getItemsInCart = async () => {
    try {
      const response = await getCartByEmployer();
      const formattedItems = response.data.map(item => ({
        ...item,
        packageName: item.jobPackage.packageName,
        price: item.jobPackage.price,
        description: item.jobPackage.description,
        quantity: item.quantity,
        total: item.jobPackage.price * item.quantity,
      }));
      setCartItems(formattedItems);
    } catch (error) {
      console.error("Error getting cart items:", error);
    }
  };
  useEffect(() => {
    getItemsInCart();
  }, []);

  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleDeleteItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.cartItemId !== itemId));
  };


  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTaxAmount = () => {
    return getTotalPrice() * 0.08; // Assuming 8% VAT
  };

  const getTotalWithTax = () => {
    return getTotalPrice() + getTaxAmount();
  };

  const handleVoucherSelect = (couponCode) => {
    setSelectedVoucher(couponCode);
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'packageName',
      key: 'packageName',
      render: (text, record) => (
        <div>
          <Text className='package-name'>{text}</Text>
          <br />
          <Text type="secondary" className="description">{record.description}</Text>
        </div>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (text) => text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            type="default"
            icon={<MinusOutlined />}
            onClick={() => handleQuantityChange(record.id, Math.max(1, quantity - 1))}
            size="small"
          />
          <span style={{ width: 50, textAlign: 'center', margin: '0 8px' }}>{quantity}</span>
          <Button
            type="default"
            icon={<PlusOutlined />}
            onClick={() => handleQuantityChange(record.id, quantity + 1)}
            size="small"
          />
        </div>
      ),
    },
    {
      title: 'Số tiền (VND)',
      dataIndex: 'total',
      key: 'total',
      render: (_, record) => (
        <span>
          {(record.price * record.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      dataIndex: '',
      key: 'x',
      render: (_, record) => (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteItem(record.cartItemId)}
        />
      ),
    },
  ];

  return (
    <>
      <BoxContainer>
        <div className="order-page">
          <div className="order-summary">
            <Title level={3}>Chi tiết dịch vụ</Title>
            <Table columns={columns}
              dataSource={cartItems}
              rowKey="cartItemId"
              pagination={false}
            />
            <Divider />
          </div>
          <div className="order-info">
            <Title level={3}>Thông tin đơn hàng</Title>
            <div className="info-item">
              <Text className="label">Tổng giá trị đơn hàng</Text>
              <Text className="value">{getTotalPrice().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
            </div>
            <div className="info-item">
              <Text className="label">VAT (8%)</Text>
              <Text className="value">{getTaxAmount().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
            </div>
            <Divider />
            <div className="voucher">
              <Button type="primary" onClick={() => setIsModalVisible(true)}>Chọn mã ưu đãi</Button>
              {selectedVoucher && <Text className="selected-voucher">{selectedVoucher}</Text>}
            </div>
            <div className="info-item">
              <Text className="label">Tổng thanh toán (Đã bao gồm VAT)</Text>
              <Text className="value">{getTotalWithTax().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
            </div>
            <div className="actions">
              <Button className="btn-checkout" type="primary">Tạo đơn hàng</Button>
            </div>
          </div>
        </div>
        <VoucherModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      </BoxContainer>
    </>
  );
};

export default OrderPage;
