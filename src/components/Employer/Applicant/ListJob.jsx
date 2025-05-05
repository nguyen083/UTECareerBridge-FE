import { Alert, List, Typography, Card, Input, Select, Row, Col, Button, Flex, Space, Spin, Empty, Divider, Badge, Statistic, Tag, Tooltip, Skeleton } from "antd";
import { JobCardLargeApplicant } from "../../Generate/JobCard";
import { useEffect, useState } from "react";
import { getJobsByStatus } from "../../../services/apiService";
import { useTranslation } from "react-i18next";
import ListApplicantDrawer from "./ListApplicantDrawer";
import { SearchOutlined, FilterOutlined, ReloadOutlined, ProfileOutlined, UsergroupAddOutlined, ClockCircleOutlined, SortAscendingOutlined } from '@ant-design/icons';
import "./ListJob.scss";

const { Text, Title, Paragraph } = Typography;
const { Option } = Select;

const ListJob = () => {
    const {t} = useTranslation();
    const [data, setData] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: 'ACTIVE',
        search: '',
        sortBy: 'newest'
    });
    const [stats, setStats] = useState({
        total: 0,
        withApplicants: 0
    });

    const fetchData = async () => {
        setLoading(true);
        const params = {
            jobStatus: filters.status,
            page: currentPage - 1,
            limit: pageSize,
            search: filters.search || undefined,
            sort: filters.sortBy
        };
        
        try {
            const res = await getJobsByStatus(params);
            if (res.status === 'OK' && res.data.jobResponses) {
                setData(res.data.jobResponses);
                setTotalRecords(res.data.totalItems || res.data.totalPages * pageSize);
                
                // Tính toán thống kê
                const withApplicants = res.data.jobResponses.filter(job => job.totalApplicant > 0).length;
                setStats({
                    total: res.data.totalItems || res.data.jobResponses.length,
                    withApplicants: withApplicants
                });
            }
            else {
                setData([]);
                setTotalRecords(0);
                setStats({ total: 0, withApplicants: 0 });
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, filters.status, filters.sortBy]);

    const handleSearch = () => {
        setCurrentPage(1);
        fetchData();
    };

    const handleReset = () => {
        setFilters({
            status: 'ACTIVE',
            search: '',
            sortBy: 'newest'
        });
        setCurrentPage(1);
    };

    const renderStatusBadge = (status) => {
        switch(status) {
            case 'ACTIVE':
                return <Badge status="success" text={<Text strong>Đang hoạt động</Text>} />;
            case 'DRAFT':
                return <Badge status="warning" text={<Text strong>Bản nháp</Text>} />;
            case 'EXPIRED':
                return <Badge status="error" text={<Text strong>Đã hết hạn</Text>} />;
            case 'PENDING':
                return <Badge status="processing" text={<Text strong>Đang chờ duyệt</Text>} />;
            default:
                return <Badge status="default" text={status} />;
        }
    };

    // Mảng các tùy chọn lọc theo trạng thái
    const statusOptions = [
        { value: 'ACTIVE', label: 'Đang hoạt động', color: 'green' },
        { value: 'EXPIRED', label: 'Đã hết hạn', color: 'red' },
        { value: 'DRAFT', label: 'Bản nháp', color: 'orange' },
        { value: 'PENDING', label: 'Đang chờ duyệt', color: 'blue' },
        { value: 'ALL', label: 'Tất cả', color: 'default' }
    ];

    // Mảng các tùy chọn sắp xếp
    const sortOptions = [
        { value: 'newest', label: 'Mới nhất', icon: <ClockCircleOutlined /> },
        { value: 'oldest', label: 'Cũ nhất', icon: <ClockCircleOutlined className="rotate-180" /> },
        { value: 'most_applicants', label: 'Nhiều ứng viên nhất', icon: <SortAscendingOutlined /> }
    ];

    // Đoạn mã tạo các skeleton khi đang tải
    const renderSkeletons = () => {
        return Array(3).fill().map((_, index) => (
            <List.Item key={index} className="job-list-item">
                <div style={{ width: '100%' }}>
                    <Card bordered={false} className="job-card skeleton-card">
                        <Flex align="center" gap={16}>
                            <Skeleton.Image active style={{ width: 80, height: 80, borderRadius: 8 }} />
                            <div style={{ width: '100%' }}>
                                <Skeleton active paragraph={{ rows: 3 }} />
                            </div>
                        </Flex>
                    </Card>
                </div>
            </List.Item>
        ));
    };

    return (
        <div className="list-job-container">
            <Flex vertical gap={16} className="page-content-wrapper">
                <div className="section-fade-in header-section">
                    <Card className="header-card">
                        <Flex justify="space-between" align="center">
                            <Title level={3} className="page-title">
                                Quản lý ứng viên theo tin tuyển dụng
                            </Title>
                            
                            <Space size="large" className="stats-container">
                                <Statistic 
                                    title={<Text strong>Tổng tin tuyển dụng</Text>} 
                                    value={stats.total} 
                                    valueStyle={{ color: '#1890ff', fontWeight: 600 }}
                                    prefix={<ProfileOutlined className="statistic-icon" />}
                                    className="statistic-item"
                                />
                                <Divider type="vertical" className="stats-divider" />
                                <Statistic 
                                    title={<Text strong>Tin có ứng viên</Text>} 
                                    value={stats.withApplicants} 
                                    valueStyle={{ color: '#52c41a', fontWeight: 600 }}
                                    prefix={<UsergroupAddOutlined className="statistic-icon" />}
                                    className="statistic-item"
                                />
                            </Space>
                        </Flex>
                    </Card>
                </div>

                <div className="section-fade-in notice-section">
                    <Alert
                        message={<Text className="notice-title" strong>{t('common.notice', 'Thông báo')}</Text>}
                        type="info"
                        showIcon
                        closable
                        description={
                            <Paragraph className="notice-content">
                                {t('employer.applicant.listJob.notice', 'Trang này hiển thị danh sách các tin tuyển dụng và ứng viên tương ứng')}
                                <br />
                                <Text type="secondary" className="notice-tip">
                                    Nhấp vào tin tuyển dụng để xem danh sách ứng viên đã ứng tuyển.
                                </Text>
                            </Paragraph>
                        }
                        className="notice-alert"
                    />
                </div>

                <div className="section-fade-in filter-section">
                    <Card className="filter-card">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={8} lg={10}>
                                <Input
                                    placeholder="Tìm kiếm theo tiêu đề công việc"
                                    prefix={<SearchOutlined className="search-icon" />}
                                    value={filters.search}
                                    onChange={e => setFilters({...filters, search: e.target.value})}
                                    onPressEnter={handleSearch}
                                    allowClear
                                    size="large"
                                    className="search-input"
                                />
                            </Col>
                            <Col xs={12} md={6} lg={4}>
                                <Select
                                    style={{ width: '100%' }}
                                    value={filters.status}
                                    onChange={value => setFilters({...filters, status: value})}
                                    dropdownMatchSelectWidth={false}
                                    size="large"
                                    className="status-select custom-select"
                                >
                                    {statusOptions.map(option => (
                                        <Option key={option.value} value={option.value}>
                                            <Flex align="center" gap={6}>
                                                <Badge status={option.color} />
                                                {option.label}
                                            </Flex>
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col xs={12} md={6} lg={4}>
                                <Select
                                    style={{ width: '100%' }}
                                    value={filters.sortBy}
                                    onChange={value => setFilters({...filters, sortBy: value})}
                                    dropdownMatchSelectWidth={false}
                                    size="large"
                                    className="sort-select custom-select"
                                >
                                    {sortOptions.map(option => (
                                        <Option key={option.value} value={option.value}>
                                            <Flex align="center" gap={6}>
                                                {option.icon}
                                                {option.label}
                                            </Flex>
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col xs={24} md={4} lg={6}>
                                <Flex gap={8} justify="end" className="filter-buttons">
                                    <Tooltip title="Lọc kết quả">
                                        <Button 
                                            type="primary" 
                                            icon={<FilterOutlined />} 
                                            onClick={handleSearch}
                                            size="large"
                                            className="filter-button"
                                        >
                                            Lọc
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Đặt lại bộ lọc">
                                        <Button 
                                            icon={<ReloadOutlined />}
                                            onClick={handleReset}
                                            size="large"
                                            className="reset-button"
                                        >
                                            Đặt lại
                                        </Button>
                                    </Tooltip>
                                </Flex>
                            </Col>
                        </Row>
                    </Card>
                </div>

                <div className="section-fade-in list-section">
                    <Card 
                        className="jobs-list-card" 
                        bodyStyle={{ padding: loading && !data.length ? '24px' : '0px' }}
                        title={initialLoading ? null : (
                            <Flex align="center" justify="space-between" className="jobs-list-header">
                                <Text strong className="list-title">
                                    Danh sách tin tuyển dụng 
                                    {totalRecords > 0 && <Tag color="blue" className="total-count">{totalRecords}</Tag>}
                                </Text>
                            </Flex>
                        )}
                    >
                        {initialLoading ? (
                            <Flex justify="center" align="center" className="loading-container">
                                <Spin size="large" tip="Đang tải danh sách tin tuyển dụng..." />
                            </Flex>
                        ) : loading && !data.length ? (
                            <Flex justify="center" align="center" className="loading-container-small">
                                <Spin size="large" tip="Đang tải danh sách tin tuyển dụng..." />
                            </Flex>
                        ) : (
                            <List
                                split={false}
                                dataSource={data}
                                loading={{ spinning: loading && data.length > 0, indicator: <></> }}
                                locale={{
                                    emptyText: (
                                        <Empty 
                                            description={
                                                <div className="empty-description">
                                                    <Text strong style={{ fontSize: 16 }}>Không tìm thấy tin tuyển dụng nào</Text>
                                                    <br />
                                                    <Text type="secondary">Hãy thử thay đổi các bộ lọc và tìm kiếm lại</Text>
                                                </div>
                                            } 
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            className="empty-container"
                                        />
                                    )
                                }}
                                renderItem={loading && data.length > 0 ? renderSkeletons : job => (
                                    <div className="job-item-wrapper">
                                        <List.Item className="job-list-item">
                                            <div style={{ width: '100%' }}>
                                                <Card 
                                                    bordered={false} 
                                                    className="job-card"
                                                    extra={renderStatusBadge(job.jobStatus)}
                                                >
                                                    <JobCardLargeApplicant job={job} setSelectedJob={setSelectedJob} />
                                                </Card>
                                            </div>
                                        </List.Item>
                                    </div>
                                )}
                                pagination={{
                                    current: currentPage,
                                    pageSize: pageSize,
                                    total: totalRecords,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['5', '10', '20', '50'],
                                    showTotal: (total) => `Tổng ${total} tin tuyển dụng`,
                                    onChange: (page, pageSize) => {
                                        setCurrentPage(page);
                                        setPageSize(pageSize);
                                    },
                                    className: "custom-pagination"
                                }}
                            />
                        )}
                    </Card>
                </div>
            </Flex>
            <ListApplicantDrawer open={selectedJob !== null} setSelectedJob={setSelectedJob} jobId={selectedJob} />
        </div>
    );
};

export default ListJob;
