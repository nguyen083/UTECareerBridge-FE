import { Avatar, Button, Col, Empty, Flex, Input, Row, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { SearchOutlined, SendOutlined } from "@ant-design/icons";
import { CardCompany, ListCompany, ListJob } from "./CardofChat";
import { SiGoogletranslate } from "react-icons/si";
import { useCallback, useEffect, useRef, useState } from "react";
import assets from '../../constant/assets.json';
import { IoMdChatboxes } from "react-icons/io";
import { ReceiverChat, SenderChat } from "./ContainerofChat";
import { useParams } from "react-router-dom";
import chat from '../../services/api/chat';
import { connectStomp, disconnectStomp } from "../../utils/stompConfig";
import { useSelector } from "react-redux";
const { Text } = Typography
const { TextArea } = Input;

const ChatLayout = () => {
    const { t, i18n } = useTranslation();
    const [lang, setLang] = useState("en");
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const { recipientId } = useParams();
    const senderId = useSelector((state) => state.user.userId);
    const token = localStorage.getItem("accessToken");
    const divRef = useRef(null);
    const currentConversationRef = useRef(null);

    const getConversationId = (id1, id2) => {
        return parseInt(id1) < parseInt(id2) ? `${id1}-${id2}` : `${id2}-${id1}`;
    };

    const onConnected = useCallback((client) => {
        setStompClient(client);

        if (recipientId) {
            const conversationId = getConversationId(senderId, recipientId);
            currentConversationRef.current = conversationId;

            client.subscribe('/topic/conversation/' + conversationId, (message) => {
                const receivedMessage = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, receivedMessage]);
            });
        }
    }, [recipientId, senderId]);




    useEffect(() => {
        if (divRef !== null) {
            divRef.current?.scrollTo({
                top: divRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    useEffect(() => {
        if (recipientId)
            chat.loadMessages({ user2Id: recipientId, user1Id: senderId }).then((res) => {
                setMessages(res);
            }
            ).catch((err) => {
                console.log(err);
            })
    }, [recipientId]);

    useEffect(() => {
        connectStomp(onConnected, (error) => {
            console.error('Lỗi kết nối:', error);
        });

        return () => {
            disconnectStomp();
        };
    }, [onConnected]);

    const sendMessage = () => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.read === false && lastMessage.senderId !== senderId) {
            chat.readed(lastMessage.id);
        }
        const message = {
            senderId: senderId,
            recipientId: recipientId,
            content: newMessage,
        };

        chat.sendMessage(stompClient, message);

        setNewMessage("");
    }
    const changeLanguage = () => {
        if (lang === "en") {
            i18n.changeLanguage("vi");
            setLang("vi");
        } else {
            i18n.changeLanguage("en");
            setLang("en");
        }
    };

    return (
        <>
            <Row className="min-h-screen">
                <Col span={6} className=" min-h-full p-4">
                    <Space size={"small"} className=" w-full py-5" direction="vertical">
                        <Flex gap={8} justify="space-between" align="center" className="w-full ">
                            <Flex gap={8} align="center">
                                <Avatar shape="square" src={assets.logo} size={75} />
                                <Flex gap={4}>
                                    <Text className="text-2xl font-bold text-blue-500">UTE Career Chat</Text>
                                    <IoMdChatboxes className="text-blue-800" size={20} />
                                </Flex>
                            </Flex>
                            <SiGoogletranslate size={24} onClick={changeLanguage} className="text-blue-400" />
                        </Flex>
                        <Input prefix={<SearchOutlined className="text-lg" />} allowClear size="large" className="rounded-full" placeholder={t('find_company_name_employer')} />
                        <ListCompany />
                    </Space>
                </Col>
                <Col span={12} className="border border-x-gray-200 flex flex-col max-h-screen">
                    <Space direction="vertical" className="w-full py-3 px-2 border-b h-auto">
                        <Text className="text-base font-bold">{t('chat_with_employer')}</Text>
                    </Space>

                    {recipientId ? <>
                        <CardCompany className="shadow-md rounded-t-none" />
                        <div className="w-full flex-1 overflow-y-auto flex flex-col h-auto px-2 gap-4 " ref={divRef}>
                            <Empty className="mt-36" image={<Avatar src="https://randomuser.me/api/portraits/men/43.jpg" size={100} />} description={<Text className="text-base font-bold">Công ty ABC</Text>} />
                            {messages.map((message, index) => {
                                if (message.senderId === senderId) {
                                    return <SenderChat key={index} message={message} />;
                                } {
                                    return <ReceiverChat key={index} message={message} />;
                                }
                            })}
                        </div>
                        <Flex className=" p-2 w-full h-auto mb-4" gap={16} justify="center" align="flex-end">
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
                            <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description={t('no_message')} />
                        </div>}
                </Col>
                <Col span={6} className="min-h-full">
                    <Space size={"large"} className=" w-full py-5 ps-3" direction="vertical">
                        <Text className="h-auto text-sm font-bold uppercase">{t('job_application_submitted')}</Text>
                        <ListJob />
                    </Space>
                </Col>
            </Row >
        </>
    )
}
export default ChatLayout;