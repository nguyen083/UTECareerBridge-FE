import React from 'react';
import { Card, Typography } from 'antd';
import * as Icons from "react-icons/fa";

const { Title, Text } = Typography;

const BenefitCard = ({ benefitName, description, benefitIcon }) => {
    // Kiểm tra xem icon có tồn tại trong thư viện Icons không
    const IconComponent = Icons[benefitIcon] ? React.createElement(Icons[benefitIcon]) : null;

    return (
        <Card
            size='small'
            style={{ borderRadius: 8, backgroundColor: '#f0f5ff' }}
        >
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {IconComponent && (
                    <span style={{ fontSize: 30, color: '#1890ff', marginRight: 8 }}>
                        {IconComponent}
                    </span>
                )}
                <div>
                    <Title level={5} style={{ margin: 0 }}>
                        {benefitName}
                    </Title>
                    <Text>{description}</Text>
                </div>
            </div>
        </Card>
    );
};

export default BenefitCard;
