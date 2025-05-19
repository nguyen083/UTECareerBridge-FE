import { Button, Collapse, Drawer, Flex } from "antd";
import { useTranslation } from "react-i18next";
import { Typography } from "antd";
import { IoIosRefresh } from "react-icons/io";
import "./ListApplicantDrawer.scss";
import ListApplicant from "./ListApplicant";
import { useRef, useState } from "react";
import AnalyzeCVsModal from "./AnalyzeCVsModal";
import { FaRegFileExcel } from "react-icons/fa";
import { useCVAnalyzeApplyJob } from "../../../composables/resume";
import LoadingAnimation from "../../Student/CVAnalysis/LoadingAnimation";

const { Text } = Typography;

const ListApplicantDrawer = ({ open, setSelectedJob, jobId }) => {
  const [openAnalyzeCVsDrawer, setOpenAnalyzeCVsDrawer] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const { t } = useTranslation();
  const pendingRef = useRef();
  const viewedRef = useRef();
  const approvedRef = useRef();
  const rejectedRef = useRef();

  const {
    data: resumeAnalysis,
    isFetching: isAnalyzing,
    refetch: analyzeResumes,
  } = useCVAnalyzeApplyJob(jobId);

  const handleRefresh = () => {
    pendingRef.current?.fetchData();
    viewedRef.current?.fetchData();
    approvedRef.current?.fetchData();
    rejectedRef.current?.fetchData();
  };

  const handleAnalyzeCVs = () => {
    setAnalyzing(true);
    setOpenAnalyzeCVsDrawer(true);
    analyzeResumes().finally(() => {
      setAnalyzing(false);
    });
  };

  const items = [
    {
      key: "1",
      label: t("employer.applicant.tabs.pending"),
      children: (
        <ListApplicant ref={pendingRef} activeKey="PENDING" jobId={jobId} />
      ),
    },
    {
      key: "2",
      label: t("employer.applicant.tabs.viewed"),
      children: (
        <ListApplicant ref={viewedRef} activeKey="VIEWED" jobId={jobId} />
      ),
    },
    {
      key: "3",
      label: t("employer.applicant.tabs.approved"),
      children: (
        <ListApplicant ref={approvedRef} activeKey="APPROVED" jobId={jobId} />
      ),
    },
    {
      key: "4",
      label: t("employer.applicant.tabs.rejected"),
      children: (
        <ListApplicant ref={rejectedRef} activeKey="REJECTED" jobId={jobId} />
      ),
    },
  ];

  return (
    <div className="relative">
      <LoadingAnimation loadingAnimation={analyzing} />
      <Drawer
        className="list-applicant-drawer"
        width={700}
        closable
        destroyOnClose
        title={
          <Flex justify="space-between" align="center">
            <Text className="!mb-0">
              {t("employer.applicant.listDrawer.title", "Danh sách ứng viên")}
            </Text>
            <Flex gap={10}>
              <Button
                onClick={handleAnalyzeCVs}
                type="primary"
                icon={<FaRegFileExcel />}
                loading={isAnalyzing}
              >
                {t("employer.applicant.analyze")}
              </Button>
              <Button
                icon={<IoIosRefresh size={20} />}
                type="text"
                onClick={handleRefresh}
              ></Button>
            </Flex>
          </Flex>
        }
        placement="right"
        open={open}
        onClose={() => setSelectedJob(null)}
      >
        <Collapse
          items={items}
          defaultActiveKey={["1", "2", "3", "4"]}
          size="small"
          expandIconPosition="end"
        />
        <LoadingAnimation loadingAnimation={isAnalyzing} />
        <AnalyzeCVsModal
          open={openAnalyzeCVsDrawer}
          setOpen={setOpenAnalyzeCVsDrawer}
          jobId={jobId}
          resumeAnalysis={resumeAnalysis}
          isAnalyzing={isAnalyzing}
        />
      </Drawer>
    </div>
  );
};

export default ListApplicantDrawer;
