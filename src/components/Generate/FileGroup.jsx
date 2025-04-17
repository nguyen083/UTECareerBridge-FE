import { useEffect, useState } from 'react';
import { Card, Radio, Typography, Flex, Upload, message, Modal, Form, Input, Select, Progress } from 'antd';
import { PaperClipOutlined, MoreOutlined, InboxOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useResume, useUploadResume } from '../../composables/resume';
import { deleteImageFromCloudinaryByLink, uploadToCloudinary } from '../../services/uploadCloudary';
import { getAllJobLevels } from '../../services/apiService';


const { Text } = Typography;
const { Dragger } = Upload;
const { Option } = Select;
const FileGroup = ({ formData, setFormData }) => {
    const resumeMutate = useUploadResume();
    const { data: resumeData } = useResume();
    const [data, setData] = useState([]);
    const { t } = useTranslation();
    const [url, setUrl] = useState('');
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [levelOptions, setLevelOptions] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        getAllJobLevels().then((res) => {
            setLevelOptions(res.data
                .filter((item) => item.active === true)  
                .map((item) => {
                    return {
                        value: item.jobLevelId,  
                        label: item.nameLevel     
                    }
                })
            );
        });
    }, []);

    const handleChange = (event) => {
        setFormData(prev => ({ ...prev, resumeId: event.target.value }));
    };

    const handleUpload = async (file) => {
        try {
            setUploading(true);
            const url = await uploadToCloudinary(file, "student", (progress) => {
                setUploadProgress(progress);
            });
            setUrl(url);
            message.success(t('cv.upload.success'));
            setVisible(true);
           
        } catch (error) {
            message.error(t('cv.upload.error'));
            console.error(error);
        }finally {
            setUploading(false);
            setUploadProgress(0);
        }
    }

    const handleSubmit = (values) => {
        resumeMutate.mutate({ ...values, resumeFile: url },{
            onSuccess: (res) => {
                if (res.status === 'OK') {
                    message.success(res.message);
                } else {
                    message.error(res.message);
                }
            },
            onError: (err) => {
                message.error("Cập nhật hồ sơ thất bại, ", err);
            }
        });
        setVisible(false);
        form.resetFields();
    }
    const handleCancel = () => {
        deleteImageFromCloudinaryByLink(url).then(() => {
            form.resetFields();
            setVisible(false);
        })
    }

    useEffect(() => {
        visible === false && setUrl("")
    }, [visible]);
    
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
                if (isMounted && resumeData?.data) {
                    setData(resumeData.data);
                    if (resumeData.data.length > 0) {
                        setFormData(prev => ({ ...prev, resumeId: resumeData.data[0].resumeId }));
                    }
                }
            }
        fetchData();
        return () => {
            isMounted = false;
        };
    }, [resumeData]);

    return (
        <Flex vertical gap={16}>
        {data.length < 3 && <Dragger
            maxCount={1}
            showUploadList={false}
            accept=".doc,.docx,.pdf"
            disabled={uploading}
            customRequest={({ file, onError }) => {
                const isDocOrPdf = file.type === 'application/pdf' ||
                    file.type === 'application/msword' ||
                    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                const isSizeValid = file.size / 1024 / 1024 < 5;

                if (!isDocOrPdf) {
                    message.error(t('cv.upload.fileType'));
                    onError('Invalid file type');
                    return;
                }
                if (!isSizeValid) {
                    message.error(t('cv.upload.fileMax'));
                    onError('File size exceeds limit');
                    return;
                }
                handleUpload(file);
            }}
        >
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p>{t('cv.upload.fileChoose')}</p>
            <p>{t('cv.upload.fileSupport')}</p>
            {uploading && <Progress percent={uploadProgress} />}
        </Dragger>}
        <Radio.Group
            onChange={handleChange}
            value={formData.resumeId}
        >
            <Flex vertical gap={10}>
                {data.length > 0 && (
                    data.map((item) => (
                        <Card
                            key={item.resumeId}
                            size="small"
                            className="rounded-lg cursor-pointer"
                            onClick={() => {
                                setFormData(prev => ({ ...prev, resumeId: item.resumeId }));
                            }}
                        >
                            <Flex justify="space-between">
                                <Radio value={item.resumeId} />
                                <div className="flex-grow">
                                    <Typography.Text className="text-base text-text-color-hover">
                                        {item.resumeTitle}
                                    </Typography.Text>
                                    <br />
                                    <Text type="secondary">
                                        <PaperClipOutlined /> {t('employer.job.resume')} • {t('employer.job.uploadedAt')}: {item.updatedAt}
                                    </Text>
                                </div>
                               
                                <MoreOutlined className="text-lg text-gray-500" />
                            </Flex>
                        </Card>
                    ))
                ) 
                }
            </Flex>
        </Radio.Group>
        <Modal
                maskClosable={false}
                title="Thông tin CV"
                open={visible}
                onOk={() => form.submit()}
                onCancel={handleCancel}
                okText="Lưu"
                cancelText="Hủy"
                width={600}

            >
                <Form
                    validateTrigger={['onSubmit']}
                    size="large"
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}

                    initialValues={{ level_id: levelOptions[0]?.value }}
                >
                    {/* Trường resume_title */}
                    <Form.Item
                        name="resumeTitle"
                        label="Tiêu đề"
                        rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
                    >
                        <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>

                    {/* Trường resume_description */}
                    <Form.Item
                        name="resumeDescription"
                        label="Mô tả"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                    >
                        <Input.TextArea rows={4} placeholder="Nhập mô tả resume" />
                    </Form.Item>

                    {/* Trường level_id */}
                    <Form.Item
                        name="levelId"
                        label="Cấp độ"
                        rules={[{ required: true, message: "Vui lòng chọn cấp độ!" }]}>
                        <Select>
                            {levelOptions.map(level => (<Option key={level?.value} value={level?.value}>{level?.label}</Option>))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Flex>
    );
};

export default FileGroup;