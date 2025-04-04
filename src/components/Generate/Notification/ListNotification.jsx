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
    const id = useSelector(state => state.user.userId);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState(0);
    const { t } = useTranslation();
    const navigate = useNavigate();
    
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
          width: '10%',
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
            let subscription = null;
            
            if (type === "system") {
                subscription = client.subscribe('/notifications/broadcast', (response) => { 
                    try {
                        const messageData = JSON.parse(response.body);
                        setNotifications((prevNotifications) => [messageData, ...prevNotifications]);
                        setTotal(prevTotal => prevTotal + 1);
                    } catch (error) {
                        console.error('Lỗi khi xử lý dữ liệu từ WebSocket:', error);
                    }
                });
            } else {
                subscription = client.subscribe('/user/' + id + '/notifications/personal', (response) => { 
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

            return subscription;
        }
        return null;
    }, [id, type]);

    useEffect(() => {
        getNotification();
    }, [getNotification]);
    
    useEffect(() => {
        let subscription = null;
        
        connectStomp((client) => {
            subscription = onConnected(client);
        }, (error) => {
            console.error('Lỗi kết nối:', error);
        });
        
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
            disconnectStomp();
        };
    }, [onConnected]);
    
    return (
        <Table
            columns={columns} 
            dataSource={notifications} 
            loading={loading} 
            rowKey="id"
            rowClassName={(record, index) => index % 2 === 0 ? '' : 'bg-gray-50'}
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
