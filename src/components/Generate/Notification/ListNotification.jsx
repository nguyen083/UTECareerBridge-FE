import { Table, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import notification from "../../../services/api/notification";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { connectStomp, disconnectStomp } from "../../../utils/stompConfig";
const { Text } = Typography;

const ListNotification = ({ type = "system" }) => {
    const [notifications, setNotifications] = useState([]);
    // const [stompClient, setStompClient] = useState(null);
    const id = useSelector(state => state.user.userId);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState(0);
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    // Reset trang khi loại thông báo thay đổi
    useEffect(() => {
        setPage(1);
    }, [type]);
    
    const columns = [
        {
          title: t('notification.table.title'),
          dataIndex: 'title',
          key: 'title',
          ellipsis: true,
          width: '80%',
          render: text => <Text className="cursor-pointer hover:underline hover:text-text-color-hover" onClick={() => {
            navigate(`/notification/${id}`);
          }}>{text}</Text>,
        },
        {
          title: t('notification.table.time'),
          dataIndex: 'notificationDate',
          key: 'notificationDate',
          width: '20%',
          render: text => <p className="text-sm text-gray-500">{new Date(text).toLocaleString()}</p>,
        },
    ]

    const getNotification = useCallback(async () => {
        if (type === "system") {
            try {
                setLoading(true);
                const response = await notification.getNotificationBroadcast({page: page-1, size});
                setNotifications(response.data.content);
                setTotal(response.data.totalElements);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        } else {
            try {
                setLoading(true);
                const response = await notification.getNotificationPersonal(id, {page: page-1, size});
                setNotifications(response.data.content);
                setTotal(response.data.totalElements);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    }, [id, page, size, type]);

    const onConnected = useCallback((client) => {
        if (client) {
            // Đăng ký kênh nhận thông báo broadcast
            client.subscribe('/notifications/broadcast', (response) => { 
                try {
                    const messageData = JSON.parse(response.body);
                    console.log('Broadcast notification received:', messageData);
                    setNotifications((prevNotifications) => [messageData, ...prevNotifications]);
                    setTotal(prevTotal => prevTotal + 1);
                } catch (error) {
                    console.error('Lỗi khi xử lý dữ liệu từ WebSocket:', error);
                }
            });
            
            client.subscribe('/user/' + id + '/notifications/personal', (response) => { 
                try {
                    const messageData = JSON.parse(response.body);
                    console.log('Personal notification received:', messageData);
                    
                    setNotifications((prevNotifications) => [messageData, ...prevNotifications]);
                    setTotal(prevTotal => prevTotal + 1);
                } catch (error) {
                    console.error('Lỗi khi xử lý dữ liệu từ WebSocket:', error);
                }
            });
        }
    }, [id, getNotification]);

    // Gọi API khi component mount hoặc khi các dependency thay đổi
    useEffect(() => {
        getNotification();
    }, [getNotification]);
    
    // Thiết lập kết nối WebSocket
    useEffect(() => {
        connectStomp(onConnected, (error) => {
            console.error('Lỗi kết nối:', error);
        });
        
        return () => {
            disconnectStomp();
        };
    }, [onConnected]);
    
    return (
        <Table
            columns={columns} 
            dataSource={notifications} 
            loading={loading} 
            rowKey="id"
            pagination={{ 
                current: page, 
                pageSize: size, 
                total,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
                showSizeChanger: true, 
                onChange: (page, pageSize) => {
                    setPage(page);
                    setSize(pageSize);
                },
                pageSizeOptions: ['5', '10', '15', '20'],
            }} 
        />
    )
}

export default ListNotification;
