import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Divider, Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import "./ApplicantCard.scss";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;
const ApplicantCard = ({ applicant, status }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <Card
        size="small"
        className="duration-150 cursor-pointer hover:shadow-lg hover:bg-bg-color"
        onClick={() => {
          applicant?.applicationId &&
            navigate(`/employer/applicant-job/${applicant?.applicationId}`, {
              state: { status, jobId: applicant.jobId },
            });
        }}
      >
        <div className="w-full">
          <Flex align="center" gap={10}>
            <Avatar
              icon={<UserOutlined />}
              size={60}
              src={applicant?.profileImage}
            />
            <div className="flex flex-col gap-1">
              <Title level={5}>
                {applicant?.lastName} {applicant?.firstName}
              </Title>
              <div className="flex items-center gap-1">
                <Text className="text-base">
                  {t("employer.resumes.studentYear", { year: applicant?.year })}
                </Text>
                <Divider type="vertical" className="p-0 !my-0" />
                <Text className="text-base">{applicant?.email}</Text>
              </div>
            </div>
          </Flex>
        </div>
      </Card>
    </>
  );
};
export default ApplicantCard;
