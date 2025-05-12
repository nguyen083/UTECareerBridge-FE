import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Flex,
  Statistic,
  Progress,
  Button,
  Table,
  Tag,
  Empty,
  Spin,
  Tooltip,
  List,
  Space,
  Select,
  DatePicker,
  Modal,
} from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import { useTranslation } from "react-i18next";
import {
  getJobsByStatus,
  getJobPackage,
  getCountStudentApplied,
} from "../../../services/apiService";
import {
  FaCalendarAlt,
  FaBriefcase,
  FaChartLine,
  FaUsers,
  FaRegClock,
} from "react-icons/fa";
import { SlUserFollowing } from "react-icons/sl";
import { ImUserTie } from "react-icons/im";
import { LiaBriefcaseSolid } from "react-icons/lia";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RiseOutlined, ReloadOutlined } from "@ant-design/icons";
import "./DashBoard.scss";
import dayjs from "dayjs";
import {
  useCountInterview,
  useListInterviewEmployer,
} from "../../../composables/interview";
import {
  useRecruimentAverage,
  useRecruimentPerformance,
} from "./../../../composables/job";
import { useEmployerDashboard } from "../../../composables/employer-dashboard";
import { useTopSkill, useTopStudentSkill } from "../../../composables/skill";

const { Text, Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const COLORS = [
  "#4478c0",
  "#52c41a",
  "#fa8c16",
  "#f5222d",
  "#722ed1",
  "#eb2f96",
];

// Top skills component
const TopSkills = () => {
  const { data: skillData } = useTopStudentSkill();
  const [totalSkill, setTotalSkill] = useState(0);
  useEffect(() => {
    setTotalSkill(skillData?.reduce((acc, curr) => acc + curr.value, 0));
  }, [skillData]);

  return (
    <List
      className="top-skills-list"
      itemLayout="horizontal"
      dataSource={skillData}
      renderItem={(item) => (
        <List.Item>
          <Flex
            align="center"
            justify="space-between"
            style={{ width: "100%" }}
          >
            <Text strong>{item.skillName}</Text>
            <div className="skill-progress">
              <Progress
                percent={(item.value / totalSkill) * 100}
                size="small"
                format={(percent) => `${percent}%`}
                strokeColor={{
                  "0%": "#4478c0",
                  "100%": "#1E4F94",
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
  const [selectedPackage, setSelectedPackage] = useState(null);
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
      render: (text) => <span>{text}</span>,
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
              <Tag color="red" className="expiry-tag">
                {t("employer.dashboard.servicePackage.expiringSoon", {
                  days: daysRemaining,
                }) || `${daysRemaining} days left`}
              </Tag>
            ) : daysRemaining <= 0 ? (
              <Tag color="error" className="expiry-tag">
                {t("employer.dashboard.servicePackage.expired") || "Expired"}
              </Tag>
            ) : daysRemaining <= 14 ? (
              <Tag color="orange" className="expiry-tag">
                {daysRemaining}{" "}
                {t("employer.dashboard.servicePackage.daysLeft") || "days left"}
              </Tag>
            ) : (
              <Tag color="success" className="expiry-tag">
                {t("employer.dashboard.servicePackage.active") || "Active"}
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: t("common.actions"),
      key: "action",
      align: "center",
      render: (record) => (
        <Button
          type="link"
          size="small"
          className="view-details-btn"
          onClick={() => setSelectedPackage(record)}
        >
          {t("common.viewDetail")}
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
            price: item.packageResponse.price,
            description: item.packageResponse.description,
            duration: item.packageResponse.duration,
            featureName: item.packageResponse.featureName,
            featureDescription: item.packageResponse.featureDescription,
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

  return (
    <div className="package-list">
      <Flex align="center" justify="space-between" className="package-header">
        <Title level={4}>{t("employer.dashboard.servicePackage.title")}</Title>
        <Button
          type="primary"
          onClick={() => navigate("/employer/buy-service")}
          className="buy-service-btn"
        >
          {t("employer.dashboard.buyMore")}
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
          description={t("employer.dashboard.servicePackage.empty")}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="empty-packages"
        >
          <Button
            type="primary"
            onClick={() => navigate("/employer/buy-service")}
          >
            {t("employer.dashboard.getStarted")}
          </Button>
        </Empty>
      )}
      <Modal
        title={
          <div className="flex items-center gap-2 py-2">
            <span className="text-xl font-semibold text-primary">
              {selectedPackage?.packageName}
            </span>
          </div>
        }
        open={selectedPackage !== null}
        onCancel={() => setSelectedPackage(null)}
        footer={null}
        width={600}
        className="package-detail-modal"
      >
        <div className="p-4">
          {/* Price Section */}
          <div className="p-4 mb-6 rounded-lg bg-blue-50">
            <div className="mb-2 text-2xl font-bold text-primary">
              {selectedPackage?.price?.toLocaleString()} VNĐ
            </div>
            <div className="text-gray-600">
              {t("employer.dashboard.servicePackage.detail.duration")}:{" "}
              {selectedPackage?.duration} {t("common.month")}
            </div>
          </div>

          {/* Main Info */}
          <div className="grid gap-4 mb-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <h4 className="mb-2 font-semibold text-gray-800">
                  {t("employer.dashboard.servicePackage.detail.description")}
                </h4>
                <p className="text-gray-600">{selectedPackage?.description}</p>
              </div>

              <div className="p-4 rounded-lg bg-gray-50">
                <h4 className="mb-2 font-semibold text-gray-800">
                  {t("employer.dashboard.servicePackage.detail.information")}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">
                      {t("employer.dashboard.servicePackage.detail.quantity")}
                    </div>
                    <div className="font-medium">{selectedPackage?.amount}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">
                      {t("employer.dashboard.servicePackage.detail.expiredAt")}
                    </div>
                    <div className="font-medium">
                      {selectedPackage?.expiredAt}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="p-4 rounded-lg bg-gray-50">
              <h4 className="mb-3 font-semibold text-gray-800">
                {t("employer.dashboard.servicePackage.detail.feature")}
              </h4>
              <div className="space-y-2">
                <div className="font-medium text-blue-600">
                  {selectedPackage?.featureName}
                </div>
                <p className="text-gray-600">
                  {selectedPackage?.featureDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <Button
              type="primary"
              size="large"
              onClick={() => setSelectedPackage(null)}
            >
              {t("common.close")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Filter controls component
const FilterControls = ({ time, setTime, onRefresh }) => {
  const { t } = useTranslation();

  return (
    <Space size={12}>
      <RangePicker
        format="DD/MM/YYYY"
        value={time}
        onChange={(dates) => {
          if (dates) {
            setTime(dates);
          }
        }}
      />
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

const DashBoard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [countStudentApplied, setCountStudentApplied] = useState(0);
  const [loading, setLoading] = useState(true);
  const { data: applicationData } = useEmployerDashboard();
  const [jobStatusData, setJobStatusData] = useState([]);
  const { data: upcomingInterviews } = useListInterviewEmployer();
  const [time, setTime] = useState(null);

  const { data: skillDistributionData } = useTopSkill();
  const { data: jobPerformanceData } = useRecruimentPerformance();
  const [chartView, setChartView] = useState("area");

  // Get data from Redux store
  const { countJob, countFollower } = useSelector((state) => state.employer);
  const { data: countInterview } = useCountInterview();
  const { data: hiringData } = useRecruimentAverage();

  // Calculate conversion rate
  const conversionRate =
    countStudentApplied > 0
      ? Math.round((upcomingInterviews.length / countStudentApplied) * 100)
      : 0;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      // Get count of students who applied
      getCountStudentApplied(),
      // Get jobs by status
      getJobsByStatus({ jobStatus: "ACTIVE", page: 0, limit: 10 }),
      getJobsByStatus({ jobStatus: "INACTIVE", page: 0, limit: 10 }),
      getJobsByStatus({ jobStatus: "PENDING", page: 0, limit: 10 }),
      getJobsByStatus({ jobStatus: "REJECTED", page: 0, limit: 10 }),
    ])
      .then(
        ([
          studentsRes,
          activeJobsRes,
          inactiveJobsRes,
          pendingJobsRes,
          rejectedJobsRes,
        ]) => {
          if (studentsRes.status === "OK") {
            setCountStudentApplied(studentsRes.data);
          }

          // Process job status data for charts
          const jobsData = [
            {
              name: "employer.manageJobs.tabs.active",
              value:
                activeJobsRes.status === "OK"
                  ? activeJobsRes.data.totalElements || 0
                  : 0,
              color: "#52c41a",
            },
            {
              name: "employer.manageJobs.tabs.inactive",
              value:
                inactiveJobsRes.status === "OK"
                  ? inactiveJobsRes.data.totalElements || 0
                  : 0,
              color: "#faad14",
            },
            {
              name: "employer.manageJobs.tabs.pending",
              value:
                pendingJobsRes.status === "OK"
                  ? pendingJobsRes.data.totalElements || 0
                  : 0,
              color: "#1890ff",
            },
            {
              name: "employer.manageJobs.tabs.rejected",
              value:
                rejectedJobsRes.status === "OK"
                  ? rejectedJobsRes.data.totalElements || 0
                  : 0,
              color: "#ff4d4f",
            },
          ];

          setJobStatusData(jobsData);
        }
      )
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [time]);

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
      getJobsByStatus({ jobStatus: "REJECTED", page: 0, limit: 100 }),
    ])
      .then(([studentsRes]) => {
        // Update state with fresh data
        if (studentsRes.status === "OK") {
          setCountStudentApplied(studentsRes.data);
        }
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
        <Text className="loading-text">{t("common.loading")}</Text>
      </div>
    );
  }

  return (
    <>
      <BoxContainer className="shadow-md dashboard-header">
        <Flex
          align="center"
          justify="space-between"
          className="dashboard-header-content"
        >
          <div className="welcome-container">
            <Title level={3}>{t("employer.dashboard.welcome")}</Title>
            <Text type="secondary" className="date-display">
              {t("employer.dashboard.today", {
                date: dayjs().format("DD/MM/YYYY"),
              })}
            </Text>
          </div>
          <Flex align="center" gap={16}>
            <FilterControls
              time={time}
              setTime={setTime}
              onRefresh={handleRefresh}
            />
            <div className="dashboard-actions">
              <Button
                type="primary"
                onClick={goToPostJob}
                icon={<FaBriefcase />}
                className="action-button post-job-btn"
              >
                {t("employer.dashboard.postJob")}
              </Button>
              <Button onClick={goToPackages} className="action-button">
                {t("employer.dashboard.buyPackages")}
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
              title={
                <Text strong>
                  {t("employer.dashboard.stats.followers.title")}
                </Text>
              }
              value={countFollower || 0}
              prefix={<SlUserFollowing className="stat-icon" />}
              suffix={
                <Text>{t("employer.dashboard.stats.followers.unit")}</Text>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-stat-card candidates-card">
            <Statistic
              title={
                <Text strong>
                  {t("employer.dashboard.stats.candidates.title")}
                </Text>
              }
              value={countStudentApplied || 0}
              prefix={<ImUserTie className="stat-icon" />}
              suffix={
                <Text>{t("employer.dashboard.stats.candidates.unit")}</Text>
              }
            />
            <div className="card-action">
              <Button type="link" size="small" onClick={goToApplicants}>
                {t("employer.dashboard.viewAll")}
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-stat-card jobs-card">
            <Statistic
              title={
                <Text strong>{t("employer.dashboard.stats.jobs.title")}</Text>
              }
              value={countJob || 0}
              prefix={<LiaBriefcaseSolid className="stat-icon" />}
              suffix={<Text>{t("employer.dashboard.stats.jobs.unit")}</Text>}
            />
            <div className="card-action">
              <Button
                type="link"
                size="small"
                onClick={() => navigate("/employer/manage-list-jobs")}
              >
                {t("employer.dashboard.manageJobs")}
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-stat-card interviews-card">
            <Statistic
              title={
                <Text>{t("employer.dashboard.stats.interviews.title")}</Text>
              }
              value={countInterview || 0}
              prefix={<FaCalendarAlt className="stat-icon" />}
              suffix={
                <Text>{t("employer.dashboard.stats.interviews.unit")}</Text>
              }
            />
            <div className="card-action">
              <Button type="link" size="small" onClick={goToInterviews}>
                {t("employer.dashboard.schedule")}
              </Button>
            </div>
          </Card>
        </Col>

        {/* Conversion Rate Card */}
        <Col xs={24} md={12} lg={8}>
          <Card className="dashboard-chart-card conversion-card">
            <Flex
              align="center"
              justify="space-between"
              className="card-header"
            >
              <Flex align="center" gap="small">
                <RiseOutlined className="card-title-icon" />
                <Text strong>
                  {t("employer.dashboard.stats.applicationRate")}
                </Text>
              </Flex>
            </Flex>
            <div className="conversion-stats">
              <Progress
                type="dashboard"
                percent={conversionRate}
                format={(percent) => `${percent}%`}
                strokeColor={{
                  "0%": "#4478c0",
                  "100%": "#1E4F94",
                }}
              />
              <div className="conversion-detail">
                <Statistic
                  title={
                    <Text>{t("employer.dashboard.stats.applications")}</Text>
                  }
                  value={countStudentApplied || 0}
                  className="conversion-stat"
                />
                <Statistic
                  title={
                    <Text>
                      {t("employer.dashboard.stats.interviews.title")}
                    </Text>
                  }
                  value={countInterview || 0}
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
              <Text strong>{t("employer.dashboard.hiringTime")}</Text>
            </Flex>
            <div className="!h-full hiring-time-content my-12">
              <Statistic
                value={hiringData}
                suffix={t("employer.dashboard.days")}
                precision={1}
                valueStyle={{
                  color: hiringData < 30 ? "#52c41a" : "#ff4d4f",
                }}
              />

              <Flex align="center">
                <Text type="secondary">
                  {t("employer.dashboard.hiringTimeDesc")}
                </Text>
              </Flex>
            </div>
          </Card>
        </Col>

        {/* Job Status Chart */}
        <Col xs={24} md={12} lg={8}>
          <Card
            title={
              <Flex align="center" gap="small">
                <FaBriefcase className="card-title-icon" />
                <Text strong>{t("employer.dashboard.charts.jobStatus")}</Text>
              </Flex>
            }
            className="dashboard-chart-card"
          >
            {jobStatusData.length > 0 &&
            jobStatusData.some((item) => item.value > 0) ? (
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
                    label={({ name, percent }) =>
                      percent > 0
                        ? `${t(name)}: ${(percent * 100).toFixed(0)}%`
                        : ""
                    }
                  >
                    {jobStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value, name) => [
                      `${value} ${t("employer.dashboard.charts.jobs")}`,
                      t(name),
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty
                description={t("employer.dashboard.charts.noJobsData")}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="chart-empty"
              >
                <Button type="primary" onClick={goToPostJob}>
                  {t("employer.dashboard.postFirstJob")}
                </Button>
              </Empty>
            )}
          </Card>
        </Col>

        {/* Main Chart Section */}
        <Col xs={24} lg={24}>
          <Card
            title={
              <Flex align="center" gap="small">
                <FaChartLine className="card-title-icon" />
                <Text strong>
                  {t("employer.dashboard.charts.applicationsOverview")}
                </Text>
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
                  <Option value="area">
                    {t("employer.dashboard.chartTypes.area")}
                  </Option>
                  <Option value="line">
                    {t("employer.dashboard.chartTypes.line")}
                  </Option>
                  <Option value="bar">
                    {t("employer.dashboard.chartTypes.bar")}
                  </Option>
                </Select>
                <Flex gap="small">
                  <Tag color="#4478c0">
                    {t("employer.dashboard.charts.views")}
                  </Tag>
                  <Tag color="#52c41a">
                    {t("employer.dashboard.charts.applications")}
                  </Tag>
                </Flex>
              </Space>
            }
          >
            {applicationData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                {chartView === "area" ? (
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
                      tick={{ fontSize: 12 }}
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
                      formatter={(value, name) => [value, name]}
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
                      name={t("employer.dashboard.charts.views")}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="applications"
                      stroke="#52c41a"
                      fill="#52c41a"
                      fillOpacity={0.2}
                      name={t("employer.dashboard.charts.applications")}
                    />
                  </AreaChart>
                ) : chartView === "line" ? (
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
                      tick={{ fontSize: 12 }}
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
                      formatter={(value, name) => [value, name]}
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
                      name={t("employer.dashboard.charts.views")}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="applications"
                      stroke="#52c41a"
                      name={t("employer.dashboard.charts.applications")}
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
                      tick={{ fontSize: 12 }}
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
                      formatter={(value, name) => [value, name]}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return `${date.toLocaleDateString()}`;
                      }}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="views"
                      fill="#4478c0"
                      name={t("employer.dashboard.charts.views")}
                      barSize={10}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="applications"
                      fill="#52c41a"
                      name={t("employer.dashboard.charts.applications")}
                      barSize={10}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            ) : (
              <Empty
                description={t("employer.dashboard.charts.noData")}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="chart-empty"
              />
            )}
          </Card>
        </Col>

        {/* Skill Distribution Chart */}
        <Col xs={24} md={12} lg={8}>
          <Card
            title={
              <Flex align="center" gap="small">
                <FaUsers className="card-title-icon" />
                <Text strong>{t("employer.dashboard.skillDistribution")}</Text>
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
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis type="number" />
                <YAxis
                  dataKey="skillName"
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
                <Text strong>{t("employer.dashboard.jobPerformance")}</Text>
              </Flex>
            }
            className="dashboard-chart-card job-performance-card"
          >
            <Table
              dataSource={jobPerformanceData}
              pagination={false}
              className="job-performance-table max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-webkit"
              columns={[
                {
                  title: t("employer.dashboard.jobTitle"),
                  dataIndex: "title",
                  key: "title",
                  ellipsis: true,
                  render: (text) => <Text strong>{text}</Text>,
                },
                {
                  title: t("employer.dashboard.metrics.views"),
                  dataIndex: "views",
                  key: "views",
                  align: "right",
                  sorter: (a, b) => a.views - b.views,
                },
                {
                  title: t("employer.dashboard.metrics.applications"),
                  dataIndex: "applications",
                  key: "applications",
                  align: "right",
                  sorter: (a, b) => a.applications - b.applications,
                },
                {
                  title: t("employer.dashboard.conversionRate"),
                  dataIndex: "conversionRate",
                  key: "conversionRate",
                  align: "right",
                  render: (_, record) => {
                    const conversionRate =
                      (record.applications / record.views) * 100 || 0;
                    return (
                      <Text type={conversionRate > 10 ? "success" : "danger"}>
                        {conversionRate.toFixed(2)}%
                      </Text>
                    );
                  },
                  sorter: (a, b) =>
                    a.applications / a.views - b.applications / b.views,
                },
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
                <Text strong>{t("employer.dashboard.topSkills")}</Text>
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
                <Text strong>{t("employer.dashboard.upcomingInterviews")}</Text>
              </Flex>
            }
            className="dashboard-chart-card interviews-list-card"
            extra={
              <Button type="link" onClick={goToInterviews}>
                {t("employer.dashboard.viewAll")}
              </Button>
            }
          >
            {upcomingInterviews?.content?.length > 0 ? (
              <List
                className="interviews-list"
                dataSource={upcomingInterviews?.content}
                renderItem={(item) => (
                  <List.Item key={item.id} className="interview-item">
                    <List.Item.Meta
                      title={<Text strong>{item.studentName}</Text>}
                    />
                    <div className="flex items-center gap-2 interview-time">
                      <Tag color="blue" className="flex items-center gap-2">
                        <FaCalendarAlt />
                        {dayjs(item.scheduleDate, "DD-MM-YYYY HH:mm").format(
                          "DD/MM/YYYY"
                        )}
                      </Tag>
                      <Tag color="purple" className="flex items-center gap-2">
                        <FaRegClock />
                        {dayjs(item.scheduleDate, "DD-MM-YYYY HH:mm").format(
                          "HH:mm"
                        )}{" "}
                        -
                        {dayjs(item.scheduleDate, "DD-MM-YYYY HH:mm")
                          .add(item.duration, "minutes")
                          .format("HH:mm")}
                      </Tag>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description={t("employer.dashboard.noInterviews")}
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
