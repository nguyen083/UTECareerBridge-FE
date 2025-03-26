import { Avatar, Button, Col, Empty, Flex, Image, Input, Row, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { SendOutlined } from "@ant-design/icons";
import { CardCompany, ListConversation, ListJob } from "./CardofChat";
import { useEffect, useRef, useState } from "react";
import assets from '../../constant/assets.json';
import { ReceiverChat, SenderChat } from "./ContainerofChat";
import { useNavigate, useParams } from "react-router-dom";
import chat from '../../services/api/chat';
import { connectStomp, subscribeToTopic, unsubscribeFromTopic } from "../../utils/stompConfig";
import { useSelector } from "react-redux";
import company from './../../services/api/company';

const { Text } = Typography
const { TextArea } = Input;

const ChatLayout = () => {
    const ConversationTopic = '/topic/conversation/';
    const { t } = useTranslation();
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const { recipientId } = useParams();
    const senderId = useSelector((state) => state.user.userId);
    const divRef = useRef(null);
    const currentConversationRef = useRef(null);
    const [companyInfor, setCompanyInfor] = useState({});
    const navigate = useNavigate()

    const getConversationId = (id1, id2) => {
        return parseInt(id1) < parseInt(id2) ? `${id1}-${id2}` : `${id2}-${id1}`;
    };

    useEffect(() => {
        if (divRef !== null) {
            divRef.current?.scrollTo({
                top: divRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    useEffect(() => {
        let stompSubscription = null;

        if (recipientId && senderId) {
            company.getCompanyById(recipientId)
                .then((res) => {
                    setCompanyInfor(res.data);
                })
                .catch((err) => {
                    console.error(err);
                });

            chat.loadMessages({ user2Id: recipientId, user1Id: senderId })
                .then((res) => {
                    setMessages(res.data.content);
                })
                .catch((err) => {
                    console.log(err);
                });

            const conversationId = getConversationId(senderId, recipientId);
            currentConversationRef.current = conversationId;
            const topic = ConversationTopic + conversationId;

            connectStomp(() => {
                stompSubscription = subscribeToTopic(topic, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                });
            });
        }

        return () => {
            if (currentConversationRef.current) {
                const topic = ConversationTopic + currentConversationRef.current;
                unsubscribeFromTopic(topic);
                currentConversationRef.current = null;
            }
        };
    }, [recipientId, senderId]);

    const sendMessage = () => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.read === false && lastMessage.senderId !== senderId) {
                chat.readed(lastMessage.id);
            }
        }
        const message = {
            senderId: senderId,
            recipientId: recipientId,
            content: newMessage,
        };
        chat.sendMessage(message);
        setNewMessage("");
    }

    return (
        <>
            <Row className="min-h-screen">
                <Col span={6} className=" min-h-full p-4 ">
                    <Space size={"small"} className=" w-full pb-5" direction="vertical">
                        <Flex gap={8} justify="space-between" align="center" className="w-full border-b pb-4">
                                <Image className="cursor-pointer" alt="website logo" src={assets.logo} preview={false} height={75} onClick={()=>{navigate('/')}}/>
                        </Flex>
                        <ListConversation />
                    </Space>
                </Col>
                <Col span={12} className="border border-x-gray-200 flex flex-col max-h-screen bg-gray-50 bg-opacity-55">
                    <Space direction="vertical" className="w-full py-3 px-2 border-b h-auto bg-card-color">
                        <Text className="text-base text-text-color font-bold">{t('chat_with_employer')}</Text>
                    </Space>

                    {recipientId ? <>
                        <CardCompany className="shadow-md rounded-t-none" company={companyInfor}/>
                        <div className="w-full flex-1 overflow-y-auto flex flex-col h-auto p-2 gap-4 " ref={divRef}>
                            {messages.length === 0 && <Empty className="mt-36" image={<Avatar src={companyInfor.companyLogo} size={100} />} description={<Text className="text-text-color text-lg font-bold">{companyInfor.companyName}</Text>} />}
                            {messages.map((message, index) => {
                                if (message.senderId === senderId) {
                                    return <SenderChat key={index} message={message} />;
                                } {
                                    return <ReceiverChat key={index} message={message} />;
                                }
                            })}
                        </div>
                        <Flex className="bg-white p-2 w-full h-auto mb-4 border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]" gap={16} justify="center" align="flex-end">
                            <TextArea className="rounded-3xl resize-none overflow-hidden h-auto" placeholder={t('enter_message')} size="large" autoSize={{ minRows: 1, maxRows: 4 }} value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        if (newMessage.trim()) {
                                            sendMessage();
                                        }
                                    }
                                }} />
                            <Flex className="min-h-[41px]" justify="center" align="center"><Button size="large" type="text" icon={<SendOutlined className="text-3xl text-blue-600" />} onClick={() => sendMessage()}></Button></Flex>
                        </Flex>
                    </> :
                        <div className="w-full flex-1 overflow-y-auto flex flex-col justify-center">
                            <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description={t('choose_conversation')} />
                        </div>}
                </Col>
                <Col span={6} className="min-h-full">
                    <Space size={"large"} className=" w-full py-5 ps-3" direction="vertical">
                        <Text className="h-auto text-sm font-bold uppercase text-text-color">{t('job_application_submitted')}</Text>
                        <ListJob />
                    </Space>
                </Col>
            </Row >
        </>
    )
}
export default ChatLayout;