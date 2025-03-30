import { List, message } from "antd";
import { useEffect, useState } from "react";
import ApplicantCard from "../../Generate/ApplicantCard";
import { getApplyJobByJobId } from "../../../services/apiService";
import { useTranslation } from "react-i18next";

const ListApplicant = ({activeKey, jobId : id}) => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalApplicants, setTotalApplicants] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [listApplicant, setListApplicant] = useState([]);
   

    const fetchData = async () => {
        const response = await getApplyJobByJobId(id, activeKey);
        if (response.status === "OK" && response.data) {
            setListApplicant(response.data.content);
            setTotalApplicants(response.data.totalElements);
        }
        else {
            message.error(t('employer.applicant.messages.notFound'));
            setListApplicant([]);
        }
    }
    useEffect(() => {
        fetchData();
    }, [activeKey, currentPage]);

    const handlePageChange = (page, newSize = pageSize) => {
        setCurrentPage(page);
        setPageSize(newSize);
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1);
    };

    return (
        <>
            <List
                dataSource={listApplicant}
                locale={{
                    emptyText: t('employer.applicant.messages.empty')
                }}
                pagination={{
                    current: currentPage,
                    total: totalApplicants,
                    onChange: handlePageChange,
                    pageSizeOptions: ['10', '20', '50'],
                    showSizeChanger: true,
                    onShowSizeChange: handlePageSizeChange
                }}
                renderItem={(item) => (
                    <List.Item>
                        <div className="w-full">
                            <ApplicantCard applicant={item} status={activeKey} />
                        </div>
                    </List.Item>
                )}
            />
        </>
    )
}
export default ListApplicant;
