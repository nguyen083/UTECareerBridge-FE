import React, { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Flex, Statistic, Progress, Button, Table, Tag, Empty, Spin, Tooltip, Divider, List, Avatar, Space, Select, DatePicker } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import { useTranslation } from "react-i18next";
import { getInfor, getJobsByStatus, getJobPackage, getCountStudentApplied } from "../../../services/apiService";
import { FaCalendarAlt, FaBriefcase, FaChartLine, FaUsers, FaBell, FaRegClock, FaFilter } from "react-icons/fa";
import { SlUserFollowing } from "react-icons/sl";
import { ImUserTie } from "react-icons/im";
import { LiaBriefcaseSolid } from "react-icons/lia";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UpOutlined, DownOutlined, RiseOutlined, ReloadOutlined, CalendarOutlined } from '@ant-design/icons';
import "./DashBoard.scss";

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

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

// Generate sample conversion and performance data
const generateJobPerformanceData = () => {
  return [
    { id: 1, title: 'Senior Frontend Developer', views: 145, applications: 28, interviews: 12, conversionRate: 19.3 },
    { id: 2, title: 'Full Stack Developer', views: 210, applications: 35, interviews: 15, conversionRate: 16.7 },
    { id: 3, title: 'UX Designer', views: 120, applications: 18, interviews: 8, conversionRate: 15.0 },
    { id: 4, title: 'DevOps Engineer', views: 90, applications: 12, interviews: 5, conversionRate: 13.3 },
    { id: 5, title: 'Product Manager', views: 180, applications: 22, interviews: 9, conversionRate: 12.2 },
  ];
};

// Generated hiring time data
const generateHiringData = () => {
  return { avgDays: 23.5, last3MonthsAvg: 25.2 };
};

// Filter controls component
const FilterControls = ({ timePeriod, setTimePeriod, onRefresh }) => {
  const { t } = useTranslation();
  
  return (
    <Space size={12}>
      <Select
        placeholder={t("employer.dashboard.filters.selectPeriod") || "Select Period"}
        style={{ width: 120 }}
        value={timePeriod}
        onChange={(value) => setTimePeriod(value)}
      >
        <Option value="week">{t("employer.dashboard.filters.week") || "Week"}</Option>
        <Option value="month">{t("employer.dashboard.filters.month") || "Month"}</Option>
        <Option value="quarter">{t("employer.dashboard.filters.quarter") || "Quarter"}</Option>
        <Option value="year">{t("employer.dashboard.filters.year") || "Year"}</Option>
        <Option value="all">{t("employer.dashboard.filters.allTime") || "All Time"}</Option>
      </Select>
      
      <Button 
        icon={<ReloadOutlined />} 
        onClick={onRefresh}
        tooltip={t("employer.dashboard.refresh") || "Refresh Data"}
      >
        {t("employer.dashboard.refresh") || "Refresh"}
      </Button>
    </Space>
  );
};

// Generate skill distribution data
const generateSkillDistributionData = () => {
  return [
    { name: 'JavaScript', value: 45 },
    { name: 'React', value: 38 },
    { name: 'Node.js', value: 32 },
    { name: 'TypeScript', value: 28 },
    { name: 'SQL', value: 25 },
    { name: 'Python', value: 22 },
    { name: 'Java', value: 18 },
    { name: 'AWS', value: 15 }
  ];
};

