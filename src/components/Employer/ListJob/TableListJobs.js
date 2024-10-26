import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, InboxOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Space, Table, Tooltip } from 'antd';
import Highlighter from 'react-highlight-words';
import { deleteJob, getJobsByStatus, putHideJob } from '../../../services/apiService'; // API mới để phân trang
import { useNavigate } from 'react-router-dom';

const TableListJobs = (props) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1, // Trang hiện tại
        pageSize: 10, // Số lượng bản ghi mỗi trang (mặc định 20)
        total: 0, // Tổng số bản ghi (lấy từ API)
    });
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const navigate = useNavigate();

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };


    // Hàm gọi API để lấy dữ liệu theo trang và limit
    const fetchData = async (currentPage, pageSize) => {
        console.log('fetchData', currentPage, pageSize, props.status);
        setLoading(true);
        const params = {
            jobStatus: props.status, // Truyền status từ props
            page: currentPage - 1,       // Trang hiện tại
            limit: pageSize,         // Số bản ghi mỗi trang
        };

        const res = await getJobsByStatus(params); // Gọi API
        if (res.status === 'OK' && res.data) {
            const data = res.data.jobResponses.map((item, index) => {
                return {
                    key: item.jobId,
                    index: (currentPage - 1) * pageSize + index + 1,
                    title: item.jobTitle,
                    category: item.jobCategory.jobCategoryName,
                    level: item.jobLevel.nameLevel,
                    rejectionReason: item.rejectionReason,
                    quantity: item.amount,
                    deadline: item.jobDeadline,
                    createdTime: item.createdAt,
                };
            });

            // Cập nhật dữ liệu và pagination từ API
            setData(data);
            setPagination({
                current: currentPage,
                pageSize: pageSize,
                total: res.data.totalPages, // Tổng số bản ghi từ API
            });
        }
        else
            setData([]);
        setLoading(false);
    };

    // Gọi API khi component mount và khi pagination thay đổi
    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize, props.status]); // Mỗi khi status thay đổi, gọi lại API

    // Hàm xử lý khi thay đổi trang hoặc số lượng bản ghi mỗi trang
    const handleTableChange = (newPagination) => {
        setPagination({
            ...pagination,
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        });
    };
    const handleView = (id) => {

    };
    const handleEdit = (id) => {
        navigate(`/employer/job/edit/${id}`);
    }
    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn chắc chắn muốn xóa bài đăng này?',
            centered: true,
            onOk() {
                return new Promise((resolve, reject) => {
                    deleteJob(id).then((res) => {
                        if (res.status === 'OK') {
                            resolve();
                            fetchData(pagination.current, pagination.pageSize);
                        }
                        else
                            reject();
                    });
                });
            },
            onCancel() { },
            footer: (_, { OkBtn, CancelBtn }) => (
                <>
                    <CancelBtn />
                    <OkBtn />
                </>
            )
        })
    }
    const handleHide = (id) => {
        props.status !== "INACTIVE" ?
            Modal.confirm({
                title: 'Xác nhận',
                content: 'Bạn chắc chắn muốn ẩn bài đăng này?',
                centered: true,
                onOk() {
                    return new Promise((resolve, reject) => {
                        putHideJob(id, 'INACTIVE').then((res) => {
                            if (res.status === 'OK') {
                                resolve();
                                fetchData(pagination.current, pagination.pageSize);
                            }
                            else
                                reject();
                        });
                    });
                },
                onCancel() { },
                footer: (_, { OkBtn, CancelBtn }) => (
                    <>
                        <CancelBtn />
                        <OkBtn />
                    </>
                )
            }) :
            Modal.confirm({
                title: 'Xác nhận',
                content: 'Bạn chắc chắn muốn hiện bài đăng này?',
                centered: true,
                onOk() {
                    return new Promise((resolve, reject) => {
                        putHideJob(id, 'ACTIVE').then((res) => {
                            if (res.status === 'OK') {
                                resolve();
                                fetchData(pagination.current, pagination.pageSize);
                            }
                            else
                                reject();
                        });
                    });
                },
                onCancel() { },
                footer: (_, { OkBtn, CancelBtn }) => (
                    <>
                        <CancelBtn />
                        <OkBtn />
                    </>
                )
            })
    }

    // Cấu hình cột cho bảng
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Tìm ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 70 }}
                    >
                        Tìm
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 70 }}
                    >
                        Đặt lại
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Lọc
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => close()}
                    >
                        Đóng
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    // Định nghĩa các cột cho bảng
    const columns = [
        {
            title: 'No.',
            dataIndex: 'index',
            key: 'index',
            width: '5%',
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '25%',
            ...getColumnSearchProps('title'),
        },
        {
            title: 'Lĩnh vực',
            dataIndex: 'category',
            key: 'category',
            width: '13%',
            ...getColumnSearchProps('category'),
        },
        {
            title: 'Cấp bậc',
            dataIndex: 'level',
            key: 'level',
            width: '13%',
            ...getColumnSearchProps('level'),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '10%',
            sorter: (a, b) => a.quantity - b.quantity,
        },
        props.status !== 'REJECTED' ?
            {
                title: 'Thời hạn',
                dataIndex: 'deadline',
                key: 'deadline',
                width: '10%',
                ...getColumnSearchProps('deadline'),
            } :
            {
                title: 'Lý do từ chối',
                dataIndex: 'rejectionReason',
                key: 'rejectionReason',
                ellipsis: true,
                Tooltip: true,
                width: '11%',
            },
        {
            title: 'Thời gian tạo',
            dataIndex: 'createdTime',
            key: 'createdTime',
            width: '11%',
        },
        {
            align: 'center',
            title: '',
            key: 'action',
            width: '13%',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip color='blue' title="Xem">
                        <Button shape="circle" onClick={() => handleView(record.key)} icon={<EyeOutlined />} />
                    </Tooltip>
                    <div hidden={props.status === 'REJECTED'}>
                        <Tooltip color='cyan' title="Chỉnh sửa">
                            <Button shape="circle" onClick={() => handleEdit(record.key)} icon={<EditOutlined />} />
                        </Tooltip>
                    </div>
                    <Tooltip color='red' title="Xóa">
                        <Button shape="circle" danger onClick={() => handleDelete(record.key)} icon={<DeleteOutlined />} />
                    </Tooltip>
                    <div hidden={props.status === 'PENDING' || props.status === 'REJECTED'}>
                        <Tooltip title="Ẩn/Hiện">
                            <Button shape="circle" onClick={() => handleHide(record.key)}
                                icon={<EyeInvisibleOutlined />} />
                        </Tooltip>
                    </div>
                </Space>
            ),
        },
    ];

    return (
        <Table
            bordered
            columns={columns}
            dataSource={data}
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total * pagination.pageSize, // Tổng số bản ghi
                showSizeChanger: true, // Hiển thị tùy chọn thay đổi số lượng bản ghi trên mỗi trang
            }}
            loading={loading}
            onChange={handleTableChange} // Xử lý khi thay đổi trang hoặc pageSize
            locale={{
                emptyText: (
                    <div className='p-5'>
                        <InboxOutlined style={{ fontSize: '50px', marginBottom: '8px' }} />
                        <div>Không có dữ liệu</div>
                    </div>
                ),
            }}
        />
    );
};

export default TableListJobs;

