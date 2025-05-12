import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Card, 
  Typography, 
  Button, 
  Empty, 
  Spin, 
  Tag, 
  Space, 
  Flex, 
  Tooltip,
  Input,
  Row,
  Col,
  Badge,
  Avatar
} from "antd";
import { 
  FileSearchOutlined, 
  SearchOutlined, 
  BarChartOutlined,
  SolutionOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  IdcardOutlined,
  DollarOutlined
} from "@ant-design/icons";
import BoxContainer from "../../Generate/BoxContainer";
import interview from "../../../services/api/interview";
import "./CandidateEvaluation.scss";

const { Title, Text } = Typography;
const { Search } = Input;

const JobEvaluationList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Gọi API để lấy danh sách các công việc có đánh giá
  useEffect(() => {
    const fetchJobsWithEvaluations = async () => {
      try {
        setLoading(true);
        // Cần thêm API này ở backend hoặc thay thế bằng API hiện có
        const response = await interview.getJobsWithEvaluations();
        
        console.log("API Response:", response);
        
        if (response && response.status === "OK") {          // Kiểm tra cấu trúc dữ liệu API trả về
          if (response.data && typeof response.data === 'object' && Array.isArray(response.data.jobResponses)) {
            // Cấu trúc API mới: { jobResponses: [ ...jobs ], totalPages: number, totalElements: number }
            setJobs(response.data.jobResponses);
            console.log("Jobs array:", response.data.jobResponses);
          } else if (Array.isArray(response.data)) {
            // Cấu trúc API cũ: trả về mảng trực tiếp
            setJobs(response.data);
            console.log("Jobs array (legacy format):", response.data);
          } else {
            // Không tìm thấy dữ liệu hợp lệ
            console.error("API response data is not in expected format:", response.data);
            setJobs([]);
          }
        }
      } catch (error) {
        console.error("Error fetching jobs with evaluations:", error);
        setJobs([]); // Đảm bảo jobs luôn là một mảng
      } finally {
        setLoading(false);
      }
    };

    fetchJobsWithEvaluations();
  }, []);
  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
  };
  
  // Filter jobs dựa trên từ khóa tìm kiếm, đảm bảo jobs là một mảng
  const filteredJobs = Array.isArray(jobs) 
    ? jobs.filter(job => {
        const searchTermLower = searchText.toLowerCase();
        // Tìm kiếm trong cả title và thông tin công ty với cấu trúc dữ liệu mới
        const jobTitle = job.jobTitle || job.title || '';
        const companyName = job.employerResponse?.companyName || job.company || '';
        const jobLocation = job.jobLocation || job.location || '';
        
        return jobTitle.toLowerCase().includes(searchTermLower) || 
               companyName.toLowerCase().includes(searchTermLower) ||
               jobLocation.toLowerCase().includes(searchTermLower);
      })
    : [];  // Render thẻ job
  const renderJobCard = (job) => {
    // Xử lý cấu trúc dữ liệu mới từ API
    const jobId = job.jobId || job.id || Math.random().toString();
    const jobTitle = job.jobTitle || job.title || '';
    const companyName = job.employerResponse?.companyName || job.company || '';
    const jobLocation = job.jobLocation || job.location || '';
    const jobType = job.jobLevel?.nameLevel || job.jobType || '';
    const evaluationCount = job.evaluationCount || 0;
    const companyLogo = job.employerResponse?.companyLogo || '';
    const jobMinSalary = job.jobMinSalary || '';
    const jobMaxSalary = job.jobMaxSalary || '';
    const jobDeadline = job.jobDeadline || '';
    
    // Hiển thị lương nếu có
    const salaryText = (jobMinSalary && jobMaxSalary) 
      ? `${jobMinSalary} - ${jobMaxSalary}`
      : jobMinSalary || jobMaxSalary || "Thương lượng";
    
    return (
      <Col xs={24} sm={12} md={8} lg={8} xl={6} key={jobId}>
        <Card 
          className="job-evaluation-card" 
          hoverable
          cover={
            <div className="card-cover" style={{ 
              height: '120px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <SolutionOutlined className="card-icon" style={{ fontSize: '40px', color: '#1677ff' }} />
              {companyLogo && (
                <Avatar 
                  className="company-logo" 
                  size={36} 
                  src={companyLogo}
                  icon={<UserOutlined />}
                />
              )}
            </div>
          }
          actions={[
            <Button
              type="primary"
              icon={<FileSearchOutlined />}
              onClick={() => navigate(`/employer/interview/evaluations/job/${jobId}`)}
            >
              {t("employer.evaluation.list.view_evaluations") || "Xem đánh giá"}
            </Button>
          ]}
        >
          <Card.Meta
            title={<Text strong style={{ fontSize: '16px' }}>{jobTitle}</Text>}
            description={
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <div className="job-meta-info">
                  <IdcardOutlined className="meta-icon" />
                  <Text type="secondary" ellipsis>{companyName}</Text>
                </div>
                
                <div className="job-meta-info">
                  <EnvironmentOutlined className="meta-icon" />
                  <Text type="secondary" ellipsis>{jobLocation}</Text>
                </div>
                
                {jobDeadline && (
                  <div className="job-meta-info">
                    <CalendarOutlined className="meta-icon" />
                    <Text type="secondary">Hạn: {jobDeadline}</Text>
                  </div>
                )}
                
                <div style={{ 
                  marginTop: '10px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <Tag color="blue" className="job-tag">{jobType}</Tag>
                  <Tooltip title={t("employer.evaluation.list.table.total_evaluations") || "Số đánh giá"}>
                    <Badge 
                      className="evaluation-badge" 
                      count={evaluationCount} 
                      style={{ backgroundColor: '#52c41a' }} 
                    />
                  </Tooltip>
                </div>
                
                <div className="job-meta-info" style={{ marginTop: '6px' }}>
                  <DollarOutlined className="meta-icon" style={{ color: '#52c41a' }} />
                  <Text type="secondary">{salaryText}</Text>
                </div>
              </Space>
            }
          />
        </Card>
      </Col>
    );
  };
  return (
    <Flex vertical gap={20}>
      <BoxContainer className="shadow-md">
        <Flex align="center" gap={16}>
          <div 
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              backgroundColor: '#e6f7ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SolutionOutlined style={{ fontSize: '28px', color: '#1677ff' }} />
          </div>
          <div>
            <div className="title1">
              {t("employer.evaluation.jobs.title") || "Danh sách công việc có đánh giá"}
            </div>
            <p className="text-gray-500 mt-2">
              {t("employer.evaluation.jobs.subtitle") || "Xem đánh giá ứng viên theo từng công việc"}
            </p>
          </div>
        </Flex>
      </BoxContainer>

      <BoxContainer className="shadow-md">
        <Flex justify="space-between" align="center" className="mb-4">
          <Space>
            <BarChartOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
            <Title level={4} style={{ margin: 0 }}>
              {t("employer.evaluation.jobs.list_title") || "Công việc có đánh giá"}
              {jobs.length > 0 && (
                <Tag 
                  color="processing" 
                  style={{ marginLeft: 10, fontSize: '14px', fontWeight: 'normal' }}
                >
                  {jobs.length} công việc
                </Tag>
              )}
            </Title>
          </Space>
          <Search
            placeholder={t("employer.evaluation.jobs.search") || "Tìm kiếm công việc..."}
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            size="large"
          />
        </Flex>
          {loading ? (
          <div className="text-center py-8">
            <Spin size="large" />
            <div className="mt-4">
              {t("employer.evaluation.jobs.loading") || "Đang tải danh sách công việc..."}
            </div>
          </div>        ) : (
            filteredJobs.length > 0 ? (
            <Row gutter={[16, 16]}>
              {filteredJobs.map(job => renderJobCard(job))}
            </Row>
            ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                jobs.length > 0 
                  ? t("employer.evaluation.jobs.no_results") || "Không tìm thấy công việc phù hợp"
                  : t("employer.evaluation.jobs.empty") || "Không có công việc nào có đánh giá"
              }
            />
          )
        )}
      </BoxContainer>
    </Flex>
  );
};

export default JobEvaluationList;
