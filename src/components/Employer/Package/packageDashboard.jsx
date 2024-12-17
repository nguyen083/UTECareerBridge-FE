import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Layout, Row, Col, Typography, Alert, Pagination, message, Flex } from 'antd';
import BoxContainer from '../../Generate/BoxContainer';
import './packageDashboard.scss';
import { getAllPackages, addPackageToCart } from '../../../services/apiService';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const { Header, Content } = Layout;
const { Title, Text } = Typography;
const ServiceMarketplace = () => {
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6
  const navigate = useNavigate();
  const handleAddToCart = async (service) => {
    try {
      const values = {
        packageId: service.packageId,
        quantity: 1
      };

      const response = await addPackageToCart(values);

      if (response.status === 'OK') {
        message.success(response.message);
      } else {
        message.error("Không thể thêm sản phẩm vào giỏ hàng.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.");
    }
  };

  const handleCheckout = async (service) => {
    await handleAddToCart(service);
    navigate('/employer/cart');

  };
  const fetchPackages = async () => {
    try {
      const response = await getAllPackages();
      setServices(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchPackages();
  }, []);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // const currentServices = services.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (<>
    <BoxContainer>
      <div className='title1'>Danh sách gói dịch vụ</div>
    </BoxContainer>
    <BoxContainer>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ backgroundColor: '#E6F7FF', padding: '20px' }}>
          <Alert
            message={<div style={{ fontWeight: 'bold' }}>Lưu ý quan trọng</div>}
            description="Nhằm tránh rủi ro mạo danh và lừa đảo, chúng tôi khuyến nghị quý khách hàng không chuyển khoản vào bất cứ tài khoản cá nhân nào và chỉ thực hiện thanh toán vào các tài khoản chính thức của chúng tôi."
            type="info"
            showIcon
          />
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, backgroundColor: '#FFFFFF' }}>
            <Divider />
            <Row gutter={[24, 24]} style={{ marginTop: '20px' }}>
              {services.map((service) => (
                <Col key={service.packageId} xs={24} sm={12} md={8}>
                  <Card
                    title={<Title level={5} style={{ color: '#52C41A' }}>{service.packageName}</Title>}
                    className='service-card'
                    actions={[
                      <Flex justify='space-around' align='center'>
                        <Button
                          type="default"
                          onClick={() => handleAddToCart(service)}
                          className='add-to-cart-btn'
                          icon={<ShoppingCartOutlined />}
                        >
                          Thêm vào giỏ
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => handleCheckout(service)}
                          className='buy-now-btn'
                        >
                          Mua ngay
                        </Button>
                      </Flex>
                    ]}
                  >
                    <Text strong className='price-text'>
                      {service.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      <span style={{ color: 'red' }}> *</span>
                    </Text>
                    <Divider />
                    <Text className="description-text">{service.description}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
            <Divider />
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={services.length}
              onChange={handlePageChange}
              align='center'
              style={{ textAlign: 'center', marginTop: '20px' }}
            />
          </div>
        </Content>
      </Layout>
    </BoxContainer>
  </>
  );
};

export default ServiceMarketplace;