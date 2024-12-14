import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Button, Space, Tag, Descriptions, Card, Avatar, Flex, Tooltip, Timeline } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, BookOutlined, ShareAltOutlined, HeartOutlined } from '@ant-design/icons';
import BoxContainer from '../../Generate/BoxContainer';
import HtmlContent from '../../Generate/HtmlContent';
import { useParams } from 'react-router-dom';
import { getEventDetail } from '../../../services/apiService';
import './EventPageDetail.scss';
import { FaDotCircle } from "react-icons/fa";


const { Title, Text, Paragraph } = Typography;

const EventDetail = () => {
  const { id } = useParams();
  const [eventDetail, setEventDetail] = useState({});
  const [timeline, setTimeline] = useState([]);

  const fetchEventDetail = () => {
    getEventDetail(id)
      .then(response => {
        setEventDetail(response.data);
        setTimeline(response.data.timeline.map((item, index) => ({
          key: index,
          label: <Text className='text-hightlight f-18'>{item.timelineStart}</Text>,
          children: (
            <Tooltip color='#4478c0' title={<Text style={{ color: '#ffffff' }} className='f-16'>{item.timelineDescription}</Text>} placement="top">
              <Text className='text-title pe-auto'>{item.timelineTitle}</Text>
            </Tooltip>
          ),
          dot: (
            <FaDotCircle
              style={{
                fontSize: '19px',
              }}
            />
          ),
        })));
      })
      .catch(error => {
        console.error('Lỗi khi lấy chi tiết sự kiện:', error);
      });
  };

  useEffect(() => {
    fetchEventDetail();
  }, [id]);



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
            <Flex vertical gap={24} className='w-100'>
              <Title level={2}>{eventDetail.eventTitle}</Title>

              {/* Thẻ loại sự kiện */}
              <Space>
                <Tag color="blue" key={eventDetail.eventType}>{eventDetail.eventType}</Tag>
              </Space>
              <Card title={<Text className='f-18 text-hightlight'>Mô Tả Sự Kiện</Text>} className='box_shadow'>
                {/* Mô tả sự kiện */}
                <HtmlContent htmlString={eventDetail.eventDescription} />
              </Card>

              {/* Chi tiết sự kiện */}
              <Card className='box_shadow'>
                <Descriptions column={1}>
                  <Descriptions.Item className='d-flex align-center'
                    label={<Space className='text-hightlight'><CalendarOutlined /> Thời Gian diễn ra sự kiện</Space>}
                  >
                    <Text className='text-title'>{eventDetail.eventDate}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item className='d-flex align-center'
                    label={<Space className='text-hightlight'><EnvironmentOutlined /> Địa Điểm</Space>}
                  >
                    <Text className='text-title'>{eventDetail.eventLocation}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Chương trình sự kiện */}
              <Card size='large' title={<Text className='f-18 text-hightlight'>Chi Tiết Chương Trình</Text>} className=' card_box_shadow card_timeline'>

                <Space direction='vertical' size={24} style={{ width: '100%' }}>
                  <Timeline
                    className="custom-timeline"
                    mode='alternate'
                    items={timeline} />
                </Space>
              </Card>
            </Flex>
          </Col>

          {/* Sidebar */}
          <Col xs={24} md={8}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Thông tin nhà tổ chức */}
              <Card className='box_shadow'>
                <Card.Meta
                  avatar={<Avatar src="https://res.cloudinary.com/utejobhub/image/upload/v1731551121/student/ua3ccjvawfxkb1yqqirb.png" size={64} />}
                  title="Trung tâm Hỗ trợ Sinh viên"
                  description="support@student.hcmute.edu.vn"
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
    </BoxContainer >
  );
};

export default EventDetail;