import {
  Modal,
  Typography,
  List,
  Avatar,
  Tag,
  Progress,
  Alert,
  Tooltip,
} from "antd";
import { useTranslation } from "react-i18next";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

const AnalyzeCVsModal = ({ open, setOpen, resumeAnalysis, isAnalyzing }) => {
  const { t } = useTranslation();

  const getMatchColor = (score) => {
    const percent = score * 100;
    if (percent >= 90) return "green";
    if (percent >= 80) return "blue";
    if (percent >= 70) return "gold";
    return "orange";
  };

  const renderSkillTags = (matchedSkills, missingSkills) => {
    return (
      <div className="flex flex-wrap gap-1">
        {matchedSkills.map((skill) => (
          <Tag color="success" key={skill} className="mb-1 capitalize">
            {skill}
          </Tag>
        ))}
        {missingSkills.map((skill) => (
          <Tag color="error" key={skill} className="mb-1 capitalize">
            {skill}
          </Tag>
        ))}
      </div>
    );
  };

  const hasData = resumeAnalysis?.data?.recommendations?.length > 0;

  return (
    <Modal
      title={
        <Text className="!mb-0 text-xl font-bold">
          {t("employer.applicant.analyze")}
        </Text>
      }
      width={800}
      centered
      open={open && !isAnalyzing && hasData}
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
                  className="flex flex-col items-center gap-2"
                  key="match-percent"
                >
                  <Tooltip title={t("employer.applicant.overallScore")}>
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
                </div>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar size={48} icon={<UserOutlined />} />}
                title={
                  <div className="flex flex-wrap items-center gap-2">
                    <Text strong>{resume.resume_title}</Text>
                  </div>
                }
                description={
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <div className="w-1/4">
                        <Text type="secondary" className="text-sm">
                          {t("employer.applicant.email")}:
                        </Text>
                      </div>
                      <div className="w-3/4">
                        <Text className="text-sm">{resume.student_name}</Text>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1/4">
                        <Text type="secondary" className="text-sm">
                          {t("employer.applicant.skillScore")}:
                        </Text>
                      </div>
                      <div className="w-3/4">
                        <Progress
                          percent={Math.round(resume.skill_match_score * 100)}
                          size="small"
                          status="active"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1/4">
                        <Text type="secondary" className="text-sm">
                          {t("employer.applicant.similarity")}:
                        </Text>
                      </div>
                      <div className="w-3/4">
                        <Progress
                          percent={Math.round(resume.content_similarity * 100)}
                          size="small"
                          status="active"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Text type="secondary" className="text-sm">
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
    </Modal>
  );
};

export default AnalyzeCVsModal;
