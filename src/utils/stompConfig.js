import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

export const connectStomp = (onConnected, onError) => {
    const client = new Client({
        // Sử dụng SockJS làm transport layer
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'), // Đường dẫn đến endpoint WebSocket của server

        // Hoặc sử dụng WebSocket trực tiếp nếu không cần SockJS
        // brokerURL: 'ws://localhost:8080/ws',

        connectHeaders: {
            // Thêm headers nếu cần thiết, ví dụ để xác thực
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        },
        debug: function (str) {
            console.log(str);
        },
        reconnectDelay: 5000, // Thời gian chờ kết nối lại (ms)
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: (frame) => {
            console.log('Kết nối thành công:', frame);
            if (onConnected) onConnected(client);
        },

        onStompError: (frame) => {
            console.error('Lỗi STOMP:', frame);
            if (onError) onError(frame);
        },

        onWebSocketClose: () => {
            console.log('WebSocket đã đóng kết nối');
        }
    });

    client.activate();
    stompClient = client;
    return client;
};

export const disconnectStomp = () => {
    if (stompClient) {
        stompClient.deactivate();
        console.log('Đã ngắt kết nối STOMP');
    }
};

export const getStompClient = () => stompClient;