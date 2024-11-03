import React, { useState, useEffect } from 'react';
import { List, Card, Pagination, Select, Spin, Flex, Typography } from 'antd';
import { HeartOutlined, EnvironmentOutlined, DollarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const JobList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Simulated API call - replace with your actual API endpoint
  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      // // Replace this with your actual API call
      // const response = await fetch(
      //   `your-api-endpoint?page=${page}&pageSize=${pageSize}`
      // );
      // const result = await response.json();

      // Simulated response for demonstration
      const mockData = Array.from({ length: pageSize }, (_, index) => ({
        id: (page - 1) * pageSize + index,
        logo: "https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png",
        title: `Nhân Viên Tài Sản Cố Định ${(page - 1) * pageSize + index + 1}`,
        company: 'Công Ty TNHH Cayi Technology Việt Nam',
        salary: 'Từ $600 /tháng',
        location: 'Bắc Ninh, Hà Nội',
        tags: ['Tài sản nguồn vốn'],
        isNew: true
      }));

      setData(mockData);
      setPagination({
        ...pagination,
        total: 100 // Replace with actual total from API
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const handlePageChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize
    });
  };
  const handleClick = (key) => {
    //navigate('/employer/job/view/' + key);
    alert(key);
  };

  const handlePageSizeChange = (current, size) => {
    setPagination({
      ...pagination,
      current: 1, // Reset to first page when changing page size
      pageSize: size
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Spin spinning={loading} size='large'>
        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                style={{
                  cursor: 'default',
                  width: "100%",
                  borderRadius: 10,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
                bodyStyle={{ padding: 16 }}
              >
                <Flex align='center'>
                  <img
                    src={item.logo} // Replace with the actual logo URL
                    style={{ width: 80, height: 80, borderRadius: 4, marginRight: 12 }}
                  />
                  <div style={{ width: '100%' }}>
                    <Flex align='center' justify='space-between' >
                      <Title level={5}
                        onClick={() => handleClick(item.jobId)}
                        style={{
                          cursor: 'pointer',
                          margin: 0,
                          whiteSpace: 'nowrap',        // Keeps the text on a single line
                          overflow: 'hidden',           // Hides any overflow
                          textOverflow: 'ellipsis',     // Adds ellipsis for overflowed text
                          maxWidth: 140                 // Optional: set max width to control where it cuts off
                        }}>
                        {item.title}
                      </Title>
                      <HeartOutlined />
                    </Flex>
                    < Paragraph
                      type='secondary'
                      style={{
                        margin: 0,
                        whiteSpace: 'nowrap',        // Keeps the text on a single line
                        overflow: 'hidden',           // Hides any overflow
                        textOverflow: 'ellipsis',     // Adds ellipsis for overflowed text
                        maxWidth: 140                 // Optional: set max width to control where it cuts off
                      }}>
                      {item.company}</Paragraph>
                    <div style={{ color: '#ff4d4f', fontSize: 14, margin: '8px 0' }}>
                      {item.salary.toLocaleString()} - {item.salary.toLocaleString()} <Text style={{ fontSize: 12 }}>VNĐ/tháng</Text>
                    </div>

                    < Paragraph
                      type='secondary'
                      style={{
                        margin: 0,
                        whiteSpace: 'nowrap',        // Keeps the text on a single line
                        overflow: 'hidden',           // Hides any overflow
                        textOverflow: 'ellipsis',     // Adds ellipsis for overflowed text
                        maxWidth: 140                 // Optional: set max width to control where it cuts off
                      }}>
                      {item.location}</Paragraph>
                  </div>
                </Flex>
              </Card>
            </List.Item>
          )}
        />
        <div className="flex justify-between items-center mt-4">
          <Select
            defaultValue={pagination.pageSize}
            onChange={(value) => handlePageSizeChange(pagination.current, value)}
            className="w-32"
          >
            <Select.Option value={10}>10 / trang</Select.Option>
            <Select.Option value={20}>20 / trang</Select.Option>
            <Select.Option value={50}>50 / trang</Select.Option>
          </Select>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </Spin>
    </div >
  );
};

export default JobList;