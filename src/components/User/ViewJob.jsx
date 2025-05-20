import { useEffect, useRef, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Image,
  Typography,
  Flex,
  Carousel,
  Divider,
  Descriptions,
  Spin,
  message,
  Tag,
  Badge,
  Avatar,
} from "antd";
import {
  EnvironmentOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  HeartOutlined,
  HeartFilled,
  BankOutlined,
} from "@ant-design/icons";
import {
  FaCalendarAlt,
  FaInbox,
  FaUserTie,
  FaCubes,
  FaReact,
  FaUsers,
} from "react-icons/fa";
import {
  checkSaveJob,
  getAllCompany,
  getAllJobEmployer,
  getJobById,
  saveJob,
  unSaveJob,
} from "../../services/apiService";
import BoxContainer from "../Generate/BoxContainer";
import HtmlContent from "../Generate/HtmlContent";
import BenefitComponent from "../Generate/BenefitComponent";
import BackgroundIcon from "../Generate/BackgroundIcon";
import { JobCardSmall } from "../Generate/JobCard";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ModalApply } from "../Generate/ModalApply";
import { useSelector } from "react-redux";
import "./ViewJob.scss";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

const { Text, Title } = Typography;
const { Meta } = Card;
const ViewJob = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const ref = useRef();
  const [apply, setApply] = useState(false);
  const [company, setCompany] = useState({});
  const [job, setJob] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [jobSameCompany, setJobSameCompany] = useState([]);
  const navigate = useNavigate();
  const [carouselItems, setCarouselItems] = useState([]);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    id && window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    const status = location.state?.status;

    getJobById(id, status).then((res) => {
      if (res.status === "OK") {
        const job = res.data;
        const company = job.employerResponse;
        setCompany({
          id: company.id,
          companyName: company.companyName,
          companyLogo: company.companyLogo,
          companyAddress: company.companyAddress,
          companySize: company.companySize,
          backgroundImage: company.backgroundImage,
          industryId: company.industry.industryId,
        });
        setJob({
          jobTitle: job.jobTitle,
          jobMinSalary: job.jobMinSalary,
          jobMaxSalary: job.jobMaxSalary,
          jobDeadline: job.jobDeadline,
          jobLocation: job.jobLocation,
          jobDescription: job.jobDescription,
          jobRequirements: job.jobRequirements,
          benefitDetails: company.benefitDetails,
          updatedAt: job.updatedAt,
          jobCategory: job.jobCategory.jobCategoryName,
          industry: company.industry.industryName,
          amount: job.amount,
          jobLevel: job.jobLevel.nameLevel,
          jobCategoryId: job.jobCategory.jobCategoryId,
          jobSkills: job.jobSkills.map((skill) => skill.skillName).join(", "),
        });
      }
      setLoading(false);
    });

    if (user.role === "student") {
      checkSaveJob(id).then((res) => {
        if (res.status === "OK" && res.data !== null) {
          setIsSaved(res.data);
        }
      });
    }
  }, [id]);

  useEffect(() => {
    if (company.id) {
      company.industryId &&
        getAllCompany({ industryId: company.industryId }).then((res) => {
          if (res.status === "OK" && res.data) {
            setCarouselItems(
              res.data?.employerResponses
                .filter((item) => item.id !== company.id)
                .map((item) => ({
                  id: item.id,
                  imgSrc: item.companyLogo,
                  title: item.companyName,
                  description: item.companyDescription,
                }))
            );
          } else {
            setCarouselItems([]);
          }
        });
      getAllJobEmployer(company.id).then((res) => {
        if (res.status === "OK" && res.data) {
          setJobSameCompany(
            res.data.jobResponses.filter((item) => item.jobId !== +id)
          );
        } else {
          setJobSameCompany([]);
        }
      });
    }
  }, [company]);

  useEffect(() => {
    setItems([
      {
        key: "1",
        label: (
          <BackgroundIcon lable={t("employer.job.viewJob.jobLabels.postDate")}>
            <FaCalendarAlt />
          </BackgroundIcon>
        ),
        children: job.updatedAt,
      },
      {
        key: "2",
        label: (
          <BackgroundIcon lable={t("employer.job.viewJob.jobLabels.level")}>
            <FaUserTie />
          </BackgroundIcon>
        ),
        children: <Tag color="blue">{job.jobLevel}</Tag>,
      },
      {
        key: "3",
        label: (
          <BackgroundIcon lable={t("employer.job.viewJob.jobLabels.category")}>
            <FaInbox />
          </BackgroundIcon>
        ),
        children: <Tag color="green">{job.jobCategory}</Tag>,
      },
      {
        key: "4",
        label: (
          <BackgroundIcon lable={t("employer.job.viewJob.jobLabels.skills")}>
            <FaReact />
          </BackgroundIcon>
        ),
        children: (
          <div className="flex flex-wrap gap-2">
            {job.jobSkills?.split(",").map((skill, index) => (
              <Tag key={index} color="purple" style={{ margin: "2px" }}>
                {skill.trim()}
              </Tag>
            ))}
          </div>
        ),
      },
      {
        key: "5",
        label: (
          <BackgroundIcon lable={t("employer.job.viewJob.jobLabels.industry")}>
            <FaCubes />
          </BackgroundIcon>
        ),
        children: <Tag color="orange">{job.industry}</Tag>,
      },
      {
        key: "6",
        label: (
          <BackgroundIcon
            lable={t("employer.job.viewJob.jobLabels.recruitmentCount")}
          >
            <FaUsers />
          </BackgroundIcon>
        ),
        children: (
          <Badge count={job.amount} style={{ backgroundColor: "#52c41a" }} />
        ),
      },
    ]);
  }, [job, t]);

  const handleSave = () => {
    if (localStorage.getItem("accessToken")) {
      if (user.role === "student") {
        if (isSaved) {
          unSaveJob(id).then((res) => {
            if (res.status === "OK") {
              message.success(res.message);
              setIsSaved(false);
            }
          });
        } else {
          saveJob(id).then((res) => {
            if (res.status === "OK") {
              message.success(res.message);
              setIsSaved(true);
            }
          });
        }
      }
    } else {
      navigate("/login");
    }
  };

  const handleToCompany = (id) => {
    navigate("/company/" + id);
  };

  useEffect(() => {
    if (notice != null) {
      if (notice?.status === "OK") {
        message.success(t("employer.job.viewJob.applySuccess"));
        setNotice(null);
      } else {
        message.error(t("employer.job.viewJob.alreadyApplied"));
        setNotice(null);
      }
    }
  }, [notice, t]);

  const isDeadlineSoon = () => {
    if (!job.jobDeadline) return false;
    const parts = job.jobDeadline.split("/");
    if (parts.length !== 3) return false;

    const deadline = new Date(parts[2], parts[1] - 1, parts[0]);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 && diffDays <= 7;
  };

  const renderDeadline = () => (
    <Flex align="center" className="deadline-info">
      <ClockCircleOutlined className="icon-small" />
      <Text>
        {t("employer.job.viewJob.deadline")}{" "}
        <Text strong>{job.jobDeadline}</Text>
        {isDeadlineSoon() && (
          <Tag color="orange" style={{ marginLeft: 8 }}>
            {t("employer.job.viewJob.deadlineSoon")}
          </Tag>
        )}
      </Text>
    </Flex>
  );

  return (
    <div className="view-job-container">
      <Flex
        align="center"
        justify="center"
        style={{ height: "100vh", width: "100%" }}
        hidden={!loading}
      >
        <Spin spinning={loading} size="large" />
      </Flex>

      <div hidden={loading} className="job-detail-container animate-fade-in">
        <Row gutter={[16, 16]}>
          {/* Cột trái - Main content */}
          <Col xs={24} md={16} lg={18}>
            <Flex vertical gap={16}>
              <BoxContainer className="shadow" padding="1.25rem">
                <Flex vertical gap="1.5rem">
                  <BoxContainer className="job-header" background="#F8F9FA">
                    <div className="job-title-wrapper">
                      <Title level={4} className="job-title-text">
                        {job.jobTitle}
                      </Title>
                      <Badge.Ribbon
                        text="Hot"
                        color="red"
                        style={{ display: isDeadlineSoon() ? "block" : "none" }}
                      />
                    </div>

                    <div className="salary">
                      {job?.jobMinSalary?.toLocaleString("vi-VN")} -{" "}
                      {job?.jobMaxSalary?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </div>

                    <Flex wrap="wrap" gap={16} className="job-meta">
                      {renderDeadline()}
                      <Divider type="vertical" style={{ height: "auto" }} />
                      <Flex align="center">
                        <EnvironmentOutlined className="icon-small" />
                        <Text>{job.jobLocation}</Text>
                      </Flex>
                    </Flex>

                    <Row gutter={16} style={{ marginTop: 20 }}>
                      <Col xs={24} md={18}>
                        <Button
                          type="primary"
                          size="large"
                          onClick={() => {
                            user.role === "student"
                              ? setApply(true)
                              : navigate("/login");
                          }}
                          className="w-full"
                        >
                          {t("employer.job.viewJob.applyButton")}
                        </Button>
                      </Col>
                      <Col xs={24} md={6}>
                        <Button
                          onClick={handleSave}
                          type="default"
                          className={clsx("w-full", "text-text-color")}
                          size="large"
                        >
                          {isSaved ? <HeartFilled /> : <HeartOutlined />}{" "}
                          {isSaved
                            ? t("job.save.saved")
                            : t("job.save.saveJob")}
                        </Button>
                      </Col>
                    </Row>
                  </BoxContainer>

                  <Flex vertical gap="1.5rem" className="job-section">
                    <div className="title2">
                      {t("employer.job.viewJob.jobDescription")}
                    </div>

                    <div className="px-3 py-1 content-block">
                      <HtmlContent htmlString={job.jobDescription} />
                    </div>
                  </Flex>

                  <Flex vertical gap="1.5rem" className="job-section">
                    <div className="title2">
                      {t("employer.job.viewJob.jobRequirements")}
                    </div>
                    <div className="px-3 py-1 content-block">
                      <HtmlContent htmlString={job.jobRequirements} />
                    </div>
                  </Flex>

                  {job?.benefitDetails?.length !== 0 && (
                    <Flex
                      vertical
                      gap="1.5rem"
                      className="job-section benefits-section"
                    >
                      <div className="title2">
                        {t("employer.job.viewJob.benefits")}
                      </div>
                      <Flex vertical gap={12} className="benefits-list">
                        {job?.benefitDetails?.map((benefit) => (
                          <BenefitComponent
                            key={benefit.benefitId}
                            benefitName={benefit.benefitName}
                            description={benefit.description}
                            benefitIcon={benefit.benefitIcon}
                          />
                        ))}
                      </Flex>
                    </Flex>
                  )}

                  <Flex vertical gap="1.5rem" className="job-section">
                    <div className="title2">
                      {t("employer.job.viewJob.workInfo")}
                    </div>
                    <Descriptions
                      items={items}
                      contentStyle={{ paddingLeft: 27 }}
                      column={{ xs: 1, sm: 2 }}
                      layout="vertical"
                      size="middle"
                      className="job-details-table"
                    />
                  </Flex>

                  <Flex vertical gap={12}>
                    {jobSameCompany && jobSameCompany.length > 0 && (
                      <Card
                        className="shadow related-jobs-card"
                        title={
                          <div className="card-title">
                            {t("employer.job.viewJob.sameCompanyJobs")}
                          </div>
                        }
                      >
                        <div className="related-jobs-list">
                          {jobSameCompany.slice(0, 5).map((job) => (
                            <JobCardSmall key={job.jobId} job={job} />
                          ))}
                        </div>
                      </Card>
                    )}
                  </Flex>
                </Flex>
              </BoxContainer>
            </Flex>
          </Col>

          {/* Cột phải - Sidebar */}
          <Col xs={24} md={8} lg={6}>
            <Row gutter={[0, 16]}>
              <Badge.Ribbon
                text={t("employer.job.viewJob.verified")}
                color="#52c41a"
                style={{ fontSize: "14px", fontWeight: "500" }}
              >
                <Card
                  className="shadow company-card"
                  style={{ width: "100%" }}
                  cover={
                    <div
                      className="company-header"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), url(${
                          company.backgroundImage ||
                          "https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages.vietnamworks.com%2Fcompany-assets%2Fimages%2Fbanner-default-company.png&w=1920&q=75"
                        })`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        height: "140px",
                        position: "relative",
                      }}
                    ></div>
                  }
                  bodyStyle={{
                    padding: "0px",
                    paddingTop: "45px",
                    position: "relative",
                  }}
                >
                  {/* Logo công ty nằm giữa ảnh bìa và bên dưới */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-45px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 2,
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: "90px",
                        height: "90px",
                        borderRadius: "10px",
                        background: "white",
                        padding: "8px",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        preview={false}
                        src={
                          company.companyLogo ||
                          "https://images.vietnamworks.com/img/company-default-logo.svg"
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>

                  <Flex
                    align="center"
                    vertical
                    className="company-profile-section"
                  >
                    <div className="company-name-container">
                      <Text
                        onClick={() => handleToCompany(company.id)}
                        strong
                        className="company-name"
                        style={{
                          fontSize: "20px",
                          margin: "0px 0 10px",
                          display: "block",
                          textAlign: "center",
                        }}
                      >
                        {company.companyName}
                      </Text>
                    </div>

                    <Divider style={{ margin: "8px 0 16px" }} />

                    <div
                      className="company-meta"
                      style={{ width: "100%", padding: "0 20px" }}
                    >
                      <Flex
                        align="center"
                        gap={14}
                        className="meta-item"
                        style={{ marginBottom: "15px" }}
                      >
                        <div
                          className="icon-wrapper"
                          style={{
                            backgroundColor: "rgba(24, 144, 255, 0.1)",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <EnvironmentOutlined
                            className="meta-icon"
                            style={{ fontSize: "20px", color: "#1890ff" }}
                          />
                        </div>
                        <div>
                          <Text
                            strong
                            style={{ display: "block", fontSize: "14px" }}
                          >
                            {t("employer.job.viewJob.address")}
                          </Text>
                          <Text
                            className="meta-text"
                            style={{ fontSize: "14px" }}
                          >
                            {company.companyAddress}
                          </Text>
                        </div>
                      </Flex>

                      <Flex
                        align="center"
                        gap={14}
                        className="meta-item"
                        style={{ marginBottom: "15px" }}
                      >
                        <div
                          className="icon-wrapper"
                          style={{
                            backgroundColor: "rgba(82, 196, 26, 0.1)",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <TeamOutlined
                            className="meta-icon"
                            style={{ fontSize: "20px", color: "#52c41a" }}
                          />
                        </div>
                        <div>
                          <Text
                            strong
                            style={{ display: "block", fontSize: "14px" }}
                          >
                            {t("employer.job.viewJob.companySize")}
                          </Text>
                          <Text
                            className="meta-text"
                            style={{ fontSize: "14px" }}
                          >
                            {company.companySize}{" "}
                            {t("employer.job.viewJob.employees")}
                          </Text>
                        </div>
                      </Flex>

                      <Flex
                        align="center"
                        gap={14}
                        className="meta-item"
                        style={{ marginBottom: "15px" }}
                      >
                        <div
                          className="icon-wrapper"
                          style={{
                            backgroundColor: "rgba(250, 140, 22, 0.1)",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <BankOutlined
                            className="meta-icon"
                            style={{ fontSize: "20px", color: "#fa8c16" }}
                          />
                        </div>
                        <div>
                          <Text
                            strong
                            style={{ display: "block", fontSize: "14px" }}
                          >
                            {t("employer.job.viewJob.field")}
                          </Text>
                          <Text
                            className="meta-text"
                            style={{ fontSize: "14px" }}
                          >
                            {job.industry}
                          </Text>
                        </div>
                      </Flex>
                    </div>

                    <div style={{ width: "100%", padding: "0 20px 20px" }}>
                      <Button
                        type="primary"
                        onClick={() => handleToCompany(company.id)}
                        className="view-company-btn"
                        style={{
                          width: "100%",
                          height: "44px",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(24, 144, 255, 0.15)",
                          marginTop: "10px",
                        }}
                        icon={<BankOutlined />}
                      >
                        {t("employer.job.viewJob.viewCompanyDetails")}
                      </Button>
                    </div>
                  </Flex>
                </Card>
              </Badge.Ribbon>

              {carouselItems.length > 0 && (
                <Card
                  className="shadow related-companies-card"
                  title={
                    <div className="card-title">
                      {t("employer.job.viewJob.relatedCompanies")}
                    </div>
                  }
                  style={{ width: "100%" }}
                >
                  <Carousel
                    autoplay
                    autoplaySpeed={3000}
                    dots={true}
                    arrows
                    pauseOnHover={true}
                    draggable={true}
                    ref={ref}
                    className="companies-carousel"
                  >
                    {carouselItems.map((item, index) => (
                      <Card
                        key={index}
                        className="card-company"
                        style={{ width: "fit-content" }}
                        hoverable
                        cover={
                          <div className="text-center">
                            <Avatar
                              size={200}
                              shape="square"
                              src={item.imgSrc}
                              alt={item.title}
                              loading="lazy"
                            />
                          </div>
                        }
                      >
                        <Meta
                          title={
                            <div
                              className="text-center"
                              style={{ width: "100%" }}
                            >
                              <span className="company-name">{item.title}</span>
                            </div>
                          }
                          description={
                            <div className="text-center">
                              <Button
                                size="large"
                                onClick={() => navigate("/company/" + item.id)}
                                type="primary"
                              >
                                {t("employer.job.viewJob.viewMore")}
                              </Button>
                            </div>
                          }
                        />
                      </Card>
                    ))}
                  </Carousel>
                </Card>
              )}
            </Row>
          </Col>
        </Row>
      </div>
      <ModalApply
        show={apply}
        setShow={setApply}
        company={company}
        job={job}
        key={id}
        setNotice={setNotice}
      />
    </div>
  );
};

export default ViewJob;
