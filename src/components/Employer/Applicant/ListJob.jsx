import { Alert, Flex, List, Typography } from "antd";
import { JobCardLargeApplicant } from "../../Generate/JobCard";
import { useEffect, useState } from "react";
import { getJobsByStatus } from "../../../services/apiService";
const { Text } = Typography;
const ListJob = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const fetchData = async () => {
        const params = {
            jobStatus: 'ACTIVE',
            page: currentPage - 1,
            limit: pageSize
        };
        const res = await getJobsByStatus(params);
        if (res.status === 'OK' && res.data.jobResponses) {
            setData(res.data.jobResponses);
            setTotalRecords(res.data.totalPages * pageSize);
        }
        else {
            setData([]);
            setTotalRecords(0);
        }
    };
    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize]);
    return (
        <>
            <Alert
                message={<Text className="f-16" strong>Chú ý</Text>}
                type="info"
                showIcon
                closable
                description="Vui lòng chọn việc làm để xem danh sách ứng viên"
                className="mb-3"
            />

            <List
                split={false}
                loading={loading}
                dataSource={data}
                renderItem={job => (
                    <List.Item>
                        <div style={{ width: '100%' }}>
                            <JobCardLargeApplicant job={job} />
                        </div>
                    </List.Item>
                )}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalRecords,
                    showSizeChanger: true,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    },
                }}
            />

        </>
    )
}
export default ListJob;
