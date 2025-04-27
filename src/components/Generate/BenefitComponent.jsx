import React, { useMemo } from 'react';
import { Card, Typography, Tooltip } from 'antd';
import * as Icons from "react-icons/fa";
import './BenefitCard.scss';

const { Title, Text } = Typography;

// Map của các từ khóa để xác định theme cho phúc lợi
const THEME_KEYWORDS = {
  education: ['học', 'đào tạo', 'học phí', 'phát triển', 'giáo dục', 'đại học', 'kỹ năng', 'trường', 'khóa học'],
  health: ['sức khỏe', 'bảo hiểm', 'y tế', 'khám', 'bệnh', 'chăm sóc', 'thể thao', 'gym', 'thể dục'],
  financial: ['lương', 'thưởng', 'tài chính', 'tiền', 'phụ cấp', 'thu nhập', 'trợ cấp', 'đãi ngộ'],
  leisure: ['giải trí', 'du lịch', 'nghỉ', 'phép', 'team building', 'sự kiện', 'tiệc', 'vui chơi', 'nghỉ mát'],
  work: ['làm việc', 'văn phòng', 'thiết bị', 'môi trường', 'linh hoạt', 'từ xa', 'đồ ăn', 'cơ sở vật chất']
};

const BenefitCard = ({ benefitName, description, benefitIcon, size = 'small' }) => {
  // Xác định theme dựa trên tên và mô tả phúc lợi
  const theme = useMemo(() => {
    const lowerName = (benefitName || '').toLowerCase();
    const lowerDesc = (description || '').toLowerCase();
    const combinedText = lowerName + ' ' + lowerDesc;
    
    for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
      if (keywords.some(keyword => combinedText.includes(keyword))) {
        return theme;
      }
    }
    
    // Default theme
    return 'leisure';
  }, [benefitName, description]);
  
  // Lấy component Icon từ props hoặc sử dụng default
  const IconComponent = useMemo(() => {
    if (Icons[benefitIcon]) {
      return React.createElement(Icons[benefitIcon]);
    } else if (theme === 'education') {
      return React.createElement(Icons.FaGraduationCap);
    } else if (theme === 'health') {
      return React.createElement(Icons.FaHeartbeat);
    } else if (theme === 'financial') {
      return React.createElement(Icons.FaMoneyBillWave);
    } else if (theme === 'work') {
      return React.createElement(Icons.FaLaptop);
    } else {
      return React.createElement(Icons.FaStar);
    }
  }, [benefitIcon, theme]);

  return (
    <div className={`benefit-card-wrapper theme-${theme}`}>
      <Tooltip title={description}>
        <Card className={`benefit-card ${size}`} bordered={false}>
          <div className="benefit-content">
            <div className="benefit-icon-wrapper">
              <span className="benefit-icon">
                {IconComponent}
              </span>
            </div>
            
            <div className="benefit-text">
              <Title level={5} className="benefit-title">
                {benefitName}
              </Title>
              <Text className="benefit-description">
                {description}
              </Text>
            </div>
          </div>
          
          {/* Background thẩm mỹ */}
          <div className="benefit-bg"></div>
        </Card>
      </Tooltip>
    </div>
  );
};

export default BenefitCard;
