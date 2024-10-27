import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Popconfirm,
  message,
  Tag,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  InboxOutlined
} from '@ant-design/icons';
import { getAllUsers } from '../../../services/apiService';

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
      title: 'Họ',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Tên',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: true,
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      key: 'dob',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status]}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title={`Bạn có chắc chắn muốn xóa người dùng này?`}
            onConfirm={() => onDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const columns = [...baseColumns.slice(0, 2), ...additionalColumns, ...baseColumns.slice(2)];

  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);

      const queryParams = {
        role: userType, // Filter by user type
        page: params.page || pagination.current - 1, // API expects 0-based index
        size: params.pageSize || pagination.pageSize,
        sort: params.sorting || sorting,
        keyword: params.keyword || searchText,
        ...params.additionalParams,
      };

      const response = await getAllUsers(queryParams);

      if (response.status === 'OK') {
        setUsers(response.data.userResponses);
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
//   useEffect(() => {
//     fetchUsers();
//   }, []);


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
      page: 1
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
          <Input.Search
            placeholder="Tìm kiếm người dùng..."
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
          >
            Làm mới
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