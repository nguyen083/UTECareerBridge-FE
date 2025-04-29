import { useTranslation } from "react-i18next";
import BoxContainer from "../../Generate/BoxContainer";
import { JobCardSmall } from "../../Generate/JobCard";
import { useState, useEffect } from "react";
import job from "../../../services/api/job";
import { useSelector } from "react-redux";
import { 
  Alert, 
  Layout, 
  Typography, 
  Skeleton, 
  Empty, 
  Spin, 
  Tabs, 
  Card, 
  Tag, 
  Button, 
  Tooltip,
  Row,
  Col,
  Rate,
  Divider,
  Progress,
  Switch,
  Input 
} from "antd";
import "./RecommendJob.scss";
import { 
  RobotOutlined, 
  ThunderboltOutlined, 
  RiseOutlined, 
  StarOutlined,
  StarFilled,
  BulbOutlined,
  FilterOutlined,
  ReloadOutlined,
  FireOutlined,
  LikeOutlined,
  DislikeOutlined,
  BarChartOutlined,
  SettingOutlined
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

const RecommendJob = () => {
  const { t } = useTranslation();
  const [recommendJob, setRecommendJob] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [matchScores, setMatchScores] = useState({});
  const [likedJobs, setLikedJobs] = useState([]);
  const [dislikedJobs, setDislikedJobs] = useState([]);
  const [showAIDetails, setShowAIDetails] = useState(false);

  const userId = useSelector(state => state.user.userId);
  const student = useSelector(state => state.student);

  // Simulate AI-based job categories
  const jobCategories = [
    { key: "all", title: t('student.recommend.tabs.all'), icon: <ThunderboltOutlined /> },
    { key: "matched", title: t('student.recommend.tabs.bestMatch'), icon: <RobotOutlined /> },
    { key: "trending", title: t('student.recommend.tabs.trending'), icon: <RiseOutlined /> },
    { key: "saved", title: t('student.recommend.tabs.saved'), icon: <StarOutlined /> }
  ];

  const fetchRecommendJob = async () => {
    setLoading(true);
    try {
      const response = await job.getRecommendJob(userId);
      
      // Transform job data and add random match scores for UI demonstration
      const data = response.map(job => ({
        jobId: job.job_id,
        jobTitle: job.job_title,
        employerResponse: {
          companyLogo: job.logo,
          companyName: job.company_name,
        },
        jobMinSalary: job.job_min_salary,
        jobMaxSalary: job.job_max_salary,
        jobLocation: job.job_location,
        skillMatch: Math.floor(Math.random() * 30) + 70, // Random score between 70-100%
        category: getRandomCategory(),
        isTrending: Math.random() > 0.7 // 30% chance of trending
      }));
      
      // Simulate calculating match scores for each job
      const scores = {};
      data.forEach(job => {
        scores[job.jobId] = {
          overall: job.skillMatch,
          skills: Math.floor(Math.random() * 25) + 70,
          experience: Math.floor(Math.random() * 25) + 70,
          location: Math.floor(Math.random() * 40) + 60
        };
      });
      
      setMatchScores(scores);
      setRecommendJob(data);
    } catch (error) {
      console.error("Error fetching recommended jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get random category for demo
  const getRandomCategory = () => {
    const categories = ["web", "mobile", "data", "design", "ai"];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  useEffect(() => {
    fetchRecommendJob();
    
    // Load saved preferences from localStorage
    const savedLiked = localStorage.getItem('likedJobs');
    const savedDisliked = localStorage.getItem('dislikedJobs');
    
    if (savedLiked) setLikedJobs(JSON.parse(savedLiked));
    if (savedDisliked) setDislikedJobs(JSON.parse(savedDisliked));
  }, []);

  // Handle liking or disliking a job to improve recommendations
  const handleJobFeedback = (jobId, isLiked) => {
    if (isLiked) {
      const updatedLiked = [...likedJobs, jobId];
      setLikedJobs(updatedLiked);
      setDislikedJobs(dislikedJobs.filter(id => id !== jobId));
      localStorage.setItem('likedJobs', JSON.stringify(updatedLiked));
    } else {
      const updatedDisliked = [...dislikedJobs, jobId];
      setDislikedJobs(updatedDisliked);
      setLikedJobs(likedJobs.filter(id => id !== jobId));
      localStorage.setItem('dislikedJobs', JSON.stringify(updatedDisliked));
    }
    
    // In a real app, you would send this feedback to your backend API
    console.log(`User ${isLiked ? 'liked' : 'disliked'} job ${jobId}`);
  };

  // Filter jobs based on active tab
  const filteredJobs = recommendJob.filter(job => {
    switch (activeTab) {
      case "matched":
        return matchScores[job.jobId]?.overall >= 85;
      case "trending":
        return job.isTrending;
      case "saved":
        return likedJobs.includes(job.jobId);
      default:
        return true;
    }
  });

  // Render AI explanation modal/card for each job
  const renderAIExplanationCard = (jobItem) => {
    const score = matchScores[jobItem.jobId];
    
    if (!score) return null;
    
    return (
      <div className="ai-explanation-card">
        <div className="ai-explanation-header">
          <RobotOutlined className="ai-icon" />
          <Text strong>{t('student.recommend.aiExplanation.title')}</Text>
        </div>
        
        <div className="match-factors">
          <div className="match-factor">
            <Text>{t('student.recommend.aiExplanation.skills')}</Text>
            <Progress 
              percent={score.skills} 
              size="small" 
              strokeColor="#1890ff" 
              format={percent => `${percent}%`}
            />
          </div>
          
          <div className="match-factor">
            <Text>{t('student.recommend.aiExplanation.experience')}</Text>
            <Progress 
              percent={score.experience} 
              size="small" 
              strokeColor="#52c41a" 
              format={percent => `${percent}%`}
            />
          </div>
          
          <div className="match-factor">
            <Text>{t('student.recommend.aiExplanation.location')}</Text>
            <Progress 
              percent={score.location} 
              size="small" 
              strokeColor="#722ed1" 
              format={percent => `${percent}%`}
            />
          </div>
        </div>
      </div>
    );
  };

  // Render a job card with AI match information
  const renderJobCard = (jobItem) => {
    const isLiked = likedJobs.includes(jobItem.jobId);
    const isDisliked = dislikedJobs.includes(jobItem.jobId);
    
    return (
      <div className="ai-job-card" key={jobItem.jobId}>
        <div className="job-card-content">
          <JobCardSmall job={jobItem} />
          
          <div className="job-card-actions">
            <Tooltip title={t('student.recommend.actions.like')}>
              <Button 
                type={isLiked ? "primary" : "default"}
                shape="circle" 
                icon={<LikeOutlined />} 
                onClick={() => handleJobFeedback(jobItem.jobId, true)}
              />
            </Tooltip>
            
            <Tooltip title={t('student.recommend.actions.dislike')}>
              <Button 
                danger={isDisliked}
                shape="circle" 
                icon={<DislikeOutlined />} 
                onClick={() => handleJobFeedback(jobItem.jobId, false)}
              />
            </Tooltip>
            
            <div className="match-score-badge">
              <Tooltip title={t('student.recommend.matchScore')}>
                <div className="match-percentage">
                  <RobotOutlined /> {matchScores[jobItem.jobId]?.overall || 0}%
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
        
        {showAIDetails && renderAIExplanationCard(jobItem)}
      </div>
    );
  };

  return (
    <Layout className="recommend-job-layout">
      <Content>
        <div className="recommend-job-header">
          <BoxContainer className="shadow-lg recommendation-header-container">
            <Row gutter={[24, 16]} align="middle">
              <Col xs={24} md={16}>
                <div className="header-content">
                  <div className="header-icon">
                    <RobotOutlined />
                  </div>
                  <div>
                    <Title level={2} className="recommend-title">
                      {t('student.recommend.title')}
                    </Title>
                    <Paragraph className="recommend-subtitle">
                      {t('student.recommend.subtitle')}
                    </Paragraph>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="header-actions">
                  <Tooltip title={t('student.recommend.toggleAI')}>
                    <Switch 
                      checkedChildren={<BulbOutlined />}
                      unCheckedChildren={<BulbOutlined />}
                      checked={showAIDetails}
                      onChange={setShowAIDetails}
                    />
                  </Tooltip>
                  <Tooltip title={t('student.recommend.refresh')}>
                    <Button 
                      icon={<ReloadOutlined />} 
                      onClick={fetchRecommendJob}
                      loading={loading}
                    >
                      {t('student.recommend.refreshBtn')}
                    </Button>
                  </Tooltip>
                </div>
              </Col>
            </Row>
          </BoxContainer>
        </div>

        <BoxContainer className="shadow-lg recommendation-container">
          <div className="ai-insight-panel">
            <Card className="ai-profile-card">
              <div className="ai-profile-header">
                <RobotOutlined className="robot-icon" />
                <div>
                  <Text strong>{t('student.recommend.aiProfile.title')}</Text>
                  <Text type="secondary" className="ai-subtitle">{t('student.recommend.aiProfile.subtitle')}</Text>
                </div>
              </div>
              
              <Divider />
              
              <div className="profile-stats">
                <div className="stat-item">
                  <BarChartOutlined />
                  <div>
                    <Text strong>{student.categoryName || t('student.recommend.aiProfile.category')}</Text>
                    <Text type="secondary">{t('student.recommend.aiProfile.field')}</Text>
                  </div>
                </div>
                
                <div className="stat-item">
                  <FireOutlined />
                  <div>
                    <Text strong>{likedJobs.length}</Text>
                    <Text type="secondary">{t('student.recommend.aiProfile.preferences')}</Text>
                  </div>
                </div>
              </div>
              
              <Divider />
              
              <Alert 
                message={t('student.recommend.aiProfile.tip')}
                description={t('student.recommend.aiProfile.tipDescription')}
                type="info" 
                showIcon 
              />
            </Card>
          </div>
          
          <div className="recommendation-content">
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              className="recommendation-tabs"
            >
              {jobCategories.map(category => (
                <TabPane 
                  tab={
                    <span className="tab-with-icon">
                      {category.icon} {category.title}
                      {category.key === "saved" && likedJobs.length > 0 && (
                        <Tag color="blue">{likedJobs.length}</Tag>
                      )}
                    </span>
                  } 
                  key={category.key}
                />
              ))}
            </Tabs>
            
            <div className="job-list">
              {loading ? (
                <div className="loading-container">
                  <Spin size="large" />
                  <Text className="loading-text">{t('student.recommend.loading')}</Text>
                </div>
              ) : filteredJobs.length > 0 ? (
                <div className="job-cards">
                  {filteredJobs.map(jobItem => renderJobCard(jobItem))}
                </div>
              ) : (
                <Empty 
                  description={t('student.recommend.noJobs')}
                  image={Empty.PRESENTED_IMAGE_SIMPLE} 
                />
              )}
            </div>
          </div>
        </BoxContainer>
      </Content>
    </Layout>
  );
};

export default RecommendJob;