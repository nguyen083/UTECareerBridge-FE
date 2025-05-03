import React, { useState, useEffect } from 'react';
import { Typography, Button, Alert, Spin } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import BoxContainer from '../../Generate/BoxContainer';
import CVBuilder from './CVBuilder';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getAllCV } from '../../../services/apiService';

const { Title, Text } = Typography;

const CVBuilderPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [existingCVs, setExistingCVs] = useState([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const user = useSelector(state => state.student);

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      setLoading(true);
      const response = await getAllCV();
      
      if (response && response.data) {
        // Filter to only include CV Builder created CVs
        const builderCVs = response.data.filter(cv => cv.template);
        setExistingCVs(builderCVs);
      }
    } catch (error) {
      console.error('Error fetching CVs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedCV(null);
    setShowBuilder(true);
  };

  const handleEditCV = (cv) => {
    setSelectedCV(cv);
    setShowBuilder(true);
  };

  const handleFinish = () => {
    // Refresh CV list after creating/editing
    fetchCVs();
    setShowBuilder(false);
  };

  if (loading) {
    return (
      <BoxContainer className="shadow-md">
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <Text style={{ display: 'block', marginTop: 16 }}>{t('common.loading')}</Text>
        </div>
      </BoxContainer>
    );
  }

  if (showBuilder) {
    return <CVBuilder onFinish={handleFinish} existingCvData={selectedCV} />;
  }

  return (
    <>
      <BoxContainer className="shadow-md">
        <div className="page-header">
          <div>
            <Title level={3}>{t('cv.builder.pageTitle')}</Title>
            <Text type="secondary">{t('cv.builder.pageDescription')}</Text>
          </div>
          <Button 
            type="primary"
            icon={<FileAddOutlined />}
            onClick={handleCreateNew}
          >
            {t('cv.builder.createNew')}
          </Button>
        </div>

        {existingCVs.length === 0 ? (
          <Alert
            type="info"
            message={t('cv.builder.noExistingCVs')}
            description={t('cv.builder.createFirstCV')}
            showIcon
            style={{ marginTop: 24 }}
          />
        ) : (
          <div className="cv-list">
            {/* List existing CVs that were created with the builder */}
            {/* This could be implemented in the future */}
            
          </div>
        )}
      </BoxContainer>

      <BoxContainer className="shadow-md">
        <div className="features-section">
          <Title level={4}>{t('cv.builder.features.title')}</Title>

          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">✏️</div>
              <Title level={5}>{t('cv.builder.features.dragDrop.title')}</Title>
              <Text>{t('cv.builder.features.dragDrop.description')}</Text>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🎨</div>
              <Title level={5}>{t('cv.builder.features.templates.title')}</Title>
              <Text>{t('cv.builder.features.templates.description')}</Text>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <Title level={5}>{t('cv.builder.features.responsive.title')}</Title>
              <Text>{t('cv.builder.features.responsive.description')}</Text>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">💾</div>
              <Title level={5}>{t('cv.builder.features.save.title')}</Title>
              <Text>{t('cv.builder.features.save.description')}</Text>
            </div>
          </div>
        </div>
      </BoxContainer>

      <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .features-section {
          margin-top: 16px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }

        .feature-item {
          padding: 16px;
          border-radius: 8px;
          background-color: #f9f9f9;
          text-align: center;
        }

        .feature-icon {
          font-size: 32px;
          margin-bottom: 16px;
        }
      `}</style>
    </>
  );
};

export default CVBuilderPage;