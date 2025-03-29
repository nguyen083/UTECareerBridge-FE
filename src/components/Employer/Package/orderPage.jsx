import { useEffect, useState } from 'react';
import { Button, Divider, Typography, Table, message, Flex, Card, Row, Col } from 'antd';
import './orderPage.scss';
import BoxContainer from '../../Generate/BoxContainer';
import { CloseOutlined, DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { getCartByEmployer, removePackageFromCart, updateQuantityPackage, createOrder } from '../../../services/apiService';
import VoucherModal from './voucherModal';
import ModalDetailOrder from '../Order/ModalDetailOrder';
import { RiDiscountPercentLine } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
const { Text } = Typography;

const OrderPage = () => {
  const { t } = useTranslation();
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
         
        }
      });
    }
  };

  const handleDeleteItem = (packageId) => {
    removePackageFromCart(packageId).then((res) => {
      if (res.status === 'OK') {
        getItemsInCart();
        message.success(res.message);
       

      }
    });
  };


  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

 
 
 

  const getTotalWithTax = () => {
   
    if (selectedVoucher) {
      return getTotalPrice() - (getTotalPrice() * selectedVoucher.discount / 100);
    }
    return getTotalPrice();
  };

  const handleVoucherSelect = (couponCode) => {
    setSelectedVoucher(couponCode);
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: t('employer.orders.packageName'),
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
      title: t('employer.orders.price'),
      dataIndex: 'price',
      key: 'price',
      render: (text) => text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
    },
    {
      title: t('employer.orders.amount'),
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
      title: t('employer.orders.total'),
      dataIndex: 'total',
      key: 'total',
      render: (_, record) => (
        <span>
          {(record.price * record.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </span>
      ),
    },
    {
      title: t('common.edit'),    
      dataIndex: '',
      key: 'x',
      width: '12%',
      align: 'center',
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
    createOrder(selectedVoucher?.couponCode).then((res) => {
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
        <Row gutter={16} justify="space-between">
          <Col span={14}>
            <Card title={<Text className='f-20 card-title'>{t('employer.orders.packageList')}</Text>} className='shadow-md detail-cart-card'>

              <Table
                columns={columns}
                dataSource={cartItems}
                rowKey="cartItemId"
                pagination={false}
              />
            </Card></Col>
          <Col span={10}>
            <Card title={<Text className='f-20 card-title'>{t('employer.orders.orderInfo')}</Text>} className='shadow-md'>

              <div className="info-item">
                <Text className="text-base">{t('employer.orders.total')}</Text>
                <Text className="text-base font-bold">{getTotalPrice().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
              </div>
              {selectedVoucher && <div className="info-item">
                <Text className="flex items-center text-base"><RiDiscountPercentLine />&ensp;{t('employer.orders.discount')}</Text>
                <Text className="text-base font-bold">{selectedVoucher?.discount} %</Text>
              </div>}
              <Divider />
              <div className="flex items-center justify-between voucher">
                <Button type="primary" onClick={() => setIsModalVisible(true)} className='voucher-button'>{t('employer.orders.couponCode')}</Button>
                {selectedVoucher && <Flex align='center' gap={8}>
                  <Button danger type='text' icon={<CloseOutlined />} onClick={() => setSelectedVoucher(null)}></Button>
                  <Text className="selected-voucher">{selectedVoucher.code}</Text></Flex>
                }
              </div>
              <div className="mt-5 info-item">
                <Text className="text-base">{t('employer.orders.total')}</Text>
                <Flex gap={8}>
                  {selectedVoucher && <Text type='danger' className="text-base font-bold " delete>{getTotalPrice().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>}
                  <Text className="text-base font-bold">{getTotalWithTax().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
                </Flex>
              </div>
              <div className="actions">
                <Button className="btn-checkout" type="primary" onClick={handleCreateOrder}>{t('employer.orders.orderDetail')}</Button>
              </div>
            </Card>
          </Col>
        </Row>
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
