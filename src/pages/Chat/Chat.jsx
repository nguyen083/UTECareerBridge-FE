import { Avatar, Button, Col, Dropdown, Empty, Flex, Input, Row, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { SearchOutlined, SendOutlined } from "@ant-design/icons";
import { CardCompany, ListCompany, ListJob } from "./CardofChat";
import { SiGoogletranslate } from "react-icons/si";
import { useCallback, useEffect, useState } from "react";
import assets from '../../constant/assets.json';
import { IoMdChatboxes } from "react-icons/io";
import { ReceiverChat, SenderChat } from "./ContainerofChat";
import { useLocation } from "react-router-dom";
import chat from './../../services/api/chat';
import { connectStomp, disconnectStomp } from "../../utils/stompConfig";
const { Text } = Typography
const { TextArea } = Input;

// const messages = [
//     {
//         senderId: "1",
//         createdAt: "10:00",
//         content: "Hello",
//     },
//     {
//         senderId: "2",
//         createdAt: "10:01",
//         content: "Hi",
//     },
//     {
//         senderId: "2",
//         createdAt: "10:01",
//         content: "Can I help you?",
//     },
//     {
//         senderId: "1",
//         createdAt: "10:02",
//         content: "I'm Nguyen. I'm a student, ...",
//     },
//     {
//         senderId: "2",
//         createdAt: "10:03",
//         content: "Ok. I will help you",
//     },
//     {
//         senderId: "1",
//         createdAt: "10:04",
//         content: "I have a question about your job posting.",
//     },
//     {
//         senderId: "2",
//         createdAt: "10:05",
//         content: "Sure, what would you like to know?",
//     },
//     {
//         senderId: "1",
//         createdAt: "10:06",
//         content: "Can you tell me more about the responsibilities?",
//     },
//     {
//         senderId: "2",
//         createdAt: "10:07",
//         content: "The job involves developing web applications and collaborating with the team to design, develop, and maintain software solutions. You will be responsible for writing clean, scalable code, troubleshooting and debugging applications, and participating in code reviews to ensure high-quality standards.",
//     },
//     {
//         senderId: "1",
//         createdAt: "10:08",
//         content: "What technologies do you use?",
//     },
//     {
//         senderId: "2",
//         createdAt: "10:09",
//         content: "We use React, Node.js, and MongoDB.",
//     },
//     {
//         senderId: "1",
//         createdAt: "10:10",
//         content: "That sounds great. What are the working hours?",
//     },
//     {
//         senderId: "2",
//         createdAt: "10:11",
//         content: "We have flexible working hours, but typically it's 9 AM to 5 PM.",
//     },
//     {
//         senderId: "1",
//         createdAt: "10:12",
//         content: "Thank you for the information.",
//     },
//     {
//         senderId: "2",
//         createdAt: "10:13",
//         content: "You're welcome. Let me know if you have any other questions.",
//     }
// ];


const Chat = () => {
    const { t, i18n } = useTranslation();
    const [lang, setLang] = useState("en");
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const recipientId = parseInt(queryParams.get("recipientId"));
    const senderId = parseInt(queryParams.get("senderId"));
    const token = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJiaWxsYmF0cmkwODVAZ21haWwuY29tIiwicm9sZXMiOiJTVFVERU5UIiwiaXNzIjoidXRlLWNhcmVlci1icmlkZ2UiLCJleHAiOjE3NDMzOTYxMzYsImlhdCI6MTc0MDgwNDEzNiwidXNlcklkIjoxNX0.Pt8pahcNSgs6igUlujPfC7Ei1ZZDrp6iiWWdFARtKFVb8KhqbIgy92nHZ4vYQ-ccd1NHTSgKX9Qjkuo_QXpv0O-cVlmNbxIJDPUExI2Oixx7uLEEtjpAULHf40cmWPtqoQlJqf6WIrJvviNEDd1FPYdwKKM1t1PV7vb2xHXCkxluokPd9M-K74K5wLcOSiVGGEAnlOzUEMNMAH68QIA9h92NfrfZdU28pyUeAESkXZOz3L6wMgJt3cfrRYOY88-OEZ3ZUiDc0X1J8HO_ibjcdj0By5slzZZFqv41TGpHiKJYI-DALYdocu8_t9gFVCLt4bGf_hVluKJEwZVCRGBLAw'

    const onConnected = useCallback((client) => {
        setStompClient(client);

        // Subscribe vào topic để nhận tin nhắn
        client.subscribe('/user/' + senderId + '/queue/messages', (message) => {
            const receivedMessage = JSON.parse(message.body);
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });

        // Thông báo cho server biết client đã tham gia
        // client.publish({
        //     destination: '/app/join',
        //     body: JSON.stringify({ sender: 'User', type: 'JOIN' })
        // });
    }, []);

    useEffect(() => {
        chat.loadMessages({ user2Id: recipientId, user1Id: senderId }, token).then((res) => {
            console.log(res);
            setMessages(res);
        }
        ).catch((err) => {
            console.log(err);
        })
    }, []);
    useEffect(() => {
        connectStomp(onConnected, (error) => {
            console.error('Lỗi kết nối:', error);
        });

        // Ngắt kết nối khi component unmount
        return () => {
            disconnectStomp();
        };
    }, [onConnected]);
    const sendMessage = () => {
        const message = {
            senderId: senderId,
            recipientId: recipientId,
            content: newMessage,
        };

        chat.sendMessage(stompClient, message);
        setMessages((prevMessages) => [...prevMessages, message]);
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
                    <CardCompany className="shadow-md rounded-t-none" />

                    {/* Đoạn chat với công ty khi chưa có tin nhắn nào*/}
                    <div className="w-full flex-1 overflow-y-auto flex flex-col justify-center">
                        <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description={t('no_message')} />
                    </div>

                    {/* Đoạn chat với công ty khi có tin nhắn */}
                    <div className="w-full flex-1 overflow-y-auto flex flex-col h-auto px-2 gap-4">
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
                        <TextArea className="rounded-3xl resize-none overflow-hidden h-auto" placeholder={t('enter_message')} size="large" autoSize={{ minRows: 1, maxRows: 4 }} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                        <Flex className="min-h-[41px]" justify="center" align="center"><Button icon={<SendOutlined className="text-3xl text-blue-600" />} onClick={() => sendMessage()}></Button></Flex>
                    </Flex>
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
export default Chat;