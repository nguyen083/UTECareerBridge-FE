import {
  Modal,
  Typography,
  List,
  Avatar,
  Tag,
  Progress,
  Alert,
  Tooltip,
  Button,
  message,
} from "antd";
import { useTranslation } from "react-i18next";
import {
  UserOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { convertStatus, getCVByEmployer } from "../../../services/apiService";
import { ModalInterview } from "./ViewDetailApplicant";
import { useEffect, useState } from "react";

const { Text } = Typography;

const AnalyzeCVsModal = ({
  open,
  setOpen,
  jobId,
  resumeAnalysis,
  isAnalyzing,
}) => {
  const { t } = useTranslation();
  const [openModalInterview, setOpenModalInterview] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [email, setEmail] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const getMatchColor = (score) => {
    const percent = score * 100;
    if (percent >= 90) return "green";
    if (percent >= 80) return "blue";
    if (percent >= 70) return "gold";
    return "orange";
  };

  useEffect(() => {
    if (applicationId) {
      getCVByEmployer(applicationId)
        .then((res) => {
          setStudentId(res.data.studentId);
          setResumeId(res.data.resumeId);
          setEmail(res.data.email);
        })
        .then(() => {
          setOpenModalInterview(true);
        });
    }
  }, [applicationId]);

  useEffect(() => {
    if (!openModalInterview) {
      setApplicationId(null);
    }
  }, [openModalInterview]);

  const renderSkillTags = (matchedSkills, missingSkills) => {
    return (
      <div className="flex flex-wrap gap-1">
        {matchedSkills.map((skill) => (
          <Tag color="success" key={skill} className="mb-1 capitalize">
            {skill}
          </Tag>
        ))}
        {missingSkills.slice(0, 3).map((skill) => (
          <Tag color="error" key={skill} className="mb-1 capitalize">
            {skill}
          </Tag>
        ))}
        {missingSkills.length > 3 && (
          <Tag color="error" key="more" className="mb-1 capitalize">
            +{missingSkills.length - 3}
          </Tag>
        )}
      </div>
    );
  };

  const handleViewCV = (resumeId) => {
    window.open(
      `/employer/applicant-job/${resumeId}?state=PENDING&jobId=${jobId}`
    );
  };

  const handleApproveCV = (resumeId) => {
    setApplicationId(resumeId);
  };
  const handleRejectCV = (resumeId) => {
    setLoading(true);
    convertStatus(resumeId, "REJECTED")
      .then(() => {
        message.success(t("employer.applicant.rejectSuccess"));
      })
      .catch(() => {
        message.error(t("employer.applicant.rejectError"));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      title={
        <Text className="!mb-0 text-xl font-bold">
          {t("employer.applicant.analyze")}
        </Text>
      }
      width={800}
      centered
      open={open && !isAnalyzing}
      footer={null}
      onCancel={() => setOpen(false)}
      className="analyze-cvs-modal"
    >
      <div className="py-2 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit">
        <Alert
          message={t("employer.applicant.analyze")}
          description={t("employer.applicant.analyzeDescription")}
          type="info"
          showIcon
          className="mb-4"
        />

        <List
          itemLayout="horizontal"
          dataSource={resumeAnalysis?.data?.recommendations || []}
          renderItem={(resume) => (
            <List.Item
              key={resume.resume_id}
              className="!p-3 mb-3 transition-all border rounded-lg hover:shadow-md"
              actions={[
                <div
                  key={resume.application_id}
                  className="flex items-center justify-end gap-3 mt-2"
                >
                  <div
                    className="flex flex-col items-center gap-2"
                    key="match-percent"
                  >
                    <Tooltip
                      destroyTooltipOnHide={true}
                      title={t("employer.applicant.overallScore")}
                    >
                      <Progress
                        type="circle"
                        percent={Math.round(resume.match_score * 100)}
                        size={50}
                        strokeColor={getMatchColor(resume.match_score)}
                      />
                    </Tooltip>
                    <Text className="text-sm font-medium">
                      {t("employer.applicant.matchScore")}
                    </Text>
                  </div>
                  <Button
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => handleViewCV(resume.application_id)}
                  />
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    size="small"
                    onClick={() => handleApproveCV(resume.application_id)}
                  />
                  <Button
                    danger
                    loading={loading}
                    icon={<CloseCircleOutlined />}
                    size="small"
                    onClick={() => handleRejectCV(resume.application_id)}
                  />
                </div>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={resume?.profile_image}
                    size={48}
                    icon={<UserOutlined />}
                  />
                }
                title={
                  <div className="flex flex-wrap items-center gap-2">
                    <Text strong>{resume?.resume_title}</Text>
                  </div>
                }
                description={
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div>
                        <Text type="secondary" className="text-sm">
                          {t("employer.applicant.name")}:
                        </Text>
                      </div>
                      <div>
                        <Text className="text-sm">
                          {resume?.student_name || ""}
                        </Text>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Text
                          type="secondary"
                          className="flex-shrink-0 text-sm"
                        >
                          {t("employer.applicant.skills")}:
                        </Text>
                        <div className="flex flex-wrap mt-1">
                          {renderSkillTags(
                            resume.matched_skills,
                            resume.missing_skills
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>

      <ModalInterview
        open={openModalInterview}
        setOpen={setOpenModalInterview}
        jobId={jobId}
        studentId={studentId}
        resumeId={resumeId}
        email={email}
        applicationId={applicationId}
      />
    </Modal>
  );
};

export default AnalyzeCVsModal;
