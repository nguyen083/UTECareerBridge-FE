import {
  Alert,
  List,
  Typography,
  Card,
  Flex,
  Space,
  Spin,
  Empty,
  Badge,
  Statistic,
  Skeleton,
} from "antd";
import { JobCardLargeApplicant } from "../../Generate/JobCard";
import { useEffect, useState } from "react";
import { getJobsByStatus } from "../../../services/apiService";
import { useTranslation } from "react-i18next";
import ListApplicantDrawer from "./ListApplicantDrawer";
import { ProfileOutlined } from "@ant-design/icons";
import "./ListJob.scss";
import dayjs from "dayjs";

const { Text, Title, Paragraph } = Typography;

const ListJob = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const params = {
      jobStatus: "ACTIVE",
      page: currentPage - 1,
      limit: pageSize,
    };

    try {
      const res = await getJobsByStatus(params);
      if (res.status === "OK" && res.data.jobResponses) {
        setData(res.data.jobResponses);
        setTotalRecords(res.data.totalElements);
      } else {
        setData([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const renderStatusBadge = (date) => {
    const status = dayjs(date, "DD/MM/YYYY").isAfter(dayjs())
      ? "ACTIVE"
      : "EXPIRED";
    switch (status) {
      case "ACTIVE":
        return (
          <Badge
            status="success"
            text={
              <Text strong>
                {t("employer.applicant.listJob.status.active")}
              </Text>
            }
          />
        );
      case "EXPIRED":
        return (
          <Badge
            status="error"
            text={
              <Text strong>
                {t("employer.applicant.listJob.status.expired")}
              </Text>
            }
          />
        );
      default:
        return <Badge status="default" text={status} />;
    }
  };

  // Đoạn mã tạo các skeleton khi đang tải
  const renderSkeletons = () => {
    return Array(3)
      .fill()
      .map((_, index) => (
        <List.Item key={index} className="job-list-item">
          <div style={{ width: "100%" }}>
            <Card bordered={false} className="job-card skeleton-card">
              <Flex align="center" gap={16}>
                <Skeleton.Image
                  active
                  style={{ width: 80, height: 80, borderRadius: 8 }}
                />
                <div style={{ width: "100%" }}>
                  <Skeleton active paragraph={{ rows: 3 }} />
                </div>
              </Flex>
            </Card>
          </div>
        </List.Item>
      ));
  };

  return (
    <div className="list-job-container">
      <Flex vertical gap={16} className="page-content-wrapper">
        <div className="section-fade-in header-section">
          <Card className="header-card">
            <Flex justify="space-between" align="center">
              <Title level={3} className="page-title">
                {t("employer.applicant.listJob.title")}
              </Title>

              <Space size="large" className="stats-container">
                <Statistic
                  title={
                    <Text strong>
                      {t("employer.applicant.listJob.totalJob")}
                    </Text>
                  }
                  value={totalRecords}
                  valueStyle={{ color: "#1890ff", fontWeight: 600 }}
                  prefix={<ProfileOutlined className="statistic-icon" />}
                  className="statistic-item"
                />
              </Space>
            </Flex>
          </Card>
        </div>

        <div className="section-fade-in notice-section">
          <Alert
            message={
              <Text className="notice-title" strong>
                {t("common.notice")}
              </Text>
            }
            type="info"
            showIcon
            closable
            description={
              <Paragraph className="notice-content">
                {t("employer.applicant.listJob.notice")}
                <br />
                <Text type="secondary" className="notice-tip">
                  {t("employer.applicant.listJob.clickJob")}
                </Text>
              </Paragraph>
            }
            className="notice-alert"
          />
        </div>

        <div className="section-fade-in list-section">
          <Card
            title={
              <Text className="!text-text-color" strong>
                {t("employer.applicant.listJob.titleCard")}
              </Text>
            }
            className="jobs-list-card"
            bodyStyle={{ padding: loading && !data.length ? "24px" : "0px" }}
          >
            {initialLoading ? (
              <Flex
                justify="center"
                align="center"
                className="loading-container"
              >
                <Spin
                  size="large"
                  tip={t("employer.applicant.listJob.loadingJob")}
                />
              </Flex>
            ) : loading && !data.length ? (
              <Flex
                justify="center"
                align="center"
                className="loading-container-small"
              >
                <Spin
                  size="large"
                  tip={t("employer.applicant.listJob.loadingJob")}
                />
              </Flex>
            ) : (
              <List
                split={false}
                dataSource={data}
                loading={{
                  spinning: loading && data.length > 0,
                  indicator: <></>,
                }}
                locale={{
                  emptyText: (
                    <Empty
                      description={
                        <div className="empty-description">
                          <Text strong style={{ fontSize: 16 }}>
                            {t("employer.applicant.listJob.noJob")}
                          </Text>
                        </div>
                      }
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      className="empty-container"
                    />
                  ),
                }}
                renderItem={
                  loading && data.length > 0
                    ? renderSkeletons
                    : (job) => (
                        <div className="job-item-wrapper">
                          <List.Item className="job-list-item">
                            <div style={{ width: "100%" }}>
                              <Card
                                bordered={false}
                                className="job-card"
                                extra={renderStatusBadge(job.jobDeadline)}
                              >
                                <JobCardLargeApplicant
                                  job={job}
                                  setSelectedJob={setSelectedJob}
                                />
                              </Card>
                            </div>
                          </List.Item>
                        </div>
                      )
                }
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalRecords,
                  showSizeChanger: true,
                  pageSizeOptions: ["5", "10", "20", "50"],
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} ${t("common.of")} ${total} ${t(
                      "common.item"
                    )}`,
                  onChange: (page, pageSize) => {
                    setCurrentPage(page);
                    setPageSize(pageSize);
                  },
                  className: "custom-pagination",
                }}
              />
            )}
          </Card>
        </div>
      </Flex>
      <ListApplicantDrawer
        open={selectedJob !== null}
        setSelectedJob={setSelectedJob}
        jobId={selectedJob}
      />
    </div>
  );
};

export default ListJob;
