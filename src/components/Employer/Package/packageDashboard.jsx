import { useEffect, useState } from 'react';
import { Button, Card, Badge, Layout, Row, Col, Typography, Alert, Pagination, message, Flex, Skeleton, Tooltip, Tag, Divider } from 'antd';
import BoxContainer from '../../Generate/BoxContainer';
import './packageDashboard.scss';
import { getAllPackages, addPackageToCart } from '../../../services/apiService';
import { ShoppingCartOutlined, CheckCircleFilled, StarFilled, FireFilled, ThunderboltFilled, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Title, Text, Paragraph } = Typography;

// Function to determine if a package is popular
const isPopularPackage = (package_) => {
  return package_.packageName.toLowerCase().includes('premium') || 
         package_.packageName.toLowerCase().includes('gold') || 
         package_.amount > 20;
};

const PackageFeatureList = ({ features }) => {
  // This is a simple placeholder since we don't have actual feature list data
  // In a real implementation, you would map actual features
  const defaultFeatures = [
    { title: 'Job posting', included: true },
    { title: 'Priority listing', included: features?.includes('premium') },
    { title: 'Featured company', included: features?.includes('featured') },
    { title: 'Access to CV database', included: features?.includes('cv') || features?.includes('premium') },
    { title: 'Analytics dashboard', included: features?.includes('premium') },
  ];

  return (
    <div className="feature-list">
      {defaultFeatures.map((feature, index) => (
        <div key={index} className="feature-item">
          <CheckCircleFilled className={feature.included ? 'feature-included' : 'feature-excluded'} />
          <span className={feature.included ? 'feature-text' : 'feature-text disabled'}>{feature.title}</span>
        </div>
      ))}
    </div>
  );
};

