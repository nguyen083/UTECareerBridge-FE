import React from "react";
import { Card, Typography } from "antd";
import * as Icons from "react-icons/fa";
import "./BenefitComponent.scss";

const { Title, Text } = Typography;

const BenefitCard = ({
  benefitName,
  description,
  benefitIcon,
  size = "small",
}) => {
  const IconComponent = Icons[benefitIcon]
    ? React.createElement(Icons[benefitIcon])
    : null;

  return (
    <Card size={size} className="benefit-card-component" hoverable>
      <div className="benefit-content">
        {IconComponent && <div className="benefit-icon">{IconComponent}</div>}
        <div className="benefit-info">
          <Title level={5} className="benefit-title">
            {benefitName}
          </Title>
          <Text className="benefit-description">{description}</Text>
        </div>
      </div>
    </Card>
  );
};

export default BenefitCard;
