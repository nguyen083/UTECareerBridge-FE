import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Table,
  Card,
  Typography,
  Tag,
  Space,
  Rate,
  Button,
  Empty,
  Statistic,
  Spin,
  Flex,
  Divider,
  Row,
  Col,
  Badge,
  Tooltip,
  Avatar,
  message,
  Modal
} from "antd";
import {
  UserOutlined,
  StarOutlined,
  BarChartOutlined,
  TeamOutlined,
  LinkOutlined,
  FileSearchOutlined,
  LeftOutlined,
  MailOutlined,
  CalendarOutlined,
  LikeOutlined,
  PlusCircleOutlined,
  ExclamationCircleOutlined,
  CodeOutlined,
  MinusCircleOutlined
} from "@ant-design/icons";
import BoxContainer from "../../Generate/BoxContainer";
import interview from "../../../services/api/interview";
import "./CandidateEvaluation.scss";
import "./ComparisonStyles.scss";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const { Title, Text, Paragraph } = Typography;

// Trợ giúp chuyển đổi định dạng ngày tháng
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Trợ giúp tính thời gian từ ngày đánh giá
const timeFromNow = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: vi });
};

const JobEvaluations = () => {
  const { t } = useTranslation();
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [evaluations, setEvaluations] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [statistics, setStatistics] = useState({
    averageRating: 0,
    totalEvaluations: 0,
    recommendedCount: 0,
    notRecommendedCount: 0,
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [selectedEvaluations, setSelectedEvaluations] = useState([]);
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  // Lấy đánh giá theo jobId
  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        setLoading(true);
        const response = await interview.getEvaluationsByJobId(jobId);
        
        if (response && response.status === "OK" && response.data) {
          setEvaluations(response.data);
          
          // Tính toán thống kê
          if (response.data.length > 0) {
            const totalRating = response.data.reduce(
              (sum, evaluation) => sum + evaluation.overallRating, 0
            );
            const avgRating = totalRating / response.data.length;
            const recommended = response.data.filter(evaluation => evaluation.isRecommended).length;
            
            setStatistics({
              averageRating: avgRating.toFixed(1),
              totalEvaluations: response.data.length,
              recommendedCount: recommended,
              notRecommendedCount: response.data.length - recommended,
            });
            
            // Giả định: thông tin chi tiết về công việc nằm ở đánh giá đầu tiên
            if (response.data[0]?.job) {
              setJobDetails(response.data[0].job);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching evaluations:", error);
        message.error(t("employer.evaluation.list.error.loading") || "Lỗi khi tải danh sách đánh giá");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchEvaluations();
    }
  }, [jobId, t]);

  // Hiển thị modal chi tiết đánh giá
  const showDetailModal = (evaluation) => {
    setCurrentEvaluation(evaluation);
    setDetailModalVisible(true);
  };
  // Đóng modal chi tiết
  const handleCloseModal = () => {
    setDetailModalVisible(false);
    setCurrentEvaluation(null);
  };
  
  // Xử lý chọn ứng viên để so sánh
  const handleSelectForComparison = (evaluation) => {
    if (selectedEvaluations.some(e => e.id === evaluation.id)) {
      // Nếu đã có trong danh sách, bỏ chọn
      setSelectedEvaluations(selectedEvaluations.filter(e => e.id !== evaluation.id));
    } else {
      // Nếu chưa có, thêm vào danh sách (tối đa 3 ứng viên)
      if (selectedEvaluations.length < 3) {
        setSelectedEvaluations([...selectedEvaluations, evaluation]);
      } else {
        message.info(t("employer.evaluation.compare.max_limit") || "Chỉ có thể so sánh tối đa 3 ứng viên");
      }
    }
  };
  
  // Mở modal so sánh
  const handleOpenCompareModal = () => {
    if (selectedEvaluations.length > 1) {
      setCompareModalVisible(true);
    } else {
      message.warning(t("employer.evaluation.compare.min_required") || "Vui lòng chọn ít nhất 2 ứng viên để so sánh");
    }
  };
  
  // Đóng modal so sánh
  const handleCloseCompareModal = () => {
    setCompareModalVisible(false);
  };
  
  // Xóa tất cả ứng viên đã chọn
  const clearAllSelected = () => {
    setSelectedEvaluations([])
  };

  // Định nghĩa các cột cho bảng đánh giá
  const columns = [
    {
      title: t("employer.evaluation.list.table.candidate") || "Ứng viên",
      dataIndex: "candidate",
      key: "candidate",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Space direction="vertical" size={0}>
            <Text strong>{record?.studentName || "Không có tên"}</Text>
            <Text type="secondary">{record?.studentEmail || ""}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: t("employer.evaluation.list.table.overall_rating") || "Đánh giá chung",
      dataIndex: "overallRating",
      key: "overallRating",
      render: (rating) => (
        <Space>
          <Rate 
            disabled 
            allowHalf 
            value={rating / 2} 
            style={{ fontSize: "16px" }} 
          />
          <Text strong>{rating}/10</Text>
        </Space>
      ),
      sorter: (a, b) => a.overallRating - b.overallRating,
    },
    {
      title: t("employer.evaluation.list.table.recommended") || "Đề xuất",
      dataIndex: "isRecommended",
      key: "isRecommended",
      render: (isRecommended) => (
        isRecommended ? (
          <Tag color="success">{t("employer.evaluation.list.recommended") || "Đề xuất tuyển dụng"}</Tag>
        ) : (
          <Tag color="error">{t("employer.evaluation.list.not_recommended") || "Không đề xuất"}</Tag>
        )
      ),
      filters: [
        {
          text: t("employer.evaluation.list.filter.recommended") || "Được đề xuất",
          value: true,
        },
        {
          text: t("employer.evaluation.list.filter.not_recommended") || "Không được đề xuất",
          value: false,
        },
      ],
      onFilter: (value, record) => record.isRecommended === value,
    },
    {
      title: t("employer.evaluation.list.table.evaluator") || "Người đánh giá",
      dataIndex: "evaluator",
      key: "evaluator",
      render: (_, record) => (
        <Text>{record?.evaluatedByName || "Không xác định"}</Text>
      ),
    },
    {
      title: t("employer.evaluation.list.table.date") || "Ngày đánh giá",
      dataIndex: "evaluationDate",
      key: "evaluationDate",
      render: (date) => (
        <Tooltip title={formatDate(date)}>
          <Text>{timeFromNow(date)}</Text>
        </Tooltip>
      ),
      sorter: (a, b) => new Date(a.evaluationDate) - new Date(b.evaluationDate),
    },
    {
      title: t("employer.evaluation.list.table.actions") || "Hành động",
      key: "actions",
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<FileSearchOutlined />}
          onClick={() => showDetailModal(record)}
        >
          {t("employer.evaluation.list.view_details") || "Xem chi tiết"}
        </Button>
      ),
    },
  ];

  // Render phần thống kê
  const renderStatistics = () => (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic
            title={t("employer.evaluation.list.stats.average") || "Đánh giá trung bình"}
            value={statistics.averageRating}
            suffix="/10"
            prefix={<StarOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title={t("employer.evaluation.list.stats.total") || "Tổng số đánh giá"}
            value={statistics.totalEvaluations}
            prefix={<BarChartOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title={t("employer.evaluation.list.stats.recommended") || "Đề xuất tuyển dụng"}
            value={statistics.recommendedCount}
            prefix={<Badge status="success" />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title={t("employer.evaluation.list.stats.not_recommended") || "Không đề xuất"}
            value={statistics.notRecommendedCount}
            prefix={<Badge status="error" />}
            valueStyle={{ color: "#ff4d4f" }}
          />
        </Card>
      </Col>
    </Row>
  );

  // Modal chi tiết đánh giá
  const renderDetailModal = () => {
    if (!currentEvaluation) return null;
    
    return (      <Modal
        title={
          <Space>
            <FileSearchOutlined />
            <span>{t("employer.evaluation.list.detail_title") || "Chi tiết đánh giá"}</span>
          </Space>
        }
        open={detailModalVisible}
        onCancel={handleCloseModal}
        width={1000}
        footer={[
          <Button key="back" onClick={handleCloseModal} type="primary" size="large">
            {t("common.close") || "Đóng"}
          </Button>,
        ]}
        className="candidate-detail-modal"
      >        <Row gutter={[24, 24]}>
          {/* Thông tin ứng viên */}
          <Col span={24}>
            <Card bordered={false} className="candidate-info-card" style={{ overflow: 'hidden' }}>
              <Row gutter={24} align="middle">
                <Col span={5} style={{ textAlign: 'center' }}>
                  <Avatar 
                    size={100} 
                    icon={<UserOutlined />} 
                    style={{ 
                      backgroundColor: '#1677ff',
                      fontSize: '42px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </Col>
                <Col span={14}>
                  <Title level={3} style={{ marginTop: 0, marginBottom: 8 }}>
                    {currentEvaluation?.studentName || "Không có tên"}
                  </Title>
                  <Paragraph style={{ fontSize: '16px', marginBottom: 5 }}>
                    <MailOutlined style={{ marginRight: 8 }} /> 
                    {currentEvaluation?.studentEmail || ""}
                  </Paragraph>
                  <Tag color={currentEvaluation.isRecommended ? "success" : "error"} style={{ fontSize: '14px', padding: '4px 12px' }}>
                    {currentEvaluation.isRecommended 
                      ? t("employer.evaluation.list.recommended") || "Đề xuất tuyển dụng"
                      : t("employer.evaluation.list.not_recommended") || "Không đề xuất"
                    }
                  </Tag>
                </Col>
                <Col span={5}>
                  <Flex vertical align="center">
                    <div className="rating-circle" style={{ 
                      width: '120px', 
                      height: '120px',
                      borderRadius: '50%',
                      border: '4px solid #1677ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'white',
                      boxShadow: '0 4px 12px rgba(22, 119, 255, 0.1)'
                    }}>
                      <div style={{ fontSize: '32px', fontWeight: '600', color: '#1677ff', position: 'relative' }}>
                        {currentEvaluation.overallRating}
                        <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#8c8c8c', position: 'absolute', bottom: '0', right: '-12px' }}>/10</span>
                      </div>
                    </div>
                    <Rate 
                      disabled 
                      allowHalf 
                      value={currentEvaluation.overallRating / 2} 
                      style={{ fontSize: "20px", marginTop: "12px" }} 
                    />
                  </Flex>
                </Col>
              </Row>
            </Card>
          </Col>
          
          <Col span={24}>
            <Card title={t("employer.evaluation.skills.title") || "Đánh giá kỹ năng"}>
              <Row gutter={16}>                <Col span={12}>
                  <Card 
                    size="small" 
                    className="skill-detail-card" 
                    bordered={false}
                    style={{ background: 'rgba(0, 0, 0, 0.02)', marginBottom: '16px', borderRadius: '8px' }}
                  >
                    <Flex align="middle" justify="space-between">
                      <Text strong style={{ fontSize: '16px' }}>{t("employer.evaluation.skills.technical") || "Kỹ năng chuyên môn"}</Text>
                      <Text style={{ fontSize: '20px', fontWeight: '600', color: '#1677ff' }}>{currentEvaluation.technicalSkills}/10</Text>
                    </Flex>
                    <Rate 
                      disabled 
                      value={currentEvaluation.technicalSkills / 2} 
                      count={5}
                      style={{ fontSize: '22px', marginTop: '10px' }}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card 
                    size="small" 
                    className="skill-detail-card" 
                    bordered={false}
                    style={{ background: 'rgba(0, 0, 0, 0.02)', marginBottom: '16px', borderRadius: '8px' }}
                  >
                    <Flex align="middle" justify="space-between">
                      <Text strong style={{ fontSize: '16px' }}>{t("employer.evaluation.skills.communication") || "Kỹ năng giao tiếp"}</Text>
                      <Text style={{ fontSize: '20px', fontWeight: '600', color: '#1677ff' }}>{currentEvaluation.communicationSkills}/10</Text>
                    </Flex>
                    <Rate 
                      disabled 
                      value={currentEvaluation.communicationSkills / 2} 
                      count={5} 
                      style={{ fontSize: '22px', marginTop: '10px' }}
                    />
                  </Card>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 16 }}>                <Col span={12}>
                  <Card 
                    size="small" 
                    className="skill-detail-card" 
                    bordered={false}
                    style={{ background: 'rgba(0, 0, 0, 0.02)', marginBottom: '16px', borderRadius: '8px' }}
                  >
                    <Flex align="middle" justify="space-between">
                      <Text strong style={{ fontSize: '16px' }}>{t("employer.evaluation.skills.culture_fit") || "Phù hợp văn hóa"}</Text>
                      <Text style={{ fontSize: '20px', fontWeight: '600', color: '#1677ff' }}>{currentEvaluation.cultureFit}/10</Text>
                    </Flex>
                    <Rate 
                      disabled 
                      value={currentEvaluation.cultureFit / 2} 
                      count={5}
                      style={{ fontSize: '22px', marginTop: '10px' }}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card 
                    size="small" 
                    className="skill-detail-card" 
                    bordered={false}
                    style={{ background: 'rgba(0, 0, 0, 0.02)', marginBottom: '16px', borderRadius: '8px' }}
                  >
                    <Flex align="middle" justify="space-between">
                      <Text strong style={{ fontSize: '16px' }}>{t("employer.evaluation.skills.problem_solving") || "Giải quyết vấn đề"}</Text>
                      <Text style={{ fontSize: '20px', fontWeight: '600', color: '#1677ff' }}>{currentEvaluation.problemSolving}/10</Text>
                    </Flex>
                    <Rate 
                      disabled 
                      value={currentEvaluation.problemSolving / 2} 
                      count={5}
                      style={{ fontSize: '22px', marginTop: '10px' }}
                    />
                  </Card>
                </Col>
              </Row>              <Row style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Card 
                    size="small" 
                    className="skill-detail-card" 
                    bordered={false}
                    style={{ background: 'rgba(0, 0, 0, 0.02)', marginBottom: '16px', borderRadius: '8px' }}
                  >
                    <Flex align="middle" justify="space-between">
                      <Text strong style={{ fontSize: '16px' }}>{t("employer.evaluation.skills.attitude") || "Thái độ làm việc"}</Text>
                      <Text style={{ fontSize: '20px', fontWeight: '600', color: '#1677ff' }}>{currentEvaluation.attitude}/10</Text>
                    </Flex>
                    <Rate 
                      disabled 
                      value={currentEvaluation.attitude / 2} 
                      count={5}
                      style={{ fontSize: '22px', marginTop: '10px' }}
                    />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
            <Col span={24}>
            <Card 
              title={
                <span style={{ fontSize: '18px' }}>
                  {t("employer.evaluation.notes.title") || "Ghi chú đánh giá"}
                </span>
              }
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Card
                    size="small"
                    className="note-detail-card"
                    bordered={false}
                    style={{ background: '#f9f9f9', borderLeft: '3px solid #1677ff' }}
                    title={
                      <div style={{ fontSize: '16px', color: '#1677ff', fontWeight: 500 }}>
                        {t("employer.evaluation.notes.strengths") || "Điểm mạnh"}
                      </div>
                    }
                  >
                    <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                      {currentEvaluation.strengths}
                    </Paragraph>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    size="small"
                    className="note-detail-card"
                    bordered={false}
                    style={{ background: '#f9f9f9', borderLeft: '3px solid #1677ff' }}
                    title={
                      <div style={{ fontSize: '16px', color: '#1677ff', fontWeight: 500 }}>
                        {t("employer.evaluation.notes.weaknesses") || "Điểm cần cải thiện"}
                      </div>
                    }
                  >
                    <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                      {currentEvaluation.weaknesses}
                    </Paragraph>
                  </Card>
                </Col>
              </Row>
              <Divider style={{ margin: '24px 0' }} />
              <Card
                size="small"
                className="note-detail-card"
                bordered={false}
                style={{ background: '#f9f9f9' }}
                title={
                  <div style={{ fontSize: '16px', fontWeight: 500 }}>
                    {t("employer.evaluation.notes.overall") || "Ghi chú tổng quát"}
                  </div>
                }
              >
                <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                  {currentEvaluation.overallNotes}
                </Paragraph>
              </Card>
            </Card>
          </Col>          {currentEvaluation.isRecommended && (
            <Col span={24}>
              <Card 
                title={
                  <span style={{ fontSize: '18px' }}>
                    <LikeOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                    {t("employer.evaluation.recommendation.title") || "Khuyến nghị"}
                  </span>
                }
              >
                <Row gutter={24}>
                  <Col span={12}>
                    <Card
                      size="small"
                      className="recommendation-detail-card"
                      bordered={false}
                      style={{ 
                        background: 'rgba(82, 196, 26, 0.05)', 
                        borderRadius: '8px',
                        padding: '8px'
                      }}
                    >
                      <Title level={5} style={{ color: '#52c41a', marginTop: 0 }}>
                        {t("employer.evaluation.recommendation.position") || "Vị trí đề xuất"}
                      </Title>
                      <Paragraph style={{ 
                        fontSize: '18px', 
                        fontWeight: '500', 
                        marginBottom: 0,
                        padding: '12px 16px',
                        background: 'white',
                        borderRadius: '6px'
                      }}>
                        {currentEvaluation.recommendedPosition}
                      </Paragraph>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card
                      size="small"
                      className="recommendation-detail-card"
                      bordered={false}
                      style={{ 
                        background: 'rgba(82, 196, 26, 0.05)', 
                        borderRadius: '8px',
                        padding: '8px'
                      }}
                    >
                      <Title level={5} style={{ color: '#52c41a', marginTop: 0 }}>
                        {t("employer.evaluation.recommendation.salary") || "Mức lương đề xuất"}
                      </Title>
                      <Paragraph style={{ 
                        fontSize: '18px', 
                        fontWeight: '500', 
                        marginBottom: 0,
                        padding: '12px 16px',
                        background: 'white',
                        borderRadius: '6px'
                      }}>
                        {currentEvaluation.recommendedSalary?.toLocaleString('vi-VN')} VND
                      </Paragraph>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          )}
            {/* Thông tin đánh giá */}
          <Col span={24}>
            <Card>
              <Flex justify="space-between" align="center">
                <Space>
                  <UserOutlined style={{ fontSize: '18px', color: '#1677ff' }} />
                  <Text strong>Đánh giá bởi: {currentEvaluation?.evaluatedByName || "Không xác định"}</Text>
                </Space>
                <Space>
                  <CalendarOutlined style={{ fontSize: '16px', color: '#1677ff' }} />
                  <Text style={{ fontSize: '15px' }}>Ngày đánh giá: {formatDate(currentEvaluation.createdAt)}</Text>
                </Space>
              </Flex>
            </Card>
          </Col>
        </Row>
      </Modal>
    );
  };

  return (
    <Flex vertical gap={20}>
      <BoxContainer className="shadow-md">
        <Flex justify="space-between" align="center">
          <Flex vertical>
            <div className="title1">
              {t("employer.evaluation.list.title") || "Đánh giá ứng viên"}
            </div>
            <p className="text-gray-500 mt-2">
              {jobDetails?.title || t("employer.evaluation.list.subtitle") || "Tổng hợp đánh giá ứng viên cho công việc"}
            </p>
          </Flex>
          <Button
            icon={<LeftOutlined />}
            onClick={() => navigate("/employer/interview")}
          >
            {t("common.back") || "Quay lại"}
          </Button>
        </Flex>
      </BoxContainer>

      {loading ? (
        <BoxContainer className="shadow-md text-center py-8">
          <Spin size="large" />
          <div className="mt-4">
            {t("employer.evaluation.list.loading") || "Đang tải dữ liệu..."}
          </div>
        </BoxContainer>
      ) : (
        <>
          <BoxContainer className="shadow-md">
            {evaluations.length > 0 ? (
              <>
                {renderStatistics()}
                <Divider />
                {jobDetails && (
                  <Flex align="start" className="mb-4">
                    <Card title={t("employer.evaluation.list.job_info") || "Thông tin công việc"} style={{ width: "100%" }}>
                      <Paragraph strong>{jobDetails.title}</Paragraph>
                      <Space wrap>
                        <Tag color="blue">{jobDetails.jobType || "Toàn thời gian"}</Tag>
                        <Tag color="green">{jobDetails.salary || "Thỏa thuận"}</Tag>
                        <Tag color="orange">{jobDetails.location || "Không xác định"}</Tag>
                      </Space>
                    </Card>
                  </Flex>
                )}
              </>
            ) : null}
          </BoxContainer>          <BoxContainer className="shadow-md">
            <Flex justify="space-between" align="center" className="mb-4">
              <Title level={5} style={{ margin: 0 }}>
                {t("employer.evaluation.list.evaluation_list") || "Danh sách đánh giá"}
              </Title>
              <Space>
                {selectedEvaluations.length > 0 && (
                  <Button 
                    onClick={clearAllSelected}
                    type="text" 
                    danger
                  >
                    {t("employer.evaluation.compare.clear_all") || "Xóa lựa chọn"}
                  </Button>
                )}
                <Button 
                  type="primary" 
                  onClick={handleOpenCompareModal}
                  disabled={selectedEvaluations.length < 2}
                  icon={<BarChartOutlined />}
                >
                  {t("employer.evaluation.compare.title") || "So sánh ứng viên"} 
                  {selectedEvaluations.length > 0 && ` (${selectedEvaluations.length})`}
                </Button>
              </Space>
            </Flex>
            
            <Table
              dataSource={evaluations}
              columns={columns}
              rowKey={(record) => record.id}
              pagination={{ pageSize: 10 }}
              locale={{
                emptyText: (
                  <Empty
                    description={
                      t("employer.evaluation.list.empty") ||
                      "Chưa có đánh giá nào cho công việc này"
                    }
                  />
                ),
              }}
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: selectedEvaluations.map(item => item.id),
                onChange: (selectedRowKeys, selectedRows) => {
                  if (selectedRows.length > 3) {
                    message.info(t("employer.evaluation.compare.max_limit") || "Chỉ có thể so sánh tối đa 3 ứng viên");
                    setSelectedEvaluations(selectedRows.slice(0, 3));
                  } else {
                    setSelectedEvaluations(selectedRows);
                  }
                },
                getCheckboxProps: (record) => ({
                  disabled: selectedEvaluations.length >= 3 && !selectedEvaluations.find(e => e.id === record.id),
                }),
              }}
            />
          </BoxContainer>
        </>
      )}      {renderDetailModal()}
        {/* Modal so sánh ứng viên */}      <Modal        title={
          <Space>
            <BarChartOutlined />
            <span>{t("employer.evaluation.compare.title") || "So sánh ứng viên"}</span>
          </Space>
        }        open={compareModalVisible}
        onCancel={handleCloseCompareModal}
        width={1200}
        footer={[
          <Button key="back" onClick={handleCloseCompareModal} type="primary" size="large">
            {t("common.close") || "Đóng"}
          </Button>,
        ]}
        className="candidate-comparison-modal"
      >
        {selectedEvaluations.length > 0 && (
          <>            <Row gutter={[24, 24]} className="comparison-header">
              <Col span={4}>
                <div className="criteria-label">
                  <Text strong>{t("employer.evaluation.compare.criteria") || "Tiêu chí"}</Text>
                </div>
              </Col>
              {selectedEvaluations.map((evaluation, index) => (
                <Col span={20 / selectedEvaluations.length} key={evaluation.id}>
                  <Card 
                    size="small" 
                    className="comparison-candidate-card"
                    bordered={false}                    style={{ 
                      background: '#ffffff',
                      borderTop: '3px solid #1677ff'
                    }}
                  >
                    <Flex vertical align="center" gap={10}>                      <Avatar                        size={70} 
                        icon={<UserOutlined />} 
                        style={{ 
                          backgroundColor: '#1677ff',
                          fontSize: '30px'
                        }}
                      />                      <Text strong style={{ fontSize: '20px' }}>{evaluation?.studentName || "Không có tên"}</Text>
                      <Text type="secondary" ellipsis style={{ fontSize: '14px' }}>{evaluation?.studentEmail || ""}</Text>
                      <Tag color={evaluation.isRecommended ? "success" : "error"} style={{ margin: '8px 0', padding: '4px 12px', fontSize: '14px' }}>
                        {evaluation.isRecommended 
                          ? t("employer.evaluation.list.recommended") || "Đề xuất tuyển dụng"
                          : t("employer.evaluation.list.not_recommended") || "Không đề xuất"
                        }
                      </Tag>
                    </Flex>
                  </Card>
                </Col>
              ))}
            </Row>
            
            <Divider>{t("employer.evaluation.compare.overall") || "Đánh giá tổng quan"}</Divider>              <Row gutter={[24, 16]} className="comparison-row">
              <Col span={4}>
                <Text strong>{t("employer.evaluation.list.table.overall_rating") || "Đánh giá chung"}</Text>
              </Col>
              {selectedEvaluations.map((evaluation, index) => (
                <Col span={20 / selectedEvaluations.length} key={evaluation.id}>
                  <Flex vertical align="center">                    <div className="rating-circle"
                      style={{ 
                        borderColor: '#1677ff',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <div className="rating-value">
                        {evaluation.overallRating}
                        <span className="rating-max">/10</span>
                      </div>
                    </div>                    <Rate 
                      disabled 
                      allowHalf 
                      value={evaluation.overallRating / 2} 
                      style={{ fontSize: "18px", marginTop: "10px" }}
                    />
                  </Flex>
                </Col>
              ))}
            </Row>
              <Divider>{t("employer.evaluation.skills.title") || "Đánh giá kỹ năng"}</Divider>
              
              {/* Kỹ năng chuyên môn */}
              <Row gutter={[24, 16]} className="comparison-row">
                <Col span={4}>
                  <div className="skill-label-container">
                    <Tag color="blue" className="skill-tag">
                      <CodeOutlined style={{ marginRight: 6 }} />
                      {t("employer.evaluation.skills.technical") || "Kỹ năng chuyên môn"}
                    </Tag>
                  </div>
                </Col>
                {selectedEvaluations.map((evaluation, index) => (
                  <Col span={20 / selectedEvaluations.length} key={evaluation.id}>
                    <Card 
                      className="skill-rating-card"
                      bordered={false} 
                      style={{ 
                        background: 'rgba(24, 144, 255, 0.04)',
                        borderRadius: '12px',
                        overflow: 'hidden'
                      }}
                    >
                      <Flex vertical align="center" gap={12}>
                        <Text className="skill-score" 
                          style={{ 
                            color: '#1677ff',
                            fontSize: '34px',
                            fontWeight: '600',
                          }}
                        >
                          {evaluation.technicalSkills}
                        </Text>
                        <Rate 
                          disabled 
                          value={evaluation.technicalSkills / 2} 
                          count={5}
                          style={{ 
                            fontSize: '20px',
                            color: '#faad14'
                          }}
                        />
                      </Flex>
                    </Card>
                  </Col>
                ))}
            </Row>              {/* Kỹ năng giao tiếp */}            <Row gutter={[24, 16]} className="comparison-row">
              <Col span={4}>
                <Text strong>{t("employer.evaluation.skills.communication") || "Kỹ năng giao tiếp"}</Text>
              </Col>
              {selectedEvaluations.map((evaluation, index) => (
                <Col span={20 / selectedEvaluations.length} key={evaluation.id}>
                  <Card 
                    className="skill-rating-card"
                    bordered={false} 
                    style={{ 
                      background: 'rgba(0, 0, 0, 0.02)'
                    }}
                  >                    <Flex vertical align="center" gap={8}>
                      <Text className="skill-score" 
                        style={{ 
                          color: '#1677ff' 
                        }}
                      >
                        {evaluation.communicationSkills}
                      </Text>                      <Rate 
                        disabled 
                        value={evaluation.communicationSkills / 2} 
                        count={5}
                        style={{ 
                          fontSize: '26px',
                          color: '#faad14'
                        }}
                      />
                    </Flex>
                  </Card>
                </Col>
              ))}
            </Row>              {/* Phù hợp văn hóa */}            <Row gutter={[24, 16]} className="comparison-row">
              <Col span={4}>
                <Text strong>{t("employer.evaluation.skills.culture_fit") || "Phù hợp văn hóa"}</Text>
              </Col>
              {selectedEvaluations.map((evaluation, index) => (
                <Col span={20 / selectedEvaluations.length} key={evaluation.id}>
                  <Card 
                    className="skill-rating-card"
                    bordered={false} 
                    style={{ 
                      background: 'rgba(0, 0, 0, 0.02)' 
                    }}
                  >                    <Flex vertical align="center" gap={8}>
                      <Text className="skill-score" 
                        style={{ 
                          color: '#1677ff' 
                        }}
                      >
                        {evaluation.cultureFit}
                      </Text>                      <Rate 
                        disabled 
                        value={evaluation.cultureFit / 2} 
                        count={5}
                        style={{ 
                          fontSize: '26px',
                          color: '#faad14'
                        }}
                      />
                    </Flex>
                  </Card>
                </Col>
              ))}
            </Row>              {/* Giải quyết vấn đề */}            <Row gutter={[24, 16]} className="comparison-row">
              <Col span={4}>
                <Text strong>{t("employer.evaluation.skills.problem_solving") || "Giải quyết vấn đề"}</Text>
              </Col>
              {selectedEvaluations.map((evaluation, index) => (
                <Col span={20 / selectedEvaluations.length} key={evaluation.id}>
                  <Card 
                    className="skill-rating-card"
                    bordered={false} 
                    style={{ 
                      background: 'rgba(0, 0, 0, 0.02)'
                    }}
                  >                    <Flex vertical align="center" gap={8}>
                      <Text className="skill-score" 
                        style={{ 
                          color: '#1677ff'
                        }}
                      >
                        {evaluation.problemSolving}
                      </Text>                      <Rate 
                        disabled 
                        value={evaluation.problemSolving / 2} 
                        count={5}
                        style={{ 
                          fontSize: '26px',
                          color: '#faad14'
                        }}
                      />
                    </Flex>
                  </Card>
                </Col>
              ))}
            </Row>              {/* Thái độ làm việc */}            <Row gutter={[24, 16]} className="comparison-row">
              <Col span={4}>
                <Text strong>{t("employer.evaluation.skills.attitude") || "Thái độ làm việc"}</Text>
              </Col>
              {selectedEvaluations.map((evaluation, index) => (
                <Col span={20 / selectedEvaluations.length} key={evaluation.id}>
                  <Card 
                    className="skill-rating-card"
                    bordered={false} 
                    style={{ 
                      background: 'rgba(0, 0, 0, 0.02)'
                    }}
                  >                    <Flex vertical align="center" gap={8}>
                      <Text className="skill-score" 
                        style={{ 
                          color: '#1677ff'
                        }}
                      >
                        {evaluation.attitude}
                      </Text>                      <Rate 
                        disabled 
                        value={evaluation.attitude / 2} 
                        count={5}
                        style={{ 
                          fontSize: '26px',
                          color: '#faad14'
                        }}
                      />
                    </Flex>
                  </Card>
                </Col>
              ))}
            </Row>
            
            <Divider>{t("employer.evaluation.compare.notes") || "Ghi chú"}</Divider>              {/* Điểm mạnh */}
            <Row gutter={[24, 24]} className="comparison-row">
              <Col span={4}>
                <Flex align="center" style={{ height: '100%' }}>
                  <div className="note-label-container">
                    <Space>
                      <PlusCircleOutlined style={{ color: '#52c41a', fontSize: '18px' }} />
                      <Text strong style={{ fontSize: '16px' }}>{t("employer.evaluation.notes.strengths") || "Điểm mạnh"}</Text>
                    </Space>
                  </div>
                </Flex>
              </Col>
              {selectedEvaluations.map((evaluation, index) => (
                <Col span={20 / selectedEvaluations.length} key={evaluation.id}>
                  <Card 
                    size="small" 
                    className="comparison-notes-card" 
                    bordered={false}
                    style={{
                      borderLeft: `3px solid #52c41a`,
                      background: 'rgba(82, 196, 26, 0.03)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s ease'
                    }}
                    title={
                      <div style={{ fontSize: '16px', color: '#52c41a', fontWeight: 500 }}>
                        <PlusCircleOutlined style={{ marginRight: 8 }} />
                        {t("employer.evaluation.notes.strengths") || "Điểm mạnh"}
                      </div>
                    }
                  >
                    <Paragraph 
                      ellipsis={{ rows: 4, expandable: true, symbol: 'Xem thêm' }}
                      style={{ fontSize: '15px', lineHeight: '1.8' }}
                    >
                      {evaluation.strengths}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
              {/* Điểm cần cải thiện */}            <Row gutter={[24, 24]} className="comparison-row">
              <Col span={4}>
                <Flex align="center" style={{ height: '100%' }}>
                  <div className="note-label-container weakness-label">
                    <Space>
                      <MinusCircleOutlined style={{ color: '#fa8c16', fontSize: '18px' }} />
                      <Text strong style={{ fontSize: '16px' }}>{t("employer.evaluation.notes.weaknesses") || "Điểm cần cải thiện"}</Text>
                    </Space>
                  </div>
                </Flex>
              </Col>
              {selectedEvaluations.map((evaluation, index) => (
                <Col span={20 / selectedEvaluations.length} key={evaluation.id}>
                  <Card 
                    size="small" 
                    className="comparison-notes-card weakness-card" 
                    bordered={false}
                    style={{
                      borderLeft: `3px solid #fa8c16`,
                      background: 'rgba(250, 140, 22, 0.03)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s ease'
                    }}
                    title={
                      <div style={{ fontSize: '16px', color: '#fa8c16', fontWeight: 500 }}>
                        <MinusCircleOutlined style={{ marginRight: 8 }} />
                        {t("employer.evaluation.notes.weaknesses") || "Điểm cần cải thiện"}
                      </div>
                    }
                  >
                    <Paragraph 
                      ellipsis={{ rows: 4, expandable: true, symbol: 'Xem thêm' }}
                      style={{ fontSize: '15px', lineHeight: '1.8' }}
                    >
                      {evaluation.weaknesses}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
              {/* Thông tin khuyến nghị (nếu có) */}
            {selectedEvaluations.some(e => e.isRecommended) && (
              <>
                <Divider>{t("employer.evaluation.recommendation.title") || "Khuyến nghị"}</Divider>
                  {/* Vị trí đề xuất */}                <Row gutter={[24, 16]} className="comparison-row">
                  <Col span={4}>
                    <Flex align="center" style={{ height: '100%' }}>
                      <div className="note-label-container">
                        <Text strong>{t("employer.evaluation.recommendation.position") || "Vị trí đề xuất"}</Text>
                      </div>
                    </Flex>
                  </Col>
                  {selectedEvaluations.map((evaluation, index) => (
                    <Col span={20 / selectedEvaluations.length} key={evaluation.id}>
                      <Card 
                        size="small" 
                        className="comparison-recommendation-card"
                        bordered={false}
                        style={{ 
                          borderBottom: `2px solid #1677ff`
                        }}
                      >                        <Flex align="center" justify="center" style={{ minHeight: '40px' }}>
                          <Text 
                            style={{ 
                              fontWeight: 500, 
                              color: evaluation.isRecommended ? '#1677ff' : '#f5222d' 
                            }}
                          >
                            {evaluation.isRecommended ? evaluation.recommendedPosition || "-" : "Không đề xuất"}
                          </Text>
                        </Flex>
                      </Card>
                    </Col>
                  ))}
                </Row>
                  {/* Mức lương đề xuất */}                <Row gutter={[24, 16]} className="comparison-row">
                  <Col span={4}>
                    <Flex align="center" style={{ height: '100%' }}>
                      <div className="note-label-container">
                        <Text strong>{t("employer.evaluation.recommendation.salary") || "Mức lương đề xuất"}</Text>
                      </div>
                    </Flex>
                  </Col>
                  {selectedEvaluations.map((evaluation, index) => (
                    <Col span={20 / selectedEvaluations.length} key={evaluation.id}>
                      <Card 
                        size="small" 
                        className="comparison-recommendation-card"
                        bordered={false}
                        style={{ 
                          borderBottom: `2px solid #1677ff`
                        }}
                      >                        <Flex align="center" justify="center" style={{ minHeight: '40px' }}>
                          <Text 
                            style={{ 
                              fontWeight: 500, 
                              color: evaluation.isRecommended ? '#1677ff' : '#f5222d' 
                            }}
                          >
                            {evaluation.isRecommended 
                              ? (evaluation.recommendedSalary?.toLocaleString('vi-VN') + " VND") || "-" 
                              : "Không đề xuất"}
                          </Text>
                        </Flex>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </>
        )}
      </Modal>
    </Flex>
  );
};

export default JobEvaluations;