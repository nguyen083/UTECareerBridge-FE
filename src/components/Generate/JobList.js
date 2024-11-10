import React, { useState, useEffect } from 'react';
import { List, Card, Pagination, Select, Spin, Flex, Typography } from 'antd';
import { EnvironmentOutlined, DollarOutlined, InboxOutlined } from '@ant-design/icons';
import { Like } from './Like';
import { getAllJobEmployer, getJobsByStatus } from '../../services/apiService';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const JobList = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Simulated API call - replace with your actual API endpoint
  const fetchData = async (page, pageSize) => {
    console.log('Fetching data...');
    setLoading(true);
    try {
      const params = {
        page: page - 1,       // Trang hiện tại
        limit: pageSize,         // Số bản ghi mỗi trang
      };
      await getAllJobEmployer(id, params).then((res) => {
        console.log(res);
        if (res.status === 'OK' && res.data) {
          const data = res.data.jobResponses.map((item) => {
            return {
              jobId: item.jobId,
              logo: item.employerResponse.companyLogo,
              title: item.jobTitle,
              company: item.employerResponse.companyName,
              jobMinSalary: item.jobMinSalary,
              jobMaxSalary: item.jobMaxSalary,
              rejectionReason: item.rejectionReason,
              jobLocation: item.jobLocation,
              // liked: item.liked,
            };
          });

          setData(data);
          setPagination({
            current: page,
            pageSize: pageSize,
            total: res.data.totalPages * pageSize // Replace with actual total from API
          });
          console.log(pagination);
        }



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

  const handleListChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize
    });
  };
  const handleClick = (key) => {
    navigate('/employer/job/view/' + key);
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
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
        dataSource={data}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handleListChange,
          showSizeChanger: true
        }}
        locale={{
          emptyText: (
            <div className='p-5'>
              <InboxOutlined style={{ fontSize: '50px', marginBottom: '8px' }} />
              <div>Không có dữ liệu</div>
            </div>
          ),
        }}
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
                    <Like liked={item.saved} handleClick={() => alert('Liked')} />
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
                    <DollarOutlined style={{ color: "#1677ff" }} />{item.jobMinSalary} - {item.jobMaxSalary} <Text style={{ fontSize: 12 }}>VNĐ/tháng</Text>
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
                    {item.jobLocation}</Paragraph>
                </div>
              </Flex>
            </Card>
          </List.Item>
        )}
      />
    </div >
  );
};

export default JobList;