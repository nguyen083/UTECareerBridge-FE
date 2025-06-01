import React, { useState } from 'react';
import { Tree, Input, Button, Space, Modal, Form, Select, message } from 'antd';
import { 
  ClockCircleOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  CalendarOutlined,
  FieldTimeOutlined
} from '@ant-design/icons';
import './TimeConfigTree.scss';

const { Option } = Select;

const TimeConfigTree = ({ 
  schedules = [], 
  onAdd, 
  onEdit, 
  onDelete,
  loading = false 
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [form] = Form.useForm();

  // Cron expression templates
  const cronTemplates = {
    daily: {
      '08:00': '0 8 * * *',
      '09:00': '0 9 * * *',
      '12:00': '0 12 * * *',
      '18:00': '0 18 * * *',
      '20:00': '0 20 * * *'
    },
    weekly: {
      'Monday 09:00': '0 9 * * 1',
      'Wednesday 14:00': '0 14 * * 3',
      'Friday 17:00': '0 17 * * 5',
      'Sunday 10:00': '0 10 * * 0'
    },
    monthly: {
      '1st day 09:00': '0 9 1 * *',
      '15th day 14:00': '0 14 15 * *',
      'Last day 17:00': '0 17 L * *'
    },
    hourly: {
      'Every hour': '0 * * * *',
      'Every 2 hours': '0 */2 * * *',
      'Every 4 hours': '0 */4 * * *',
      'Every 6 hours': '0 */6 * * *'
    }
  };

  // Convert cron expression to human readable description
  const getCronDescription = (cronExpr) => {
    const descriptions = {
      '0 8 * * *': 'Hàng ngày lúc 8:00 sáng',
      '0 9 * * *': 'Hàng ngày lúc 9:00 sáng',
      '0 12 * * *': 'Hàng ngày lúc 12:00 trưa',
      '0 18 * * *': 'Hàng ngày lúc 6:00 chiều',
      '0 20 * * *': 'Hàng ngày lúc 8:00 tối',
      '0 9 * * 1': 'Thứ 2 hàng tuần lúc 9:00 sáng',
      '0 14 * * 3': 'Thứ 4 hàng tuần lúc 2:00 chiều',
      '0 17 * * 5': 'Thứ 6 hàng tuần lúc 5:00 chiều',
      '0 10 * * 0': 'Chủ nhật hàng tuần lúc 10:00 sáng',
      '0 9 1 * *': 'Ngày 1 hàng tháng lúc 9:00 sáng',
      '0 14 15 * *': 'Ngày 15 hàng tháng lúc 2:00 chiều',
      '0 17 L * *': 'Ngày cuối tháng lúc 5:00 chiều',
      '0 * * * *': 'Mỗi giờ',
      '0 */2 * * *': 'Mỗi 2 giờ',
      '0 */4 * * *': 'Mỗi 4 giờ',
      '0 */6 * * *': 'Mỗi 6 giờ'
    };
    return descriptions[cronExpr] || cronExpr;
  };

  // Build tree data from schedules
  const buildTreeData = () => {
    const frequencyGroups = {
      daily: { title: 'Hàng ngày', key: 'daily', icon: <CalendarOutlined />, children: [] },
      weekly: { title: 'Hàng tuần', key: 'weekly', icon: <CalendarOutlined />, children: [] },
      monthly: { title: 'Hàng tháng', key: 'monthly', icon: <CalendarOutlined />, children: [] },
      hourly: { title: 'Theo giờ', key: 'hourly', icon: <FieldTimeOutlined />, children: [] }
    };

    schedules.forEach(schedule => {
      const scheduleNode = {
        title: (
          <div className="schedule-tree-item">
            <div className="schedule-info">
              <ClockCircleOutlined className="schedule-icon" />
              <div className="schedule-details">
                <div className="schedule-name">{schedule.name || getCronDescription(schedule.cronExpression)}</div>
                <div className="schedule-desc">{getCronDescription(schedule.cronExpression)}</div>
                <div className="schedule-status">
                  <span className={`status-badge ${schedule.isActive ? 'active' : 'inactive'}`}>
                    {schedule.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                  </span>
                </div>
              </div>
            </div>
            <div className="schedule-actions">
              <Button 
                type="text" 
                size="small" 
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(schedule);
                }}
              />
              <Button 
                type="text" 
                size="small" 
                icon={<DeleteOutlined />}
                danger
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(schedule.id);
                }}
              />
            </div>
          </div>
        ),
        key: `schedule-${schedule.id}`,
        isLeaf: true,
        data: schedule
      };

      if (frequencyGroups[schedule.frequency]) {
        frequencyGroups[schedule.frequency].children.push(scheduleNode);
      }
    });

    // Only return groups that have children
    return Object.values(frequencyGroups).filter(group => group.children.length > 0);
  };

  const handleAdd = () => {
    setEditingSchedule(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    form.setFieldsValue({
      name: schedule.name,
      frequency: schedule.frequency,
      cronExpression: schedule.cronExpression,
      description: schedule.description,
      isActive: schedule.isActive
    });
    setIsModalVisible(true);
  };

  const handleDelete = (scheduleId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa cấu hình thời gian này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        onDelete && onDelete(scheduleId);
      }
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingSchedule) {
        // Edit existing schedule
        await onEdit({ ...editingSchedule, ...values });
      } else {
        // Add new schedule
        await onAdd(values);
      }
      
      setIsModalVisible(false);
      form.resetFields();
      message.success(editingSchedule ? 'Cập nhật thành công!' : 'Thêm cấu hình thành công!');
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleFrequencyChange = (frequency) => {
    form.setFieldValue('cronExpression', '');
  };

  const handleTemplateSelect = (cronExpr) => {
    form.setFieldValue('cronExpression', cronExpr);
  };

  const selectedFrequency = form.getFieldValue('frequency');
  const availableTemplates = selectedFrequency ? cronTemplates[selectedFrequency] || {} : {};

  return (
    <div className="time-config-tree">
      <div className="tree-header">
        <h3>
          <ClockCircleOutlined /> Cấu hình thời gian thông báo
        </h3>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAdd}
          loading={loading}
        >
          Thêm cấu hình
        </Button>
      </div>

      <div className="tree-content">
        <Tree
          showIcon
          defaultExpandAll
          treeData={buildTreeData()}
          className="schedule-tree"
        />
      </div>

      <Modal
        title={editingSchedule ? 'Chỉnh sửa cấu hình thời gian' : 'Thêm cấu hình thời gian'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            isActive: true,
            frequency: 'daily'
          }}
        >
          <Form.Item
            name="name"
            label="Tên cấu hình"
            rules={[
              { required: true, message: 'Vui lòng nhập tên cấu hình!' }
            ]}
          >
            <Input placeholder="VD: Thông báo việc làm hàng ngày" />
          </Form.Item>

          <Form.Item
            name="frequency"
            label="Tần suất"
            rules={[
              { required: true, message: 'Vui lòng chọn tần suất!' }
            ]}
          >
            <Select placeholder="Chọn tần suất" onChange={handleFrequencyChange}>
              <Option value="hourly">Theo giờ</Option>
              <Option value="daily">Hàng ngày</Option>
              <Option value="weekly">Hàng tuần</Option>
              <Option value="monthly">Hàng tháng</Option>
            </Select>
          </Form.Item>

          {selectedFrequency && Object.keys(availableTemplates).length > 0 && (
            <Form.Item label="Chọn mẫu có sẵn">
              <div className="cron-templates">
                {Object.entries(availableTemplates).map(([desc, cronExpr]) => (
                  <Button
                    key={cronExpr}
                    size="small"
                    onClick={() => handleTemplateSelect(cronExpr)}
                    className="template-btn"
                  >
                    {desc}
                  </Button>
                ))}
              </div>
            </Form.Item>
          )}

          <Form.Item
            name="cronExpression"
            label="Biểu thức Cron"
            rules={[
              { required: true, message: 'Vui lòng nhập biểu thức cron!' }
            ]}
          >
            <Input 
              placeholder="VD: 0 9 * * * (9:00 hàng ngày)"
              addonAfter={
                <Button 
                  type="link" 
                  size="small"
                  onClick={() => window.open('https://crontab.guru/', '_blank')}
                >
                  Trợ giúp
                </Button>
              }
            />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea 
              rows={3} 
              placeholder="Mô tả chi tiết về lịch trình thông báo này..."
            />
          </Form.Item>

          <Form.Item 
            name="isActive" 
            label="Trạng thái"
            valuePropName="checked"
          >
            <Select>
              <Option value={true}>Đang hoạt động</Option>
              <Option value={false}>Tạm dừng</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TimeConfigTree;
