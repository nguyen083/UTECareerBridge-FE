import { Avatar, Button, Divider, Flex, List, message, Typography } from "antd";
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

    // const data = [
    //     {
    //         companyId: '1',
    //         companyName: 'Công ty 1',
    //         industry: {
    //             industryId: '1',
    //             industryName: 'Công nghệ thông tin'
    //         }
    //     },
    //     {
    //         companyId: '2',
    //         companyName: 'Công ty 2',
    //         industry: {
    //             industryId: '2',
    //             industryName: 'Công nghệ thông tin'
    //         }
    //     },
    //     {
    //         companyId: '3',
    //         companyName: 'Công ty 3',
    //         industry: {
    //             industryId: '3',
    //             industryName: 'Công nghệ thông tin'
    //         }
    //     },
    //     {
    //         companyId: '4',
    //         companyName: 'Công ty 4',
    //         industry: {
    //             industryId: '4',
    //             industryName: 'Công nghệ thông tin'
    //         }
    //     },
    //     {
    //         companyId: '5',
    //         companyName: 'Công ty 5',
    //         industry: {
    //             industryId: '5',
    //             industryName: 'Công nghệ thông tin'
    //         }
    //     },
    //     {
    //         companyId: '6',
    //         companyName: 'Công ty 6',
    //         industry: {
    //             industryId: '6',
    //             industryName: 'Công nghệ thông tin'
    //         }
    //     },
    //     {
    //         companyId: '7',
    //         companyName: 'Công ty 7',
    //         industry: {
    //             industryId: '7',
    //             industryName: 'Công nghệ thông tin'
    //         }
    //     },
    //     {
    //         companyId: '8',
    //         companyName: 'Công ty 8',
    //         industry: {
    //             industryId: '8',
    //             industryName: 'Công nghệ thông tin'
    //         }
    //     },
    //     {
    //         companyId: '9',
    //         companyName: 'Công ty 9',
    //         industry: {
    //             industryId: '9',
    //             industryName: 'Công nghệ thông tin'
    //         }
    //     },
    //     {
    //         companyId: '10',
    //         companyName: 'Công ty 10',
    //         industry: {
    //             industryId: '10',
    //             industryName: 'Công nghệ thông tin'
    //         }
    //     },
    //     {
    //         companyId: '11',
    //         companyName: 'Công ty 11',
    //         industry: {
    //             industryId: '11',
    //             industryName: 'Công nghệ thông tin'
    //         }
    //     },
    //     {
    //         companyId: '12',
    //         companyName: 'Công ty 12',
    //         industry: {
    //             industryId: '12',
    //             industryName: 'Công nghệ thông tin'
    //         }
    //     },
    //     {
    //         companyId: '13',
    //         companyName: 'Công ty 13',
    //         industry: {
    //             industryId: '13',
    //             industryName: 'Công nghệ thông tin'
    //         }
    //     },
    //     {
    //         companyId: '14',
    //         companyName: 'Công ty 14',
    //         industry: {
    //             industryId: '14',
    //             industryName: 'Công nghệ thông tin'
    //         }
    //     },

    // ];

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
