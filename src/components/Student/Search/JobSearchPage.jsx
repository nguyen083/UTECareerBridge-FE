import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Card, Tag, Carousel, Select, List, Pagination } from 'antd';
import FilterPanel from './FilterPanel';
import BoxContainer from '../../Generate/BoxContainer';
import './JobPage.scss';
import { useSelector } from 'react-redux';
import { searchJob } from '../../../services/apiService';
import { JobCardLarge } from '../../Generate/JobCard';
const { Content } = Layout;
const { Option } = Select;
const JobSearchPage = () => {
  const keyword = useSelector(state => state.web.keyword);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [sorting, setSorting] = useState("");
  const [filters, setFilters] = useState({
    categoryId: undefined,
    industryId: undefined,
    jobLevelId: undefined,
    skillId: undefined,
  });
  const featuredCompanies = [
    {
      id: 1,
      name: 'FPT Software',
      logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png',
      jobCount: 50,
      description: 'Leading software engineering company'
    },
    {
      id: 2,
      name: 'Viettel',
      logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png',
      jobCount: 30,
      description: 'Largest telecommunications company'
    },
    {
      id: 3,
      name: 'VNG Corporation',
      logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png',
      jobCount: 25,
      description: 'Top internet technology company'
    }
  ];
  const [jobs, setJobs] = useState([]);

  const sanitizeParams = (params) => {
    const sanitized = {};
    for (const key in params) {
      if (params[key] === undefined) {
        sanitized[key] = "";
      } else {
        sanitized[key] = params[key];
      }
    }
    return sanitized;
  };
  const handleSearch = () => {
    //call API lấy dữ liệu
    const params = {
      keyword,
      page: currentPage - 1,
      limit: pageSize,
      sorting,
      ...filters,
    }
    const sanitizedParams = sanitizeParams(params);
    searchJob(sanitizedParams).then(res => {
      setJobs(res.data?.jobResponses);
      setTotalElements(res.data?.totalElements);
    });
  };

  useEffect(() => {
    handleSearch();
  }, [keyword, filters, sorting, pageSize, currentPage]);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  return (
    <Layout>
      <Content>
        <Row gutter={24}>
          <Col span={18}>
            <BoxContainer>
              <div>
                <FilterPanel onValuesChange={setFilters} />
              </div>
              <div className='sorting'>
                <div className='title'>
                  Sắp xếp theo
                </div>
                <div className='sort-item'>
                  <Select value={sorting}
                    size='large'
                    style={{ width: "200px" }}
                    onChange={(value) => setSorting(value)}
                    placeholder="Sắp xếp theo">
                    <Option value="">Tất cả</Option>
                    <Option value="newest">Ngày đăng (mới nhất)</Option>
                    <Option value="oldest">Ngày đăng (cũ nhất)</Option>
                    <Option value="salary_desc">Lương (cao-thấp)</Option>
                    <Option value="salary_asc">Lương (thấp-cao)</Option>
                  </Select>
                </div>
              </div>
              <List
                split={false}
                itemLayout="vertical"
                size="large"
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalElements,
                  onChange: handlePageChange,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50'],
                }}
                dataSource={jobs}
                renderItem={job => (
                  <List.Item key={job.id}>
                    <JobCardLarge job={job} />
                  </List.Item>
                )}
              />
            </BoxContainer>
          </Col>

          <Col span={6}>
            <Card
              title="Công ty nổi bật trong lĩnh vực"
              style={{
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
              }}
            >
              <Carousel autoplay>
                {featuredCompanies.map((company) => (
                  <div
                    key={company.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: '#f0f4f9',
                      borderRadius: '8px'
                    }}
                  >
                    <img
                      src={company.logo}
                      alt={company.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        marginRight: '16px',
                        objectFit: 'contain',
                        borderRadius: '8px'
                      }}
                    />
                    <div>
                      <h5 style={{ margin: 0 }}>{company.name}</h5>
                      <div style={{ color: '#4D8CFF' }}>
                        {company.jobCount} Open Positions
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default JobSearchPage;