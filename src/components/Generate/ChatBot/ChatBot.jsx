
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Card, Flex, FloatButton, Image, Popover, Input, Button } from 'antd';

import './ChatBot.scss'
import { ReceiverChat, SenderChat } from '../../../pages/Chat/ContainerofChat';
import { connectStomp, disconnectStomp } from '../../../utils/stompConfig';
import { SendOutlined } from '@ant-design/icons';
import chat from '../../../services/api/chat';

const { TextArea } = Input;
const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const divRef = useRef(null);
    const [newMessage, setNewMessage] = useState('');




    const onConnected = useCallback((client) => {
        setStompClient(client);
        // kênh đăng ký nhận tin nhắn
        // client.subscribe('/topic/conversation/' + conversationId, (message) => {
        //     const receivedMessage = JSON.parse(message.body);
        //tin nhắn nhận đc khi có chatbot phản hồi
        //     setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        // });
    }, []);
    useEffect(() => {
        connectStomp(onConnected, (error) => {
            console.error('Lỗi kết nối:', error);
        });

        return () => {
            disconnectStomp();
        };
    }, [onConnected]);

    const sendMessage = () => {

        //param cần gửi đi
        const message = {
            // content: newMessage,
        };

        chat.sendMessage(stompClient, message);

        setNewMessage("");

    }
    return (
        <Card className='chatbot' title={<Flex className='text-white' align='center' gap={6}><Image size={30} src='src\assets\chatbot.png' preview={false} /> ChatBot</Flex>}>
            <div className='flex flex-col h-fit'>
                <div className='!min-h-96 !min-w-80 flex flex-col gap-4' ref={divRef}>
                    {messages.map((message, index) => {
                        if (message.senderId === senderId) {
                            return <SenderChat key={index} message={message} />;
                        } {
                            return <ReceiverChat key={index} message={message} />;
                        }
                    })}
                </div>
                <Flex className=" p-2 w-full h-auto mb-4" gap={16} justify="center" align="flex-end">
                    <TextArea className="rounded-3xl resize-none overflow-hidden h-auto" placeholder="Nhập tin nhắn" size="large" autoSize={{ minRows: 1, maxRows: 4 }} value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
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
            </div>

        </Card>)
}

const IconChatBot = () => {
    return (
        <div className='popover-chat'>
            <Popover className='p-0 ' placement='leftBottom' content={ChatBot} trigger="click">
                <FloatButton className='w-14 h-14' icon={<Image size={40} src='src\assets\chatbot.png' preview={false} />} />
            </Popover>
        </div>
    );

}
export default IconChatBot