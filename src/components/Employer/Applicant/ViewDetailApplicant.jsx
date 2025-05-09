import { Affix, Button, Col, DatePicker, Flex, Form, Input, InputNumber, message, Modal, Radio, Row, Space, Typography } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import ViewCV from "../../Student/CV/ViewCV";
import styles from "./ViewDetailApplicant.module.scss";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useParams, useLocation } from "react-router-dom";
import { convertStatus,  } from "../../../services/apiService";
import { useEffect, useState } from "react";
import './ModalInterview.scss';
import CustomizeQuill from './../../Generate/CustomizeQuill';
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { loading, stop } from "../../../redux/action/webSlice";
import { useTranslation } from "react-i18next";
import interview from "../../../services/api/interview";

const { Text } = Typography;
const ViewDetailApplicant = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [studentId, setStudentId] = useState(null);
    const [resumeId, setResumeId] = useState(null);
    const [email, setEmail] = useState(null);
    const [jobTitle, setJobTitle] = useState("");

    useEffect(() => {
        if (location.state?.status === "PENDING") {
            convertStatus(id, "VIEWED");
        }
        
        // Lấy thông tin job title từ location state nếu có
        if (location.state?.jobTitle) {
            setJobTitle(location.state.jobTitle);
        } else if (location.state?.job?.jobTitle) {
            setJobTitle(location.state.job.jobTitle);
        }
    }, [location.state, id]);

    const handleReject = () => {
        convertStatus(id, "REJECTED").then((res) => {
            if (res.status === "OK") {
                message.success(res.message);
            }
        });
    }

    return (
        <Flex vertical gap={20}>
            {location.state?.status !== 'APPROVED' && <Affix Affix offsetTop={80}>
                <BoxContainer className={styles.box_container}>
                    <Flex justify='space-between' align='center'>
                        <Text className="mb-0 title1">{t('employer.applicant.viewDetail.title')}</Text>
                        <Flex gap={10} align='center'>
                            <Button icon={<CheckOutlined />} size="large" type="primary" className={styles.btn_success} onClick={() => setOpen(true)}>{t('employer.applicant.viewDetail.approve')}</Button>
                            {location.state?.status !== 'REJECTED' && <Button icon={<CloseOutlined />} size="large" type="primary" danger onClick={handleReject}>{t('employer.applicant.viewDetail.reject')}</Button>}
                        </Flex>
                    </Flex>
                </BoxContainer>
            </Affix>}
            <ViewCV setStudentId={setStudentId} setResumeId={setResumeId} setEmail={setEmail} />
            <ModalInterview open={open} setOpen={setOpen} resumeId={resumeId} studentId={studentId} email={email} jobTitle={jobTitle} />
        </Flex >
    )
}

