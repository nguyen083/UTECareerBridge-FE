import React, { useState, useEffect } from "react";
import { 
  Tabs, 
  Typography, 
  Row, 
  Col, 
  Card, 
  List, 
  Button, 
  Upload, 
  message, 
  Spin, 
  Radio, 
  Modal, 
  Empty, 
  Progress,
  Divider,
  Tag,
  Alert,
  Tooltip,
  Badge,
  Skeleton,
  Space
} from "antd";
import { 
  UploadOutlined, 
  FileTextOutlined, 
  FileOutlined, 
  CheckCircleOutlined,
  RobotOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  LaptopOutlined,
  TrophyOutlined,
  SafetyOutlined,
  RiseOutlined,
  StarOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useResume } from "../../../composables/resume";
import { getRecommendationsByResumeId } from "../../../services/apiService";
import "./CVAnalysis.scss";
import "./AnalysisResultModal.scss"; // Import modal styling

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const CVAnalysis = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: resumeData, refetch: refetchResume, isLoading: isLoadingResumes } = useResume();
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [listResumes, setListResumes] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [activeTab, setActiveTab] = useState("existing");
  const [loadingAnimation, setLoadingAnimation] = useState(false);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format relative time
  const formatRelativeTime = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return t('common.justNow');
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? t('common.minuteAgo') : t('common.minutesAgo')}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? t('common.hourAgo') : t('common.hoursAgo')}`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return t('common.daysAgo', { value: days });
    } else {
      return formatDate(dateString);
    }
  };

  // Format currency function
  const formatCurrency = (value) => {
    if (!value) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  // Format time remaining for job deadline  
  const now = new Date();

  const formatDeadline = (deadline) => {
    if (!deadline) return "";
    const date = new Date(deadline);
    const timeDiff = date.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysLeft < 0) {
      return <Text type="danger">{t('job.deadline.expired')}</Text>;
    } else if (daysLeft === 0) {
      return <Text type="warning">{t('job.deadline.today')}</Text>;
    } else if (daysLeft === 1) {
      return <Text type="warning">{t('job.deadline.tomorrow')}</Text>;
    } else if (daysLeft <= 3) {
      return <Text type="warning">{daysLeft} {t('job.deadline.daysLeft')}</Text>;
    } else {
      return <Text>{daysLeft} {t('job.deadline.daysLeft')}</Text>;
    }
  };

  // Get SVG background for loader
  const getSvgBackground = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="Gradient1" cx="50%" cy="50%" fx="0.441602%" fy="50%" r=".5">
            <animate attributeName="fx" dur="34s" values="0%;3%;0%" repeatCount="indefinite"></animate>
            <stop offset="0%" stopColor="rgba(24, 144, 255, 0.3)"></stop>
            <stop offset="100%" stopColor="rgba(24, 144, 255, 0)"></stop>
          </radialGradient>
          <radialGradient id="Gradient2" cx="50%" cy="50%" fx="2.68147%" fy="50%" r=".5">
            <animate attributeName="fx" dur="23.5s" values="0%;3%;0%" repeatCount="indefinite"></animate>
            <stop offset="0%" stopColor="rgba(82, 196, 26, 0.3)"></stop>
            <stop offset="100%" stopColor="rgba(82, 196, 26, 0)"></stop>
          </radialGradient>
          <radialGradient id="Gradient3" cx="50%" cy="50%" fx="0.836536%" fy="50%" r=".5">
            <animate attributeName="fx" dur="21.5s" values="0%;3%;0%" repeatCount="indefinite"></animate>
            <stop offset="0%" stopColor="rgba(250, 173, 20, 0.3)"></stop>
            <stop offset="100%" stopColor="rgba(250, 173, 20, 0)"></stop>
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient1)">
          <animate attributeName="x" dur="20s" values="25%;0%;25%" repeatCount="indefinite" />
          <animate attributeName="y" dur="21s" values="0%;25%;0%" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="7s" repeatCount="indefinite"/>
        </rect>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient2)">
          <animate attributeName="x" dur="23s" values="0%;-25%;0%" repeatCount="indefinite" />
          <animate attributeName="y" dur="24s" values="25%;-25%;25%" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="12s" repeatCount="indefinite"/>
        </rect>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient3)">
          <animate attributeName="x" dur="25s" values="-25%;0%;-25%" repeatCount="indefinite" />
          <animate attributeName="y" dur="26s" values="0%;-25%;0%" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="9s" repeatCount="indefinite"/>
        </rect>
      </svg>
    );
  };

  // Upload props
  const uploadProps = {
    name: 'file',
    accept: '.pdf,.doc,.docx',
    fileList,
    beforeUpload: (file) => {
      const isPDF = file.type === 'application/pdf';
      const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const isDoc = file.type === 'application/msword';
      
      if (!isPDF && !isDocx && !isDoc) {
        message.error({
          content: t('cv.upload.fileType'),
          icon: <CloseOutlined style={{ color: '#ff4d4f' }} />
        });
        return Upload.LIST_IGNORE;
      }
      
      const isLessThan5M = file.size / 1024 / 1024 < 5;
      if (!isLessThan5M) {
        message.error({
          content: t('cv.upload.fileMax'),
          icon: <CloseOutlined style={{ color: '#ff4d4f' }} />
        });
        return Upload.LIST_IGNORE;
      }
      
      setFileList([file]);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
    showUploadList: {
      showPreviewIcon: true,
      showDownloadIcon: false,
      showRemoveIcon: true,
    }
  };

  // Load resumes
  useEffect(() => {
    if (resumeData) {
      const formattedResumes = resumeData.data.map((item) => ({
        id: item.resumeId,
        title: item.resumeTitle || "",
        description: item.resumeDescription || "",
        updatedAt: item.updatedAt || "",
        file: item.resumeFile || "",
        isActive: item.isActive || false,
      }));
      setListResumes(formattedResumes);
      
      // Set the active resume as the default selected resume
      const activeResume = formattedResumes.find(resume => resume.isActive);
      if (activeResume) {
        setSelectedResumeId(activeResume.id);
      } else if (formattedResumes.length > 0) {
        setSelectedResumeId(formattedResumes[0].id);
      }
    }
  }, [resumeData]);

  // Handle resume selection
  const handleResumeSelect = (resumeId) => {
    setSelectedResumeId(resumeId);
  };

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === "existing") {
      setFileList([]);
    } else {
      setSelectedResumeId(null);
    }
  };

  // Handle analyze action
  const handleAnalyze = async () => {
    // Make sure we have a resume to analyze (either selected or uploaded)
    if (activeTab === "existing" && !selectedResumeId) {
      message.warning({
        content: t('cv.analysis.warning.noCV'),
        icon: <InfoCircleOutlined style={{ color: '#faad14' }} />
      });
      return;
    } else if (activeTab === "upload" && fileList.length === 0) {
      message.warning({
        content: t('cv.analysis.warning.noCV'),
        icon: <InfoCircleOutlined style={{ color: '#faad14' }} />
      });
      return;
    }
    
    setIsAnalyzing(true);
    setLoadingAnimation(true);
    message.loading({ 
      content: t('cv.analysis.analyzing'), 
      key: 'analyzeLoading', 
      duration: 0,
      style: {
        marginTop: '20px',
      }
    });
    
    try {
      // Call the actual API for CV analysis using the selected resume ID
      const response = await getRecommendationsByResumeId(selectedResumeId);
      
      if (response && response.data) {
        // Hide loading message
        message.success({ 
          content: t('cv.analysis.result.success'), 
          key: 'analyzeLoading', 
          duration: 2,
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
        });
        
        // Calculate average match score
        const recommendations = response.data.recommendations || [];
        const avgScore = recommendations.length > 0 
          ? Math.round(
              recommendations.reduce((sum, job) => sum + job.match_score * 100, 0) / recommendations.length
            )
          : 0;
          
        // Format the response for our UI
        const formattedResult = {
          score: avgScore,
          jobs: recommendations.map(job => ({
            id: job.job_id,
            title: job.job_title,
            company: job.company_name,
            logo: job.logo,
            match: Math.round(job.match_score * 100),
            location: job.job_location,
            minSalary: job.job_min_salary,
            maxSalary: job.job_max_salary,
            matchedSkills: job.matched_skills || [],
            missingSkills: job.missing_skills || [],
            deadline: job.deadline,
            urgentJob: job.urgent_job,
            hotJob: job.hot_job,
          })).sort((a, b) => b.match - a.match) // Sort by match score
        };
        
        // Add a small delay for a smoother transition
        setTimeout(() => {
          setAnalysisResult(formattedResult);
          setShowResult(true);
          setLoadingAnimation(false);
        }, 500);
      } else {
        message.error({ 
          content: t('cv.analysis.error'), 
          key: 'analyzeLoading',
          icon: <CloseOutlined style={{ color: '#ff4d4f' }} />
        });
        setLoadingAnimation(false);
      }
    } catch (error) {
      console.error("Error analyzing CV:", error);
      message.error({ 
        content: t('cv.analysis.error'), 
        key: 'analyzeLoading',
        icon: <CloseOutlined style={{ color: '#ff4d4f' }} />
      });
      setLoadingAnimation(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle closing the results modal
  const handleCloseResult = () => {
    setShowResult(false);
  };

  // Navigate to recommended jobs
  const handleViewRecommended = () => {
    if (analysisResult?.resumeId) {
      navigate(`/app/student/recommended-jobs/${analysisResult.resumeId}`);
      handleCloseResult();
    }
  };

  // View job details
  const handleViewJob = (jobId) => {
    if (jobId) {
      navigate(`/app/student/jobs/${jobId}`);
    }
  };

  // Get match color
  const getMatchColor = (percentage) => {
    if (percentage >= 80) return '#52c41a'; // success
    if (percentage >= 60) return '#1890ff'; // primary
    if (percentage >= 40) return '#faad14'; // warning
    return '#ff4d4f'; // error
  };

  // Format job recommendation cards based on API response
  const renderJobCard = (job) => {
    return (
      <Card 
        className="job-recommendation-card" 
        hoverable 
        onClick={() => handleViewJob(job.id)}
        bodyStyle={{ padding: 0 }}
      >
        <div className="job-card-wrapper">
          <div className="job-main-content">
            <div className="company-logo-container">
              {job.logo ? (
                <img src={job.logo} alt={job.company} className="company-logo" />
              ) : (
                <div className="company-logo-placeholder">
                  {job.company?.charAt(0) || "C"}
                </div>
              )}
            </div>
            
            <div className="job-details">
              <Title level={5} ellipsis={{ rows: 1 }} className="job-title">
                {job.title}
              </Title>
              <Text className="company-name">{job.company}</Text>
              
              <div className="job-meta">
                <div className="location">
                  <EnvironmentOutlined /> {job.location}
                </div>
                <div className="salary">
                  <DollarOutlined /> {formatCurrency(job.minSalary)} - {formatCurrency(job.maxSalary)}
                </div>
              </div>
              
              {job.matchedSkills?.length > 0 && (
                <div className="matched-skills">
                  <Text className="skills-label">cv.analysis.result.matchedSkills:</Text>
                  <div className="skills-list">
                    {job.matchedSkills.map((skill, index) => (
                      index < 3 && <Tag color="success" key={index}>{skill}</Tag>
                    ))}
                    {job.matchedSkills.length > 3 && (
                      <Tag className="more-skills">+{job.matchedSkills.length - 3}</Tag>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="match-percentage">
            <Progress
              type="circle"
              percent={job.match}
              width={64}
              strokeColor={getMatchColor(job.match)}
              strokeWidth={8}
            />
            <div className="match-label">{job.match}% {t('cv.analysis.result.match')}</div>
          </div>
        </div>
      </Card>
    );
  };

  // Render loading animation
  const renderLoadingAnimation = () => {
    return (
      <div className="analysis-loading-overlay" style={{ 
        display: loadingAnimation ? 'flex' : 'none' 
      }}>
        <div className="analysis-loading-content">
          <div className="loader-background">
            {getSvgBackground()}
          </div>
          <Spin size="large" />
          <div className="loading-text">{t('cv.analysis.analyzing')}</div>
          <div className="loading-subtext">{t('cv.analysis.pleaseWait')}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="cv-analysis-container">
      {renderLoadingAnimation()}
      
      <div className="cv-analysis-header">
        <Row gutter={[24, 24]} align="middle" justify="space-between">
          <Col xs={24} md={16}>
            <Title level={2}>
              <RobotOutlined /> {t('cv.analysis.title')}
            </Title>
            <Paragraph>{t('cv.analysis.subtitle')}</Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate('/cv-builder')}
              icon={<FileTextOutlined />}
            >
              {t('cv.analysis.createCV')}
            </Button>
          </Col>
        </Row>
      </div>
      
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={16}>
          <Card className="cv-selection-card">
            <Tabs 
              defaultActiveKey="existing" 
              onChange={handleTabChange}
              tabBarGutter={24}
              animated={{ tabPane: true }}
            >
              <TabPane 
                tab={
                  <span className="tab-label">
                    <FileTextOutlined /> {t('cv.analysis.tabs.existing')}
                  </span>
                } 
                key="existing"
              >
                {isLoadingResumes ? (
                  <div className="loading-container">
                    <Spin size="large" />
                    <Text className="loading-text">{t('cv.analysis.loading')}</Text>
                  </div>
                ) : listResumes.length === 0 ? (
                  <Empty 
                    description={
                      <Space direction="vertical" align="center" size={12}>
                        <Text strong>{t('cv.analysis.noExistingCV')}</Text>
                        <Text type="secondary">
                          {t('cv.analysis.createYourCV')}
                          <Tooltip title={t('cv.builder.pageDescription')}>
                            <InfoCircleOutlined style={{ marginLeft: 8 }} />
                          </Tooltip>
                        </Text>
                      </Space>
                    }
                  >
                    <Button 
                      type="primary" 
                      onClick={() => navigate('/cv-builder')}
                      icon={<FileTextOutlined />}
                    >
                      {t('cv.analysis.createCV')}
                    </Button>
                  </Empty>
                ) : (
                  <Radio.Group 
                    onChange={(e) => handleResumeSelect(e.target.value)} 
                    value={selectedResumeId}
                    style={{ width: '100%' }}
                  >
                    <List
                      dataSource={listResumes}
                      renderItem={(resume) => (
                        <List.Item>
                          <Card 
                            className={`resume-card ${selectedResumeId === resume.id ? 'selected' : ''}`}
                            hoverable
                            onClick={() => handleResumeSelect(resume.id)}
                          >
                            <Radio value={resume.id} className="resume-radio" />
                            <div className="resume-info">
                              <div className="resume-header">
                                <Title level={5} className="resume-title" ellipsis={{ rows: 1, tooltip: resume.title }}>
                                  {resume.title}
                                </Title>
                                {resume.isActive && (
                                  <Badge 
                                    className="resume-badge"
                                    status="success" 
                                    text={<Text type="success" className="active-badge">
                                      <CheckCircleOutlined /> {t('common.active')}
                                    </Text>}
                                  />
                                )}
                              </div>
                              
                              <Paragraph ellipsis={{ rows: 2, tooltip: resume.description }} className="resume-description">
                                {resume.description || t('cv.noDescription')}
                              </Paragraph>
                              
                              <div className="resume-meta">
                                <Text type="secondary" className="last-updated">
                                  <ClockCircleOutlined /> {t('cv.analysis.lastUpdated')}: {formatRelativeTime(resume.updatedAt)}
                                </Text>
                              </div>
                            </div>
                            
                            <div className="resume-actions">
                              <Tooltip title={t('common.view')}>
                                <Button 
                                  type="primary" 
                                  ghost
                                  shape="circle"
                                  href={resume.file} 
                                  target="_blank"
                                  icon={<EyeOutlined />}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </Tooltip>
                            </div>
                          </Card>
                        </List.Item>
                      )}
                    />
                  </Radio.Group>
                )}
              </TabPane>
              
              <TabPane 
                tab={
                  <span className="tab-label">
                    <UploadOutlined /> {t('cv.analysis.tabs.upload')}
                  </span>
                } 
                key="upload"
              >
                <div className="upload-section">
                  <Title level={4}>{t('cv.analysis.upload.title')}</Title>
                  <Paragraph>{t('cv.analysis.upload.hint')}</Paragraph>
                  
                  <Upload.Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined />
                    </p>
                    <p className="ant-upload-text">{t('cv.upload.fileChoose')}</p>
                    <p className="ant-upload-hint">
                      {t('cv.upload.fileSupport')}
                      <br />
                      <small>{t('cv.upload.fileSizeLimit')}</small>
                    </p>
                  </Upload.Dragger>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card className="info-card">
            <div className="info-card-header">
              <RobotOutlined className="info-icon" />
              <Title level={4}>{t('cv.analysis.info.title')}</Title>
            </div>
            
            <Alert
              message={t('cv.analysis.info.privacyTitle')}
              description={t('cv.analysis.info.privacyDescription')}
              type="info"
              showIcon
              style={{ marginBottom: '24px', borderRadius: '10px' }}
            />
            
            <Paragraph>{t('cv.analysis.info.description')}</Paragraph>
            
            <div className="benefits-list">
              <div className="benefit-item">
                <LaptopOutlined className="benefit-icon" />
                <div>
                  <Text strong>{t('cv.analysis.benefits.aiTitle')}</Text>
                  <Paragraph type="secondary">{t('cv.analysis.benefits.aiDesc')}</Paragraph>
                </div>
              </div>
              <div className="benefit-item">
                <TrophyOutlined className="benefit-icon" />
                <div>
                  <Text strong>{t('cv.analysis.benefits.matchTitle')}</Text>
                  <Paragraph type="secondary">{t('cv.analysis.benefits.matchDesc')}</Paragraph>
                </div>
              </div>
              <div className="benefit-item">
                <RiseOutlined className="benefit-icon" />
                <div>
                  <Text strong>{t('cv.analysis.benefits.insightsTitle')}</Text>
                  <Paragraph type="secondary">{t('cv.analysis.benefits.insightsDesc')}</Paragraph>
                </div>
              </div>
            </div>
            
            <Divider />
            
            <div className="action-section">
              <Button
                type="primary"
                icon={<RobotOutlined />}
                size="large"
                block
                onClick={handleAnalyze}
                loading={isAnalyzing}
                disabled={(activeTab === "existing" && !selectedResumeId) || (activeTab === "upload" && fileList.length === 0)}
              >
                {isAnalyzing ? t('cv.analysis.analyzing') : t('cv.analysis.analyze')}
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* Analysis Results Modal */}
      <Modal
        open={showResult}
        title={
          <div className="modal-header">
            <span className="modal-title">
              <img src="/logo.ico" alt="Logo" className="modal-logo" /> 
              {t('cv.analysis.result.title')}
            </span>
          </div>
        }
        footer={null}
        onCancel={handleCloseResult}
        width={800}
        className="analysis-result-modal"
        closeIcon={<CloseOutlined onClick={handleCloseResult} />}
      >
        {analysisResult && (
          <div className="analysis-result-content">
            <div className="analysis-summary">
              <div className="check-icon">
                <CheckCircleOutlined />
              </div>
              <Title level={4} className="success-title">{t('cv.analysis.result.success')}</Title>
              
              <div className="score-display">
                <Progress
                  type="circle"
                  percent={analysisResult.score}
                  strokeColor={getMatchColor(analysisResult.score)}
                  width={100}
                  strokeWidth={10}
                  format={percent => `${percent}%`}
                />
                <div className="score-text">
                  <h2>{t('cv.analysis.result.subtitle', { score: analysisResult.score })}</h2>
                </div>
              </div>
            </div>

            <div className="matched-jobs-section">
              <div className="section-title">
                <TrophyOutlined className="section-icon" /> {t('cv.analysis.result.jobMatches')}
              </div>

              <Alert
                message={<div className="info-alert">
                  <InfoCircleOutlined /> {t('cv.analysis.result.clickJobAlert')}
                </div>}
                type="info"
                style={{ marginBottom: 16 }}
                action={
                  <Button size="small" type="primary" onClick={handleViewRecommended}>
                    {t('cv.analysis.result.viewAll')}
                  </Button>
                }
              />

              <div className="job-list">
                {analysisResult.jobs.slice(0, 5).map((job) => (
                  <Card 
                    key={job.id}
                    className="job-card" 
                    onClick={() => handleViewJob(job.id)}
                    bodyStyle={{ padding: 0 }}
                  >
                    <div className="job-card-content">
                      <div className="company-logo">
                        {job.logo ? (
                          <img src={job.logo} alt={job.company} />
                        ) : (
                          <div className="company-logo-placeholder">
                            {job.company?.charAt(0) || "C"}
                          </div>
                        )}
                      </div>
                      
                      <div className="job-info">
                        <Title level={5} ellipsis={{ rows: 1 }} className="job-title">
                          {job.title}
                        </Title>
                        <Text className="company-name">{job.company}</Text>
                        
                        <div className="job-meta">
                          <Text type="secondary" style={{display: "flex", alignItems: "center", gap: "6px"}}>
                            <EnvironmentOutlined /> {job.location}
                          </Text>
                          <Text type="secondary" style={{display: "flex", alignItems: "center", gap: "6px"}}>
                            <DollarOutlined /> {formatCurrency(job.minSalary)} - {formatCurrency(job.maxSalary)}
                          </Text>
                        </div>
                        
                        {job.matchedSkills?.length > 0 && (
                          <div className="matched-skills">
                            <Text className="skills-label">{t('cv.analysis.result.matchedSkills')}:</Text>
                            <div className="skills-list">
                              {job.matchedSkills.slice(0, 3).map((skill, index) => (
                                <Tag color="success" key={index}>{skill}</Tag>
                              ))}
                              {job.matchedSkills.length > 3 && (
                                <Tag className="more-skills">+{job.matchedSkills.length - 3}</Tag>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="match-percentage">
                        <Progress
                          type="circle"
                          percent={job.match}
                          width={64}
                          strokeColor={getMatchColor(job.match)}
                          strokeWidth={8}
                        />
                        <div className="match-label">{job.match}% {t('cv.analysis.result.match')}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {analysisResult.jobs.length > 5 && (
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <Button 
                    type="primary" 
                    onClick={handleViewRecommended}
                  >
                    {t('cv.analysis.result.viewAll')} ({analysisResult.jobs.length - 5} {t('common.more')})
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CVAnalysis;