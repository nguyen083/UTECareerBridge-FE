import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, EyeOutlined, InboxOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Space, Table, Tooltip } from 'antd';
import Highlighter from 'react-highlight-words';
import { approvePost, getAllPostByAdmin, rejectPost } from '../../../../services/apiService';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TablePost = ({ status }) => {
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
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, status]);

    const handleTableChange = (newPagination) => {
        setCurrentPage(newPagination.current);
        setPageSize(newPagination.pageSize);
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

    const columns = [
        {
            title: t('admin.post.table.columns.no'),
            dataIndex: 'index',
            key: 'index',
            width: '5%',
        },
        {
            title: t('admin.post.table.columns.title'),
            dataIndex: 'title',
            key: 'title',
            width: '25%',
            ...getColumnSearchProps('title'),
        },
        {
            title: t('admin.post.table.columns.category'),
            dataIndex: 'category',
            key: 'category',
            width: '13%',
            ...getColumnSearchProps('category'),
        },
        {
            title: t('admin.post.table.columns.level'),
            dataIndex: 'level',
            key: 'level',
            width: '13%',
            ...getColumnSearchProps('level'),
        },
        {
            title: t('admin.post.table.columns.quantity'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: '10%',
            sorter: (a, b) => a.quantity - b.quantity,
        },
        status !== 'REJECTED' ?
            {
                title: t('admin.post.table.columns.deadline'),
                dataIndex: 'deadline',
                key: 'deadline',
                width: '10%',
                ...getColumnSearchProps('deadline'),
            } :
            {
                title: t('admin.post.table.columns.rejectedReason'),
                dataIndex: 'rejectionReason',
                key: 'rejectionReason',
                ellipsis: true,
                Tooltip: true,
                width: '11%',
            },
        {
            title: t('admin.post.table.columns.createdTime'),
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
                    <Tooltip color='blue' title={t('admin.post.table.actions.view')}>
                        <Button className="btn btn-outline-primary" onClick={() => {
                            navigate(`/view/job/${record.key}`, { state: { status: status } });
                        }} icon={<EyeOutlined />} />
                    </Tooltip>
                    <Tooltip color='cyan' title={t('admin.post.table.actions.approve')}>
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
                    <Tooltip color='red' title={t('admin.post.table.actions.reject')}>
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
                total: totalRecords,
                showSizeChanger: true,
            }}
            loading={loading}
            onChange={handleTableChange}
            locale={{
                emptyText: (
                    <div className='p-5'>
                        <InboxOutlined style={{ fontSize: '50px', marginBottom: '8px' }} />
                        <div>{t('admin.post.table.noData')}</div>
                    </div>
                ),
            }}
        />
        <Modal
            centered
            title={t('admin.post.table.modal.title')}
            open={isModalVisible}
            onCancel={handleModalCancel}
            footer={[
                <Button onClick={handleModalCancel}>
                    {t('admin.post.table.modal.cancel')}
                </Button>,
                <Button type="primary" onClick={() => form.submit()}>
                    {t('admin.post.table.modal.confirm')}
                </Button>,
            ]}
        >
            <Form form={form} onFinish={handleModalSubmit} size="large" layout="vertical">
                <Form.Item 
                    label={t('admin.post.table.modal.rejectReason')} 
                    name="reason" 
                    placeholder={t('admin.post.table.modal.enterRejectReason')}
                    rules={[{ required: true, message: t('admin.post.table.modal.pleaseEnterReason') }]}
                >
                    <Input.TextArea rows={4} allowClear />
                </Form.Item>
            </Form>
        </Modal>
    </>
    );
};

export default TablePost;

