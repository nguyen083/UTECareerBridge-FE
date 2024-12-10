import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Select, Space } from 'antd';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import {
  UserOutlined,
  BankOutlined,
  RiseOutlined,
  DollarOutlined,

} from '@ant-design/icons';
import { getStatisticsByJobCategory, getRevenueByMonth, getStatisticUser, getStatisticPackage } from '../../../services/apiService';
const { Option } = Select;
const AdminDashboard = () => {
  const [jobCategoryStats, setJobCategoryStats] = useState([]);
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);
  const [packageStats, setPackageStats] = useState([]);
  const [statisticUser, setStatisticUser] = useState({
    totalCandidates: 0,
    totalEmployers: 0,
  });
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const COLORS = ['#722ed1', '#2f54eb', '#1890ff', '#13c2c2', '#52c41a', '#faad14', '#fadb14', '#f5222d', '#eb2f96', '#eb2f96'];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    month: null,
    year: null
  });

  // Tạo options cho tháng và năm
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const fetchPackageStats = async () => {
    try {
      setLoading(true);
      const response = await getStatisticPackage();
      const totalPackages = response.data.reduce((sum, item) => sum + item.packageCount, 0);
      const transformedData = response.data.map(pkg => ({
        name: pkg.packageName,
        value: pkg.packageCount,
        // Tính phần trăm và làm tròn đến 1 chữ số thập phân
        percentage: ((pkg.packageCount / totalPackages) * 100).toFixed(1)
      }));

      // Sắp xếp theo số lượng công việc giảm dần (tùy chọn)
      transformedData.sort((a, b) => b.value - a.value);
      setPackageStats(transformedData);
      setError(null);
    } catch (err) {
      setError('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPackageStats();
  }, []);

  const fetchRevenueByMonth = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.year) params.year = filters.year;
      const response = await getRevenueByMonth(params);
      const transformedData = response.data.map(item => ({
        month: item.month,
        revenue: item.revenue,
        subscriptions: item.numberOfPackages
      }));
      const currentMonthRevenue = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      if (!filters.year || filters.year === currentYear) {
        const currentMonthData = transformedData.find(item => item.month === currentMonthRevenue);
        setCurrentMonthRevenue(currentMonthData?.revenue || 0);
      }
      setRevenueByMonth(transformedData);
      setError(null);
    } catch (err) {
      setError('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRevenueByMonth();
  }, [filters]);

  const fetchJobCategoryStats = async () => {
    try {
      setLoading(true);

      const params = {};
      if (filters.month) params.month = filters.month;
      if (filters.year) params.year = filters.year;

      const response = await getStatisticsByJobCategory(params);

      const filteredData = response.data.filter(category => category.jobCount > 0);

      // Tính tổng số jobs
      const totalJobs = filteredData.reduce((sum, category) => sum + category.jobCount, 0);

      // Transform data và tính percentage
      const transformedData = filteredData.map(category => ({
        name: category.categoryName,
        value: category.jobCount,
        // Tính phần trăm và làm tròn đến 1 chữ số thập phân
        percentage: ((category.jobCount / totalJobs) * 100).toFixed(1)
      }));

      // Sắp xếp theo số lượng công việc giảm dần (tùy chọn)
      transformedData.sort((a, b) => b.value - a.value);

      setJobCategoryStats(transformedData);

      setError(null);
    } catch (err) {
      setError('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchJobCategoryStats();
  }, [filters]);

  const fetchStatisticUser = async () => {
    try {
      setLoading(true);
      const response = await getStatisticUser();
      setStatisticUser(...response.data);
      setError(null);
    } catch (err) {
      setError('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchStatisticUser();
  }, []);


  // Subscription data
  const subscriptionData = [
    { name: 'Gói Cơ bản', value: 150, revenue: 15000 },
    { name: 'Gói Pro', value: 80, revenue: 12000 },
    { name: 'Gói Doanh nghiệp', value: 40, revenue: 10000 },
    { name: 'Gói Premium', value: 30, revenue: 15000 }
  ];

  // Top employers data
  const topEmployersData = [
    { key: '1', company: 'Công ty A', jobPosts: 25, spending: 5000, activeSubscription: 'Premium' },
    { key: '2', company: 'Công ty B', jobPosts: 20, spending: 4500, activeSubscription: 'Pro' },
    { key: '3', company: 'Công ty C', jobPosts: 18, spending: 4000, activeSubscription: 'Premium' },
    { key: '4', company: 'Công ty D', jobPosts: 15, spending: 3500, activeSubscription: 'Pro' },
    { key: '5', company: 'Công ty E', jobPosts: 12, spending: 3000, activeSubscription: 'Pro' }
  ];


  const applicationTrendData = [
    { month: 'Jan', applications: 450 },
    { month: 'Feb', applications: 520 },
    { month: 'Mar', applications: 610 },
    { month: 'Apr', applications: 580 },
    { month: 'May', applications: 650 },
    { month: 'Jun', applications: 720 }
  ];

  const candidateStatusData = [
    { name: 'Pending', value: 120 },
    { name: 'Interviewed', value: 80 },
    { name: 'Offered', value: 40 },
    { name: 'Hired', value: 30 },
    { name: 'Rejected', value: 50 }
  ];

  const employerActivityData = [
    { month: 'Jan', newJobs: 45, activeJobs: 120 },
    { month: 'Feb', newJobs: 52, activeJobs: 135 },
    { month: 'Mar', newJobs: 61, activeJobs: 150 },
    { month: 'Apr', newJobs: 58, activeJobs: 142 },
    { month: 'May', newJobs: 65, activeJobs: 160 },
    { month: 'Jun', newJobs: 72, activeJobs: 175 }
  ];

  const columns = [
    { title: 'Công ty', dataIndex: 'company', key: 'company' },
    { title: 'Tin đăng', dataIndex: 'jobPosts', key: 'jobPosts' },
    {
      title: 'Chi tiêu', dataIndex: 'spending', key: 'spending',
      render: (value) => `$${value.toLocaleString()}`
    },
    { title: 'Gói dịch vụ', dataIndex: 'activeSubscription', key: 'activeSubscription' }
  ];
  const FilterControls = () => (
    <Space style={{ marginBottom: 16 }}>
      <Select
        size='large'
        value={filters.month}
        onChange={(value) => setFilters(prev => ({ ...prev, month: value }))}
        style={{ width: 120 }}
      >
        <Option value={null}>Tất cả tháng</Option>
        {months.map(month => (
          <Option key={month} value={month}>Tháng {month}</Option>
        ))}
      </Select>
      <Select
        size='large'
        value={filters.year}
        onChange={(value) => setFilters(prev => ({ ...prev, year: value }))}
        style={{ width: 120 }}
      >
        <Option value={null}>Tất cả năm</Option>
        {years.map(year => (
          <Option key={year} value={year}>{year}</Option>
        ))}
      </Select>
    </Space>
  );
  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 16 }} className='box_shadow'>
        <FilterControls />
      </Card>
      {/* Overview Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu tháng này"
              value={currentMonthRevenue}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              suffix="VND"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng ứng viên"
              value={statisticUser.totalCandidates}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng nhà tuyển dụng"
              value={statisticUser.totalEmployers}
              prefix={<BankOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tỷ lệ chuyển đổi"
              value={15.8}
              prefix={<RiseOutlined style={{ color: '#1890ff' }} />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Revenue and Subscriptions */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={24}>
          <Card title="Doanh thu theo tháng">
            <div style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    axisLine={{ stroke: '#d9d9d9' }}
                    tick={{ fill: '#8c8c8c' }}
                  />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(value) =>
                      new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(value)
                    }
                    domain={[0, dataMax => Math.ceil(dataMax * 1.1)]}
                    axisLine={{ stroke: '#d9d9d9' }}
                    tick={{ fill: '#8c8c8c' }}
                    width={120}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, dataMax => Math.ceil(dataMax * 1.1)]}
                    axisLine={{ stroke: '#d9d9d9' }}
                    tick={{ fill: '#8c8c8c' }}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "Doanh thu (VND)") {
                        return [new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(value), name];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#52c41a"
                    name="Doanh thu (VND)"
                    strokeWidth={2}
                    dot={{ stroke: '#52c41a', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="subscriptions"
                    stroke="#1890ff"
                    name="Số lượng gói"
                    strokeWidth={2}
                    dot={{ stroke: '#1890ff', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Gói dịch vụ được bán nhiều nhất">
            <div style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={packageStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}    // Thêm innerRadius để tạo doughnut chart (tùy chọn)
                    outerRadius={110}   // Tăng outerRadius từ 80 lên 120
                    fill="#722ed1"
                    paddingAngle={1}    // Thêm khoảng cách giữa các phần (tùy chọn)
                    label={({ name, value, percentage }) => `${value} gói dịch vụ - ${percentage}%`}
                    labelLine={{ stroke: '#555', strokeWidth: 0.5 }}  // Tùy chỉnh đường kẻ label
                  >
                    {packageStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} việc làm (${packageStats.find(item => item.name === name)?.percentage}%)`,
                      name
                    ]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      padding: '6px'
                    }}
                  />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{
                      paddingLeft: '20px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Recruitment Analytics */}
        <Col xs={24} lg={12}>
          <Card title="Việc làm theo ngành">
            <div style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jobCategoryStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}    // Thêm innerRadius để tạo doughnut chart (tùy chọn)
                    outerRadius={110}   // Tăng outerRadius từ 80 lên 120
                    fill="#722ed1"
                    paddingAngle={1}    // Thêm khoảng cách giữa các phần (tùy chọn)
                    label={({ name, value, percentage }) => `${value} việc làm - ${percentage}%`}
                    labelLine={{ stroke: '#555', strokeWidth: 0.5 }}  // Tùy chỉnh đường kẻ label
                  >
                    {jobCategoryStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} việc làm (${jobCategoryStats.find(item => item.name === name)?.percentage}%)`,
                      name
                    ]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      padding: '6px'
                    }}
                  />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{
                      paddingLeft: '20px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Additional Analytics */}
        <Col xs={24}>
          <Card title="Top nhà tuyển dụng theo chi tiêu">
            <Table
              columns={columns}
              dataSource={topEmployersData}
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} lg={24}>
          <Card title="Xu hướng ứng tuyển">
            <div style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={applicationTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#fa8c16"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>



        <Col xs={24} lg={8}>
          <Card title="Trạng thái ứng viên">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={candidateStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#52c41a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Phân bố doanh thu theo gói">
            <div style={{ padding: '20px' }}>
              {subscriptionData.map(item => (
                <div key={item.name} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item.name}</span>
                    <span>${item.revenue}</span>
                  </div>
                  <Progress
                    percent={Math.round((item.revenue / 52000) * 100)}
                    size="small"
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Chỉ số hiệu suất">
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <div>Tỷ lệ chuyển đổi từ free sang premium</div>
                <Progress percent={32} status="active" />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <div>Tỷ lệ hài lòng của khách hàng</div>
                <Progress percent={92} status="active" />
              </div>
              <div>
                <div>Tỷ lệ tương tác với tin đăng VIP</div>
                <Progress percent={78} status="active" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;