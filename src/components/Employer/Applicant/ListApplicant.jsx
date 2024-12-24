import { List, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ApplicantCard from "../../Generate/ApplicantCard";
import { getApplyJobByJobId } from "../../../services/apiService";

const { TabPane } = Tabs;
const ListApplicant = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [totalApplicants, setTotalApplicants] = useState(0);
    const [pageSize, setPageSize] = useState(10); // Số lượng ứng viên mỗi trang
    const location = useLocation();
    const navigate = useNavigate();
    const activeKey = location.hash.replace('#', '') || 'PENDING';
    const [listApplicant, setListApplicant] = useState([]);
    const { id } = useParams();
    // const [activeKey, setActiveKey] = useState('PENDING');
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
            message.error("Không tìm thấy thông tin");
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
        setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi kích thước trang
    };

    return (
        <>
            <Tabs size='large' activeKey={activeKey} onChange={handleTabChange}>
                <TabPane
                    tab="Chưa xem"
                    key="PENDING"
                />
                <TabPane
                    tab="Đã xem"
                    key="VIEWED"
                />
                <TabPane
                    tab="Đã duyệt"
                    key="APPROVED"
                />
                <TabPane
                    tab="Bị từ chối"
                    key="REJECTED"
                />
            </Tabs>
            <List
                dataSource={listApplicant}
                pagination={{
                    current: currentPage,
                    total: totalApplicants,
                    onChange: handlePageChange,
                    pageSizeOptions: ['10', '20', '50'], // Các tùy chọn kích thước trang
                    showSizeChanger: true, // Hiển thị bộ chọn kích thước trang
                    onShowSizeChange: handlePageSizeChange // Hàm xử lý khi thay đổi kích thước trang
                }}
                renderItem={(item) => (
                    <List.Item>
                        <div className="w-100">
                            <ApplicantCard applicant={item} status={activeKey} />
                        </div>
                    </List.Item>
                )}
            />
        </>
    )
}
export default ListApplicant;
