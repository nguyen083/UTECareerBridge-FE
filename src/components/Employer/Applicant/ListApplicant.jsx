import { List, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApplicantCard from "../../Generate/ApplicantCard";
import { getApplyJobByJobId } from "../../../services/apiService";

const { TabPane } = Tabs;
const ListApplicant = () => {
    const [listApplicant, setListApplicant] = useState([]);
    const { id } = useParams();
    const [activeKey, setActiveKey] = useState('PENDING');
    const handleTabChange = (key) => {
        setActiveKey(key);
    };
    const fetchData = async () => {
        const response = await getApplyJobByJobId(id, activeKey);
        if (response.status === "OK" && response.data) {
            setListApplicant(response.data);
        }
        else {
            message.error("Không tìm thấy thông tin");
            setListApplicant([]);
        }
    }
    useEffect(() => {
        fetchData();
    }, [activeKey]);
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
