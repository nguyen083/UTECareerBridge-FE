import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Modal, 
  Tag, 
  Space, 
  Input, 
  Select, 
  Pagination,
  Empty,
  Skeleton
} from 'antd';
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  FilterOutlined,
  SearchOutlined,
  InfoCircleOutlined,
  StarOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Bộ lọc và tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Giả sử dữ liệu từ API
  const mockEvents = [
    {
      event_id: 1,
      event_title: 'Ngày Hội Tuyển Dụng CNTT',
      event_description: 'Sự kiện kết nối sinh viên CNTT với các nhà tuyển dụng hàng đầu',
      event_datetime: '2024-06-15 09:00:00',
      event_location: 'Hội trường Đại học Bách Khoa',
      event_image: 'https://res.cloudinary.com/utejobhub/image/upload/v1728728442/admin/event/ngay_hoi_viec_lam.jpg',
      event_type: ['Tuyển Dụng', 'Sinh Viên'],
      registration_deadline: '2024-06-10',
      max_participants: 500,
      created_at: '2024-05-01 10:00:00',
      updated_at: '2024-05-15 14:30:00'
    },
    {
      event_id: 2,
      event_title: 'Workshop Kỹ Năng Phỏng Vấn',
      event_description: 'Hướng dẫn chi tiết về kỹ năng phỏng vấn chuyên nghiệp',
      event_datetime: '2024-07-20 14:00:00',
      event_location: 'Trung tâm Hội nghị Quốc gia',
      event_image: 'https://res.cloudinary.com/utejobhub/image/upload/v1728728442/admin/event/ngay_hoi_viec_lam.jpg',
      event_type: ['Workshop', 'Phát Triển Kỹ Năng'],
      registration_deadline: '2024-07-15',
      max_participants: 200,
      created_at: '2024-05-10 11:15:00',
      updated_at: '2024-05-20 16:45:00'
    }
  ];

  useEffect(() => {
    // Mô phỏng việc tải dữ liệu từ API
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Trong thực tế, sẽ là API call
        setTimeout(() => {
          setEvents(mockEvents);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Lỗi tải sự kiện:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Lọc và phân trang sự kiện
  const filteredEvents = events.filter(event => 
    (searchTerm === '' || 
      event.event_title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.event_description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!eventType || event.event_type.includes(eventType))
  );

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * pageSize, 
    currentPage * pageSize
  );

  const showEventDetails = (event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
      {/* Tiêu đề và thanh tìm kiếm */}
      <div style={{ 
        marginBottom: '24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Title level={2} style={{ margin: 0 }}>
          Danh Sách Sự Kiện
        </Title>
        
        <Space>
          <Input 
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm sự kiện"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            allowClear
            style={{ width: 200 }}
            placeholder="Lọc theo loại"
            onChange={(value) => setEventType(value)}
            prefix={<FilterOutlined />}
          >
            <Option value="Tuyển Dụng">Tuyển Dụng</Option>
            <Option value="Workshop">Workshop</Option>
            <Option value="Sinh Viên">Sinh Viên</Option>
          </Select>
        </Space>
      </div>

      {/* Danh sách sự kiện */}
      {loading ? (
        <Row gutter={[16, 16]}>
          {[...Array(4)].map((_, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Skeleton active />
            </Col>
          ))}
        </Row>
      ) : filteredEvents.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {paginatedEvents.map(event => (
              <Col key={event.event_id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <img 
                      alt={event.event_title} 
                      src={event.event_image}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  }
                  actions={[
                    <Button 
                      type="primary" 
                      icon={<InfoCircleOutlined />} 
                      onClick={() => showEventDetails(event)}
                    >
                      Chi Tiết
                    </Button>
                  ]}
                >
                  <Card.Meta 
                    title={event.event_title}
                    description={
                      <Space direction="vertical">
                        <Text>
                          <CalendarOutlined /> {new Date(event.event_datetime).toLocaleString()}
                        </Text>
                        <Text>
                          <EnvironmentOutlined /> {event.event_location}
                        </Text>
                        <Space>
                          {event.event_type.map(type => (
                            <Tag key={type} color="blue">{type}</Tag>
                          ))}
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
              total={filteredEvents.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger
              onShowSizeChange={(current, size) => setPageSize(size)}
            />
          </div>
        </>
      ) : (
        <Empty description="Không tìm thấy sự kiện" />
      )}

      {/* Modal chi tiết sự kiện */}
      {selectedEvent && (
        <Modal
          title={selectedEvent.event_title}
          visible={isModalVisible}
          onCancel={handleCancel}
          width={600}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Đóng
            </Button>,
            <Button 
              key="register" 
              type="primary" 
              icon={<StarOutlined />}
            >
              Đăng Ký Sự Kiện
            </Button>
          ]}
        >
          <img 
            src={selectedEvent.event_image} 
            alt={selectedEvent.event_title}
            style={{ 
              width: '100%', 
              marginBottom: '16px', 
              borderRadius: '8px' 
            }}
          />
          
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Text>
              <CalendarOutlined /> Thời Gian: {new Date(selectedEvent.event_datetime).toLocaleString()}
            </Text>
            <Text>
              <EnvironmentOutlined /> Địa Điểm: {selectedEvent.event_location}
            </Text>
            
            <Title level={4}>Mô Tả Sự Kiện</Title>
            <Text>{selectedEvent.event_description}</Text>
            
            <Space>
              {selectedEvent.event_type.map(type => (
                <Tag key={type} color="blue">{type}</Tag>
              ))}
            </Space>

            <Text type="secondary">
              Hạn đăng ký: {new Date(selectedEvent.registration_deadline).toLocaleDateString()}
            </Text>
            <Text type="secondary">
              Số lượng đăng ký tối đa: {selectedEvent.max_participants}
            </Text>
          </Space>
        </Modal>
      )}
    </div>
  );
};

export default EventPage;