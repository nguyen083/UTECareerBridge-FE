import React, { useEffect, useState } from 'react';
import { Button, Divider, Typography, Table, Modal, message, Flex, Descriptions, Radio } from 'antd';
import './orderPage.scss';
import BoxContainer from '../../Generate/BoxContainer';
import { CloseOutlined, DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { getCartByEmployer, getAllCoupon, removePackageFromCart, updateQuantityPackage, createOrder, createPayment } from '../../../services/apiService';
import VoucherModal from './voucherModal';
import VoucherCard from '../../Generate/VoucherCard';
import ModalDetailOrder from '../Order/ModalDetailOrder';
const { Title, Text } = Typography;

const OrderPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [openOrderModal, setOpenOrderModal] = useState(false);

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
        packageId: item.jobPackage.packageId,
      }));
      setCartItems(formattedItems);
    } catch (error) {
      console.error("Error getting cart items:", error);
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
    if (newQuantity === 0)
      handleDeleteItem(packageId);
    else {
      updateQuantityPackage({ packageId, quantity: quantityChange }).then((res) => {
        if (res.status === 'OK') {
          getItemsInCart();
          // message.success(res.message);
        }
      });
    }
  };

  const handleDeleteItem = (packageId) => {
    removePackageFromCart(packageId).then((res) => {
      if (res.status === 'OK') {
        getItemsInCart();
        message.success(res.message);
        // setCartItems(cartItems.filter(item => item.cartItemId !== itemId));

      }
    });
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
            onClick={() => handleQuantityChange(record.packageId, quantity - 1, -1)}
            size="small"
          />
          <span style={{ width: 50, textAlign: 'center', margin: '0 8px' }}>{quantity}</span>
          <Button
            type="default"
            icon={<PlusOutlined />}
            onClick={() => handleQuantityChange(record.packageId, quantity + 1, 1)}
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
          onClick={() => handleDeleteItem(record.packageId)}
        />
      ),
    },
  ];
  const handleCreateOrder = () => {
    createOrder(selectedVoucher).then((res) => {
      if (res.status === 'CREATED') {
        message.success(res.message);
        setOrderId(res.data.orderId);
      } else {
        message.error(res.message);
      }
    });
  }

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
            <div className="voucher d-flex align-items-center justify-content-between">
              <Button type="primary" onClick={() => setIsModalVisible(true)} className='voucher-button'>Chọn mã ưu đãi</Button>
              {selectedVoucher && <Flex align='center' gap={8}>
                <Button danger type='text' icon={<CloseOutlined />} onClick={() => setSelectedVoucher(null)}></Button>
                <Text className="selected-voucher">{selectedVoucher}</Text></Flex>
              }
            </div>
            <div className="info-item">
              <Text className="label">Tổng thanh toán (Đã bao gồm VAT)</Text>
              <Text className="value">{getTotalWithTax().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
            </div>
            <div className="actions">
              <Button className="btn-checkout" type="primary" onClick={handleCreateOrder}>Tạo đơn hàng</Button>
            </div>
          </div>
        </div>
        <VoucherModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSelectVoucher={handleVoucherSelect}
        />
      </BoxContainer>
      <ModalDetailOrder openOrderModal={openOrderModal} setOpenOrderModal={setOpenOrderModal} id={orderId} />
    </>
  );
};

export default OrderPage;
