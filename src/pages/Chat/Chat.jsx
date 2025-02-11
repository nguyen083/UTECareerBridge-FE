import { Avatar, Button, Col, Dropdown, Empty, Flex, Input, Row, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { SearchOutlined, SendOutlined } from "@ant-design/icons";
import { CardCompany, ListCompany, ListJob } from "./CardofChat";
import { SiGoogletranslate } from "react-icons/si";
import { useState } from "react";
import assets from '../../constant/assets.json';
import { IoMdChatboxes } from "react-icons/io";
import { ReceiverChat, SenderChat } from "./ContainerofChat";
// import { MdGTranslate } from "react-icons/md";
const { Text } = Typography
const { TextArea } = Input;

const messages = [
    {
        senderId: "1",
        time: "10:00",
        content: "Hello",
    },
    {
        senderId: "2",
        time: "10:01",
        content: "Hi",
    },
    {
        senderId: "2",
        time: "10:01",
        content: "Can I help you?",
    },
    {
        senderId: "1",
        time: "10:02",
        content: "I'm Nguyen. I'm a student, ...",
    },
    {
        senderId: "2",
        time: "10:03",
        content: "Ok. I will help you",
    },
    {
        senderId: "1",
        time: "10:04",
        content: "I have a question about your job posting.",
    },
    {
        senderId: "2",
        time: "10:05",
        content: "Sure, what would you like to know?",
    },
    {
        senderId: "1",
        time: "10:06",
        content: "Can you tell me more about the responsibilities?",
    },
    {
        senderId: "2",
        time: "10:07",
        content: "The job involves developing web applications and collaborating with the team to design, develop, and maintain software solutions. You will be responsible for writing clean, scalable code, troubleshooting and debugging applications, and participating in code reviews to ensure high-quality standards.",
    },
    {
        senderId: "1",
        time: "10:08",
        content: "What technologies do you use?",
    },
    {
        senderId: "2",
        time: "10:09",
        content: "We use React, Node.js, and MongoDB.",
    },
    {
        senderId: "1",
        time: "10:10",
        content: "That sounds great. What are the working hours?",
    },
    {
        senderId: "2",
        time: "10:11",
        content: "We have flexible working hours, but typically it's 9 AM to 5 PM.",
    },
    {
        senderId: "1",
        time: "10:12",
        content: "Thank you for the information.",
    },
    {
        senderId: "2",
        time: "10:13",
        content: "You're welcome. Let me know if you have any other questions.",
    }
];


const Chat = () => {
    const { t, i18n } = useTranslation();
    const [lang, setLang] = useState("en");
    // const playNotificationSound = () => {
    //     const audio = new Audio(notification); // Đường dẫn đến file âm thanh
    //     audio.play();
    // };

    // const sendNotification = () => {
    //     if (Notification.permission === "granted") {
    //         // Gửi thông báo
    //         new Notification("Thông báo mới!", {
    //             body: "Đây là nội dung của thông báo",
    //             icon: "../../../public/bell-ringing.png", // Thay bằng đường dẫn icon của bạn
    //             silent: true,
    //         });
    //         playNotificationSound();

    //     } else if (Notification.permission === "default") {
    //         // Yêu cầu quyền nếu chưa cấp
    //         Notification.requestPermission().then((permission) => {
    //             if (permission === "granted") {
    //                 sendNotification();
    //             }
    //         });
    //     }
    // };


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
            {/* <button onClick={() => changeLanguage('en')}>English</button>
            <button onClick={() => changeLanguage('vi')}>Tiếng Việt</button> */}

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

                    {/* Đoạn chat với công ty */}
                    {/* <div className="w-full flex-1 overflow-y-auto flex flex-col justify-center">
                        <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description={t('no_message')} />
                    </div> */}

                    <div className="w-full flex-1 overflow-y-auto flex flex-col h-auto px-2 gap-4">
                        <Empty className="mt-36" image={<Avatar src="https://randomuser.me/api/portraits/men/43.jpg" size={100} />} description={<Text className="text-base font-bold">Công ty ABC</Text>} />
                        {messages.map((message, index) => {
                            if (message.senderId === "1") {
                                return <SenderChat key={index} message={message} />;
                            } {
                                return <ReceiverChat key={index} message={message} />;
                            }
                        })}
                    </div>
                    <Flex className=" p-2 w-full h-auto mb-4" gap={16} justify="center" align="flex-end">
                        <TextArea className="rounded-3xl resize-none overflow-hidden h-auto" placeholder={t('enter_message')} size="large" autoSize={{ minRows: 1, maxRows: 4 }} />
                        <Flex className="min-h-[41px]" justify="center" align="center"><SendOutlined className="text-3xl text-blue-600" /></Flex>
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