import { useEffect, useState } from 'react';
import { Card, Radio, Typography, Flex } from 'antd';
import { PaperClipOutlined, MoreOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useResume } from '../../composables/resume';
const { Text, Link } = Typography;

const FileGroup = ({ formData, setFormData }) => {
    const { data: resumeData } = useResume();
    const [data, setData] = useState([]);
    const { t } = useTranslation();
    
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

    const handleChange = (event) => {
        setFormData(prev => ({ ...prev, resumeId: event.target.value }));
    };


    return (
        <Radio.Group
            onChange={handleChange}
            value={formData.resumeId}
        >
            <Flex vertical gap={10}>
                {data.length > 0 ? (
                    data.map((item) => (
                        <Card
                            key={item.resumeId}
                            size="small"
                            bordered
                            className="rounded-lg"
                        >
                            <Flex justify="space-between">
                                <Radio value={item.resumeId} />
                                <div className="flex-grow">
                                    <Typography.Link>
                                        {item.resumeTitle}
                                    </Typography.Link>
                                    <br />
                                    <Text type="secondary">
                                        <PaperClipOutlined /> {t('employer.job.resume')} • {t('employer.job.uploadedAt')}: {item.updatedAt}
                                    </Text>
                                </div>
                               
                                    <MoreOutlined className="text-lg text-gray-500" />
                            </Flex>
                        </Card>
                    ))
                ) : (
                    <Flex align="center" justify="center">
                        <Text>
                            {t('employer.job.noResume')}
                            <Link href="http://localhost:3000/profile" target="_blank">
                                {t('employer.job.updateResume')}
                            </Link>
                        </Text>
                    </Flex>
                )}
            </Flex>
        </Radio.Group>
    );
};

export default FileGroup;