import React from 'react';
import { Card, Flex, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Text, Title, Paragraph } = Typography;

const JobCardSmall = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/#');
  };
  return (
    <Card
      onClick={() => handleClick()}
      hoverable
      style={{
        width: "100%",
        borderRadius: 10,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
      bodyStyle={{ padding: 16 }}
    >
      <Flex align='center'>
        <img
          src="https://res.cloudinary.com/utejobhub/image/upload/v1728295183/company/cong_ty_co_phan_gemadept_gemadept_corporation__background.jpg" // Replace with the actual logo URL
          style={{ width: 80, height: 80, borderRadius: 4, marginRight: 12 }}
        />
        <div>
          <Title level={5}
            style={{
              margin: 0,
              whiteSpace: 'nowrap',        // Keeps the text on a single line
              overflow: 'hidden',           // Hides any overflow
              textOverflow: 'ellipsis',     // Adds ellipsis for overflowed text
              maxWidth: 130                 // Optional: set max width to control where it cuts off
            }}>
            Maintenance Engineer Cơ khí
          </Title>
          < Paragraph
            type='secondary'
            style={{
              margin: 0,
              whiteSpace: 'nowrap',        // Keeps the text on a single line
              overflow: 'hidden',           // Hides any overflow
              textOverflow: 'ellipsis',     // Adds ellipsis for overflowed text
              maxWidth: 130                 // Optional: set max width to control where it cuts off
            }}>
            Navigos Search abcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb</Paragraph>
          <div style={{ color: '#ff4d4f', fontSize: 14, margin: '8px 0' }}>
            1,200 - 1,500 <Text style={{ fontSize: 12 }}>VNĐ/tháng</Text>
          </div>
          <Text style={{ fontSize: 14, color: '#666' }}>Bình Dương</Text>
        </div>
      </Flex>
    </Card>
  );
};

export default JobCardSmall;
