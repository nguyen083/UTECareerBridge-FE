import React, { useEffect, useState } from 'react';
import { Card, Radio, Typography, Flex, Dropdown } from 'antd';
import { PaperClipOutlined, MoreOutlined } from '@ant-design/icons';
import { getAllCV } from '../../services/apiService';

const { Text, Link } = Typography;

const FileGroup = ({ formData, setFormData }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await getAllCV();
                if (isMounted) {
                    setData(response.data);
                    if (response.data.length > 0) {
                        setFormData(prev => ({ ...prev, resumeId: response.data[0].resumeId }));
                    }
                }
            } catch (error) {
                console.error('Error fetching CV data:', error);
            }
        };

        fetchData();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, []); // Add setFormData to dependencies if needed

    const handleChange = (event) => {
        setFormData(prev => ({ ...prev, resumeId: event.target.value }));
    };

    const dropdownItems = [
        // Add your dropdown items here
        // {
        //     label: "Menu item",
        //     key: '0',
        // }
    ];

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
                                        <PaperClipOutlined /> Hồ sơ đính kèm • Tải lên lúc: {item.updatedAt}
                                    </Text>
                                </div>
                                <Dropdown
                                    menu={{ items: dropdownItems }}
                                    trigger={['click']}
                                >
                                    <MoreOutlined className="text-lg text-gray-500" />
                                </Dropdown>
                            </Flex>
                        </Card>
                    ))
                ) : (
                    <Flex align="center" justify="center">
                        <Text>
                            Không có CV nào, Vui lòng{' '}
                            <Link href="http://localhost:3000/profile" target="_blank">
                                cập nhật CV của bạn
                            </Link>
                        </Text>
                    </Flex>
                )}
            </Flex>
        </Radio.Group>
    );
};

export default FileGroup;