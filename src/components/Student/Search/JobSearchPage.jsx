import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Card, Tag, Carousel, Select, List, Pagination, Radio, Flex, Empty } from 'antd';
import FilterPanel from './FilterPanel';
import BoxContainer from '../../Generate/BoxContainer';
import './JobPage.scss';
import { useSelector } from 'react-redux';
import { searchJob } from '../../../services/apiService';
import { JobCardLarge } from '../../Generate/JobCard';
import CarouselTopCompnay from './CarouselTopCompnay';
import { useLocation } from 'react-router-dom';
const { Content } = Layout;
const JobSearchPage = () => {
  const keyword = useSelector(state => state.web.keyword);
  const location = useLocation();

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
    window.scrollTo(0, 0);
    if (location.state?.filters?.jobStatus === 'newest') {
      setSorting('newest');
    }
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
                <FilterPanel onValuesChange={setFilters} filters={location.state?.filters} />
              </div>
              <div className='sorting'>
                <div className='title'>
                  Sắp xếp theo
                </div>
                <div className='sort-item'>
                  <Radio.Group size='large' value={sorting} onChange={(e) => setSorting(e.target.value)}>
                    <Flex gap={10} >

                      <div className='div-radio'><Radio.Button className='radio' value="">Tất cả</Radio.Button></div>
                      <div className='div-radio'><Radio.Button className='radio' value="newest">Ngày đăng (mới nhất)</Radio.Button></div>
                      <div className='div-radio'><Radio.Button className='radio' value="oldest">Ngày đăng (cũ nhất)</Radio.Button></div>
                      <div className='div-radio'><Radio.Button className='radio' value="salary_desc">Lương (cao-thấp)</Radio.Button></div>
                      <div className='div-radio'><Radio.Button className='radio' value="salary_asc">Lương (thấp-cao)</Radio.Button></div>
                    </Flex>
                  </Radio.Group>

                </div>
              </div>
              <List
                split={false}
                itemLayout="vertical"
                size="large"
                locale={{ emptyText: <Empty description="Không tìm thấy việc làm nào" /> }}
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
            <CarouselTopCompnay />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default JobSearchPage;