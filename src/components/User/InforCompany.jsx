import BoxContainer from "../Generate/BoxContainer";
import { useEffect, useState } from "react";
import {
  Flex,
  Card,
  Button,
  Typography,
  Spin,
  message,
  Avatar,
  Tabs,
  Tooltip,
  Divider,
  Row,
  Col,
  Tag,
  Descriptions,
} from "antd";
import HtmlContent from "../Generate/HtmlContent";
import { useNavigate, useParams } from "react-router-dom";
import {
  checkFollowCompany,
  followCompany,
  getCompanyById,
  unfollowCompany,
} from "../../services/apiService";
import YouTubeVideo from "../Generate/YouTubeVideo";
import BenefitCard from "../Generate/BenefitComponent";
import JobList from "../Generate/JobList";
import {
  CheckOutlined,
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  LinkOutlined,
  HeartFilled,
  TeamOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { UserPlus } from "lucide-react";
import "./InforCompany.scss";

const { Title, Text, Link } = Typography;

const isEmpty = (array) => {
  return !array || array.length === 0;
};

const InforCompany = () => {
  const user = useSelector((state) => state.user);
  const [company, setCompany] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFollow, setIsFollow] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchData = () => {
    try {
      getCompanyById(id).then((res) => {
        if (res.status === "OK") {
          const company = res.data;
          setCompany({
            companyName: company.companyName,
            companyLogo: company.companyLogo,
            backgroundImage: company.backgroundImage,
            videoIntroduction: company.videoIntroduction,
            companySize: company.companySize,
            industry: company.industry.industryName,
            benefitDetails: company.benefitDetails,
            companyWebsite: company.companyWebsite,
            companyDescription: company.companyDescription,
            companyAddress: company.companyAddress,
            phoneNumber: company.phoneNumber,
            gender: company.gender,
            companyEmail: company.companyEmail,
            firstName: company.firstName,
            lastName: company.lastName,
            countFollower: company.countFollower || 0,
            yearFounded: company.yearFounded,
            countryOrigin: company.countryOrigin,
          });
        }
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 50);
    }
    if (localStorage.getItem("accessToken")) {
      if (user.role === "student") {
        checkFollowCompany(id).then((res) => {
          setIsFollow(res.data);
        });
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [id]);

  const handleFollow = () => {
    try {
      if (localStorage.getItem("accessToken")) {
        if (user.role === "student") {
          followCompany(id).then((res) => {
            if (res.status === "OK") {
              message.success(res.message);
              fetchData();
              setIsFollow(true);
            }
          });
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleUnfollow = () => {
    try {
      unfollowCompany(id).then((res) => {
        if (res.status === "OK") {
          message.success(res.message);
          fetchData();
          setIsFollow(false);
        }
      });
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    const element = document.getElementById(key);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const companyInfo = [
    {
      key: "1",
      label: (
        <span>
          <TeamOutlined style={{ marginRight: 8 }} />
          Quy mô công ty
        </span>
      ),
      children: company.companySize,
    },
    {
      key: "2",
      label: (
        <span>
          <ApartmentOutlined style={{ marginRight: 8 }} />
          Lĩnh vực hoạt động
        </span>
      ),
      children: company.industry,
    },
    {
      key: "3",
      label: (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          Người liên hệ
        </span>
      ),
      children: company.gender
        ? `Chị ${company.firstName} ${company.lastName}`
        : `Anh ${company.firstName} ${company.lastName}`,
    },
    {
      key: "4",
      label: (
        <span>
          <PhoneOutlined style={{ marginRight: 8 }} />
          Số điện thoại
        </span>
      ),
      children: company.phoneNumber,
    },
    {
      key: "5",
      label: (
        <span>
          <MailOutlined style={{ marginRight: 8 }} />
          Email liên hệ
        </span>
      ),
      children: company.companyEmail,
    },
    {
      key: "6",
      label: (
        <span>
          <EnvironmentOutlined style={{ marginRight: 8 }} />
          Địa chỉ công ty
        </span>
      ),
      children: company.companyAddress,
    },
    {
      key: "7",
      label: (
        <span>
          <LinkOutlined style={{ marginRight: 8 }} />
          Website
        </span>
      ),
      children: (
        <Link href={company.companyWebsite} target="_blank">
          {company.companyWebsite}
        </Link>
      ),
    },
  ];

  const tabItems = [
    {
      key: "about",
      label: "Về chúng tôi",
    },
    {
      key: "list-job",
      label: "Vị trí đang tuyển dụng",
    },
  ];

  return (
    <>
      {loading ? (
        <Flex
          align="center"
          justify="center"
          style={{ height: "100vh", width: "100%" }}
        >
          <Spin spinning={loading} size="large" />
        </Flex>
      ) : (
        <div className="company-page">
          <BoxContainer padding="1rem" className="shadow-lg">
            <Card
              style={{
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
              }}
              bodyStyle={{ padding: "0" }}
              bordered={false}
              cover={
                <div className="company-banner">
                  <img
                    src={
                      company.backgroundImage
                        ? company.backgroundImage
                        : "https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages.vietnamworks.com%2Fcompany-assets%2Fimages%2Fbanner-default-company.png&w=1920&q=75"
                    }
                    alt={company.companyName}
                  />
                </div>
              }
            >
              <div style={{ padding: "0 1.5rem 1.5rem" }}>
                <Flex align="end" style={{ marginTop: -60 }} gap="1.5rem">
                  <Avatar
                    size={140}
                    src={
                      company.companyLogo
                        ? company.companyLogo
                        : "https://images.vietnamworks.com/img/company-default-logo.svg"
                    }
                    alt={company.companyName}
                    className="company-logo"
                  />
                  <Flex
                    justify="space-between"
                    align="end"
                    style={{ width: "100%" }}
                  >
                    <div>
                      <Title level={3} className="company-name">
                        {company.companyName}
                      </Title>
                      <div className="follow-count">
                        <HeartFilled className="follow-icon" />
                        <Text>{company.countFollower} lượt theo dõi</Text>
                        {company.industry && (
                          <Tag color="blue" style={{ marginLeft: "8px" }}>
                            {company.industry}
                          </Tag>
                        )}
                      </div>
                    </div>
                    <Tooltip title={isFollow ? "Bỏ theo dõi" : "Theo dõi"}>
                      <Button
                        size="large"
                        onClick={isFollow ? handleUnfollow : handleFollow}
                        type={isFollow ? "default" : "primary"}
                        className={`follow-button ${
                          isFollow ? "following" : ""
                        }`}
                      >
                        {isFollow ? (
                          <>
                            <CheckOutlined style={{ marginRight: 8 }} />
                            Đang theo dõi
                          </>
                        ) : (
                          <>
                            <UserPlus
                              style={{ width: 16, height: 16, marginRight: 8 }}
                            />
                            Theo dõi
                          </>
                        )}
                      </Button>
                    </Tooltip>
                  </Flex>
                </Flex>

                <Tabs
                  activeKey={activeTab}
                  onChange={handleTabChange}
                  items={tabItems}
                  className="custom-anchor"
                  size="large"
                  tabBarStyle={{ fontWeight: 500 }}
                />

                <div id="about">
                  <div className="section-title">Thông tin công ty</div>

                  <div className="mb-4">
                    <Descriptions
                      size="middle"
                      items={companyInfo}
                      column={1}
                    />
                  </div>

                  {company?.companyDescription && (
                    <>
                      <div className="mb-4 text-xl font-semibold">
                        Mô tả chi tiết
                      </div>
                      <div className="company-description">
                        <HtmlContent htmlString={company.companyDescription} />
                      </div>
                    </>
                  )}

                  {company.videoIntroduction && (
                    <>
                      <Divider />
                      <div className="section-title">Video giới thiệu</div>
                      <div className="video-container">
                        <YouTubeVideo link={company.videoIntroduction} />
                      </div>
                    </>
                  )}

                  {!isEmpty(company.benefitDetails) && (
                    <>
                      <Divider />
                      <div className="section-title">Phúc lợi công ty</div>
                      <Row gutter={[16, 16]}>
                        {company.benefitDetails.map((benefit, index) => (
                          <Col xs={24} md={12} lg={8} key={index}>
                            <div className="benefit-card">
                              <BenefitCard
                                benefitName={benefit.benefitName}
                                description={benefit.description}
                                benefitIcon={benefit.benefitIcon}
                                size="large"
                              />
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </>
                  )}
                </div>

                <Divider />

                <div id="list-job">
                  <div className="section-title">Vị trí đang tuyển dụng</div>
                  <JobList />
                </div>
              </div>
            </Card>
          </BoxContainer>
        </div>
      )}
    </>
  );
};
export default InforCompany;
