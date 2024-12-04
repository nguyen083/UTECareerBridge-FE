import BoxContainer from "../../../Generate/BoxContainer";
import React, { useEffect, useState } from 'react';
import { Table, Flex, Typography } from 'antd';
import { getApplyJobByStudent } from '../../../../services/apiService';
import Status from "../../../../constant/status";
const { Text } = Typography;
const MyJobPage = () => {
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
            render: (text) => <Text ellipsis={{ rows: 1, tooltip: text }}>{text}</Text>,
            ellipsis: true,
            width: "39%"
        },
        {
            title: 'Công việc',
            dataIndex: 'jobTitle',
            key: 'jobTitle',
            render: (text) => <Text ellipsis={{ rows: 1, tooltip: text }}>{text}</Text>,
            ellipsis: true,
            width: "39%"

        },
        {
            title: 'CV',
            dataIndex: 'resumeFile',
            key: 'resumeFile',
            render: (text) => <a href={text} target="_blank" rel="noopener noreferrer">xem</a>, // Tạo liên kết tải file
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
    return (<>
        <Flex vertical gap={8}>
            <BoxContainer width="100%">
                <div className="title1">Việc làm của tôi</div>
            </BoxContainer>
            <BoxContainer width="100%">
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="applicationId"
                    loading={loading}
                    pagination={{
                        align: "end",
                        current: currentPage,
                        pageSize: pageSize,
                        total: 1,
                        onChange: handlePageChange,
                        showSizeChanger: true,
                    }} // Tắt phân trang mặc định của Table
                />

            </BoxContainer>
        </Flex >
    </>
    )
}
export default MyJobPage;