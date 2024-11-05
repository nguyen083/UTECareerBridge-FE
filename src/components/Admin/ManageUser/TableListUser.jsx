import React, { useState, useEffect } from 'react';
import './TableListUser.scss';
import { Link, useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Input,
  Space,
  Popconfirm,
  message,
  Tag,
  Tooltip,
  Modal,
  Dropdown,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  InboxOutlined,
  DownOutlined,
  SearchOutlined,
  PrinterOutlined,
  EyeOutlined,
  FileExcelOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import { getAllUsers, getCompanyById, exportUserToPdf } from '../../../services/apiService';
const { Search } = Input;

const TableListUser = ({
  fetch,
  userType,
  additionalColumns = [],
  onEdit,
  onDelete
}) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sorting, setSorting] = useState('');
  const [sortField, setSortField] = useState('');
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
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
            }
            }
          />
          {userType === 'employer' && (
            <Link to={`/company/${record.key}`} target='_blank'>
              <Button
                icon={<EyeOutlined />}
              />
            </Link>
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
  const handleMenuClick = ({ key }) => {
    let newSortField = key;
    setSortField(key);
    setSorting(newSortField);

    fetchUsers({
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
      sorting: `${newSortField}`
    });
  };
  const fetchUsers = async (params = {}) => {
    console.log('Fetching users with params:', pagination);
    try {
      setLoading(true);

      const queryParams = {
        role: userType,
        page: params.page || pagination.current - 1,
        size: params.pageSize || pagination.pageSize,
        sorting: params.sorting || (sortField && sorting ? `${sortField},${sorting}` : ''),
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

  useEffect(() => {
    fetchUsers();
  }, [fetch]);
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
  const PrintModal = () => (
    <Modal
      title="Chọn định dạng xuất"
      open={isPrintModalVisible}
      onCancel={() => setIsPrintModalVisible(false)}
      footer={null}
      centered
    >
      <div className="flex flex-col gap-4 p-4">
        <Button
          icon={<FileExcelOutlined />}
          onClick={() => handleExport('excel')}
          loading={exportLoading}
          block
          size="large"
          className="mb-3"
        >
          Xuất Excel
        </Button>
        <Button
          icon={<FilePdfOutlined />}
          onClick={() => handleExport('pdf')}
          loading={exportLoading}
          block
          size="large"
          type="primary"
        >
          Xuất PDF
        </Button>
      </div>
    </Modal>
  );
  const handleExport = async (type) => {
    try {
      setExportLoading(true);

      const queryParams = {
        role: userType,
        page: pagination.current - 1,
        size: pagination.pageSize,
        sorting: sortField && sorting ? `${sortField},${sorting}` : 'createdAt',
        keyword: searchText || ''
      };

      if (type === 'pdf') {
        const response = await exportUserToPdf(queryParams);
        // if (response.data.type !== 'application/pdf') {
        //   throw new Error('Invalid PDF response');
        // }

        // Tạo Blob với type cụ thể
        const blob = response instanceof Blob ? response : new Blob([response], { type: 'application/pdf' });
        console.log('Blob:', blob);
        // Kiểm tra kích thước blob
        if (blob.size === 0) {
          throw new Error('Empty PDF file');
        }

        // Tạo URL và download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `users-${new Date().getTime()}.pdf`);

        // Mở PDF trong tab mới trước khi download (tùy chọn)
        window.open(url, '_blank');

        // Download file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100);

        message.success('Xuất PDF thành công!');
      }
    } catch (error) {
      console.error(`Error exporting ${type}:`, error);
      message.error(`Lỗi khi xuất ${type === 'excel' ? 'Excel' : 'PDF'}. Vui lòng thử lại sau.`);
    } finally {
      setExportLoading(false);
      setIsPrintModalVisible(false);
    }
  };
  const items = [
    {
      label: 'Người dùng mới nhất',
      key: 'newest',
    },
    {
      label: 'Người dùng cũ nhất',
      key: 'lastest',
    },
    {
      label: 'Người dùng theo tên A-Z',
      key: 'ascName'
    },
    {
      label: 'Người dùng theo tên Z-A',
      key: 'descName',
    },
  ];
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 16 }}>
          <Search
            size="large"
            placeholder="Tìm kiếm người dùng..."
            allowClear
            onSearch={handleSearch}
            style={{ width: "400px" }}
            className="search-input"
          />
          <Dropdown
            menu={{
              items, onClick: handleMenuClick,
            }}
            trigger={["click"]}
          >
            <Button size='large'>
              Sắp xếp <DownOutlined />
            </Button>
          </Dropdown>
          <Button
            icon={<ReloadOutlined />}
            size="large"
            onClick={handleRefresh}
          >
            Làm mới
          </Button>
          <Button
            size="large"
            onClick={() => setIsPrintModalVisible(true)}
          >
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
          showTotal: (total) => `Tổng ${total} người dùng`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
        locale={{
          emptyText: (
            <div className="p-5">
              <InboxOutlined
                style={{ fontSize: "50px", marginBottom: "8px" }}
              />
              <div>Không có dữ liệu</div>
            </div>
          ),
        }}
      />
      <PrintModal />
    </div>
  );
};

export default TableListUser;