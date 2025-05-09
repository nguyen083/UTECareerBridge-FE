import { Button, Modal, Space, Table, Input, Form, message, Typography, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { CheckOutlined, CloseOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Highlighter from "react-highlight-words";
import { approveCompany, getAllCompany, rejectCompany } from "../../../../services/apiService";
import { useTranslation } from 'react-i18next';

const TableCompany = ({ status }) => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0); 
    const [pageSize, setPageSize] = useState(10); 
    const [currentPage, setCurrentPage] = useState(1); 
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
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
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div className="p-2" onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={t('admin.company.table.search.searchFor', { field: t(`admin.company.table.columns.${dataIndex}`) })}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    className="block mb-2"
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        className="w-[90px]"
                    >
                        {t('admin.company.table.search.search')}
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        className="w-[90px]"
                    >
                        {t('admin.company.table.search.reset')}
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
                        {t('admin.company.table.search.filter')}
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => close()}
                    >
                        {t('admin.company.table.search.close')}
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
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


   
    const fetchData = async () => {
        const params = {
            page: currentPage - 1,
            limit: pageSize,
            status: status,
        }
        try {
           
            const response = await getAllCompany(params);
            setData(response.data.employerResponses);
            setTotal(response.data.totalPages * pageSize);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {

        fetchData();
    }, [currentPage, pageSize, status]);

    const columns = [
        {
            title: t('admin.company.table.columns.companyName'),
            dataIndex: 'companyName',
            key: 'companyName',
            ...getColumnSearchProps('companyName'),
            sorter: (a, b) => a.companyName.length - b.companyName.length,
            sortDirections: ['descend', 'ascend'],
            width: "35%",
        },
        {
            title: t('admin.company.table.columns.address'),
            dataIndex: 'companyAddress',
            key: 'address',
            ...getColumnSearchProps('address'),
            width: "15%",
        },
        {
            title: t('admin.company.table.columns.email'),
            dataIndex: 'companyEmail',
            key: 'companyEmail',
            width: "15%",
            ...getColumnSearchProps('companyEmail'),
        },
        {
            title: t('admin.company.table.columns.phone'),
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: "10%",
            ...getColumnSearchProps('phoneNumber'),
        },
        {
            title: t('admin.company.table.columns.certificate'),
            dataIndex: 'businessCertificate',
            key: 'businessCertificate',
            width: "10%",
            align: "center",
            render: (text, record) => (
                record.businessCertificate ? 
                <Typography.Link href={record.businessCertificate} target='_blank'>
                    {t('admin.company.table.actions.view')}
                </Typography.Link> : null
            ),
        },
        ...(status === 'REJECTED' ? [{
            key: 'rejectedReason',
            title: t('admin.company.table.columns.rejectedReason'),
            dataIndex: 'rejectedReason',
            width: "20%",
        }] : []),
        {
            key: 'actions',
            fixed: 'right',
            width: 150,
            align: "center",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title={t('admin.company.table.actions.view')}>
                        <Link to={`/view/company/${record.id}`} target='_blank'>
                            <Button
                                className="btn btn-outline-primary"
                                icon={<EyeOutlined />}
                            />
                        </Link>
                    </Tooltip>
                    {status === 'PENDING' &&
                        <Tooltip title={t('admin.company.table.actions.approve')}>
                            <Button
                                className="btn btn-outline-success"
                                icon={<CheckOutlined />}
                                onClick={async () => {
                                    try {
                                        approveCompany(record.id).then(res => {
                                            if (res.status === "OK") {
                                                message.success(res.message);
                                                fetchData();
                                            } else {
                                                message.error(res.message);
                                            }
                                        })
                                    } catch (error) {
                                        console.error("Error approving company", error);
                                    }
                                }}
                            />
                        </Tooltip>}
                    {status === 'PENDING' && 
                        <Tooltip title={t('admin.company.table.actions.reject')}>
                            <Button
                                danger
                                onClick={() => {
                                    setSelectedCompany(record);
                                    setIsModalVisible(true);
                                }}
                                icon={<CloseOutlined />}
                            />
                        </Tooltip>}
                </Space>
            ),
        }
    ];

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };
    const handleModalCancel = () => {
        form.resetFields();
        setSelectedCompany(null);
        setIsModalVisible(false);
    };
    const handleModalSubmit = (values) => {
        rejectCompany(selectedCompany.id, values).then(res => {
            if (res.status === "OK") {
                message.success(res.message);
                fetchData();
            }
            else {
                message.error(res.message);
            }
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            handleModalCancel();
        })
    };
    return (
        <>
            <Table
                bordered
                columns={columns}
                dataSource={data}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: total,
                    onChange: handlePageChange,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50']
                }}
            />
            <Modal
                centered
                title={t('admin.company.table.modal.title')}
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="cancel" onClick={handleModalCancel}>
                        {t('admin.company.table.modal.cancel')}
                    </Button>,
                    <Button key="confirm" type="primary" onClick={() => form.submit()}>
                        {t('admin.company.table.modal.confirm')}
                    </Button>,
                ]}
            >
                <Form form={form} onFinish={handleModalSubmit} size="large" layout="vertical">
                    <Form.Item 
                        label={t('admin.company.table.modal.rejectReason')} 
                        name="reason" 
                        placeholder={t('admin.company.table.modal.enterRejectReason')}
                        rules={[{ required: true, message: t('admin.company.table.modal.pleaseEnterReason') }]}
                    >
                        <Input.TextArea rows={4} allowClear />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default TableCompany;
