import { Row, Col, Typography, Divider, Space, Flex, Button } from "antd";
import { useTranslation } from "react-i18next";
import {
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  GithubOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
const { Title, Text, Paragraph } = Typography;

const FooterComponent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <footer className="bg-[#E1EDFC] py-[60px] pb-5 text-[#444] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <div className="w-3/4 px-6 mx-auto ">
        <Row gutter={[48, 32]}>
          {/* Company Information Column */}
          <Col xs={24} sm={24} md={9} lg={9}>
            <div>
              <Title level={3} className="!text-text-color mb-4 font-semibold">
                UTE CareerBridge
              </Title>
              <Paragraph className="mb-6 text-[#444] max-w-[380px]">
                {t("student.layout.footer.footerDescription")}
              </Paragraph>
              <div className="mt-4">
                <Space direction="vertical" size="small">
                  <Flex align="center" gap={12}>
                    <EnvironmentOutlined className="!text-text-color text-lg" />
                    <Text>{t("student.layout.footer.address")}</Text>
                  </Flex>
                  <Flex align="center" gap={12}>
                    <PhoneOutlined className="!text-text-color text-lg" />
                    <Text>(+84) 28 1234 5678</Text>
                  </Flex>
                  <Flex align="center" gap={12}>
                    <MailOutlined className="!text-text-color text-lg" />
                    <Text>support@utecareer.edu.vn</Text>
                  </Flex>
                </Space>
              </div>
            </div>
          </Col>

          {/* Quick Links Column */}
          <Col xs={24} sm={12} md={5} lg={5}>
            <Title level={5} className="!text-text-color mb-4 font-semibold">
              {t("student.layout.footer.aboutUs")}
            </Title>
            <ul className="p-0 m-0 list-none">
              <li className="mb-3">
                <Link
                  to="/about"
                  className="!text-text-color-hover hover:!text-text-color transition-all duration-200 pl-0 hover:pl-2 relative hover:before:content-[''] hover:before:absolute hover:before:left-0 hover:before:top-1/2 hover:before:-translate-y-1/2 hover:before:w-1 hover:before:h-1 hover:before:bg-[#1E4F94] hover:before:rounded-full"
                >
                  {t("student.layout.footer.aboutUteCareerbridge")}
                </Link>
              </li>
              <li className="mb-3">
                <Link
                  to="/terms-of-use"
                  className="!text-text-color-hover hover:!text-text-color transition-all duration-200 pl-0 hover:pl-2 relative hover:before:content-[''] hover:before:absolute hover:before:left-0 hover:before:top-1/2 hover:before:-translate-y-1/2 hover:before:w-1 hover:before:h-1 hover:before:bg-[#1E4F94] hover:before:rounded-full"
                >
                  {t("student.layout.footer.termsOfUse")}
                </Link>
              </li>
              <li className="mb-3">
                <Link
                  to="/privacy-policy"
                  className="!text-text-color-hover hover:!text-text-color transition-all duration-200 pl-0 hover:pl-2 relative hover:before:content-[''] hover:before:absolute hover:before:left-0 hover:before:top-1/2 hover:before:-translate-y-1/2 hover:before:w-1 hover:before:h-1 hover:before:bg-[#1E4F94] hover:before:rounded-full"
                >
                  {t("student.layout.footer.privacyPolicy")}
                </Link>
              </li>
            </ul>
          </Col>
          <Col xs={24} sm={12} md={5} lg={5}>
            <Title level={5} className="!text-text-color mb-4 font-semibold">
              {t("student.layout.footer.forEmployer")}
            </Title>
            <ul className="p-0 m-0 list-none">
              <li className="mb-3">
                <Link
                  to="/employer/post-job"
                  className="!text-text-color-hover hover:!text-text-color transition-all duration-200 pl-0 hover:pl-2 relative hover:before:content-[''] hover:before:absolute hover:before:left-0 hover:before:top-1/2 hover:before:-translate-y-1/2 hover:before:w-1 hover:before:h-1 hover:before:bg-[#1E4F94] hover:before:rounded-full"
                >
                  {t("student.layout.footer.postJob")}
                </Link>
              </li>
              <li className="mb-3">
                <Link
                  to="/employer/list-resumes"
                  className="!text-text-color-hover hover:!text-text-color transition-all duration-200 pl-0 hover:pl-2 relative hover:before:content-[''] hover:before:absolute hover:before:left-0 hover:before:top-1/2 hover:before:-translate-y-1/2 hover:before:w-1 hover:before:h-1 hover:before:bg-[#1E4F94] hover:before:rounded-full"
                >
                  {t("student.layout.footer.searchResume")}
                </Link>
              </li>
            </ul>
          </Col>
          {/* Categories & Newsletter Column */}
          <Col xs={24} sm={12} md={5} lg={5}>
            <div className="flex flex-wrap gap-8">
              <div className="flex-1 basis-[45%] min-w-[120px]">
                <Title
                  level={5}
                  className="!text-text-color mb-4 font-semibold"
                >
                  {t("student.layout.footer.jobsByIndustry")}
                </Title>
                <ul className="gap-4 p-0 m-0 list-none columns-2 sm:columns-1">
                  <li className="mb-3">
                    <Button
                      type="link"
                      onClick={() => {
                        navigate("/search", {
                          state: {
                            filters: {
                              categoryId: 46,
                            },
                          },
                        });
                      }}
                      className="!text-text-color-hover hover:!text-text-color transition-all duration-200 pl-0 hover:pl-2 relative hover:before:content-[''] hover:before:absolute hover:before:left-0 hover:before:top-1/2 hover:before:-translate-y-1/2 hover:before:w-1 hover:before:h-1 hover:before:bg-[#1E4F94] hover:before:rounded-full"
                    >
                      {t("student.layout.footer.accounting")}
                    </Button>
                  </li>
                  <li className="mb-3">
                    <Button
                      type="link"
                      onClick={() => {
                        navigate("/search", {
                          state: {
                            filters: {
                              categoryId: 42,
                            },
                          },
                        });
                      }}
                      className="!text-text-color-hover hover:!text-text-color transition-all duration-200 pl-0 hover:pl-2 relative hover:before:content-[''] hover:before:absolute hover:before:left-0 hover:before:top-1/2 hover:before:-translate-y-1/2 hover:before:w-1 hover:before:h-1 hover:before:bg-[#1E4F94] hover:before:rounded-full"
                    >
                      {t("student.layout.footer.banking")}
                    </Button>
                  </li>
                  <li className="mb-3">
                    <Button
                      type="link"
                      onClick={() => {
                        navigate("/search", {
                          state: {
                            filters: {
                              categoryId: 11,
                            },
                          },
                        });
                      }}
                      className="!text-text-color-hover hover:!text-text-color transition-all duration-200 pl-0 hover:pl-2 relative hover:before:content-[''] hover:before:absolute hover:before:left-0 hover:before:top-1/2 hover:before:-translate-y-1/2 hover:before:w-1 hover:before:h-1 hover:before:bg-[#1E4F94] hover:before:rounded-full"
                    >
                      {t("student.layout.footer.automotiveTechnology")}
                    </Button>
                  </li>
                  <li className="mb-3">
                    <Button
                      type="link"
                      onClick={() => {
                        navigate("/search", {
                          state: {
                            filters: {
                              categoryId: 14,
                            },
                          },
                        });
                      }}
                      className="!text-text-color-hover hover:!text-text-color transition-all duration-200 pl-0 hover:pl-2 relative hover:before:content-[''] hover:before:absolute hover:before:left-0 hover:before:top-1/2 hover:before:-translate-y-1/2 hover:before:w-1 hover:before:h-1 hover:before:bg-[#1E4F94] hover:before:rounded-full"
                    >
                      {t("student.layout.footer.informationTechnology")}
                    </Button>
                  </li>
                  <li className="mb-3">
                    <Button
                      type="link"
                      onClick={() => {
                        navigate("/search", {
                          state: {
                            filters: {
                              categoryId: 51,
                            },
                          },
                        });
                      }}
                      className="!text-text-color-hover hover:!text-text-color transition-all duration-200 pl-0 hover:pl-2 relative hover:before:content-[''] hover:before:absolute hover:before:left-0 hover:before:top-1/2 hover:before:-translate-y-1/2 hover:before:w-1 hover:before:h-1 hover:before:bg-[#1E4F94] hover:before:rounded-full"
                    >
                      {t("student.layout.footer.construction")}
                    </Button>
                  </li>
                  <li className="mb-3">
                    <Link
                      to="/search"
                      className="!text-text-color-hover hover:!text-text-color transition-all duration-200 pl-0 hover:pl-2 relative hover:before:content-[''] hover:before:absolute hover:before:left-0 hover:before:top-1/2 hover:before:-translate-y-1/2 hover:before:w-1 hover:before:h-1 hover:before:bg-[#1E4F94] hover:before:rounded-full"
                    >
                      {t("student.layout.footer.findJob")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>

        <Divider className="bg-[rgba(30,79,148,0.2)] my-8" />

        <div className="flex flex-col flex-wrap items-center justify-between gap-4 md:flex-row">
          <div className="!text-text-color-hover md:text-left text-center">
            <Text>
              Copyright © {new Date().getFullYear()} UTE CAREERBRIDGE. All
              rights reserved.
            </Text>
          </div>
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              className="flex items-center justify-center w-9 h-9 bg-[#1E4F94] rounded-full text-white text-lg transition-all duration-300 hover:bg-[#3a6db5] hover:-translate-y-[3px] hover:shadow-[0_5px_15px_rgba(30,79,148,0.3)]"
            >
              <FacebookOutlined />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              className="flex items-center justify-center w-9 h-9 bg-[#1E4F94] rounded-full text-white text-lg transition-all duration-300 hover:bg-[#3a6db5] hover:-translate-y-[3px] hover:shadow-[0_5px_15px_rgba(30,79,148,0.3)]"
            >
              <TwitterOutlined />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              className="flex items-center justify-center w-9 h-9 bg-[#1E4F94] rounded-full text-white text-lg transition-all duration-300 hover:bg-[#3a6db5] hover:-translate-y-[3px] hover:shadow-[0_5px_15px_rgba(30,79,148,0.3)]"
            >
              <LinkedinOutlined />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              className="flex items-center justify-center w-9 h-9 bg-[#1E4F94] rounded-full text-white text-lg transition-all duration-300 hover:bg-[#3a6db5] hover:-translate-y-[3px] hover:shadow-[0_5px_15px_rgba(30,79,148,0.3)]"
            >
              <InstagramOutlined />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              className="flex items-center justify-center w-9 h-9 bg-[#1E4F94] rounded-full text-white text-lg transition-all duration-300 hover:bg-[#3a6db5] hover:-translate-y-[3px] hover:shadow-[0_5px_15px_rgba(30,79,148,0.3)]"
            >
              <GithubOutlined />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
