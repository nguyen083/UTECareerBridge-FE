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
  Tooltip,
  Collapse
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
import BoxContainer from '../../Generate/BoxContainer';
import HtmlContent from '../../Generate/HtmlContent';

const { Title, Text, Paragraph } = Typography;

const EventDetail = () => {
  // Mock data chi tiết sự kiện
  const eventDetail = {
    eventId: 1,
    eventTitle: 'Ngày Hội Tuyển Dụng Công Nghệ Thông Tin 2024',
    eventDescription: `Sự kiện kết nối trực tiếp giữa sinh viên CNTT và các doanh nghiệp hàng đầu. 
    Bạn sẽ có cơ hội:
    - Trực tiếp phỏng vấn với các nhà tuyển dụng
    - Tham dự các workshop chuyên sâu
    - Nhận các suất thực tập và việc làm hấp dẫn`,
    eventDatetime: '2024-06-15 09:00:00',
    eventLocation: 'Hội trường Đại học Bách Khoa, 268 Lý Thường Kiệt, Q.10, TP.HCM',
    eventImage: 'https://res.cloudinary.com/utejobhub/image/upload/v1728728442/admin/event/ngay_hoi_viec_lam.jpg',
    eventType: 'Tuyển Dụng',
    registrationDeadline: '2024-06-10 23:59:59',
    maxParticipants: 500,
    currentParticipants: 320,
    organizer: {
      name: 'Trung tâm Hỗ trợ Sinh viên',
      logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1731551121/student/ua3ccjvawfxkb1yqqirb.png',
      contact: 'support@student.hcmute.edu.vn'
    },
    timeline: [
      { timelineStart: '09:00', timelineTitle: 'Đăng ký và welcome coffee' },
      { timelineStart: '10:00', timelineTitle: 'Khai mạc và giới thiệu' },
      { timelineStart: '11:00', timelineTitle: 'Phiên giới thiệu việc làm' },
      { timelineStart: '14:00', timelineTitle: 'Workshop kỹ năng phỏng vấn' }
    ]
  };

  return (
    <BoxContainer padding={'0'}>
      <div style={{ maxWidth: '100%', margin: '0 auto', padding: '24px' }}>
        {/* Ảnh sự kiện */}
        <img
          src={eventDetail.eventImage}
          alt={eventDetail.eventTitle}
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
              <Title level={2}>{eventDetail.eventTitle}</Title>

              {/* Thẻ loại sự kiện */}
              <Space>
                <Tag color="blue" key={eventDetail.eventType}>{eventDetail.eventType}</Tag>
              </Space>

              {/* Mô tả sự kiện */}
              <HtmlContent htmlString={eventDetail.eventDescription} />

              {/* Chi tiết sự kiện */}
              <Card className='box_shadow'>
                <Descriptions column={1}>
                  <Descriptions.Item
                    label={<Space><CalendarOutlined /> Thời Gian</Space>}
                  >
                    {new Date(eventDetail.eventDatetime).toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={<Space><EnvironmentOutlined /> Địa Điểm</Space>}
                  >
                    {eventDetail.eventLocation}
                  </Descriptions.Item>
                  {/* <Descriptions.Item
                    label={<Space><UserOutlined /> Số Lượng</Space>}
                  >
                    {eventDetail.currentParticipants} / {eventDetail.maxParticipants} người
                  </Descriptions.Item> */}
                </Descriptions>
              </Card>

              {/* Chương trình sự kiện */}
              <Card title="Chương Trình Chi Tiết" className='box_shadow'>
                {eventDetail.timeline.map((item, index) => (
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
                    <Collapse bordered={false} style={{ width: '100%' }}>
                      <Collapse.Panel
                        key={index}
                        header={item.timelineStart}
                      >
                        <Text>{item.timelineTitle}</Text>
                      </Collapse.Panel>
                    </Collapse>
                  </div>
                ))}
              </Card>
            </Space>
          </Col>

          {/* Sidebar */}
          <Col xs={24} md={8}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Thông tin nhà tổ chức */}
              <Card className='box_shadow'>
                <Card.Meta
                  avatar={<Avatar src={eventDetail.organizer.logo} size={64} />}
                  title={eventDetail.organizer.name}
                  description={eventDetail.organizer.contact}
                />
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
    </BoxContainer>
  );
};

export default EventDetail;