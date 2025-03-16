
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Card, Flex, FloatButton, Image, Popover, Input, Button } from 'antd';

import './ChatBot.scss'
import { ReceiverChat, SenderChat } from '../../../pages/Chat/ContainerofChat';
import { connectStomp, disconnectStomp } from '../../../utils/stompConfig';
import { SendOutlined } from '@ant-design/icons';
import chat from '../../../services/api/chat';
import { customScrollbarCSS } from '../../../constant/scrollbar';

const { TextArea } = Input;
const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const divRef = useRef(null);
    const [sessionId, setSessionId] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const currentUserId = "current-user";

    const generateSessionId = () => {
        const storedId = localStorage.getItem('chatbotSessionId');
        if (storedId) {
            return storedId;
        }

        const newId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('chatbotSessionId', newId);
        return newId;
    };


    const cleanMarkdownText = (text) => {
        if (!text) return '';

        return text
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1');
    };

    const onConnected = useCallback((client) => {
        const newSessionId = generateSessionId();
        setSessionId(newSessionId);
        setStompClient(client);
        client.subscribe('/chatbot/' + newSessionId, (response) => {
            const responseBody = JSON.parse(response.body);
            const botMessage = {
                content: cleanMarkdownText(responseBody.message.content),
                senderId: 'chatbot',
                timestamp: new Date().toISOString()
            };
            setMessages(prevMessages => [...prevMessages, botMessage]);
        });
    }, []);

    useEffect(() => {
        if (divRef.current) {
            divRef.current.scrollTop = divRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        connectStomp(onConnected, (error) => {
            console.error('Lỗi kết nối:', error);
        });
        return () => {
            disconnectStomp();
        };
    }, [onConnected]);

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        // Add user message to UI immediately
        const userMessage = {
            content: newMessage,
            senderId: currentUserId,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);

        // Prepare and send message to chatbot
        const payload = {
            sessionId: sessionId,
            content: newMessage + ". Hãy trả lời nghiêm túc theo kiểu tin nhắn"
        };

        chat.sendMessageToChatBot(stompClient, payload);
        setNewMessage("");
    };
    return (
        <Card title={<Flex className='text-white' align='center' gap={6}><Image size={30} src='src\assets\chatbot.png' preview={false} /> ChatBot</Flex>}>
            <div className='flex flex-col h-fit'>
                <div className='!min-h-96 !min-w-80 !max-h-[500px] !max-w-[400px] flex flex-col gap-4 overflow-x-auto' ref={divRef}>
                    {/* <style>{customScrollbarCSS}</style> */}
                    {messages.map((message, index) => {
                        if (message.senderId === currentUserId) {
                            return <SenderChat key={index} message={message} />;
                        } {
                            return <ReceiverChat key={index} message={message} />;
                        }
                    })}
                </div>
                <Flex className=" p-2 w-full h-auto" gap={2} justify="center" align="flex-end">
                    <TextArea className="rounded-3xl resize-none overflow-hidden h-auto" placeholder="Nhập câu hỏi của bạn" size="large" autoSize={{ minRows: 1, maxRows: 4 }} value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
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
            <Popover overlayClassName='chatbot' className='p-0 ' placement='leftBottom' content={ChatBot} trigger="click">
                <FloatButton className='w-14 h-14' icon={<Image size={40} src='src\assets\chatbot.png' preview={false} />} />
            </Popover>
        </div>
    );

}
export default IconChatBot