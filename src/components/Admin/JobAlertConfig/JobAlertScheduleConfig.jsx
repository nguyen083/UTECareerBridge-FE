import React, { useState, useEffect } from 'react';
import {
  Card, 
  Table, 
  Typography, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select,
  message,
  Tooltip,
  Badge,
  Space,
  Divider,
  Switch,
  Alert,
  Tabs,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  ClockCircleOutlined,
  InfoCircleOutlined,
  SaveOutlined
} from '@ant-design/icons';
import BoxContainer from '../../Generate/BoxContainer';
import axios from '../../../utils/axiosCustomize';
import './JobAlertScheduleConfig.scss';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Enum cho tần suất phù hợp với backend FrequencyEnum
const FrequencyEnum = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY', 
  MONTHLY: 'MONTHLY',
  HOURLY: 'HOURLY'
};

// API để quản lý cấu hình lịch trình gửi thông báo việc làm
const jobAlertScheduleApi = {  // Lấy danh sách cấu hình lịch trình
  getConfigs: async () => {
    try {
      const response = await axios.get('/admin/job-alert-schedule/configs');
      console.log('API Response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching job alert configs:', error);
      throw error;
    }
  },
  
  // Cập nhật cấu hình lịch trình bằng query params
  updateConfig: async (frequency, cronExpression) => {
    try {
      const response = await axios.post('/admin/job-alert-schedule/configs/update', null, {
        params: {
          frequency,
          cronExpression
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating job alert config:', error);
      throw error;
    }
  },
  
  // Vô hiệu hóa cấu hình lịch trình
  disableConfig: async (frequency) => {
    try {
      const response = await axios.post('/admin/job-alert-schedule/configs/disable', null, {
        params: {
          frequency
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error disabling job alert config:', error);
      throw error;
    }
  },
  
  // Kích hoạt cấu hình lịch trình
  enableConfig: async (frequency) => {
    try {
      const response = await axios.post('/job-alert-schedule/configs/enable', null, {
        params: {
          frequency
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error enabling job alert config:', error);
      throw error;
    }
  }
};

const JobAlertScheduleConfig = () => {
  const [configList, setConfigList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [form] = Form.useForm();

  // Danh sách các mẫu cron expression dễ hiểu cho admin
  const cronExpressionSamples = [
    { label: 'Hàng ngày lúc 8:00 AM', value: '0 0 8 * * ?' },
    { label: 'Hàng ngày lúc 6:00 PM', value: '0 0 18 * * ?' },
    { label: 'Thứ 2 hàng tuần lúc 8:00 AM', value: '0 0 8 ? * MON' },
    { label: 'Thứ 6 hàng tuần lúc 9:00 AM', value: '0 0 9 ? * FRI' },
    { label: 'Ngày 1 hàng tháng lúc 8:00 AM', value: '0 0 8 1 * ?' },
    { label: 'Mỗi 2 tiếng', value: '0 0 */2 * * ?' },
    { label: 'Mỗi 30 phút', value: '0 */30 * * * ?' },
  ];
  
  // Mô tả dễ hiểu cho các tần suất gửi thông báo
  const frequencyDescriptions = {
    DAILY: 'Mỗi ngày',
    WEEKLY: 'Mỗi tuần',
    MONTHLY: 'Mỗi tháng',
    HOURLY: 'Mỗi giờ'
  };
  // Fetch dữ liệu
  const fetchConfigs = async () => {
    try {
      setLoading(true);
      console.log('Fetching configs...'); // Debug log
      const data = await jobAlertScheduleApi.getConfigs();
      console.log('Received data:', data); // Debug log
      console.log('Data type:', typeof data, 'Is array:', Array.isArray(data)); // Debug log
      
      // Đảm bảo data là array
      if (Array.isArray(data)) {
        setConfigList(data);
        console.log('Config list updated:', data); // Debug log
      } else {
        console.error('Data is not an array:', data);
        setConfigList([]);
      }
    } catch (error) {
      console.error('Error in fetchConfigs:', error); // Debug log
      message.error('Không thể tải danh sách cấu hình lịch trình gửi thông báo');
      setConfigList([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const showEditModal = (config) => {
    setEditingConfig(config);
    form.setFieldsValue({
      frequency: config.frequency,
      cronExpression: config.cronExpression,
    });
    setModalVisible(true);
  };

  const showAddModal = () => {
    setEditingConfig(null);
    form.resetFields();
    form.setFieldsValue({
      active: true
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      await jobAlertScheduleApi.updateConfig(values.frequency, values.cronExpression);
      message.success('Cập nhật cấu hình thành công');
      setModalVisible(false);
      fetchConfigs();
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật cấu hình');
    }
  };
  const toggleConfigStatus = async (config) => {
        try {
      if (config.active) {
        await jobAlertScheduleApi.disableConfig(config.frequency);
        message.success(`Đã vô hiệu hóa cấu hình ${frequencyDescriptions[config.frequency]}`);
      } else {
        await jobAlertScheduleApi.enableConfig(config.frequency);
        message.success(`Đã kích hoạt cấu hình ${frequencyDescriptions[config.frequency]}`);
      }
      fetchConfigs();
    } catch (error) {
      message.error('Có lỗi xảy ra khi thay đổi trạng thái cấu hình');
    }
  };
  const handleCronSelect = (value) => {
    form.setFieldsValue({ cronExpression: value });
  };
  
  const columns = [
    {
      title: 'Tần suất',
      dataIndex: 'frequency',
      key: 'frequency',
      width: '20%',      render: (frequency) => (
        <div className="frequency-cell">
          <Badge 
            status={frequencyBadgeStatus(frequency)} 
            text={frequencyDescriptions[frequency] || frequency} 
            className="text-sm font-medium"
          />
        </div>
      ),
    },
    {
      title: 'Biểu thức Cron',
      dataIndex: 'cronExpression',
      key: 'cronExpression',
      width: '25%',      render: (cronExpression) => (
        <Space direction="vertical" size="small" className="w-full">
          <Text 
            code 
            className="bg-gray-100 px-2 py-1 rounded text-xs font-mono"
          >
            {cronExpression}
          </Text>
        </Space>
      ),
    },    {
      title: 'Mô tả thời gian',
      key: 'description',
      width: '45%',      render: (_, record) => (
        <Text className="text-gray-600">
          {getCronDescription(record.cronExpression)}
        </Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '15%',
      align: 'center',      render: (_, record) => (
        <Button 
          type="primary"
          ghost
          icon={<EditOutlined />}
          onClick={() => showEditModal(record)}
          className="rounded-md h-9 px-3 hover:scale-105 transition-transform duration-200"
        >
          Sửa
        </Button>
      ),
    },
  ];

  // Hàm helper để hiển thị trạng thái phù hợp dựa trên tần suất
  const frequencyBadgeStatus = (frequency) => {
    const map = {
      DAILY: 'success',
      WEEKLY: 'processing',
      MONTHLY: 'warning',
      HOURLY: 'error',
    };
    return map[frequency] || 'default';
  };

  // Hàm chuyển đổi biểu thức cron sang văn bản dễ đọc
  const getCronDescription = (cronExpression) => {
    // Tìm mô tả phù hợp từ danh sách mẫu
    const sample = cronExpressionSamples.find(s => s.value === cronExpression);
    if (sample) {
      return sample.label;
    }
    
    // Logic để phân tích biểu thức cron thành văn bản dễ đọc
    // Đây chỉ là phiên bản đơn giản, trong thực tế bạn có thể cần logic phức tạp hơn
    const parts = cronExpression.split(' ');
    if (parts.length !== 6) return 'Biểu thức cron không hợp lệ';
    
    const [second, minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    
    if (second === '0' && minute === '0') {
      if (hour.includes('*/')) {
        const interval = hour.replace('*/', '');
        return `Mỗi ${interval} giờ`;
      } else if (hour !== '*') {
        return `Hàng ngày lúc ${hour}:00`;
      }
    }
    
    if (minute.includes('*/')) {
      const interval = minute.replace('*/', '');
      return `Mỗi ${interval} phút`;
    }
    
    return 'Lịch trình tùy chỉnh';
  };  return (
    <div className="job-alert-config-container p-4 bg-gray-50 min-h-screen">
      <BoxContainer>
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 text-white p-6 rounded-xl text-left text-2xl font-semibold mb-0 shadow-lg transform transition-all duration-300 hover:scale-105">
          🔔 Cấu hình lịch trình thông báo công việc
        </div>
      </BoxContainer>
      
      <BoxContainer>
        <Card 
          className="rounded-xl shadow-xl border border-gray-200 transition-all duration-300 hover:shadow-2xl"
          bodyStyle={{ padding: '0' }}
        >
          <div className="p-6">          <Alert
            message="💡 Thông tin cấu hình"
            description={
              <div className="mt-2">
                Quản lý lịch trình gửi thông báo công việc tự động đến sinh viên dựa trên tiêu chí mà họ đã thiết lập. 
                <br />
                Sử dụng biểu thức Cron để định nghĩa chính xác thời điểm thực hiện gửi thông báo.
              </div>
            }
            type="info"
            showIcon
            className="mb-6 rounded-lg border border-blue-200"
          />
          
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <Title level={4} className="m-0 text-gray-800">
                Danh sách cấu hình
              </Title>
              <Text type="secondary" className="text-sm">
                Quản lý các lịch trình gửi thông báo công việc
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showAddModal}
              size="large"
              className="rounded-lg h-10 px-5 bg-gradient-to-r from-blue-500 to-blue-600 border-none shadow-md hover:shadow-lg transition-all duration-300"
            >
              Thêm cấu hình mới
            </Button>
          </div>
            <Table
            columns={columns}
            dataSource={configList}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} cấu hình`
            }}
            className="rounded-lg overflow-hidden shadow-sm"
            rowClassName={(record, index) => 
              index % 2 === 0 ? 'bg-gray-50 hover:bg-blue-50 transition-colors duration-200' : 'bg-white hover:bg-blue-50 transition-colors duration-200'
            }          />
          </div>
        </Card>

        <Modal
          title={
            <div className="text-lg font-semibold text-gray-800 py-2">
              {editingConfig ? "✏️ Chỉnh sửa cấu hình lịch trình" : "➕ Thêm cấu hình lịch trình"}
            </div>
          }
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={750}
          className="top-5"
          bodyStyle={{ 
            padding: '24px',
            maxHeight: '70vh',
            overflowY: 'auto'
          }}
        >          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-4"
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="frequency"
                  label={
                    <span className="font-semibold text-gray-800">
                      📅 Tần suất thông báo
                    </span>
                  }
                  rules={[{ required: true, message: 'Vui lòng chọn tần suất' }]}
                >
                  <Select 
                    placeholder="Chọn tần suất thông báo"
                    size="large"
                    className="rounded-lg"
                  >
                    <Option value="DAILY">🌅 Hàng ngày</Option>
                    <Option value="WEEKLY">📆 Hàng tuần</Option>
                    <Option value="MONTHLY">🗓️ Hàng tháng</Option>
                    <Option value="HOURLY">⏰ Hàng giờ</Option>
                  </Select>
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-semibold text-gray-800">
                      🕒 Thời gian mẫu
                    </span>
                  }
                  tooltip="Chọn một mẫu thời gian để tự động điền biểu thức Cron"
                >
                  <Select
                    placeholder="Chọn thời gian mẫu"
                    onChange={handleCronSelect}
                    allowClear
                    size="large"
                    className="rounded-lg"
                  >
                    {cronExpressionSamples.map(sample => (
                      <Option key={sample.value} value={sample.value}>
                        {sample.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="cronExpression"
              label={
                <span className="font-semibold text-gray-800">
                  ⚙️ Biểu thức Cron
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng nhập biểu thức Cron' }]}
              tooltip="Định dạng: second minute hour dayOfMonth month dayOfWeek"
            >
              <Input 
                placeholder="0 0 8 * * ?" 
                size="large"
                className="rounded-lg font-mono text-sm"
              />
            </Form.Item>

            <Card 
              size="small" 
              className="bg-gray-50 rounded-lg mb-6"
            >
              <Paragraph className="m-0">
                <Text strong className="text-blue-600">💡 Cách đọc biểu thức Cron: </Text>
                <Text code className="bg-blue-50 px-2 py-1 rounded">
                  second minute hour dayOfMonth month dayOfWeek
                </Text>
              </Paragraph>
              
              <div className="mt-3">
                <Text strong className="text-gray-600">Ví dụ:</Text>
                <ul className="mt-2 mb-0 space-y-1">
                  <li><Text code>0 0 8 * * ?</Text> - 🌅 Hàng ngày lúc 8:00 sáng</li>
                  <li><Text code>0 0 18 * * ?</Text> - 🌆 Hàng ngày lúc 6:00 chiều</li>
                  <li><Text code>0 0 8 ? * MON</Text> - 📅 Mỗi thứ Hai lúc 8:00 sáng</li>
                  <li><Text code>0 0 8 1 * ?</Text> - 🗓️ Ngày mùng 1 hàng tháng lúc 8:00 sáng</li>
                </ul>
              </div>
            </Card>

            <Divider className="my-6" />

            <div className="text-right">
              <Button 
                onClick={() => setModalVisible(false)}
                size="large"
                className="mr-3 rounded-lg h-10"
              >
                Hủy bỏ
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
                size="large"
                className="rounded-lg h-10 px-5 bg-gradient-to-r from-green-500 to-green-600 border-none shadow-md hover:shadow-lg"
              >
                {editingConfig ? '💾 Cập nhật' : '💾 Lưu cấu hình'}
              </Button>
            </div>
          </Form></Modal>
      </BoxContainer>
    </div>
  );
};

export default JobAlertScheduleConfig;
