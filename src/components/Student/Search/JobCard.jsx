import React from 'react';
import { Card, Typography, Tag, Badge, Row, Col} from 'antd';
import './JobCard.scss';

const { Title, Text } = Typography;

const JobCard = ({ job }) => {
  return (
    <Card className="job-card">
      <Row align="middle" justify="space-between">
        <Col>
          <img 
            className="company-logo"
            alt="Company Logo" 
            src={job.logo} 
          />
        </Col>

        <Col className="job-details">
          <Title level={5} className="job-title">
            <a href={job.url} target="_blank" rel="noopener noreferrer">
              {job.title}
            </a>
          </Title>
          
          {job.isUrgent && <Badge color="orange" text="Urgent" />}
          
          <Text className="company-name">{job.company}</Text>
          <Text className="job-description">{job.description}</Text>
          
          <Tag className="salary-tag" color="blue">{job.salary}</Tag>
        </Col>

        <Col className="save-icon-container">
          <svg 
            className="save-icon"
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none"
          >
          <path
            d="M6.96454 1C3.12884 1 0 4.12884 0 7.96454C0 11.4152 2.67743 14.9244 5.22476 17.7254C7.77209 20.5264 10.3125 22.5715 10.3125 22.5715C10.3202 22.5777 10.328 22.5837 10.3359 22.5895C10.7472 22.9001 11.2632 23.102 11.8233 23.1394C11.8816 23.1499 11.9408 23.1547 12 23.1538C12.0586 23.1546 12.1172 23.1498 12.1749 23.1394C12.1779 23.1388 12.1809 23.1382 12.1839 23.1376C12.7412 23.0989 13.2546 22.8988 13.6641 22.5895C13.672 22.5837 13.6798 22.5777 13.6875 22.5715C13.6875 22.5715 16.2279 20.5264 18.7752 17.7254C21.3226 14.9244 24 11.4152 24 7.96454C24 4.12884 20.8712 1 17.0355 1C14.6225 1 12.9138 2.32789 12 3.26803C11.0862 2.32789 9.3775 1 6.96454 1ZM6.96454 2.84615C9.48566 2.84615 11.0195 4.91611 11.1725 5.13041C11.2506 5.28083 11.3687 5.40684 11.5137 5.49461C11.6587 5.58238 11.8251 5.62854 11.9946 5.62801C12.0018 5.62809 12.009 5.62809 12.0162 5.62801C12.0234 5.62749 12.0307 5.62689 12.0379 5.6262C12.0614 5.6253 12.0848 5.62349 12.1082 5.62079C12.2582 5.60433 12.4019 5.55135 12.5266 5.46649C12.6514 5.38163 12.7535 5.26747 12.8239 5.13401C12.9692 4.93001 14.5072 2.84615 17.0355 2.84615C19.8736 2.84615 22.1538 5.1264 22.1538 7.96454C22.1538 10.3671 19.8459 13.8032 17.4087 16.4832C14.9797 19.1541 12.561 21.105 12.5445 21.1184C12.3824 21.239 12.2022 21.3077 12 21.3077C11.7978 21.3077 11.6176 21.239 11.4555 21.1184C11.439 21.105 9.02034 19.1541 6.59135 16.4832C4.15406 13.8032 1.84615 10.3671 1.84615 7.96454C1.84615 5.1264 4.1264 2.84615 6.96454 2.84615Z"
            fill="#4D8CFF"
          />
       </svg>
        </Col>
      </Row>
    </Card>
  );
}

export default JobCard;