export const ModalInterview = ({ open, setOpen, studentId, resumeId, email, jobTitle }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const location = useLocation();
    const [type, setType] = useState("ONLINE");
    const employerId = useSelector(state => state.employer.id);
    const dispatch = useDispatch();
    const load = useSelector(state => state.web.loading);
    const { id } = useParams();

    // Thiết lập thời gian mặc định là thời gian hiện tại, cộng thêm 1 tiếng
    const defaultInterviewTime = dayjs().add(1, 'hour');

    // Log ra để debug
    console.log("Job Title from prop:", jobTitle);
    console.log("Job Title from location:", location.state?.jobTitle);

    useEffect(() => {
        // Khi modal mở, thiết lập giá trị job title vào form
        if (open) {
            form.setFieldsValue({
                jobPosition: jobTitle || location.state?.jobTitle || ""
            });
        }
    }, [open, jobTitle, form, location.state?.jobTitle]);

    const generateLink = () => {
        const link = window.location.protocol + '//' + window.location.host + '/meeting/' + Math.floor(100000 + Math.random() * 900000);
        return link;
    }

    const handleOk = () => {
        form.submit();
    }

    const handleCancel = () => {
        form.resetFields();
        setOpen(false);
    }

    const handleSubmit = (values) => {
        values.studentId = studentId;
        if (type === "ONLINE") {
            const payload = {
                jobId: location.state?.jobId,
                resumeId: resumeId,
                candidateEmail: email,
                title: values.jobPosition,
                description: values.description,
                startTime: dayjs(values.interviewDate).toISOString(),
                link: values.link,
                durationMinutes: values.durationMinutes,
                attendeeEmails: [email],
            }
            dispatch(loading());
            interview.createInterview(payload).then((res) => {
                if (res.status === "OK") {
                    message.success(t('employer.interview.create.message.success'));
                }else if (res.status === "UNAUTHORIZED") {
                    window.open(res.data.url, "_blank");
                }
            }).catch((err) => {
                console.error(err);
                message.error(t('employer.interview.create.message.error'));
            }
            ).finally(() => {
                convertStatus(id, "APPROVED").then((response) => {
                    if (response.status === "OK") {
                        handleCancel();
                    }
                }).catch((err) => {
                    message.error(err.message);
                }).finally(() => {
                    dispatch(stop());
                    form.resetFields();
                });
            });
        } else {
            values.employerId = employerId;
            values.dateTime = dayjs(values.dateTime).format('YYYY-MM-DD HH:mm:ss');
        }
    }

    const disablePastDates = (current) => {
        return current && current < new Date().setHours(0, 0, 0, 0);
    };

    const onlineForm = (
        <div className="interview-form-container">
            <div className="form-section">
                <div className="section-header">
                    <div className="section-icon">📋</div>
                    <div className="section-title">Thông tin phỏng vấn</div>
                </div>
                <Row gutter={16}>
                    <Col xs={24} md={24}>
                        <Form.Item required label={t('employer.applicant.viewDetail.interview.position.label')} name='jobPosition' rules={[{ required: true, message: t('employer.applicant.viewDetail.interview.position.required') }]} >
                            <Input allowClear placeholder={t('employer.applicant.viewDetail.interview.position.placeholder')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item required label={t('employer.applicant.viewDetail.interview.time.label')} name='interviewDate' rules={[{ required: true, message: t('employer.applicant.viewDetail.interview.time.required') }]} >
                            <DatePicker placeholder={t('employer.applicant.viewDetail.interview.time.placeholder')} allowClear showTime className="w-full" format={'DD/MM/YYYY HH:mm:ss'} disabledDate={disablePastDates} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item className="w-full" required label={t('employer.applicant.viewDetail.interview.duration.label')} name='durationMinutes' rules={[{ required: true, message: t('employer.applicant.viewDetail.interview.duration.required') }]} >
                            <InputNumber min={1} className="w-full" placeholder={t('employer.applicant.viewDetail.interview.duration.placeholder')} addonAfter="phút" />
                        </Form.Item>
                    </Col>
                </Row>
            </div>

            <div className="form-section">
                <div className="section-header">
                    <div className="section-icon">🔗</div>
                    <div className="section-title">Link phỏng vấn</div>
                </div>
                <Row gutter={16}>
                    <Col xs={24}>
                        <Form.Item required name="link" layout="vertical" label={t('employer.applicant.viewDetail.interview.location.online.label')} rules={[{ required: true, message: t('employer.applicant.viewDetail.interview.location.online.required') }]} >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                </Row>
            </div>

            <div className="form-section">
                <div className="section-header">
                    <div className="section-icon">📝</div>
                    <div className="section-title">Thông tin bổ sung</div>
                </div>
                <Row gutter={16}>
                    <Col xs={24}>
                        <Form.Item label={t('employer.applicant.viewDetail.interview.additionalInfo.label')} name='description' >
                            <Input.TextArea allowClear rows={4} placeholder={t('employer.applicant.viewDetail.interview.additionalInfo.placeholder')} />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
        </div>
    );

    const offlineForm = (
        <div className="interview-form-container">
            <div className="form-section">
                <div className="section-header">
                    <div className="section-icon">📋</div>
                    <div className="section-title">Thông tin phỏng vấn</div>
                </div>
                <Row gutter={16}>
                    <Col xs={24} md={24}>
                        <Form.Item required label={t('employer.applicant.viewDetail.interview.position.label')} name='jobPosition' rules={[{ required: true, message: t('employer.applicant.viewDetail.interview.position.required') }]} >
                            <Input allowClear placeholder={t('employer.applicant.viewDetail.interview.position.placeholder')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item required label={t('employer.applicant.viewDetail.interview.time.label')} name='dateTime' rules={[{ required: true, message: t('employer.applicant.viewDetail.interview.time.required') }]} >
                            <DatePicker placeholder={t('employer.applicant.viewDetail.interview.time.placeholder')} allowClear showTime className="w-full" format={'DD/MM/YYYY HH:mm:ss'} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label={t('employer.applicant.viewDetail.interview.language.label')} name='language' required rules={[{ required: true, message: t('employer.applicant.viewDetail.interview.language.required') }]} >
                            <Input allowClear placeholder={t('employer.applicant.viewDetail.interview.language.placeholder')} />
                        </Form.Item>
                    </Col>
                </Row>
            </div>

            <div className="form-section">
                <div className="section-header">
                    <div className="section-icon">📍</div>
                    <div className="section-title">Địa điểm phỏng vấn</div>
                </div>
                <Row gutter={16}>
                    <Col xs={24}>
                        <Form.Item required label={t('employer.applicant.viewDetail.interview.location.offline.label')} name='location' rules={[{ required: true, message: t('employer.applicant.viewDetail.interview.location.offline.required') }]} >
                            <Input allowClear placeholder={t('employer.applicant.viewDetail.interview.location.offline.placeholder')} />
                        </Form.Item>
                    </Col>
                </Row>
            </div>

            <div className="form-section">
                <div className="section-header">
                    <div className="section-icon">📝</div>
                    <div className="section-title">Thông tin bổ sung</div>
                </div>
                <Row gutter={16}>
                    <Col xs={24}>
                        <Form.Item label={t('employer.applicant.viewDetail.interview.additionalInfo')} name='description' >
                            <CustomizeQuill />
                        </Form.Item>
                    </Col>
                </Row>
            </div>

            <div className="form-section">
                <div className="section-header">
                    <div className="section-icon">👤</div>
                    <div className="section-title">Thông tin liên hệ</div>
                </div>
                <Form.Item required label={t('employer.applicant.viewDetail.interview.contact.label')} tooltip={t('employer.applicant.viewDetail.interview.contact.tooltip')} >
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item name='phoneNumber' rules={[
                                { required: true, message: t('employer.applicant.viewDetail.interview.contact.phone.required') },
                                {
                                    pattern: new RegExp(/^(0[3|5|7|8|9])[0-9]{8}$/),
                                    message: t('employer.applicant.viewDetail.interview.contact.phone.invalid')
                                }]} validateFirst >
                                <Input allowClear placeholder={t('employer.applicant.viewDetail.interview.contact.phone.placeholder')} prefix={<span className="contact-prefix">📞</span>} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item allowClear name='name' rules={[{ required: true, message: t('employer.applicant.viewDetail.interview.contact.name.required') }]}>
                                <Space.Compact>
                                    <Input className="text-base" value={t('employer.applicant.viewDetail.interview.contact.name.prefix')} disabled style={{ width: 'fit-content' }} />
                                    <Input allowClear placeholder={t('employer.applicant.viewDetail.interview.contact.name.placeholder')} />
                                </Space.Compact>
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item name='email'
                                rules={[
                                    { required: true, message: t('employer.applicant.viewDetail.interview.contact.email.required') },
                                    { type: 'email', message: t('employer.applicant.viewDetail.interview.contact.email.invalid') },
                                ]} validateFirst validateTrigger={['onBlur']}>
                                <Input allowClear placeholder={t('employer.applicant.viewDetail.interview.contact.email.placeholder')} prefix={<span className="contact-prefix">✉️</span>} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form.Item>
            </div>
        </div>
    );

    return <Modal 
        closable={true} 
        className="modal_interview" 
        width={800} 
        centered 
        title={<div className="interview-modal-title">
            <span className="interview-icon">📅</span> 
            {t('employer.applicant.viewDetail.interview.title')}
        </div>} 
        open={open}
        onCancel={handleCancel}
        footer={[
            <Button size="large" key="back" onClick={handleCancel}>{t('employer.applicant.viewDetail.interview.cancel')}</Button>,
            <Button loading={load} size="large" key="submit" type="primary" onClick={handleOk}>{t('employer.applicant.viewDetail.interview.send')}</Button>,
        ]}
    >
        <Form 
            autoComplete="on" 
            layout="vertical" 
            required 
            size="large" 
            form={form} 
            onFinish={handleSubmit} 
            initialValues={{ 
                link: generateLink(),
                jobPosition: jobTitle || location.state?.jobTitle || "", 
                interviewDate: defaultInterviewTime,
                dateTime: defaultInterviewTime,
                durationMinutes: 60
            }}
        >
            <div className="interview-type-selector">
                <div 
                    className={`type-option ${type === "ONLINE" ? "active" : ""}`} 
                    onClick={() => { 
                        form.resetFields(); 
                        setType("ONLINE"); 
                        form.setFieldsValue({ 
                            link: generateLink(),
                            jobPosition: jobTitle || location.state?.jobTitle || "",
                            interviewDate: defaultInterviewTime,
                            durationMinutes: 60
                        }); 
                    }}
                >
                    <span className="type-icon">💻</span>
                    <span className="type-label">{t('employer.applicant.viewDetail.interview.type.online')}</span>
                    <Radio checked={type === "ONLINE"} />
                </div>
                <div 
                    className={`type-option ${type === "OFFLINE" ? "active" : ""}`}
                    onClick={() => { 
                        form.resetFields(); 
                        setType("OFFLINE"); 
                        form.setFieldsValue({
                            jobPosition: jobTitle || location.state?.jobTitle || "",
                            dateTime: defaultInterviewTime,
                            durationMinutes: 60
                        });
                    }}
                >
                    <span className="type-icon">🏢</span>
                    <span className="type-label">{t('employer.applicant.viewDetail.interview.type.offline')}</span>
                    <Radio checked={type === "OFFLINE"} />
                </div>
            </div>
            
            {type === "ONLINE" ? onlineForm : offlineForm}
        </Form>
    </Modal>
}

export default ViewDetailApplicant;