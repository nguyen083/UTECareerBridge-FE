import { BellOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Flex,
  List,
  Popover,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useCallback, useEffect } from "react";
import COLOR from "../styles/_variables";
import "./Notification.scss";
import "../Generate/CustomizePopover.scss";
import { useNavigate } from "react-router-dom";
import {
  useNotification,
  useNotificationCount,
  useNotificationRead,
  useNotificationReadAll,
} from "../../composables/notification";
import { useTranslation } from "react-i18next";
import { connectStomp } from "../../utils/stompConfig";
import { useQueryClient } from "@tanstack/react-query";
import sound from "../../assets/sounds/notification.mp3";
import icon from "../../assets/bell-ringing.png";
import { Check } from "lucide-react";
import { clsx } from "clsx";
import { useSelector } from "react-redux";

const { Text } = Typography;
const ListNotification = ({ notification, userId }) => {
  const notificationMutation = useNotificationRead();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);

  const handleSeeMore = () => {
    if (user.role === "admin") {
      navigate("/admin/notification");
    } else if (user.role === "employer") {
      navigate("/employer/notification");
    } else {
      navigate("/notification");
    }
  };

  return (
    <List
      split={false}
      locale={{
        emptyText: !userId ? (
          <Flex vertical justify="center" align="center" gap={8}>
            <Typography.Text
              className="notification-login-text"
              type="secondary"
            >
              {t("notification.loginToSeeNotification")}
            </Typography.Text>
            <Button
              className="login-button-notification"
              type="primary"
              onClick={() => navigate("/login")}
            >
              {t("common.login")}
            </Button>
          </Flex>
        ) : (
          <Typography.Text type="secondary">
            {t("notification.noNewNotification")}
          </Typography.Text>
        ),
      }}
      className="notification-list min-w-[250px]"
      itemLayout="horizontal"
      dataSource={notification}
      renderItem={(item) => (
        <List.Item className="group !px-1">
          <List.Item.Meta
            title={
              <Flex justify="space-between">
                <Typography.Text
                  onClick={() =>
                    navigate(`/notification/${item.notificationId}`)
                  }
                  className={clsx(
                    "!text-base cursor-pointer group-hover:text-text-color-hover notification-title",
                    item.read === false && "!font-medium"
                  )}
                  ellipsis={{ tooltip: item.title }}
                >
                  {item.title}
                </Typography.Text>
                {item.read === false && (
                  <Tag className="!py-px text-xs" color="red">
                    {t("notification.new")}
                  </Tag>
                )}
              </Flex>
            }
            description={
              <>
                <Flex justify="space-between">
                  <Typography.Text type="secondary">
                    {new Date(item.notificationDate).toLocaleString("vi-VN")}
                  </Typography.Text>
                  <Tooltip
                    placement="topRight"
                    title={t("notification.markAsRead")}
                  >
                    <Check
                      className="invisible cursor-pointer group-hover:visible group-hover:text-text-color-hover"
                      size={16}
                      onClick={() =>
                        notificationMutation.mutate(item.notificationId)
                      }
                    />
                  </Tooltip>
                </Flex>
              </>
            }
          />
        </List.Item>
      )}
      footer={
        <Button
          variant="outlined"
          type="text"
          className="w-full"
          onClick={handleSeeMore}
        >
          {t("common.seeMore")}
        </Button>
      }
    />
  );
};

const NotificationIcon = ({ userId = null }) => {
  const { data: notificationCount, refetch: refetchNotificationCount } =
    useNotificationCount(userId);
  const { data: notificationList } = useNotification(userId);
  const markAllAsRead = useNotificationReadAll();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const playNotificationSound = () => {
    const audio = new Audio(sound);
    audio.play();
  };
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          return true;
        }
      });
    }

    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      if (audioContext.state === "suspended") {
        const resumeAudio = () => {
          audioContext.resume().then(() => {
            document.removeEventListener("click", resumeAudio);
          });
        };
        document.addEventListener("click", resumeAudio);
      }

      const oscillator = audioContext.createOscillator();
      oscillator.frequency.setValueAtTime(0, audioContext.currentTime);
      oscillator.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.001);
    } catch (e) {
      console.error("Không thể khởi tạo AudioContext:", e);
    }
  }, []);
  const sendNotification = (title) => {
    if (Notification.permission === "granted") {
      new Notification("New Notification", {
        body: title,
        icon: icon,
        silent: true,
      });
      playNotificationSound();
    } else if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          sendNotification();
        }
      });
    }
  };

  const onConnected = useCallback(
    (client) => {
      if (client && userId) {
        let subscription = null;
        subscription = client.subscribe(
          "/notifications/broadcast",
          (response) => {
            try {
              const messageData = JSON.parse(response.body);
              sendNotification(messageData.title);
              queryClient.setQueryData(["notificationCount", userId], (old) => {
                return { data: old.data + 1 };
              });
              queryClient.setQueryData(["notificationList", userId], (old) => {
                const newData = {
                  ...old,
                  data: {
                    ...old.data,
                    content: [messageData, ...old.data.content],
                  },
                };
                return newData;
              });

              queryClient.invalidateQueries({
                queryKey: ["notificationBroadcast"],
              });
            } catch (error) {
              console.error("Lỗi khi xử lý dữ liệu từ WebSocket:", error);
            }
          }
        );
        subscription = client.subscribe(
          "/user/" + userId + "/notifications/personal",
          (response) => {
            try {
              const messageData = JSON.parse(response.body);
              sendNotification(messageData.title);
              refetchNotificationCount();
              queryClient.setQueryData(["notificationList", userId], (old) => {
                const newData = {
                  ...old,
                  data: {
                    ...old.data,
                    content: [messageData, ...old.data.content],
                  },
                };
                return newData;
              });

              queryClient.invalidateQueries({
                queryKey: ["notificationPersonal", userId],
              });
            } catch (error) {
              console.error("Lỗi khi xử lý dữ liệu từ WebSocket:", error);
            }
          }
        );

        return subscription;
      }
      return null;
    },
    [userId, queryClient]
  );

  useEffect(() => {
    let subscription = null;

    connectStomp(
      (client) => {
        subscription = onConnected(client);
      },
      (error) => {
        console.error("Lỗi kết nối:", error);
      }
    );

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [onConnected]);

  return (
    <Popover
      overlayClassName="notification-popover"
      placement="bottomRight"
      title={
        <Flex justify="space-between" align="center">
          <Typography.Title
            className="!mb-0 notification-title-header leading-0"
            level={5}
          >
            {t("notification.title")}
          </Typography.Title>
          <Text
            className="text-sm font-medium cursor-pointer hover:text-text-color-hover hover:underline"
            type="text"
            onClick={() => markAllAsRead.mutate(userId)}
          >
            {t("notification.markAllAsRead")}
          </Text>
        </Flex>
      }
      content={
        <ListNotification notification={notificationList} userId={userId} />
      }
      trigger={["click"]}
    >
      <Tooltip
        title={t("notification.title")}
        placement="bottom"
        color={COLOR.bgTooltipColor}
      >
        <Badge count={notificationCount}>
          <Button
            className="rounded-full btn-header btn-bell"
            size="large"
            type="text"
          >
            <BellOutlined />
          </Button>
        </Badge>
      </Tooltip>
    </Popover>
  );
};

export default NotificationIcon;
