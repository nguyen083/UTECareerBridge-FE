import React, { useState, useEffect } from 'react';
import './TableListUser.scss';
import {
  Table,
  Button,
  Input,
  Space,
  Popconfirm,
  message,
  Tag,
  Tooltip,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  InboxOutlined,
  SearchOutlined,
  PrinterOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { getAllUsers } from '../../../services/apiService';
const { Search } = Input;
const TableListUser = ({
  userType,
  additionalColumns = [],
  onEdit,
  onDelete
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sorting, setSorting] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const statusColors = {
    ACTIVE: 'success',
    INACTIVE: 'error',
    PENDING: 'warning',
    BLOCKED: 'error'
  };

  const baseColumns = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
      width: '5%',
      align: 'right'
  },
    {
      title: 'Họ',
      dataIndex: 'lastName',
      key: 'lastName',
      width: '10%',
      align: 'center'
    },
    {
      title: 'Tên',
      dataIndex: 'firstName',
      key: 'firstName',
      width: '10%',
      sorter: true,
      align: 'center',
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      width: '20%'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center'
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
      width: '20%'
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      key: 'dob',
      align: 'center'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      align: 'center',
      render: (active) => {
        const displayStatus = active ? 'Hoạt động' : 'Bị khóa'; 
        const statusKey = active ? 'ACTIVE' : 'BLOCKED'; 
        return (
          <Tag color={statusColors[statusKey]}>
            {displayStatus}
          </Tag>
        );
      }
    },
    {
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              onEdit(record);
            }}
          />
         {userType === 'employer' && (
            <Button
              icon={<EyeOutlined />}
            />
          )}
            <Button
              type="primary"
              danger
              onClick={() => onDelete(record.key)}
              icon={<DeleteOutlined />}
            />
        </Space>
      ),
    },
  ];

  const columns = [...baseColumns.slice(0, 2), ...additionalColumns, ...baseColumns.slice(2)];

  const fetchUsers = async (params = {}) => {
    console.log('Fetching users with params:', pagination);
    try {
      setLoading(true);

      const queryParams = {
        role: userType, 
        page: params.page || pagination.current - 1, 
        size: params.pageSize || pagination.pageSize,
        sort: params.sorting || sorting,
        keyword: params.keyword || searchText,
        ...params.additionalParams,
      };

      const response = await getAllUsers(queryParams);

      if (response.status === 'OK') {
        const dataWithIndex = response.data.userResponses.map((user, idx) => ({
          ...user,
          key: user.userId,
          index: (queryParams.page * queryParams.size) + idx + 1
        }));
        setUsers(dataWithIndex);       
        setPagination({
          ...pagination,
          total: response.data.totalElements,
          current: params.page || pagination.current,
        });
      } else {
        message.error('Không thể tải danh sách người dùng');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi tải danh sách người dùng');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize, userType]);


  // Handle table change
  const handleTableChange = (newPagination, filters, sorter) => {
    const newSorting = sorter.order === 'ascend' ? 'asc' : 'desc';
    setSorting(newSorting);

    fetchUsers({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      sorting: newSorting,
      additionalParams: {
        ...filters
      }
    });
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 }); // Reset to first page

    fetchUsers({
      keyword: value,
      page: 0
    });
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchUsers();
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 16 }}>
          <Search
            size='large'
            placeholder="Tìm kiếm người dùng..."
            allowClear
            onSearch={handleSearch}
            style={{ width: '400px' }}
            className='search-input'
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
          >
            Làm mới
          </Button>
          <Button>
            <PrinterOutlined />
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} người dùng`
        }}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
        locale={{
          emptyText: (
            <div className='p-5'>
              <InboxOutlined style={{ fontSize: '50px', marginBottom: '8px' }} />
              <div>Không có dữ liệu</div>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default TableListUser;