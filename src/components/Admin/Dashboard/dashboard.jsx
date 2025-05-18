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
  Avatar,
  Flex,
  List,
  Tag,
  Empty,
  Tooltip as AntTooltip,
  Alert,
} from "antd";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  UserOutlined,
  BankOutlined,
  DollarOutlined,
  UpOutlined,
  DownOutlined,
  FileTextOutlined,
  TeamOutlined,
  RiseOutlined,
  CalendarOutlined,
  ReloadOutlined,
  FilterOutlined,
  SafetyCertificateOutlined,
  ExceptionOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PieChartOutlined,
  LineChartOutlined,
  BarChartOutlined,
  RadarChartOutlined,
  ScheduleOutlined,
  GlobalOutlined,
  FireOutlined,
  TrophyOutlined,
  AlertOutlined,
  SearchOutlined,
  InfoCircleOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  getStatisticsByJobCategory,
  getRevenueByMonth,
  getStatisticUser,
  getStatisticPackage,
} from "../../../services/apiService";
import "./Dashboard.scss";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [jobCategoryStats, setJobCategoryStats] = useState([]);
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);
  const [previousMonthRevenue, setPreviousMonthRevenue] = useState(0);
  const [packageStats, setPackageStats] = useState([]);
  const [statisticUser, setStatisticUser] = useState({
    totalCandidates: 0,
    totalEmployers: 0,
  });
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topEmployers, setTopEmployers] = useState([]);
  const [loading, setLoading] = useState({
    revenue: true,
    packages: true,
    users: true,
    categories: true,
    orders: true,
    employers: true,
  });
  const [chartView, setChartView] = useState("revenue");
  const [chartType, setChartType] = useState("pie");
  const [packageChartType, setPackageChartType] = useState("pie");
  const [comparisonPeriod, setComparisonPeriod] = useState("month");
  const [platformAnalytics, setPlatformAnalytics] = useState({
    activeUsers: 587,
    avgSessionDuration: "4:32",
    bounceRate: 32.7,
    conversionRate: 8.4,
  });
  const [jobApprovalStats, setJobApprovalStats] = useState({
    pending: 12,
    approved: 241,
    rejected: 19,
    total: 272,
  });
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [skillDemandData, setSkillDemandData] = useState([]);
  const [geographicData, setGeographicData] = useState([]);
  const [recruitmentSuccessData, setRecruitmentSuccessData] = useState([]);
  const [studentApplicationData, setStudentApplicationData] = useState([]);
  const [forumActivityData, setForumActivityData] = useState([]);

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

  const fetchPackageStats = async () => {
    try {
      setLoading((prev) => ({ ...prev, packages: true }));
      const response = await getStatisticPackage();
      const totalPackages = response.data.reduce(
        (sum, item) => sum + item.packageCount,
        0
      );
      const transformedData = response.data.map((pkg) => ({
        name: pkg.packageName,
        value: pkg.packageCount,
        percentage: ((pkg.packageCount / totalPackages) * 100).toFixed(1),
        revenue: pkg.totalRevenue || 0,
      }));

      transformedData.sort((a, b) => b.value - a.value);
      setPackageStats(transformedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, packages: false }));
    }
  };

  useEffect(() => {
    fetchPackageStats();

    // Simulate fetching recent orders
    setRecentOrders([
      {
        id: "1",
        company: "Tech Solutions",
        package: "Premium Package",
        date: "2025-04-25",
        amount: 2500000,
        status: "completed",
      },
      {
        id: "2",
        company: "Alpha Innovations",
        package: "Standard Package",
        date: "2025-04-23",
        amount: 1200000,
        status: "completed",
      },
      {
        id: "3",
        company: "Global Systems",
        package: "Premium Package",
        date: "2025-04-20",
        amount: 2500000,
        status: "completed",
      },
      {
        id: "4",
        company: "Future Partners",
        package: "Enterprise Package",
        date: "2025-04-18",
        amount: 5000000,
        status: "completed",
      },
      {
        id: "5",
        company: "Tech Dynamics",
        package: "Standard Package",
        date: "2025-04-15",
        amount: 1200000,
        status: "completed",
      },
    ]);

    // Simulate fetching top employers
    setTopEmployers([
      {
        id: "1",
        name: "Tech Solutions",
        jobsPosted: 28,
        hires: 12,
        rating: 4.9,
      },
      {
        id: "2",
        name: "Future Partners",
        jobsPosted: 24,
        hires: 8,
        rating: 4.7,
      },
      {
        id: "3",
        name: "Alpha Innovations",
        jobsPosted: 18,
        hires: 10,
        rating: 4.8,
      },
      {
        id: "4",
        name: "Global Systems",
        jobsPosted: 15,
        hires: 7,
        rating: 4.5,
      },
      { id: "5", name: "Tech Dynamics", jobsPosted: 12, hires: 5, rating: 4.6 },
    ]);
  }, []);

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

        const previousMonthData = transformedData.find(
          (item) =>
            item.month === (currentMonthNum === 1 ? 12 : currentMonthNum - 1)
        );
        setPreviousMonthRevenue(previousMonthData?.revenue || 0);
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

  const fetchJobCategoryStats = async () => {
    try {
      setLoading((prev) => ({ ...prev, categories: true }));
      const params = {};
      if (filters.month) params.month = filters.month;
      if (filters.year) params.year = filters.year;

      const response = await getStatisticsByJobCategory(params);

      const filteredData = response.data.filter(
        (category) => category.jobCount > 0
      );

      const totalJobs = filteredData.reduce(
        (sum, category) => sum + category.jobCount,
        0
      );

      const transformedData = filteredData.map((category) => ({
        name: category.categoryName,
        value: category.jobCount,
        percentage: ((category.jobCount / totalJobs) * 100).toFixed(1),
      }));

      transformedData.sort((a, b) => b.value - a.value);

      setJobCategoryStats(transformedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  };

  useEffect(() => {
    fetchJobCategoryStats();
  }, [filters.month, filters.year]);

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
    fetchJobCategoryStats();
    fetchPackageStats();
    fetchStatisticUser();
  };

  const calculateGrowth = (current, previous) => {
    if (!previous) return 100;
    return ((current - previous) / previous) * 100;
  };

  const revenueGrowth = calculateGrowth(
    currentMonthRevenue,
    previousMonthRevenue
  );

  // Sample recent activities
  const recentActivities = [
    {
      id: 1,
      type: "newUser",
      message: "New employer registered: Tech Solutions",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "newJob",
      message: "New job posted: Senior Frontend Developer",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "newPackage",
      message: "Package purchased: Premium Package",
      time: "6 hours ago",
    },
    {
      id: 4,
      type: "approval",
      message: "Company profile approved: Alpha Innovations",
      time: "1 day ago",
    },
    {
      id: 5,
      type: "newApplication",
      message: "15 new job applications received today",
      time: "1 day ago",
    },
  ];

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

  const revenueStatsCard = (title, value, previousValue, icon, color) => {
    const growth = calculateGrowth(value, previousValue);
    const isPositive = growth >= 0;

    return (
      <Card className="admin-stats-card">
        <div className="flex items-center justify-between mb-2">
          <div>
            <Text type="secondary" className="stat-label">
              {title}
            </Text>
            <div className="stat-value" style={{ color }}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(value)}
            </div>
            <div className="flex items-center mt-1">
              <Badge
                status={isPositive ? "success" : "error"}
                text={
                  <span
                    style={{
                      color: isPositive ? "#52c41a" : "#f5222d",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    {isPositive ? <UpOutlined /> : <DownOutlined />}{" "}
                    {Math.abs(growth).toFixed(1)}%{" "}
                    <span style={{ color: "#8c8c8c", fontWeight: 400 }}>
                      vs last month
                    </span>
                  </span>
                }
              />
            </div>
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
  };

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
      title: t("admin.dashboard.tables.columns.id") || "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: t("admin.dashboard.tables.columns.company") || "Company",
      dataIndex: "company",
      key: "company",
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("admin.dashboard.tables.columns.package") || "Package",
      dataIndex: "package",
      key: "package",
    },
    {
      title: t("admin.dashboard.tables.columns.amount") || "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount),
      align: "right",
    },
    {
      title: t("admin.dashboard.tables.columns.date") || "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: t("admin.dashboard.tables.columns.status") || "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={status === "completed" ? "success" : "processing"}
          text={
            status === "completed"
              ? t("admin.dashboard.tables.statuses.completed") || "Completed"
              : t("admin.dashboard.tables.statuses.processing") || "Processing"
          }
        />
      ),
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
      dataIndex: "jobsPosted",
      key: "jobsPosted",
    },
    {
      title: t("admin.dashboard.tables.columns.hires") || "Successful Hires",
      dataIndex: "hires",
      key: "hires",
    },
    {
      title: t("admin.dashboard.tables.columns.rating") || "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <span>
          {rating}
          <span style={{ color: "#faad14", marginLeft: "5px" }}>
            {"★".repeat(Math.floor(rating))}
            {rating % 1 > 0 ? "☆" : ""}
          </span>
        </span>
      ),
    },
  ];

  // Generate skill demand data
  const generateSkillDemandData = () => {
    const data = [
      { skill: "JavaScript", count: 156, change: 12 },
      { skill: "React", count: 143, change: 18 },
      { skill: "Node.js", count: 98, change: 5 },
      { skill: "TypeScript", count: 87, change: 15 },
      { skill: "Python", count: 76, change: -2 },
      { skill: "Java", count: 72, change: -5 },
      { skill: "AWS", count: 65, change: 8 },
      { skill: "DevOps", count: 58, change: 14 },
      { skill: "SQL", count: 51, change: 3 },
      { skill: "UI/UX", count: 48, change: 9 },
    ];

    setSkillDemandData(data);
  };

  // Generate geographic data
  const generateGeographicData = () => {
    const data = [
      {
        city: "Ho Chi Minh City",
        employers: 120,
        candidates: 580,
        jobs: 245,
      },
      { city: "Hanoi", employers: 85, candidates: 420, jobs: 174 },
      { city: "Da Nang", employers: 42, candidates: 195, jobs: 87 },
      { city: "Can Tho", employers: 23, candidates: 125, jobs: 46 },
      { city: "Hai Phong", employers: 19, candidates: 105, jobs: 38 },
      { city: "Nha Trang", employers: 16, candidates: 85, jobs: 31 },
      { city: "Other", employers: 37, candidates: 210, jobs: 74 },
    ];

    setGeographicData(data);
  };

  // Generate student applications and hires data
  const generateStudentApplicationData = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const data = [];

    // Generate data for the past 12 months
    for (let i = 11; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = monthIndex <= currentMonth ? currentYear : currentYear - 1;

      // Format month to ensure 2 digits (01, 02, etc.)
      const monthFormatted = (monthIndex + 1).toString().padStart(2, "0");

      // Base values with some random fluctuation
      const baseApplications = 150 + Math.floor(Math.random() * 30);
      // Higher applications in recruitment seasons (Feb-Mar and Sep-Oct)
      const seasonalFactor =
        monthIndex === 1 ||
        monthIndex === 2 ||
        monthIndex === 8 ||
        monthIndex === 9
          ? 1.5
          : 1;

      const applications = Math.floor(baseApplications * seasonalFactor);
      // Successful hire rate between 25-45%
      const hireRate = 0.25 + Math.random() * 0.2;
      const hires = Math.floor(applications * hireRate);

      data.push({
        date: `${monthFormatted}/${year}`,
        applications: applications,
        hires: hires,
        sortOrder: year * 12 + monthIndex, // For proper sorting
      });
    }

    // Sort by date chronologically
    data.sort((a, b) => a.sortOrder - b.sortOrder);

    setStudentApplicationData(data);
  };

  // Generate forum activity data
  const generateForumActivityData = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const data = [];

    // Generate data for the past 12 months
    for (let i = 11; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = monthIndex <= currentMonth ? currentYear : currentYear - 1;

      // Format month to ensure 2 digits (01, 02, etc.)
      const monthFormatted = (monthIndex + 1).toString().padStart(2, "0");

      // Base values with random fluctuation
      const baseForums = 5 + Math.floor(Math.random() * 3); // 5-7 new forums per month
      const basePosts = 120 + Math.floor(Math.random() * 50); // 120-170 base posts
      const baseTopics = 35 + Math.floor(Math.random() * 15); // 35-50 base topics

      // Activity increases during academic seasons (Sep-Nov, Feb-Apr)
      const academicSeasonFactor =
        monthIndex === 1 ||
        monthIndex === 2 ||
        monthIndex === 3 || // Feb-Apr
        monthIndex === 8 ||
        monthIndex === 9 ||
        monthIndex === 10 // Sep-Nov
          ? 1.4
          : 1;

      // Summer is typically slower (Jun-Aug)
      const summerSlowdownFactor =
        monthIndex === 5 || monthIndex === 6 || monthIndex === 7 ? 0.8 : 1;

      // Apply seasonal factors
      const seasonalFactor = academicSeasonFactor * summerSlowdownFactor;

      // Generate final values with growth trend (more recent months have higher activity)
      const growthFactor = 1 + (12 - i) * 0.015; // Small growth factor for newer months

      const forums = Math.floor(baseForums * seasonalFactor);
      const posts = Math.floor(basePosts * seasonalFactor * growthFactor);
      const topics = Math.floor(baseTopics * seasonalFactor * growthFactor);

      data.push({
        date: `${monthFormatted}/${year}`,
        forums: forums,
        posts: posts,
        topics: topics,
        sortOrder: year * 12 + monthIndex, // For proper sorting
      });
    }

    // Sort by date chronologically
    data.sort((a, b) => a.sortOrder - b.sortOrder);

    setForumActivityData(data);
  };

  useEffect(() => {
    // Generate user growth data
    const generateUserGrowthData = () => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const now = new Date();
      const currentMonth = now.getMonth();

      // Generate data for the past 6 months
      const data = [];

      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const employerBase =
          50 + Math.floor(i * 12) + Math.floor(Math.random() * 10);
        const candidateBase =
          120 + Math.floor(i * 25) + Math.floor(Math.random() * 20);

        data.push({
          month: months[monthIndex],
          employers: employerBase + i * 5,
          candidates: candidateBase + i * 15,
          total: employerBase + candidateBase + i * 20,
        });
      }

      setUserGrowthData(data);
    };

    generateUserGrowthData();
    generateStudentApplicationData();
    generateForumActivityData();
    generateSkillDemandData();
    generateGeographicData();
  }, []);

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
          description={t("admin.dashboard.alerts.pendingJobs", { count: 12 })}
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

      {/* Key Performance Metrics */}
      <div className="key-metrics-container">
        <div className="key-metric-item">
          <div className="metric-header">
            <div
              className="metric-icon"
              style={{
                backgroundColor: `rgba(82, 196, 26, 0.1)`,
                color: "#52c41a",
              }}
            >
              <DollarOutlined />
            </div>
            <div className="metric-title">Monthly Revenue</div>
          </div>
          <div className="metric-value">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(currentMonthRevenue)}
          </div>
          <div className="metric-footer">
            <div
              className={`trend ${
                revenueGrowth >= 0 ? "positive" : "negative"
              }`}
            >
              {revenueGrowth >= 0 ? <UpOutlined /> : <DownOutlined />}{" "}
              {Math.abs(revenueGrowth).toFixed(1)}%
            </div>
            <div className="trend-period">vs last month</div>
          </div>
        </div>

        {/* <div className="key-metric-item">
          <div className="metric-header">
            <div
              className="metric-icon"
              style={{
                backgroundColor: `rgba(24, 144, 255, 0.1)`,
                color: "#1890ff",
              }}
            >
              <TeamOutlined />
            </div>
            <div className="metric-title">Total Users</div>
          </div>
          <div className="metric-value">
            {statisticUser.totalCandidates + statisticUser.totalEmployers || 0}
          </div>
          <div className="metric-footer">
            <div className="trend positive">
              <UpOutlined /> 8.5%
            </div>
            <div className="trend-period">vs last month</div>
          </div>
        </div> */}

        <div className="key-metric-item">
          <div className="metric-header">
            <div
              className="metric-icon"
              style={{
                backgroundColor: `rgba(250, 173, 20, 0.1)`,
                color: "#faad14",
              }}
            >
              <FileTextOutlined />
            </div>
            <div className="metric-title">Active Jobs</div>
          </div>
          <div className="metric-value">{jobApprovalStats.approved}</div>
          <div className="metric-footer">
            <div className="trend positive">
              <UpOutlined /> 12.3%
            </div>
            <div className="trend-period">vs last month</div>
          </div>
        </div>
        {/* 
        <div className="key-metric-item">
          <div className="metric-header">
            <div
              className="metric-icon"
              style={{
                backgroundColor: `rgba(114, 46, 209, 0.1)`,
                color: "#722ed1",
              }}
            >
              <RiseOutlined />
            </div>
            <div className="metric-title">Conversion Rate</div>
          </div>
          <div className="metric-value">
            {platformAnalytics.conversionRate}%
          </div>
          <div className="metric-footer">
            <div className="trend positive">
              <UpOutlined /> 1.2%
            </div>
            <div className="trend-period">vs last month</div>
          </div>
        </div> */}
      </div>

      {/* Overview Statistics */}
      <Row gutter={[16, 16]} className="mb-5">
        {/* <Col xs={24} sm={12} lg={6}>
          {loading.revenue ? (
            <Card className="admin-stats-card">
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          ) : (
            revenueStatsCard(
              t("admin.dashboard.stats.currentMonthRevenue") ||
                "Monthly Revenue",
              currentMonthRevenue,
              previousMonthRevenue,
              <DollarOutlined />,
              "#52c41a"
            )
          )}
        </Col> */}
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
              "#1890ff",
              "+12 this week",
              "New candidates"
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
              <BankOutlined />,
              "#722ed1",
              "+5 this week",
              "New employers"
            )
          )}
        </Col>
        {/* <Col xs={24} sm={12} lg={6}>
          {loading.packages ? (
            <Card className="admin-stats-card">
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          ) : (
            renderStatsCard(
              t("admin.dashboard.stats.totalJobs") || "Total Jobs",
              jobCategoryStats.reduce((sum, item) => sum + item.value, 0),
              <FileTextOutlined />,
              "#fa8c16",
              "+28 this week",
              "New jobs"
            )
          )}
        </Col> */}
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
                <div className="status-count">{jobApprovalStats.pending}</div>
                <div className="status-label">
                  {t("admin.dashboard.jobApproval.pending") || "Pending"}
                </div>
              </div>
              <div
                className="status-item"
                style={{ borderTop: "3px solid #52c41a" }}
              >
                <div className="status-count">{jobApprovalStats.approved}</div>
                <div className="status-label">
                  {t("admin.dashboard.jobApproval.approved") || "Approved"}
                </div>
              </div>
              <div
                className="status-item"
                style={{ borderTop: "3px solid #f5222d" }}
              >
                <div className="status-count">{jobApprovalStats.rejected}</div>
                <div className="status-label">
                  {t("admin.dashboard.jobApproval.rejected") || "Rejected"}
                </div>
              </div>
              <div
                className="status-item"
                style={{ borderTop: "3px solid #1890ff" }}
              >
                <div className="status-count">{jobApprovalStats.total}</div>
                <div className="status-label">
                  {t("admin.dashboard.jobApproval.total") || "Total"}
                </div>
              </div>
            </div>

            <Divider />

            <Progress
              percent={Math.round(
                (jobApprovalStats.approved / jobApprovalStats.total) * 100
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
                {t("admin.dashboard.charts.userGrowth") || "User Growth Trends"}
              </Flex>
            }
            className="admin-card"
            extra={
              <Select defaultValue="6months" style={{ width: 120 }}>
                <Option value="30days">
                  {t("admin.dashboard.filters.last30Days") || "Last 30 Days"}
                </Option>
                <Option value="6months">
                  {t("admin.dashboard.filters.last6Months") || "Last 6 Months"}
                </Option>
                <Option value="1year">
                  {t("admin.dashboard.filters.lastYear") || "Last Year"}
                </Option>
              </Select>
            }
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
                    dataKey="employers"
                    name={t("admin.dashboard.charts.employers") || "Employers"}
                    stroke="#722ed1"
                    fillOpacity={1}
                    fill="url(#colorEmployers)"
                  />
                  <Area
                    type="monotone"
                    dataKey="candidates"
                    name={
                      t("admin.dashboard.charts.candidates") || "Candidates"
                    }
                    stroke="#1890ff"
                    fillOpacity={1}
                    fill="url(#colorCandidates)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} className="mb-5">
        <Col xs={24} lg={16}>
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
      </Row>

      {/* Skill Demand Trend and Geographic Data */}
      <Row gutter={[16, 16]} className="mb-5">
        {/* Skill Distribution Analysis
        <Col xs={24} lg={12}>
          <Card
            title={
              <Flex align="center" gap="small">
                <RadarChartOutlined />{" "}
                {t("admin.dashboard.skills.distribution") ||
                  "Skill Distribution Analysis"}
              </Flex>
            }
            className="admin-card"
          >
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={skillDemandData.slice(0, 8)}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
                  <Radar
                    name={t("admin.dashboard.skills.title") || "Skills"}
                    dataKey="count"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <Divider />
            <Flex justify="center" align="middle">
              <InfoCircleOutlined />
              <Text type="secondary">
                {t("admin.dashboard.charts.skillsAnalysis") ||
                  "Radar analysis showing skills distribution across the platform"}
              </Text>
            </Flex>
          </Card>
        </Col> */}

        {/* Top In-Demand Skills */}
        <Col xs={24} lg={12}>
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
              {skillDemandData.slice(0, 6).map((skill, index) => (
                <div key={index} className="skill-item">
                  <div className="skill-name">{skill.skill}</div>
                  <div className="skill-bar">
                    <Progress
                      percent={Math.round(
                        (skill.count / skillDemandData[0].count) * 100
                      )}
                      showInfo={false}
                      strokeColor={COLORS[index % COLORS.length]}
                    />
                  </div>
                  <div className="skill-value">
                    {skill.count}
                    <Tag
                      color={
                        skill.change > 0
                          ? "success"
                          : skill.change < 0
                          ? "error"
                          : "default"
                      }
                      style={{ marginLeft: 8 }}
                    >
                      {skill.change > 0 ? "+" : ""}
                      {skill.change}%
                    </Tag>
                  </div>
                </div>
              ))}
            </div>
            <Divider />
            <Flex justify="center">
              <Button type="primary" ghost>
                {t("admin.dashboard.skills.viewAll") || "View All Skills"}
              </Button>
            </Flex>
          </Card>
        </Col>
      </Row>

      {/* Recruitment Success and Geographic Data */}
      <Row gutter={[16, 16]} className="mb-5">
        {/* Recruitment Success */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Flex align="center" gap="small">
                <TrophyOutlined /> {"Thống kê ứng tuyển thành công"}
              </Flex>
            }
            className="admin-card"
          >
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={recruitmentSuccessData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "rate")
                        return [`${value}%`, "Tỷ lệ thành công"];
                      return [
                        value,
                        name === "applied"
                          ? "Ứng tuyển"
                          : name === "interviewed"
                          ? "Phỏng vấn"
                          : "Được nhận",
                      ];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="applied" name="Ứng tuyển" fill="#1890ff" />
                  <Bar dataKey="interviewed" name="Phỏng vấn" fill="#faad14" />
                  <Bar dataKey="hired" name="Được nhận" fill="#52c41a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Divider />
            <Flex justify="center" align="middle">
              <Row gutter={16} className="recruitment-stats">
                {recruitmentSuccessData.slice(0, 3).map((item, index) => (
                  <Col key={index} span={8}>
                    <Statistic
                      title={item.name}
                      value={item.rate}
                      suffix="%"
                      valueStyle={{
                        color:
                          item.rate > 35
                            ? "#52c41a"
                            : item.rate > 25
                            ? "#faad14"
                            : "#f5222d",
                      }}
                    />
                  </Col>
                ))}
              </Row>
            </Flex>
          </Card>
        </Col>

        {/* Geographic Distribution */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Flex align="center" gap="small">
                <GlobalOutlined />{" "}
                {t("admin.dashboard.geographic.title") ||
                  "Geographic Distribution"}
              </Flex>
            }
            className="admin-card"
          >
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={geographicData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="city"
                    type="category"
                    tick={{ fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      return [
                        value,
                        name === "employers"
                          ? t("admin.dashboard.geographic.employers") ||
                            "Employers"
                          : name === "candidates"
                          ? t("admin.dashboard.geographic.candidates") ||
                            "Candidates"
                          : t("admin.dashboard.geographic.jobs") || "Jobs",
                      ];
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar
                    dataKey="employers"
                    name={
                      t("admin.dashboard.geographic.employers") || "Employers"
                    }
                    fill="#722ed1"
                    barSize={10}
                  />
                  <Bar
                    dataKey="candidates"
                    name={
                      t("admin.dashboard.geographic.candidates") || "Candidates"
                    }
                    fill="#1890ff"
                    barSize={10}
                  />
                  <Bar
                    dataKey="jobs"
                    name={t("admin.dashboard.geographic.jobs") || "Jobs"}
                    fill="#52c41a"
                    barSize={10}
                  />
                </BarChart>
              </ResponsiveContainer>
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
            extra={
              <Select defaultValue="12months" style={{ width: 120 }}>
                <Option value="6months">
                  {t("admin.dashboard.filters.last6Months") ||
                    "6 tháng gần đây"}
                </Option>
                <Option value="12months">
                  {t("admin.dashboard.filters.lastYear") || "12 tháng gần đây"}
                </Option>
              </Select>
            }
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
                      return [
                        value.toLocaleString(),
                        name === "applications"
                          ? "Sinh viên ứng tuyển"
                          : "Phỏng vấn thành công",
                      ];
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
                value={studentApplicationData.reduce(
                  (sum, item) => sum + item.applications,
                  0
                )}
                valueStyle={{ color: "#1890ff" }}
              />
              <Statistic
                title="Tổng số phỏng vấn thành công"
                value={studentApplicationData.reduce(
                  (sum, item) => sum + item.hires,
                  0
                )}
                valueStyle={{ color: "#52c41a" }}
              />
              <Statistic
                title="Tỷ lệ thành công trung bình"
                value={(
                  (studentApplicationData.reduce(
                    (sum, item) => sum + item.hires,
                    0
                  ) /
                    studentApplicationData.reduce(
                      (sum, item) => sum + item.applications,
                      0
                    )) *
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
            extra={
              <Select defaultValue="12months" style={{ width: 120 }}>
                <Option value="6months">
                  {t("admin.dashboard.filters.last6Months") ||
                    "6 tháng gần đây"}
                </Option>
                <Option value="12months">
                  {t("admin.dashboard.filters.lastYear") || "12 tháng gần đây"}
                </Option>
              </Select>
            }
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
                      return [
                        value.toLocaleString(),
                        name === "forums"
                          ? "Diễn đàn"
                          : name === "posts"
                          ? "Bài viết"
                          : "Chủ đề",
                      ];
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
                value={forumActivityData.reduce(
                  (sum, item) => sum + item.forums,
                  0
                )}
                valueStyle={{ color: "#722ed1" }}
              />
              <Statistic
                title="Tổng số chủ đề mới"
                value={forumActivityData.reduce(
                  (sum, item) => sum + item.topics,
                  0
                )}
                valueStyle={{ color: "#faad14" }}
              />
              <Statistic
                title="Tổng số bài viết mới"
                value={forumActivityData.reduce(
                  (sum, item) => sum + item.posts,
                  0
                )}
                valueStyle={{ color: "#1890ff" }}
              />
              <Statistic
                title="Bài viết/chủ đề trung bình"
                value={(
                  forumActivityData.reduce((sum, item) => sum + item.posts, 0) /
                  forumActivityData.reduce((sum, item) => sum + item.topics, 0)
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
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
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
                  dataSource={topEmployers}
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
