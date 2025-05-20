import BoxContainer from "../../../Generate/BoxContainer";
import { useEffect, useState } from "react";
import { Table, Flex, Typography, Tabs, Alert } from "antd";
import {
  getApplyJobByStudent,
  getJobSaved,
} from "../../../../services/apiService";
import Status from "../../../../constant/status";
import { checkThoiHan } from "../../../../utils/day";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
const { Text } = Typography;

const AppliedJob = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalApplicants, setTotalApplicants] = useState(0);

  const fetchData = () => {
    setLoading(true);
    getApplyJobByStudent()
      .then((response) => {
        setData(response.data.content);
        setTotalApplicants(response.data.totalElements);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);
  const columns = [
    {
      title: t("student.myJobs.company"),
      dataIndex: "companyName",
      key: "companyName",
      render: (text, record) => (
        <Link to={`/company/${record.companyId}`}>
          <Text ellipsis={{ rows: 1, tooltip: text }}>{text}</Text>
        </Link>
      ),
      ellipsis: true,
      width: "39%",
    },
    {
      title: t("student.myJobs.job"),
      dataIndex: "jobTitle",
      key: "jobTitle",
      render: (text, record) => (
        <Link to={`/job/${record.jobId}`}>
          <Text ellipsis={{ rows: 1, tooltip: text }}>{text}</Text>
        </Link>
      ),
      ellipsis: true,
      width: "39%",
    },
    {
      title: t("student.myJobs.cv"),
      dataIndex: "resumeFile",
      key: "resumeFile",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          <EyeOutlined shape="round" />
        </a>
      ),
      align: "center",
      width: "9%",
    },
    {
      title: t("student.myJobs.status"),
      dataIndex: "applicationStatus",
      key: "applicationStatus",
      render: (status) => <Status status={status} />,
      align: "center",
      width: "13%",
    },
  ];
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="applicationId"
      loading={loading}
      pagination={{
        align: "end",
        current: currentPage,
        pageSize: pageSize,
        total: totalApplicants,
        onChange: handlePageChange,
        showSizeChanger: true,
      }}
    />
  );
};

const SavedJob = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const fetchData = () => {
    setLoading(true);
    getJobSaved()
      .then((response) => {
        setData(
          response.data.content.map((item) => ({
            companyId: item.employerId,
            companyName: item.employerResponse.companyName,
            jobId: item.jobId,
            jobTitle: item.jobTitle,
            jobDeadline: item.jobDeadline,
          }))
        );
        setTotalElements(response.data.totalElements);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);
  const columns = [
    {
      title: t("student.myJobs.company"),
      dataIndex: "companyName",
      key: "companyName",
      render: (text, record) => (
        <Link to={`/company/${record.companyId}`}>
          <Text ellipsis={{ rows: 1, tooltip: text }}>{text}</Text>
        </Link>
      ),
      ellipsis: true,
      width: "39%",
    },
    {
      title: t("student.myJobs.job"),
      dataIndex: "jobTitle",
      key: "jobTitle",
      render: (text, record) => (
        <Link to={`/job/${record.jobId}`}>
          <Text ellipsis={{ rows: 1, tooltip: text }}>{text}</Text>
        </Link>
      ),
      ellipsis: true,
      width: "43%",
    },
    {
      title: t("student.myJobs.status"),
      dataIndex: "jobDeadline",
      key: "jobDeadline",
      render: (text) => checkThoiHan({ dateInput: text }),
      align: "center",
      width: "13%",
    },
  ];
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="applicationId"
      loading={loading}
      pagination={{
        align: "end",
        current: currentPage,
        pageSize: pageSize,
        total: totalElements,
        onChange: handlePageChange,
        showSizeChanger: true,
      }}
    />
  );
};

const MyJobPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = location.hash.replace("#", "") || "job-applied";

  const handleTabChange = (key) => {
    navigate(`#${key}`);
  };

  // useEffect(() => {

  //     const tabFromHash = location.hash.replace('#', '');
  //     if (tabFromHash) {

  //     }
  // }, [location.hash]);
  return (
    <>
      <Flex vertical gap={8}>
        <BoxContainer width="100%">
          <div className="title1">{t("student.myJobs.title")}</div>
        </BoxContainer>
        <BoxContainer width="100%">
          <Tabs onChange={handleTabChange} activeKey={activeTab} size="large">
            <Tabs.TabPane tab={t("student.myJobs.applied")} key="job-applied">
              <Flex vertical gap={16}>
                <Alert
                  message={<Text strong>{t("student.myJobs.notice")}</Text>}
                  description={
                    <Text>{t("student.myJobs.noticeDescription")}</Text>
                  }
                  type="info"
                  showIcon
                />
                <AppliedJob />
              </Flex>
            </Tabs.TabPane>
            <Tabs.TabPane tab={t("student.myJobs.saved")} key="job-saved">
              <SavedJob />
            </Tabs.TabPane>
          </Tabs>
        </BoxContainer>
      </Flex>
    </>
  );
};
export default MyJobPage;
