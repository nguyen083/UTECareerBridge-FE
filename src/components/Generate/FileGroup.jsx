import React, { useEffect, useState } from 'react';
import { Card, Radio, Typography, Flex, Dropdown } from 'antd';
import { PaperClipOutlined, MoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getAllCV } from '../../services/apiService';

const { Text } = Typography;
const items = [
    {
        label: "1st menu item",
        key: '0',
    },
    {
        type: 'divider',
    },
    {
        label: '2rd menu item',
        key: '1',
    },
];
const FileGroup = (props) => {
    const { formData, setFormData } = props;
    const [data, setData] = useState([]);
    useEffect(async () => {
        await getAllCV().then((res) => {
            console.log(res.data);
            setData(res.data);
            setFormData({ ...formData, resumeId: res.data[0].resumeId });
        }
        )
    }, [])
    const onChange = (e) => {
        setFormData({ ...formData, resumeId: e.target.value });
    }
    return (
        <Radio.Group onChange={(event) => onChange(event)} value={formData.resumeId}>
            <Flex vertical gap={10}>
                {data.length > 0 ? data.map((item) =>
                    <Card
                        size='small'
                        bordered
                        style={{
                            borderRadius: '10px',
                        }}
                    >
                        <Flex justify='space-between'>
                            <Radio value={item.resumeId} />

                            <div style={{ flexGrow: 1 }}>
                                <Typography.Link>
                                    {item.resumeTitle}
                                </Typography.Link>
                                <br />
                                <Text type="secondary">
                                    <PaperClipOutlined /> Attached resume • Uploaded: {item.updatedAt}
                                </Text>
                            </div>
                            <Dropdown
                                menu={{ items }}
                                trigger={['click']}
                            >
                                <MoreOutlined style={{ fontSize: '18px', color: '#8c8c8c' }} />
                            </Dropdown>
                        </Flex>
                    </Card>) : <Flex align='center' justify='center'>
                    <Text>Không có CV nào, Vui lòng <Link to="#">cập nhật CV của bạn</Link> </Text>
                </Flex>}
            </Flex>
        </Radio.Group>

    );
};

export default FileGroup;
