import { Button, Col, Card, DatePicker, Descriptions, Flex, Form, Input, InputNumber, message, Row, Select, Typography, Steps, Divider, Tooltip } from 'antd';
import BoxContainer from '../../Generate/BoxContainer';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import CustomizeQuill from '../../Generate/CustomizeQuill';
import { useEffect, useState } from 'react';
import { getAllJobCategories, getAllJobLevels, getAllSkills, getJobPackage, postJob } from '../../../services/apiService';
import { useTranslation } from 'react-i18next';
import { SaveOutlined, ArrowLeftOutlined, ArrowRightOutlined, FileTextOutlined, BulbOutlined, AppstoreOutlined } from '@ant-design/icons';
import './EmployerPostJob.scss';

const { Text, Title } = Typography;
const { Step } = Steps;

const format = (value) => {
    if (!value) return '';
    const stringValue = `${value}`;
    const absoluteValue = stringValue.replace('-', '').replace('.', '');
    const formattedValue = absoluteValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return formattedValue;
}

const EmployerPostJob = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [skills, setSkills] = useState([]);
    const [levels, setLevels] = useState([]);
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const packageId = Form.useWatch('packageId', form);
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});

    const handlePackageChanged = (pkgId) => {
        const selectedPkg = packages.find(pkg => pkg.packageResponse.packageId === pkgId);
        setSelectedPackage(selectedPkg);
    };

    const steps = [
        {
            title: t('employer.job.basicInfo'),
            icon: <FileTextOutlined />
        },
        {
            title: t('employer.job.packageSelection'),
            icon: <AppstoreOutlined />
        },
        {
            title: t('employer.job.requirementsInfo'),
            icon: <BulbOutlined />
        }
    ];

    const validateCurrentStep = async () => {
        try {
            let values;
            switch (currentStep) {
                case 0:
                    values = await form.validateFields([
                        'jobTitle',
                        'jobLocation',
                        'jobCategoryId',
                        'jobMinSalary',
                        'jobMaxSalary',
                        'jobDeadline'
                    ]);
                    setFormData(prev => ({ ...prev, ...values }));
                    return true;
                case 1:
                    values = await form.validateFields(['packageId']);
                    setFormData(prev => ({ ...prev, ...values }));
                    return true;
                case 2:
                    values = await form.validateFields([
                        'amount',
                        'jobLevelId',
                        'skillIds',
                        'jobRequirements',
                        'jobDescription'
                    ]);
                    setFormData(prev => ({ ...prev, ...values }));
                    return true;
                default:
                    return true;
            }
        } catch (error) {
            console.error('Validation error:', error);
            return false;
        }
    };

    const next = async () => {
        const isValid = await validateCurrentStep();
        if (isValid && currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        getAllJobCategories().then((res) => {
            const filteredOptions = res.data
                .filter(item => item.active === true)
                .map(item => {
                    return { value: item.jobCategoryId, label: item.jobCategoryName };
                });
            setCategories(filteredOptions);
        });
        getAllJobLevels().then((res) => {
            const filteredOptions = res.data
                .filter(item => item.active === true)
                .map(item => {
                    return { value: item.jobLevelId, label: item.nameLevel };
                });
            setLevels(filteredOptions);
        });
        getAllSkills().then((res) => {
            const filteredOptions = res.data
                .filter(item => item.active === true)
                .map(item => {
                    return { value: item.skillId, label: item.skillName };
                });
            setSkills(filteredOptions);
        });
        getJobPackage().then((res) => {
            if (res.status === 'OK') {
                setPackages(res.data);
            }
        });
    }, []);

    const onFinish = (values) => {
        values = {
            ...values,
            ...formData,
          };
        setLoading(true);
        dayjs.extend(customParseFormat);
        values.jobDeadline = dayjs(values.jobDeadline, 'YYYY-MM-DD').format('DD/MM/YYYY');
        postJob(values).then((res) => {
            if (res.status === 'OK') {
                message.success(res.message);
                form.resetFields();
                setCurrentStep(0);
            }
            else {
                message.error(res.message);
            }
        }).catch((err) => {
            message.error(err.message);
        }).finally(() => {
            setLoading(false);
        });
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="step-content">
                        <Title level={4} className="step-title">{t('employer.job.basicInfo')}</Title>
                        <Row gutter={[24, 16]}>
                            <Col span={24}>
                                <Form.Item 
                                    name="jobTitle" 
                                    label={<span>{t('employer.job.title')} <span className='required-mark'>*</span></span>}
                                    rules={[
                                        { required: true, message: t('employer.job.titleRequired') },
                                    ]} 
                                    validateFirst 
                                    validateTrigger={['onChange', 'onBlur']}
                                >
                                    <Input placeholder={t('employer.job.titlePlaceholder') || "Enter job title"} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={14}>
                                <Form.Item 
                                    name="jobLocation" 
                                    label={<span>{t('employer.job.location')} <span className='required-mark'>*</span></span>}
                                    rules={[
                                        { required: true, message: t('employer.job.locationRequired') },
                                    ]} 
                                    validateFirst 
                                    validateTrigger={['onChange', 'onBlur']}
                                >
                                    <Input placeholder={t('employer.job.locationPlaceholder') || "Enter job location"} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={10}>
                                <Form.Item 
                                    name="jobCategoryId" 
                                    label={<span>{t('employer.job.category')} <span className='required-mark'>*</span></span>}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('employer.job.categoryRequired'),
                                        },
                                        () => ({
                                            validator(_, value) {
                                                if (value === 0) {
                                                    return Promise.reject(new Error(t('employer.job.categoryRequired')));
                                                }
                                                return Promise.resolve();
                                            },
                                        }),
                                    ]} 
                                    validateTrigger={['onChange', 'onBlur']}
                                >
                                    <Select 
                                        defaultValue={0}
                                        placeholder={t('employer.job.categoryPlaceholder')}
                                    >
                                        <Select.Option value={0}>{t('employer.job.categoryPlaceholder')}</Select.Option>
                                        {categories.map(category => (
                                            <Select.Option key={category.value} value={category.value}>
                                                {category.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item 
                                    name="jobMinSalary" 
                                    label={<span>{t('employer.job.minSalary')} <span className='required-mark'>*</span></span>}
                                    rules={[
                                        { required: true, message: t('employer.job.minSalaryRequired') },
                                    ]} 
                                    validateFirst 
                                    validateTrigger={['onChange', 'onBlur']}
                                >
                                    <InputNumber 
                                        addonAfter="VNĐ" 
                                        className='w-full'
                                        formatter={value => format(value)}
                                        parser={value => value.replace(/\s/g, '')}
                                        placeholder={t('employer.job.minSalaryPlaceholder') || "Min salary"} 
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item 
                                    name="jobMaxSalary" 
                                    label={<span>{t('employer.job.maxSalary')} <span className='required-mark'>*</span></span>}
                                    rules={[
                                        { required: true, message: t('employer.job.maxSalaryRequired') },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('jobMinSalary') <= value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error(t('employer.job.salaryError')));
                                            },
                                        }),
                                    ]} 
                                    validateFirst 
                                    validateTrigger={['onChange', 'onBlur']}
                                >
                                    <InputNumber 
                                        addonAfter="VNĐ" 
                                        className='w-full'
                                        formatter={value => format(value)}
                                        parser={value => value.replace(/\s/g, '')}
                                        placeholder={t('employer.job.maxSalaryPlaceholder') || "Max salary"} 
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item 
                                    name="jobDeadline" 
                                    label={<span>{t('employer.job.deadline')} <span className='required-mark'>*</span></span>} 
                                    rules={[
                                        {
                                            required: true,
                                            message: t('employer.job.deadlineRequired'),
                                        },
                                        {
                                            validator: (_, value) => {
                                                if (value && value.isBefore(dayjs().add(1, 'day'))) {
                                                    return Promise.reject(new Error(t('employer.job.deadlineFuture') || "Deadline must be in the future"));
                                                }
                                                return Promise.resolve();
                                            }
                                        }
                                    ]} 
                                    validateTrigger={['onChange']}
                                >
                                    <DatePicker 
                                        className='w-full' 
                                        format={"DD/MM/YYYY"} 
                                        placeholder={t('employer.job.deadlinePlaceholder')} 
                                        disabledDate={current => current && current < dayjs().endOf('day')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                );
            case 1:
                return (
                    <div className="step-content">
                        <Title level={4} className="step-title">{t('employer.job.selectPackage')}</Title>
                        <div className="package-selection">
                            <Form.Item 
                                name="packageId" 
                                label={t('employer.dashboard.servicePackage.title')}
                                rules={[
                                    { required: true, message: t('employer.job.packageRequired') || "Please select a package" },
                                ]}
                            >
                                <Select 
                                    placeholder={t('employer.job.packagePlaceholder')} 
                                    onChange={handlePackageChanged}
                                    className="package-select"
                                >
                                    {packages.length > 0 ? packages.map(pkg => (
                                        <Select.Option 
                                            key={pkg.packageResponse.packageId} 
                                            value={pkg.packageResponse.packageId} 
                                        >
                                            {pkg.packageResponse.packageName} ({pkg.packageResponse.amount})
                                        </Select.Option>
                                    )) : (
                                        <Select.Option disabled value="no-packages">
                                            {t('employer.job.noPackages') || "No packages available"}
                                        </Select.Option>
                                    )}
                                </Select>
                            </Form.Item>
                            
                            {packageId && (
                                <Card className="package-details-card">
                                    <Title level={5}>{t('employer.job.packageDetailTitle')}</Title>
                                    <Descriptions column={{ xs: 1, sm: 2 }} bordered>
                                        <Descriptions.Item 
                                            label={t('admin.servicePackage.form.packageName.label')}
                                            labelStyle={{ fontWeight: 500 }}
                                        >
                                            <Text strong>{selectedPackage?.packageResponse.packageName}</Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item 
                                            label={t('admin.servicePackage.list.feature')}
                                            labelStyle={{ fontWeight: 500 }}
                                        >
                                            <Text>{selectedPackage?.packageResponse.featureName}</Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item 
                                            label={t('admin.servicePackage.form.description.label')}
                                            labelStyle={{ fontWeight: 500 }}
                                            span={2}
                                        >
                                            <Text>{selectedPackage?.packageResponse.description}</Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item 
                                            label={t('employer.job.packageRemainingAmount')}
                                            labelStyle={{ fontWeight: 500 }}
                                        >
                                            <Text type={selectedPackage?.amount > 0 ? "success" : "danger"} strong>
                                                {selectedPackage?.amount}
                                            </Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item 
                                            label={t('employer.job.packageDuration')}
                                            labelStyle={{ fontWeight: 500 }}
                                        >
                                            <Text>{selectedPackage?.packageResponse.duration} {t('admin.servicePackage.list.months')}</Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item 
                                            label={t('employer.dashboard.servicePackage.table.expiredAt')}
                                            labelStyle={{ fontWeight: 500 }}
                                            span={2}
                                        >
                                            <Text>{selectedPackage?.expiredAt}</Text>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            )}
                            
                            {packages.length === 0 && (
                                <div className="no-packages-warning">
                                    <Text type="warning">
                                        {t('employer.job.buyPackageWarning') || "You don't have any active packages. Please purchase a package before posting a job."}
                                    </Text>
                                    <Button type="primary" href="/employer/buy-service">
                                        {t('employer.job.buyPackage') || "Buy Package"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="step-content">
                        <Title level={4} className="step-title">{t('employer.job.requirementsInfo')}</Title>
                        <Row gutter={[24, 24]}>
                            <Col xs={24} md={8}>
                                <Form.Item 
                                    name="amount" 
                                    label={<span>{t('employer.job.quantity')} <span className='required-mark'>*</span></span>}
                                    rules={[
                                        { required: true, message: t('employer.job.quantityRequired') },
                                        {
                                            type: 'number',
                                            min: 1,
                                            message: t('employer.job.quantityMin') || "Quantity must be at least 1"
                                        }
                                    ]} 
                                    validateFirst 
                                    validateTrigger={['onChange', 'onBlur']}
                                >
                                    <InputNumber 
                                        className='w-full'
                                        formatter={value => format(value)}
                                        parser={value => value.replace(/\s/g, '')}
                                        placeholder={t('employer.job.quantityPlaceholder') || "Number of positions"}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={16}>
                                <Form.Item 
                                    name="jobLevelId" 
                                    label={<span>{t('employer.job.level')} <span className='required-mark'>*</span></span>}
                                    rules={[
                                        { required: true, message: t('employer.job.levelRequired') },
                                        () => ({
                                            validator(_, value) {
                                                if (value === 0) {
                                                    return Promise.reject(new Error(t('employer.job.levelRequired')));
                                                }
                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}
                                >
                                    <Select 
                                        defaultValue={0}
                                        placeholder={t('employer.job.levelPlaceholder')}
                                    >
                                        <Select.Option value={0}>{t('employer.job.levelPlaceholder')}</Select.Option>
                                        {levels.map(level => (
                                            <Select.Option key={level.value} value={level.value}>
                                                {level.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item 
                                    name="skillIds" 
                                    label={<span>{t('employer.job.skills')} <span className='required-mark'>*</span></span>}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('employer.job.skillsRequired'),
                                        },
                                    ]} 
                                    validateFirst 
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select
                                        mode="multiple"
                                        size="large"
                                        placeholder={t('employer.job.skillsPlaceholder')}
                                        options={skills}
                                        filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item 
                                    name="jobRequirements" 
                                    label={<span>{t('employer.job.requirements')} <span className='required-mark'>*</span></span>}
                                    rules={[
                                        { required: true, message: t('employer.job.requirementsRequired') || "Please specify job requirements" },
                                    ]}
                                >
                                    <CustomizeQuill />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item 
                                    name="jobDescription" 
                                    label={<span>{t('employer.job.description')} <span className='required-mark'>*</span></span>}
                                    rules={[
                                        { required: true, message: t('employer.job.descriptionRequired') || "Please provide a job description" },
                                    ]}
                                >
                                    <CustomizeQuill />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <BoxContainer className='shadow-md form-header'>
                <Title level={3}>{t('employer.job.postJob')}</Title>
                <Text type="secondary">{t('employer.job.postJobDescription') || "Create a new job posting to find the perfect candidates"}</Text>
            </BoxContainer>
            
            <BoxContainer className='shadow-md form-container'>
                <Steps
                    current={currentStep}
                    items={steps.map((step, index) => ({
                        title: step.title,
                        icon: step.icon
                    }))}
                    className="job-post-steps"
                />
                
                <Divider className="step-divider" />
                
                <Form
                    onFinish={onFinish}
                    form={form}
                    size='large'
                    requiredMark={false}
                    autoComplete="off"
                    layout='vertical'
                    className="job-post-form"
                >
                    {renderStepContent()}
                    
                    <Divider className="step-divider" />
                    
                    <div className="steps-action">
                        {currentStep > 0 && (
                            <Button 
                                icon={<ArrowLeftOutlined />}
                                onClick={prev} 
                                style={{ marginRight: 8 }}
                            >
                                {t('common.previous')}
                            </Button>
                        )}
                        
                        {currentStep < steps.length - 1 && (
                            <Button 
                                type="primary" 
                                onClick={next}
                                icon={<ArrowRightOutlined />}
                            >
                                {t('common.next')}
                            </Button>
                        )}
                        
                        {currentStep === steps.length - 1 && (
                            <Tooltip title={t('employer.job.finalReviewTip') || "Review all information before submitting"}>
                                <Button 
                                    type="primary" 
                                    loading={loading} 
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                >
                                    {t('employer.job.post')}
                                </Button>
                            </Tooltip>
                        )}
                    </div>
                </Form>
            </BoxContainer>
        </>
    );
};

export default EmployerPostJob;