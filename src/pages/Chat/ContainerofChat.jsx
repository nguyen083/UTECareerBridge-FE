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
            <div className="bg-gray-200 px-4 py-2 rounded-t-3xl rounded-e-3xl ">
                <Text className="text-base">{message.content}</Text>
            </div>
            <Text type="secondary" className="whitespace-nowrap">{message?.createdAt}</Text>
        </Flex>
    </div>);
}
export {
    SenderChat,
    ReceiverChat
}