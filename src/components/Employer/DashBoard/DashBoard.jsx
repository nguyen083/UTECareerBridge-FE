import React, { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Flex, Statistic, Progress, Button, Table, Tag, Empty, Spin, Tooltip, Divider, List, Avatar } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import { useTranslation } from "react-i18next";
import { getInfor, getJobsByStatus, getJobPackage, getCountStudentApplied } from "../../../services/apiService";
import { FaCalendarAlt, FaBriefcase, FaChartLine, FaUsers, FaBell, FaRegClock } from "react-icons/fa";
import { SlUserFollowing } from "react-icons/sl";
import { ImUserTie } from "react-icons/im";
import { LiaBriefcaseSolid } from "react-icons/lia";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./DashBoard.scss";

const { Text, Title } = Typography;

const COLORS = ['#4478c0', '#52c41a', '#fa8c16', '#f5222d', '#722ed1', '#eb2f96'];

// Dynamic data generation for charts
const generateSampleData = () => {
  const today = new Date();
  const last30Days = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0];
    
    last30Days.push({
      date: formattedDate,
      views: Math.floor(Math.random() * 40) + 10,
      applications: Math.floor(Math.random() * 8) + 1
    });
  }
  
  return last30Days;
};

// Sample data for interviews
const generateInterviews = () => {
  const today = new Date();
  const interviews = [];
  
  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    interviews.push({
      id: i,
      candidate: `Candidate ${i + 1}`,
      position: ['Software Engineer', 'UI/UX Designer', 'Product Manager', 'Data Analyst', 'DevOps Engineer'][i],
      time: `${Math.floor(Math.random() * 12) + 9}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      date: date.toISOString().split('T')[0]
    });
  }
  
  return interviews;
};

// Top skills component
const TopSkills = () => {
  const skillData = [
    { name: 'JavaScript', value: 85 },
    { name: 'React', value: 78 },
    { name: 'Node.js', value: 62 },
    { name: 'TypeScript', value: 58 },
    { name: 'SQL', value: 52 }
  ];
  
  return (
    <List
      className="top-skills-list"
      itemLayout="horizontal"
      dataSource={skillData}
      renderItem={item => (
        <List.Item>
          <Flex align="center" justify="space-between" style={{ width: '100%' }}>
            <Text strong>{item.name}</Text>
            <div className="skill-progress">
              <Progress 
                percent={item.value} 
                size="small" 
                format={(percent) => `${percent}%`}
                strokeColor={{
                  '0%': '#4478c0',
                  '100%': '#1E4F94',
                }}
              />
            </div>
          </Flex>
        </List.Item>
      )}
    />
  );
};

const ListPackage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const columns = [
    {
      title: t("employer.dashboard.servicePackage.table.packageName"),
      dataIndex: "packageName",
      key: "packageName",
      render: (text) => <span className="package-name">{text}</span>,
    },
    {
      title: t("employer.dashboard.servicePackage.table.amount"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (text) => (
        <Tag color={text > 5 ? "success" : "warning"} className="amount-tag">
          {text}
        </Tag>
      ),
    },
    {
      title: t("employer.dashboard.servicePackage.table.expiredAt"),
      dataIndex: "expiredAt",
      key: "expiredAt",
      align: "center",
      render: (text) => {
        if (!text) return "-";
        
        const date = new Date(text);
        const today = new Date();
        const diff = date - today;
        const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
        
        return (
          <div className="expiry-container">
            <div className="expiry-date">{text}</div>
            {daysRemaining <= 7 && daysRemaining > 0 ? (
              <Tag color="red" className="expiry-tag">{t('employer.dashboard.servicePackage.expiringSoon', { days: daysRemaining }) || `${daysRemaining} days left`}</Tag>
            ) : daysRemaining <= 0 ? (
              <Tag color="error" className="expiry-tag">{t('employer.dashboard.servicePackage.expired') || "Expired"}</Tag>
            ) : daysRemaining <= 14 ? (
              <Tag color="orange" className="expiry-tag">{daysRemaining} {t('employer.dashboard.servicePackage.daysLeft') || "days left"}</Tag>
            ) : (
              <Tag color="success" className="expiry-tag">{t('employer.dashboard.servicePackage.active') || "Active"}</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: t('common.actions'),
      key: 'action',
      align: 'center',
      render: () => (
        <Button type="link" size="small" className="view-details-btn">
          {t('common.viewDetail')}
        </Button>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    getJobPackage()
      .then((res) => {
        if (res.status === "OK") {
          const formattedData = res.data.map((item) => ({
            id: item.packageResponse.packageId,
            packageName: item.packageResponse.packageName,
            amount: item.amount,
            expiredAt: item?.expiredAt?.split(" ")[0],
          }));
          setData(formattedData);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleBuyService = () => {
    navigate("/employer/buy-service");
  };

  return (
    <div className="package-list">
      <Flex align="center" justify="space-between" className="package-header">
        <Title level={4}>{t("employer.dashboard.servicePackage.title")}</Title>
        <Button 
          type="primary" 
          onClick={handleBuyService}
          className="buy-service-btn"
        >
          {t("employer.dashboard.buyMore") || "Buy More"}
        </Button>
      </Flex>
      
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : data?.length > 0 ? (
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id" 
          pagination={false}
          className="package-table"
        />
      ) : (
        <Empty
          description={t("employer.dashboard.servicePackage.empty") || "No packages available"}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="empty-packages"
        >
          <Button type="primary" onClick={handleBuyService}>
            {t("employer.dashboard.getStarted") || "Get Started"}
          </Button>
        </Empty>
      )}
    </div>
  );
};

const DashBoard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [countStudentApplied, setCountStudentApplied] = useState(0);
  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState(generateSampleData());
  const [jobStatusData, setJobStatusData] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState(generateInterviews());
  
  // Get data from Redux store
  const { countJob, countFollower } = useSelector((state) => state.employer);
  
  const applicationRate = countJob > 0 
    ? Math.round((countStudentApplied / countJob) * 100) 
    : 0;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      // Get count of students who applied
      getCountStudentApplied(),
      // Get jobs by status
      getJobsByStatus({ jobStatus: "ACTIVE", page: 0, limit: 100 }),
      getJobsByStatus({ jobStatus: "INACTIVE", page: 0, limit: 100 }),
      getJobsByStatus({ jobStatus: "PENDING", page: 0, limit: 100 }),
      getJobsByStatus({ jobStatus: "REJECTED", page: 0, limit: 100 })
    ])
    .then(([studentsRes, activeJobsRes, inactiveJobsRes, pendingJobsRes, rejectedJobsRes]) => {
      if (studentsRes.status === "OK") {
        setCountStudentApplied(studentsRes.data);
      }
      
      // Process job status data for charts
      const jobsData = [
        { 
          name: t('employer.manageJobs.tabs.active') || 'Active', 
          value: activeJobsRes.status === "OK" ? activeJobsRes.data.totalElements || 0 : 0,
          color: '#52c41a'
        },
        { 
          name: t('employer.manageJobs.tabs.inactive') || 'Hidden', 
          value: inactiveJobsRes.status === "OK" ? inactiveJobsRes.data.totalElements || 0 : 0,
          color: '#faad14'
        },
        { 
          name: t('employer.manageJobs.tabs.pending') || 'Pending', 
          value: pendingJobsRes.status === "OK" ? pendingJobsRes.data.totalElements || 0 : 0,
          color: '#1890ff'
        },
        { 
          name: t('employer.manageJobs.tabs.rejected') || 'Rejected', 
          value: rejectedJobsRes.status === "OK" ? rejectedJobsRes.data.totalElements || 0 : 0,
          color: '#ff4d4f'
        }
      ];
      
      setJobStatusData(jobsData);
    })
    .catch((err) => {
      console.error("Error fetching dashboard data:", err);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [t]);

  const goToPostJob = () => {
    navigate("/employer/post-job");
  };

  const goToPackages = () => {
    navigate("/employer/buy-service");
  };
  
  const goToInterviews = () => {
    navigate("/employer/interview");
  };
  
  const goToApplicants = () => {
    navigate("/employer/applicant");
  };

  if (loading && !countJob && !countFollower) {
    return (
      <div className="dashboard-loading">
        <Spin size="large" />
        <Text className="loading-text">{t('common.loading')}</Text>
      </div>
    );
  }

  return (
    <>
      <BoxContainer className="shadow-md dashboard-header">
        <Flex align="center" justify="space-between">
          <div className="welcome-container">
            <Title level={3}>{t("employer.dashboard.welcome") || "Welcome to your Dashboard"}</Title>
            <Text type="secondary" className="date-display">
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          </div>
          <div className="dashboard-actions">
            <Button type="primary" onClick={goToPostJob} icon={<FaBriefcase />} className="action-button post-job-btn">
              {t("employer.dashboard.postJob") || "Post a New Job"}
            </Button>
            <Button onClick={goToPackages} className="action-button">
              {t("employer.dashboard.buyPackages") || "Buy Packages"}
            </Button>
          </div>
        </Flex>
      </BoxContainer>
      
      <Row gutter={[24, 24]}>
        {/* Stats Cards */}
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-stat-card followers-card">
            <Statistic
              title={<Text strong>{t("employer.dashboard.stats.followers.title") || "Followers"}</Text>}
              value={countFollower || 0}
              prefix={<SlUserFollowing className="stat-icon" />}
              suffix={<Text>{t("employer.dashboard.stats.followers.unit") || ""}</Text>}
            />
            <div className="stat-footer">
              <Progress 
                percent={countFollower > 0 ? Math.min(100, countFollower) : 0} 
                size="small" 
                showInfo={false} 
                strokeColor="#52c41a"
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-stat-card candidates-card">
            <Statistic
              title={<Text strong>{t("employer.dashboard.stats.candidates.title") || "Candidates"}</Text>}
              value={countStudentApplied || 0}
              prefix={<ImUserTie className="stat-icon" />}
              suffix={<Text>{t("employer.dashboard.stats.candidates.unit") || ""}</Text>}
            />
            <div className="stat-footer">
              <Progress 
                percent={applicationRate} 
                size="small" 
                status="active" 
                strokeColor="#4478c0"
              />
            </div>
            <div className="card-action">
              <Button type="link" size="small" onClick={goToApplicants}>
                {t("employer.dashboard.viewAll") || "View All"}
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-stat-card jobs-card">
            <Statistic
              title={<Text strong>{t("employer.dashboard.stats.jobs.title") || "Jobs"}</Text>}
              value={countJob || 0}
              prefix={<LiaBriefcaseSolid className="stat-icon" />}
              suffix={<Text>{t("employer.dashboard.stats.jobs.unit") || ""}</Text>}
            />
            <div className="stat-footer">
              <Progress 
                percent={countJob > 0 ? 100 : 0} 
                size="small" 
                strokeColor="#722ed1"
                showInfo={false}
              />
            </div>
            <div className="card-action">
              <Button type="link" size="small" onClick={() => navigate("/employer/manage-job")}>
                {t("employer.dashboard.manageJobs") || "Manage Jobs"}
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-stat-card interviews-card">
            <Statistic
              title={<Text strong>{t("employer.dashboard.stats.interviews.title") || "Interviews"}</Text>}
              value={upcomingInterviews.length || 0}
              prefix={<FaCalendarAlt className="stat-icon" />}
              suffix={<Text>{t("employer.dashboard.stats.interviews.unit") || ""}</Text>}
            />
            <div className="stat-footer">
              <Progress 
                percent={upcomingInterviews.length > 0 ? Math.min(100, upcomingInterviews.length * 20) : 0} 
                size="small" 
                strokeColor="#fa8c16"
                showInfo={false}
              />
            </div>
            <div className="card-action">
              <Button type="link" size="small" onClick={goToInterviews}>
                {t("employer.dashboard.schedule") || "Schedule"}
              </Button>
            </div>
          </Card>
        </Col>
        
        {/* Main Chart Section */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Flex align="center" gap="small">
                <FaChartLine className="card-title-icon" />
                <Text strong>{t("employer.dashboard.charts.applicationsOverview") || "Applications & Views"}</Text>
              </Flex>
            }
            className="dashboard-chart-card main-chart"
            extra={
              <Flex gap="small">
                <Tag color="#4478c0">{t("employer.dashboard.charts.views") || "Views"}</Tag>
                <Tag color="#52c41a">{t("employer.dashboard.charts.applications") || "Applications"}</Tag>
              </Flex>
            }
          >
            {applicationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart
                  data={applicationData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 30,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    tick={{fontSize: 12}} 
                    angle={-30} 
                    textAnchor="end" 
                    height={60}
                    tickFormatter={(tick) => {
                      const date = new Date(tick);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip
                    formatter={(value, name) => [
                      value,
                      name === "views" 
                        ? t("employer.dashboard.charts.views") || "Views"
                        : t("employer.dashboard.charts.applications") || "Applications"
                    ]}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return `${date.toLocaleDateString()}`;
                    }}
                  />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="views" 
                    stroke="#4478c0" 
                    fill="#4478c0" 
                    fillOpacity={0.2}
                    name={t("employer.dashboard.charts.views") || "Views"}
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#52c41a" 
                    fill="#52c41a"
                    fillOpacity={0.2}
                    name={t("employer.dashboard.charts.applications") || "Applications"}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Empty 
                description={t("employer.dashboard.charts.noData") || "No application data available"}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="chart-empty"
              />
            )}
          </Card>
        </Col>
        
        {/* Job Status Chart */}
        <Col xs={24} md={12} lg={8}>
          <Card 
            title={
              <Flex align="center" gap="small">
                <FaBriefcase className="card-title-icon" />
                <Text strong>{t("employer.dashboard.charts.jobStatus") || "Job Status"}</Text>
              </Flex>
            }
            className="dashboard-chart-card"
          >
            {jobStatusData.length > 0 && jobStatusData.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={jobStatusData}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                  >
                    {jobStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend layout="vertical" align="right" verticalAlign="middle" />
                  <RechartsTooltip 
                    formatter={(value, name) => [`${value} ${t('employer.dashboard.charts.jobs') || 'jobs'}`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty 
                description={t("employer.dashboard.charts.noJobsData") || "No jobs data available"}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="chart-empty"
              >
                <Button type="primary" onClick={goToPostJob}>
                  {t("employer.dashboard.postFirstJob") || "Post Your First Job"}
                </Button>
              </Empty>
            )}
          </Card>
        </Col>
        
        {/* Top Skills and Upcoming Interviews */}
        <Col xs={24} md={12} lg={8}>
          <Card 
            title={
              <Flex align="center" gap="small">
                <FaUsers className="card-title-icon" />
                <Text strong>{t("employer.dashboard.topSkills") || "Top Candidate Skills"}</Text>
              </Flex>
            }
            className="dashboard-chart-card skills-card"
          >
            <TopSkills />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={16}>
          <Card 
            title={
              <Flex align="center" gap="small">
                <FaRegClock className="card-title-icon" />
                <Text strong>{t("employer.dashboard.upcomingInterviews") || "Upcoming Interviews"}</Text>
              </Flex>
            }
            className="dashboard-chart-card interviews-list-card"
            extra={
              <Button type="link" onClick={goToInterviews}>
                {t("employer.dashboard.viewAll") || "View All"}
              </Button>
            }
          >
            {upcomingInterviews.length > 0 ? (
              <List
                className="interviews-list"
                dataSource={upcomingInterviews}
                renderItem={item => (
                  <List.Item key={item.id} className="interview-item">
                    <List.Item.Meta
                      avatar={<Avatar className="candidate-avatar">{item.candidate.charAt(0)}</Avatar>}
                      title={<Text strong>{item.position}</Text>}
                      description={<Text type="secondary">{item.candidate}</Text>}
                    />
                    <div className="interview-time">
                      <Tag color="blue" icon={<FaCalendarAlt />}>{item.date}</Tag>
                      <Tag color="purple" icon={<FaRegClock />}>{item.time}</Tag>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty 
                description={t("employer.dashboard.noInterviews") || "No upcoming interviews"}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="interviews-empty"
              />
            )}
          </Card>
        </Col>
        
        {/* Package List */}
        <Col xs={24}>
          <Card className="dashboard-table-card">
            <ListPackage />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashBoard;
