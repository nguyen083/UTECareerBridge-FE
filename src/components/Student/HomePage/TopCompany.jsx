import "./TopCompany.scss";
import { Avatar, Button, Card, Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const { Title } = Typography;
const { Meta } = Card;
// const companies = [
//   { id: 1, name: 'FPT Software', logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png' },
//   { id: 2, name: 'Viettel', logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1726158406/company/Ng_n_H_ng_Th__ng_M_i_C__Ph_n_Qu_c_T__Vi_t_Nam_logo.png' },
//   { id: 4, name: 'Vietcombank', logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png' },
//   { id: 5, name: 'Vingroup', logo: 'https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png' }
// ];

const TopCompany = ({ companies }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="top-company">
      <Title level={2}>{t("top_companies")}</Title>
      <Flex justify="space-between">
        {companies.map((company) => (
          <Card
            key={company?.employerResponse?.id}
            onClick={() => {
              navigate(`/company/${company?.employerResponse?.id}`);
            }}
            className="p-2 shadow card-company w-fit"
            hoverable
            cover={
              <div className="text-center">
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
            <Meta
              title={
                <div className="text-center" style={{ width: 200 }}>
                  <span className="company-name">
                    {company?.employerResponse?.companyName}
                  </span>
                </div>
              }
              description={
                <div className="text-center">
                  <Button
                    className="cursor-pointer"
                    size="large"
                    type="primary"
                  >
                    {t("common.seeMore")}
                  </Button>
                </div>
              }
            />
          </Card>
        ))}
      </Flex>
    </div>
  );
};

export default TopCompany;
