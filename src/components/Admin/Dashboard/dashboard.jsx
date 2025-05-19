import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Select,
  Space,
  Typography,
  DatePicker,
  Button,
  Segmented,
  Skeleton,
  Badge,
  Progress,
  Divider,
  Tabs,
  Table,
  Flex,
  Tag,
  Alert,
} from "antd";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  UserOutlined,
  DollarOutlined,
  ReloadOutlined,
  FilterOutlined,
  SafetyCertificateOutlined,
  LineChartOutlined,
  BarChartOutlined,
  FireOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { IoIosBusiness } from "react-icons/io";
import { BsFilePost } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import {
  getRevenueByMonth,
  getStatisticUser,
} from "../../../services/apiService";
import "./Dashboard.scss";
import { useNavigate } from "react-router-dom";
import {
  useApplicationStats,
  useForumStats,
  useJobStatistics,
  useRecentOrders,
  useStatisticsByCategory,
  useStatsTopSkills,
  useTopEmployer,
  useUserStats,
} from "../../../composables/admin-dashboard";

const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: jobCategoryStats } = useStatisticsByCategory();
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);
  const [statisticUser, setStatisticUser] = useState({
    totalCandidates: 0,
    totalEmployers: 0,
  });
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const { data: recentOrders } = useRecentOrders();
  const { data: topEmployers } = useTopEmployer();
  const [loading, setLoading] = useState({
    revenue: true,
  });
  const [chartView, setChartView] = useState("revenue");

  const { data: jobApprovalStats } = useJobStatistics();
  const { data: userGrowthData } = useUserStats();
  const { data: skillDemandData } = useStatsTopSkills();
  const { data: studentApplicationData } = useApplicationStats();
  const { data: forumActivityData } = useForumStats();

  const COLORS = [
    "#722ed1",
    "#2f54eb",
    "#1890ff",
    "#13c2c2",
    "#52c41a",
    "#faad14",
    "#fadb14",
    "#fa541c",
    "#f5222d",
    "#eb2f96",
  ];

  const [filters, setFilters] = useState({
    month: null,
    year: new Date().getFullYear(),
    dateRange: null,
  });

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const fetchRevenueByMonth = async () => {
    try {
      setLoading((prev) => ({ ...prev, revenue: true }));
      const params = {};
      if (filters.year) params.year = filters.year;
      const response = await getRevenueByMonth(params);
      const transformedData = response.data.map((item) => ({
        month: item.month,
        revenue: item.revenue,
        subscriptions: item.numberOfPackages,
      }));

      // Calculate current month revenue and previous month for growth indicator
      const currentMonthNum = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      if (!filters.year || filters.year === currentYear) {
        const currentMonthData = transformedData.find(
          (item) => item.month === currentMonthNum
        );
        setCurrentMonthRevenue(currentMonthData?.revenue || 0);
      }

      setRevenueByMonth(transformedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, revenue: false }));
    }
  };

  useEffect(() => {
    fetchRevenueByMonth();
  }, [filters.year]);

  const fetchStatisticUser = async () => {
    try {
      setLoading((prev) => ({ ...prev, users: true }));
      const response = await getStatisticUser();
      setStatisticUser(...response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  useEffect(() => {
    fetchStatisticUser();
  }, []);

  const handleRefresh = () => {
    fetchRevenueByMonth();
    fetchStatisticUser();
  };

  // Sample recent activities

  const renderStatsCard = (
    title,
    value,
    icon,
    color,
    secondaryValue = null,
    secondaryLabel = null
  ) => (
    <Card className="admin-stats-card">
      <div className="flex items-center justify-between mb-2">
        <div>
          <Text type="secondary" className="stat-label">
            {title}
          </Text>
          <div className="stat-value" style={{ color }}>
            {value}
          </div>
          {secondaryValue && (
            <div className="flex items-center mt-1">
              <Text
                type="secondary"
                style={{ fontSize: "12px", marginRight: "4px" }}
              >
                {secondaryLabel}:
              </Text>
              <Text strong style={{ fontSize: "13px" }}>
                {secondaryValue}
              </Text>
            </div>
          )}
        </div>
        <div
          className="stat-icon"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );

  const FilterControls = () => (
    <Space wrap size={12}>
      <Select
        placeholder={t("admin.dashboard.filters.selectMonth")}
        style={{ width: 150 }}
        value={filters.month}
        onChange={(value) => setFilters((prev) => ({ ...prev, month: value }))}
        allowClear
        suffixIcon={<FilterOutlined />}
      >
        {months.map((month) => (
          <Option key={month} value={month}>
            {t("admin.dashboard.filters.month", { month })}
          </Option>
        ))}
      </Select>

      <Select
        placeholder={t("admin.dashboard.filters.selectYear")}
        style={{ width: 120 }}
        value={filters.year}
        onChange={(value) => setFilters((prev) => ({ ...prev, year: value }))}
        suffixIcon={<FilterOutlined />}
      >
        {years.map((year) => (
          <Option key={year} value={year}>
            {year}
          </Option>
        ))}
      </Select>

      <Button icon={<ReloadOutlined />} onClick={handleRefresh} type="default">
        {t("admin.dashboard.refresh")}
      </Button>
    </Space>
  );

  const orderColumns = [
    {
      title: t("admin.dashboard.tables.columns.company") || "Company",
      dataIndex: "companyName",
      key: "companyName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("admin.dashboard.tables.columns.package") || "Package",
      dataIndex: "packageName",
      key: "packageName",
    },
    {
      title: t("admin.dashboard.tables.columns.amount") || "Amount",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(price),
      align: "right",
    },
    {
      title: t("admin.dashboard.tables.columns.date") || "Date",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
      render: (purchaseDate) => {
        const date = new Date(purchaseDate);
        return date.toLocaleDateString("vi-VN");
      },
    },
    {
      title: t("admin.dashboard.tables.columns.status") || "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (paymentStatus) => {
        console.log("paymentStatus: ", t(paymentStatus));
        if (paymentStatus === "PAID") {
          return <Badge text={t(`${paymentStatus}`)} color="green" />;
        } else {
          return <Badge text={t(`${paymentStatus}`)} color="gray" />;
        }
      },
    },
  ];

  const employerColumns = [
    {
      title: t("admin.dashboard.tables.columns.company") || "Company",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("admin.dashboard.tables.columns.jobsPosted") || "Jobs Posted",
      dataIndex: "jobPosted",
      key: "jobPosted",
      align: "center",
    },
    {
      title: t("admin.dashboard.tables.columns.hires") || "Successful Hires",
      dataIndex: "hires",
      key: "hires",
      align: "center",
    },
  ];

  return (
    <div className="admin-dashboard">
      <Card className="mb-5 admin-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {t("admin.dashboard.title")}
            </Title>
          </div>
          <FilterControls />
        </div>
      </Card>

      {/* Alert Section for Important Notices */}
      <div className="alert-section">
        <Alert
          message={t("admin.dashboard.alerts.systemNotice")}
          description={t("admin.dashboard.alerts.pendingJobs", {
            count: jobApprovalStats?.pendingJob || 0,
          })}
          type="info"
          showIcon
          action={
            <Button
              size="small"
              type="primary"
              onClick={() => {
                navigate("/admin/post-approval");
              }}
            >
              {t("admin.dashboard.alerts.reviewNow")}
            </Button>
          }
        />
      </div>

      {/* Overview Statistics */}
      <Row gutter={[16, 16]} className="mb-5">
        <Col xs={24} sm={12} lg={6}>
          {loading.users ? (
            <Card className="admin-stats-card">
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          ) : (
            renderStatsCard(
              t("admin.dashboard.stats.monthlyRevenue") || "Monthly Revenue",
              new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(currentMonthRevenue),
              <DollarOutlined />,
              "#1890ff"
            )
          )}
        </Col>
        <Col xs={24} sm={12} lg={6}>
          {loading.users ? (
            <Card className="admin-stats-card">
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          ) : (
            renderStatsCard(
              t("admin.dashboard.stats.totalCandidates") || "Total Candidates",
              statisticUser.totalCandidates,
              <UserOutlined />,
              "#1890ff"
            )
          )}
        </Col>
        <Col xs={24} sm={12} lg={6}>
          {loading.users ? (
            <Card className="admin-stats-card">
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          ) : (
            renderStatsCard(
              t("admin.dashboard.stats.totalEmployers") || "Total Employers",
              statisticUser.totalEmployers,
              <IoIosBusiness />,
              "#722ed1"
            )
          )}
        </Col>
        <Col xs={24} sm={12} lg={6}>
          {loading.packages ? (
            <Card className="admin-stats-card">
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          ) : (
            renderStatsCard(
              t("admin.dashboard.stats.totalJobs") || "Total Jobs",
              jobCategoryStats?.reduce((sum, item) => sum + item.jobCount, 0),
              <BsFilePost />,
              "#fa8c16"
            )
          )}
        </Col>
      </Row>

      {/* Job Approval Status */}
      <Row gutter={[16, 16]} className="mb-5">
        <Col xs={24}>
          <Card
            title={
              <Flex align="center" gap="small">
                <SafetyCertificateOutlined />{" "}
                {t("admin.dashboard.jobApproval.title") ||
                  "Job Approval Status"}
              </Flex>
            }
            className="admin-card overview-card"
          >
            <div className="job-status-summary">
              <div
                className="status-item"
                style={{ borderTop: "3px solid #faad14" }}
              >
                <div className="status-count">
                  {jobApprovalStats?.pendingJob || 0}
                </div>
                <div className="status-label">
                  {t("admin.dashboard.jobApproval.pending") || "Pending"}
                </div>
              </div>
              <div
                className="status-item"
                style={{ borderTop: "3px solid #52c41a" }}
              >
                <div className="status-count">
                  {jobApprovalStats?.activeJob || 0}
                </div>
                <div className="status-label">
                  {t("admin.dashboard.jobApproval.approved") || "Approved"}
                </div>
              </div>
              <div
                className="status-item"
                style={{ borderTop: "3px solid #f5222d" }}
              >
                <div className="status-count">
                  {jobApprovalStats?.rejectedJob || 0}
                </div>
                <div className="status-label">
                  {t("admin.dashboard.jobApproval.rejected") || "Rejected"}
                </div>
              </div>
              <div
                className="status-item"
                style={{ borderTop: "3px solid #1890ff" }}
              >
                <div className="status-count">
                  {jobApprovalStats?.total || 0}
                </div>
                <div className="status-label">
                  {t("admin.dashboard.jobApproval.total") || "Total"}
                </div>
              </div>
            </div>

            <Divider />

            <Progress
              percent={Math.round(
                Math.min(
                  (jobApprovalStats?.activeJob / jobApprovalStats?.total) * 100,
                  100
                )
              )}
              strokeColor="#52c41a"
              format={(percent) =>
                `${percent}% ${
                  t("admin.dashboard.jobApproval.approved") || "approved"
                }`
              }
            />
          </Card>
        </Col>
      </Row>

      {/* User Growth and Platform Performance */}
      <Row gutter={[16, 16]} className="mb-5">
        <Col xs={24} lg={24}>
          <Card
            title={
              <Flex align="center" gap="small">
                <LineChartOutlined />{" "}
                {t("admin.dashboard.charts.userGrowth") ||
                  "Thống kê người dùng theo tháng"}
              </Flex>
            }
            className="admin-card"
          >
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={userGrowthData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorEmployers"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#722ed1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#722ed1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorCandidates"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="employerCount"
                    name="Nhà tuyển dụng"
                    stroke="#722ed1"
                    fillOpacity={1}
                    fill="url(#colorEmployers)"
                  />
                  <Area
                    type="monotone"
                    dataKey="studentCount"
                    name="Sinh viên"
                    stroke="#1890ff"
                    fillOpacity={1}
                    fill="url(#colorCandidates)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <Divider />
            <Flex justify="space-between" align="middle">
              <Statistic
                title="Tổng nhà tuyển dụng"
                value={userGrowthData?.reduce(
                  (sum, item) => sum + item.employerCount,
                  0
                )}
                valueStyle={{ color: "#722ed1" }}
              />
              <Statistic
                title="Tổng sinh viên"
                value={userGrowthData?.reduce(
                  (sum, item) => sum + item.studentCount,
                  0
                )}
                valueStyle={{ color: "#1890ff" }}
              />
              <Statistic
                title="Tổng người dùng"
                value={
                  userGrowthData?.reduce(
                    (sum, item) => sum + item.employerCount,
                    0
                  ) +
                  userGrowthData?.reduce(
                    (sum, item) => sum + item.studentCount,
                    0
                  )
                }
                valueStyle={{ color: "#1890ff" }}
              />
            </Flex>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} className="mb-5">
        <Col xs={24} lg={12}>
          <Card
            title={
              <Flex align="center" gap="small">
                <BarChartOutlined /> Revenue Analytics
              </Flex>
            }
            className="admin-card"
            extra={
              <Segmented
                options={[
                  { label: "Revenue", value: "revenue" },
                  { label: "Packages", value: "packages" },
                ]}
                value={chartView}
                onChange={setChartView}
                size="small"
              />
            }
          >
            {loading.revenue ? (
              <div style={{ height: 400 }}>
                <Skeleton active paragraph={{ rows: 20 }} />
              </div>
            ) : (
              <div style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  {chartView === "revenue" ? (
                    <BarChart
                      data={revenueByMonth}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis
                        tickFormatter={(value) =>
                          new Intl.NumberFormat("vi-VN", {
                            notation: "compact",
                            compactDisplay: "short",
                          }).format(value)
                        }
                      />
                      <Tooltip
                        formatter={(value) =>
                          new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(value)
                        }
                      />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        name="Revenue"
                        fill="#1890ff"
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                      />
                    </BarChart>
                  ) : (
                    <BarChart
                      data={revenueByMonth}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="subscriptions"
                        name="Package Subscriptions"
                        fill="#1890ff"
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </Col>
        {/* Top In-Demand Skills */}
        <Col xs={24} lg={12} className="h-full">
          <Card
            title={
              <Flex align="center" gap="small">
                <FireOutlined />{" "}
                {t("admin.dashboard.skills.title") || "Top In-Demand Skills"}
              </Flex>
            }
            className="admin-card"
          >
            <div className="top-skills-chart">
              {skillDemandData?.data?.slice(0, 10).map((skill, index) => (
                <div key={index} className="skill-item">
                  <span className="skill-name w-[200px] truncate">
                    {skill.skill}
                  </span>
                  <div className="skill-bar">
                    <Progress
                      percent={Math.round(
                        Math.min(
                          Math.round(
                            (skill.count / skillDemandData?.total) * 100 * 100
                          ) / 100,
                          100
                        ) || 0
                      )}
                      showInfo={false}
                      strokeColor={COLORS[index % COLORS.length]}
                    />
                  </div>
                  <div className="skill-value">
                    <Tag className="text-xs w-fit" color="blue">
                      {Math.round(
                        (skill.count / skillDemandData?.total) * 100 * 100
                      ) / 100}
                      %
                    </Tag>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Student Applications Chart */}
      <Row gutter={[16, 16]} className="mb-5">
        <Col xs={24}>
          <Card
            title={
              <Flex align="center" gap="small">
                <BarChartOutlined />{" "}
                {
                  "Thống kê sinh viên ứng tuyển và phỏng vấn thành công theo tháng"
                }
              </Flex>
            }
            className="admin-card"
          >
            <div style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={studentApplicationData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: "#E5E5E5" }}
                  />
                  <YAxis
                    axisLine={{ stroke: "#E5E5E5" }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      return [value.toLocaleString(), name];
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 15 }} />
                  <Bar
                    dataKey="applications"
                    name="Sinh viên ứng tuyển"
                    fill="#1890ff"
                    barSize={20}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="hires"
                    name="Phỏng vấn thành công"
                    fill="#52c41a"
                    barSize={20}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Divider />
            <Flex justify="space-between" align="middle">
              <Statistic
                title="Tổng số lượt ứng tuyển"
                value={studentApplicationData?.reduce(
                  (sum, item) => sum + item.applications,
                  0
                )}
                valueStyle={{ color: "#1890ff" }}
              />
              <Statistic
                title="Tổng số phỏng vấn thành công"
                value={studentApplicationData?.reduce(
                  (sum, item) => sum + item.hires,
                  0
                )}
                valueStyle={{ color: "#52c41a" }}
              />
              <Statistic
                title="Tỷ lệ thành công trung bình"
                value={Math.min(
                  Math.round(
                    (studentApplicationData?.reduce(
                      (sum, item) => sum + item.hires,
                      0
                    ) /
                      studentApplicationData?.reduce(
                        (sum, item) => sum + item.applications,
                        0
                      )) *
                      100 *
                      100
                  ) / 100,
                  100
                ).toFixed(1)}
                suffix="%"
                precision={1}
                valueStyle={{ color: "#faad14" }}
              />
            </Flex>
          </Card>
        </Col>
      </Row>

      {/* Forum Activity Chart */}
      <Row gutter={[16, 16]} className="mb-5">
        <Col xs={24}>
          <Card
            title={
              <Flex align="center" gap="small">
                <BarChartOutlined /> {"Thống kê hoạt động diễn đàn theo tháng"}
              </Flex>
            }
            className="admin-card"
          >
            <div style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={forumActivityData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: "#E5E5E5" }}
                  />
                  <YAxis
                    axisLine={{ stroke: "#E5E5E5" }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      return [value.toLocaleString(), name];
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 15 }} />
                  <Bar
                    dataKey="forums"
                    name="Diễn đàn mới"
                    fill="#722ed1"
                    barSize={20}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="topics"
                    name="Chủ đề mới"
                    fill="#faad14"
                    barSize={20}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="posts"
                    name="Bài viết mới"
                    fill="#1890ff"
                    barSize={20}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Divider />
            <Flex justify="space-between" align="middle">
              <Statistic
                title="Tổng số diễn đàn mới"
                value={forumActivityData?.reduce(
                  (sum, item) => sum + item.forums,
                  0
                )}
                valueStyle={{ color: "#722ed1" }}
              />
              <Statistic
                title="Tổng số chủ đề mới"
                value={forumActivityData?.reduce(
                  (sum, item) => sum + item.topics,
                  0
                )}
                valueStyle={{ color: "#faad14" }}
              />
              <Statistic
                title="Tổng số bài viết mới"
                value={forumActivityData?.reduce(
                  (sum, item) => sum + item.posts,
                  0
                )}
                valueStyle={{ color: "#1890ff" }}
              />
              <Statistic
                title="Bài viết/chủ đề trung bình"
                value={(
                  forumActivityData?.reduce(
                    (sum, item) => sum + item.posts,
                    0
                  ) /
                  forumActivityData?.reduce((sum, item) => sum + item.topics, 0)
                ).toFixed(1)}
                precision={1}
                valueStyle={{ color: "#52c41a" }}
              />
            </Flex>
          </Card>
        </Col>
      </Row>

      {/* Tables Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card className="admin-card">
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane
                tab={
                  <span>
                    <DollarOutlined />{" "}
                    {t("admin.dashboard.tables.recentOrders") ||
                      "Recent Orders"}
                  </span>
                }
                key="1"
              >
                <Table
                  dataSource={recentOrders}
                  columns={orderColumns}
                  rowKey="purchaseDate"
                  className="admin-table"
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <span>
                    <TrophyOutlined />{" "}
                    {t("admin.dashboard.tables.topEmployers") ||
                      "Top Employers"}
                  </span>
                }
                key="2"
              >
                <Table
                  dataSource={topEmployers?.filter(
                    (employer) => employer.jobPosted !== 0
                  )}
                  columns={employerColumns}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  className="admin-table"
                />
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
