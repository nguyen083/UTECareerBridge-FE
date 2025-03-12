import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;


export const connectStomp = (onConnected, onError) => {
    const client = new Client({
        // Sử dụng SockJS làm transport layer
        webSocketFactory: () => new SockJS('/ws'), // Đường dẫn đến endpoint WebSocket của server

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
            if (onConnected) onConnected(client);
        },

        onStompError: (frame) => {
            if (onError) onError(frame);
        },

        onWebSocketClose: () => {
        }
    });

    client.activate();
    stompClient = client;
    return client;
};

export const disconnectStomp = () => {
    if (stompClient) {
        stompClient.deactivate();
    }
};

export const getStompClient = () => stompClient;