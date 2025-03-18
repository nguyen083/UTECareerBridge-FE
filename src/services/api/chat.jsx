import axios from "../../utils/axiosCustomize.jsx";
import { getStompClient } from "../../utils/stompConfig.js";

const chat = {
    loadMessages: async (param) => {
        const urlParams = new URLSearchParams(param);
        return axios.get(`/messages/conversation?${urlParams}`);
    },
    getListConversation: (param) => {
        const urlParams = new URLSearchParams(param);
        return axios.get(`/messages/contacts?${urlParams}`);
    },
    sendMessage: (message) => {
        const stompClient = getStompClient();
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
    },
    readed: (id) => {
        return axios.put(`/messages/${id}/read`);
    }
}
export default chat;