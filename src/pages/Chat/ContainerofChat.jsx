import { Flex, Typography } from "antd";

const { Text } = Typography;

const SenderChat = ({ message }) => {
    return (
        <div className="w-full flex justify-end">
            <Flex gap={8} align="center" className="max-w-[85%]" >
                <Text type="secondary" className="text-sm whitespace-nowrap">{message.createdAt}</Text>
                <div className="bg-blue-500 px-4 py-2 rounded-t-3xl rounded-s-3xl ">
                    <Text className="text-base text-white">{message.content}</Text>
                </div>
            </Flex>
        </div>
    );
};

const ReceiverChat = ({ message }) => {
    return (<div className="w-full flex justify-start">
        <Flex gap={8} align="center" className="w-3/4">
            <div className="bg-gray-200 px-4 py-2 rounded-t-3xl rounded-e-3xl chat-message-content">
                <div 
                    className="text-base" 
                    dangerouslySetInnerHTML={{ __html: message.content }}
                />
                <style jsx>{`
                    .chat-message-content {
                        word-break: break-word;
                    }
                    .chat-message-content a {
                        color: #1890ff;
                        text-decoration: underline;
                        cursor: pointer;
                        margin: 0 2px;
                    }
                    .chat-message-content a:hover {
                        color: #40a9ff;
                    }
                    .chat-message-content li {
                        display: list-item;
                        margin-left: 20px;
                        margin-bottom: 8px;
                    }
                    .chat-message-content br {
                        margin-bottom: 8px;
                        display: block;
                        content: "";
                    }
                    .chat-message-content strong {
                        font-weight: bold;
                    }
                `}</style>
            </div>
            <Text type="secondary" className="whitespace-nowrap">{message?.createdAt}</Text>
        </Flex>
    </div>);
}

export {
    SenderChat,
    ReceiverChat
}