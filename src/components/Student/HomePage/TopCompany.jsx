import React from 'react';
import './TopCompany.scss';
import { Avatar, Button, Card, Flex, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Title, Text } = Typography;
const { Meta } = Card;
// const companies = [
//   { id: 1, name: 'FPT Software', logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png' },
//   { id: 2, name: 'Viettel', logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1726158406/company/Ng_n_H_ng_Th__ng_M_i_C__Ph_n_Qu_c_T__Vi_t_Nam_logo.png' },
//   { id: 4, name: 'Vietcombank', logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png' },
//   { id: 5, name: 'Vingroup', logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png' }
// ];

const TopCompany = ({ companies }) => {
  const navigate = useNavigate();
  return (
    <div className="top-company pe-none">
      <Title level={2}>Công ty hàng đầu</Title>
      <Flex justify='space-between'>
        {companies.map((company) => (<Card
          className='p-2 card-company box_shadow'
          style={{ width: "fit-content" }}
          hoverable
          cover={
            <div className='text-center'>
              <Avatar
                size={200}
                shape="square"
                src={company?.employerResponse?.companyLogo}
                alt={company?.employerResponse?.companyName}
                loading="lazy"
              />
            </div>
          }
        >
          <Meta title={
            <div className='text-center' style={{ width: 200 }}>
              <span className='company-name'>{company?.employerResponse?.companyName}</span>
            </div>
          } description={
            <div className="text-center">
              <Button className='pe-auto' size='large' onClick={() => {
                navigate(`/company/${company?.employerResponse?.id}`)
              }} type="primary">Xem thêm</Button>
            </div>
          } />

        </Card>))}
      </Flex>
    </div>
  );
};

export default TopCompany;