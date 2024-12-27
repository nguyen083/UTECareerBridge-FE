import { Button, Modal, Space, Table, Input, Form, message, Typography, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { CheckOutlined, CloseOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Highlighter from "react-highlight-words";
import { approveCompany, getAllCompany, rejectCompany } from "../../../../services/apiService";

const TableCompany = ({ status }) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);  // Tổng số bản ghi
    const [pageSize, setPageSize] = useState(10);  // Số bản ghi trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1);  // Trang hiện tại
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
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Tìm ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Tìm
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Đặt lại
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Lọc
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Đóng
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


    // Lấy dữ liệu từ API
    const fetchData = async () => {
        const params = {
            page: currentPage - 1,
            limit: pageSize,
            status: status,
        }
        try {
            // call api lấy data    
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
            title: 'Tên công ty',
            dataIndex: 'companyName',
            key: 'companyName',
            ...getColumnSearchProps('companyName'),
            sorter: (a, b) => a.companyName.length - b.companyName.length,
            sortDirections: ['descend', 'ascend'],
            width: "35%",
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'companyAddress',
            key: 'address',
            ...getColumnSearchProps('address'),
            width: "15%",
        },
        {
            title: 'Email',
            dataIndex: 'companyEmail',
            key: 'companyEmail',
            width: "15%",
            ...getColumnSearchProps('companyEmail'),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: "10%",
            ...getColumnSearchProps('phoneNumber'),
        },
        {
            title: 'Giấy chứng nhận',
            dataIndex: 'businessCertificate',
            key: 'businessCertificate',
            width: "10%",
            align: "center",
            render: (text, record) => (
                record.businessCertificate ? <Typography.Link href={record.businessCertificate} target='_blank'>
                    Xem
                </Typography.Link> : null
            ),
        },
        ...(status === 'REJECTED' ? [{
            key: 'rejectedReason',
            title: 'Lý do từ chối',
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
                    <Tooltip title="Xem">
                        <Link to={`/view/company/${record.id}`} target='_blank'>
                            <Button
                                className="btn btn-outline-primary"
                                icon={<EyeOutlined />}
                            />
                        </Link>
                    </Tooltip>
                    {status === 'PENDING' &&
                        <Tooltip title="Duyệt">
                            <Button
                                className="btn btn-outline-success"
                                icon={<CheckOutlined />}
                                onClick={async () => {
                                    try {
                                        approveCompany(record.id).then(res => {
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
                        </Tooltip>}
                    {status === 'PENDING' && <Tooltip title="Từ chối">
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
            console.log(err);
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
    )
}

export default TableCompany;
