import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Typography, 
  Button, 
  Space, 
  Tag, 
  Descriptions, 
  Divider, 
  Card,
  Avatar,
  Tooltip
} from 'antd';
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  UserOutlined, 
  ClockCircleOutlined,
  InfoCircleOutlined,
  BookOutlined,
  ShareAltOutlined,
  HeartOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const EventDetail = () => {
  // Mock data chi tiết sự kiện
  const eventDetail = {
    event_id: 1,
    event_title: 'Ngày Hội Tuyển Dụng Công Nghệ Thông Tin 2024',
    event_description: `Sự kiện kết nối trực tiếp giữa sinh viên CNTT và các doanh nghiệp hàng đầu. 
    Bạn sẽ có cơ hội:
    - Trực tiếp phỏng vấn với các nhà tuyển dụng
    - Tham dự các workshop chuyên sâu
    - Nhận các suất thực tập và việc làm hấp dẫn`,
    event_datetime: '2024-06-15 09:00:00',
    event_location: 'Hội trường Đại học Bách Khoa, 268 Lý Thường Kiệt, Q.10, TP.HCM',
    event_image: 'https://res.cloudinary.com/utejobhub/image/upload/v1728728442/admin/event/ngay_hoi_viec_lam.jpg',
    event_type: ['Tuyển Dụng', 'Workshop', 'Thực Tập'],
    registration_deadline: '2024-06-10 23:59:59',
    max_participants: 500,
    current_participants: 320,
    organizer: {
      name: 'Trung tâm Hỗ trợ Sinh viên',
      logo: 'https://via.placeholder.com/100',
      contact: 'support@university.edu.vn'
    },
    sponsors: [
      { name: 'FPT Software', logo: 'https://via.placeholder.com/80' },
      { name: 'Viettel', logo: 'https://via.placeholder.com/80' }
    ],
    agenda: [
      { time: '09:00', activity: 'Đăng ký và welcome coffee' },
      { time: '10:00', activity: 'Khai mạc và giới thiệu' },
      { time: '11:00', activity: 'Phiên giới thiệu việc làm' },
      { time: '14:00', activity: 'Workshop kỹ năng phỏng vấn' }
    ]
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* Ảnh sự kiện */}
      <img 
        src={eventDetail.event_image} 
        alt={eventDetail.event_title}
        style={{ 
          width: '100%', 
          height: '400px', 
          objectFit: 'cover', 
          borderRadius: '12px',
          marginBottom: '24px'
        }}
      />

      <Row gutter={[24, 24]}>
        {/* Thông tin chính */}
        <Col xs={24} md={16}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={2}>{eventDetail.event_title}</Title>

            {/* Thẻ loại sự kiện */}
            <Space>
              {eventDetail.event_type.map(type => (
                <Tag color="blue" key={type}>{type}</Tag>
              ))}
            </Space>

            {/* Mô tả sự kiện */}
            <Paragraph>
              {eventDetail.event_description}
            </Paragraph>

            {/* Chi tiết sự kiện */}
            <Card>
              <Descriptions column={1}>
                <Descriptions.Item 
                  label={<Space><CalendarOutlined /> Thời Gian</Space>}
                >
                  {new Date(eventDetail.event_datetime).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item 
                  label={<Space><EnvironmentOutlined /> Địa Điểm</Space>}
                >
                  {eventDetail.event_location}
                </Descriptions.Item>
                <Descriptions.Item 
                  label={<Space><ClockCircleOutlined /> Hạn Đăng Ký</Space>}
                >
                  {new Date(eventDetail.registration_deadline).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item 
                  label={<Space><UserOutlined /> Số Lượng</Space>}
                >
                  {eventDetail.current_participants} / {eventDetail.max_participants} người
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Chương trình sự kiện */}
            <Card title="Chương Trình Chi Tiết">
              {eventDetail.agenda.map((item, index) => (
                <div 
                  key={index} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '12px',
                    padding: '8px',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  <Text strong>{item.time}</Text>
                  <Text>{item.activity}</Text>
                </div>
              ))}
            </Card>
          </Space>
        </Col>

        {/* Sidebar */}
        <Col xs={24} md={8}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Thông tin nhà tổ chức */}
            <Card>
              <Card.Meta
                avatar={<Avatar src={eventDetail.organizer.logo} />}
                title={eventDetail.organizer.name}
                description={eventDetail.organizer.contact}
              />
            </Card>

            {/* Nhà tài trợ */}
            <Card title="Nhà Tài Trợ">
              <Space>
                {eventDetail.sponsors.map(sponsor => (
                  <Tooltip title={sponsor.name} key={sponsor.name}>
                    <Avatar src={sponsor.logo} size={64} />
                  </Tooltip>
                ))}
              </Space>
            </Card>

            {/* Nút hành động */}
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                block 
                size="large" 
                icon={<BookOutlined />}
              >
                Đăng Ký Ngay
              </Button>
              <Button 
                block 
                size="large" 
                icon={<HeartOutlined />}
              >
                Quan Tâm
              </Button>
              <Button 
                block 
                size="large" 
                icon={<ShareAltOutlined />}
              >
                Chia Sẻ Sự Kiện
              </Button>
            </Space>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default EventDetail;