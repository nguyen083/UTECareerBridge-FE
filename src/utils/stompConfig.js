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

    // Lấy token từ localStorage
    const accessToken = localStorage.getItem('accessToken');
    
    // Kiểm tra token có tồn tại không
    if (!accessToken) {
        console.error('Không tìm thấy access token. Không thể kết nối WebSocket.');
        if (onError) onError(new Error('Không tìm thấy access token'));
        return null;
    }

    console.log('Kết nối WebSocket với token:', accessToken.substring(0, 10) + '...');

    // Tạo instance mới của SockJS với endpoint /ws
    const socket = new SockJS('/ws');

    stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
            'Authorization': 'Bearer ' + accessToken
        },
        debug: (str) => {
            if (str.includes('Connect headers')) {
                console.log('STOMP connect headers sent:', str);
            }
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: () => {
            console.log('WebSocket đã kết nối thành công.');
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
            console.log('WebSocket đã đóng kết nối.');
            isConnected = false;
        }
    });

    // Kiểm tra và log trực tiếp headers trước khi kết nối
    if (stompClient._connectHeaders) {
        console.log('Client connect headers trước khi activate:', stompClient._connectHeaders);
    }

    // Kích hoạt kết nối
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

// ✅ Tái kết nối WebSocket với token mới
export const reconnectWithNewToken = () => {
    // Ngắt kết nối cũ
    if (stompClient) {
        try {
            stompClient.deactivate();
        } catch (error) {
            console.error('Lỗi khi đóng kết nối WebSocket cũ:', error);
        }
    }
    
    // Reset trạng thái
    stompClient = null;
    isConnected = false;
    
    // Kết nối lại
    return connectStomp();
};
