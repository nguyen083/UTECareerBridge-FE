import {
  Modal,
  Typography,
  Progress,
  Card,
  Row,
  Col,
  Button,
  Tag,
  Tooltip,
  Space,
  List,
  Avatar,
} from "antd";
import {
  CheckCircleOutlined,
  StarOutlined,
  StarFilled,
  EnvironmentOutlined,
  DollarOutlined,
  CalendarOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./AnalysisResultModal.scss";

const { Title, Text } = Typography;

const AnalysisResultModal = ({
  visible,
  onClose,
  matchScore,
  matchedJobs,
  loading,
  handleViewJobDetail,
  handleSaveJob,
}) => {
  const { t } = useTranslation();

  // Format salary range
  const formatSalary = (min, max) => {
    if (!min && !max) return t("job.salaryNegotiable");
    if (!min) return `${t("job.salaryUpTo")} ${max.toLocaleString()}đ`;
    if (!max) return `${t("job.salaryFrom")} ${min.toLocaleString()}đ`;
    return `${min.toLocaleString()}đ - ${max.toLocaleString()}đ`;
  };

  // Format deadline
  const formatDeadline = (deadline) => {
    if (!deadline) return "";
    const now = new Date();
    const date = new Date(deadline);
    const timeDiff = date.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysLeft < 0) {
      return <Text type="danger">{t("job.deadline.expired")}</Text>;
    } else if (daysLeft === 0) {
      return <Text type="warning">{t("job.deadline.today")}</Text>;
    } else if (daysLeft === 1) {
      return <Text type="warning">{t("job.deadline.tomorrow")}</Text>;
    } else if (daysLeft <= 3) {
      return (
        <Text type="warning">
          {daysLeft} {t("job.deadline.daysLeft")}
        </Text>
      );
    } else {
      return (
        <Text>
          {daysLeft} {t("job.deadline.daysLeft")}
        </Text>
      );
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={800}
      className="analysis-result-modal"
      footer={null}
      title={
        <div className="modal-header">
          <img src="/logo.ico" alt="Logo" className="modal-logo" />
          <Title level={4} className="modal-title">
            {t("cvAnalysis.resultTitle")}
          </Title>
        </div>
      }
    >
      <div className="analysis-result-content">
        {loading ? (
          <div className="analysis-loading">
            <div className="svg-background">
              {/* SVG background animation */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid slice"
              >
                {/* SVG animation definitions */}
                <defs>
                  <radialGradient
                    id="Gradient1"
                    cx="50%"
                    cy="50%"
                    fx="0.441602%"
                    fy="50%"
                    r=".5"
                  >
                    <animate
                      attributeName="fx"
                      dur="34s"
                      values="0%;3%;0%"
                      repeatCount="indefinite"
                    ></animate>
                    <stop
                      offset="0%"
                      stopColor="rgba(24, 144, 255, 0.3)"
                    ></stop>
                    <stop
                      offset="100%"
                      stopColor="rgba(24, 144, 255, 0)"
                    ></stop>
                  </radialGradient>
                  <radialGradient
                    id="Gradient2"
                    cx="50%"
                    cy="50%"
                    fx="2.68147%"
                    fy="50%"
                    r=".5"
                  >
                    <animate
                      attributeName="fx"
                      dur="23.5s"
                      values="0%;3%;0%"
                      repeatCount="indefinite"
                    ></animate>
                    <stop offset="0%" stopColor="rgba(82, 196, 26, 0.3)"></stop>
                    <stop offset="100%" stopColor="rgba(82, 196, 26, 0)"></stop>
                  </radialGradient>
                  <radialGradient
                    id="Gradient3"
                    cx="50%"
                    cy="50%"
                    fx="0.836536%"
                    fy="50%"
                    r=".5"
                  >
                    <animate
                      attributeName="fx"
                      dur="21.5s"
                      values="0%;3%;0%"
                      repeatCount="indefinite"
                    ></animate>
                    <stop
                      offset="0%"
                      stopColor="rgba(250, 173, 20, 0.3)"
                    ></stop>
                    <stop
                      offset="100%"
                      stopColor="rgba(250, 173, 20, 0)"
                    ></stop>
                  </radialGradient>
                </defs>
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="url(#Gradient1)"
                >
                  <animate
                    attributeName="x"
                    dur="20s"
                    values="25%;0%;25%"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="y"
                    dur="21s"
                    values="0%;25%;0%"
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="7s"
                    repeatCount="indefinite"
                  />
                </rect>
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="url(#Gradient2)"
                >
                  <animate
                    attributeName="x"
                    dur="23s"
                    values="0%;-25%;0%"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="y"
                    dur="24s"
                    values="25%;-25%;25%"
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="12s"
                    repeatCount="indefinite"
                  />
                </rect>
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="url(#Gradient3)"
                >
                  <animate
                    attributeName="x"
                    dur="25s"
                    values="-25%;0%;-25%"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="y"
                    dur="26s"
                    values="0%;-25%;0%"
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="360 50 50"
                    to="0 50 50"
                    dur="9s"
                    repeatCount="indefinite"
                  />
                </rect>
              </svg>
            </div>
            <div className="loading-text">
              <Title level={4}>{t("cvAnalysis.analyzing")}</Title>
              <Text>{t("cvAnalysis.pleaseWait")}</Text>
            </div>
          </div>
        ) : (
          <>
            <div className="analysis-summary">
              <div className="check-icon">
                <CheckCircleOutlined />
              </div>
              <Title level={4}>{t("cvAnalysis.completed")}</Title>
              <Text>{t("cvAnalysis.matchRateDesc")}</Text>
              <div className="score-display">
                <Progress
                  type="circle"
                  percent={matchScore}
                  strokeColor={
                    matchScore > 80
                      ? "#52c41a"
                      : matchScore > 60
                      ? "#1890ff"
                      : matchScore > 40
                      ? "#faad14"
                      : "#f5222d"
                  }
                  strokeWidth={8}
                  width={120}
                />
                <div className="score-text">
                  <Title level={2}>{matchScore}%</Title>
                  <Text>{t("cvAnalysis.matchRate")}</Text>
                </div>
              </div>
            </div>

            <div className="matched-jobs-section">
              <Title level={4} className="section-title">
                <Trophy className="section-icon" />
                {t("cvAnalysis.matchedJobs")}
              </Title>

              <List
                className="job-list"
                itemLayout="vertical"
                dataSource={matchedJobs || []}
                renderItem={(job) => (
                  <Card className="job-card" hoverable>
                    <div className="job-card-content">
                      <div className="company-logo">
                        <Avatar
                          src={job.companyLogo || "/logo.ico"}
                          size={64}
                          shape="square"
                        />
                        {job.isSaved && <StarFilled className="saved-icon" />}
                      </div>

                      <div className="job-info">
                        <Title level={5} className="job-title">
                          {job.title}
                        </Title>
                        <Text className="company-name">{job.companyName}</Text>

                        <Row gutter={16} className="job-details">
                          <Col xs={24} sm={12}>
                            <Space>
                              <EnvironmentOutlined />
                              <Text>{job.location}</Text>
                            </Space>
                          </Col>
                          <Col xs={24} sm={12}>
                            <Space>
                              <DollarOutlined />
                              <Text>
                                {formatSalary(job.salaryMin, job.salaryMax)}
                              </Text>
                            </Space>
                          </Col>
                          <Col xs={24} sm={12}>
                            <Space>
                              <CalendarOutlined />
                              {formatDeadline(job.deadline)}
                            </Space>
                          </Col>
                          <Col xs={24} sm={12}>
                            <Space>
                              <BookOutlined />
                              <Text>
                                {job.experienceRequired ||
                                  t("job.noExperience")}
                              </Text>
                            </Space>
                          </Col>
                        </Row>

                        <div className="job-tags">
                          {job.skills &&
                            job.skills.map((skill, index) => (
                              <Tag key={index} color="blue">
                                {skill}
                              </Tag>
                            ))}
                        </div>

                        <div className="match-score">
                          <Tooltip
                            destroyTooltipOnHide={true}
                            title={t("cvAnalysis.matchScoreTooltip")}
                          >
                            <Progress
                              percent={job.matchScore || 0}
                              size="small"
                              strokeColor={{
                                "0%": "#108ee9",
                                "100%": "#87d068",
                              }}
                              format={(percent) =>
                                `${percent}% ${t("cvAnalysis.match")}`
                              }
                            />
                          </Tooltip>
                        </div>

                        <div className="job-actions">
                          <Button
                            type="primary"
                            onClick={() => handleViewJobDetail(job.id)}
                          >
                            {t("cvAnalysis.viewDetail")}
                          </Button>
                          <Button
                            icon={
                              job.isSaved ? <StarFilled /> : <StarOutlined />
                            }
                            onClick={() => handleSaveJob(job.id)}
                            className={job.isSaved ? "saved-button" : ""}
                          >
                            {job.isSaved ? t("job.saved") : t("job.save")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

// Trophy icon component
const Trophy = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="currentColor"
  >
    <path d="M18 5V2H6V5H4V6C4 8.8 6.2 11 9 11.2V19.8C8.6 19.9 8.3 20.3 8.3 20.7C8.3 21.1 8.6 21.5 9 21.6C9.1 21.9 9.5 22 9.8 22H14.2C14.6 22 14.9 21.8 14.9 21.5C15.3 21.4 15.6 21 15.6 20.6C15.6 20.2 15.3 19.8 14.9 19.7V11.2C17.7 11 20 8.8 20 6V5H18ZM6 8H5V6H6V8ZM18 8C18 9.8 16.2 11 14.2 11H14C12.8 11 11.8 10.5 11 9.7C10.2 10.3 9.3 11 8 11H7.8C5.8 11 4 9.8 4 8V6H6V9H8C9.2 9 9.9 8.7 10.3 8.3C10.7 7.9 11 7.8 11.2 7.7C11.6 7.6 11.9 7.2 11.9 6.8C11.9 6.4 11.6 6 11.2 5.9C11.9 5 12 4.7 12 4.2V3H13V4.3C13 4.8 13.2 5 13.8 5.9C13.4 6 13.1 6.4 13.1 6.8C13.1 7.2 13.4 7.6 13.8 7.7C13.9 7.7 14.3 7.8 14.7 8.3C15.1 8.8 15.8 9 17 9H19V6H18V8Z" />
  </svg>
);

export default AnalysisResultModal;
