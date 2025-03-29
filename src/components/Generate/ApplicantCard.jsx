import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import "./ApplicantCard.scss";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;
const ApplicantCard = ({ applicant, status }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    return (
        <>
            <Card size="smalls" className="card-applicant">
                <div className="w-full">
                    <Flex justify='space-between' align='center'>
                        <Flex align='center'>
                            <Avatar icon={<UserOutlined />} size={80} src={applicant?.profileImage} />
                            <div className="ms-3">
                                <Title level={4}>{applicant?.lastName} {applicant?.firstName}</Title>
                                <Text className="text-base">{t('employer.resumes.studentYear', { year: applicant?.year })}</Text>
                                <br />
                                <Text className="text-base">{applicant?.email}</Text>
                            </div>
                        </Flex>
                        <Button size="large" variant="text" type="default" onClick={() => { applicant?.applicationId && navigate(`/employer/applicant-job/${applicant?.applicationId}`, { state: { status, jobId: applicant.jobId } }) }}>{t('employer.applicant.viewDetail.title')}</Button>
                    </Flex>
                </div>
            </Card>
        </>
    )
}
export default ApplicantCard;