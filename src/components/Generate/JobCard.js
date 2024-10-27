import React, { useEffect } from 'react';
import { Card, Divider, Flex, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Text, Title, Paragraph } = Typography;

const JobCardSmall = ({ job }) => {
    const navigate = useNavigate();
    const handleClick = (key) => {
        navigate('/employer/view/' + key);

    };
    useEffect(() => {
        console.log(job);
    }, []);
    return (
        <Card
            onClick={() => handleClick(job.jobId)}
            hoverable
            style={{
                width: "100%",
                borderRadius: 10,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
            bodyStyle={{ padding: 16 }}
        >
            <Flex align='center'>
                <img
                    src={job.employerResponse.companyLogo} // Replace with the actual logo URL
                    style={{ width: 80, height: 80, borderRadius: 4, marginRight: 12 }}
                />
                <div>
                    <Title level={5}
                        style={{
                            margin: 0,
                            whiteSpace: 'nowrap',        // Keeps the text on a single line
                            overflow: 'hidden',           // Hides any overflow
                            textOverflow: 'ellipsis',     // Adds ellipsis for overflowed text
                            maxWidth: 140                 // Optional: set max width to control where it cuts off
                        }}>
                        {job.jobTitle}
                    </Title>
                    < Paragraph
                        type='secondary'
                        style={{
                            margin: 0,
                            whiteSpace: 'nowrap',        // Keeps the text on a single line
                            overflow: 'hidden',           // Hides any overflow
                            textOverflow: 'ellipsis',     // Adds ellipsis for overflowed text
                            maxWidth: 140                 // Optional: set max width to control where it cuts off
                        }}>
                        {job.employerResponse.companyName}</Paragraph>
                    <div style={{ color: '#ff4d4f', fontSize: 14, margin: '8px 0' }}>
                        {job.jobMinSalary.toLocaleString()} - {job.jobMaxSalary.toLocaleString()} <Text style={{ fontSize: 12 }}>VNĐ/tháng</Text>
                    </div>
                    < Paragraph
                        type='secondary'
                        style={{
                            margin: 0,
                            whiteSpace: 'nowrap',        // Keeps the text on a single line
                            overflow: 'hidden',           // Hides any overflow
                            textOverflow: 'ellipsis',     // Adds ellipsis for overflowed text
                            maxWidth: 140                 // Optional: set max width to control where it cuts off
                        }}>
                        {job.jobLocation}</Paragraph>
                </div>
            </Flex>
        </Card>
    );
};
const JobCardLarge = ({ job }) => {
    const navigate = useNavigate();
    const handleClick = (key) => {
        navigate('/employer/view/' + key);

    };
    useEffect(() => {
        console.log(job);
    }, []);
    return (
        <Card
            onClick={() => handleClick(job.jobId)}
            hoverable
            style={{
                width: "100%",
                borderRadius: 10,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
            bodyStyle={{ padding: 16 }}
        >
            <Flex align='center'>
                <img
                    src={job.employerResponse.companyLogo} // Replace with the actual logo URL
                    style={{ width: 100, height: 100, borderRadius: 4, marginRight: 12 }}
                />
                <div>
                    <Title level={5}
                    // style={{
                    //     margin: 0,
                    //     whiteSpace: 'nowrap',        // Keeps the text on a single line
                    //     overflow: 'hidden',           // Hides any overflow
                    //     textOverflow: 'ellipsis',     // Adds ellipsis for overflowed text
                    //     maxWidth: 500                 // Optional: set max width to control where it cuts off
                    // }}
                    >
                        {job.jobTitle}
                    </Title>
                    < Paragraph
                        type='secondary'
                    // style={{
                    //     margin: 0,
                    //     whiteSpace: 'nowrap',        // Keeps the text on a single line
                    //     overflow: 'hidden',           // Hides any overflow
                    //     textOverflow: 'ellipsis',     // Adds ellipsis for overflowed text
                    //     maxWidth: 140                 // Optional: set max width to control where it cuts off
                    // }}
                    >
                        {job.employerResponse.companyName}</Paragraph>
                    <Flex align='center' >
                        <div style={{ color: '#ff4d4f', fontSize: 14 }}>
                            {job.jobMinSalary.toLocaleString()} - {job.jobMaxSalary.toLocaleString()} <Text style={{ fontSize: 12 }}>VNĐ/tháng</Text>
                        </div>
                        <Divider type='vertical' />
                        < div
                            type='secondary'
                        // style={{
                        //     margin: 0,
                        //     whiteSpace: 'nowrap',        // Keeps the text on a single line
                        //     overflow: 'hidden',           // Hides any overflow
                        //     textOverflow: 'ellipsis',     // Adds ellipsis for overflowed text
                        //     maxWidth: 140                 // Optional: set max width to control where it cuts off
                        // }}
                        >
                            {job.jobLocation}</div>
                    </Flex>
                </div>
            </Flex>
        </Card>
    );
};

export {
    JobCardSmall,
    JobCardLarge,
};
