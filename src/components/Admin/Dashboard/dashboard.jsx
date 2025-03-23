import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Select, Space } from 'antd';
import {  LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import {
  UserOutlined,
  BankOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getStatisticsByJobCategory, getRevenueByMonth, getStatisticUser, getStatisticPackage } from '../../../services/apiService';
const { Option } = Select;
const AdminDashboard = () => {
  const { t } = useTranslation();
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
        percentage: ((pkg.packageCount / totalPackages) * 100).toFixed(1)
      }));

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

      const totalJobs = filteredData.reduce((sum, category) => sum + category.jobCount, 0);

      const transformedData = filteredData.map(category => ({
        name: category.categoryName,
        value: category.jobCount,
        percentage: ((category.jobCount / totalJobs) * 100).toFixed(1)
      }));

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

  const FilterControls = () => (
    <Space style={{ marginBottom: 16 }}>
      <Select
        size='large'
        value={filters.month}
        onChange={(value) => setFilters(prev => ({ ...prev, month: value }))}
      >
        <Option value={null}>{t('admin.dashboard.filters.allMonths')}</Option>
        {months.map(month => (
          <Option key={month} value={month}>{t('admin.dashboard.filters.month', { month })}</Option>
        ))}
      </Select>
      <Select
        size='large'
        value={filters.year}
        onChange={(value) => setFilters(prev => ({ ...prev, year: value }))}
      >
        <Option value={null}>{t('admin.dashboard.filters.allYears')}</Option>
        {years.map(year => (
          <Option key={year} value={year}>{year}</Option>
        ))}
      </Select>
    </Space>
  );
  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 16 }} className='shadow-md'>
        <FilterControls />
      </Card>
      {/* Overview Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card className='shadow-md'>
            <Statistic
              title={t('admin.dashboard.stats.currentMonthRevenue')}
              value={currentMonthRevenue}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              suffix="VND"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className='shadow-md'>
            <Statistic
              title={t('admin.dashboard.stats.totalCandidates')}
              value={statisticUser.totalCandidates}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className='shadow-md'>
            <Statistic
              title={t('admin.dashboard.stats.totalEmployers')}
              value={statisticUser.totalEmployers}
              prefix={<BankOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Revenue and Subscriptions */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={24}>
          <Card title={t('admin.dashboard.charts.monthlyRevenue')} className='shadow-md'>
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
                      if (name === t('admin.dashboard.charts.revenue')) {
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
                    name={t('admin.dashboard.charts.revenue')}
                    strokeWidth={2}
                    dot={{ stroke: '#52c41a', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="subscriptions"
                    stroke="#1890ff"
                    name={t('admin.dashboard.charts.packageCount')}
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
          <Card title={t('admin.dashboard.charts.topPackages')}>
            <div style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={packageStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}   
                    outerRadius={110}  
                    fill="#722ed1"
                    paddingAngle={1}   
                    label={({ name, value, percentage }) => t('admin.dashboard.charts.packages', { value, percentage })}
                    labelLine={{ stroke: '#555', strokeWidth: 0.5 }} 
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
                      t('admin.dashboard.charts.packages', { 
                        value, 
                        percentage: packageStats.find(item => item.name === name)?.percentage 
                      }),
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
          <Card title={t('admin.dashboard.charts.jobsByCategory')}>
            <div style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jobCategoryStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}   
                    outerRadius={110}  
                    fill="#722ed1"
                    paddingAngle={1}   
                    label={({ name, value, percentage }) => t('admin.dashboard.charts.jobs', { value, percentage })}
                    labelLine={{ stroke: '#555', strokeWidth: 0.5 }} 
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
                      t('admin.dashboard.charts.jobs', {
                        value,
                        percentage: jobCategoryStats.find(item => item.name === name)?.percentage
                      }),
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
      </Row>
    </div>
  );
};

export default AdminDashboard;