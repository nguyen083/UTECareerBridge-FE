import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, EyeOutlined, InboxOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Space, Table, Tooltip } from 'antd';
import Highlighter from 'react-highlight-words';
import { approvePost, getAllPostByAdmin, rejectPost } from '../../../../services/apiService';
import { Link, useNavigate } from 'react-router-dom';
const TablePost = ({ status }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [pageSize, setPageSize] = useState(10); // Số lượng bản ghi mỗi trang (mặc định 20)
    const [totalRecords, setTotalRecords] = useState(0); // Tổng số bản ghi (lấy từ API)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const navigate = useNavigate();
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

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
    const fetchData = async () => {
        try {
            setLoading(true);
            const params = {
                status: status, // Truyền status từ props
                page: currentPage - 1,       // Trang hiện tại
                limit: pageSize,             // Số bản ghi mỗi trang
            };


            // gọi API mới
            const res = await getAllPostByAdmin(params); // Gọi API
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
                setTotalRecords(res.data.totalPages * pageSize);
                // Cập nhật dữ liệu và pagination từ API
                setData(data);
                // setTotalRecords(res.data.totalPages); // Tổng số bản ghi từ API
            }
            else
                setData([]);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi component mount và khi pagination thay đổi
    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, status]); // Mỗi khi status thay đổi, gọi lại API

    // Hàm xử lý khi thay đổi trang hoặc số lượng bản ghi mỗi trang
    const handleTableChange = (newPagination) => {
        setCurrentPage(newPagination.current);
        setPageSize(newPagination.pageSize);
    };

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
        status !== 'REJECTED' ?
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
                        <Link to={`/view/job/${record.key}`} target="_blank">
                            <Button className="btn btn-outline-primary" icon={<EyeOutlined />} />
                        </Link>
                    </Tooltip>
                    <Tooltip color='cyan' title="Duyệt">
                        <Button hidden={status !== 'PENDING'}
                            className="btn btn-outline-success"
                            icon={<CheckOutlined />}
                            onClick={async () => {
                                try {
                                    approvePost(record.key).then(res => {
                                        if (res.status === "OK") {
                                            message.success(res.message);
                                            fetchData();
                                        }
                                        else {
                                            message.error(res.message);
                                        }
                                    })
                                } catch (error) {
                                    console.error("Error approving company", error);
                                }
                            }}
                        />
                    </Tooltip>
                    <Tooltip color='red' title="Từ chối">
                        <Button
                            hidden={status !== 'PENDING'}
                            danger
                            onClick={() => {
                                setSelectedPost(record);
                                setIsModalVisible(true);
                            }}
                            icon={<CloseOutlined />}
                        />
                    </Tooltip>

                </Space>
            ),
        },
    ];

    const handleModalCancel = () => {
        form.resetFields();
        setSelectedPost(null);
        setIsModalVisible(false);
    };
    const handleModalSubmit = (values) => {
        console.log(values);
        rejectPost(selectedPost.key, values).then(res => {
            if (res.status === "OK") {
                message.success(res.message);
                fetchData();
            }
            else {
                message.error(res.message);
            }
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            handleModalCancel();
        })
    };
    return (<>
        <Table
            bordered
            columns={columns}
            dataSource={data}
            pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalRecords, // Tổng số bản ghi
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
        <Modal
            centered
            title="Chỉnh sửa thông tin người dùng"
            open={isModalVisible}
            onCancel={handleModalCancel}
            footer={[
                <Button onClick={handleModalCancel}>
                    Hủy
                </Button>,
                <Button type="primary" onClick={() => form.submit()}>
                    Xác nhận
                </Button>,
            ]}
        >
            <Form form={form} onFinish={handleModalSubmit} size="large" layout="vertical">
                <Form.Item label="Lý do từ chối" name="reason" placeholder="Nhập lý do từ chối" rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}>
                    <Input.TextArea rows={4} allowClear />
                </Form.Item>
            </Form>
        </Modal>
    </>
    );
};

export default TablePost;

