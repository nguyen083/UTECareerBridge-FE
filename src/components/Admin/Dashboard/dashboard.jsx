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
  Avatar 
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
  Cell,
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
  FilterOutlined
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  getStatisticsByJobCategory,
  getRevenueByMonth,
  getStatisticUser,
  getStatisticPackage,
} from "../../../services/apiService";

const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const AdminDashboard = () => {
  const { t } = useTranslation();
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
  const [chartView, setChartView] = useState('revenue');
  
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
      setLoading(prev => ({ ...prev, packages: true }));
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
      setLoading(prev => ({ ...prev, packages: false }));
    }
  };
  
  useEffect(() => {
    fetchPackageStats();
    
    // Simulate fetching recent orders
    setRecentOrders([
      { id: '1', company: 'Tech Solutions', package: 'Premium Package', date: '2025-04-25', amount: 2500000, status: 'completed' },
      { id: '2', company: 'Alpha Innovations', package: 'Standard Package', date: '2025-04-23', amount: 1200000, status: 'completed' },
      { id: '3', company: 'Global Systems', package: 'Premium Package', date: '2025-04-20', amount: 2500000, status: 'completed' },
      { id: '4', company: 'Future Partners', package: 'Enterprise Package', date: '2025-04-18', amount: 5000000, status: 'completed' },
      { id: '5', company: 'Tech Dynamics', package: 'Standard Package', date: '2025-04-15', amount: 1200000, status: 'completed' },
    ]);
    
    // Simulate fetching top employers
    setTopEmployers([
      { id: '1', name: 'Tech Solutions', jobsPosted: 28, hires: 12, rating: 4.9 },
      { id: '2', name: 'Future Partners', jobsPosted: 24, hires: 8, rating: 4.7 },
      { id: '3', name: 'Alpha Innovations', jobsPosted: 18, hires: 10, rating: 4.8 },
      { id: '4', name: 'Global Systems', jobsPosted: 15, hires: 7, rating: 4.5 },
      { id: '5', name: 'Tech Dynamics', jobsPosted: 12, hires: 5, rating: 4.6 },
    ]);
    
  }, []);

  const fetchRevenueByMonth = async () => {
    try {
      setLoading(prev => ({ ...prev, revenue: true }));
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
          (item) => item.month === (currentMonthNum === 1 ? 12 : currentMonthNum - 1)
        );
        setPreviousMonthRevenue(previousMonthData?.revenue || 0);
      }
      
      setRevenueByMonth(transformedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, revenue: false }));
    }
  };
  
  useEffect(() => {
    fetchRevenueByMonth();
  }, [filters.year]);

  const fetchJobCategoryStats = async () => {
    try {
      setLoading(prev => ({ ...prev, categories: true }));
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
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };
  
  useEffect(() => {
    fetchJobCategoryStats();
  }, [filters.month, filters.year]);

  const fetchStatisticUser = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const response = await getStatisticUser();
      setStatisticUser(...response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
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

  const revenueGrowth = calculateGrowth(currentMonthRevenue, previousMonthRevenue);

  // Sample recent activities
  const recentActivities = [
    { id: 1, type: 'newUser', message: 'New employer registered: Tech Solutions', time: '2 hours ago' },
    { id: 2, type: 'newJob', message: 'New job posted: Senior Frontend Developer', time: '4 hours ago' },
    { id: 3, type: 'newPackage', message: 'Package purchased: Premium Package', time: '6 hours ago' },
    { id: 4, type: 'approval', message: 'Company profile approved: Alpha Innovations', time: '1 day ago' },
    { id: 5, type: 'newApplication', message: '15 new job applications received today', time: '1 day ago' },
  ];

  const renderStatsCard = (title, value, icon, color, secondaryValue = null, secondaryLabel = null) => (
    <Card className="admin-stats-card">
      <div className="flex items-center justify-between mb-2">
        <div>
          <Text type="secondary" className="stat-label">{title}</Text>
          <div className="stat-value" style={{ color }}>{value}</div>
          {secondaryValue && (
            <div className="flex items-center mt-1">
              <Text type="secondary" style={{ fontSize: '12px', marginRight: '4px' }}>{secondaryLabel}:</Text>
              <Text strong style={{ fontSize: '13px' }}>{secondaryValue}</Text>
            </div>
          )}
        </div>
        <div className="stat-icon" style={{ backgroundColor: `${color}15`, color }}>
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
            <Text type="secondary" className="stat-label">{title}</Text>
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
                  <span style={{ color: isPositive ? "#52c41a" : "#f5222d", fontSize: '13px', fontWeight: 500 }}>
                    {isPositive ? <UpOutlined /> : <DownOutlined />}
                    {' '}
                    {Math.abs(growth).toFixed(1)}%
                    {' '}
                    <span style={{ color: "#8c8c8c", fontWeight: 400 }}>vs last month</span>
                  </span>
                } 
              />
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: `${color}15`, color }}>
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

      <Button 
        icon={<ReloadOutlined />} 
        onClick={handleRefresh}
        type="default"
      >
        {t("admin.dashboard.refresh")}
      </Button>
    </Space>
  );

  const orderColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Package',
      dataIndex: 'package',
      key: 'package',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount),
      align: 'right',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'completed' ? 'success' : 'processing'} 
          text={status === 'completed' ? 'Completed' : 'Processing'} 
        />
      ),
    },
  ];
  
  const employerColumns = [
    {
      title: 'Company',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Jobs Posted',
      dataIndex: 'jobsPosted',
      key: 'jobsPosted',
    },
    {
      title: 'Successful Hires',
      dataIndex: 'hires',
      key: 'hires',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <span>
          {rating} 
          <span style={{color: '#faad14', marginLeft: '5px'}}>
            {'★'.repeat(Math.floor(rating))}
            {rating % 1 > 0 ? '☆' : ''}
          </span>
        </span>
      ),
    },
  ];

  return (
    <div className="admin-dashboard">
      <Card className="admin-card mb-5">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <Title level={4} style={{ margin: 0 }}>{t("admin.dashboard.title")}</Title>
            <Text type="secondary">{t("admin.dashboard.subtitle", { date: new Date().toLocaleDateString() })}</Text>
          </div>
          <FilterControls />
        </div>
      </Card>
      
      {/* Overview Statistics */}
      <Row gutter={[16, 16]} className="mb-5">
        <Col xs={24} sm={12} lg={6}>
          {loading.revenue ? (
            <Card className="admin-stats-card">
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          ) : (
            revenueStatsCard(
              t("admin.dashboard.stats.currentMonthRevenue"),
              currentMonthRevenue,
              previousMonthRevenue,
              <DollarOutlined />,
              "#52c41a"
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
              t("admin.dashboard.stats.totalCandidates"),
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
              t("admin.dashboard.stats.totalEmployers"),
              statisticUser.totalEmployers,
              <BankOutlined />,
              "#722ed1",
              "+5 this week",
              "New employers"
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
              t("admin.dashboard.stats.totalJobs"),
              jobCategoryStats.reduce((sum, item) => sum + item.value, 0),
              <FileTextOutlined />,
              "#fa8c16",
              "+28 this week",
              "New jobs"
            )
          )}
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} className="mb-5">
        <Col xs={24} lg={16}>
          <Card 
            title={t("admin.dashboard.charts.performanceAnalytics")}
            className="admin-card"
            extra={
              <Segmented
                options={[
                  { label: 'Revenue', value: 'revenue' },
                  { label: 'Packages', value: 'packages' },
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
                  {chartView === 'revenue' ? (
                    <AreaChart data={revenueByMonth} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#52c41a" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#52c41a" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        axisLine={{ stroke: "#d9d9d9" }}
                        tick={{ fill: "#8c8c8c" }}
                        tickFormatter={(month) => {
                          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                          return monthNames[month - 1];
                        }}
                      />
                      <YAxis
                        tickFormatter={(value) =>
                          new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            notation: "compact",
                            compactDisplay: "short",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(value)
                        }
                        domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
                        axisLine={{ stroke: "#d9d9d9" }}
                        tick={{ fill: "#8c8c8c" }}
                      />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === t("admin.dashboard.charts.revenue")) {
                            return [
                              new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }).format(value),
                              name,
                            ];
                          }
                          return [value, name];
                        }}
                        labelFormatter={(month) => {
                          const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                          return monthNames[month - 1];
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#52c41a"
                        name={t("admin.dashboard.charts.revenue")}
                        strokeWidth={3}
                        dot={{ stroke: "#52c41a", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  ) : (
                    <BarChart data={revenueByMonth} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        axisLine={{ stroke: "#d9d9d9" }}
                        tick={{ fill: "#8c8c8c" }}
                        tickFormatter={(month) => {
                          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                          return monthNames[month - 1];
                        }}
                      />
                      <YAxis
                        axisLine={{ stroke: "#d9d9d9" }}
                        tick={{ fill: "#8c8c8c" }}
                      />
                      <Tooltip
                        labelFormatter={(month) => {
                          const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                          return monthNames[month - 1];
                        }}
                      />
                      <Bar
                        dataKey="subscriptions"
                        name={t("admin.dashboard.charts.packageCount")}
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

        <Col xs={24} lg={8}>
          <Card title={t("admin.dashboard.charts.recentActivities")} className="admin-card h-full">
            <div className="recent-activities-list">
              {recentActivities.map(activity => (
                <div key={activity.id} className="recent-activity-item">
                  <div className="activity-icon">
                    {activity.type === 'newUser' && <UserOutlined style={{ color: '#1890ff' }} />}
                    {activity.type === 'newJob' && <FileTextOutlined style={{ color: '#52c41a' }} />}
                    {activity.type === 'newPackage' && <DollarOutlined style={{ color: '#722ed1' }} />}
                    {activity.type === 'approval' && <BankOutlined style={{ color: '#fa8c16' }} />}
                    {activity.type === 'newApplication' && <TeamOutlined style={{ color: '#eb2f96' }} />}
                  </div>
                  <div className="activity-content">
                    <div className="activity-message">{activity.message}</div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-5">
        <Col xs={24} lg={12}>
          <Card title={t("admin.dashboard.charts.topPackages")} className="admin-card">
            {loading.packages ? (
              <div style={{ height: 350 }}>
                <Skeleton active paragraph={{ rows: 10 }} />
              </div>
            ) : (
              <div style={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={packageStats}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      fill="#722ed1"
                      paddingAngle={2}
                      label={({ value, percentage }) =>
                        t("admin.dashboard.charts.packages", {
                          value,
                          percentage,
                        })
                      }
                      labelLine={{ stroke: "#555", strokeWidth: 0.5, strokeDasharray: "2 2" }}
                    >
                      {packageStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        t("admin.dashboard.charts.packages", {
                          value,
                          percentage: packageStats.find(
                            (item) => item.name === name
                          )?.percentage,
                        }),
                        name,
                      ]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.98)",
                        border: "1px solid #e8e8e8",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                      }}
                    />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      wrapperStyle={{
                        paddingLeft: "20px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title={t("admin.dashboard.charts.jobsByCategory")} className="admin-card">
            {loading.categories ? (
              <div style={{ height: 350 }}>
                <Skeleton active paragraph={{ rows: 10 }} />
              </div>
            ) : (
              <div style={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={jobCategoryStats}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      fill="#722ed1"
                      paddingAngle={2}
                      label={({ value, percentage }) =>
                        t("admin.dashboard.charts.jobs", { value, percentage })
                      }
                      labelLine={{ stroke: "#555", strokeWidth: 0.5, strokeDasharray: "2 2" }}
                    >
                      {jobCategoryStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        t("admin.dashboard.charts.jobs", {
                          value,
                          percentage: jobCategoryStats.find(
                            (item) => item.name === name
                          )?.percentage,
                        }),
                        name,
                      ]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.98)",
                        border: "1px solid #e8e8e8",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                      }}
                    />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      wrapperStyle={{
                        paddingLeft: "20px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card className="admin-card">
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Recent Orders" key="1">
                <Table 
                  dataSource={recentOrders}
                  columns={orderColumns}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  className="admin-table"
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Top Employers" key="2">
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
