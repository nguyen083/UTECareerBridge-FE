import BoxContainer from "../../../Generate/BoxContainer";
import React, { useEffect, useState } from 'react';
import { Table, Flex, Typography, Tabs } from 'antd';
import { getApplyJobByStudent, getJobSaved } from '../../../../services/apiService';
import Status from "../../../../constant/status";
import { checkThoiHan } from "../../../../utils/day";
import { Link } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
const { Text } = Typography;



const AppliedJob = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalApplicants, setTotalApplicants] = useState(0);

    const fetchData = () => {
        setLoading(true);
        getApplyJobByStudent().then((response) => {
            setData(response.data.content);
            setTotalApplicants(response.data.totalElements);
        })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }
    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize]);
    const columns = [
        {
            title: 'Công ty',
            dataIndex: 'companyName',
            key: 'companyName',
            render: (text, record) => <Link to={`/company/${record.companyId}`}><Text ellipsis={{ rows: 1, tooltip: text }}>
                {text}
            </Text></Link>,
            ellipsis: true,
            width: "39%"
        },
        {
            title: 'Công việc',
            dataIndex: 'jobTitle',
            key: 'jobTitle',
            render: (text, record) => <Link to={`/job/${record.jobId}`}><Text ellipsis={{ rows: 1, tooltip: text }}>
                {text}
            </Text></Link>,
            ellipsis: true,
            width: "39%"

        },
        {
            title: 'CV',
            dataIndex: 'resumeFile',
            key: 'resumeFile',
            render: (text) => <a href={text} target="_blank" rel="noopener noreferrer"><EyeOutlined shape="round" /></a>, // Tạo liên kết tải file
            align: 'center',
            width: "9%"
        },
        {
            title: 'Trạng thái',
            dataIndex: 'applicationStatus',
            key: 'applicationStatus',
            render: (status) => <Status status={status} />,
            align: 'center',
            width: "13%"
        },
    ];
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };
    return <Table
        dataSource={data}
        columns={columns}
        rowKey="applicationId"
        loading={loading}
        pagination={{
            align: "end",
            current: currentPage,
            pageSize: pageSize,
            total: totalApplicants,
            onChange: handlePageChange,
            showSizeChanger: true,
        }} // Tắt phân trang mặc định của Table
    />
}

const SavedJob = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    const fetchData = () => {
        setLoading(true);
        getJobSaved().then((response) => {
            setData(response.data.content.map(item =>
            ({
                companyId: item.employerId,
                companyName: item.employerResponse.companyName,
                jobId: item.jobId,
                jobTitle: item.jobTitle,
                jobDeadline: item.jobDeadline
            })
            ));
            setTotalElements(response.data.totalElements);
        }).catch((error) => {
            console.error('Error fetching data:', error);
        }).finally(() => {
            setLoading(false);
        });
    }
    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize]);
    const columns = [
        {
            title: 'Công ty',
            dataIndex: 'companyName',
            key: 'companyName',
            render: (text, record) => <Link to={`/company/${record.companyId}`}><Text ellipsis={{ rows: 1, tooltip: text }}>
                {text}
            </Text></Link>,
            ellipsis: true,
            width: "39%"
        },
        {
            title: 'Công việc',
            dataIndex: 'jobTitle',
            key: 'jobTitle',
            render: (text, record) => <Link to={`/job/${record.jobId}`}><Text ellipsis={{ rows: 1, tooltip: text }}>
                {text}
            </Text></Link>,
            ellipsis: true,
            width: "43%"

        },
        {
            title: 'Trạng thái',
            dataIndex: 'jobDeadline',
            key: 'jobDeadline',
            render: (text) => checkThoiHan({ dateInput: text }),
            align: 'center',
            width: "13%"
        },
    ];
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };
    return <Table
        dataSource={data}
        columns={columns}
        rowKey="applicationId"
        loading={loading}
        pagination={{
            align: "end",
            current: currentPage,
            pageSize: pageSize,
            total: totalElements,
            onChange: handlePageChange,
            showSizeChanger: true,
        }} // Tắt phân trang mặc định của Table
    />

}

const MyJobPage = () => {

    return (<>
        <Flex vertical gap={8}>
            <BoxContainer width="100%">
                <div className="title1">Việc làm của tôi</div>
            </BoxContainer>
            <BoxContainer width="100%">

                <Tabs defaultActiveKey="1" size="large">
                    <Tabs.TabPane tab="Đã ứng tuyển" key="1">
                        <AppliedJob />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Đã lưu" key="2">
                        <SavedJob />
                    </Tabs.TabPane>
                </Tabs>


            </BoxContainer>
        </Flex >
    </>
    )
}
export default MyJobPage;