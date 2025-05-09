import { Row, Col, Card, Typography } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import "./CVTemplateSelector.scss";

const { Text } = Typography;

/**
 * CV Template Selector Component
 * Displays available CV templates in a grid with preview
 */
const CVTemplateSelector = ({ templates, selectedTemplate, onSelect }) => {
  return (
    <div className="cv-template-selector">
      <Row gutter={[16, 16]}>
        {templates.map((template) => {
          const isSelected = selectedTemplate.id === template.id;
          return (
            <Col xs={24} sm={12} md={8} key={template.id}>
              <Card
                hoverable
                className={`template-card ${
                  isSelected ? "selected" : ""
                } h-full`}
                onClick={() => onSelect(template)}
                bodyStyle={{ padding: 12 }}
              >
                <div
                  className="template-preview"
                  style={{
                    border: isSelected
                      ? `2px solid ${template.color}`
                      : "1px solid #eee",
                    backgroundColor: "#fff",
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
                    <img src={template.image} alt={template.name} />
                  </div>
                </div>

                <div style={{ marginTop: 8 }}>
                  <Text strong>{template.name}</Text>
                  <div
                    style={{ fontSize: "12px", color: "#666", marginTop: 4 }}
                  >
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
