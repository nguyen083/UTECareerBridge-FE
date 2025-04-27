import BoxContainer from "../Generate/BoxContainer";
import { useEffect, useState } from "react";
import {
  Flex,
  Card,
  Button,
  Typography,
  Anchor,
  Descriptions,
  Spin,
  message,
  Avatar,
  Tooltip,
  Tag,
  Row,
  Col,
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
  EnvironmentOutlined, 
  GlobalOutlined, 
  PhoneOutlined, 
  TeamOutlined, 
  UserOutlined, 
  MailOutlined,
  BankOutlined,
  BuildOutlined,
  HomeOutlined,
  FireOutlined,
  InfoCircleOutlined,
  VideoCameraOutlined,
  GiftOutlined
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
  
  return (
    <>
      <Flex
        align="center"
        justify="center"
        style={{ height: "100vh", width: "100%" }}
        hidden={!loading}
      >
        <Spin spinning={loading} size="large" />
      </Flex>
      
      <BoxContainer padding="1rem" hidden={loading} className="shadow-lg company-profile">
        <Card
          className="card-container"
          cover={
            <div className="company-header">
              <img
                className="header-image"
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
          {/* Phần header với logo và thông tin công ty - sử dụng container mới */}
          <div className="company-info-container">
            <Row gutter={16} align="bottom" style={{ width: '100%' }}>
              <Col>
                <Tooltip title="Logo công ty" placement="bottom">
                  <Avatar
                    className="company-logo"
                    size={120}
                    src={
                      company.companyLogo
                        ? company.companyLogo
                        : "https://images.vietnamworks.com/img/company-default-logo.svg"
                    }
                  />
                </Tooltip>
              </Col>
              <Col flex="1">
                <div className="company-info">
                  <Title level={4} className="company-name">{company.companyName}</Title>
                  <Flex align="center" gap={8}>
                    <Text className="company-followers">
                      <span className="follower-count">{company.countFollower}</span> lượt theo dõi
                    </Text>
                    <Tag color="blue" className="industry-tag">
                      <BankOutlined className="tag-icon" /> {company.industry}
                    </Tag>
                  </Flex>
                </div>
              </Col>
              <Col className="follow-button-container">
                <Tooltip title={isFollow ? "Hủy theo dõi" : "Theo dõi công ty"}>
                  <Button
                    size="large"
                    onClick={isFollow ? handleUnfollow : handleFollow}
                    type={isFollow ? "default" : "primary"}
                    className={`follow-button ${isFollow ? 'followed' : ''}`}
                  >
                    {isFollow ? (
                      <>
                        <CheckOutlined className="icon" />
                        Đang theo dõi
                      </>
                    ) : (
                      <>
                        <UserPlus className="icon" />
                        Theo dõi
                      </>
                    )}
                  </Button>
                </Tooltip>
              </Col>
            </Row>
          </div>

          <Flex gap={"1rem"} vertical style={{ padding: '0 24px' }}>
            <Anchor
              targetOffset={60}
              style={{ backgroundColor: "white" }}
              className="custom-anchor"
              direction="horizontal"
              items={[
                {
                  key: "about",
                  href: "#about",
                  title: <><InfoCircleOutlined className="anchor-icon" /> <Text className="text-lg">Về chúng tôi</Text></>,
                },
                {
                  key: "list-job",
                  href: "#list-job",
                  title: (
                    <><FireOutlined className="anchor-icon" /> <Text className="text-lg">Vị trí đang tuyển dụng</Text></>
                  ),
                },
              ]}
            />
            
            <Flex gap={"1rem"} vertical>
              <div id="about">
                <BoxContainer padding="1rem" className="section-title">
                  <Text className="title1">Về chúng tôi</Text>
                </BoxContainer>
                
                <div className="descriptions-container">
                  <Descriptions
                    labelStyle={{ fontWeight: 550, color: "black" }}
                    size="middle"
                    items={[
                      {
                        key: "1",
                        label: <><TeamOutlined /> Quy mô</>,
                        children: <Tag color="purple">{company.companySize}</Tag>,
                      },
                      {
                        key: "2",
                        label: <><BankOutlined /> Lĩnh vực</>,
                        children: <Tag color="blue">{company.industry}</Tag>,
                      },
                      {
                        key: "3",
                        label: <><UserOutlined /> Liên hệ</>,
                        children: company.gender
                          ? "Chị "
                          : "Anh " + company.firstName + " " + company.lastName,
                      },
                      {
                        key: "4",
                        label: <><PhoneOutlined /> Số điện thoại</>,
                        children: <a href={`tel:${company.phoneNumber}`}>{company.phoneNumber}</a>,
                      },
                      {
                        key: "5",
                        label: <><MailOutlined /> Email</>,
                        children: <a href={`mailto:${company.companyEmail}`}>{company.companyEmail}</a>,
                      },
                      {
                        key: "6",
                        label: <><EnvironmentOutlined /> Địa chỉ</>,
                        children: (
                          <Flex align="center" gap={8}>
                            <span>{company.companyAddress}</span>
                            <Tooltip title="Xem trên bản đồ">
                              <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.companyAddress)}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="map-link"
                              >
                                <HomeOutlined />
                              </a>
                            </Tooltip>
                          </Flex>
                        ),
                      },
                      {
                        key: "7",
                        label: <><GlobalOutlined /> Website</>,
                        children: (
                          <Link href={company.companyWebsite} target="_blank">
                            {company.companyWebsite}
                          </Link>
                        ),
                      },
                    ]}
                    column={1}
                  />
                  
                  {company?.companyDescription && (
                    <Flex vertical gap="16px" className="mt-4 company-description">
                      <Title level={5} style={{ marginBottom: 8, color: '#1E4F94' }}>
                        <BuildOutlined /> Mô tả chi tiết
                      </Title>
                      <div className="description-content">
                        <HtmlContent htmlString={company?.companyDescription} />
                      </div>
                    </Flex>
                  )}
                </div>
                
                <Flex gap={"1rem"} vertical>
                  {company.videoIntroduction && (
                    <>
                      <BoxContainer padding="1rem" className="section-title">
                        <Text className="title1"><VideoCameraOutlined /> Video giới thiệu</Text>
                      </BoxContainer>
                      <div className="video-container">
                        <YouTubeVideo link={company.videoIntroduction} />
                      </div>
                    </>
                  )}
                  
                  {!isEmpty(company.benefitDetails) && (
                    <Flex gap={"1rem"} vertical>
                      <BoxContainer padding="1rem" className="section-title">
                        <Text className="title1"><GiftOutlined /> Phúc lợi</Text>
                      </BoxContainer>
                      
                      <Flex gap="16px" vertical className="benefits-container">
                        {company.benefitDetails.map((benefit, index) => (
                          <div key={index} className="benefit-card">
                            <BenefitCard
                              benefitName={benefit.benefitName}
                              description={benefit.description}
                              benefitIcon={benefit.benefitIcon}
                              size="large"
                            />
                          </div>
                        ))}
                      </Flex>
                    </Flex>
                  )}
                </Flex>
              </div>
              
              <div id="list-job" className="job-list-section">
                <BoxContainer padding="1rem" className="section-title">
                  <Text className="title1"><FireOutlined /> Vị trí đang tuyển dụng</Text>
                </BoxContainer>
                <JobList />
              </div>
            </Flex>
          </Flex>
        </Card>
      </BoxContainer>
    </>
  );
};

export default InforCompany;
