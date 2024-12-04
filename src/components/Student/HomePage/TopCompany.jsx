import React from 'react';
import './TopCompany.scss';

const companies = [
  { id: 1, name: 'FPT Software', logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png' },
  { id: 2, name: 'Viettel', logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1726158406/company/Ng_n_H_ng_Th__ng_M_i_C__Ph_n_Qu_c_T__Vi_t_Nam_logo.png' },
  { id: 4, name: 'Vietcombank', logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png' },
  { id: 5, name: 'Vingroup', logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png' }
];

const TopCompany = () => {
  return (
    <div className="top-company">
      <h2>Công ty hàng đầu</h2>
      <div className="top-company__row">
        {companies.map((company) => (
          <div className="top-company__item" key={company.id}>
            <img 
              src={company.logo} 
              alt={company.name} 
              className="top-company__logo" 
              loading="lazy"
            />
            <div className="top-company__name">{company.name}</div>
            <div className="tag-name">
                VIỆC MỚI
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCompany;