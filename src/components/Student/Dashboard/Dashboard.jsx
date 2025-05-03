import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Statistic, Progress, Button, List, Divider, Avatar, Tag, Skeleton, Tabs, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CalendarOutlined, FileOutlined, UserOutlined, BulbOutlined, BookOutlined, SolutionOutlined, TeamOutlined, PieChartOutlined, BarChartOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import * as apiService from '../../../services/apiService';
import './Dashboard.scss';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer, RadialBarChart, RadialBar,
  AreaChart, Area, LineChart, Line, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const { Title, Text, Paragraph } = Typography;

const StudentDashboard = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    applications: {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
    },
    savedJobs: [],
    recommendedJobs: [],
    upcomingEvents: [],
    activities: [],
    profileCompletion: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // In a real application, these would be separate API calls to get the data
        // For demonstration, we'll simulate the API response
        
        // Get job applications
        const applicationResponse = await apiService.get('/student/applications');
        
        // Get saved jobs
        const savedJobsResponse = await apiService.get('/student/saved-jobs');
        
        // Get recommended jobs
        const recommendedResponse = await apiService.get('/student/recommended-jobs');
        
        // Get upcoming events
        const eventsResponse = await apiService.get('/events/upcoming');
        
        // Get activity history
        const activitiesResponse = await apiService.get('/student/activities');
        
        // Get profile completion status
        const profileResponse = await apiService.get('/student/profile-completion');
        
        // Combine all data
        setDashboardData({
          applications: applicationResponse.data,
          savedJobs: savedJobsResponse.data.slice(0, 3), // Only display top 3
          recommendedJobs: recommendedResponse.data.slice(0, 3), // Only display top 3
          upcomingEvents: eventsResponse.data.slice(0, 2), // Only display top 2
          activities: activitiesResponse.data.slice(0, 5), // Only display top 5
          profileCompletion: profileResponse.data.completionPercentage,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set fallback demo data
        setDashboardData({
          applications: {
            total: 5,
            pending: 2,
            accepted: 2,
            rejected: 1,
          },
          savedJobs: [
            { id: 1, title: 'Software Developer', company: 'ABC Tech', companyLogo: 'https://via.placeholder.com/40', deadline: '2025-06-01' },
            { id: 2, title: 'UX Designer', company: 'Design Co', companyLogo: 'https://via.placeholder.com/40', deadline: '2025-05-25' },
            { id: 3, title: 'Frontend Developer', company: 'Web Solutions', companyLogo: 'https://via.placeholder.com/40', deadline: '2025-05-30' }
          ],
          recommendedJobs: [
            { id: 4, title: 'React Developer', company: 'Tech Innovations', companyLogo: 'https://via.placeholder.com/40', matchPercentage: 95 },
            { id: 5, title: 'Web Developer', company: 'Digital Agency', companyLogo: 'https://via.placeholder.com/40', matchPercentage: 88 },
            { id: 6, title: 'JavaScript Developer', company: 'JavaScript Solutions', companyLogo: 'https://via.placeholder.com/40', matchPercentage: 82 }
          ],
          upcomingEvents: [
            { id: 1, title: 'Career Fair 2025', date: '2025-05-15', location: 'UTE Campus', image: 'https://via.placeholder.com/100x60' },
            { id: 2, title: 'Tech Industry Workshop', date: '2025-05-20', location: 'Online', image: 'https://via.placeholder.com/100x60' }
          ],
          activities: [
            { id: 1, type: 'application', description: 'Applied for Software Developer position at ABC Tech', date: '2025-05-01' },
            { id: 2, type: 'interview', description: 'Interview scheduled with Design Co for UX Designer', date: '2025-05-03' },
            { id: 3, type: 'resume', description: 'Updated your resume', date: '2025-05-04' },
            { id: 4, type: 'saved', description: 'Saved 2 new job positions', date: '2025-05-05' },
            { id: 5, type: 'viewed', description: 'Web Developer position viewed your profile', date: '2025-05-06' }
          ],
          profileCompletion: 75,
        });
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, [user?.id]);  // Sử dụng optional chaining để tránh lỗi khi user là undefined

  // Get current date formatted
  const today = dayjs().format('YYYY-MM-DD');

  // Helper function to get icon by activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'application': return <FileOutlined style={{ color: '#1890ff' }} />;
      case 'interview': return <CalendarOutlined style={{ color: '#52c41a' }} />;
      case 'resume': return <SolutionOutlined style={{ color: '#faad14' }} />;
      case 'saved': return <BookOutlined style={{ color: '#722ed1' }} />;
      case 'viewed': return <UserOutlined style={{ color: '#eb2f96' }} />;
      default: return <FileOutlined />;
    }
  };

  // Prepare data for charts
  const prepareBarChartData = () => {
    // Group activities by date
    const groupedByDate = {};
    dashboardData.activities.forEach(activity => {
      if (!groupedByDate[activity.date]) {
        groupedByDate[activity.date] = { date: activity.date };
      }
      
      if (!groupedByDate[activity.date][activity.type]) {
        groupedByDate[activity.date][activity.type] = 0;
      }
      
      groupedByDate[activity.date][activity.type] += 1;
    });
    
    // Convert to array for Recharts
    return Object.values(groupedByDate).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  };

  const preparePieChartData = () => {
    // Count activities by type
    const countByType = {};
    dashboardData.activities.forEach(activity => {
      if (!countByType[activity.type]) {
        countByType[activity.type] = 0;
      }
      countByType[activity.type] += 1;
    });
    
    // Convert to array for Recharts
    return Object.entries(countByType).map(([type, count]) => ({
      type,
      value: count
    }));
  };
  
  // Color mapping for activities with nicer color palette
  const ACTIVITY_COLORS = {
    application: '#4ECDC4', // Teal
    interview: '#FF6B6B',   // Coral
    resume: '#FFD166',      // Yellow
    saved: '#118AB2',       // Blue
    viewed: '#073B4C'       // Dark blue
  };
  
  // Enhanced gradient colors for charts
  const GRADIENT_COLORS = {
    application: ['#4ECDC4', '#1A535C'],
    interview: ['#FF6B6B', '#C1292E'],
    resume: ['#FFD166', '#F4A261'],
    saved: ['#118AB2', '#073B4C'],
    viewed: ['#073B4C', '#06292F']
  };
  
  // Activity type mapping for UI
  const ACTIVITY_TYPES = {
    application: 'Ứng tuyển',
    interview: 'Phỏng vấn',
    resume: 'Hồ sơ',
    saved: 'Đã lưu',
    viewed: 'Đã xem'
  };
  
  // Tab icons and better labels
  const activityTabItems = [
    {
      key: 'list',
      label: (
        <span>
          <UnorderedListOutlined /> Danh sách
        </span>
      ),
      children: (
        <List
          dataSource={dashboardData.activities}
          locale={{ emptyText: <Empty description={t('student.dashboard.noActivities')} /> }}
          renderItem={item => (
            <List.Item className="activity-list-item">
              <List.Item.Meta
                avatar={
                  <Avatar icon={getActivityIcon(item.type)} style={{ background: ACTIVITY_COLORS[item.type] }} />
                }
                title={<span className="activity-title">{item.description}</span>}
                description={<span className="activity-date">{item.date}</span>}
              />
            </List.Item>
          )}
        />
      )
    },
    {
      key: 'barChart',
      label: (
        <span>
          <BarChartOutlined /> Biểu đồ cột
        </span>
      ),
      children: (
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={prepareBarChartData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                {Object.entries(GRADIENT_COLORS).map(([type, [color1, color2]]) => (
                  <linearGradient key={type} id={`color${type}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color1} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={color2} stopOpacity={0.8}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="date" tick={{ fill: '#666' }} />
              <YAxis tick={{ fill: '#666' }} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                itemStyle={{ padding: '4px 0' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Legend 
                formatter={(value) => ACTIVITY_TYPES[value] || value}
                iconType="circle"
                wrapperStyle={{ paddingTop: '10px' }}
              />
              <Bar 
                dataKey="application" 
                name="application" 
                stackId="a" 
                fill="url(#colorapplication)" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1500}
                animationEasing="ease-out"
              />
              <Bar 
                dataKey="interview" 
                name="interview" 
                stackId="a" 
                fill="url(#colorinterview)" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1500}
                animationEasing="ease-out"
              />
              <Bar 
                dataKey="resume" 
                name="resume" 
                stackId="a" 
                fill="url(#colorresume)" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1500}
                animationEasing="ease-out"
              />
              <Bar 
                dataKey="saved" 
                name="saved" 
                stackId="a" 
                fill="url(#colorsaved)" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1500}
                animationEasing="ease-out"
              />
              <Bar 
                dataKey="viewed" 
                name="viewed" 
                stackId="a" 
                fill="url(#colorviewed)" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    },
    {
      key: 'pieChart',
      label: (
        <span>
          <PieChartOutlined /> Biểu đồ tròn
        </span>
      ),
      children: (
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {Object.entries(GRADIENT_COLORS).map(([type, [color1, color2]]) => (
                  <linearGradient key={type} id={`pieColor${type}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color1} stopOpacity={1}/>
                    <stop offset="95%" stopColor={color2} stopOpacity={1}/>
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={preparePieChartData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percent }) => `${ACTIVITY_TYPES[type] || type}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {preparePieChartData().map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#pieColor${entry.type})`} 
                    stroke="#fff"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value, name) => [
                  `${value} hoạt động`, 
                  ACTIVITY_TYPES[name] || name
                ]}
                labelFormatter={(label) => ''}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                }}
              />
              <Legend 
                formatter={(value) => ACTIVITY_TYPES[value] || value}
                iconType="circle"
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )
    },
    {
      key: 'radarChart',
      label: (
        <span>
          <SolutionOutlined /> Biểu đồ radar
        </span>
      ),
      children: (
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} width={730} height={250} data={preparePieChartData()}>
              <PolarGrid stroke="#e5e5e5" />
              <PolarAngleAxis 
                dataKey="type" 
                tick={{ fill: '#666' }}
                tickFormatter={(value) => ACTIVITY_TYPES[value] || value}
              />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
              <Radar 
                name="Hoạt động" 
                dataKey="value" 
                stroke="#4ECDC4" 
                fill="#4ECDC4" 
                fillOpacity={0.5}
                animationDuration={1500}
                animationEasing="ease-out"
              />
              <RechartsTooltip 
                formatter={(value, name, props) => [
                  `${value} hoạt động`, 
                  ACTIVITY_TYPES[props.payload.type] || props.payload.type
                ]}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                }}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )
    },
  ];

  return (
    <div className="student-dashboard">
      {/* Welcome Header */}
      <Row gutter={[16, 16]} className="dashboard-header">
        <Col span={24}>
          <Card bordered={false} className="welcome-card">
            <div className="welcome-content">
              <div>
                <Title level={2}>{t('student.dashboard.welcome', {name: user?.firstName || 'Student'})}</Title>
                <Text className="subtitle">{t('student.dashboard.subtitle')}</Text>
                <div className="user-info">
                  <Tag color="blue">{t('student.dashboard.student')}</Tag>
                  <Tag color="default">
                    <CalendarOutlined /> {t('student.dashboard.today')}: {today}
                  </Tag>
                </div>
              </div>
              <div className="profile-completion-wrapper">
                <div className="profile-completion">
                  <Progress 
                    type="circle" 
                    percent={dashboardData.profileCompletion} 
                    size="small"
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
                  <div className="completion-text">
                    <Text strong>{t('student.dashboard.profileCompletion')}</Text>
                    <Text type="secondary">{dashboardData.profileCompletion}%</Text>
                  </div>
                </div>
                <div className="profile-actions">
                  <Button type="primary" className="action-button">
                    <Link to="/resume">{t('student.dashboard.viewResume')}</Link>
                  </Button>
                  <Button className="action-button">
                    <Link to="/profile">{t('student.dashboard.editProfile')}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="dashboard-stats">
        {/* Job Applications Stats */}
        <Col xs={24} md={12} lg={6}>
          <Card className="stats-card">
            <Skeleton loading={loading} active paragraph={{ rows: 2 }}>
              <Statistic 
                title={t('student.dashboard.jobsApplied')}
                value={dashboardData.applications.total}
                className="main-statistic"
              />
              <div className="sub-stats">
                <div className="sub-stat">
                  <Text>{t('student.dashboard.pending')}</Text>
                  <Text strong>{dashboardData.applications.pending}</Text>
                </div>
                <div className="sub-stat">
                  <Text>{t('student.dashboard.accepted')}</Text>
                  <Text strong>{dashboardData.applications.accepted}</Text>
                </div>
                <div className="sub-stat">
                  <Text>{t('student.dashboard.rejected')}</Text>
                  <Text strong>{dashboardData.applications.rejected}</Text>
                </div>
              </div>
              <Button type="link" className="view-all-link">
                <Link to="/applications">{t('student.dashboard.viewAllApplications')}</Link>
              </Button>
            </Skeleton>
          </Card>
        </Col>

        {/* Saved Jobs */}
        <Col xs={24} md={12} lg={6}>
          <Card className="stats-card">
            <Skeleton loading={loading} active paragraph={{ rows: 2 }}>
              <Statistic 
                title={t('student.dashboard.savedJobs')}
                value={dashboardData.savedJobs.length}
                className="main-statistic"
              />
              <div className="sub-stats job-list">
                {dashboardData.savedJobs.slice(0, 2).map((job) => (
                  <div key={job.id} className="job-item">
                    <div className="job-title">{job.title}</div>
                    <div className="job-company">{job.company}</div>
                  </div>
                ))}
              </div>
              <Button type="link" className="view-all-link">
                <Link to="/saved-jobs">{t('student.dashboard.viewSavedJobs')}</Link>
              </Button>
            </Skeleton>
          </Card>
        </Col>
        
        {/* Recommended Jobs */}
        <Col xs={24} md={12} lg={6}>
          <Card className="stats-card">
            <Skeleton loading={loading} active paragraph={{ rows: 2 }}>
              <Title level={5}>{t('student.dashboard.recommendedJobs')}</Title>
              <div className="job-recommendations">
                {dashboardData.recommendedJobs.slice(0, 2).map((job) => (
                  <Link to={`/jobs/${job.id}`} key={job.id} className="recommended-job">
                    <Avatar src={job.companyLogo} size="small" />
                    <div className="job-details">
                      <div className="job-title">{job.title}</div>
                      <div className="job-company">{job.company}</div>
                    </div>
                    <Tag color="green">{job.matchPercentage}%</Tag>
                  </Link>
                ))}
              </div>
              <Button type="link" className="view-all-link">
                <Link to="/recommended-jobs">{t('student.dashboard.recommendedJobs')}</Link>
              </Button>
            </Skeleton>
          </Card>
        </Col>

        {/* Upcoming Events */}
        <Col xs={24} md={12} lg={6}>
          <Card className="stats-card">
            <Skeleton loading={loading} active paragraph={{ rows: 2 }}>
              <Title level={5}>{t('student.dashboard.upcomingEvents')}</Title>
              <div className="upcoming-events">
                {dashboardData.upcomingEvents.map((event) => (
                  <Link to={`/events/${event.id}`} key={event.id} className="event-item">
                    <img src={event.image} alt={event.title} className="event-image" />
                    <div className="event-details">
                      <div className="event-title">{event.title}</div>
                      <div className="event-meta">
                        <CalendarOutlined /> {event.date} • {event.location}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Skeleton>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="dashboard-content">
        {/* Recent Activities */}
        <Col xs={24} lg={16}>
          <Card title={t('student.dashboard.recentActivities')} className="activities-card">
            <Skeleton loading={loading} active paragraph={{ rows: 5 }}>
              <Tabs items={activityTabItems} />
            </Skeleton>
          </Card>
        </Col>

        {/* Career Tips */}
        <Col xs={24} lg={8}>
          <Card title={t('student.dashboard.careerTips')} className="tips-card">
            <div className="career-tip">
              <div className="tip-header">
                <BulbOutlined className="tip-icon" />
                <Title level={5}>{t('student.dashboard.resumeBuilding')}</Title>
              </div>
              <Paragraph>
                {t('student.dashboard.resumeTip')}
              </Paragraph>
            </div>
            
            <Divider />
            
            <div className="career-tip">
              <div className="tip-header">
                <TeamOutlined className="tip-icon" />
                <Title level={5}>{t('student.dashboard.interviewPrep')}</Title>
              </div>
              <Paragraph>
                {t('student.dashboard.interviewTip')}
              </Paragraph>
            </div>
            
            <Divider />
            
            <div className="career-tip">
              <div className="tip-header">
                <SolutionOutlined className="tip-icon" />
                <Title level={5}>{t('student.dashboard.networkingSkills')}</Title>
              </div>
              <Paragraph>
                {t('student.dashboard.networkingTip')}
              </Paragraph>
            </div>
            
            <Button type="link" className="learn-more-link">
              {t('student.dashboard.learnMore')}
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentDashboard;