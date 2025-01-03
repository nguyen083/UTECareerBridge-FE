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

// const JobCardSmall = ({ job }) => {
//     const navigate = useNavigate();
//     const user = useSelector(state => state.user);
//     const handleClick = (key) => {
//         if (user.role === "employer") {
//             navigate('/employer/job/view/' + key);
//         } else {
//             navigate('/job/' + key);
//         }
//     }
//     return (
//         <Card
//             hoverable
//             style={{
//                 cursor: 'default',
//                 width: "100%",
//                 borderRadius: 10,
//                 overflow: 'hidden',
//                 boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//                 // padding: "1rem"
//             }}
//         >
//             <Flex align='center'>
//                 <img
//                     src={job.employerResponse.companyLogo} // Replace with the actual logo URL
//                     style={{ width: 80, height: 80, borderRadius: 4, marginRight: 12 }}
//                 />
//                 <div className='w-75'>
//                     <Title level={5}
//                         onClick={() => handleClick(job.jobId)}
//                         style={{
//                             cursor: 'pointer',
//                             margin: 0,
//                             whiteSpace: 'nowrap',        // Keeps the text on a single line
//                             overflow: 'hidden',           // Hides any overflow
//                             textOverflow: 'ellipsis',     // Adds ellipsis for overflowed text
//                         }}>
//                         {job.jobTitle}
//                     </Title>
//                     < Paragraph
//                         type='secondary'
//                         style={{
//                             margin: 0,
//                             whiteSpace: 'nowrap',        // Keeps the text on a single line
//                             overflow: 'hidden',           // Hides any overflow
//                             textOverflow: 'ellipsis',     // Adds ellipsis for overflowed text
//                         }}>
//                         {job.employerResponse.companyName}</Paragraph>
//                     <div style={{ color: '#ff4d4f', fontSize: 14, margin: '8px 0' }}>
//                         {job.jobMinSalary.toLocaleString()} - {job.jobMaxSalary.toLocaleString()} <Text style={{ fontSize: 12 }}>VNĐ/tháng</Text>
//                     </div>
//                     < Paragraph
//                         type='secondary'
//                         style={{
//                             margin: 0,
//                             whiteSpace: 'nowrap',        // Keeps the text on a single line
//                             overflow: 'hidden',           // Hides any overflow
//                             textOverflow: 'ellipsis',     // Adds ellipsis for overflowed text
//                             // Optional: set max width to control where it cuts off
//                         }}>
//                         {job.jobLocation}</Paragraph>
//                 </div>
//             </Flex>
//         </Card>
//     );
// };
const JobCardSmall = ({ job }) => {
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const handleClick = (key) => {
        navigate('/job/' + key);
    }
    return (
        <List.Item className='d-flex align-items-start border border-1 rounded-3 p-3 justify-content-between' style={{ maxWidth: '100%', overflow: 'hidden' }}>
            <List.Item.Meta
                style={{ cursor: 'pointer' }}
                onClick={() => handleClick(job.jobId)}
                className='d-flex align-items-center w-100 meta-description'
                avatar={<img
                    src={job.employerResponse.companyLogo} // Replace with the actual logo URL
                    style={{ width: 80, height: 80, borderRadius: 4, marginRight: 12 }}
                />}
                description={<div>
                    <Title level={5}

                        className="limit-text w-100"
                        ellipsis={{ tooltip: true, rows: 2 }}
                    >
                        {job.jobTitle}
                    </Title>
                    < Text className='f-14 limit-text'>
                        <IoIosBusiness size={16} /> &ensp;
                        {job.employerResponse.companyName}</Text>


                    <Flex align='center' gap={3} style={{ color: '#ff4d4f', fontSize: 14, margin: '8px 0' }}>
                        <FaRegMoneyBillAlt size={16} />&ensp;
                        {job?.jobMinSalary?.toLocaleString('vi-VN')} - {job?.jobMaxSalary?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} <div style={{ fontSize: 14 }}>/tháng</div>
                    </Flex>
                    < Paragraph
                        type='secondary limit-text mb-0'
                    >
                        <FaMapLocationDot />&ensp;
                        {job.jobLocation}</Paragraph>
                </div>}
            />
            {/* <HeartOutlined /> */}
        </List.Item>
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
                        style={{
                            cursor: 'pointer'
                        }}
                    >
                        {job.jobTitle} {Lable(job.packageId)}
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
                    ><IoIosBusiness /> &ensp;
                        {job.employerResponse.companyName}</Paragraph>
                    <Flex align='center' >
                        <Flex align='center' gap={3} style={{ color: '#ff4d4f', fontSize: 14 }}>
                            <FaRegMoneyBillAlt size={16} />&ensp;
                            {job?.jobMinSalary?.toLocaleString('vi-VN')} - {job?.jobMaxSalary?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} <div style={{ fontSize: 14 }}>/tháng</div>
                        </Flex>
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
                            <FaMapLocationDot />&ensp;
                            {job.jobLocation}</div>
                    </Flex>
                </div>
            </Flex>
        </Card>
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
