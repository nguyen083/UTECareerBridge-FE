import { useEffect, useState } from "react";
import BoxContainer from "../../Generate/BoxContainer";
import { Avatar, Button, List, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import './ListApplicant.scss';
import { getAllApplicantByCategoryId } from "../../../services/apiService";

const { Text } = Typography;
const ListApplicant = ({ categoryId }) => {
    const navigate = useNavigate();
    const [datasource, setDatasource] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [totalApplicants, setTotalApplicants] = useState(0);
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };
    useEffect(() => {
        window.scrollTo(0, 0);
        getAllApplicantByCategoryId(categoryId).then(res => {
            setDatasource(res.data.content);
            setTotalApplicants(res.data.totalElements);
        });
    }, []);
    return (
        <List
            className="list-applicant"
            split={false}
            dataSource={datasource}
            pagination={{
                align: "end",
                current: currentPage,
                pageSize: pageSize,
                total: totalApplicants,
                onChange: handlePageChange,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50']
            }}
            renderItem={(item) => (
                <List.Item className="p-3 border border-1 rounded-2 box_shadow">
                    <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} size={70} src={item?.profileImage} />}
                        title={<Text className="f-16 fw-bold">{item?.lastName} {item?.firstName}</Text>}
                        description={
                            <>
                                <Text className="f-16"> Sinh viên năm {item?.year}, chuyên ngành {item?.categoryName}</Text>
                                <br />
                                <Text className="f-16"> <span className="fw-bold">Email:</span> {item?.email}</Text>
                            </>
                        }
                    />
                    <Button onClick={() => {
                        navigate(`/employer/detail-resume`, { state: { datasource: item } });
                    }} type="default" size="large">Xem hồ sơ</Button>
                </List.Item>
            )} />
    )
}


const ListResumes = () => {




    return (
        <>
            <BoxContainer>
                <div className="title1">Danh sách sinh viên đang tìm việc</div>
            </BoxContainer>
            <BoxContainer>
                <ListApplicant categoryId={3} />
            </BoxContainer>
        </>
    );
};
export default ListResumes;