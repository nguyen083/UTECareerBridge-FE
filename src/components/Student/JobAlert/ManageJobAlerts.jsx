import { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Typography, Modal, message, Switch, Badge, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BoxContainer from '../../Generate/BoxContainer';
import notification from '../../../services/api/notification';
import { getAllJobCategories, getAllJobLevels, getAllIndustry } from '../../../services/apiService';
import { MdNotificationsActive } from 'react-icons/md';

const { Title, Text } = Typography;
const { confirm } = Modal;

const ManageJobAlerts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [jobAlerts, setJobAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState({});
  const [levels, setLevels] = useState({});
  const [industries, setIndustries] = useState({});
  const userId = useSelector(state => state.user.userId);

  // Fetch job alerts
  const fetchJobAlerts = async () => {
    setLoading(true);
    try {
      const response = await notification.getJobAlerts(userId);
      if (response.status === 'OK') {
        setJobAlerts(response.data);
      } else {
        message.error('Không thể tải thông báo việc làm');
      }
    } catch (error) {
      console.error('Error fetching job alerts:', error);
      message.error('Đã xảy ra lỗi khi tải thông báo việc làm');
    } finally {
      setLoading(false);
    }
  };

  // Fetch reference data (categories, levels, industries)
  const fetchReferenceData = async () => {
    try {
      // Fetch categories and convert to object for easy lookup
      const categoriesRes = await getAllJobCategories();
      const categoriesMap = {};
      categoriesRes.data.forEach(category => {
        categoriesMap[category.jobCategoryId] = category.jobCategoryName;
      });
      setCategories(categoriesMap);

      // Fetch levels and convert to object for easy lookup
      const levelsRes = await getAllJobLevels();
      const levelsMap = {};
      levelsRes.data.forEach(level => {
        levelsMap[level.jobLevelId] = level.nameLevel;
      });
      setLevels(levelsMap);

      // Fetch industries and convert to object for easy lookup
      const industriesRes = await getAllIndustry();
      const industriesMap = {};
      industriesRes.data.forEach(industry => {
        industriesMap[industry.industryId] = industry.industryName;
      });
      setIndustries(industriesMap);
    } catch (error) {
      console.error('Error fetching reference data:', error);
    }
  };

  useEffect(() => {
    fetchJobAlerts();
    fetchReferenceData();
  }, [userId]);

  // Handle delete job alert
  const handleDelete = (alertId) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa thông báo việc làm này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Thao tác này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await notification.deleteJobAlert(alertId);
          if (response.status === 'OK') {
            message.success('Xóa thông báo việc làm thành công');
            fetchJobAlerts(); // Refresh the list
          } else {
            message.error('Không thể xóa thông báo việc làm');
          }
        } catch (error) {
          console.error('Error deleting job alert:', error);
          message.error('Đã xảy ra lỗi khi xóa thông báo việc làm');
        }
      },
    });
  };

  // Handle edit job alert - navigate to edit page
  const handleEdit = (alertId) => {
    navigate(`/student/job-alerts/edit/${alertId}`);
  };
  
  // Handle add new job alert - navigate to create page
  const handleAdd = () => {
    navigate('/student/job-alerts/create');
  };

  // Format frequency for display
  const formatFrequency = (frequency) => {
    const frequencyMap = {
      'DAILY': 'Mỗi ngày',
      'WEEKLY': 'Mỗi tuần',
      'MONTHLY': 'Mỗi tháng'
    };
    return frequencyMap[frequency] || frequency;
  };

  // Format notification methods for display
  const getNotificationMethods = (alert) => {
    const methods = [];
    if (alert.notifyByEmail) methods.push('Email');
    if (alert.notifyByApp) methods.push('Ứng dụng');
    return methods.join(', ');
  };

  // Get level names from IDs
  const getLevelNames = (levelIds) => {
    if (!levelIds || levelIds.length === 0) return 'Tất cả cấp bậc';
    return levelIds.map(id => levels[id] || `Cấp bậc ${id}`).join(', ');
  };

  // Get industry names from IDs
  const getIndustryNames = (industryIds) => {
    if (!industryIds || industryIds.length === 0) return 'Tất cả lĩnh vực';
    return industryIds.map(id => industries[id] || `Lĩnh vực ${id}`).join(', ');
  };

  // Table columns
  const columns = [
    {
      title: 'Tiêu chí tìm kiếm',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      render: (text, record) => (
        <div>
          <Text strong>{text || 'Tất cả công việc'}</Text>
          <div>
            <Text type="secondary">
              {categories[record.jobCategoryId] || 'Chưa chọn ngành nghề'}
            </Text>
          </div>
          {record.location && (
            <Tag color="blue">{record.location}</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Cấp bậc',
      dataIndex: 'level',
      key: 'level',
      render: (levelIds) => getLevelNames(levelIds),
    },
    {
      title: 'Lương tối thiểu',
      dataIndex: 'minSalary',
      key: 'minSalary',
      render: (salary) => salary ? `${salary.toLocaleString('vi-VN')} VND` : 'Không giới hạn',
    },
    {
      title: 'Lĩnh vực công ty',
      dataIndex: 'companyField',
      key: 'companyField',
      render: (industryIds) => getIndustryNames(industryIds),
      ellipsis: true,
    },
    {
      title: 'Tần suất',
      dataIndex: 'frequency',
      key: 'frequency',
      render: (frequency) => formatFrequency(frequency),
    },
    {
      title: 'Nhận thông báo qua',
      key: 'notificationMethods',
      render: (_, record) => getNotificationMethods(record),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record.id)}
            type="primary"
            ghost
          />
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
            type="primary" 
            danger
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <BoxContainer width="100%" className="shadow-md">
        <div className="title1 flex items-center justify-between">
          <div className="flex items-center">
            <MdNotificationsActive size={24} className="mr-2" />
            Quản lý thông báo việc làm
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Tạo mới
          </Button>
        </div>
      </BoxContainer>

      <BoxContainer width="100%" className="shadow-md">
        <Table
          columns={columns}
          dataSource={jobAlerts}
          rowKey="id"
          loading={loading}
          locale={{
            emptyText: 'Bạn chưa tạo thông báo việc làm nào. Tạo ngay để nhận thông tin công việc phù hợp!'
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }}
        />
      </BoxContainer>
    </>
  );
};

export default ManageJobAlerts;