const DashBoard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [countStudentApplied, setCountStudentApplied] = useState(0);
  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState(generateSampleData());
  const [jobStatusData, setJobStatusData] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState(generateInterviews());
  const [timePeriod, setTimePeriod] = useState("month");
  const [jobPerformanceData, setJobPerformanceData] = useState(generateJobPerformanceData());
  const [hiringData, setHiringData] = useState(generateHiringData());
  const [skillDistributionData, setSkillDistributionData] = useState(generateSkillDistributionData());
  const [chartView, setChartView] = useState('area');
  
  // Get data from Redux store
  const { countJob, countFollower } = useSelector((state) => state.employer);
  
  const applicationRate = countJob > 0 
    ? Math.round((countStudentApplied / countJob) * 100) 
    : 0;
    
  // Calculate conversion rate
  const conversionRate = countStudentApplied > 0 
    ? Math.round((upcomingInterviews.length / countStudentApplied) * 100) 
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
  }, [t, timePeriod]);

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
  
  const handleRefresh = () => {
    setLoading(true);
    // Refresh all data sources
    Promise.all([
      getCountStudentApplied(),
      getJobsByStatus({ jobStatus: "ACTIVE", page: 0, limit: 100 }),
      getJobsByStatus({ jobStatus: "INACTIVE", page: 0, limit: 100 }),
      getJobsByStatus({ jobStatus: "PENDING", page: 0, limit: 100 }),
      getJobsByStatus({ jobStatus: "REJECTED", page: 0, limit: 100 })
    ])
    .then(([studentsRes, activeJobsRes, inactiveJobsRes, pendingJobsRes, rejectedJobsRes]) => {
      // Update state with fresh data
      if (studentsRes.status === "OK") {
        setCountStudentApplied(studentsRes.data);
      }
      
      // Update job status data
      // Similar to the code in useEffect
      // ...
    })
    .catch((error) => {
      console.error("Error refreshing dashboard data:", error);
    })
    .finally(() => {
      setLoading(false);
    });
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
        <Flex align="center" justify="space-between" className="dashboard-header-content">
          <div className="welcome-container">
            <Title level={3}>{t("employer.dashboard.welcome") || "Welcome to your Dashboard"}</Title>
            <Text type="secondary" className="date-display">
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          </div>
          <Flex align="center" gap={16}>
            <FilterControls 
              timePeriod={timePeriod} 
              setTimePeriod={setTimePeriod} 
              onRefresh={handleRefresh}
            />
            <div className="dashboard-actions">
              <Button type="primary" onClick={goToPostJob} icon={<FaBriefcase />} className="action-button post-job-btn">
                {t("employer.dashboard.postJob") || "Post a New Job"}
              </Button>
              <Button onClick={goToPackages} className="action-button">
                {t("employer.dashboard.buyPackages") || "Buy Packages"}
              </Button>
            </div>
          </Flex>
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
              title={<Text>{t("employer.dashboard.stats.interviews.title") || "Interviews"}</Text>}
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
        
        {/* Conversion Rate Card */}
        <Col xs={24} md={12} lg={8}>
          <Card className="dashboard-chart-card conversion-card">
            <Flex align="center" justify="space-between" className="card-header">
              <Flex align="center" gap="small">
                <RiseOutlined className="card-title-icon" />
                <Text strong>{t("employer.dashboard.stats.conversionRate") || "Applicant Conversion"}</Text>
              </Flex>
            </Flex>
            <div className="conversion-stats">
              <Progress
                type="dashboard"
                percent={conversionRate}
                format={(percent) => `${percent}%`}
                strokeColor={{
                  '0%': '#4478c0',
                  '100%': '#1E4F94',
                }}
              />
              <div className="conversion-detail">
                <Statistic
                  title={<Text>{t("employer.dashboard.stats.applications") || "Applications"}</Text>}
                  value={countStudentApplied}
                  className="conversion-stat"
                />
                <Statistic
                  title={<Text>{t("employer.dashboard.stats.interviews.title") || "Interviews"}</Text>}
                  value={upcomingInterviews.length}
                  className="conversion-stat"
                />
              </div>
            </div>
          </Card>
        </Col>
        
        {/* Average Hiring Time Card */}
        <Col xs={24} md={12} lg={8}>
          <Card className="dashboard-chart-card hiring-time-card">
            <Flex align="center" gap="small" className="card-header">
              <FaRegClock className="card-title-icon" />
              <Text strong>{t("employer.dashboard.hiringTime") || "Average Hiring Time"}</Text>
            </Flex>
            <div className="hiring-time-content">
              <Statistic
                value={hiringData.avgDays}
                suffix={t("employer.dashboard.days") || "days"}
                precision={1}
                valueStyle={{ color: hiringData.avgDays < 30 ? "#52c41a" : "#ff4d4f" }}
              />
              <Progress
                percent={(30 - Math.min(hiringData.avgDays, 30)) / 30 * 100}
                steps={15}
                strokeColor={hiringData.avgDays < 15 ? "#52c41a" : hiringData.avgDays < 30 ? "#faad14" : "#ff4d4f"}
                size="small"
              />
              <Flex align="center" justify="space-between" className="hiring-comparison">
                <Text type="secondary">{t("employer.dashboard.hiringTimeDesc") || "Average time from job posting to successful hire"}</Text>
                <Tag color={hiringData.avgDays < hiringData.last3MonthsAvg ? "success" : "warning"}>
                  {hiringData.avgDays < hiringData.last3MonthsAvg ? 
                    <Flex align="center" gap={4}>
                      <DownOutlined />
                      <span>{(hiringData.last3MonthsAvg - hiringData.avgDays).toFixed(1)} {t("employer.dashboard.days") || "days"}</span>
                    </Flex>
                    :
                    <Flex align="center" gap={4}>
                      <UpOutlined />
                      <span>{(hiringData.avgDays - hiringData.last3MonthsAvg).toFixed(1)} {t("employer.dashboard.days") || "days"}</span>
                    </Flex>
                  }
                </Tag>
              </Flex>
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
              <Space>
                <Select 
                  value={chartView} 
                  onChange={setChartView}
                  dropdownMatchSelectWidth={false}
                >
                  <Option value="area">{t("employer.dashboard.chartTypes.area") || "Area"}</Option>
                  <Option value="line">{t("employer.dashboard.chartTypes.line") || "Line"}</Option>
                  <Option value="bar">{t("employer.dashboard.chartTypes.bar") || "Bar"}</Option>
                </Select>
                <Flex gap="small">
                  <Tag color="#4478c0">{t("employer.dashboard.charts.views") || "Views"}</Tag>
                  <Tag color="#52c41a">{t("employer.dashboard.charts.applications") || "Applications"}</Tag>
                </Flex>
              </Space>
            }
          >
            {applicationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                {chartView === 'area' ? (
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
                ) : chartView === 'line' ? (
                  <LineChart
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
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="views" 
                      stroke="#4478c0" 
                      name={t("employer.dashboard.charts.views") || "Views"}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="applications" 
                      stroke="#52c41a" 
                      name={t("employer.dashboard.charts.applications") || "Applications"}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart
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
                    <Bar 
                      yAxisId="left"
                      dataKey="views" 
                      fill="#4478c0" 
                      name={t("employer.dashboard.charts.views") || "Views"}
                      barSize={10}
                    />
                    <Bar 
                      yAxisId="right"
                      dataKey="applications" 
                      fill="#52c41a" 
                      name={t("employer.dashboard.charts.applications") || "Applications"}
                      barSize={10}
                    />
                  </BarChart>
                )}
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
        
        {/* Skill Distribution Chart */}
        <Col xs={24} md={12} lg={8}>
          <Card 
            title={
              <Flex align="center" gap="small">
                <FaUsers className="card-title-icon" />
                <Text strong>{t("employer.dashboard.skillDistribution") || "Candidate Skill Distribution"}</Text>
              </Flex>
            }
            className="dashboard-chart-card skills-distribution-card"
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={skillDistributionData}
                layout="vertical"
                margin={{
                  top: 20,
                  right: 30,
                  left: 80,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tickLine={false} 
                  axisLine={false}
                  width={80}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#4478c0" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        
        {/* Job Performance Table */}
        <Col xs={24} md={12} lg={16}>
          <Card 
            title={
              <Flex align="center" gap="small">
                <RiseOutlined className="card-title-icon" />
                <Text strong>{t("employer.dashboard.jobPerformance") || "Job Post Performance"}</Text>
              </Flex>
            }
            className="dashboard-chart-card job-performance-card"
            extra={
              <Select defaultValue="applications" style={{ width: 120 }}>
                <Option value="views">{t("employer.dashboard.sortBy.views") || "Sort by Views"}</Option>
                <Option value="applications">{t("employer.dashboard.sortBy.applications") || "Sort by Applications"}</Option>
                <Option value="conversionRate">{t("employer.dashboard.sortBy.conversionRate") || "Sort by Conversion"}</Option>
              </Select>
            }
          >
            <Table 
              dataSource={jobPerformanceData}
              pagination={false}
              className="job-performance-table"
              columns={[
                {
                  title: t("employer.dashboard.jobTitle") || "Job Title",
                  dataIndex: "title",
                  key: "title",
                  ellipsis: true,
                  render: text => <Text strong>{text}</Text>
                },
                {
                  title: t("employer.dashboard.metrics.views") || "Views",
                  dataIndex: "views",
                  key: "views",
                  align: "right",
                  sorter: (a, b) => a.views - b.views,
                },
                {
                  title: t("employer.dashboard.metrics.applications") || "Applications",
                  dataIndex: "applications",
                  key: "applications",
                  align: "right",
                  sorter: (a, b) => a.applications - b.applications,
                },
                {
                  title: t("employer.dashboard.conversionRate") || "Conversion",
                  dataIndex: "conversionRate",
                  key: "conversionRate",
                  align: "right",
                  render: (text) => <Text type={text > 10 ? "success" : "danger"}>{text}%</Text>,
                  sorter: (a, b) => a.conversionRate - b.conversionRate,
                }
              ]}
            />
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
