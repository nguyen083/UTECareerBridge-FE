import React from 'react';
import { Row, Col, Card, Typography, Badge } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import './CVTemplateSelector.scss';

const { Text } = Typography;

/**
 * CV Template Selector Component
 * Displays available CV templates in a grid with preview
 */
const CVTemplateSelector = ({ templates, selectedTemplate, onSelect }) => {
  return (
    <div className="cv-template-selector">
      <Row gutter={[16, 16]}>
        {templates.map(template => {
          const isSelected = selectedTemplate.id === template.id;
          return (
            <Col xs={24} sm={12} md={8} key={template.id}>
              <Card
                hoverable
                className={`template-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelect(template)}
                bodyStyle={{ padding: 12 }}
              >
                <div 
                  className="template-preview" 
                  style={{ 
                    border: isSelected ? `2px solid ${template.color}` : '1px solid #eee',
                    backgroundColor: '#fff'
                  }}
                >
                  {isSelected && (
                    <div 
                      className="selected-badge"
                      style={{ backgroundColor: template.color }}
                    >
                      <CheckOutlined />
                    </div>
                  )}
                  
                  {/* Template preview mockup */}
                  <div className="template-content">
                    {/* Header area */}
                    <div 
                      className="template-header" 
                      style={{ 
                        backgroundColor: `${template.color}40`,
                      }}
                    ></div>
                    
                    {/* Body content */}
                    <div className="template-body">
                      <div className="template-section" 
                        style={{ width: '60%', backgroundColor: `${template.color}20` }}></div>
                      <div className="template-section" 
                        style={{ width: '100%', backgroundColor: `${template.color}20` }}></div>
                      
                      <div className="template-lines">
                        <div className="template-line"></div>
                        <div className="template-line"></div>
                        <div className="template-line"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: 8 }}>
                  <Text strong>{template.name}</Text>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                    {template.description}
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default CVTemplateSelector;