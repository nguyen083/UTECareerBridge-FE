import React, { useEffect, useState } from 'react';
import { Button, Divider, Typography, Table, message, Flex } from 'antd';
import './orderPage.scss';
import BoxContainer from '../../Generate/BoxContainer';
import { CloseOutlined, DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { getCartByEmployer, removePackageFromCart, updateQuantityPackage, createOrder } from '../../../services/apiService';
import VoucherModal from './voucherModal';
import ModalDetailOrder from '../Order/ModalDetailOrder';
import { RiDiscountPercentLine } from 'react-icons/ri';
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

  // const getTaxAmount = () => {
  //   return getTotalPrice() * 0.08; // Assuming 8% VAT
  // };

  const getTotalWithTax = () => {
    // return getTotalPrice() + getTaxAmount();
    if (selectedVoucher) {
      return getTotalPrice() - (getTotalPrice() * selectedVoucher.discount / 100);
    }
    return getTotalPrice();
  };

  const handleVoucherSelect = (couponCode) => {
    console.log(couponCode);
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
              <Text className="f-16">Tổng giá trị đơn hàng</Text>
              <Text className="f-16 fw-bold">{getTotalPrice().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
            </div>
            {selectedVoucher && <div className="info-item">
              <Text className="f-16 d-flex align-items-center"><RiDiscountPercentLine />&ensp;Giảm giá</Text>
              <Text className="f-16 fw-bold">{selectedVoucher?.discount} %</Text>
            </div>}
            {/* <div className="info-item">
              <Text className="label">VAT (8%)</Text>
              <Text className="value">{getTaxAmount().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
            </div> */}
            <Divider />
            <div className="voucher d-flex align-items-center justify-content-between">
              <Button type="primary" onClick={() => setIsModalVisible(true)} className='voucher-button'>Chọn mã ưu đãi</Button>
              {selectedVoucher && <Flex align='center' gap={8}>
                <Button danger type='text' icon={<CloseOutlined />} onClick={() => setSelectedVoucher(null)}></Button>
                <Text className="selected-voucher">{selectedVoucher.code}</Text></Flex>
              }
            </div>
            <div className="info-item mt-5">
              <Text className="f-16">Tổng thanh toán</Text>
              <Flex gap={8}>
                {selectedVoucher && <Text type='danger' className="f-16 fw-bold " delete>{getTotalPrice().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>}
                <Text className="f-16 fw-bold">{getTotalWithTax().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
              </Flex>
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
