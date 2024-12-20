import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import "./ApplicantCard.scss";
const { Title, Text } = Typography;
const ApplicantCard = ({ applicant, status }) => {
    const navigate = useNavigate();
    return (
        <>
            <Card size="smalls" className="card-applicant">
                <div className="w-100">
                    <Flex justify='space-between' align='center'>
                        <Flex align='center'>
                            <Avatar icon={<UserOutlined />} size={80} src={applicant?.profileImage} />
                            <div className="ms-3">
                                <Title level={4}>{applicant?.lastName} {applicant?.firstName}</Title>
                                <Text className="f-16">Sinh viên năm {applicant?.year}</Text>
                                <br />
                                <Text className="f-16">{applicant?.email}</Text>
                            </div>
                        </Flex>
                        <Button size="large" variant="text" type="default" onClick={() => { applicant?.applicationId && navigate(`/employer/applicant-job/${applicant?.applicationId}`, { state: { status, jobId: applicant.jobId } }) }}>Hồ sơ chi tiết</Button>
                    </Flex>
                </div>
            </Card>
        </>
    )
}
export default ApplicantCard;