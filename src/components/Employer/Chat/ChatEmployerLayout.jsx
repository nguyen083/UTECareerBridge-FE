import { Avatar, Col, Empty, Flex, Row, Space, Typography, Input, Button } from "antd";
import { CardCompany, ListCompany } from "../../../pages/Chat/CardofChat";
import { ReceiverChat, SenderChat } from "../../../pages/Chat/ContainerofChat";
import { SendOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import chat from "../../../services/api/chat";
import { useSelector } from "react-redux";
import { connectStomp, disconnectStomp } from "../../../utils/stompConfig";
import { customScrollbarCSS } from "../../../constant/scrollbar";


const { Text } = Typography;
const { TextArea } = Input;


const ChatEmployerLayout = () => {

    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const { t, i18n } = useTranslation();
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

    //Tự động scroll khi cập nhật tin nhắn
    useEffect(() => {
        if (divRef !== null) {
            divRef.current?.scrollTo({
                top: divRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    //Load tin nhắn nếu có recipientId
    useEffect(() => {
        if (recipientId)
            chat.loadMessages({ user2Id: recipientId, user1Id: senderId }, token).then((res) => {
                setMessages(res);
            }
            ).catch((err) => {
                console.log(err);
            })
    }, [recipientId]);

    //Kết nối stomp, ngắt kết nối khi unmount
    useEffect(() => {
        connectStomp(onConnected, (error) => {
            console.error('Lỗi kết nối:', error);
        });

        return () => {
            disconnectStomp();
        };
    }, [onConnected]);

    //Gửi tin nhắn
    const sendMessage = () => {
        const message = {
            senderId: senderId,
            recipientId: recipientId,
            content: newMessage,
        };

        chat.sendMessage(stompClient, message);

        setNewMessage("");
    }

    return (
        <>
            <Row className="border h-full">
                <Col span={18} className="border border-x-gray-200 flex flex-col">

                    <Space direction="vertical" className="w-full py-3 px-2 border-b h-auto">
                        <Text className="text-base font-bold">Trò chuyện với sinh viên</Text>
                    </Space>
                    {recipientId ? <>
                        <div className="w-full max-h-[703px] flex-1 overflow-y-auto flex flex-col px-2 gap-4 " ref={divRef}>
                            <style>{customScrollbarCSS}</style>
                            <Empty className="mt-36" image={<Avatar src="https://randomuser.me/api/portraits/men/43.jpg" size={100} />} description={<Text className="text-base font-bold">Công ty ABC</Text>} />
                            {messages.map((message, index) => {
                                if (message.senderId === senderId) {
                                    return <SenderChat key={index} message={message} />;
                                } {
                                    return <ReceiverChat key={index} message={message} />;
                                }
                            })}
                        </div>
                        <Flex className=" p-2 w-full mb-4" gap={16} justify="center" align="flex-end">
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
                        <div className="w-full h-full flex items-center justify-center">
                            <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description={t('no_message')} />
                        </div>}

                </Col>
                <Col span={6} className="min-h-full border-l">
                    {/* <ListCompany className="min-h-full" /> */}
                </Col>
            </Row >
        </>
    )
}
export default ChatEmployerLayout;