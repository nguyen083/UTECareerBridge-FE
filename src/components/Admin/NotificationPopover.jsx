import React, { useState, useEffect, useCallback } from 'react';
import { Badge, Popover, List, Typography, Button, Space, Tag, Spin, notification } from 'antd';
import { BellOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { initializeNotifications, setupMessageListener, markAllNotificationsAsRead, markNotificationAsRead } from '../../services/firebaseService';
import { getAllNotificationById, getToken } from '../../services/apiService';
import { setNotificationCount } from '../../redux/action/notificationSlice'; 

const { Text, Paragraph } = Typography;

const NotificationPopover = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth?.user?.id) || 1;
  const notificationCount = useSelector(state => state.notification?.unread || 0);

  const notificationSound = new Audio('/sounds/notification.mp3');

  // Fetch initial notification count
  useEffect(() => {
    const fetchInitialNotificationCount = async () => {
      if (!userId) return;

      try {
        getToken();
        const response = await getAllNotificationById(userId);
        const unreadCount = response.filter(n => !n.isRead).length;
        dispatch(setNotificationCount(unreadCount));

      } catch (error) {
        console.error('Error fetching initial notification count:', error);
      }
    };

    fetchInitialNotificationCount();
  }, [userId, dispatch]);

  const playNotificationSound = useCallback(() => {
    try {
      notificationSound.currentTime = 0;
      notificationSound.play().catch(console.error);
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }, []);

  const handleNewMessage = useCallback((payload) => {
    playNotificationSound();
    
    const newNotification = {
      id: Date.now(),
      title: payload.notification.title,
      content: payload.notification.body,
      notificationDate: new Date().toISOString(),
      isRead: false,
      url: payload.data?.url
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    dispatch(setNotificationCount(notificationCount + 1)); 

    
    notification.info({
      message: payload.notification.title,
      description: payload.notification.body,
      placement: 'topRight',
      duration: 4,
      onClick: () => {
        if (payload.data?.url) {
          window.open(payload.data.url, '_blank');
        }
      }
    });
  }, [dispatch, notificationCount, playNotificationSound]);

  // Initialize Firebase notifications
  useEffect(() => {
    let messageUnsubscribe;

    const setupNotifications = async () => {
      if (!userId || isInitialized) return;

      try {
        await initializeNotifications(userId);
        messageUnsubscribe = setupMessageListener(handleNewMessage);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error setting up notifications:', error);
        notification.error({
          message: 'Lỗi Thông Báo',
          description: 'Không thể khởi tạo thông báo. Vui lòng thử lại.',
        });
      }
    };

    setupNotifications();

    return () => {
      if (messageUnsubscribe) {
        messageUnsubscribe();
      }
    };
  }, [userId, isInitialized, handleNewMessage]);

  // Fetch notifications when popover opens
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!open || !userId) return;

      try {
        getToken();
        setLoading(true);
        const response = await getAllNotificationById(userId);
        setNotifications(response);
        
        const unreadCount = response.filter(n => !n.isRead).length;
        dispatch(setNotificationCount(unreadCount));

      } catch (error) {
        console.error('Error fetching notifications:', error);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải thông báo. Vui lòng thử lại.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [open, userId, dispatch]);

  const handleReadNotification = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );

      const newUnreadCount = notifications.filter(n => !n.isRead && n.id !== notificationId).length;
      dispatch(setNotificationCount(newUnreadCount)); 

    } catch (error) {
      console.error('Error marking notification as read:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể đánh dấu đã đọc. Vui lòng thử lại.',
      });
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead(userId);
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      dispatch(setNotificationCount(0));
    } catch (error) {
      console.error('Error marking all as read:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể đánh dấu tất cả đã đọc. Vui lòng thử lại.',
      });
    }
  };

  const notificationContent = (
    <div className="w-80 max-w-sm">
      <div className="flex justify-between items-center mb-4 px-4 pt-2">
        <Text strong>Thông báo</Text>
        <Button 
          type="link" 
          onClick={handleMarkAllRead}
          disabled={!notifications.some(n => !n.isRead)}
          className="text-sm"
        >
          <Space>
            <CheckCircleOutlined />
            Đánh dấu đã đọc tất cả
          </Space>
        </Button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        <Spin spinning={loading}>
          <List
            dataSource={notifications}
            renderItem={notification => (
              <List.Item
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                onClick={() => {
                  handleReadNotification(notification.id);
                  if (notification.url) {
                    window.open(notification.url, '_blank');
                  }
                }}
              >
                <List.Item.Meta
                  title={
                    <Space className="w-full justify-between">
                      <Text strong>{notification.title}</Text>
                      {!notification.isRead && <Tag color="blue">Mới</Tag>}
                    </Space>
                  }
                  description={
                    <>
                      <Paragraph className="mb-1 text-gray-600">
                        {notification.content}
                      </Paragraph>
                      <Text className="text-xs text-gray-400">
                        {new Date(notification.notificationDate).toLocaleString('vi-VN')}
                      </Text>
                    </>
                  }
                />
              </List.Item>
            )}
            locale={{ emptyText: 'Không có thông báo mới' }}
          />
        </Spin>
      </div>
    </div>
  );

  return (
    <Popover
      content={notificationContent}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      arrow={false}
    >
      <Badge count={notificationCount} overflowCount={99}>
        <BellOutlined className="notification-icon text-lg cursor-pointer" />
      </Badge>
    </Popover>
  );
};

export default NotificationPopover;