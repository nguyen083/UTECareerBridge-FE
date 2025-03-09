
import { Empty, Typography } from "antd";
import { ReceiverChat, SenderChat } from "./ContainerofChat";

const { Text } = Typography;

const ChatBox = ({ messages }) => {
    return (
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
    )
}