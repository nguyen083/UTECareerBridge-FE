import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;
let isConnected = false;
const subscriptions = new Map();

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
        // debug: (str) => console.log(str),
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
        console.warn('WebSocket chưa kết nối, vui lòng gọi connectStomp trước.');
        return null;
    }

    try {
        if (!subscriptions.has(topic)) {
            console.log(`Đăng ký nhận tin từ topic: ${topic}`);
            const subscription = stompClient.subscribe(topic, callback);
            // Lưu cả callback và subscription object
            subscriptions.set(topic, {
                callback,
                subscription
            });
            return subscription;
        } else {
            console.log(`Topic đã được đăng ký trước đó: ${topic}`);
            return subscriptions.get(topic).subscription;
        }
    } catch (error) {
        console.error(`Lỗi khi đăng ký topic ${topic}:`, error);
        return null;
    }
};

// ✅ Hủy đăng ký topic
export const unsubscribeFromTopic = (topic) => {
    if (!stompClient || !isConnected) {
        console.warn('WebSocket chưa kết nối.');
        return;
    }

    try {
        if (subscriptions.has(topic)) {
            const { subscription } = subscriptions.get(topic);
            if (subscription) {
                // Hủy đăng ký STOMP subscription
                subscription.unsubscribe();
                // Xóa khỏi Map theo dõi
                subscriptions.delete(topic);
                console.log(`Đã hủy đăng ký topic: ${topic}`);
            }
        } else {
            console.warn(`Topic không tồn tại: ${topic}`);
        }
    } catch (error) {
        console.error(`Lỗi khi hủy đăng ký topic ${topic}:`, error);
    }
};

// ✅ Lấy STOMP client hiện tại
export const getStompClient = () => stompClient;
