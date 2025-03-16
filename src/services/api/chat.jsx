import axios from "../../utils/axiosCustomize.jsx";

const chat = {
    loadMessages: async (param, token) => {
        const urlParams = new URLSearchParams(param);
        return axios.get(`/messages/conversation?${urlParams}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
    sendMessage: (stompClient, message) => {
        if (stompClient && message.content.trim()) {
            stompClient.publish({
                destination: '/app/chat',
                headers: { 'priority': 'high' },
                body: JSON.stringify(message)
            });
        }
    },
    sendMessageToChatBot: (stompClient, message) => {
        if (stompClient && message.content.trim()) {
            stompClient.publish({
                destination: '/app/chatbot.send',
                headers: { 'priority': 'high' },
                body: JSON.stringify(message)
            });
        }
    }
}
export default chat;