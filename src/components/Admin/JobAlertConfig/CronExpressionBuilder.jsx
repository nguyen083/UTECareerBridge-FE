import React, { useState, useEffect } from 'react';
import {
  Form,
  Select,
  InputNumber,
  Radio,
  Space,
  Card,
  Typography,
  Row,
  Col,
  Checkbox,
  TimePicker,
  Tag,
  Alert,
  Divider
} from 'antd';
import { ClockCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './CronExpressionBuilder.scss';

const { Title, Text } = Typography;
const { Option } = Select;

const CronExpressionBuilder = ({ value, onChange, disabled = false }) => {
  const [frequency, setFrequency] = useState('daily');
  const [customSettings, setCustomSettings] = useState({
    minute: 0,
    hour: 9,
    dayOfMonth: 1,
    month: 1,
    dayOfWeek: 1,
    selectedDaysOfWeek: [1], // Monday
    selectedDaysOfMonth: [1],
    selectedMonths: [1],
    time: dayjs('09:00', 'HH:mm')
  });

  // Frequency options
  const frequencyOptions = [
    { value: 'hourly', label: 'Hàng giờ', icon: '⏰' },
    { value: 'daily', label: 'Hàng ngày', icon: '📅' },
    { value: 'weekly', label: 'Hàng tuần', icon: '📆' },
    { value: 'monthly', label: 'Hàng tháng', icon: '🗓️' },
    { value: 'custom', label: 'Tùy chỉnh', icon: '⚙️' }
  ];

  // Days of week
  const daysOfWeek = [
    { value: 1, label: 'Thứ 2' },
    { value: 2, label: 'Thứ 3' },
    { value: 3, label: 'Thứ 4' },
    { value: 4, label: 'Thứ 5' },
    { value: 5, label: 'Thứ 6' },
    { value: 6, label: 'Thứ 7' },
    { value: 0, label: 'Chủ nhật' }
  ];

  // Generate cron expression based on current settings
  const generateCronExpression = () => {
    const { minute, hour, selectedDaysOfWeek, selectedDaysOfMonth, selectedMonths } = customSettings;
    
    switch (frequency) {
      case 'hourly':
        return `${minute} * * * *`;
      
      case 'daily':
        return `${minute} ${hour} * * *`;
      
      case 'weekly':
        const daysOfWeekStr = selectedDaysOfWeek.join(',');
        return `${minute} ${hour} * * ${daysOfWeekStr}`;
      
      case 'monthly':
        const daysOfMonthStr = selectedDaysOfMonth.join(',');
        return `${minute} ${hour} ${daysOfMonthStr} * *`;
      
      case 'custom':
        return value || '0 9 * * *';
      
      default:
        return '0 9 * * *';
    }
  };

  // Parse cron expression to extract settings
  const parseCronExpression = (cronExpr) => {
    if (!cronExpr) return;
    
    const parts = cronExpr.split(' ');
    if (parts.length !== 5) return;
    
    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    
    setCustomSettings(prev => ({
      ...prev,
      minute: parseInt(minute) || 0,
      hour: parseInt(hour) || 9,
      dayOfMonth: parseInt(dayOfMonth) || 1,
      selectedDaysOfWeek: dayOfWeek === '*' ? [1] : dayOfWeek.split(',').map(d => parseInt(d)),
      selectedDaysOfMonth: dayOfMonth === '*' ? [1] : dayOfMonth.split(',').map(d => parseInt(d))
    }));
  };

  // Get human-readable description of cron expression
  const getCronDescription = () => {
    const { minute, hour, selectedDaysOfWeek, selectedDaysOfMonth } = customSettings;
    
    switch (frequency) {
      case 'hourly':
        return `Chạy vào phút ${minute} của mỗi giờ`;
      
      case 'daily':
        return `Chạy hàng ngày lúc ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      case 'weekly':
        const dayNames = selectedDaysOfWeek.map(day => 
          daysOfWeek.find(d => d.value === day)?.label
        ).join(', ');
        return `Chạy hàng tuần vào ${dayNames} lúc ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      case 'monthly':
        const dayNumbers = selectedDaysOfMonth.join(', ');
        return `Chạy hàng tháng vào ngày ${dayNumbers} lúc ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      case 'custom':
        return 'Cấu hình tùy chỉnh';
      
      default:
        return 'Chưa cấu hình';
    }
  };

  // Handle frequency change
  const handleFrequencyChange = (newFrequency) => {
    setFrequency(newFrequency);
    
    // Set default settings for each frequency
    switch (newFrequency) {
      case 'hourly':
        setCustomSettings(prev => ({ ...prev, minute: 0 }));
        break;
      case 'daily':
        setCustomSettings(prev => ({ ...prev, minute: 0, hour: 9 }));
        break;
      case 'weekly':
        setCustomSettings(prev => ({ 
          ...prev, 
          minute: 0, 
          hour: 9, 
          selectedDaysOfWeek: [1] 
        }));
        break;
      case 'monthly':
        setCustomSettings(prev => ({ 
          ...prev, 
          minute: 0, 
          hour: 9, 
          selectedDaysOfMonth: [1] 
        }));
        break;
    }
  };

  // Handle time change
  const handleTimeChange = (time) => {
    if (time) {
      setCustomSettings(prev => ({
        ...prev,
        hour: time.hour(),
        minute: time.minute(),
        time: time
      }));
    }
  };

  // Update parent component when settings change
  useEffect(() => {
    const cronExpr = generateCronExpression();
    if (onChange && cronExpr !== value) {
      onChange(cronExpr);
    }
  }, [frequency, customSettings]);

  // Parse initial value
  useEffect(() => {
    if (value) {
      parseCronExpression(value);
    }
  }, []);

  const renderFrequencySettings = () => {
    switch (frequency) {
      case 'hourly':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>Cấu hình chạy hàng giờ:</Text>
            <Form.Item label="Phút">
              <InputNumber
                min={0}
                max={59}
                value={customSettings.minute}
                onChange={(value) => setCustomSettings(prev => ({ ...prev, minute: value || 0 }))}
                disabled={disabled}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Space>
        );

      case 'daily':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>Cấu hình chạy hàng ngày:</Text>
            <Form.Item label="Thời gian">
              <TimePicker
                format="HH:mm"
                value={customSettings.time}
                onChange={handleTimeChange}
                disabled={disabled}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Space>
        );

      case 'weekly':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>Cấu hình chạy hàng tuần:</Text>
            <Form.Item label="Thời gian">
              <TimePicker
                format="HH:mm"
                value={customSettings.time}
                onChange={handleTimeChange}
                disabled={disabled}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item label="Các ngày trong tuần">
              <Checkbox.Group
                value={customSettings.selectedDaysOfWeek}
                onChange={(checkedValues) => 
                  setCustomSettings(prev => ({ ...prev, selectedDaysOfWeek: checkedValues }))
                }
                disabled={disabled}
              >
                <Row>
                  {daysOfWeek.map(day => (
                    <Col span={8} key={day.value}>
                      <Checkbox value={day.value}>{day.label}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Space>
        );

      case 'monthly':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>Cấu hình chạy hàng tháng:</Text>
            <Form.Item label="Thời gian">
              <TimePicker
                format="HH:mm"
                value={customSettings.time}
                onChange={handleTimeChange}
                disabled={disabled}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item label="Ngày trong tháng">
              <Select
                mode="multiple"
                placeholder="Chọn ngày"
                value={customSettings.selectedDaysOfMonth}
                onChange={(values) => 
                  setCustomSettings(prev => ({ ...prev, selectedDaysOfMonth: values }))
                }
                disabled={disabled}
                style={{ width: '100%' }}
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <Option key={day} value={day}>Ngày {day}</Option>
                ))}
              </Select>
            </Form.Item>
          </Space>
        );

      case 'custom':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>Cấu hình tùy chỉnh:</Text>
            <Alert
              message="Sử dụng biểu thức Cron"
              description="Format: phút giờ ngày tháng thứ_trong_tuần. Ví dụ: '0 9 * * 1-5' (9h sáng từ thứ 2 đến thứ 6)"
              type="info"
              icon={<InfoCircleOutlined />}
              showIcon
            />
          </Space>
        );

      default:
        return null;
    }
  };

  return (
    <div className="cron-expression-builder">
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div className="frequency-header">
            <ClockCircleOutlined style={{ marginRight: 8 }} />
            <Title level={5} style={{ margin: 0 }}>Cấu hình thời gian thông báo</Title>
          </div>

          <Divider />

          {/* Frequency Selection */}
          <div className="frequency-selection">
            <Text strong>Tần suất gửi thông báo:</Text>
            <Radio.Group 
              value={frequency} 
              onChange={(e) => handleFrequencyChange(e.target.value)}
              disabled={disabled}
              style={{ width: '100%', marginTop: 12 }}
            >
              <Row gutter={[16, 16]}>
                {frequencyOptions.map(option => (
                  <Col span={12} key={option.value}>
                    <Radio.Button 
                      value={option.value} 
                      style={{ width: '100%', textAlign: 'center' }}
                    >
                      <Space>
                        <span>{option.icon}</span>
                        {option.label}
                      </Space>
                    </Radio.Button>
                  </Col>
                ))}
              </Row>
            </Radio.Group>
          </div>

          <Divider />

          {/* Frequency-specific Settings */}
          <div className="frequency-settings">
            {renderFrequencySettings()}
          </div>

          <Divider />

          {/* Generated Expression and Description */}
          <div className="expression-output">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Biểu thức Cron: </Text>
                <Tag color="blue" style={{ fontFamily: 'monospace' }}>
                  {generateCronExpression()}
                </Tag>
              </div>
              
              <div>
                <Text strong>Mô tả: </Text>
                <Text type="secondary" italic>
                  {getCronDescription()}
                </Text>
              </div>
            </Space>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default CronExpressionBuilder;
