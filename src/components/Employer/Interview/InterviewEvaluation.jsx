import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Form,
  Input,
  Rate,
  Button,
  Space,
  Divider,
  message,
  Select,
  Avatar,
  Flex,
  Tag,
} from "antd";
import {
  UserOutlined,
  StarOutlined,
  FileTextOutlined,
  TeamOutlined,
  StarFilled,
} from "@ant-design/icons";
import BoxContainer from "../../Generate/BoxContainer";
import { useTranslation } from "react-i18next";
import interview from "../../../services/api/interview";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const InterviewEvaluation = () => {
  const { t } = useTranslation();
  const { interviewId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [interviewData, setInterviewData] = useState(null);

  // Check if coming from a meeting
  const fromMeeting = location.state?.fromMeeting || false;

  useEffect(() => {
    // Fetch interview details when component mounts
    const fetchInterviewDetails = async () => {
      setLoading(true);
      try {
        // Get interview details from the API
        const response = await interview.getInterviewById(interviewId);
        if (response && response.status === "OK") {
          setInterviewData(response.data);
        } else {
          message.error("Failed to load interview details");
        }
      } catch (error) {
        console.error("Error fetching interview details:", error);
        message.error("Failed to load interview details");
      } finally {
        setLoading(false);
      }
    };

    if (interviewId) {
      fetchInterviewDetails();
    }
  }, [interviewId]);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      // Create payload for evaluation submission
      const evaluationData = {
        interviewId: interviewId,
        ...values,
      };

      // Call API to save evaluation
      const response = await interview.submitEvaluation(evaluationData);

      if (response && response.status === "OK") {
        message.success("Evaluation submitted successfully");
        // Navigate back to interview list after successful submission
        navigate("/employer/interview");
      } else {
        message.error("Failed to submit evaluation");
      }
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      message.error("Failed to submit evaluation");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/employer/interview");
  };

  return (
    <Flex vertical gap={20}>
      <BoxContainer className="shadow-md">
        <Title level={4}>
          {t("employer.interview.evaluation.title") || "Candidate Evaluation"}
        </Title>
        <Text type="secondary">
          {fromMeeting
            ? t("employer.interview.evaluation.fromMeetingDescription") ||
              "Please evaluate the candidate you just interviewed."
            : t("employer.interview.evaluation.description") ||
              "Evaluate candidate performance after the interview."}
        </Text>
      </BoxContainer>

      <BoxContainer className="shadow-md">
        {interviewData ? (
          <Card bordered={false}>
            <Flex align="center" gap={16} className="mb-6">
              <Avatar
                size={64}
                icon={<UserOutlined />}
                src={interviewData.candidateAvatar}
              />
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {interviewData.candidateName}
                </Title>
                <Text type="secondary">
                  {interviewData.position} • {interviewData.jobTitle}
                </Text>
              </div>
            </Flex>

            <Divider />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleFormSubmit}
              initialValues={{
                technicalSkillRating: 3,
                communicationRating: 3,
                cultureFitRating: 3,
                overallRating: 3,
                hiringDecision: "consider",
              }}
            >
              <Flex vertical gap={24}>
                <div className="evaluation-section">
                  <Title level={5}>
                    <StarOutlined />{" "}
                    {t("employer.interview.evaluation.skills") ||
                      "Technical Skills"}
                  </Title>
                  <Form.Item
                    name="technicalSkillRating"
                    label={
                      t("employer.interview.evaluation.skillsRating") ||
                      "Technical Skills Rating"
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please rate the candidate's technical skills",
                      },
                    ]}
                  >
                    <Rate allowHalf />
                  </Form.Item>
                  <Form.Item
                    name="technicalFeedback"
                    label={
                      t("employer.interview.evaluation.skillsFeedback") ||
                      "Technical Skills Feedback"
                    }
                  >
                    <TextArea
                      rows={3}
                      placeholder="Comments about candidate's technical skills and knowledge..."
                    />
                  </Form.Item>
                </div>

                <div className="evaluation-section">
                  <Title level={5}>
                    <FileTextOutlined />{" "}
                    {t("employer.interview.evaluation.communication") ||
                      "Communication Skills"}
                  </Title>
                  <Form.Item
                    name="communicationRating"
                    label={
                      t("employer.interview.evaluation.communicationRating") ||
                      "Communication Rating"
                    }
                    rules={[
                      {
                        required: true,
                        message:
                          "Please rate the candidate's communication skills",
                      },
                    ]}
                  >
                    <Rate allowHalf />
                  </Form.Item>
                  <Form.Item
                    name="communicationFeedback"
                    label={
                      t(
                        "employer.interview.evaluation.communicationFeedback"
                      ) || "Communication Feedback"
                    }
                  >
                    <TextArea
                      rows={3}
                      placeholder="Comments about candidate's communication skills..."
                    />
                  </Form.Item>
                </div>

                <div className="evaluation-section">
                  <Title level={5}>
                    <TeamOutlined />{" "}
                    {t("employer.interview.evaluation.cultureFit") ||
                      "Culture Fit"}
                  </Title>
                  <Form.Item
                    name="cultureFitRating"
                    label={
                      t("employer.interview.evaluation.cultureFitRating") ||
                      "Culture Fit Rating"
                    }
                    rules={[
                      {
                        required: true,
                        message:
                          "Please rate how well the candidate would fit your company culture",
                      },
                    ]}
                  >
                    <Rate allowHalf />
                  </Form.Item>
                  <Form.Item
                    name="cultureFitFeedback"
                    label={
                      t("employer.interview.evaluation.cultureFitFeedback") ||
                      "Culture Fit Feedback"
                    }
                  >
                    <TextArea
                      rows={3}
                      placeholder="Comments about candidate's cultural fit..."
                    />
                  </Form.Item>
                </div>

                <div className="evaluation-section">
                  <Title level={5}>
                    <StarFilled />{" "}
                    {t("employer.interview.evaluation.overall") ||
                      "Overall Assessment"}
                  </Title>
                  <Form.Item
                    name="overallRating"
                    label={
                      t("employer.interview.evaluation.overallRating") ||
                      "Overall Rating"
                    }
                    rules={[
                      {
                        required: true,
                        message:
                          "Please provide an overall rating for the candidate",
                      },
                    ]}
                  >
                    <Rate allowHalf />
                  </Form.Item>

                  <Form.Item
                    name="hiringDecision"
                    label={
                      t("employer.interview.evaluation.hiringDecision") ||
                      "Hiring Decision"
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please make a hiring decision",
                      },
                    ]}
                  >
                    <Select>
                      <Option value="hire">
                        <Tag color="green">
                          {t("employer.interview.evaluation.hire") || "Hire"}
                        </Tag>
                      </Option>
                      <Option value="consider">
                        <Tag color="blue">
                          {t("employer.interview.evaluation.consider") ||
                            "Consider"}
                        </Tag>
                      </Option>
                      <Option value="reject">
                        <Tag color="red">
                          {t("employer.interview.evaluation.reject") ||
                            "Reject"}
                        </Tag>
                      </Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="additionalFeedback"
                    label={
                      t("employer.interview.evaluation.additionalFeedback") ||
                      "Additional Feedback"
                    }
                  >
                    <TextArea
                      rows={4}
                      placeholder="Any additional comments or feedback..."
                    />
                  </Form.Item>
                </div>

                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      {t("employer.interview.evaluation.submit") ||
                        "Submit Evaluation"}
                    </Button>
                    <Button onClick={handleCancel}>
                      {t("common.cancel") || "Cancel"}
                    </Button>
                  </Space>
                </Form.Item>
              </Flex>
            </Form>
          </Card>
        ) : (
          <div className="p-8 text-center">
            <Text type="secondary">
              {loading
                ? "Loading interview details..."
                : "Interview information not available"}
            </Text>
          </div>
        )}
      </BoxContainer>
    </Flex>
  );
};

export default InterviewEvaluation;
