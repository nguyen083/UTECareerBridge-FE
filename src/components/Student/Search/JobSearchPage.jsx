import React, { useState } from 'react';
import { Layout, Row, Col, Card, Tag, Carousel } from 'antd';
import FilterPanel from './FilterPanel';
import JobCard from './JobCard';
import JobSearchBar from './JobSearchBar';
import BoxContainer from '../../Generate/BoxContainer';
import './JobPage.scss';
import { Title } from '@mui/icons-material';
const { Content } = Layout;

const JobSearchPage = () => {
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
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Frontend Developer',
      logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png',
      company: 'ABC Tech',
      location: 'Hồ Chí Minh',
      skills: ['React', 'JavaScript'],
      salary: '1000-2000 USD',
    },
    {
      id: 2,
      title: 'Backend Developer',
      logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png',
      company: 'XYZ Solutions',
      location: 'Hà Nội',
      skills: ['Node.js', 'MongoDB'],
      salary: '1500-2500 USD',
    },
    {
      id: 3,
      title: 'Full-Stack Developer (React + Node.js) with SQL and experience in AWS or GCP, Azure is a plus, 2-3 years experience, 2000-3000 USD',
      company: 'Omega Corp',
      logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png',
      location: 'Đà Nẵng',
      skills: ['React', 'Node.js', 'SQL'],
      salary: '2000-3000 USD',
    },
    {
      id: 4,
      title: 'Data Analyst',
      company: 'Delta Analytics',
      logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png',
      location: 'Hồ Chí Minh',
      skills: ['Python', 'SQL', 'Power BI'],
      salary: '1800-2500 USD',
    },
  ]);

  const handleSearch = (keyword) => {
    const filteredJobs = jobs.filter((job) =>
      job.title.toLowerCase().includes(keyword.toLowerCase())
    );
    setJobs(filteredJobs);
  };

  const handleFilter = (filters) => {
    const filteredJobs = jobs.filter(
      (job) =>
        (filters.location === '' || job.location.includes(filters.location)) &&
        (filters.salary === '' || job.salary === filters.salary) &&
        (filters.skills.length === 0 || filters.skills.every((skill) => job.skills.includes(skill)))
    );
    setJobs(filteredJobs);
  };

  return (
    <Layout>
      <Content>
        <Row gutter={24}>
          <Col span={16}>
            <div>
              <FilterPanel onFilter={handleFilter} /> 
            </div>
            <div className='sorting'>
              <div className='title'>
                Sắp xếp theo
              </div>
              <div className='sort-item'>
                <div className='all'>Tất cả</div>
                <div className='salary'>Lương (cao-thấp)</div>
                <div className='created'>Ngày đăng (mới nhất)</div>
                <div className='oldest'>Ngày đăng (cũ nhất)</div>
              </div>
            </div>
            <Row gutter={16}>
              {jobs.map((job) => (
                <Col key={job.id} span={24}>
                  <JobCard job={job} />
                </Col>
              ))}
            </Row>
          </Col>
          
          <Col span={8}>
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