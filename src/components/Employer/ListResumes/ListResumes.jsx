import { useEffect, useState } from "react";
import BoxContainer from "../../Generate/BoxContainer";
import { Avatar, Button, Flex, List, Select, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import './ListApplicant.scss';
import { getAllApplicantByCategoryId, getAllJobCategories } from "../../../services/apiService";
import { FaFilter } from "react-icons/fa6";

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
        console.log(categoryId);
        window.scrollTo(0, 0);
        getAllApplicantByCategoryId(categoryId).then(res => {
            if (res.status === 'OK') {
                setDatasource(res.data.content);
                setTotalApplicants(res.data.totalElements);
            }
            else {
                setDatasource([]);
                return;
            }
        });
    }, [categoryId]);
    return (
        <>

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
        </>
    )
}


const ListResumes = () => {
    const [listCategory, setListCategory] = useState([]);
    const [categoryId, setCategoryId] = useState();
    useEffect(() => {
        // fetch data
        getAllJobCategories().then((res) => {
            setListCategory(res.data.filter((item) => item.active === true).map((item) => ({
                label: item.jobCategoryName,
                value: +item.jobCategoryId
            })));
        })
    }, []);
    return (
        <>
            <BoxContainer>
                <div className="title1">Danh sách sinh viên đang tìm việc</div>
            </BoxContainer>
            <BoxContainer>
                <Flex align="center" justify="end">
                    <Select
                        placeholder='Ngành nghề'
                        size="large"
                        style={{ minWidth: 200 }}
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={(value) => setCategoryId(value)}
                        prefix={<FaFilter color="#1E4F94" style={{ marginRight: 8 }} />}
                    >
                        {listCategory.map(item => (
                            <Option key={item.value} value={item.value}>{item.label}</Option>
                        ))}
                    </Select>
                </Flex>
                <ListApplicant categoryId={categoryId} />
            </BoxContainer>
        </>
    );
};
export default ListResumes;