const PackageCard = ({ service, onAddToCart, onBuyNow, isPopular, isBestValue }) => {
  const { t } = useTranslation();
  
  // Extract features from package description
  const features = service.description.toLowerCase();
  
  return (
    <Badge.Ribbon 
      text={isPopular ? t('employer.services.mostPopular') : isBestValue ? t('employer.services.bestValue') : null}
      color={isPopular ? '#ff4d4f' : '#52c41a'}
      style={{ display: !isPopular && !isBestValue ? 'none' : 'block' }}
    >
      <Card 
        className={`service-card ${isPopular ? 'popular-card' : isBestValue ? 'best-value-card' : ''}`}
        hoverable
      >
        <div className="card-header">
          <Title level={4} className="package-title">
            {service.packageName}
            {isPopular && <FireFilled className="popular-icon" />}
            {isBestValue && <ThunderboltFilled className="best-value-icon" />}
          </Title>
          
          {service.featureName && (
            <Tag color={isPopular ? 'volcano' : 'blue'} className="feature-tag">
              {service.featureName}
            </Tag>
          )}
          
          <div className="price-container">
            <Text className="price-text">
              {service.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </Text>
            <Text type="secondary" className="price-info">
              {t('employer.services.validFor', { period: service.duration || 30 })}
            </Text>
          </div>
        </div>
        
        <Divider />
        
        <div className="package-content">
          <div className="package-amount">
            <div className="amount-circle">
              <Text className="amount-value">{service.amount}</Text>
            </div>
            <Text className="amount-label">{t('employer.services.jobPostings')}</Text>
          </div>
          
          <Paragraph className="package-description" ellipsis={{ rows: 2, expandable: true }}>
            {service.description}
          </Paragraph>
          
          <PackageFeatureList features={features} />
        </div>
        
        <div className="package-footer">
          <Button
            block
            type="default"
            onClick={() => onAddToCart(service)}
            className="add-to-cart-btn"
            icon={<ShoppingCartOutlined />}
          >
            {t('employer.services.addToCart')}
          </Button>
          
          <Button
            block
            type={isPopular ? 'danger' : 'primary'}
            onClick={() => onBuyNow(service)}
            className={isPopular ? 'buy-now-popular-btn' : 'buy-now-btn'}
          >
            {t('employer.services.buyNow')}
          </Button>
        </div>
      </Card>
    </Badge.Ribbon>
  );
};

const ServiceMarketplace = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
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
        message.success(response.message || t('employer.services.addedToCart'));
      } else {
        message.error(response.message || t('employer.services.addToCartError'));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error(t('employer.services.addToCartErrorGeneric'));
    }
  };

  const handleCheckout = async (service) => {
    try {
      await handleAddToCart(service);
      navigate('/employer/cart');
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await getAllPackages();
      if (response && response.data) {
        setServices(response.data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      message.error(t('employer.services.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentServices = services.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Find best value package (highest amount / price ratio)
  const findBestValuePackage = (packages) => {
    if (!packages || packages.length === 0) return null;
    
    let bestValue = null;
    let bestRatio = 0;
    
    packages.forEach(pkg => {
      const ratio = pkg.amount / pkg.price;
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestValue = pkg.packageId;
      }
    });
    
    return bestValue;
  };
  
  const bestValuePackageId = findBestValuePackage(services);

  return (
    <>
      <BoxContainer className='shadow-md package-header'>
        <div className="package-header-content">
          <div>
            <Title level={3}>{t('employer.services.title')}</Title>
            <Text type="secondary">{t('employer.services.subtitle') || "Choose the perfect package for your recruitment needs"}</Text>
          </div>
          <Button 
            type="primary" 
            className="view-cart-btn"
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate('/employer/cart')}
          >
            {t('employer.services.viewCart')}
          </Button>
        </div>
      </BoxContainer>
      
      <BoxContainer className='shadow-md notice-container'>
        <Alert
          message={<Text strong>{t('employer.services.importantNotice')}</Text>}
          description={
            <div className="notice-content">
              <Paragraph>{t('employer.services.noticeDescription')}</Paragraph>
              <div className="benefit-points">
                <div className="benefit-item">
                  <CheckCircleFilled className="benefit-check" />
                  <Text>{t('employer.services.benefits.reach')}</Text>
                </div>
                <div className="benefit-item">
                  <CheckCircleFilled className="benefit-check" />
                  <Text>{t('employer.services.benefits.visibility')}</Text>
                </div>
                <div className="benefit-item">
                  <CheckCircleFilled className="benefit-check" />
                  <Text>{t('employer.services.benefits.talent')}</Text>
                </div>
              </div>
              <Tooltip title={t('employer.services.contactSales')}>
                <Button type="link" className="contact-sales-link">
                  <InfoCircleOutlined /> {t('employer.services.needHelp')}
                </Button>
              </Tooltip>
            </div>
          }
          type="info"
          showIcon
          className="service-alert"
        />
      </BoxContainer>
      
      <BoxContainer className='shadow-md package-container'>
        {loading ? (
          <div className="skeleton-container">
            <Row gutter={[24, 24]}>
              {[...Array(3)].map((_, index) => (
                <Col key={index} xs={24} sm={12} md={8}>
                  <Card className="skeleton-card">
                    <Skeleton active paragraph={{ rows: 6 }} />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <>
            <div className="packages-header">
              <Title level={4}>{t('employer.services.availablePackages')}</Title>
              <Text type="secondary">{t('employer.services.comparePackages')}</Text>
            </div>
            
            <Row gutter={[24, 24]} className="packages-grid">
              {currentServices.map((service) => {
                const isPopular = isPopularPackage(service);
                const isBestValue = service.packageId === bestValuePackageId && !isPopular;
                
                return (
                  <Col key={service.packageId} xs={24} sm={12} lg={8}>
                    <PackageCard 
                      service={service}
                      onAddToCart={handleAddToCart}
                      onBuyNow={handleCheckout}
                      isPopular={isPopular}
                      isBestValue={isBestValue}
                    />
                  </Col>
                );
              })}
            </Row>
            
            {services.length > itemsPerPage && (
              <div className="pagination-container">
                <Pagination
                  current={currentPage}
                  pageSize={itemsPerPage}
                  total={services.length}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </BoxContainer>
      
      <BoxContainer className='shadow-md faq-container'>
        <Title level={4} className="faq-title">{t('employer.services.faq.title')}</Title>
        <div className="faq-content">
          <div className="faq-item">
            <Title level={5}>{t('employer.services.faq.q1')}</Title>
            <Paragraph>{t('employer.services.faq.a1') || "Our job posting packages remain active for the specified duration from the date of purchase. During this time, you can post jobs until you've used all the job postings included in your package."}</Paragraph>
          </div>
          <div className="faq-item">
            <Title level={5}>{t('employer.services.faq.q2')}</Title>
            <Paragraph>{t('employer.services.faq.a2') || "Yes, your package remains valid for its full duration, and any remaining job postings can be used anytime within that period."}</Paragraph>
          </div>
          <div className="faq-item">
            <Title level={5}>{t('employer.services.faq.q3')}</Title>
            <Paragraph>{t('employer.services.faq.a3') || "Contact our customer support team through the Help Center, and they can assist you with upgrading to a larger package."}</Paragraph>
          </div>
        </div>
      </BoxContainer>
    </>
  );
};

export default ServiceMarketplace;