import React, { useLayoutEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Divider, Empty, Flex, List, Skeleton, Typography } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;
const customScrollbarStyle = {
    height: 'calc(100vh - 100px)',
    overflow: 'auto',
    padding: '0 8px',
    scrollbarWidth: 'thin', // For Firefox
    scrollbarColor: '#888 #f1f1f1', // For Firefox
};
const customScrollbarLisCompanyStyle = {
    height: 'calc(100vh - 210px)',
    overflow: 'auto',
    padding: '0 8px',
    scrollbarWidth: 'thin', // For Firefox
    scrollbarColor: '#888 #f1f1f1', // For Firefox
};
const customScrollbarCSS = `
    ::-webkit-scrollbar {
        width: 2px;
    }
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    ::-webkit-scrollbar-thumb {
        background: #888;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;
const ListJob = ({ className = "" }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const { t } = useTranslation();
    const loadMoreData = () => {
        if (loading) {
            return;
        }
        setLoading(true);
        fetch('https://randomuser.me/api/?results=11&inc=name,gender,email,nat,picture&noinfo')
            .then((res) => res.json())
            .then((body) => {
                setData([...data, ...body.results]);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };
    useLayoutEffect(() => {
        loadMoreData();
    }, []);
    return (
        <div
            className={className}
            id="scrollableDiv"
            style={customScrollbarStyle}
        >
            <style>{customScrollbarCSS}</style>
            <InfiniteScroll
                dataLength={data.length}
                next={loadMoreData}
                hasMore={data.length < 50}
                loader={
                    <Skeleton
                        avatar
                        paragraph={{
                            rows: 1,
                        }}
                        active
                    />
                }
                endMessage={<Divider plain>{t('end')}</Divider>}
                scrollableTarget="scrollableDiv"
            >
                <List
                    locale={{ emptyText: loading ? <></> : <Empty description="Không có" /> }}
                    dataSource={data}
                    split={false}
                    size='large'
                    renderItem={(item) => (
                        <List.Item key={item.email}>
                            <List.Item.Meta
                                avatar={<Avatar size={50} src={item.picture.large} />} // logo công ty
                                // title={<a href="https://ant.design">{item.name.last}</a>} //tên bài tuyển dụng
                                title={<div className='max-w-52 truncate'><a href="https://ant.design" target='_blank'>Tuyển dụng nhân viên</a></div>}
                                // description={item.email} //tên công ty
                                description={<div className='max-w-52 truncate'><Text type='secondary'>Công ty ABCaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Text></div>}
                            />
                            <Button className='border-0 rounded-full text-blue-600 bg-blue-200' type='text'>{t('chat')}</Button>
                        </List.Item>
                    )}
                />
            </InfiniteScroll>
        </div >
    );
}
const CardCompany = ({ className = "" }) => {
    const company = {
        logo: "https://randomuser.me/api/portraits/men/43.jpg",
        name: "Công ty ABC",
        address: "123 Đường ABC, Quận XYZ, TP. HCM",
    }
    return (
        <Card className={className}>
            <Flex gap={8}>
                <Avatar size={50} src={company.logo} />
                <Flex vertical gap={4}>
                    <Text>{company.name}</Text>
                    <Text type="secondary">{company.address}</Text>
                </Flex>
            </Flex>
        </Card>
    )
}
const ListCompany = ({ className = "" }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const { t } = useTranslation();
    const loadMoreData = () => {
        if (loading) {
            return;
        }
        setLoading(true);
        fetch('https://randomuser.me/api/?results=11&inc=name,gender,email,nat,picture&noinfo')
            .then((res) => res.json())
            .then((body) => {
                setData([...data, ...body.results]);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };
    useLayoutEffect(() => {
        loadMoreData();
    }, []);
    return (
        <div
            className={className}
            id="scrollableDiv"
            style={customScrollbarLisCompanyStyle}
        >
            <style>{customScrollbarCSS}</style>
            <InfiniteScroll
                dataLength={data.length}
                next={loadMoreData}
                hasMore={data.length < 50}
                loader={
                    <Skeleton
                        avatar
                        paragraph={{
                            rows: 1,
                        }}
                        active
                    />
                }
                scrollableTarget="scrollableDiv"
            >
                <List
                    locale={{ emptyText: loading ? <></> : <Empty description="Không có" /> }}
                    dataSource={data}
                    size='large'
                    renderItem={(item) => (
                        <List.Item key={item.email}>
                            <List.Item.Meta
                                avatar={<Avatar size={50} src={item.picture.large} />} // logo công ty
                                // title={<a href="https://ant.design">{item.name.last}</a>} //tên bài tuyển dụng
                                title={<div className='max-w-72 truncate'><Text className='text-base'>Công ty ABCaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Text></div>}
                                // description={item.email} //tên công ty
                                description={<div className='max-w-72 truncate'><Text className='font-bold text-black'>Tinh nhắn .... :09:30 </Text></div>}
                            />
                            <div className='h-full flex items-stretch'>
                                <Badge status='processing' />
                            </div>
                        </List.Item>
                    )}
                />
            </InfiniteScroll>
        </div >
    );
}
export {
    ListCompany,
    ListJob,
    CardCompany
};