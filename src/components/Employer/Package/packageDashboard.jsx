import { useEffect, useState } from 'react';
import { Button, Card, Divider, Layout, Row, Col, Typography, Alert, Pagination, message, Flex } from 'antd';
import BoxContainer from '../../Generate/BoxContainer';
import './packageDashboard.scss';
import { getAllPackages, addPackageToCart } from '../../../services/apiService';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const ServiceMarketplace = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
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
        message.error(t('employer.services.addToCartError'));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error(t('employer.services.addToCartErrorGeneric'));
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentServices = services.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (<>
    <BoxContainer className='shadow-md'>
      <div className='title1'>{t('employer.services.title')}</div>
    </BoxContainer>
    <BoxContainer className='shadow-md'>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ backgroundColor: '#E6F7FF', padding: '20px' }}>
          <Alert
            message={<div style={{ fontWeight: 'bold' }}>{t('employer.services.importantNotice')}</div>}
            description={t('employer.services.noticeDescription')}
            type="info"
            showIcon
          />
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, backgroundColor: '#FFFFFF' }}>
            <Divider />
            <Row gutter={[24, 24]} style={{ marginTop: '20px' }}>
              {currentServices.map((service) => (
                <Col key={service.packageId} xs={24} sm={12} md={8}>
                  <Card
                    title={<Title level={5} style={{ color: '#52C41A' }}>{service.packageName}</Title>}
                    className='service-card'
                    actions={[
                      <Flex key="actions" justify='space-around' align='center'>
                        <Button
                          type="default"
                          onClick={() => handleAddToCart(service)}
                          className='add-to-cart-btn'
                          icon={<ShoppingCartOutlined />}
                        >
                          {t('employer.services.addToCart')}
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => handleCheckout(service)}
                          className='buy-now-btn'
                        >
                          {t('employer.services.buyNow')}
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