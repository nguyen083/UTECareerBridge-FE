import { Card, Col, message, Row, Statistic, Table, Typography } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import React, { useEffect, useState } from 'react';
import { SlUserFollowing } from "react-icons/sl";
import { ImUserTie } from "react-icons/im";
import { useTranslation } from "react-i18next";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LiaBriefcaseSolid } from "react-icons/lia";
import { getCountStudentApplied, getJobPackage } from "../../../services/apiService";
import { useSelector } from "react-redux";

const { Text } = Typography;
const Chart = () => {
    const data = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    );
}

const ListPackage = () => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: t('employer.dashboard.servicePackage.table.packageName'),
            dataIndex: 'packageName',
            key: 'packageName',
        },
        {
            title: t('employer.dashboard.servicePackage.table.amount'),
            dataIndex: 'amount',
            key: 'amount',
            align: 'center'
        },
        {
            title: t('employer.dashboard.servicePackage.table.expiredAt'),
            dataIndex: 'expiredAt',
            key: 'expiredAt',
            align: 'center'
        },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getJobPackage();
            if (response.status === 'OK') {
                setData(response.data.map(item => ({
                    packageName: item.packageResponse.packageName,
                    amount: item.amount,
                    expiredAt: item?.expiredAt.split(' ')[0]
                })));
            } else {
                message.error(response.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Table
                locale={
                    {
                        emptyText: t('employer.dashboard.servicePackage.table.emptyText')
                }
            }
                style={{ maxHeight: 350, overflow: 'auto' }}
                bordered
                loading={loading}
                dataSource={data}
                pagination={false}
                columns={columns}
            />
        </div>
    );
};

const DashBoard = () => {
    const { t } = useTranslation();
    const { countJob, countFollower } = useSelector(state => state.employer);
    const [countStudentApplied, setCountStudentApplied] = useState(0);

    useEffect(() => {
        getCountStudentApplied().then(res => {
            if (res.status === 'OK') {
                setCountStudentApplied(res.data);
            } else {
                message.error(res.message);
            }
        });
    }, []);

    return (
        <>
            <BoxContainer className="shadow-md">
                <div className="title1">
                    {t('employer.dashboard.title')}
                </div>
            </BoxContainer>
            <BoxContainer className="shadow-md">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={8}>
                        <Card className="shadow">
                            <Statistic
                                title={<Text>{t('employer.dashboard.stats.followers.title')}</Text>}
                                value={countFollower || 0}
                                prefix={<SlUserFollowing style={{ color: '#52c41a' }} />}
                                suffix={<Text>{t('employer.dashboard.stats.followers.unit')}</Text>}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card className="shadow">
                            <Statistic
                                title={<Text>{t('employer.dashboard.stats.candidates.title')}</Text>}
                                value={countStudentApplied || 0}
                                prefix={<ImUserTie style={{ color: '#1890ff' }} />}
                                suffix={<Text>{t('employer.dashboard.stats.candidates.unit')}</Text>}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card className="shadow">
                            <Statistic
                                title={<Text>{t('employer.dashboard.stats.jobs.title')}</Text>}
                                value={countJob || 0}
                                prefix={<LiaBriefcaseSolid style={{ color: '#52c41a' }} />}
                                suffix={<Text>{t('employer.dashboard.stats.jobs.unit')}</Text>}
                            />
                        </Card>
                    </Col>
                    <Col sm={24} lg={24}>
                        <Card title={t('employer.dashboard.servicePackage.title')} className="shadow">
                            <ListPackage />
                        </Card>
                    </Col>
                </Row>
            </BoxContainer>
        </>
    );
};

export default DashBoard;