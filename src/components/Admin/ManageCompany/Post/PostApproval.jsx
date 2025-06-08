import { Tabs, Badge, Divider, Typography } from "antd";
import BoxContainer from "../../../Generate/BoxContainer";
import { useState, useEffect } from "react";
import TablePost from "./TablePost";
import { useTranslation } from "react-i18next";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { getAllPostByAdmin } from "../../../../services/apiService";

const { Text } = Typography;
const PostApproval = () => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState("PENDING");
  const [stats, setStats] = useState({
    pending: 0,
    active: 0,
    rejected: 0,
    total: 0,
  });

  const fetchStats = async () => {
    try {
      // Fetch pending count
      const pendingRes = await getAllPostByAdmin({
        status: "PENDING",
        page: 0,
        limit: 1,
      });

      // Fetch active count
      const activeRes = await getAllPostByAdmin({
        status: "ACTIVE",
        page: 0,
        limit: 1,
      });

      // Fetch rejected count
      const rejectedRes = await getAllPostByAdmin({
        status: "REJECTED",
        page: 0,
        limit: 1,
      });

      setStats({
        pending: pendingRes.data?.totalPages || 0,
        active: activeRes.data?.totalPages || 0,
        rejected: rejectedRes.data?.totalPages || 0,
        total:
          (pendingRes.data?.totalPages || 0) +
          (activeRes.data?.totalPages || 0) +
          (rejectedRes.data?.totalPages || 0),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const items = [
    {
      key: "PENDING",
      label: (
        <span>
          <ClockCircleOutlined /> {t("admin.postApproval.tabs.pending")}{" "}
          <Badge count={stats.pending} style={{ backgroundColor: "#faad14" }} />
        </span>
      ),
      children: (
        <div className="tab-content">
          <Text className="mb-4 !text-base">
            {t("admin.manageJobs.pendingDescription")}
          </Text>
          <TablePost status="PENDING" onUpdateStats={fetchStats} />
        </div>
      ),
    },
    {
      key: "ACTIVE",
      label: (
        <span>
          <CheckCircleOutlined /> {t("admin.postApproval.tabs.approved")}{" "}
          <Badge count={stats.active} style={{ backgroundColor: "#52c41a" }} />
        </span>
      ),
      children: (
        <div className="tab-content">
          <p className="mb-4 text-gray-500">
            {t("admin.manageJobs.activeDescription")}
          </p>
          <TablePost status="ACTIVE" onUpdateStats={fetchStats} />
        </div>
      ),
    },
    {
      key: "REJECTED",
      label: (
        <span>
          <CloseCircleOutlined /> {t("admin.postApproval.tabs.rejected")}{" "}
          <Badge
            count={stats.rejected}
            style={{ backgroundColor: "#ff4d4f" }}
          />
        </span>
      ),
      children: (
        <div className="tab-content">
          <p className="mb-4 text-gray-500">
            {t("admin.manageJobs.rejectedDescription")}
          </p>
          <TablePost status="REJECTED" onUpdateStats={fetchStats} />
        </div>
      ),
    },
  ];

  return (
    <>
      <BoxContainer className="mb-4 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="mb-0 title1">{t("admin.postApproval.title")}</h1>
        </div>

        <Divider />
        <Tabs
          activeKey={activeKey}
          onChange={handleTabChange}
          size="large"
          type="card"
          animated={{ tabPane: true }}
          className="admin-post-tabs"
          items={items}
        />
      </BoxContainer>
    </>
  );
};

export default PostApproval;
