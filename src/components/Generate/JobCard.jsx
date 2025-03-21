import React from 'react';
import { Card, Divider, Flex, List, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Lable from '../../constant/Lable';
import './JobCard.scss';
import { FaMapLocationDot } from 'react-icons/fa6';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { IoIosBusiness } from 'react-icons/io';
const { Text, Title, Paragraph } = Typography;

const JobCardSmall = ({ job }) => {
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const handleClick = (key) => {
        navigate('/job/' + key);
    }
    return (
        <div className='job-card-small'>
        <List.Item className='flex items-start border  rounded-md p-3 justify-between item-company shadow max-w-full overflow-hidden' >
            <List.Item.Meta
                style={{ cursor: 'pointer' }}
                onClick={() => handleClick(job.jobId)}
                className='flex items-center w-full meta-description'
                avatar={<img
                    src={job.employerResponse.companyLogo} // Replace with the actual logo URL
                    className='h-20 !w-20 rounded mr-3 max-w-fit'
                />}
                description={<div>
                    <Title level={5}

                        className="limit-text w-full"
                        ellipsis={{ tooltip: true, rows: 2 }}
                    >
                        {job.jobTitle}
                    </Title>
                    < Flex gap={5}>
                        <IoIosBusiness size={18} />
                        <Text className='text-sm limit-text'>{job.employerResponse.companyName}</Text>
                    </Flex>


                    <Flex align='center' gap={5} style={{ color: '#ff4d4f', fontSize: 14, margin: '8px 0' }}>
                        <FaRegMoneyBillAlt size={18} />
                        {job?.jobMinSalary?.toLocaleString('vi-VN')} - {job?.jobMaxSalary?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} <div style={{ fontSize: 14 }}>/tháng</div>
                    </Flex>
                    <Flex gap={5} >
                        <Text type='secondary'>
                            <FaMapLocationDot size={18} />
                        </Text>
                        < Paragraph
                            type='secondary limit-text mb-0'
                        >   {job.jobLocation}</Paragraph>
                    </Flex>
                </div>}
            />
            {/* <HeartOutlined /> */}
        </List.Item >
        </div>
    );
};
const JobCardLarge = ({ job, disable = false }) => {
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const handleClick = (key) => {
        if (disable) return;
        else {
            navigate('/job/' + key);
        }

    };

    return (
        <Card
            onClick={() => handleClick(job.jobId)}
            hoverable
            className='job-card-large w-full rounded-xl overflow-hidden'
        >
            <Flex align='center' className='w-full'>
                <img
                    src={job.employerResponse.companyLogo} // Replace with the actual logo URL
                    style={{ width: 100, height: 100, borderRadius: 4, marginRight: 12 }}
                />
                <div className='w-full'>
                    <Title level={5}
                        className='cursor-pointer flex w-full items-center justify-between'
                    >
                        {job.jobTitle} {Lable(job.packageId)}
                    </Title>
                    < Paragraph
                        className='flex items-center'
                        type='secondary'
                    // style={{
                    //     margin: 0,
                    //     whiteSpace: 'nowrap',        // Keeps the text on a single line
                    //     overflow: 'hidden',           // Hides any overflow
                    //     textOverflow: 'ellipsis',     // Adds ellipsis for overflowed text
                    //     maxWidth: 140                 // Optional: set max width to control where it cuts off
                    // }}
                    ><IoIosBusiness /> &ensp;
                        {job.employerResponse.companyName}</Paragraph>
                    <Flex align='center' >
                        <Flex align='center' gap={3} style={{ color: '#ff4d4f', fontSize: 14 }}>
                            <FaRegMoneyBillAlt size={16} />&ensp;
                            {job?.jobMinSalary?.toLocaleString('vi-VN')} - {job?.jobMaxSalary?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} <div style={{ fontSize: 14 }}>/tháng</div>
                        </Flex>
                        <Divider type='vertical' />
                        < Text className='flex items-center'
                            type='secondary'
                        // style={{
                        //     margin: 0,
                        //     whiteSpace: 'nowrap',        // Keeps the text on a single line
                        //     overflow: 'hidden',           // Hides any overflow
                        //     textOverflow: 'ellipsis',     // Adds ellipsis for overflowed text
                        //     maxWidth: 140                 // Optional: set max width to control where it cuts off
                        // }}
                        >
                            <FaMapLocationDot />&ensp;
                            {job.jobLocation}</Text>
                    </Flex>
                </div>
            </Flex>
        </Card >
    );
};

const JobCardLargeApplicant = ({ job }) => {
    const navigate = useNavigate();
    const handleClick = (key) => {
        navigate('/employer/applicant/list-applicant-job/' + key);
    };
    return <div style={{ cursor: 'pointer' }} onClick={() => handleClick(job.jobId)}>
        <div>
            <JobCardLarge job={job} disable={true} />
        </div>
    </div>
}
export {
    JobCardSmall,
    JobCardLarge,
    JobCardLargeApplicant
};
