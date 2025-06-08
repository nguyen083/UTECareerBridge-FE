import { useNavigate, useSearchParams } from "react-router-dom";
import { useCompany } from "../../../composables/company";
import { Card, Pagination, Spin, Empty, Typography, Tag, Divider } from "antd";
import { FaBuilding, FaGlobe, FaPhone, FaUsers } from "react-icons/fa";
import BoxContainer from "../BoxContainer";
import { useTranslation } from "react-i18next";

const { Title, Paragraph } = Typography;

const CompanyList = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    limit: "8",
  });

  const navigate = useNavigate();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "8");

  const { data, isLoading, error } = useCompany(page, limit);

  const companies = data?.data?.employerResponses || [];
  const totalPages = data?.data?.totalPages || 0;

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Empty
          description={<span>{t("employer.company.list.errorLoading")}</span>}
        />
      </div>
    );
  }

  return (
    <div className="py-8 mx-auto">
      <BoxContainer title={t("employer.company.list.title")}>
        <span className="m-0 title1">{t("employer.company.list.title")}</span>
        <Divider />
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Spin size="large" tip={t("employer.company.list.loading")} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {companies.map((company) => (
                <Card
                  onClick={() => navigate(`/company/${company.id}`)}
                  key={company.id}
                  hoverable
                  className="overflow-hidden transition-all shadow-md hover:shadow-lg"
                  cover={
                    <div className="relative">
                      <div
                        className="h-32 bg-center bg-cover"
                        style={{
                          backgroundImage: `url(${
                            company.backgroundImage ||
                            "https://via.placeholder.com/400x150?text=No+Background"
                          })`,
                        }}
                      />
                      <div className="absolute w-16 h-16 overflow-hidden bg-white border-4 border-white rounded-full -bottom-8 left-4">
                        <img
                          src={
                            company.companyLogo ||
                            "https://via.placeholder.com/80?text=Logo"
                          }
                          alt={company.companyName}
                          className="object-contain w-full h-full "
                        />
                      </div>
                    </div>
                  }
                >
                  <div className="pt-4">
                    <Title
                      level={5}
                      className="mt-2 mb-2 !text-text-color line-clamp-2"
                      title={company.companyName}
                    >
                      {company.companyName}
                    </Title>
                    <div className="flex items-center mb-2 text-gray-500">
                      <FaBuilding className="flex-shrink-0 w-4 h-4 mr-1" />
                      <Paragraph
                        className="!mb-0 line-clamp-2 text-gray-500 !text-sm"
                        title={company.companyAddress}
                      >
                        {company.companyAddress ||
                          t("employer.company.list.noAddress")}
                      </Paragraph>
                    </div>
                    <div className="flex items-center mb-2 text-gray-500">
                      <FaUsers className="flex-shrink-0 w-4 h-4 mr-1" />
                      <span>
                        {company.companySize || "0"}{" "}
                        {t("employer.company.list.employees")}
                      </span>
                    </div>
                    <div className="flex items-center mb-2 text-gray-500">
                      <FaPhone className="flex-shrink-0 w-4 h-4 mr-1" />
                      <span className="!text-sm">
                        {company.phoneNumber ||
                          t("employer.company.list.noPhone")}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <FaGlobe className="flex-shrink-0 w-4 h-4 mr-1" />
                      <a
                        href={company.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="!text-sm text-text-color truncate hover:underline"
                      >
                        {company.companyWebsite ||
                          t("employer.company.list.noWebsite")}
                      </a>
                    </div>
                    <div className="mt-4">
                      <Tag className="w-fit !text-xs" color="blue">
                        {company.industry?.industryName ||
                          t("employer.company.list.noCategory")}
                      </Tag>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-end mt-8">
              <Pagination
                current={page}
                pageSize={limit}
                total={totalPages * limit}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </BoxContainer>
    </div>
  );
};

export default CompanyList;
