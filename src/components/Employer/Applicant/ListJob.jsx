import { Alert, List, Typography } from "antd";
import { JobCardLargeApplicant } from "../../Generate/JobCard";
import { useEffect, useState } from "react";
import { getJobsByStatus } from "../../../services/apiService";
import { useTranslation } from "react-i18next";
import ListApplicantDrawer from "./ListApplicantDrawer";
const { Text } = Typography;
const ListJob = () => {
    const {t} = useTranslation();
    const [data, setData] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
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
                message={<Text className="text-base" strong>{t('common.notice')}</Text>}
                type="info"
                showIcon
                closable
                description={t('employer.applicant.listJob.notice')}
                className="mb-3"
            />

            <List
                split={false}
                // loading={loading}
                dataSource={data}
                renderItem={job => (
                    <List.Item>
                        <div style={{ width: '100%' }}>
                            <JobCardLargeApplicant job={job} setSelectedJob={setSelectedJob} />
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
            <ListApplicantDrawer open={selectedJob !== null} setSelectedJob={setSelectedJob} jobId={selectedJob} />
        </>
    )
}
export default ListJob;
