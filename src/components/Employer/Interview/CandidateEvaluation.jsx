import React, { useState, useEffect } from "react";
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
  Space,
  Switch,
  InputNumber,
  message,
  Flex,
  Spin,
  Divider,
  Alert,
  Progress,
  Tooltip,
  Avatar,
  Tag,
  Badge,
  Result,
  Popconfirm,
} from "antd";
import "./CandidateEvaluation.scss";
import {
  CheckCircleOutlined,
  UserOutlined,
  StarOutlined,
  DollarOutlined,
  AuditOutlined,
  SolutionOutlined,
  SaveOutlined,
  CloseCircleOutlined,
  ExperimentOutlined,
  TeamOutlined,
  MessageOutlined,
  BulbOutlined,
  InfoCircleOutlined,
  TrophyOutlined,
  FileDoneOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  SmileOutlined,
  FrownOutlined,
  MehOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import BoxContainer from "../../Generate/BoxContainer";
import interview from "../../../services/api/interview";
import "./CandidateEvaluation.scss";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const CandidateEvaluation = () => {
  const { t } = useTranslation();
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [isRecommended, setIsRecommended] = useState(true);
  const [loading, setLoading] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formCompletionPercent, setFormCompletionPercent] = useState(0);
  const [ratingDescriptions, setRatingDescriptions] = useState({});
  const employer = useSelector((state) => state.employer);
  
  // Descriptions for rating values
  const getRatingDescription = (field, value) => {
    const descriptions = {
      technicalSkills: {
        1: t('employer.evaluation.skills.technical_1') || 'Very Poor - Lacks basic understanding',
        2: t('employer.evaluation.skills.technical_2') || 'Poor - Has fundamental gaps',
        3: t('employer.evaluation.skills.technical_3') || 'Below Average - Basic understanding with limitations',
        4: t('employer.evaluation.skills.technical_4') || 'Average - Adequate technical knowledge',
        5: t('employer.evaluation.skills.technical_5') || 'Above Average - Good technical competency',
        6: t('employer.evaluation.skills.technical_6') || 'Good - Solid technical proficiency',
        7: t('employer.evaluation.skills.technical_7') || 'Very Good - Strong technical skills',
        8: t('employer.evaluation.skills.technical_8') || 'Excellent - Advanced technical expertise',
        9: t('employer.evaluation.skills.technical_9') || 'Outstanding - Exceptional technical mastery',
        10: t('employer.evaluation.skills.technical_10') || 'Perfect - Expert-level technical excellence'
      },
      communicationSkills: {
        1: t('employer.evaluation.skills.communication_1') || 'Very Poor - Unable to communicate clearly',
        2: t('employer.evaluation.skills.communication_2') || 'Poor - Difficult to understand',
        3: t('employer.evaluation.skills.communication_3') || 'Below Average - Communication needs improvement',
        4: t('employer.evaluation.skills.communication_4') || 'Average - Adequately communicates ideas',
        5: t('employer.evaluation.skills.communication_5') || 'Above Average - Good communication skills',
        6: t('employer.evaluation.skills.communication_6') || 'Good - Clear and effective communicator',
        7: t('employer.evaluation.skills.communication_7') || 'Very Good - Articulate and persuasive',
        8: t('employer.evaluation.skills.communication_8') || 'Excellent - Exceptional communication ability',
        9: t('employer.evaluation.skills.communication_9') || 'Outstanding - Masterful communicator',
        10: t('employer.evaluation.skills.communication_10') || 'Perfect - Expert-level communication skills'
      },
      cultureFit: {
        1: t('employer.evaluation.skills.culture_1') || 'Very Poor - Would not fit with team culture',
        2: t('employer.evaluation.skills.culture_2') || 'Poor - Significant cultural alignment issues',
        3: t('employer.evaluation.skills.culture_3') || 'Below Average - Some cultural fit concerns',
        4: t('employer.evaluation.skills.culture_4') || 'Average - Acceptable cultural alignment',
        5: t('employer.evaluation.skills.culture_5') || 'Above Average - Good cultural compatibility',
        6: t('employer.evaluation.skills.culture_6') || 'Good - Aligns well with team values',
        7: t('employer.evaluation.skills.culture_7') || 'Very Good - Strong cultural alignment',
        8: t('employer.evaluation.skills.culture_8') || 'Excellent - Exceptional cultural fit',
        9: t('employer.evaluation.skills.culture_9') || 'Outstanding - Perfect alignment with values',
        10: t('employer.evaluation.skills.culture_10') || 'Perfect - Would enhance team culture'
      },
      problemSolving: {
        1: t('employer.evaluation.skills.problem_1') || 'Very Poor - Cannot solve basic problems',
        2: t('employer.evaluation.skills.problem_2') || 'Poor - Struggles with problem-solving',
        3: t('employer.evaluation.skills.problem_3') || 'Below Average - Limited problem-solving skills',
        4: t('employer.evaluation.skills.problem_4') || 'Average - Adequate problem-solving ability',
        5: t('employer.evaluation.skills.problem_5') || 'Above Average - Good problem-solving skills',
        6: t('employer.evaluation.skills.problem_6') || 'Good - Effective problem-solver',
        7: t('employer.evaluation.skills.problem_7') || 'Very Good - Strong analytical abilities',
        8: t('employer.evaluation.skills.problem_8') || 'Excellent - Creative and efficient problem-solver',
        9: t('employer.evaluation.skills.problem_9') || 'Outstanding - Exceptional problem-solving capabilities',
        10: t('employer.evaluation.skills.problem_10') || 'Perfect - Master problem-solver'
      },
      attitude: {
        1: t('employer.evaluation.skills.attitude_1') || 'Very Poor - Negative attitude',
        2: t('employer.evaluation.skills.attitude_2') || 'Poor - Generally poor attitude',
        3: t('employer.evaluation.skills.attitude_3') || 'Below Average - Attitude needs improvement',
        4: t('employer.evaluation.skills.attitude_4') || 'Average - Acceptable attitude',
        5: t('employer.evaluation.skills.attitude_5') || 'Above Average - Positive attitude most of the time',
        6: t('employer.evaluation.skills.attitude_6') || 'Good - Consistently positive attitude',
        7: t('employer.evaluation.skills.attitude_7') || 'Very Good - Great attitude and enthusiasm',
        8: t('employer.evaluation.skills.attitude_8') || 'Excellent - Excellent attitude and motivation',
        9: t('employer.evaluation.skills.attitude_9') || 'Outstanding - Exceptional positive attitude',
        10: t('employer.evaluation.skills.attitude_10') || 'Perfect - Inspirational attitude and demeanor'
      }
    };
    
    return descriptions[field]?.[value] || '';
  };
    // Calculate overall rating based on skills ratings
  const calculateOverallRating = () => {
    const technicalSkills = form.getFieldValue('technicalSkills') || 0;
    const communicationSkills = form.getFieldValue('communicationSkills') || 0;
    const cultureFit = form.getFieldValue('cultureFit') || 0;
    const problemSolving = form.getFieldValue('problemSolving') || 0;
    const attitude = form.getFieldValue('attitude') || 0;
    
    const average = (technicalSkills + communicationSkills + cultureFit + problemSolving + attitude) / 5;
    const rounded = Math.round(average * 10) / 10;
    form.setFieldsValue({ overallRating: rounded });
    
    return rounded;
  };
  
  // Update form completion percentage
  const updateFormCompletionPercent = () => {
    const formValues = form.getFieldsValue();
    const requiredFields = [
      'technicalSkills', 'communicationSkills', 'cultureFit', 'problemSolving', 
      'attitude', 'strengths', 'weaknesses', 'overallNotes'
    ];
    
    const recommendationFields = isRecommended 
      ? ['recommendedPosition', 'recommendedSalary'] 
      : [];
    
    const allRequiredFields = [...requiredFields, ...recommendationFields];
    const completedFields = allRequiredFields.filter(field => {
      const value = formValues[field];
      return value !== undefined && value !== null && value !== '';
    });
    
    const percent = Math.round((completedFields.length / allRequiredFields.length) * 100);
    setFormCompletionPercent(percent);
  };
  
  // Get rating emoji based on value
  const getRatingEmoji = (value) => {
    if (value >= 9) return <SmileOutlined style={{ color: '#52c41a' }} />;
    if (value >= 7) return <SmileOutlined style={{ color: '#1890ff' }} />;
    if (value >= 5) return <MehOutlined style={{ color: '#faad14' }} />;
    if (value >= 3) return <FrownOutlined style={{ color: '#fa8c16' }} />;
    return <FrownOutlined style={{ color: '#f5222d' }} />;
  };
  
  // Get overall rating text description
  const getOverallRatingText = (value) => {
    if (value >= 9) return t('employer.evaluation.rating.excellent') || 'Excellent';
    if (value >= 7) return t('employer.evaluation.rating.veryGood') || 'Very Good';
    if (value >= 5) return t('employer.evaluation.rating.average') || 'Average';
    if (value >= 3) return t('employer.evaluation.rating.belowAverage') || 'Below Average';
    return t('employer.evaluation.rating.poor') || 'Poor';
  };
  
  // Load interview details
  const loadInterviewDetails = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch candidate details from an API
      // Mocking this for now
      setTimeout(() => {
        setCandidateInfo({
          name: "John Doe",
          position: "Senior Developer",
          date: new Date().toLocaleDateString()
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading interview details:", error);
      message.error(t('employer.evaluation.error.loading'));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!interviewId) {
      message.error(t('employer.evaluation.error.invalid_id'));
      navigate('/employer/interview');
    } else {
      loadInterviewDetails();
    }
  }, [interviewId, navigate, t]);
  
  // Update form completion percentage when form values change
  useEffect(() => {
    updateFormCompletionPercent();
  }, [form.getFieldsValue()]);
  const onFinish = async (values) => {
    setSubmitting(true);
    
    try {
      // Add the current employer ID as evaluator
      values.evaluatedBy = employer.id;
      values.interviewId = parseInt(interviewId);
      
      // Convert ratings to numbers
      const numericFields = [
        'technicalSkills', 
        'communicationSkills', 
        'cultureFit', 
        'problemSolving', 
        'attitude', 
        'overallRating',
        'recommendedSalary',
        'interviewId',
        'evaluatedBy'
      ];
      
      numericFields.forEach(field => {
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
          content: t('employer.evaluation.success'),
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
          duration: 3
        });
        
        // Simulate showing a success result and then redirect
        setCurrentStep(2); // Move to success state
        
        // Redirect back to interview list after showing success
        setTimeout(() => {
          navigate('/employer/interview');
        }, 3000);
      } else {
        throw new Error(response?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Evaluation submission error:", error);
      message.error({
        content: t('employer.evaluation.error.submission'),
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        duration: 5
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle form field change
  const handleFieldChange = (changedValues, allValues) => {
    // Update overall rating when individual ratings change
    if (
      'technicalSkills' in changedValues || 
      'communicationSkills' in changedValues ||
      'cultureFit' in changedValues ||
      'problemSolving' in changedValues ||
      'attitude' in changedValues
    ) {
      calculateOverallRating();
      
      // Update rating description if a single skill rating changed
      const changedField = Object.keys(changedValues)[0];
      const ratingFields = ['technicalSkills', 'communicationSkills', 'cultureFit', 'problemSolving', 'attitude'];
      
      if (ratingFields.includes(changedField)) {
        const value = changedValues[changedField];
        if (value) {
          setRatingDescriptions(prev => ({
            ...prev,
            [changedField]: getRatingDescription(changedField, value)
          }));
        }
      }
    }
    
    // Update isRecommended state when that field changes
    if ('isRecommended' in changedValues) {
      setIsRecommended(allValues.isRecommended);
    }
    
    // Update form completion percentage
    updateFormCompletionPercent();
  };

  return (
    <Flex vertical gap={20}>
      <BoxContainer className="shadow-md">
        <div className="title1">{t('employer.evaluation.title') || 'Candidate Evaluation'}</div>
        <p className="text-gray-500 mt-2">
          {t('employer.evaluation.subtitle') || 'Evaluate the candidate based on the interview performance'}
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
            recommendedSalary: 0
          }}
          onValuesChange={(_, allValues) => {
            // Update overall rating when individual ratings change
            if (
              'technicalSkills' in _ || 
              'communicationSkills' in _ ||
              'cultureFit' in _ ||
              'problemSolving' in _ ||
              'attitude' in _
            ) {
              calculateOverallRating();
            }
            
            // Update isRecommended state when that field changes
            if ('isRecommended' in _) {
              setIsRecommended(allValues.isRecommended);
            }
          }}
        >
          <Flex gap={24}>
            <div className="w-2/3">
              {/* Skills Assessment */}
              <Card 
                title={<Title level={4}><ExperimentOutlined /> {t('employer.evaluation.skills.title') || 'Skills Assessment'}</Title>} 
                className="mb-6"
              >
                <Form.Item 
                  name="technicalSkills" 
                  label={<Text strong>{t('employer.evaluation.skills.technical') || 'Technical Skills'}</Text>}
                >
                  <Rate 
                    allowHalf 
                    count={10} 
                    character={<StarOutlined />} 
                    tooltips={Array(10).fill().map((_, i) => `${i + 1}`)}
                  />
                </Form.Item>
                
                <Form.Item 
                  name="communicationSkills" 
                  label={<Text strong>{t('employer.evaluation.skills.communication') || 'Communication Skills'}</Text>}
                >
                  <Rate 
                    allowHalf 
                    count={10} 
                    character={<StarOutlined />} 
                    tooltips={Array(10).fill().map((_, i) => `${i + 1}`)}
                  />
                </Form.Item>
                
                <Form.Item 
                  name="cultureFit" 
                  label={<Text strong>{t('employer.evaluation.skills.culture_fit') || 'Culture Fit'}</Text>}
                >
                  <Rate 
                    allowHalf 
                    count={10} 
                    character={<StarOutlined />} 
                    tooltips={Array(10).fill().map((_, i) => `${i + 1}`)}
                  />
                </Form.Item>
                
                <Form.Item 
                  name="problemSolving" 
                  label={<Text strong>{t('employer.evaluation.skills.problem_solving') || 'Problem Solving'}</Text>}
                >
                  <Rate 
                    allowHalf 
                    count={10} 
                    character={<StarOutlined />} 
                    tooltips={Array(10).fill().map((_, i) => `${i + 1}`)}
                  />
                </Form.Item>
                
                <Form.Item 
                  name="attitude" 
                  label={<Text strong>{t('employer.evaluation.skills.attitude') || 'Attitude'}</Text>}
                >
                  <Rate 
                    allowHalf 
                    count={10} 
                    character={<StarOutlined />} 
                    tooltips={Array(10).fill().map((_, i) => `${i + 1}`)}
                  />
                </Form.Item>
              </Card>
              
              {/* Notes */}
              <Card 
                title={<Title level={4}><MessageOutlined /> {t('employer.evaluation.notes.title') || 'Feedback Notes'}</Title>} 
                className="mb-6"
              >
                <Form.Item 
                  name="strengths" 
                  label={<Text strong>{t('employer.evaluation.notes.strengths') || 'Strengths'}</Text>}
                  rules={[{ required: true, message: t('employer.evaluation.notes.strengths_required') || 'Please provide candidate strengths' }]}
                >
                  <TextArea rows={3} placeholder={t('employer.evaluation.notes.strengths_placeholder') || 'List candidate strengths and positive observations'} />
                </Form.Item>
                
                <Form.Item 
                  name="weaknesses" 
                  label={<Text strong>{t('employer.evaluation.notes.weaknesses') || 'Areas for Improvement'}</Text>}
                  rules={[{ required: true, message: t('employer.evaluation.notes.weaknesses_required') || 'Please provide areas for improvement' }]}
                >
                  <TextArea rows={3} placeholder={t('employer.evaluation.notes.weaknesses_placeholder') || 'List areas where the candidate could improve'} />
                </Form.Item>
                
                <Form.Item 
                  name="overallNotes" 
                  label={<Text strong>{t('employer.evaluation.notes.overall') || 'Overall Notes'}</Text>}
                  rules={[{ required: true, message: t('employer.evaluation.notes.overall_required') || 'Please provide overall notes' }]}
                >
                  <TextArea rows={4} placeholder={t('employer.evaluation.notes.overall_placeholder') || 'General comments and evaluation summary'} />
                </Form.Item>
              </Card>
            </div>
            
            <div className="w-1/3">
              {/* Overall Rating */}
              <Card 
                title={<Title level={4}><AuditOutlined /> {t('employer.evaluation.overall.title') || 'Overall Rating'}</Title>} 
                className="mb-6"
              >
                <Form.Item name="overallRating">
                  <Slider 
                    min={0} 
                    max={10} 
                    step={0.1} 
                    marks={{
                      0: '0',
                      5: '5',
                      10: '10'
                    }} 
                  />
                </Form.Item>
              </Card>
              
              {/* Recommendation */}
              <Card 
                title={<Title level={4}><TeamOutlined /> {t('employer.evaluation.recommendation.title') || 'Recommendation'}</Title>} 
                className="mb-6"
              >
                <Form.Item 
                  name="isRecommended" 
                  label={<Text strong>{t('employer.evaluation.recommendation.hire') || 'Recommend to Hire'}</Text>}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                
                {isRecommended && (
                  <>
                    <Form.Item 
                      name="recommendedPosition" 
                      label={<Text strong>{t('employer.evaluation.recommendation.position') || 'Recommended Position'}</Text>}
                      rules={[{ required: isRecommended, message: t('employer.evaluation.recommendation.position_required') || 'Please enter recommended position' }]}
                    >
                      <Input placeholder={t('employer.evaluation.recommendation.position_placeholder') || 'e.g. Senior Java Developer'} />
                    </Form.Item>
                    
                    <Form.Item 
                      name="recommendedSalary" 
                      label={<Text strong>{t('employer.evaluation.recommendation.salary') || 'Recommended Salary (VND)'}</Text>}
                      rules={[{ required: isRecommended, message: t('employer.evaluation.recommendation.salary_required') || 'Please enter recommended salary' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/₫\s?|(,*)/g, '')}
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
                  message={t('employer.evaluation.note') || "Note"}
                  description={t('employer.evaluation.note_description') || "Your evaluation will be saved for future reference and used for candidate assessment."}
                  type="info" 
                  showIcon 
                  className="mb-4"
                />
                
                <Form.Item>
                  <Flex gap={12} justify="end">
                    <Button 
                      onClick={() => navigate('/employer/interview')}
                      icon={<CloseCircleOutlined />}
                    >
                      {t('common.cancel') || 'Cancel'}
                    </Button>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={submitting}
                      icon={<SaveOutlined />}
                    >
                      {t('employer.evaluation.submit') || 'Submit Evaluation'}
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
