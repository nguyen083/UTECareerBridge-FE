import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Modal, Tag, Space, Select, Pagination, Empty, Skeleton, Flex, message } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, FilterOutlined, InfoCircleOutlined, StarOutlined } from '@ant-design/icons';
import BoxContainer from '../../Generate/BoxContainer';
import { getAllEvent } from '../../../services/apiService';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lọc theo loại sự kiện
  const [eventType, setEventType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);

      const params = {
        page: currentPage - 1,
        size: pageSize,
        eventType: eventType
      }
      // Gọi API lấy dữ liệu sự kiện
      const response = await getAllEvent(params).then(res => {
        if (res.status === 'OK') {
          // message.success(res.message);
          setEvents(res.data.eventResponses);
          setTotal(res.data.totalPages);
        } else {
          message.error(res.message);
        }
      }).catch(error => {
        console.error('Lỗi tải sự kiện:', error);
      }).finally(() => {
        setLoading(false);
      });
    };

    fetchEvents();
  }, [currentPage, pageSize, eventType]);

  const showEventDetails = (event) => {
    console.log(event);
    navigate(`/event-detail/${event?.eventId}`);
  };



  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
      {/* Tiêu đề và thanh lọc loại sự kiện */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <BoxContainer width='100%'>
          <Flex justify='space-between' align='center'>
            <div className='title1'>Danh Sách Sự Kiện</div>
            <Select
              size='large'
              allowClear
              style={{ width: 200 }}
              placeholder="Lọc theo loại"
              onChange={(value) => setEventType(value)}
              prefix={<FilterOutlined />}
            >
              <Select.Option value="SEMINAR">Hội thảo</Select.Option>
              <Select.Option value="CONFERENCE">Hội nghị</Select.Option>
              <Select.Option value="WORKSHOP">Hội thảo chuyên đề</Select.Option>
              <Select.Option value="CAREER_FAIR">Hội chợ việc làm</Select.Option>
              <Select.Option value="WEBINAR">Hội thảo trực tuyến</Select.Option>
              {/* Các loại sự kiện khác có thể thêm vào đây */}
            </Select>
          </Flex>
        </BoxContainer>
      </div>

      <BoxContainer width='100%'>
        {/* Danh sách sự kiện */}
        {loading ? (
          <Row gutter={[16, 16]}>
            {[...Array(4)].map((_, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Skeleton active />
              </Col>
            ))}
          </Row>
        ) : events.length > 0 ? (
          <>
            <Row gutter={[16, 16]}>
              {events.map(event => (
                <Col key={event?.eventId} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    onClick={() => showEventDetails(event)}
                    hoverable
                    cover={
                      <img
                        alt={event.eventTitle}
                        src={event.eventImage}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    }
                  >
                    <Card.Meta
                      title={event.eventTitle}
                      description={
                        <Space direction="vertical">
                          <Text>
                            <CalendarOutlined /> {event.eventDate}
                          </Text>
                          <Text>
                            <EnvironmentOutlined /> {event.eventLocation}
                          </Text>
                          <Space>
                            <Tag color="blue">{event?.eventType}</Tag>
                          </Space>
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Phân trang */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '24px'
            }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger
                pageSizeOptions={['8', '16', '24']}
                onShowSizeChange={(current, size) => setPageSize(size)}
              />
            </div>
          </>
        ) : (
          <Empty description="Không tìm thấy sự kiện" />
        )}
      </BoxContainer>
    </div>
  );
};

export default EventPage;
