import { List, Tabs, message } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ApplicantCard from "../../Generate/ApplicantCard";
import { getApplyJobByJobId } from "../../../services/apiService";
import { useTranslation } from "react-i18next";

const { TabPane } = Tabs;
const ListApplicant = () => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalApplicants, setTotalApplicants] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const location = useLocation();
    const navigate = useNavigate();
    const activeKey = location.hash.replace('#', '') || 'PENDING';
    const [listApplicant, setListApplicant] = useState([]);
    const { id } = useParams();
   
    const handleTabChange = (key) => {
        navigate(`#${key}`);
    };
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
            <Tabs size='large' activeKey={activeKey} onChange={handleTabChange}>
                <TabPane
                    tab={t('employer.applicant.tabs.pending')}
                    key="PENDING"
                />
                <TabPane
                    tab={t('employer.applicant.tabs.viewed')}
                    key="VIEWED"
                />
                <TabPane
                    tab={t('employer.applicant.tabs.approved')}
                    key="APPROVED"
                />
                <TabPane
                    tab={t('employer.applicant.tabs.rejected')}
                    key="REJECTED"
                />
            </Tabs>
            <List
                dataSource={listApplicant}
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
