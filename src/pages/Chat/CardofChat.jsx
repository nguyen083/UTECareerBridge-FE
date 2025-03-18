import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Divider, Empty, Flex, List, Skeleton, Typography, message } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'react-i18next';
import { getApplyJobByStudent } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import { customScrollbarCSS } from '../../constant/scrollbar';
import chat from '../../services/api/chat';
import { useSelector } from 'react-redux';
import { connectStomp, subscribeToTopic, unsubscribeFromTopic } from '../../utils/stompConfig';

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

const ListJob = ({ className = "" }) => {
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const loadMoreData = () => {
        if (loading) {
            return;
        }
        setLoading(true);
        getApplyJobByStudent().then((response) => {
            setData(response.data.content);
            setTotal(response.data.totalElements);
        }).catch((error) => {
            console.error('Error fetching data:', error);
        }).finally(() => {
            setLoading(false);
        });
    };
    useEffect(() => {
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
                hasMore={data.length < total}
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
                        <List.Item key={item.applicationId}>
                            <List.Item.Meta
                                avatar={<Avatar size={50} src={item.companyLogo} />}
                                title={<div className='max-w-52 truncate'><a href="https://ant.design" target='_blank'>{item.jobTitle}</a></div>}
                                description={<div className='max-w-52 truncate'><Text type='secondary'>{item.companyName}</Text></div>}
                            />
                            <Button className='border-0 rounded-full text-blue-600 bg-blue-200' type='text' onClick={() => navigate(`/chat/${item.companyId}`)}>{t('chat')}</Button>
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
    const ListConversationTopic = '/topic/conversation/';
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const role = useSelector((state) => state.user.role);
    const navigate = useNavigate();
    const senderId = useSelector((state) => state.user.userId);

    useEffect(() => {
        connectStomp(() => {
            // Lấy STOMP client sau khi kết nối (nếu cần)
            subscribeToTopic(ListConversationTopic + senderId, (message) => {
                const receivedMessage = JSON.parse(message.body);
                let newArrMessage = [...data];
                newArrMessage.reverse().push(receivedMessage);
                const messageMap = new Map(newArrMessage.map((item) => [item.recipientId, item]));
                console.log("messageMap: ", messageMap);
                setData([...messageMap.values()].reverse());
            });
        });
        return () => {
            unsubscribeFromTopic(ListConversationTopic + senderId);
        };
    }, []);

    const ChooseItem = (item) => {
        if (!item.read && !item.lastSenderId)
            chat.readed(item.messageId);
        role === 'student' ? navigate(`/chat/${item.recipientId}`) : navigate(`/employer/chat/${item.recipientId}`)

    }

    const loadMoreData = () => {
        if (loading) {
            return;
        }
        setLoading(true);
        chat.getListConversation({ page, size: 10 })
            .then((res) => {
                setData([...data, ...res.data.content]);
                setPage(res.data.pageable.pageNumber + 1);
                setTotal(res.data.totalElements);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
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
                hasMore={data.length < total}
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
                    split={true}
                    locale={{ emptyText: loading ? <></> : <Empty description="Không có" /> }}
                    dataSource={data}
                    size='large'
                    renderItem={(item) => (
                        <List.Item key={item.recipientId} className='cursor-pointer' onClick={() => ChooseItem(item)}>
                            <List.Item.Meta
                                avatar={<Avatar size={50} src={item.avatar} />}
                                title={<div className='max-w-72 truncate font-bold'><Text className='text-base'>{item.name}</Text></div>}
                                description={<Flex align='center' gap={4}><div className='max-w-64 truncate'><Text className={`${!item.read && !item.lastSenderId && 'font-bold'} text-black`}>{item.lastSenderId && 'Bạn: '} {item.lastMessage} </Text></div> {item.createdAt}</Flex>}
                            />
                            {!item.read && !item.lastSenderId && <div className='h-full flex items-stretch'>
                                <Badge status='processing' />
                            </div>}
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