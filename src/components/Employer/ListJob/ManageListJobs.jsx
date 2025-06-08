import { useState, useEffect } from "react";
import {
  Tabs,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Typography,
  Empty,
} from "antd";
import TableListJobs from "./TableListJobs";
import BoxContainer from "../../Generate/BoxContainer";
import { useTranslation } from "react-i18next";
import {
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  PauseCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getJobsByStatus } from "../../../services/apiService";
import "./ManageListJobs.scss";

const { Title, Text } = Typography;

const ManageListJobs = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("ACTIVE");
  const [statistics, setStatistics] = useState({
    active: 0,
    inactive: 0,
    pending: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // Get count for each job status using the existing getJobsByStatus function
      const statuses = ["ACTIVE", "INACTIVE", "PENDING", "REJECTED"];
      const stats = {
        active: 0,
        inactive: 0,
        pending: 0,
        rejected: 0,
      };

      for (const status of statuses) {
        const res = await getJobsByStatus({
          jobStatus: status,
          page: 0,
          limit: 1,
        });

        if (res.status === "OK") {
          // If response contains totalPages, it's the total count of items
          // Assuming each page has the limit items
          const key = status.toLowerCase();
          stats[key] = res.data?.totalPages || 0;
        }
      }

      setStatistics(stats);
    } catch (error) {
      console.error("Error fetching job statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = () => {
    navigate("/employer/post-job");
  };

  const StatCard = ({ title, count, icon, color, description }) => (
    <Card
      className={`stat-card shadow-md ${activeKey === title ? "active" : ""}`}
      onClick={() => setActiveKey(title)}
    >
      <div className="stat-content">
        <Statistic prefix={icon} value={count} valueStyle={{ color }} />
        <div>
          <div className="stat-title">
            {t(`employer.manageJobs.tabs.${title.toLowerCase()}`)}
          </div>
        </div>
        <div className="stat-description">{description}</div>
      </div>
    </Card>
  );

  return (
    <>
      <BoxContainer className="shadow-md job-header">
        <div className="job-header-content">
          <div>
            <Title level={3}>{t("employer.manageJobs.listJobs")}</Title>
            <Text type="secondary">
              {t("employer.manageJobs.description") ||
                "Manage and track all your job postings"}
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateJob}
            className="create-job-btn"
          >
            {t("employer.manageJobs.createJob")}
          </Button>
        </div>
      </BoxContainer>

      <BoxContainer className="shadow-md job-stats">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <StatCard
              title="ACTIVE"
              count={statistics.active}
              icon={<CheckCircleOutlined />}
              color="#52c41a"
              description={
                t("employer.manageJobs.activeDescription") ||
                "Live jobs visible to applicants"
              }
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatCard
              title="INACTIVE"
              count={statistics.inactive}
              icon={<PauseCircleOutlined />}
              color="#faad14"
              description={
                t("employer.manageJobs.inactiveDescription") ||
                "Hidden jobs not visible to applicants"
              }
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatCard
              title="PENDING"
              count={statistics.pending}
              icon={<ClockCircleOutlined />}
              color="#1890ff"
              description={
                t("employer.manageJobs.pendingDescription") ||
                "Jobs awaiting approval"
              }
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatCard
              title="REJECTED"
              count={statistics.rejected}
              icon={<CloseCircleOutlined />}
              color="#ff4d4f"
              description={
                t("employer.manageJobs.rejectedDescription") ||
                "Jobs that were not approved"
              }
            />
          </Col>
        </Row>
      </BoxContainer>

      <BoxContainer className="shadow-md job-content">
        <Tabs
          activeKey={activeKey}
          onChange={handleTabChange}
          className="job-tabs"
          tabBarExtraContent={
            <div className="total-count">
              <Text>
                {t("employer.manageJobs.totalJobs")}:{" "}
                <Text strong>
                  {Object.values(statistics).reduce((a, b) => a + b, 0)}
                </Text>
              </Text>
            </div>
          }
        >
          <Tabs.TabPane
            tab={
              <span className="tab-with-count">
                <span>{t("employer.manageJobs.tabs.active")}</span>
                <span className="count-badge active">{statistics.active}</span>
              </span>
            }
            key="ACTIVE"
          />
          <Tabs.TabPane
            tab={
              <span className="tab-with-count">
                <span>{t("employer.manageJobs.tabs.inactive")}</span>
                <span className="count-badge inactive">
                  {statistics.inactive}
                </span>
              </span>
            }
            key="INACTIVE"
          />
          <Tabs.TabPane
            tab={
              <span className="tab-with-count">
                <span>{t("employer.manageJobs.tabs.pending")}</span>
                <span className="count-badge pending">
                  {statistics.pending}
                </span>
              </span>
            }
            key="PENDING"
          />
          <Tabs.TabPane
            tab={
              <span className="tab-with-count">
                <span>{t("employer.manageJobs.tabs.rejected")}</span>
                <span className="count-badge rejected">
                  {statistics.rejected}
                </span>
              </span>
            }
            key="REJECTED"
          />
        </Tabs>

        {loading ? (
          <div className="loading-state">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t("common.loading") || "Loading..."}
            />
          </div>
        ) : (
          <TableListJobs status={activeKey} onRefreshStats={fetchStatistics} />
        )}
      </BoxContainer>
    </>
  );
};

export default ManageListJobs;
