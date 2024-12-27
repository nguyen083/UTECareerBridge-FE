import { Avatar, Button, Divider, Empty, Flex, List, message, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFollowCompany, unfollowCompany } from "../../../../services/apiService";
import { FaIndustry } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { IoBriefcaseSharp } from "react-icons/io5";

import "./ListCompany.scss";
const { Title, Text } = Typography;
const ListCompany = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        getFollowCompany().then(res => {
            setData(res.data.content);
            setTotalElements(res.data.totalElements);
        }).catch(err => {
            message.error(err.message);
        }).finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize]);

    const handleUnfollow = (companyId) => {
        setLoading(true);
        unfollowCompany(companyId).then(res => {
            if (res.status === 'OK') {
                message.success(res.message);
                fetchData();
            }
        }).catch(err => {
            message.error(err.message);
        }).finally(() => {
            setLoading(false);
        })
    }

    return (
        <>
            <List
                loading={loading}
                locale={{ emptyText: <Empty description="Bạn chưa theo dõi bất kỳ công ty nào" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
                split={false}
                className="list-company "
                bordered={true}
                pagination={{
                    position: 'bottom',
                    align: 'end',
                    total: totalElements,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    },
                    pageSizeOptions: ['5', '10', '15', '20'],
                }}
                dataSource={data}
                renderItem={(item, index) => (
                    <List.Item className="item-company box_shadow">
                        <List.Item.Meta
                            className="d-flex justify-content-between align-items-center"
                            avatar={<Avatar shape="square" size={100} src={item?.companyLogo} />}
                            title={<Link className="text-decoration-none" to={`/company/${item.id}`}><Title level={5} className="p-0 m-0">{item.companyName}</Title></Link>}
                            description={
                                <Flex vertical justify="center">
                                    <Text type="secondary"><FaIndustry /> {item.industry.industryName}</Text>
                                    <div>
                                        <Text type="secondary"><IoIosPeople /> {item.countFollower} lượt theo dõi</Text>
                                        <Divider type="vertical" />
                                        <Text type="secondary"><IoBriefcaseSharp /> {item.countJob} công việc</Text>
                                    </div>
                                </Flex>}

                        />
                        <Button onClick={() => handleUnfollow(item.id)} type="primary">Hủy theo dõi</Button>
                    </List.Item>
                )}
            /></>
    )
}

export default ListCompany;
