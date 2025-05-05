import { useEffect, useRef, useState } from 'react';
import { 
    SearchOutlined, 
    EyeOutlined, 
    InboxOutlined, 
    CheckOutlined, 
    CloseOutlined, 
    FilterOutlined, 
    ReloadOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined
} from '@ant-design/icons';
import { 
    Button, 
    Form, 
    Input, 
    message, 
    Modal, 
    Space, 
    Table, 
    Tooltip, 
    Tag, 
    Row, 
    Col,
    Dropdown,
    Menu,
    Divider,
    Skeleton
} from 'antd';
import Highlighter from 'react-highlight-words';
import { approvePost, getAllPostByAdmin, rejectPost } from '../../../../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TablePost = ({ status, onUpdateStats }) => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const navigate = useNavigate();
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [sortedInfo, setSortedInfo] = useState({});

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const params = {
                status: status,
                page: currentPage - 1,      
                limit: pageSize,            
            };

            const res = await getAllPostByAdmin(params);
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
                setData(data);
            }
            else
                setData([]);
                
            // Notify parent component to update stats if callback provided
            if (onUpdateStats) {
                onUpdateStats();
            }
        } catch (error) {
            console.error("Error fetching data", error);
            message.error(t('admin.messages.error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, status]);

    const handleTableChange = (pagination, filters, sorter) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
        setSortedInfo(sorter);
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={t('admin.post.table.search.searchFor', { field: t(`admin.post.table.columns.${dataIndex}`) })}
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
                        {t('admin.post.table.search.search')}
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 70 }}
                    >
                        {t('admin.post.table.search.reset')}
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
                        {t('admin.post.table.search.filter')}
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => close()}
                    >
                        {t('admin.post.table.search.close')}
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

    // Action to approve a post
    const handleApprove = async (postId) => {
        try {
            const res = await approvePost(postId);
            if (res.status === "OK") {
                message.success({
                    content: res.message,
                    icon: <CheckOutlined style={{ color: '#52c41a' }} />
                });
                fetchData();
            }
            else {
                message.error(res.message);
            }
        } catch (error) {
            console.error("Error approving post", error);
            message.error(t('admin.messages.error'));
        }
    };

    // Action to reject a post via modal
    const showRejectModal = (record) => {
        setSelectedPost(record);
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        form.resetFields();
        setSelectedPost(null);
        setIsModalVisible(false);
    };

    const handleModalSubmit = async (values) => {
        try {
            const res = await rejectPost(selectedPost.key, values);
            if (res.status === "OK") {
                message.success({
                    content: res.message,
                    icon: <CloseOutlined style={{ color: '#ff4d4f' }} />
                });
                fetchData();
            }
            else {
                message.error(res.message);
            }
        } catch (err) {
            console.error(err);
            message.error(t('admin.messages.error'));
        } finally {
            handleModalCancel();
        }
    };

    // Enhanced column definitions
    const columns = [
        {
            title: t('admin.post.table.columns.no'),
            dataIndex: 'index',
            key: 'index',
            width: 70,
            align: 'center',
        },
        {
            title: t('admin.post.table.columns.title'),
            dataIndex: 'title',
            key: 'title',
            ...getColumnSearchProps('title'),
            sorter: (a, b) => a.title.localeCompare(b.title),
            sortOrder: sortedInfo.columnKey === 'title' && sortedInfo.order,
            render: (text) => (
                <div className="font-medium">{text}</div>
            ),
            ellipsis: true,
        },
        {
            title: t('admin.post.table.columns.category'),
            dataIndex: 'category',
            key: 'category',
            ...getColumnSearchProps('category'),
            render: (category) => (
                <Tag color="blue" key={category}>
                    {category.toUpperCase()}
                </Tag>
            ),
            sorter: (a, b) => a.category.localeCompare(b.category),
            sortOrder: sortedInfo.columnKey === 'category' && sortedInfo.order,
        },
        {
            title: t('admin.post.table.columns.level'),
            dataIndex: 'level',
            key: 'level',
            ...getColumnSearchProps('level'),
            render: (level) => (
                <Tag color="green" key={level}>
                    {level}
                </Tag>
            ),
        },
        {
            title: t('admin.post.table.columns.quantity'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: '8%',
            align: 'center',
            sorter: (a, b) => a.quantity - b.quantity,
            sortOrder: sortedInfo.columnKey === 'quantity' && sortedInfo.order,
            render: (quantity) => (
                <Tag color="orange">
                    {quantity}
                </Tag>
            ),
        },
        status !== 'REJECTED' ?
        {
            title: t('admin.post.table.columns.deadline'),
            dataIndex: 'deadline',
            key: 'deadline',
            width: '12%',
            sorter: (a, b) => new Date(a.deadline) - new Date(b.deadline),
            sortOrder: sortedInfo.columnKey === 'deadline' && sortedInfo.order,
            render: (date) => {
                const deadlineDate = new Date(date);
                const now = new Date();
                const isExpired = deadlineDate < now;
                
                return (
                    <Tag color={isExpired ? 'red' : 'green'} key={date}>
                        {new Date(date).toLocaleDateString()}
                    </Tag>
                );
            }
        } :
        {
            title: t('admin.post.table.columns.rejectedReason'),
            dataIndex: 'rejectionReason',
            key: 'rejectionReason',
            ellipsis: true,
            width: '15%',
            render: (reason) => (
                <Tooltip title={reason}>
                    <div className="truncate">{reason}</div>
                </Tooltip>
            ),
        },
        {
            title: t('admin.post.table.columns.createdTime'),
            dataIndex: 'createdTime',
            key: 'createdTime',
            width: '12%',
            sorter: (a, b) => new Date(a.createdTime) - new Date(b.createdTime),
            sortOrder: sortedInfo.columnKey === 'createdTime' && sortedInfo.order,
            render: (date) => {
                return new Date(date).toLocaleDateString();
            }
        },
        {
            title: '',
            key: 'action',
            width: '12%',
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip color='blue' title={t('admin.post.table.actions.view')}>
                        <Button 
                            type="primary"
                            shape="circle"
                            onClick={() => navigate(`/view/job/${record.key}`, { state: { status: status } })}
                            icon={<EyeOutlined />} 
                        />
                    </Tooltip>
                    {status === 'PENDING' && (
                        <>
                            <Tooltip color='green' title={t('admin.post.table.actions.approve')}>
                                <Button
                                    type="primary" 
                                    shape="circle"
                                    style={{ backgroundColor: '#52c41a' }}
                                    icon={<CheckOutlined />}
                                    onClick={() => handleApprove(record.key)}
                                />
                            </Tooltip>
                            <Tooltip color='red' title={t('admin.post.table.actions.reject')}>
                                <Button
                                    danger
                                    shape="circle"
                                    icon={<CloseOutlined />}
                                    onClick={() => showRejectModal(record)}
                                />
                            </Tooltip>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    // Table toolbar component
    const TableToolbar = () => (
        <Row justify="space-between" align="middle" className="mb-4">
            <Col>
                <span className="text-base font-medium mr-4">
                    {t('admin.manageJobs.totalItems')}: {totalRecords}
                </span>
                <div className="inline-block">
                    <Dropdown
                        overlay={
                            <Menu selectedKeys={[]}>
                                <Menu.Item key="newest" onClick={() => setSortedInfo({ columnKey: 'createdTime', order: 'descend' })}>
                                    <SortDescendingOutlined /> Newest
                                </Menu.Item>
                                <Menu.Item key="oldest" onClick={() => setSortedInfo({ columnKey: 'createdTime', order: 'ascend' })}>
                                    <SortAscendingOutlined /> Oldest
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item key="aToZ" onClick={() => setSortedInfo({ columnKey: 'title', order: 'ascend' })}>
                                    <SortAscendingOutlined /> A-Z
                                </Menu.Item>
                                <Menu.Item key="zToA" onClick={() => setSortedInfo({ columnKey: 'title', order: 'descend' })}>
                                    <SortDescendingOutlined /> Z-A
                                </Menu.Item>
                            </Menu>
                        }
                        trigger={['click']}
                        placement="bottomLeft"
                    >
                        <Button icon={<FilterOutlined />}>
                            Sort
                        </Button>
                    </Dropdown>
                </div>
            </Col>
            <Col>
                <Button
                    icon={<ReloadOutlined />}
                    onClick={fetchData}
                    disabled={loading}
                >
                    {t('admin.dashboard.refresh')}
                </Button>
            </Col>
        </Row>
    );

    return (
        <>
            <TableToolbar />
            <Divider className="my-2" />
            {loading && data.length === 0 ? (
                <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
                <Table
                    bordered
                    columns={columns}
                    dataSource={data}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalRecords,
                        showSizeChanger: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        pageSizeOptions: ['10', '20', '50', '100'],
                    }}
                    loading={loading}
                    onChange={handleTableChange}
                    locale={{
                        emptyText: (
                            <div className='p-8 flex flex-col items-center'>
                                <InboxOutlined style={{ fontSize: '50px', marginBottom: '8px', color: '#bfbfbf' }} />
                                <div>{t('admin.post.table.noData')}</div>
                            </div>
                        ),
                    }}
                    scroll={{ x: 'max-content' }}
                    rowClassName={(record, index) => index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                />
            )}

            <Modal
                centered
                title={t('admin.post.table.modal.title')}
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="cancel" onClick={handleModalCancel}>
                        {t('admin.post.table.modal.cancel')}
                    </Button>,
                    <Button key="confirm" type="primary" onClick={() => form.submit()} danger>
                        {t('admin.post.table.modal.confirm')}
                    </Button>,
                ]}
                maskClosable={false}
            >
                <Form form={form} onFinish={handleModalSubmit} size="large" layout="vertical">
                    <Form.Item 
                        label={t('admin.post.table.modal.rejectReason')} 
                        name="reason" 
                        rules={[{ required: true, message: t('admin.post.table.modal.pleaseEnterReason') }]}
                    >
                        <Input.TextArea 
                            rows={4} 
                            allowClear 
                            placeholder={t('admin.post.table.modal.enterRejectReason')}
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default TablePost;

