import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Divider, Empty, Flex, List, Skeleton, Typography, message } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'react-i18next';
import { getApplyJobByStudent } from '../../services/apiService';
import { useNavigate, useParams } from 'react-router-dom';
import { customScrollbarCSS } from '../../constant/scrollbar';
import chat from '../../services/api/chat';
import { useSelector } from 'react-redux';
import { connectStomp, subscribeToTopic, unsubscribeFromTopic } from '../../utils/stompConfig';
import company from './../../services/api/company';

const { Text } = Typography;
const customScrollbarStyle = {
    height: 'calc(100vh - 100px)',
    overflow: 'auto',
    padding: '0 8px',
    scrollbarWidth: 'thin',
    scrollbarColor: '#888 #f1f1f1',
};
const customScrollbarLisCompanyStyle = {
    height: 'calc(100vh - 210px)',
    overflow: 'auto',
    padding: '0 8px',
    scrollbarWidth: 'thin',
    scrollbarColor: '#888 #f1f1f1',
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
                    split={true}
                    size='large'
                    renderItem={(item) => (
                        <List.Item key={item.applicationId} >
                            <List.Item.Meta
                                avatar={<Avatar size={50} src={item.companyLogo} />}
                                title={<div className=' text-base max-w-52 truncate font-semibold'>{item.jobTitle}</div>}
                                description={<div className='max-w-52 truncate'><Text type='secondary'>{item.companyName}</Text></div>}
                            />
                            <Button className='border-0 rounded-full text-blue-600 bg-blue-200 hover:scale-105 ease-in-out' type='text' onClick={() => navigate(`/chat/${item.companyId}`)}>{t('chat')}</Button>
                        </List.Item>
                    )}
                />
            </InfiniteScroll>
        </div >
    );
}
const CardCompany = ({ className = "" , company}) => {
    return (
        <Card className={className}>
            <Flex gap={8}>
                <Avatar size={50} src={company.companyLogo} />
                <Flex vertical gap={4}>
                    <Text className='text-text-color-hover font-semibold'>{company.companyName}</Text>
                    <Text type="secondary" className='truncate max-w-full'>{company.companyAddress}</Text>
                </Flex>
            </Flex>
        </Card>
    )
}
const ListConversation = () => {
    const ListConversationTopic = '/topic/chat-list/';
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const role = useSelector((state) => state.user.role);
    const navigate = useNavigate();
    const senderId = useSelector((state) => state.user.userId);
    const { t } = useTranslation();
   

    useEffect(() => {
        connectStomp(() => {
            subscribeToTopic(ListConversationTopic + senderId, (message) => {
                const receivedMessage = JSON.parse(message.body);
                setData(prevData => {
                   
                    const existingMessageIndex = prevData.findIndex(item => item.recipientId === receivedMessage.recipientId);
                    const isNewConversation = existingMessageIndex === -1;

                   
                    if (isNewConversation) {
                        setTotal(prevTotal => prevTotal + 1);
                    }

                   
                    let newData = prevData.filter(item => item.recipientId !== receivedMessage.recipientId);
                   
                    newData.unshift(receivedMessage);

                   
                    return newData;
                });
            });
        });

        return () => {
            unsubscribeFromTopic(ListConversationTopic + senderId);
        };
    }, [senderId]);

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
               
                const newContent = res.data.content;

               
                setData(prevData => {
                   
                    const existingIds = new Set(prevData.map(item => item.recipientId));
                   
                    const uniqueNewItems = newContent.filter(item => !existingIds.has(item.recipientId));
                   
                    return [...prevData, ...uniqueNewItems];
                });

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
                className='p-1'
                    split={true}
                    locale={{ emptyText: loading ? <></> : <Empty  description={t('no_conversations_found')} /> }}
                    dataSource={data}
                    size='large'
                    renderItem={(item) => (
                        <List.Item key={item.recipientId + item.messageId} className='!p-4 cursor-pointer hover:-translate-y-px hover:shadow-md' onClick={() => ChooseItem(item)}>
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
    ListConversation,
    ListJob,
    CardCompany
};