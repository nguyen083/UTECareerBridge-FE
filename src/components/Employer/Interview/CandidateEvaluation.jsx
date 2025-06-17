import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Form,
  Input,
  Button,
  Rate,
  Slider,
  Card,
  Typography,
  Switch,
  InputNumber,
  message,
  Flex,
  Alert,
} from "antd";
import "./CandidateEvaluation.scss";
import {
  CheckCircleOutlined,
  StarOutlined,
  AuditOutlined,
  SaveOutlined,
  CloseCircleOutlined,
  ExperimentOutlined,
  TeamOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import BoxContainer from "../../Generate/BoxContainer";
import interview from "../../../services/api/interview";
import "./CandidateEvaluation.scss";

const { Title, Text } = Typography;
const { TextArea } = Input;

const CandidateEvaluation = () => {
  const { t } = useTranslation();
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [isRecommended, setIsRecommended] = useState(true);
  const employer = useSelector((state) => state.employer);

  // Calculate overall rating based on skills ratings
  const calculateOverallRating = () => {
    const technicalSkills = form.getFieldValue("technicalSkills") || 0;
    const communicationSkills = form.getFieldValue("communicationSkills") || 0;
    const cultureFit = form.getFieldValue("cultureFit") || 0;
    const problemSolving = form.getFieldValue("problemSolving") || 0;
    const attitude = form.getFieldValue("attitude") || 0;

    const average =
      (technicalSkills +
        communicationSkills +
        cultureFit +
        problemSolving +
        attitude) /
      5;
    const rounded = Math.round(average * 10) / 10;
    form.setFieldsValue({ overallRating: rounded });

    return rounded;
  };

  useEffect(() => {
    if (!interviewId) {
      message.error(t("employer.evaluation.error.invalid_id"));
      navigate("/employer/interview");
    }
  }, [interviewId, navigate, t]);

  const onFinish = async (values) => {
    setSubmitting(true);

    try {
      // Add the current employer ID as evaluator
      values.evaluatedBy = employer.id;
      values.interviewId = parseInt(interviewId);

      // Convert ratings to numbers
      const numericFields = [
        "technicalSkills",
        "communicationSkills",
        "cultureFit",
        "problemSolving",
        "attitude",
        "overallRating",
        "recommendedSalary",
        "interviewId",
        "evaluatedBy",
      ];

      numericFields.forEach((field) => {
        if (values[field] !== undefined) {
          values[field] = Number(values[field]);
        }
      });

      // Calculate final overall rating
      const calculatedRating = calculateOverallRating();
      values.overallRating = calculatedRating;

      const response = await interview.evaluateCandidate(interviewId, values);

      if (response && response.status === "OK") {
        // Show success message with confetti animation
        message.success({
          content: t("employer.evaluation.success"),
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
          duration: 3,
        });

        // Redirect back to interview list after showing success
        setTimeout(() => {
          navigate("/employer/interview");
        }, 3000);
      } else {
        throw new Error(response?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Evaluation submission error:", error);
      message.error({
        content: t("employer.evaluation.error.submission"),
        icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
        duration: 5,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Flex vertical gap={20}>
      <BoxContainer className="shadow-md">
        <div className="title1">
          {t("employer.evaluation.title") || "Candidate Evaluation"}
        </div>
        <p className="mt-2 text-gray-500">
          {t("employer.evaluation.subtitle") ||
            "Evaluate the candidate based on the interview performance"}
        </p>
      </BoxContainer>

      <BoxContainer className="shadow-md evaluation-form-container">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            technicalSkills: 5,
            communicationSkills: 5,
            cultureFit: 5,
            problemSolving: 5,
            attitude: 5,
            overallRating: 5,
            isRecommended: true,
            recommendedSalary: 0,
          }}
          onValuesChange={(_, allValues) => {
            // Update overall rating when individual ratings change
            if (
              "technicalSkills" in _ ||
              "communicationSkills" in _ ||
              "cultureFit" in _ ||
              "problemSolving" in _ ||
              "attitude" in _
            ) {
              calculateOverallRating();
            }

            // Update isRecommended state when that field changes
            if ("isRecommended" in _) {
              setIsRecommended(allValues.isRecommended);
            }
          }}
        >
          <Flex gap={24}>
            <div className="w-2/3">
              {/* Skills Assessment */}
              <Card
                title={
                  <Title level={4}>
                    <ExperimentOutlined />{" "}
                    {t("employer.evaluation.skills.title") ||
                      "Skills Assessment"}
                  </Title>
                }
                className="mb-6"
              >
                <Form.Item
                  name="technicalSkills"
                  label={
                    <Text strong>
                      {t("employer.evaluation.skills.technical") ||
                        "Technical Skills"}
                    </Text>
                  }
                >
                  <Rate
                    count={10}
                    character={<StarOutlined />}
                    tooltips={Array(10)
                      .fill()
                      .map((_, i) => `${i + 1}`)}
                  />
                </Form.Item>

                <Form.Item
                  name="communicationSkills"
                  label={
                    <Text strong>
                      {t("employer.evaluation.skills.communication") ||
                        "Communication Skills"}
                    </Text>
                  }
                >
                  <Rate
                    count={10}
                    character={<StarOutlined />}
                    tooltips={Array(10)
                      .fill()
                      .map((_, i) => `${i + 1}`)}
                  />
                </Form.Item>

                <Form.Item
                  name="cultureFit"
                  label={
                    <Text strong>
                      {t("employer.evaluation.skills.culture_fit") ||
                        "Culture Fit"}
                    </Text>
                  }
                >
                  <Rate
                    count={10}
                    character={<StarOutlined />}
                    tooltips={Array(10)
                      .fill()
                      .map((_, i) => `${i + 1}`)}
                  />
                </Form.Item>

                <Form.Item
                  name="problemSolving"
                  label={
                    <Text strong>
                      {t("employer.evaluation.skills.problem_solving") ||
                        "Problem Solving"}
                    </Text>
                  }
                >
                  <Rate
                    count={10}
                    character={<StarOutlined />}
                    tooltips={Array(10)
                      .fill()
                      .map((_, i) => `${i + 1}`)}
                  />
                </Form.Item>

                <Form.Item
                  name="attitude"
                  label={
                    <Text strong>
                      {t("employer.evaluation.skills.attitude") || "Attitude"}
                    </Text>
                  }
                >
                  <Rate
                    count={10}
                    character={<StarOutlined />}
                    tooltips={Array(10)
                      .fill()
                      .map((_, i) => `${i + 1}`)}
                  />
                </Form.Item>
              </Card>

              {/* Notes */}
              <Card
                title={
                  <Title level={4}>
                    <MessageOutlined />{" "}
                    {t("employer.evaluation.notes.title") || "Feedback Notes"}
                  </Title>
                }
                className="mb-6"
              >
                <Form.Item
                  name="strengths"
                  label={
                    <Text strong>
                      {t("employer.evaluation.notes.strengths") || "Strengths"}
                    </Text>
                  }
                  rules={[
                    {
                      required: true,
                      message:
                        t("employer.evaluation.notes.strengths_required") ||
                        "Please provide candidate strengths",
                    },
                  ]}
                >
                  <TextArea
                    rows={3}
                    placeholder={
                      t("employer.evaluation.notes.strengths_placeholder") ||
                      "List candidate strengths and positive observations"
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="weaknesses"
                  label={
                    <Text strong>
                      {t("employer.evaluation.notes.weaknesses") ||
                        "Areas for Improvement"}
                    </Text>
                  }
                  rules={[
                    {
                      required: true,
                      message:
                        t("employer.evaluation.notes.weaknesses_required") ||
                        "Please provide areas for improvement",
                    },
                  ]}
                >
                  <TextArea
                    rows={3}
                    placeholder={
                      t("employer.evaluation.notes.weaknesses_placeholder") ||
                      "List areas where the candidate could improve"
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="overallNotes"
                  label={
                    <Text strong>
                      {t("employer.evaluation.notes.overall") ||
                        "Overall Notes"}
                    </Text>
                  }
                  rules={[
                    {
                      required: true,
                      message:
                        t("employer.evaluation.notes.overall_required") ||
                        "Please provide overall notes",
                    },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder={
                      t("employer.evaluation.notes.overall_placeholder") ||
                      "General comments and evaluation summary"
                    }
                  />
                </Form.Item>
              </Card>
            </div>

            <div className="w-1/3">
              {/* Overall Rating */}
              <Card
                title={
                  <Title level={4}>
                    <AuditOutlined />{" "}
                    {t("employer.evaluation.overall.title") || "Overall Rating"}
                  </Title>
                }
                className="mb-6"
              >
                <Form.Item name="overallRating">
                  <Slider
                    min={0}
                    max={10}
                    step={0.1}
                    marks={{
                      0: "0",
                      5: "5",
                      10: "10",
                    }}
                  />
                </Form.Item>
              </Card>

              {/* Recommendation */}
              <Card
                title={
                  <Title level={4}>
                    <TeamOutlined />{" "}
                    {t("employer.evaluation.recommendation.title") ||
                      "Recommendation"}
                  </Title>
                }
                className="mb-6"
              >
                <Form.Item
                  name="isRecommended"
                  label={
                    <Text strong>
                      {t("employer.evaluation.recommendation.hire") ||
                        "Recommend to Hire"}
                    </Text>
                  }
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                {isRecommended && (
                  <>
                    <Form.Item
                      name="recommendedPosition"
                      label={
                        <Text strong>
                          {t("employer.evaluation.recommendation.position") ||
                            "Recommended Position"}
                        </Text>
                      }
                      rules={[
                        {
                          required: isRecommended,
                          message:
                            t(
                              "employer.evaluation.recommendation.position_required"
                            ) || "Please enter recommended position",
                        },
                      ]}
                    >
                      <Input
                        placeholder={
                          t(
                            "employer.evaluation.recommendation.position_placeholder"
                          ) || "e.g. Senior Java Developer"
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      name="recommendedSalary"
                      label={
                        <Text strong>
                          {t("employer.evaluation.recommendation.salary") ||
                            "Recommended Salary (VND)"}
                        </Text>
                      }
                      rules={[
                        {
                          required: isRecommended,
                          message:
                            t(
                              "employer.evaluation.recommendation.salary_required"
                            ) || "Please enter recommended salary",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        formatter={(value) =>
                          `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/₫\s?|(,*)/g, "")}
                        placeholder="30,000,000"
                        min={0}
                      />
                    </Form.Item>
                  </>
                )}
              </Card>

              {/* Submit Section */}
              <Card>
                <Alert
                  message={t("employer.evaluation.note") || "Note"}
                  description={
                    t("employer.evaluation.note_description") ||
                    "Your evaluation will be saved for future reference and used for candidate assessment."
                  }
                  type="info"
                  showIcon
                  className="mb-4"
                />

                <Form.Item>
                  <Flex gap={12} justify="end">
                    <Button
                      size="large"
                      onClick={() => navigate("/employer/interview")}
                      icon={<CloseCircleOutlined />}
                    >
                      {t("common.cancel") || "Cancel"}
                    </Button>
                    <Button
                      size="large"
                      type="primary"
                      htmlType="submit"
                      loading={submitting}
                      icon={<SaveOutlined />}
                    >
                      {t("employer.evaluation.submit") || "Submit Evaluation"}
                    </Button>
                  </Flex>
                </Form.Item>
              </Card>
            </div>
          </Flex>
        </Form>
      </BoxContainer>
    </Flex>
  );
};

export default CandidateEvaluation;
