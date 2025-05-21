import { useState, useEffect, useCallback } from "react";
import {
  Badge,
  Popover,
  List,
  Typography,
  Button,
  Space,
  Tag,
  Spin,
  notification,
  Empty,
  Divider,
  Avatar,
} from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InfoCircleFilled,
  WarningFilled,
  CheckCircleFilled,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  initializeNotifications,
  setupMessageListener,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/firebaseService";
import { getAllNotificationById } from "../../services/apiService";
import { setNotificationCount } from "../../redux/action/notificationSlice";

const { Text, Paragraph } = Typography;

const NotificationPopover = ({ children, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const dispatch = useDispatch();
  const authenticatedUserId = useSelector((state) => state.auth?.user?.id);
  const actualUserId = userId || authenticatedUserId || 1;
  const notificationCount = useSelector(
    (state) => state.notification?.unread || 0
  );

  const notificationSound = new Audio("/assets/sounds/notification.mp3");

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "warning":
        return <WarningFilled style={{ color: "#faad14" }} />;
      case "success":
        return <CheckCircleFilled style={{ color: "#52c41a" }} />;
      case "error":
        return <ExclamationCircleFilled style={{ color: "#ff4d4f" }} />;
      case "info":
      default:
        return <InfoCircleFilled style={{ color: "#1890ff" }} />;
    }
  };

  useEffect(() => {
    const fetchInitialNotificationCount = async () => {
      if (!actualUserId) return;

      try {
        const response = await getAllNotificationById(actualUserId);
        const unreadCount = response.filter((n) => !n.isRead).length;
        dispatch(setNotificationCount(unreadCount));
      } catch (error) {
        console.error("Error fetching initial notification count:", error);
      }
    };

    fetchInitialNotificationCount();
  }, [actualUserId, dispatch]);

  const playNotificationSound = useCallback(() => {
    try {
      notificationSound.currentTime = 0;
      notificationSound.play().catch(console.error);
    } catch (error) {
      console.error("Error playing notification sound:", error);
    }
  }, []);

  const handleNewMessage = useCallback(
    (payload) => {
      playNotificationSound();

      const newNotification = {
        id: Date.now(),
        title: payload.notification.title,
        content: payload.notification.body,
        notificationDate: new Date().toISOString(),
        isRead: false,
        url: payload.data?.url,
        type: payload.data?.type || "info",
      };

      setNotifications((prev) => [newNotification, ...prev]);

      dispatch(setNotificationCount(notificationCount + 1));

      notification.info({
        message: payload.notification.title,
        description: payload.notification.body,
        placement: "topRight",
        duration: 4,
        icon: getNotificationIcon(payload.data?.type),
        onClick: () => {
          if (payload.data?.url) {
            window.open(payload.data.url, "_blank");
          }
        },
      });
    },
    [dispatch, notificationCount, playNotificationSound]
  );

  useEffect(() => {
    let messageUnsubscribe;

    const setupNotifications = async () => {
      if (!actualUserId || isInitialized) return;

      try {
        await initializeNotifications(actualUserId);
        messageUnsubscribe = setupMessageListener(handleNewMessage);
        setIsInitialized(true);
      } catch (error) {
        console.error("Error setting up notifications:", error);
        notification.error({
          message: "Lỗi Thông Báo",
          description: "Không thể khởi tạo thông báo. Vui lòng thử lại.",
        });
      }
    };

    setupNotifications();

    return () => {
      if (messageUnsubscribe) {
        messageUnsubscribe();
      }
    };
  }, [actualUserId, isInitialized, handleNewMessage]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!open || !actualUserId) return;

      try {
        setLoading(true);
        const response = await getAllNotificationById(actualUserId);
        setNotifications(response);

        const unreadCount = response.filter((n) => !n.isRead).length;
        dispatch(setNotificationCount(unreadCount));
      } catch (error) {
        console.error("Error fetching notifications:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải thông báo. Vui lòng thử lại.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [open, actualUserId, dispatch]);

  const handleReadNotification = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );

      const newUnreadCount = notifications.filter(
        (n) => !n.isRead && n.id !== notificationId
      ).length;
      dispatch(setNotificationCount(newUnreadCount));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể đánh dấu đã đọc. Vui lòng thử lại.",
      });
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead(actualUserId);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      dispatch(setNotificationCount(0));
    } catch (error) {
      console.error("Error marking all as read:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể đánh dấu tất cả đã đọc. Vui lòng thử lại.",
      });
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "Vài giây trước";
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} phút trước`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const notificationContent = (
    <div className="notification-popover-content">
      <div className="notification-header">
        <Text strong style={{ fontSize: "16px" }}>
          Thông báo
        </Text>
        <Button
          type="text"
          onClick={handleMarkAllRead}
          disabled={!notifications.some((n) => !n.isRead)}
          className="mark-read-btn"
        >
          <Space>
            <CheckCircleOutlined />
            Đánh dấu tất cả đã đọc
          </Space>
        </Button>
      </div>

      <Divider style={{ margin: "8px 0" }} />

      <div className="notification-list-container">
        <Spin spinning={loading}>
          {notifications.length > 0 ? (
            <List
              dataSource={notifications}
              renderItem={(notification) => (
                <List.Item
                  className={`notification-item ${
                    !notification.isRead ? "unread" : ""
                  }`}
                  onClick={() => {
                    handleReadNotification(notification.id);
                    if (notification.url) {
                      window.open(notification.url, "_blank");
                    }
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={getNotificationIcon(notification.type)}
                        className={`notification-avatar ${
                          notification.type || "info"
                        }`}
                      />
                    }
                    title={
                      <Space className="notification-title">
                        <Text strong>{notification.title}</Text>
                        {!notification.isRead && (
                          <Tag color="blue" className="notification-badge">
                            Mới
                          </Tag>
                        )}
                      </Space>
                    }
                    description={
                      <div className="notification-description">
                        <Paragraph className="notification-content">
                          {notification.content}
                        </Paragraph>
                        <div className="notification-time">
                          <ClockCircleOutlined
                            style={{ fontSize: "12px", marginRight: "4px" }}
                          />
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {formatTimeAgo(notification.notificationDate)}
                          </Text>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có thông báo mới"
              style={{ padding: "24px 0" }}
            />
          )}
        </Spin>
      </div>

      <Divider style={{ margin: "8px 0" }} />

      <div className="notification-footer">
        <Button type="link" className="view-all-btn">
          Xem tất cả thông báo
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      destroyTooltipOnHide={true}
      content={notificationContent}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      overlayClassName="admin-notification-popover"
      arrow={{ pointAtCenter: true }}
    >
      {children ? (
        children
      ) : (
        <Badge count={notificationCount} overflowCount={99}>
          <BellOutlined className="text-lg cursor-pointer notification-icon" />
        </Badge>
      )}
    </Popover>
  );
};

export default NotificationPopover;
