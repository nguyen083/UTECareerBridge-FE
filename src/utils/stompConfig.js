import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;
let isConnected = false; // Kiểm tra trạng thái kết nối
const subscriptions = new Map(); // Lưu danh sách các subscription

// ✅ Kết nối WebSocket (chỉ tạo một lần)
export const connectStomp = (onConnected, onError) => {
    if (stompClient && isConnected) {
        // console.log('WebSocket đã kết nối, không tạo lại.');
        if (onConnected) onConnected(stompClient);
        return stompClient;
    }

    stompClient = new Client({
        webSocketFactory: () => new SockJS('/ws'),
        connectHeaders: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        },
        debug: (str) => console.log(str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: () => {
            // console.log('WebSocket đã kết nối.');
            isConnected = true;
            if (onConnected) onConnected(stompClient);

            // Tự động đăng ký lại tất cả các topic đã sub trước đó
            subscriptions.forEach((callback, topic) => {
                stompClient.subscribe(topic, callback);
            });
        },

        onStompError: (frame) => {
            console.error('STOMP error:', frame);
            if (onError) onError(frame);
        },

        onWebSocketClose: () => {
            // console.log('WebSocket đã đóng.');
            isConnected = false;
        }
    });

    stompClient.activate();
    return stompClient;
};

// ✅ Ngắt kết nối
export const disconnectStomp = () => {
    if (stompClient) {
        stompClient.deactivate();
        isConnected = false;
        subscriptions.clear();
    }
};

// ✅ Đăng ký nhận tin nhắn từ topic
export const subscribeToTopic = (topic, callback) => {
    if (!stompClient || !isConnected) {
        // console.warn('WebSocket chưa kết nối, vui lòng gọi connectStomp trước.');
        return;
    }

    if (!subscriptions.has(topic)) {
        // console.log(`Đăng ký nhận tin từ topic: ${topic}`);
        const subscription = stompClient.subscribe(topic, callback);
        subscriptions.set(topic, callback);
        return subscription;
    } else {
        console.log(`Topic đã được đăng ký trước đó: ${topic}`);
    }
};

// ✅ Hủy đăng ký topic
export const unsubscribeFromTopic = (topic) => {
    if (subscriptions.has(topic)) {
        console.log(`Hủy đăng ký topic: ${topic}`);
        subscriptions.delete(topic);
    }
};

// ✅ Lấy STOMP client hiện tại
export const getStompClient = () => stompClient;
