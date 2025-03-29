import { useEffect, useRef, useState } from 'react';
import { SearchOutlined, EditOutlined, DeleteOutlined, InboxOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Space, Table, Tooltip } from 'antd';
import Highlighter from 'react-highlight-words';
import { deleteJob, getJobsByStatus, putHideJob } from '../../../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TableListJobs = (props) => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
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

    const fetchData = async (currentPage, pageSize) => {
        setLoading(true);
        const params = {
            jobStatus: props.status,
            page: currentPage - 1,      
            limit: pageSize,        
        };

        const res = await getJobsByStatus(params);
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

           
            setData(data);
            setPagination({
                current: currentPage,
                pageSize: pageSize,
                total: res.data.totalPages,
            });
        }
        else
            setData([]);
        setLoading(false);
    };

   
    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize, props.status]);

   
    const handleTableChange = (newPagination) => {
        setPagination({
            ...pagination,
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        });
    };
    const handleEdit = (id) => {
        navigate(`/employer/job/edit/${id}`);
    }
    const handleDelete = (id) => {
        Modal.confirm({
            title: t('common.notice'),
            content: t('employer.manageJobs.deleteConfirm'),
            centered: true,
            okText: t('common.ok'),
            cancelText: t('common.cancel'),
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
                title: t('common.notice'),
                content: t('employer.manageJobs.hideConfirm'),
                okText: t('common.ok'),
                cancelText: t('common.cancel'),
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
                title: t('common.notice'),
                content: t('employer.manageJobs.showConfirm'),
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
   
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={t('employer.manageJobs.search.placeholder', { field: dataIndex })}
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
                        {t('employer.manageJobs.search.search')}
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 70 }}
                    >
                        {t('employer.manageJobs.search.reset')}
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
                        {t('employer.manageJobs.search.filter')}
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => close()}
                    >
                        {t('employer.manageJobs.search.close')}
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
            title: t('admin.userTable.columns.no'),
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
        props.status !== 'REJECTED' ?
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

                    <div hidden={props.status === 'REJECTED'}>
                        <Tooltip color='cyan' title={t('common.edit')}>
                            <Button onClick={() => handleEdit(record.key)} icon={<EditOutlined />} />
                        </Tooltip>
                    </div>
                    <Tooltip color='red' title={t('admin.coupon.delete')}>
                        <Button danger onClick={() => handleDelete(record.key)} icon={<DeleteOutlined />} />
                    </Tooltip>
                    <div hidden={props.status === 'PENDING' || props.status === 'REJECTED'}>
                        <Tooltip title={t('employer.manageJobs.hideShow')}>
                            <Button onClick={() => handleHide(record.key)}
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
                total: pagination.total * pagination.pageSize,
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
    );
};

export default TableListJobs;

