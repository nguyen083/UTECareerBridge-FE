import {
  Row,
  Col,
  Card,
  Typography,
  Statistic,
  Button,
  List,
  Divider,
  Avatar,
  Skeleton,
  Tabs,
  Empty,
} from "antd";
import {
  CalendarOutlined,
  FileOutlined,
  UserOutlined,
  BulbOutlined,
  BookOutlined,
  SolutionOutlined,
  TeamOutlined,
  PieChartOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Dashboard.scss";
import dayjs from "dayjs";
import {
  useActivity,
  useEventStatistics,
  useJobSaved,
  useJobStatistics,
  useRecommendedJobs,
} from "../../../composables/student-dashboard";

const { Title, Text, Paragraph } = Typography;

const StudentDashboard = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const student = useSelector((state) => state.student);
  const { data: jobStatistics, isLoading: jobStatisticsLoading } =
    useJobStatistics();
  const { data: eventStatistics, isLoading: eventStatisticsLoading } =
    useEventStatistics();
  const { data: activity, isLoading: activityLoading } = useActivity();
  const { data: jobSaved, isLoading: jobSavedLoading } = useJobSaved();
  const { data: recommendedJobs, isLoading: recommendedJobsLoading } =
    useRecommendedJobs(user.userId);

  // Convert date from YYYY-MM-DD to DD-MM-YYYY format
  const convertDate = (dateString) => {
    if (!dateString) return "";
    return dayjs(dateString, "YYYY-MM-DD").format("DD/MM/YYYY");
  };

  // Helper function to get icon by activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case "application":
        return <FileOutlined style={{ color: "#1890ff" }} />;
      case "interview":
        return <CalendarOutlined style={{ color: "#FAF3DD" }} />;
      case "resume":
        return <SolutionOutlined style={{ color: "#073B4C" }} />;
      case "saved":
        return <BookOutlined style={{ color: "#FFD166" }} />;
      case "viewed":
        return <UserOutlined style={{ color: "#FFFFFF" }} />;
      default:
        return <FileOutlined />;
    }
  };

  // Prepare data for charts
  const prepareBarChartData = () => {
    // Group activities by date
    const groupedByDate = {};
    activity?.data?.forEach((activity) => {
      if (!groupedByDate[activity.date]) {
        groupedByDate[activity.date] = { date: convertDate(activity.date) };
      }

      if (!groupedByDate[activity.date][activity.type]) {
        groupedByDate[activity.date][activity.type] = 0;
      }

      groupedByDate[activity.date][activity.type] += 1;
    });

    // Convert to array for Recharts
    return Object.values(groupedByDate).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  };

  const preparePieChartData = () => {
    // Count activities by type
    const countByType = {};
    activity?.data?.forEach((activity) => {
      if (!countByType[activity.type]) {
        countByType[activity.type] = 0;
      }
      countByType[activity.type] += 1;
    });

    // Convert to array for Recharts
    return Object.entries(countByType).map(([type, count]) => ({
      type,
      value: count,
    }));
  };

  // Color mapping for activities with nicer color palette
  const ACTIVITY_COLORS = {
    applied: "#1677ff", // Primary blue
    interview: "#9B2226", // Đỏ đậm
    resume: "#FFD166", // Vàng
    saved: "#1e4f94", // Xanh đậm (text-color)
    viewed: "#2EC4B6", // Xanh lá
  };

  // Enhanced gradient colors for charts
  const GRADIENT_COLORS = {
    applied: ["#4d9fff", "#1677ff"], // footer → primary
    interview: ["#ff6a00", "#9B2226"], // cam đậm → đỏ đậm
    resume: ["#FFD166", "#F4A261"], // vàng → cam nhạt
    saved: ["#5fd1f9", "#1e4f94"], // xanh nhạt → xanh đậm
    viewed: ["#2EC4B6", "#073B4C"], // xanh lá → xanh đậm
  };

  // Activity type mapping for UI
  const ACTIVITY_TYPES = {
    applied: "student.dashboard.applied",
    interview: "student.dashboard.interview",
    resume: "student.dashboard.resume",
    saved: "student.dashboard.saved",
    viewed: "student.dashboard.viewed",
  };

  // Tab icons and better labels
  const activityTabItems = [
    {
      key: "list",
      label: (
        <span>
          <UnorderedListOutlined /> {t("student.dashboard.list")}
        </span>
      ),
      children: (
        <List
          className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-webkit"
          dataSource={activity?.data}
          locale={{
            emptyText: (
              <Empty description={t("student.dashboard.noActivities")} />
            ),
          }}
          renderItem={(item) => (
            <List.Item className="activity-list-item">
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={getActivityIcon(item.type)}
                    style={{
                      background: ACTIVITY_COLORS[item.type] || "#1890ff",
                    }}
                  />
                }
                title={
                  <span className="activity-title">{item.description}</span>
                }
                description={
                  <span className="activity-date">
                    {convertDate(item.date)}
                  </span>
                }
              />
            </List.Item>
          )}
        />
      ),
    },
    {
      key: "barChart",
      label: (
        <span>
          <BarChartOutlined /> {t("student.dashboard.barChart")}
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
                {Object.entries(GRADIENT_COLORS).map(
                  ([type, [color1, color2]]) => (
                    <linearGradient
                      key={type}
                      id={`color${type}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={color1} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={color2} stopOpacity={0.8} />
                    </linearGradient>
                  )
                )}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="date" tick={{ fill: "#666" }} />
              <YAxis tick={{ fill: "#666" }} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                itemStyle={{ padding: "4px 0" }}
                labelStyle={{ fontWeight: "bold" }}
              />
              <Legend
                formatter={(value) => t(ACTIVITY_TYPES[value]) || value}
                iconType="circle"
                wrapperStyle={{ paddingTop: "10px" }}
              />
              <Bar
                dataKey="applied"
                name="applied"
                stackId="a"
                fill="url(#colorapplied)"
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
      ),
    },
    {
      key: "pieChart",
      label: (
        <span>
          <PieChartOutlined /> {t("student.dashboard.pieChart")}
        </span>
      ),
      children: (
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {Object.entries(GRADIENT_COLORS).map(
                  ([type, [color1, color2]]) => (
                    <linearGradient
                      key={type}
                      id={`pieColor${type}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={color1} stopOpacity={1} />
                      <stop offset="95%" stopColor={color2} stopOpacity={1} />
                    </linearGradient>
                  )
                )}
              </defs>
              <Pie
                data={preparePieChartData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percent }) =>
                  `${t(ACTIVITY_TYPES[type])}: ${(percent * 100).toFixed(0)}%`
                }
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
                formatter={(value) => [`${value} hoạt động`]}
                labelFormatter={() => ""}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              />{" "}
            </PieChart>
          </ResponsiveContainer>
        </div>
      ),
    },
    {
      key: "radarChart",
      label: (
        <span>
          <SolutionOutlined /> {t("student.dashboard.radarChart")}
        </span>
      ),
      children: (
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              outerRadius={90}
              width={730}
              height={250}
              data={preparePieChartData()}
            >
              <PolarGrid stroke="#e5e5e5" />
              <PolarAngleAxis
                dataKey="type"
                tick={{ fill: "#666" }}
                tickFormatter={(value) => t(ACTIVITY_TYPES[value]) || value}
              />
              <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
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
                  t(ACTIVITY_TYPES[props.payload.type]) || props.payload.type,
                ]}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      ),
    },
  ];

  return (
    <div className="student-dashboard">
      <Row gutter={[16, 16]} className="dashboard-header">
        <Col span={24}>
          <Card bordered={false} className="welcome-card">
            <div className="welcome-content">
              <div>
                <Title level={3} className="!text-text-color">
                  {t("student.dashboard.welcome", {
                    name: student?.firstName || "Student",
                  })}
                </Title>
                <Text className="subtitle !text-text-color-hover">
                  {t("student.dashboard.subtitle")}
                </Text>
              </div>
              <div className="profile-completion-wrapper">
                <div className="profile-actions">
                  <Button type="primary">
                    <Link to="/profile">
                      {t("student.dashboard.viewResume")}
                    </Link>
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
            <Skeleton
              active
              paragraph={{ rows: 2 }}
              loading={jobStatisticsLoading}
            >
              <Statistic
                title={t("student.dashboard.jobsApplied")}
                value={jobStatistics?.data?.totalApplications}
                className="main-statistic"
              />
              <div className="sub-stats">
                <div className="sub-stat">
                  <Text>{t("student.dashboard.pending")}</Text>
                  <Text strong>{jobStatistics?.data?.pendingApplications}</Text>
                </div>
                <div className="sub-stat">
                  <Text>{t("student.dashboard.accepted")}</Text>
                  <Text strong>
                    {jobStatistics?.data?.approvedApplications}
                  </Text>
                </div>
                <div className="sub-stat">
                  <Text>{t("student.dashboard.rejected")}</Text>
                  <Text strong>
                    {jobStatistics?.data?.rejectedApplications}
                  </Text>
                </div>
              </div>
              <Button type="link" className="view-all-link">
                <Link to="/my-job">
                  {t("student.dashboard.viewAllApplications")}
                </Link>
              </Button>
            </Skeleton>
          </Card>
        </Col>

        {/* Saved Jobs */}
        <Col xs={24} md={12} lg={6}>
          <Card className="stats-card job-saved-card">
            <Skeleton active paragraph={{ rows: 2 }} loading={jobSavedLoading}>
              <Statistic
                title={t("student.dashboard.savedJobs")}
                value={jobSaved?.data?.totalElements}
                className="main-statistic"
              />
              <div className="sub-stats job-list">
                {jobSaved?.data?.content?.length > 0 ? (
                  jobSaved?.data?.content?.slice(0, 2).map((job) => (
                    <div key={job?.jobId} className="job-item">
                      <div className="job-title">{job?.jobTitle}</div>
                      <div className="job-company">
                        {job?.employerResponse?.companyName}
                      </div>
                    </div>
                  ))
                ) : (
                  <Empty description={t("student.dashboard.noSavedJobs")} />
                )}
              </div>
              <Button type="link" className="view-all-link">
                <Link to="/my-job#job-saved">
                  {t("student.dashboard.viewSavedJobs")}
                </Link>
              </Button>
            </Skeleton>
          </Card>
        </Col>

        {/* Recommended Jobs */}
        <Col xs={24} md={12} lg={6}>
          <Card className="stats-card">
            <Skeleton
              active
              paragraph={{ rows: 2 }}
              loading={recommendedJobsLoading}
            >
              <Title className="!text-lg !font-semibold !text-[#666]">
                {t("student.dashboard.recommendedJobs")}
              </Title>
              <div className="mb-4 job-recommendations">
                {recommendedJobs?.data.length === 0 ? (
                  <Empty
                    description={t("student.dashboard.noRecommendedJobs")}
                  />
                ) : (
                  recommendedJobs?.data?.slice(0, 2).map((job) => (
                    <Link
                      to={`/jobs/${job.id}`}
                      key={job.id}
                      className="recommended-job"
                    >
                      <Avatar src={job.companyLogo} size="small" />
                      <div className="job-details">
                        <div className="job-title">{job.title}</div>
                        <div className="job-company">{job.company}</div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
              <Button type="link" className="view-all-link">
                <Link to="/recommended-jobs">
                  {t("student.dashboard.viewRecommendedJobs")}
                </Link>
              </Button>
            </Skeleton>
          </Card>
        </Col>

        {/* Upcoming Events */}
        <Col xs={24} md={12} lg={6}>
          <Card className="stats-card">
            <Skeleton
              active
              paragraph={{ rows: 2 }}
              loading={eventStatisticsLoading}
            >
              <Title level={5}>{t("student.dashboard.upcomingEvents")}</Title>
              <div className="mb-4 upcoming-events">
                {eventStatistics?.data?.eventResponses
                  ?.slice(0, 2)
                  .map((event) => (
                    <Link
                      to={`/event-detail/${event.eventId}`}
                      key={event.eventId}
                      className="event-item"
                    >
                      <img
                        src={event.eventImage}
                        alt={event.eventTitle}
                        className="event-image"
                      />
                      <div className="event-details">
                        <div className="event-title">{event.eventTitle}</div>
                        <div className="event-meta">
                          <CalendarOutlined /> {event.eventDate} •{" "}
                          {event.eventLocation}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
              <Button type="link" className="view-all-link">
                <Link to="/event">
                  {t("student.dashboard.viewUpcomingEvents")}
                </Link>
              </Button>
            </Skeleton>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="dashboard-content">
        <Col xs={24} lg={16}>
          <Card
            title={t("student.dashboard.recentActivities")}
            className="activities-card"
          >
            <Skeleton active paragraph={{ rows: 5 }} loading={activityLoading}>
              <Tabs items={activityTabItems} />
            </Skeleton>
          </Card>
        </Col>

        {/* Career Tips */}
        <Col xs={24} lg={8}>
          <Card title={t("student.dashboard.careerTips")} className="tips-card">
            <div className="career-tip">
              <div className="tip-header">
                <BulbOutlined className="tip-icon" />
                <Title level={5}>{t("student.dashboard.resumeBuilding")}</Title>
              </div>
              <Paragraph>{t("student.dashboard.resumeTip")}</Paragraph>
            </div>

            <Divider />

            <div className="career-tip">
              <div className="tip-header">
                <TeamOutlined className="tip-icon" />
                <Title level={5}>{t("student.dashboard.interviewPrep")}</Title>
              </div>
              <Paragraph>{t("student.dashboard.interviewTip")}</Paragraph>
            </div>

            <Divider />

            <div className="career-tip">
              <div className="tip-header">
                <SolutionOutlined className="tip-icon" />
                <Title level={5}>
                  {t("student.dashboard.networkingSkills")}
                </Title>
              </div>
              <Paragraph>{t("student.dashboard.networkingTip")}</Paragraph>
            </div>

            <Button type="link" className="learn-more-link">
              {t("student.dashboard.learnMore")}
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentDashboard;
